import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import {
    DiagramPlugin,
    SymbolPalettePlugin
    ,OverviewPlugin
} from "@syncfusion/ej2-vue-diagrams";
import {ContextMenuPlugin} from "@syncfusion/ej2-vue-navigations";
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false
Vue.use(DiagramPlugin);
Vue.use(SymbolPalettePlugin);
Vue.use(ContextMenuPlugin);
Vue.use(OverviewPlugin);

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount("#app")
