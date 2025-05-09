// Bloom function to enhance bright areas
vec3 applyBloom(vec3 color) {
    float brightness = dot(color, vec3(0.2126, 0.7152, 0.0722));
    if (brightness > bloom_threshold) {
        float bloomFactor = (brightness - bloom_threshold) * bloom_intensity;
        return color + color * bloomFactor;
    }
    return color;
} 