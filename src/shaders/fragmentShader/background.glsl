vec4 applyStarsAndBackground(
    vec3 ray_dir,
    float ray_doppler_factor
) {
    vec4 color = vec4(0.0, 0.0, 0.0, 0.0);
    vec2 tex_coord = to_spherical(ray_dir * ROT_Z(45.0 * DEG_TO_RAD));

    // Handle stars
    vec4 star_color = texture2D(star_texture, tex_coord);
    if (show_stars && star_color.g > 0.0) {
        float star_temperature = (MIN_TEMPERATURE + TEMPERATURE_RANGE * star_color.r);
        // arbitrarily sets background stars' velocity for random shifts
        float star_velocity = star_color.b - 0.5;
        float star_doppler_factor = sqrt((1.0 + star_velocity)/(1.0 - star_velocity));
        if (doppler_shift)
            star_temperature /= ray_doppler_factor * star_doppler_factor;
        
        color += vec4(temp_to_color(star_temperature), 1.0) * star_color.g;
    }

    // Apply the background texture with increased intensity
    float bg_strength = bg_intensity > 0.0 ? bg_intensity : DEFAULT_BG_INTENSITY;
    color += texture2D(bg_texture, tex_coord) * bg_strength;

    return color;
}
