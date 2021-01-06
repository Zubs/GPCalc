<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-form ref="data">
          <v-row>
            <v-col cols="12" md="3" v-for="(item, i) in inputs" :key="i">
              <v-text-field label="Course" dense v-model="item.course" :rules="courseRules"></v-text-field>
              <v-text-field label="Units" dense v-model="item.units" :rules="unitsRules"></v-text-field>
              <v-select label="Grade" dense v-model="item.points" :items="grades" item-text="letter" item-value="score" hint="Grade"></v-select>
            </v-col>
            <v-col cols="12" md="12">
              <v-btn color="primary" dark rounded @click="Calculate" class="mr-2">Calculate</v-btn>
              <v-btn color="primary" dark rounded @click="Add" elevation="24" fab absolute app bottom right large>
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>

    <v-dialog v-model="output"></v-dialog>
  </v-container>
</template>

<script>
  export default {
    name: 'GPCalc',

    data () {
      return {
        grades: [
          {
            letter: 'A',
            score: 5
          },
          {
            letter: 'B',
            score: 4
          },
          {
            letter: 'C',
            score: 3
          },
          {
            letter: 'D',
            score: 2
          },
          {
            letter: 'E',
            score: 1
          },
          {
            letter: 'F',
            score: 0
          },
        ],

        inputs: [
          {
            course: '',
            units: '',
            points: {
              letter: 'A',
              score: 5
            }
          }
        ],

        output: false,

        courseRules: [],

        unitsRules: [],
      }
    },

    methods: {
      Calculate () {
        if (this.$refs.data.validate()) {
          console.log(this.inputs);

          // sum(unit * grade) / sum(unit)
          let sumOfUnits = 0;

          console.log(sumOfUnits);

          this.$root.gp = this.inputs.length;
        }
      },

      Add () {
        let newRow = {
          course: '',
          units: '',
          points: {
            letter: 'A',
            score: 5
          }
        };

        this.inputs.push(newRow);
      }
    }
  }
</script>
