import definitions from './definitions.glsl?raw';
import utils from './utils.glsl?raw';
import temperature from './temperature.glsl?raw';
import bloom from './bloom.glsl?raw';
import glow from './glow.glsl?raw';
import main from './main.glsl?raw';

// Concatenate all shader files in the correct order
export const fragmentShader = `
${definitions}
${utils}
${temperature}
${bloom}
${glow}
${main}
`; 