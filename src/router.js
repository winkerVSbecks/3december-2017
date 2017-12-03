import Vue from 'vue';
import Router from 'vue-router';

import Home from './Home';
import GlowyBlobThing from './glowy-blob-thing';

Vue.use(Router);

export default new Router({
  routes: [
    { path: '/index', component: Home },
    { path: '/glowy-blob-thing', component: GlowyBlobThing },
    { path: '/', redirect: '/index' },
  ],
});
