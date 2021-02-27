<template>
	<v-card>
		<v-toolbar dark color="primary">
			<v-btn icon dark @click="showInfo = false">
				<v-icon>mdi-close</v-icon>
			</v-btn>
			<v-toolbar-title>How We Calculate The GP</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-toolbar-title class="mr-5 red--text hidden-sm-and-down">{{ inputs ? "Real Data" : "Test Data" }}</v-toolbar-title>
		</v-toolbar>
		<v-card-text class="pa-5 ma-5">
			<h2>First, we have a table of values</h2>
			<v-data-table :headers="headers" :items-per-page="10" :items="items" v-if="inputs"></v-data-table>
			<v-data-table :headers="headers" :items-per-page="10" :items="items" v-else></v-data-table>
			<h3>Next, We Sum The Units</h3>
			<h3>Total Units: <span v-for="(item, i) in items" :key="i">{{ item.unit }} {{ items.length - 1 == i ? "" : "+ " }}</span> = {{ sumOfUnits }}</h3>
			<h3 class="mt-3">Now, We Can Get The Points Of The Courses</h3>
			<h3>Total Points (Unit x Grade): <span v-for="(item, i) in items" :key="i">{{ item.unit }} x {{ getGradeScore(item.grade) }} {{ items.length - 1 == i ? "" : "+ " }}</span> = {{ sumOfGrades }}</h3>
			<h3 class="mt-3">Finally, We Get The GP By Dividing The Sum Of Points By The Sum Of Units</h3>
			<h3>GP: Total Points ({{sumOfGrades}}) / Total Units ({{sumOfUnits}}) = {{ gp }}</h3>
		</v-card-text>
	</v-card>
</template>

<script>
	export default {
		data () {
			return {
				showInfo: this.$root.showInfo,
				sumOfUnits: 0,
				sumOfGrades: 0,
				gp: 0,
				headers: [
					{
						text: 'Course',
						value: 'course',
					},
					{
						text: 'Unit',
						value: 'unit',
					},
					{
						text: 'Grade',
						value: 'grade',
					}
				],
				items: [],
				inputs: this.$root.inputs,
				sampleData: [
					[
						{
							course: "FSC 112",
							unit: 3,
							grade: "A"
						},
						{
							course: "FSC 115",
							unit: 3,
							grade: "B"
						},
						{
							course: "GEG 113",
							unit: 3,
							grade: "C"
						},
						{
							course: "GEG 115",
							unit: 2,
							grade: "D"
						},
					],
					[
						{
							course: "GEG 117",
							unit: 2,
							grade: "E"
						},
						{
							course: "GST 102",
							unit: 2,
							grade: "F"
						},
						{
							course: "GST 105",
							unit: 2,
							grade: "A"
						},
						{
							course: "MEG 111",
							unit: 1,
							grade: "B"
						},
					],
					[
						{
							course: "FSC 112",
							unit: 3,
							grade: "C"
						},
						{
							course: "FSC 115",
							unit: 3,
							grade: "D"
						},
						{
							course: "GEG 113",
							unit: 3,
							grade: "D"
						},
						{
							course: "GEG 115",
							unit: 2,
							grade: "E"
						},
					],
					[
						{
							course: "GEG 117",
							unit: 2,
							grade: "F"
						},
						{
							course: "GST 102",
							unit: 2,
							grade: "A"
						},
						{
							course: "GST 105",
							unit: 2,
							grade: "B"
						},
						{
							course: "MEG 111",
							unit: 1,
							grade: "C"
						},
					]
				],
			}
		},

		methods: {
			makeTable () {
				if (this.inputs) {
					this.inputs.forEach((item) => {
						this.items.push({
							course: item.course,
							unit: item.units,
							grade: this.getGrade(item.points.letter ?? item.points),
						});
					});
				} else {
					let randomIndex = this.getRandomNumber(0, 3);
					this.items = this.sampleData[randomIndex];
				}

				this.sumUnits();
				this.sumGrades();

				this.setGP();
			},

			getRandomNumber (min, max) {
				return Math.floor(Math.random() * (max - min) + min);
			},

			sumUnits () {
				this.items.forEach((item) => {
					this.sumOfUnits = parseInt(this.sumOfUnits) + parseInt(item.unit);
				});
			},

			setGP () {
				if (this.$root.gp) {
					this.gp = this.$root.gp;
				} else {
					let gp = this.sumOfGrades / this.sumOfUnits;
					this.gp = gp.toFixed(2);
				}
			},

			getGradeScore (grade) {
				if (grade == "A" || grade == 5) {
					return 5;
				} else if (grade == "B" || grade == 4) {
					return 4;
				} else if (grade == "C" || grade == 3) {
					return 3;
				} else if (grade == "D" || grade == 2) {
					return 2;
				} else if (grade == "E" || grade == 1) {
					return 1;
				} else {
					return 0;
				}
			},

			getGrade (grade) {
				if (grade == "A" || grade == 5) {
					return "A";
				} else if (grade == "B" || grade == 4) {
					return "B";
				} else if (grade == "C" || grade == 3) {
					return "C";
				} else if (grade == "D" || grade == 2) {
					return "D";
				} else if (grade == "E" || grade == 1) {
					return "E";
				} else {
					return "F";
				}
			},

			sumGrades () {
				this.items.forEach((item) => {
					this.sumOfGrades = parseInt(this.sumOfGrades) + parseInt(item.unit) * parseInt(this.getGradeScore(item.grade));
				});
			}
		},

		mounted () {
			this.makeTable();
		}
	}
</script>