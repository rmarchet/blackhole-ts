#define PI 3.141592653589793238462643383279
#define DEG_TO_RAD (PI/180.0)
#define ROT_Y(a) mat3(1, 0, 0, 0, cos(a), sin(a), 0, -sin(a), cos(a))
#define ROT_Z(a) mat3(cos(a), -sin(a), 0, sin(a), cos(a), 0, 0, 0, 1)
#define ROTATION_SCALE_DOWN 0.285

// Disk parameters
uniform float DISK_IN;
uniform float DISK_WIDTH;

// Temperature parameters
const float MIN_TEMPERATURE = 1000.0;
const float TEMPERATURE_RANGE = 39000.0;

// Background parameters
const float DEFAULT_BG_INTENSITY = 0.8;

// Uniforms
uniform float time;
uniform vec2 resolution;
uniform vec3 cam_pos;
uniform vec3 cam_dir;
uniform vec3 cam_up;
uniform float fov;
uniform vec3 cam_vel;
uniform bool accretion_disk;
uniform bool use_disk_texture;
uniform bool doppler_shift;
uniform bool lorentz_transform;
uniform bool beaming;
uniform bool show_stars;
uniform bool show_milkyway;
uniform bool orbit_enabled;
uniform float bg_intensity;
uniform float disk_intensity;
// Add bloom parameter uniforms
uniform float bloom_intensity;
uniform float bloom_threshold;
uniform float bloom_radius;
// Add glow parameter uniforms
uniform float glow_intensity;
// Add black hole rotation uniform
uniform float black_hole_rotation;
uniform bool jet_enabled;
uniform sampler2D bg_texture;
uniform sampler2D star_texture;
uniform sampler2D disk_texture; 