<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>
        <v-card-title>
          <h1>
            <span class="red--text">GP</span>
            <span class="yellow--text font-weight-light">Calc</span>
          </h1>
        </v-card-title>
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon class="mr-5" @click="showInfo = true">
        <v-icon>mdi-info</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <GPCalc></GPCalc>
    </v-main>

    <v-dialog v-model="showInfo" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="showInfo = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>How We Calculate The GP</v-toolbar-title>
        </v-toolbar>
        <v-card-text class="pa-5 ma-5">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit impedit saepe accusantium provident perferendis error, architecto deserunt doloribus, dolore magni? Quas ducimus voluptatem, modi minus excepturi deserunt iusto voluptatum, maiores.</p>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-footer padless app color="primary" dark>
      <v-col class="text-center" cols="12">{{ new Date().getFullYear() }} — <v-btn text rounded dark color="red" href="https://zubs.github.io" target="_blank">Zubair</v-btn></v-col>
    </v-footer>
  </v-app>
</template>

<script>
import GPCalc from './components/GPCalc';

export default {
  name: 'App',

  components: {
    GPCalc,
  },

  data: () => ({
    showInfo: false,
  }),
};
</script>
