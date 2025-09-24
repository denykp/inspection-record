import { createWebHistory, createRouter } from "vue-router";
import HomePage from "../views/HomePage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      meta: { title: "Inspection Record" },
      component: HomePage,
    },
  ],
});

export default router;
