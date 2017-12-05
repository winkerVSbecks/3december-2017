<script>
import initScene from './sketch';

export default {
  name: 'home',
  mounted() {
    initScene(this.$refs.scene);
  },
};
</script>

<template>
  <div class="black mw7 mt6 ph3 center code">
    <canvas ref="scene" class="w-50 vh-50 z--1 absolute left-0 top-0"></canvas>

    <h1 class="f5 mb1">3December 2017</h1>
    <hr class="bn mt0 w4 pr3 mb4 mh0" :style="{
      height: '2px',
      backgroundImage: 'linear-gradient(to right, #b8cbb8 0%, #b8cbb8 0%, #b465da 0%, #cf6cc9 33%, #ee609c 66%, #ee609c 100%)',
    }">
    <ul>
      <li class="mb2">
        <router-link to="/glowy-blob-thing" class="black">Glowy Blob Thing</router-link>
      </li>
      <li class="mb2">
        <router-link to="/polyhedron" class="black">Icosahedron</router-link>
      </li>
    </ul>
  </div>
</template>
