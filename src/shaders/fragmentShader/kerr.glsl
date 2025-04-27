// Kerr metric utility functions

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
    float a = black_hole_rotation * ROTATION_SCALE_DOWN;  // Scale down rotation effect
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