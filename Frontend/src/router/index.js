import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

import store from '../store/index'

Vue.use(VueRouter);

const routes = [
  {
    path: "/Home",
    name: "Home",
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/SignIn",
    name: "SignIn",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/SignIn.vue"),
    meta: {
      hideForAuth: true,
    },
  },
  {
    path: "/MyReviews",
    name: "MyReviews",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/MyReviews.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/Intro",
    name: "Intro",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Intro.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/Search",
    name: "Search",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Search.vue"),
    meta: {
      requiresAuth: true,
    },
  },

  { path: "/", redirect: "/SignIn" },
  { path: "*", redirect: "/SignIn" },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.state.logged) {
      next({ path: "/SignIn" });
    } else {
      next();
    }
  } else {
    next();
  }

  if (to.matched.some((record) => record.meta.hideForAuth)) {
    if (store.state.logged) {
      next({ path: "/Home" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
