// https://gist.github.com/fieldOfView/5106319
// https://gamedev.stackexchange.com/questions/93032/what-causes-this-distortion-in-my-perspective-projection-at-steep-view-angles
// for reference

void main()	{
  // z towards you, y towards up, x towards your left
  float uvfov = tan(fov / 2.0 * DEG_TO_RAD);
  vec2 uv = square_frame(resolution); 

  uv *= vec2(resolution.x/resolution.y, 1.0);
  vec3 forward = normalize(cam_dir); // 
  vec3 up = normalize(cam_up);
  vec3 nright = normalize(cross(forward, up));
  up = cross(nright, forward);
  // generate ray
  vec3 pixel_pos = cam_pos + forward + nright*uv.x*uvfov+ up*uv.y*uvfov;
  
  vec3 ray_dir = normalize(pixel_pos - cam_pos);

  // light aberration alters ray path 
  if (lorentz_transform)
    ray_dir = lorentz_transform_velocity(ray_dir, cam_vel);

  // initial color
  vec4 color = vec4(0.0,0.0,0.0,1.0);

  // geodesic by leapfrog integration
  vec3 point = cam_pos;
  vec3 velocity = ray_dir;
  vec3 c = cross(point,velocity);
  float h2 = dot(c,c);

  // for doppler effect
  float ray_gamma = 1.0/sqrt(1.0-dot(cam_vel,cam_vel));
  float ray_doppler_factor = ray_gamma * (1.0 + dot(ray_dir, -cam_vel));
    
  float ray_intensity = 1.0;
  if (beaming) ray_intensity /= pow(ray_doppler_factor , 3.0);
  
  vec3 oldpoint; 
  float pointsqr;
  
  float distance = length(point);

  // Jet parameters based on black_hole_rotation
  float jet_intensity = black_hole_rotation * 1.5 * ROTATION_SCALE_DOWN;
  float jet_radius = 0.1 + 0.16 * black_hole_rotation * ROTATION_SCALE_DOWN;
  float jet_length = 3.0 + 8.0 * black_hole_rotation * ROTATION_SCALE_DOWN;

  // Leapfrog geodesic
  for (int i=0; i<NSTEPS;i++){ 
    oldpoint = point; // remember previous point for finding intersection
    point += velocity * STEP;
    
    // Calculate acceleration based on black hole rotation
    vec3 accel = calculateAcceleration(point, velocity, h2);
    velocity += accel * STEP;    
    
    // distance from origin
    distance = length(point);
    if (distance < 0.0) break;
    
    bool horizon_mask = distance < 1.0 && length(oldpoint) > 1.0;// intersecting eventhorizon
    // does it enter event horizon?
    if (horizon_mask) {
      vec4 black = vec4(0.0,0.0,0.0,1.0);
      color += black;
      break;
    }

    // --- Relativistic Jet ---
    if (jet_enabled && black_hole_rotation > 0.1) {
      float a = black_hole_rotation * ROTATION_SCALE_DOWN;
      float r_plus = 1.0 + sqrt(1.0 - a * a);
      float base_radius = 0.05; // base radius at the pole
      float cone_angle = 0.08; // controls the opening angle of the cone
      // North pole jet
      float north_dist = length(vec2(point.x, point.z));
      float north_y = point.y - r_plus;
      float north_jet_radius = base_radius + cone_angle * max(north_y, 0.0);
      // South pole jet
      float south_dist = length(vec2(point.x, point.z));
      float south_y = point.y + r_plus;
      float south_jet_radius = base_radius + cone_angle * max(-south_y, 0.0);
      bool in_north_jet = (north_dist < north_jet_radius) && (north_y > 0.0) && (north_y < jet_length);
      bool in_south_jet = (south_dist < south_jet_radius) && (south_y < 0.0) && (-south_y < jet_length);
      if (in_north_jet || in_south_jet) {
          float t = in_north_jet ? (north_y / jet_length) : (-south_y / jet_length);
          float core = 1.1 - smoothstep(0.0, north_jet_radius * 0.5, in_north_jet ? north_dist : south_dist); // bright core
          float edge = 1.0 - smoothstep(north_jet_radius * 0.8, north_jet_radius, in_north_jet ? north_dist : south_dist); // soft edge
          vec3 jet_color = mix(vec3(0.3, 0.7, 1.0), vec3(1.0, 1.0, 1.0), t); // blue to white
          jet_color = mix(jet_color, vec3(1.0, 0.7, 0.5), pow(t, 2.0)); // white to orange/red at tip
          float intensity = jet_intensity * core * (1.0 - t) + jet_intensity * 0.3 * edge * t;
          float fade = 1.0 - smoothstep(0.85, 1.0, t); // fade out at the tip
          color.rgb += jet_color * intensity * fade;
      }
    }
    // --- End Jet ---
    
    // Check if the disk should be rendered
    if (accretion_disk) {
      if (oldpoint.y * point.y < 0.0){
        // move along y axis
        float lambda = - oldpoint.y/velocity.y;
        vec3 intersection = oldpoint + lambda * velocity;
        float r = length(intersection);//dot(intersection,intersection);
        if (DISK_IN <= r&&r <= DISK_IN+DISK_WIDTH ){
          float phi = atan(intersection.x, intersection.z);
          
          // Calculate disk velocity with frame dragging for rotating black hole
          vec3 disk_velocity = vec3(-intersection.x, 0.0, intersection.z)/sqrt(2.0*(r-1.0))/(r*r);
          if (black_hole_rotation > 0.0) {
            float a = black_hole_rotation * ROTATION_SCALE_DOWN;
            vec2 kerr_effects = calculateKerrEffects(intersection, a);
            float omega = kerr_effects.x;
            disk_velocity += cross(vec3(0.0, 1.0, 0.0), intersection) * omega * 0.8;
          }
          
          phi -= time;
          phi = mod(phi , PI*2.0);
          float disk_gamma = 1.0 / sqrt(1.0 - dot(disk_velocity, disk_velocity));
          
          // Calculate the Doppler factor relative to the viewer's perspective
          float disk_doppler_factor = disk_gamma * (1.0 + dot(ray_dir, disk_velocity));
          
          if (use_disk_texture){
            // texture
            vec2 tex_coord = vec2(mod(phi, 2.0 * PI) / (2.0 * PI), 1.0 - (r - DISK_IN) / (DISK_WIDTH));
            vec4 disk_color = texture2D(disk_texture, tex_coord);
            
            // Apply Doppler shift to the color
            if (doppler_shift) {
              // Calculate the direction from the camera to the intersection point
              vec3 view_dir = normalize(intersection - cam_pos);
              
              // Calculate the camera's right vector (perpendicular to view direction)
              vec3 camera_right = normalize(cross(cam_dir, cam_up));
              
              // Determine if we're looking at the left or right side of the disk
              float side_factor = dot(view_dir, camera_right);
              
              // Calculate how perpendicular our view is to the disk plane
              float disk_angle_factor = abs(dot(view_dir, vec3(0.0, 1.0, 0.0)));
              
              float angle_threshold = 0.4648; // angle to start showing the doppler shift
              float angle_blend_smootness = angle_threshold * 0.30; // smooth the effect over the disk texture
              float angle_blend = smoothstep(angle_threshold, angle_blend_smootness, disk_angle_factor);
              
              if (disk_angle_factor < angle_threshold) {
                // Invert the side factor to put blue shift on the left
                float smooth_side = 1.0 - smoothstep(-0.8, 0.8, side_factor);  // Wider transition
                
                // Calculate shift with smoother transition
                float shift = (smooth_side - 0.5) * 1.0;
                shift *= smoothstep(0.0, 0.4, abs(shift)) * angle_blend;  // Smoother center transition
                
                // Apply color shifts (blue on left, red on right)
                disk_color.r *= 1.0 + max(-shift, 0.0) * 1.6;  // Reduced red intensity
                disk_color.b *= 1.0 + max(shift, 0.0) * 2.4;   // Reduced blue intensity
                
                // Smooth intensity transition
                float positive_shift_mix_factor = 0.75;
                float negative_shift_mix_factor = 0.75;
                if (beaming) {
                  positive_shift_mix_factor = 1.85;
                  negative_shift_mix_factor = -0.75;
                }
                float intensity = shift > 0.0 
                  ? mix(1.0, positive_shift_mix_factor, shift)
                  : mix(1.0, negative_shift_mix_factor, -shift);  // Reduced intensity range
                disk_color.rgb *= intensity;
              }
            }
            
            disk_color /= (ray_doppler_factor * disk_doppler_factor);
            float disk_alpha = clamp(dot(disk_color, disk_color) / 4.5, 0.0, 1.0);

            if (beaming) disk_alpha /= pow(disk_doppler_factor, 3.0);
            
            // Apply glow to disk color
            vec3 glowing_color = applyGlow(disk_color.rgb * disk_intensity, glow_intensity);
            color += vec4(glowing_color, disk_alpha);
          } else {
            // use blackbody 
            float disk_temperature = 10000.0 * (pow(r / DISK_IN, -3.0 / 4.0));
            
            // Apply Doppler shift to temperature
            if (doppler_shift) {
              float doppler_factor = disk_doppler_factor;
              if (doppler_factor < 1.0) {
                // Red shift - increase temperature for receding material
                disk_temperature *= 1.0 + (1.0 - doppler_factor) * 2.0;  // Doubled the effect
              } else {
                // Blue shift - decrease temperature for approaching material
                disk_temperature /= doppler_factor * 1.5;  // Increased the effect by 50%
              }
            }

            vec3 disk_color = temp_to_color(disk_temperature);
            float disk_alpha = clamp(dot(disk_color, disk_color) / 3.0, 0.0, 1.0);
            
            if (beaming) disk_alpha /= pow(disk_doppler_factor, 3.0);
              
            // Apply glow to disk color
            vec3 glowing_color = applyGlow(disk_color * disk_intensity, glow_intensity);
            color += vec4(glowing_color, disk_alpha);
          }
        }
      }
    }
  }
  
  if (distance > 1.0) {
    ray_dir = normalize(point - oldpoint);
    color += applyStarsAndBackground(ray_dir, ray_doppler_factor);
  }
  gl_FragColor = color * ray_intensity;
} 