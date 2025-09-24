import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

// Vuetify
import "vuetify/styles/main.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import router from "./router";

const vuetify = createVuetify({
  components,
  directives,
});

const baseTitle = document.title;
router.afterEach((to) => {
  if (to.meta.title) {
    document.title = `${baseTitle} | ${to.meta.title}`;
  } else {
    document.title = baseTitle;
  }
});

const app = createApp(App);
app.use(vuetify);
app.use(router);

app.mount("#app");
