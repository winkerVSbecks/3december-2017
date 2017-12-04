import Vue from 'vue';
import 'tachyons';
import router from './router';
import App from './App';
import './index.css';

new Vue({
  el: '#app',
  template: '<app />',
  router,
  ...App,
});
