import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

// Vuetify
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles/main.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";

import router from "./router";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
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
