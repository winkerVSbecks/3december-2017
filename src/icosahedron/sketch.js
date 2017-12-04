import * as THREE from 'three';
import EffectComposerInit from 'three-effectcomposer';
import OrbitControlsInit from 'three-orbit-controls';

import 'imports-loader?THREE=three!three/examples/js/postprocessing/RenderPass';
import 'imports-loader?THREE=three!three/examples/js/postprocessing/ShaderPass';
import 'imports-loader?THREE=three!three/examples/js/shaders/DotScreenShader';
import 'imports-loader?THREE=three!three/examples/js/postprocessing/UnrealBloomPass';

import envMapImg from '../assets/env-map.png';
import Dither from '../shaders/dither';

const EffectComposer = EffectComposerInit(THREE);
const OrbitControls = OrbitControlsInit(THREE);

export default function initScene(canvas) {
  /**
   * Setup Canvas
   */
  let width = canvas.offsetWidth;
  let height = canvas.offsetHeight;
  const PIXEL_RATIO = window.devicePixelRatio || 1;

  /**
   * Create the WebGL Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setPixelRatio(PIXEL_RATIO);
  renderer.setSize(width, height);
  renderer.setClearColor(0x001b44); // 001b44

  /**
   * Scene
   */
  const scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(15, width / height, 0.1, 2000);
  camera.position.z = 100;

  /**
   * Orbit
   */
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  // controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
  controls.rotateSpeed = 0.15;

  /**
   * Lights
   */
  const ambientLight = new THREE.AmbientLight(0x000000);
  camera.add(ambientLight);

  const lights = [
    new THREE.PointLight(0x408bc9, 2, 0),
    new THREE.PointLight(0xff725c, 0.6, 0),
    new THREE.PointLight(0x5e2ca5, 1, 0),
    new THREE.PointLight(0x00449e, 0.5, 0),
  ];

  lights[0].position.set(100, 70, -50);
  lights[1].position.set(-50, -100, -50);
  lights[2].position.set(-100, 100, -50);

  camera.add(lights[0]);
  camera.add(lights[1]);
  camera.add(lights[2]);
  camera.add(lights[3]);

  scene.add(camera);

  /**
   * Geometry + Material = Shape
   * from Jon Shamir's CodePen:
   *  https://codepen.io/shamir/pen/KaaXaQ
   */
  const radius = 8;

  const shinyMaterial = new THREE.MeshStandardMaterial({
    color: 0xa463f2,
    side: THREE.DoubleSide,
  });

  const envMap = new THREE.TextureLoader().load(envMapImg);
  envMap.mapping = THREE.SphericalReflectionMapping;
  shinyMaterial.envMap = envMap;

  const roughMaterial = new THREE.MeshStandardMaterial({
    color: 0x804ebf,
    roughness: 1,
    side: THREE.DoubleSide,
  });

  const icosahedronGeometry = new THREE.IcosahedronGeometry(radius * 1.099);
  icosahedronGeometry.computeFlatVertexNormals();
  const icosahedron = new THREE.Mesh(icosahedronGeometry, roughMaterial);

  const dodecahedronGeometry = new THREE.DodecahedronGeometry(radius);
  dodecahedronGeometry.computeFlatVertexNormals();
  dodecahedronGeometry.rotateY(Math.PI / 2);
  const dodecahedron = new THREE.Mesh(dodecahedronGeometry, shinyMaterial);

  scene.add(icosahedron);
  scene.add(dodecahedron);

  /**
   * Post-Processing
   */
  const composer = new EffectComposer(
    renderer,
    new THREE.WebGLRenderTarget(width, height),
  );

  const renderPass = new THREE.RenderPass(scene, camera);
  composer.addPass(renderPass);

  var bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(width, height),
    1.5,
    0.4,
    0.85,
  );
  composer.addPass(bloomPass);

  const ditherPass = new THREE.ShaderPass(Dither);
  ditherPass.renderToScreen = true;
  composer.addPass(ditherPass);

  /**
   * Render Loop
   */
  function render(a) {
    requestAnimationFrame(render);
    controls.update();
    composer.render();
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
