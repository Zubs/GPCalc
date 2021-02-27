<template>
	<v-card>
		<v-toolbar dark color="primary">
			<v-btn icon dark @click="showInfo = false">
				<v-icon>mdi-close</v-icon>
			</v-btn>
			<v-toolbar-title>How We Calculate The GP</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-toolbar-title class="mr-5 red--text">{{ inputs ? "Real Data" : "Test Data" }}</v-toolbar-title>
		</v-toolbar>
		<v-card-text class="pa-5 ma-5">
			<h3>First, we have a table of values</h3>
			<v-data-table :headers="headers" :items-per-page="10" :items="items" v-if="inputs"></v-data-table>
			<v-data-table :headers="headers" :items-per-page="10" :items="items" v-else></v-data-table>
		</v-card-text>
	</v-card>
</template>

<script>
	export default {
		data () {
			return {
				showInfo: this.$root.showInfo,
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
						{},
						{},
						{},
						{}
					],
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
							grade: item.points.letter,
						});
					});
				} else {
					let randomIndex = this.getRandomNumber(0, 3);
					this.items = this.sampleData[randomIndex];

					alert(randomIndex);
				}
			},

			getRandomNumber (min, max) {
				return Math.floor(Math.random() * (max - min) + min);
			}
		},

		mounted () {
			this.makeTable();
		}
	}
</script>