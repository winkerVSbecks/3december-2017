import Vue from 'vue';
import Router from 'vue-router';

import Home from './Home';
const Polyhedron = Vue.component('polyhedron', () =>
  import(/* webpackChunkName: "polyhedron" */ './polyhedron'),
);
const GlowyBlobThing = Vue.component('glowy-blob-thing', () =>
  import(/* webpackChunkName: "glowy-blob-thing" */ './glowy-blob-thing'),
);

Vue.use(Router);

export default new Router({
  routes: [
    { path: '/index', component: Home },
    { path: '/glowy-blob-thing', component: GlowyBlobThing },
    { path: '/polyhedron', component: Polyhedron },
    { path: '/', redirect: '/index' },
  ],
});
