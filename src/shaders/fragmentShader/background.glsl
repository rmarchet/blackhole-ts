vec4 applyStarsAndBackground(
  vec3 ray_dir,
  float ray_doppler_factor
) {
  vec4 color = vec4(0.0, 0.0, 0.0, 0.0);
  vec2 tex_coord = to_spherical(ray_dir * ROT_Z(45.0 * DEG_TO_RAD));

  // Handle stars with luminance-based blending
  vec4 star_color = texture2D(star_texture, tex_coord);
  if (show_stars && star_color.g > 0.0) {
    float star_temperature = (MIN_TEMPERATURE + TEMPERATURE_RANGE * star_color.r);
    // arbitrarily sets background stars' velocity for random shifts
    float star_velocity = star_color.b - 0.5;
    float star_doppler_factor = sqrt((1.0 + star_velocity) / (1.0 - star_velocity));
    if (doppler_shift) star_temperature /= ray_doppler_factor * star_doppler_factor;
    
    vec3 temp_color = temp_to_color(star_temperature);
    float star_luminance = dot(temp_color, vec3(0.299, 0.587, 0.114));
    float star_blend = star_luminance * star_color.g * 0.38;
    color = mix(color, vec4(temp_color, 1.0), star_blend);
  }

  // Apply the background texture with proper blending
  float bg_strength = bg_intensity > 0.0 ? bg_intensity : DEFAULT_BG_INTENSITY;
  vec4 bg_color = texture2D(bg_texture, tex_coord);
  
  // Calculate luminance of background color to use as blend factor
  float bg_luminance = dot(bg_color.rgb, vec3(0.299, 0.57, 0.114));
  float blend_factor = bg_luminance * bg_strength * 0.4;
  
  // Blend the background with existing stars
  color = mix(color, bg_color, blend_factor);

  return color;
}
