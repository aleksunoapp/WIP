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
			userActivity: {
				clientId: this.$root.token,
				eventTracker: [],
				pageDurations: {
					home: null,
					tutorialSlide: {
						first: null,
						second: null,
						third: null
					},
					inspection: null,
					services: null,
					infoPopup: []
				}
			},
			previousDuration: 0
		}
	},
	methods: {
		logEvent (eventDescription) {
			let eventObject = {
				'page': this.$route.name,
				'event': eventDescription
			}
			this.$root.$data.userActivity.eventTracker.push(eventObject)
		},
		logError (eventDescription) {
			let eventObject = {
				'page': this.$route.name,
				'error': eventDescription
			}
			this.$root.$data.userActivity.eventTracker.push(eventObject)
		},
		logPageDuration (pageName) {
			if (this.$root.$data.userActivity.pageDurations[pageName] === null) {
				this.$root.$data.userActivity.pageDurations[pageName] = Date.now()
			} else if (this.$root.$data.userActivity.pageDurations[pageName] < 1000000000000) {
				return
			} else {
				this.$root.$data.userActivity.pageDurations[pageName] = Date.now() - this.$root.$data.userActivity.pageDurations[pageName] + this.previousDuration
			}
		},
		logTutorialDuration (slideNumber) {
			if (this.$root.$data.userActivity.pageDurations.tutorialSlide[slideNumber] === null) {
				this.$root.$data.userActivity.pageDurations.tutorialSlide[slideNumber] = Date.now()
			} else {
				this.$root.$data.userActivity.pageDurations.tutorialSlide[slideNumber] = Date.now() - this.$root.$data.userActivity.pageDurations.tutorialSlide[slideNumber]
			}
		},
		logInfoPopupDuration (id) {
			let popup = this.$root.$data.userActivity.pageDurations.infoPopup.find(x => x.id === id)
			if (popup === undefined) {
				this.$root.$data.userActivity.pageDurations.infoPopup.push({id: id, duration: null})
				popup = this.$root.$data.userActivity.pageDurations.infoPopup.find(x => x.id === id)
			}
			if (popup.duration === null) {
				popup.duration = Date.now()
			} else {
				popup.duration = Date.now() - popup.duration
			}
		}
	}
})
