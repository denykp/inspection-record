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
    {
      path: "/create",
      name: "create",
      meta: { title: "Create Yard Services" },
      component: () => import("../views/CreatePage.vue"),
    },
  ],
});

export default router;
