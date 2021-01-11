<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-form ref="data">
          <v-row>
            <v-col cols="12" md="3" v-for="(item, i) in inputs" :key="i">
              <v-text-field label="Course" dense v-model="item.course" :rules="courseRules"></v-text-field>
              <v-text-field label="Units" dense v-model="item.units" :rules="unitsRules" type="number" min="0" max="999"></v-text-field>
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

    <v-dialog v-model="output" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Results</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="6">Number Of Courses:</v-col>
              <v-col cols="6">{{ this.inputs.length }}</v-col>
              <v-col cols="6">Sum Of Units:</v-col>
              <v-col cols="6">{{ sumOfUnits }}</v-col>
              <v-col cols="6"><b>Final GP:</b></v-col>
              <v-col cols="6">{{ this.$root.gp.toFixed(2) }}</v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
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

        sumOfUnits: 0,

        sumOfGrades: 0,

        output: false,

        courseRules: [
          value => (value || '').length <= 20 || 'Max 20 characters',
        ],

        unitsRules: [
          value => !!value || 'Required.',
          value => (value || '').length <= 3 || 'Max 3 characters',
        ]
      }
    },

    methods: {
      Calculate () {
        if (this.$refs.data.validate()) {
          console.log(this.inputs);

          this.sumOfUnits = 0;
          this.sumOfGrades = 0;

          // Sum units
          this.inputs.forEach((item) => {
            this.sumOfUnits = parseInt(this.sumOfUnits) + parseInt(item.units)
          });

          // Get Gp
          this.inputs.forEach((item) => {
            if (item.points.score) {
              this.sumOfGrades = parseInt(this.sumOfGrades) + parseInt(item.points.score) * parseInt(item.units)
            } else {
              this.sumOfGrades = parseInt(this.sumOfGrades) + parseInt(item.points) * parseInt(item.units)
            }
          });

          // sum(unit * grade) / sum(unit)

          this.$root.gp = this.sumOfGrades / this.sumOfUnits;
          this.output = true;
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
