import Vue from 'vue';
import Router from 'vue-router';
import Home from './pages/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/sandbox01',
      name: 'sandbox01',
      component: () =>
        import(
          /* webpackChunkName: "sandbox01" */ './pages/sandbox01/Sandbox01.vue'
        )
    }
  ]
});
