#define PI 3.141592653589793238462643383279
#define DEG_TO_RAD (PI/180.0)
#define ROT_Y(a) mat3(1, 0, 0, 0, cos(a), sin(a), 0, -sin(a), cos(a))
#define ROT_Z(a) mat3(cos(a), -sin(a), 0, sin(a), cos(a), 0, 0, 0, 1)

// Bloom parameters
#define BLOOM_INTENSITY 1.5
#define BLOOM_THRESHOLD 0.6
#define BLOOM_RADIUS 0.5

// Disk parameters
const float DISK_IN = 2.0;
const float DISK_WIDTH = 4.0;

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
uniform float bg_intensity;
uniform sampler2D bg_texture;
uniform sampler2D star_texture;
uniform sampler2D disk_texture; 