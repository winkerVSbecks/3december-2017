import * as THREE from 'three';

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
  renderer.setClearColor(0xffffff);

  /**
   * Scene
   */
  const scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(15, width / height, 0.1, 2000);
  camera.position.z = 100;

  scene.add(camera);

  /**
   * Geometry + Material = Shape
   */
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

  const icosahedronGeometry = new THREE.IcosahedronGeometry(8, 1);
  const icosahedron = new THREE.Mesh(icosahedronGeometry, material);
  scene.add(icosahedron);

  const wireframeGeo = new THREE.EdgesGeometry(icosahedron.geometry);
  const wireMaterial = new THREE.LineBasicMaterial({
    color: 0x000000,
    linewidth: 8,
  });
  const wireframe = new THREE.LineSegments(wireframeGeo, wireMaterial);
  icosahedron.add(wireframe);

  /**
   * Render Loop
   */
  function render(a) {
    requestAnimationFrame(render);
    icosahedron.rotation.x = Date.now() * 0.00005;
    icosahedron.rotation.y = Date.now() * 0.0001;
    renderer.render(scene, camera);
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
