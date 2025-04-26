// https://gist.github.com/fieldOfView/5106319
// https://gamedev.stackexchange.com/questions/93032/what-causes-this-distortion-in-my-perspective-projection-at-steep-view-angles
// for reference

// Helper function for Kerr metric calculations
vec2 calculateKerrEffects(vec3 pos, float a) {
    float r = length(pos);
    float r2 = r * r;
    float a2 = a * a;
    float cos_theta = pos.y / r;
    float sin_theta = sqrt(1.0 - cos_theta * cos_theta);
    float rho2 = r2 + a2 * cos_theta * cos_theta;
    
    // Return omega and radial correction factor
    float omega = -2.0 * a * r / (rho2 * (rho2 + 2.0 * r));
    float radial_factor = 1.0 + a2 * cos_theta * cos_theta / (r2 * r2);
    return vec2(omega, radial_factor);
}

// Calculate acceleration based on black hole rotation
vec3 calculateAcceleration(vec3 pos, vec3 vel, float h2) {
    float r = length(pos);
    float r2 = r * r;
    
    // Use original Schwarzschild model when not rotating
    if (black_hole_rotation == 0.0) {
        return -1.5 * h2 * pos / (r2 * r2 * sqrt(r2));
    }
    
    // Kerr model for rotating black hole
    float a = black_hole_rotation * 0.2;  // Scale down rotation effect
    vec2 kerr_effects = calculateKerrEffects(pos, a);
    float omega = kerr_effects.x;
    float radial_factor = kerr_effects.y;
    
    // Radial acceleration with Kerr corrections
    vec3 accel = -1.5 * h2 * pos / (r2 * r2 * sqrt(r2));
    accel *= radial_factor;
    
    // Add frame dragging acceleration
    vec3 phi_dir = vec3(-pos.x, 0.0, -pos.z);
    float phi_dot = length(phi_dir) > 0.0 ? dot(vel, phi_dir) / length(phi_dir) : 0.0;
    accel += cross(vec3(0.0, 1.0, 0.0), pos) * omega * phi_dot * 0.5;
    
    return accel;
}

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
  vec3 pixel_pos = cam_pos + forward +
                 nright*uv.x*uvfov+ up*uv.y*uvfov;
  
  vec3 ray_dir = normalize(pixel_pos - cam_pos); // 

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
  if (beaming)
    ray_intensity /= pow(ray_doppler_factor , 3.0);
  
  vec3 oldpoint; 
  float pointsqr;
  
  float distance = length(point);

  // Jet parameters based on black_hole_rotation
  float jet_intensity = black_hole_rotation * 2.0;
  float jet_radius = 0.1 + 0.15 * black_hole_rotation;
  float jet_length = 3.0 + 8.0 * black_hole_rotation;

  // Leapfrog geodesic
  for (int i=0; i<NSTEPS;i++){ 
    oldpoint = point; // remember previous point for finding intersection
    point += velocity * STEP;
    
    // Calculate acceleration based on black hole rotation
    vec3 accel = calculateAcceleration(point, velocity, h2);
    velocity += accel * STEP;    
    
    // distance from origin
    distance = length(point);
    if ( distance < 0.0) break;
    
    bool horizon_mask = distance < 1.0 && length(oldpoint) > 1.0;// intersecting eventhorizon
    // does it enter event horizon?
    if (horizon_mask) {
      vec4 black = vec4(0.0,0.0,0.0,1.0);
      color += black;
      break;
    }

    // --- Relativistic Jet ---
    if (jet_enabled && black_hole_rotation > 0.1) {
      float jet_r = length(point.xz);
      float jet_y = abs(point.y);
      float local_radius = jet_radius * mix(0.7, 1.2, jet_y / jet_length);
      if (jet_y < jet_length && jet_r < local_radius && length(point) > 1.0) {
          float core = 1.0 - smoothstep(0.0, local_radius * 0.5, jet_r); // bright core
          float edge = 1.0 - smoothstep(local_radius * 0.7, local_radius, jet_r); // soft edge
          float t = jet_y / jet_length;
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
        vec3 intersection = oldpoint + lambda*velocity;
        float r = length(intersection);//dot(intersection,intersection);
        if (DISK_IN <= r&&r <= DISK_IN+DISK_WIDTH ){
          float phi = atan(intersection.x, intersection.z);
          
          // Calculate disk velocity with frame dragging for rotating black hole
          vec3 disk_velocity = vec3(-intersection.x, 0.0, intersection.z)/sqrt(2.0*(r-1.0))/(r*r);
          if (black_hole_rotation > 0.0) {
            float a = black_hole_rotation * 0.1;
            vec2 kerr_effects = calculateKerrEffects(intersection, a);
            float omega = kerr_effects.x;
            disk_velocity += cross(vec3(0.0, 1.0, 0.0), intersection) * omega * 0.8;
          }
          
          phi -= time;//length(r);
          phi = mod(phi , PI*2.0);
          float disk_gamma = 1.0/sqrt(1.0-dot(disk_velocity, disk_velocity));
          
          // Calculate the Doppler factor relative to the viewer's perspective
          float disk_doppler_factor = disk_gamma*(1.0+dot(ray_dir, disk_velocity)); 
          
          if (use_disk_texture){
            // texture
            vec2 tex_coord = vec2(mod(phi,2.0*PI)/(2.0*PI),1.0-(r-DISK_IN)/(DISK_WIDTH));
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
              
              float angle_threshold = 0.2618;  // 15 degrees in radians
              float angle_blend = smoothstep(angle_threshold, angle_threshold * 0.8, disk_angle_factor);
              
              if (disk_angle_factor < angle_threshold) {
                // Invert the side factor to put blue shift on the left
                float smooth_side = 1.0 - smoothstep(-0.8, 0.8, side_factor);  // Wider transition
                
                // Calculate shift with smoother transition
                float shift = (smooth_side - 0.5) * 2.0;
                shift *= smoothstep(0.0, 0.4, abs(shift)) * angle_blend;  // Smoother center transition
                
                // Apply color shifts (blue on left, red on right)
                disk_color.r *= 1.0 + max(-shift, 0.0) * 1.6;  // Reduced red intensity
                disk_color.b *= 1.0 + max(shift, 0.0) * 2.4;   // Reduced blue intensity
                
                // Smooth intensity transition
                float intensity = shift > 0.0 ? mix(1.0, 1.7, shift) : mix(1.0, 0.6, -shift);  // Reduced intensity range
                disk_color.rgb *= intensity;
              }
            }
            
            disk_color /= (ray_doppler_factor * disk_doppler_factor);
            float disk_alpha = clamp(dot(disk_color,disk_color)/4.5,0.0,1.0);

            if (beaming)
              disk_alpha /= pow(disk_doppler_factor,3.0);
            
            // Apply glow to disk color
            vec3 glowing_color = applyGlow(disk_color.rgb * disk_intensity, glow_intensity);
            color += vec4(glowing_color, disk_alpha);
          } else {
            // use blackbody 
            float disk_temperature = 10000.0*(pow(r/DISK_IN, -3.0/4.0));
            
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
            float disk_alpha = clamp(dot(disk_color,disk_color)/3.0,0.0,1.0);
            
            if (beaming)
              disk_alpha /= pow(disk_doppler_factor,3.0);
              
            // Apply glow to disk color
            vec3 glowing_color = applyGlow(disk_color * disk_intensity, glow_intensity);
            color += vec4(glowing_color, disk_alpha);
          }
        }
      }
    }
  }
  
  if (distance > 1.0){
    ray_dir = normalize(point - oldpoint);
    vec2 tex_coord = to_spherical(ray_dir * ROT_Z(45.0 * DEG_TO_RAD));
    // taken from source
    // red = temp
    // green = lum
    // blue = vel 
    vec4 star_color = texture2D(star_texture, tex_coord);
    if (show_stars && star_color.g > 0.0){
      float star_temperature = (MIN_TEMPERATURE + TEMPERATURE_RANGE*star_color.r);
      // arbitrarily sets background stars' velocity for random shifts
      float star_velocity = star_color.b - 0.5;
      float star_doppler_factor = sqrt((1.0+star_velocity)/(1.0-star_velocity));
      if (doppler_shift)
        star_temperature /= ray_doppler_factor*star_doppler_factor;
      
      color += vec4(temp_to_color(star_temperature),1.0)* star_color.g;
    }

    // Apply the background texture with increased intensity
    float bg_strength = bg_intensity > 0.0 ? bg_intensity : DEFAULT_BG_INTENSITY;
    color += texture2D(bg_texture, tex_coord) * bg_strength;
  }
  gl_FragColor = color*ray_intensity;
} 