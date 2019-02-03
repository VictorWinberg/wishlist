// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import VueResource from "vue-resource";
import VueCookie from "vue-cookie";
import VModal from "vue-js-modal";
import App from "./App";

import { Store } from "./store";

Vue.use(VueResource);
Vue.use(VueCookie);
Vue.use(VModal, { dynamic: true, injectModalsContainer: true });
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  components: { App },
  store: Store,
  template: "<App/>"
});
