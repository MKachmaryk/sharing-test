import Vue from 'vue';
import VueRouter from 'vue-router';
import ForgotPassword from '@/views/ForgotPassword.vue';
import Login from '@/views/Login.vue';
import ResetPassword from '@/views/ResetPassword.vue';
import Sandbox from '@/views/Sandbox.vue';
import { StorageService } from '@/services/storage.service';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () =>
        import(/* webpackChunkName: "home" */ '../views/Home.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        public: true,
        onlyWhenLoggedOut: true
      }
    },
    {
      path: '/asset/:id',
      name: 'asset',
      component: () =>
        import(/* webpackChunkName: "asset" */ '../views/Asset.vue')
    },
    {
      path: '/library',
      name: 'library',
      meta: {
        public: true,
      },
      component: () =>
        import(/* webpackChunkName: "library" */ '../views/Library.vue')
    },
    {
      path: '/profile/:entityType/:entityId',
      name: 'profile',
      component: () =>
        import(/* webpackChunkName: "profile" */ '../views/Profile.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () =>
        import(/* webpackChunkName: "settings" */ '../views/Settings.vue')
    },
    {
      path: '/project/:projectId',
      name: 'sales-page',
      component: () =>
        import(/* webpackChunkName: "sales-page" */ '../views/Sales.vue')
    },
    {
      path: '/project/:projectId/bundles',
      name: 'bundles-page',
      component: () =>
        import(/* webpackChunkName: "bundles-page" */ '../views/Sales.vue')
    },
    {
      path: '/cart',
      name: 'cart-page',
      component: () =>
        import(/* webpackChunkName: "cart-page" */ '../views/Sales.vue')
    },
    {
      path: '/sale/success',
      name: 'success-page',
      component: () =>
        import(/* webpackChunkName: "success-page" */ '../views/Sales.vue')
    },
    {
      path: '/password/forgot',
      name: 'forgot-password',
      component: ForgotPassword,
      meta: {
        public: true,
        onlyWhenLoggedOut: true
      }
    },
    {
      path: '/password/reset/:token',
      name: 'reset-password',
      component: ResetPassword,
      meta: {
        public: true,
        onlyWhenLoggedOut: true
      }
    },
    {
      path: '/sandbox',
      name: 'sandbox',
      component: Sandbox,
      meta: {
        public: true,
        onlyWhenLoggedOut: true
      }
    },
  ]
});

router.beforeEach((to, from, next) => {
  const isPublic = to.matched.some(record => record.meta.public);
  const onlyWhenLoggedOut = to.matched.some(
    record => record.meta.onlyWhenLoggedOut
  );
  const loggedIn = !!StorageService.getToken();

  if (!isPublic && !loggedIn) {
    return next({
      path: '/login',
      query: { redirect: to.fullPath } // Store the full path to redirect the user to after login
    });
  }

  // Do not allow user to visit login page or register page if they are logged in
  if (loggedIn && onlyWhenLoggedOut) {
    return next('/');
  }

  next();
});

export default router;
