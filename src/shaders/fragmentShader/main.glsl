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

    // Calculate and add jet color
    vec3 jet_color = calculateJet(point);
    color.rgb += jet_color;
    
    // Check if the disk should be rendered
    if (accretion_disk) {
    vec4 disk_result = calculateDisk(
      oldpoint, point, velocity, cam_pos, cam_dir, cam_up, ray_doppler_factor  
    );
    color += disk_result;
    }
    // --- End Accretion Disk ---
  }
  
  if (distance > 1.0) {
    ray_dir = normalize(point - oldpoint);
    color += applyStarsAndBackground(ray_dir, ray_doppler_factor);
  }
  gl_FragColor = color * ray_intensity;
} 