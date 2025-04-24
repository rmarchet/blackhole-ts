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

  // Leapfrog geodesic
  for (int i=0; i<NSTEPS;i++){ 
    oldpoint = point; // remember previous point for finding intersection
    point += velocity * STEP;
    
    // Optimized acceleration calculation
    float r2 = dot(point, point);
    vec3 accel = -1.5 * h2 * point / (r2 * r2 * sqrt(r2));
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
    
    // Check if the disk should be rendered
    if (accretion_disk) {
      if (oldpoint.y * point.y < 0.0){
        // move along y axis
        float lambda = - oldpoint.y/velocity.y;
        vec3 intersection = oldpoint + lambda*velocity;
        float r = length(intersection);//dot(intersection,intersection);
        if (DISK_IN <= r&&r <= DISK_IN+DISK_WIDTH ){
          float phi = atan(intersection.x, intersection.z);
          
          vec3 disk_velocity = vec3(-intersection.x, 0.0, intersection.z)/sqrt(2.0*(r-1.0))/(r*r); 
          phi -= time;//length(r);
          phi = mod(phi , PI*2.0);
          float disk_gamma = 1.0/sqrt(1.0-dot(disk_velocity, disk_velocity));
          
          // Calculate the Doppler factor relative to the viewer's perspective
          // This ensures the effect follows the viewer as they rotate around the black hole
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
              // based on the dot product of the view direction and camera right vector
              float side_factor = dot(view_dir, camera_right);
              
              // Calculate how perpendicular our view is to the disk plane
              // 1.0 = viewing edge-on, 0.0 = viewing from above/below
              float disk_angle_factor = abs(dot(view_dir, vec3(0.0, 1.0, 0.0)));
              
              // Convert 5 degrees to radians (approximately 0.0873)
              float five_degrees = 0.0873;
              
              // Create a smooth transition for the angle factor
              // This will gradually fade out the effect as we approach 5 degrees
              float angle_blend = smoothstep(five_degrees, five_degrees * 0.8, disk_angle_factor);
              
              // Only apply the Doppler effect if we're viewing at an angle less than 5 degrees
              // from the disk plane
              if (disk_angle_factor < five_degrees) {
                // Create a smooth transition from -1 to 1
                // Use a smoothstep function to create a gradual transition
                float smooth_side = smoothstep(-0.3, 0.3, side_factor);
                
                // Apply subtle color shifts based on which side we're looking at
                // The central part (around side_factor = 0) will have minimal color alteration
                // Apply the angle blend to gradually fade out the effect
                disk_color.r *= 1.0 + (smooth_side - 0.5) * 0.4 * angle_blend;
                disk_color.g *= 1.0 - abs(smooth_side - 0.5) * 0.2 * angle_blend;
                disk_color.b *= 1.0 - (smooth_side - 0.5) * 0.4 * angle_blend;
              }
            }
            
            disk_color /= (ray_doppler_factor * disk_doppler_factor);
            float disk_alpha = clamp(dot(disk_color,disk_color)/4.5,0.0,1.0);

            if (beaming)
              disk_alpha /= pow(disk_doppler_factor,3.0);
            
            // Apply bloom to disk color
            vec3 bloomed_color = applyBloom(disk_color.rgb * disk_intensity);
            color += vec4(bloomed_color, disk_alpha);
          } else {
            // use blackbody 
            float disk_temperature = 10000.0*(pow(r/DISK_IN, -3.0/4.0));
            
            // Apply Doppler shift to temperature
            if (doppler_shift) {
              float doppler_factor = disk_doppler_factor;
              if (doppler_factor < 1.0) {
                // Red shift - increase temperature for receding material
                disk_temperature *= 1.0 + (1.0 - doppler_factor);
              } else {
                // Blue shift - decrease temperature for approaching material
                disk_temperature /= doppler_factor;
              }
            }

            vec3 disk_color = temp_to_color(disk_temperature);
            float disk_alpha = clamp(dot(disk_color,disk_color)/3.0,0.0,1.0);
            
            if (beaming)
              disk_alpha /= pow(disk_doppler_factor,3.0);
              
            // Apply bloom to disk color
            vec3 bloomed_color = applyBloom(disk_color * disk_intensity);
            color += vec4(bloomed_color, 1.0)*disk_alpha;
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