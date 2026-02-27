import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // home 
      { 
        path: '', 
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: true } 
      },
      // login
      { 
        path: 'login', 
        name: 'login',
        component: () => import('pages/LoginPage.vue') 
      },
      //add produto
      { 
        path: 'cadastro', 
        component: () => import('pages/ProductForm.vue'),
        meta: { requiresAuth: true, role: 'admin' }
      }
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;