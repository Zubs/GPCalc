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
      <v-btn icon class="mr-5 hidden-md-and-up" @click="showInfo = true">
        <v-icon>mdi-information-variant</v-icon>
      </v-btn>
      <v-btn text rounded @click="showInfo = true" class="hidden-sm-and-down"><v-icon left>mdi-information-variant</v-icon>How We Calculate Your GP</v-btn>
    </v-app-bar>

    <v-main>
      <GPCalc></GPCalc>
    </v-main>

    <v-dialog v-model="showInfo" fullscreen hide-overlay transition="dialog-bottom-transition">
      <HowWeCalc></HowWeCalc>
    </v-dialog>

    <v-footer padless app color="primary" dark>
      <v-col class="text-center" cols="12">{{ new Date().getFullYear() }} — <v-btn text rounded dark color="red" href="https://zubs.github.io" target="_blank">Zubair</v-btn></v-col>
    </v-footer>
  </v-app>
</template>

<script>
import GPCalc from './components/GPCalc';
import HowWeCalc from './components/HowWeCalc';

export default {
  name: 'App',

  components: {
    GPCalc,
    HowWeCalc
  },

  data () {
    return {
      showInfo: this.$root.showInfo,
    }
  }
};
</script>
