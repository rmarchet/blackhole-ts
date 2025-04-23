// Bloom function to enhance bright areas
vec3 applyBloom(vec3 color) {
    float brightness = dot(color, vec3(0.2126, 0.7152, 0.0722));
    if (brightness > BLOOM_THRESHOLD) {
        float bloomFactor = (brightness - BLOOM_THRESHOLD) * BLOOM_INTENSITY;
        return color + color * bloomFactor;
    }
    return color;
} 