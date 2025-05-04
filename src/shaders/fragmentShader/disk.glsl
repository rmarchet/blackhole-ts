// Accretion disk calculation function
#define DOPPLER_GRADIENT_SMOOTHNESS 0.65

vec3 thermal_colormap(float t, bool beaming) {
    vec3 blue = vec3(0.0, 0.0, 1.0);
    vec3 cyan = vec3(0.0, 1.0, 1.0);
    vec3 green = vec3(0.0, 1.0, 0.0);
    vec3 yellow = vec3(1.0, 1.0, 0.0);
    vec3 red = vec3(1.0, 0.0, 0.0);

    // Create ultra-smooth transitions with maximum overlap
    vec3 color = mix(blue, cyan, smoothstep(0.0, 0.4, t));
    color = mix(color, green, smoothstep(0.2, 0.6, t));
    
    // First mix yellow with green
    vec3 yellow_mix = mix(green, yellow, smoothstep(0.4, 0.7, t));
    // Then mix that result with red
    vec3 warm_colors = mix(yellow_mix, red, smoothstep(0.6, 1.0, t));

    if (beaming) {
    return mix(color, warm_colors, smoothstep(0.3, 0.7, t));
    }
    // Finally blend between the cool and warm colors
    return mix(color, warm_colors, smoothstep(0.3, 0.7, t));
}

vec4 calculateDisk(
    vec3 oldpoint,
    vec3 point,
    vec3 velocity,
    vec3 cam_pos,
    vec3 cam_dir,
    vec3 cam_up,
    float ray_doppler_factor
) {
    // Check for intersection with disk plane
    if (oldpoint.y * point.y < 0.0) {
        float lambda = -oldpoint.y / velocity.y;
        vec3 intersection = oldpoint + lambda * velocity;
        float r = length(intersection);
        if (DISK_IN <= r && r <= DISK_IN + DISK_WIDTH) {
            float phi = atan(intersection.x, intersection.z);
            // Calculate disk velocity with frame dragging for rotating black hole
            vec3 disk_velocity = vec3(-intersection.x, 0.0, intersection.z) / sqrt(2.0 * (r - 1.0)) / (r * r);
            if (black_hole_rotation > 0.0) {
              float a = black_hole_rotation * ROTATION_SCALE_DOWN;
              vec2 kerr_effects = calculateKerrEffects(intersection, a);
              float omega = kerr_effects.x;
              disk_velocity += cross(vec3(0.0, 1.0, 0.0), intersection) * omega * 0.8;
            }
            float rotation_speed = orbit_enabled ? 2.0 : 1.0;
            phi -= time * rotation_speed;
            phi = mod(phi, PI * 2.0);
            float disk_gamma = 1.0 / sqrt(1.0 - dot(disk_velocity, disk_velocity));
            float disk_doppler_factor = disk_gamma * (1.0 + dot(normalize(intersection - cam_pos), disk_velocity));
            
            // Calculate base temperature - shared between thermal and blackbody modes
            float disk_temperature = 9000.0 * (pow(r / DISK_IN, -3.0 / 4.0));

            // thermal colormap mode
            if (thermal_colormap_mode) {
                // Apply Doppler shift to temperature
                if (doppler_shift) {
                  vec3 view_dir = normalize(intersection - cam_pos);
                  vec3 camera_right = normalize(cross(cam_dir, cam_up));
                  float side_factor = dot(view_dir, camera_right);
                  float disk_angle_factor = abs(dot(view_dir, vec3(0.0, 1.0, 0.0)));
                  
                  float angle_threshold = 0.4648;
                  float angle_blend_smootness = angle_threshold * 0.40;
                  float angle_blend = smoothstep(angle_threshold, angle_blend_smootness, disk_angle_factor);
                  
                  if (disk_angle_factor < angle_threshold) {
                    float smooth_side = 1.0 - smoothstep(-0.7, 0.8, side_factor);
                    float shift = (smooth_side - 0.5) * 1.0;
                    shift *= smoothstep(0.0, 0.4, abs(shift)) * angle_blend;
                    // Scale shift based on radius - stronger near inner edge
                    float radius_factor = 1.0 - smoothstep(DISK_IN, DISK_IN + DISK_WIDTH * 0.885, r);
                    shift *= mix(0.6, 1.80, radius_factor);
                     
                    // Adjust temperature based on Doppler shift
                    if (shift > 0.0) {
                        disk_temperature *= 1.0 - (shift) * 2.0; // Much stronger blueshift
                    } else {
                        disk_temperature *= 1.0 + abs(shift) * 1.0; // Much stronger redshift
                    }
                  }
                }

                // Normalize temperature with wider range
                float t = clamp((disk_temperature - 500.0) / 9500.0, 0.01, 0.99);
                vec3 disk_color = thermal_colormap(t, false);
                
                // Apply intensity variations from Doppler beaming
                float disk_alpha = 1.0;
                disk_color /= (ray_doppler_factor * disk_doppler_factor);
                // Apply glow
                vec3 glowing_color = applyGlow(disk_color * disk_intensity, glow_intensity);
                
                if (beaming) {
                  disk_color = thermal_colormap(clamp((disk_temperature - 210.0) / 7000.0, 0.1, 0.99), true);
                  return vec4(disk_color, disk_alpha);
                }
                return vec4(glowing_color, disk_alpha);
            }

            // texture mode
            if (use_disk_texture) {
              vec2 tex_coord = vec2(
                mod(phi, 2.0 * PI) / (2.0 * PI),
                1.0 - (r - DISK_IN) / (DISK_WIDTH)
              );
              vec4 disk_color = texture2D(disk_texture, tex_coord);
              if (doppler_shift) {
                  vec3 view_dir = normalize(intersection - cam_pos);
                  vec3 camera_right = normalize(cross(cam_dir, cam_up));
                  float side_factor = dot(view_dir, camera_right);
                  float disk_angle_factor = abs(dot(view_dir, vec3(0.0, 1.0, 0.0)));
                  float angle_threshold = 0.4648;
                  float angle_blend_smootness = angle_threshold * 0.30;
                  float angle_blend = smoothstep(angle_threshold, angle_blend_smootness, disk_angle_factor);
                  if (disk_angle_factor < angle_threshold) {
                      float smooth_side = 1.0 - smoothstep(-0.8, 0.8, side_factor);
                      float shift = (smooth_side - 0.55) * 1.0;
                      shift *= smoothstep(0.0, 0.14, abs(shift)) * angle_blend;
                      disk_color.r *= 1.0 + max(-shift, 0.0) * 2.9;
                      disk_color.b *= 1.0 + max(shift, 0.0) * 2.8;
                      float positive_shift_mix_factor = 0.75;
                      float negative_shift_mix_factor = 0.75;
                      if (beaming) {
                        positive_shift_mix_factor = 1.95;
                        negative_shift_mix_factor = -0.985;
                      }
                      float intensity = shift > 0.0 
                          ? mix(1.0, positive_shift_mix_factor, shift)
                          : mix(1.0, negative_shift_mix_factor, -shift);
                      disk_color.rgb *= intensity;
                  }
              }
              disk_color /= (ray_doppler_factor * disk_doppler_factor);
              float disk_alpha = clamp(dot(disk_color.rgb, disk_color.rgb) / 4.5, 0.0, 1.0);
              if (beaming) disk_alpha /= pow(disk_doppler_factor, 3.0);
              vec3 glowing_color = applyGlow(disk_color.rgb * disk_intensity, glow_intensity);
              return vec4(glowing_color, disk_alpha);
            } 
            // blackbody mode
            else {
              if (doppler_shift) {
                float doppler_factor = disk_doppler_factor;
                if (doppler_factor < 1.0) {
                  disk_temperature *= 1.0 + (1.0 - doppler_factor) * 2.0;
                } else {
                  disk_temperature /= doppler_factor * 1.5;
                }
              }
              vec3 disk_color = temp_to_color(disk_temperature);
              float disk_alpha = clamp(dot(disk_color, disk_color) / 3.0, 0.0, 1.0);
              if (beaming) disk_alpha /= pow(disk_doppler_factor, 3.0);
              vec3 glowing_color = applyGlow(disk_color * disk_intensity, glow_intensity);
              return vec4(glowing_color, disk_alpha);
            }
        }
    }
    return vec4(0.0, 0.0, 0.0, 0.0);
}
