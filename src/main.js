import Vue from 'vue';
import router from './router';
import App from './App';
import 'tachyons';

new Vue({
  el: '#app',
  template: '<app />',
  router,
  ...App,
});
