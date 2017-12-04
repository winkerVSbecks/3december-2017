import * as THREE from 'three';
import frag from './dither.frag';
import vert from './post.vert';

export default {
  uniforms: {
    tDiffuse: { type: 't', value: null },
  },
  vertexShader: `
varying vec2 vUv;

void main() {
  vUv = (position.xy + vec2(1.0)) / 2.0;
  vUv.y = 1.0 - vUv.y;
  gl_Position = vec4(position, 1.0);
}
`,
  fragmentShader: frag,
};
