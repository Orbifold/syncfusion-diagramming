import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import Theme from "@/Theme";

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: false,
        themes: {
            light: {
                primary: Theme.Blue1,
                secondary: Theme.Blue2,
                accent: Theme.Warning,
                error: Theme.Error,
                anchor: Theme.Blue1,
            },
        },
    },
});











