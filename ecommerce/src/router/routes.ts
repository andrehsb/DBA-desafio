import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // home 
      {
        path: '',
        component: () => import('pages/HomePage.vue'),
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
      },
      //detalhes do produto
      {
        path: '/produto/:id', 
        name: 'detalhes',
        component: () => import('pages/ProductDetails.vue'),
        meta: { requiresAuth: true }
      },
      //editar produto
      {
        path: 'editar/:id',
        component: () => import('pages/EditProduct.vue'),
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