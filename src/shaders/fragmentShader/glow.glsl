// Glow function for the accretion disk
vec3 applyGlow(vec3 color, float intensity) {
    // Calculate brightness using luminance weights
    float brightness = dot(color, vec3(0.2126, 0.7152, 0.0722));
    
    // Apply a soft glow based on brightness
    float glowFactor = smoothstep(0.2, 0.8, brightness) * intensity;
    
    // Create a glow color (slightly shifted toward white)
    vec3 glowColor = mix(color, vec3(1.0), 0.3);
    
    // Create a blurred glow by mixing with a slightly desaturated version
    vec3 blurredGlow = mix(glowColor, vec3(1.0), 0.5);
    
    // Return the original color plus the glow
    return color + blurredGlow * glowFactor;
} 