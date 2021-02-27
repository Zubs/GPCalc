import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

new Vue({
	vuetify,
	data: {
		showInfo: false,
		inputs: null,
	},
	render: h => h(App)
}).$mount('#app')