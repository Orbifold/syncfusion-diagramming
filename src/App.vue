<template>
  <v-app>
    <v-app-bar
        app
        color="#292929"
    >
      <div class="d-flex align-center">
        <h1 style="color: white">Syncfusion Diagramming</h1>
      </div>

      <v-spacer></v-spacer>

    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
    <v-footer
        class="footer"
        :padless="true"
    >
      <a title="Doing now what patients need next"
         target="_blank"
         href="https://orbifold.net"
         class="footer-text">&copy2021 Orbifold Consulting.</a>
      <a style="margin-left: 20px; cursor: pointer"
         class="footer-text"
         href="/#/">Legal Statement</a>
      <a style="margin-left: 20px; cursor: pointer"
         class="footer-text"
         href="/#/">Privacy</a>
      <a style="margin-left: 20px; cursor: pointer"
         class="footer-text"
         href="/#/">Cookie Policy</a>
      <v-spacer></v-spacer>
      <div class="version clickable">v0.1</div>
      <v-spacer></v-spacer>


      <span title="About"
            style="opacity: 1; float: right; cursor: pointer"
            class="footer-text">About</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",

  components: {},

  data: () => ({
    //
  }),
});
</script>
<style>
@import "../node_modules/@syncfusion/ej2-base/styles/bootstrap4.css";
@import "../node_modules/@syncfusion/ej2-notifications/styles/bootstrap4.css";
@import "../node_modules/@syncfusion/ej2-buttons/styles/bootstrap4.css";
@import "../node_modules/@syncfusion/ej2-calendars/styles/bootstrap4.css";
@import "../node_modules/@syncfusion/ej2-inputs/styles/bootstrap4.css";
@import "../node_modules/@syncfusion/ej2-navigations/styles/bootstrap4.css";
@import "../node_modules/@syncfusion/ej2-lists/styles/bootstrap4.css";
@import "../node_modules/@syncfusion/ej2-popups/styles/bootstrap4.css";
@import "../node_modules/@syncfusion/ej2-splitbuttons/styles/bootstrap4.css";
@import "../node_modules/@syncfusion/ej2-grids/styles/bootstrap4.css";
@import "../node_modules/@syncfusion/ej2-vue-popups/styles/bootstrap4.css";
@import "../node_modules/@syncfusion/ej2-dropdowns/styles/bootstrap4.css";
@import "../node_modules/@syncfusion/ej2-vue-diagrams/styles/bootstrap4.css";
@import "../node_modules/@syncfusion/ej2-vue-layouts/styles/bootstrap4.css";

@font-face {
  font-family: "Lato";
  src: local("Lato"),
  url(/fonts/Lato/Lato-Regular.ttf) format("truetype");
}

body {
  font-family: Lato, Roboto, Open Sans, serif !important;
}

.v-application {
  font-family: Lato, Roboto, Open Sans, serif !important;
}

</style>
