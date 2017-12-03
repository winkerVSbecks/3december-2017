/**
 * Based on Louis Hoebregts's "Quantum"
 *  + https://tympanus.net/Development/DecorativeBackgrounds/index3.html
 *  + https://github.com/Mamboleoo/DecorativeBackgrounds/
 */
import * as THREE from 'three';
import EffectComposer from 'three-effectcomposer';

import 'imports-loader?THREE=three!three/examples/js/shaders/CopyShader';
import 'imports-loader?THREE=three!three/examples/js/shaders/FilmShader';
import 'imports-loader?THREE=three!three/examples/js/shaders/VignetteShader';
import 'imports-loader?THREE=three!three/examples/js/shaders/ConvolutionShader';
import 'imports-loader?THREE=three!three/examples/js/shaders/LuminosityHighPassShader';

import 'imports-loader?THREE=three!three/examples/js/postprocessing/EffectComposer';
import 'imports-loader?THREE=three!three/examples/js/postprocessing/RenderPass';
import 'imports-loader?THREE=three!three/examples/js/postprocessing/TexturePass';
import 'imports-loader?THREE=three!three/examples/js/postprocessing/FilmPass';
import 'imports-loader?THREE=three!three/examples/js/postprocessing/ShaderPass';
import 'imports-loader?THREE=three!three/examples/js/postprocessing/UnrealBloomPass';

import { noise } from 'perlin';
import 'tachyons';

EffectComposer(THREE);

export default function initScene(canvas) {
  /**
   * Setup Canvas
   */
  let width = canvas.offsetWidth;
  let height = canvas.offsetHeight;

  /**
   * Create the WebGL Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  renderer.setSize(width, height);
  renderer.setClearColor('#CA1D31', 1);

  /**
   * Scene
   */
  const scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 10000);
  camera.position.set(0, 0, 600);

  /**
   * Lights
   */
  const domeLight = new THREE.HemisphereLight('#fff', '#C61522', 1);
  scene.add(domeLight);

  const light = new THREE.DirectionalLight('#CA1D31', 0.5);
  light.position.set(200, 300, 400);
  scene.add(light);

  const light2 = light.clone();
  light2.position.set(-200, 300, 400);
  scene.add(light2);

  const light3 = new THREE.DirectionalLight('#DBD8D1', 1);
  light.position.set(0, 0, -600);
  scene.add(light3);

  /**
   * Geometry + Material = Shape
   */
  const geometry = new THREE.IcosahedronGeometry(220, 4);
  geometry.vertices.forEach(vertex => {
    vertex._o = vertex.clone();
  });

  const material = new THREE.MeshPhongMaterial({
    color: '#FED530',
    emissive: '#CA1D31',
    flatShading: true,
    emissiveIntensity: 0.1,
    shininess: 0,
  });

  const shape = new THREE.Mesh(geometry, material);
  scene.add(shape);

  /**
   * Post-Processing
   */
  const composer = new THREE.EffectComposer(
    renderer,
    new THREE.WebGLRenderTarget(width, height),
  );

  // The usual renderer(scene, camera) stuff.
  // This will be the base layer
  const renderPass = new THREE.RenderPass(scene, camera);
  composer.addPass(renderPass);
  // ⬇️ add some grain and scan lines
  const filmPass = new THREE.FilmPass(0.1, 0.2, 25, false);
  composer.addPass(filmPass);
  // ⬇️ add a vignette
  var vignettePass = new THREE.ShaderPass(THREE.VignetteShader);
  composer.addPass(vignettePass);
  // ⬇️ add a bit of glow
  var bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(width, height),
    1.5,
    0.4,
    0.85,
  );
  // This is the one we are actually rendering to screen!
  // Each pass receives the previous pass as a texture.
  bloomPass.renderToScreen = true;
  composer.addPass(bloomPass);

  /**
   * Animate Blob
   */
  const displacementRatio = (vector, time, scale) => {
    const perlin = noise.simplex3(
      vector.x * 0.006 + time * 0.0002,
      vector.y * 0.006 + time * 0.0003,
      vector.z * 0.006,
    );

    return perlin * 0.4 * (scale + 0.1) + 0.8;
  };

  function updateVertices(time) {
    geometry.vertices.forEach(vertex => {
      vertex.copy(vertex._o);
      const ratio = displacementRatio(vertex, time, 0.5);
      vertex.multiplyScalar(ratio);
    });
    geometry.verticesNeedUpdate = true;
  }

  /**
   * Render Loop
   */
  function render(a) {
    requestAnimationFrame(render);
    updateVertices(a);
    var delta = 0.01;
    composer.render(delta);
  }

  requestAnimationFrame(render);

  /**
   * Handle Window Resize
   */
  function onResize() {
    canvas.style.width = '';
    canvas.style.height = '';
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    composer.setSize(width, height);
  }

  let resizeTimer;
  window.addEventListener('resize', function() {
    resizeTimer = clearTimeout(resizeTimer);
    resizeTimer = setTimeout(onResize, 200);
  });
}
