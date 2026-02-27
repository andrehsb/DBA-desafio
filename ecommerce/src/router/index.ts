import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'src/stores/auth'; 

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to) => {
    const authStore = useAuthStore();
    const isAuthenticated = !!authStore.token; // verifica se o token existe

    if (to.meta.requiresAuth && !isAuthenticated) {
      return'/login'; // manda para o login
    } 
    // se falso, manda para a home
    else if (to.path === '/login' && isAuthenticated) {
      return'/';
    }
    else {
      return true;
    }
  });
  return Router;
});