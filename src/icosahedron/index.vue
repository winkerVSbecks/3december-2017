<script>
import initScene from './sketch';

export default {
  name: 'icosahedron',
  mounted() {
    initScene(this.$refs.scene);
  },
};
</script>

<template>
  <canvas ref="scene" class="w-100 vh-100 grabbing"></canvas>
</template>
