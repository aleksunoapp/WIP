// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueTouch from 'vue-touch'
VueTouch.config.swipe = {
	direction: 'horizontal'
}
Vue.use(VueTouch, {name: 'v-touch'})

Vue.config.productionTip = false
require('./assets/css/style.css')

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	template: '<App/>',
	components: { App },
	data () {
		return {
			meta: [],
			inspection: [],
			services: [],
			serviceDetails: [],
			inspectionCounts: {},
			total: 0,
			token: '',
			accessToken: '',
			dealer: false,
			mobile: false,
			userActivity: []
		}
	},
	methods: {
		log (message) {
			let d = new Date()
			d = d.toString()
			this.$root.userActivity.push(`${d} || ${message}`)
		}
	}
})
