import * as THREE from 'three';
import frag from './grainy-post.frag';
import vert from './post.vert';

export default {
  uniforms: {
    tDiffuse: { type: 't', value: null },
    iGlobalTime: { type: 'f', value: 0 },
    resolution: { type: 'v2', value: new THREE.Vector2() },
  },
  vertexShader: vert,
  fragmentShader: frag,
};
