// Accretion disk calculation function
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
            if (use_disk_texture) {
                vec2 tex_coord = vec2(mod(phi, 2.0 * PI) / (2.0 * PI), 1.0 - (r - DISK_IN) / (DISK_WIDTH));
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
                        float shift = (smooth_side - 0.5) * 1.0;
                        shift *= smoothstep(0.0, 0.4, abs(shift)) * angle_blend;
                        disk_color.r *= 1.0 + max(-shift, 0.0) * 1.6;
                        disk_color.b *= 1.0 + max(shift, 0.0) * 2.4;
                        float positive_shift_mix_factor = 0.75;
                        float negative_shift_mix_factor = 0.75;
                        if (beaming) {
                            positive_shift_mix_factor = 1.85;
                            negative_shift_mix_factor = -0.75;
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
            } else {
                float disk_temperature = 10000.0 * (pow(r / DISK_IN, -3.0 / 4.0));
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
    return vec4(0.0);
}
