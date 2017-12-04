/**
 * from https://github.com/mattdesl/audiograph.xyz/blob/master/lib/shader/grainy-post.frag
 */
precision highp float;

uniform sampler2D tDiffuse;
uniform vec2 resolution;
uniform float iGlobalTime;

vec3 tex(vec2 uv);

#pragma glslify: blur = require('glsl-hash-blur', sample=tex, iterations=10)

vec3 tex(vec2 uv) {
  return texture2D(tDiffuse, uv).rgb;
}

void main () {
  vec2 uv = vec2(gl_FragCoord.xy / resolution.xy);
  uv.y = 1.0 - uv.y;

  float texelSize = 1.0 / resolution.x;
  float aspect = resolution.x / resolution.y;

  //animate strength
  float anim = sin(iGlobalTime)/2.0 + 0.5;
  float strength = 40.0 * anim * texelSize;

  //vignette blur
  float radius = 1.0 - length(uv - 0.5);
  radius = smoothstep(0.7, 0.0, radius) * strength;

  //jitter the noise but not every frame
  float tick = floor(fract(iGlobalTime) * 20.0);
  float jitter = mod(tick * 382.0231, 21.321);

  // Apply the blur effect...
  // We do this on every fragment, but you
  // might get a performance boost by only
  // blurring fragments where radius > 0
  vec3 color = blur(uv, radius, aspect, jitter);
  gl_FragColor = vec4(color, 1.0);
}