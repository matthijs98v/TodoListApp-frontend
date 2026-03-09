import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/todo/:todoListId',
      name: 'todoList',
      component: () => import('../views/TodoListView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/info',
      name: 'info',
      component: () => import('../views/InfoView.vue'),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "notFound",
      component: () => import("../views/NotFoundView.vue"),
    },
  ],
})

router.beforeEach(async (to, from) => {
  const userStore = useUserStore();
  await userStore.checkUser();

  // Check if user is logged!
  if (!userStore.validUser && to.path !== "/login") {
    // Go to login
    if (to.path != "/register") {
      return {name: "login"}
    }
  } else {
    // Go to the right view
    if (
      ( userStore.validUser && to.path == "/login" ) ||
      ( userStore.validUser && to.path == "/register" )
    ) {
      return {name: "home"}
    }
  }
});

export default router
