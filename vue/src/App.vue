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
    </v-app-bar>

    <v-main>
      <v-sheet>
        <v-card-title>
          <h1>GP:</h1>
          <v-spacer></v-spacer>
          <h1>{{ this.$root.gp }}</h1>
        </v-card-title>
      </v-sheet>
      <GPCalc></GPCalc>
    </v-main>

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
    //
  }),
};
</script>
