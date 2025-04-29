

vec3 calculateJet(vec3 point) {
  vec3 color;
  // Jet parameters based on black_hole_rotation
  float jet_intensity = black_hole_rotation * 1.5 * ROTATION_SCALE_DOWN;
  float jet_radius = 0.1 + 0.16 * black_hole_rotation * ROTATION_SCALE_DOWN;
  float jet_length = 3.0 + 8.0 * black_hole_rotation * ROTATION_SCALE_DOWN;

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
  return color;
}
// --- End Jet ---