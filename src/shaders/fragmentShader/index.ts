import definitions from './definitions.glsl?raw'
import utils from './utils.glsl?raw'
import kerr from './kerr.glsl?raw'
import temperature from './temperature.glsl?raw'
import bloom from './bloom.glsl?raw'
import glow from './glow.glsl?raw'
import main from './main.glsl?raw'
import background from './background.glsl?raw'

// Concatenate all shader files in the correct order
export const fragmentShader = `
${definitions}
${utils}
${kerr}
${temperature}
${bloom}
${glow}
${background}
${main}
` 
