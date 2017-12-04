precision mediump float;

uniform sampler2D tDiffuse;
varying vec2 vUv;

#pragma glslify: dither = require(glsl-dither/8x8)

void main() {
  vec4 color = texture2D(tDiffuse, vUv);
  gl_FragColor = dither(gl_FragCoord.xy, color) * 3.0;
}