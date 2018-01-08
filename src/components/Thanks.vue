<template>
	<div class="wrapper thanks-page">
		<div class="nissan-logo">
			<img :src="this.$root.meta.topImageUrl">
		</div>
		<div class="regal-nissan-logo">
			<img :src="$root.meta.dealerContactInfo.logoUrl" v-if="$root.meta.dealerContactInfo.length">
			<h2 v-else>{{ $root.meta.dealerContactInfo.name }}</h2>
		</div>
		<div class="login-header">
			<div>
				{{ langTerms.thanks_for_your_time[$root.meta.local] }}
			</div>
			<div class="ready-box" v-if="!timeExpired">{{ langTerms.your_vehicle_is_estimated[$root.meta.local] }} <br />{{ computedPromiseTime }}</div>
			<div class="thanks-confirm-text">
				{{ langTerms.your_service_advisor_will_confirm[$root.meta.local] }}
			</div>
		</div>
		<img class="profile" :src="this.$root.meta.advisor.advisorImageUrl">
		<div class="mechanic-name">
			{{ this.$root.meta.advisor.advisorName }}
		</div>
		<div class="mechanic-title">
			{{ langTerms.service_advisor[$root.meta.local] }}
		</div>
		<div>
			<img :src="this.$root.meta.carImageUrl">
		</div>
	</div>
</template>

<script>
import $ from 'jquery'
import ENV from '../environment.js'

export default {
	data () {
		return {
			timeExpired: false,
			langTerms: {
				thanks_for_your_time: {
					en: 'Thanks for your time.',
					fr: 'Merci de votre temps.'
				},
				your_vehicle_is_estimated: {
					en: 'Your vehicle is estimated to be ready at',
					fr: 'Votre véhicule sera prêt, approximativement, à'
				},
				your_service_advisor_will_confirm: {
					en: 'Your Service Advisor will confirm with you when your vehicle is ready.',
					fr: 'Votre conseiller au service vous notifiera lorsque votre véhicule sera prêt.'
				},
				service_advisor: {
					en: 'Service Advisor',
					fr: 'Conseiller au service'
				}
			}
		}
	},
	created: function () {
		if (this.$root.meta.expired) {
			this.$router.push('/')
		}
		$('html, body').scrollTop(0)

		let dateConst = new Date()
		let responseDate = new Date(this.$root.meta.responseBy)
		this.timeExpired = responseDate < dateConst

		$.ajax({
			url: ENV.userActivityLogAPI,
			method: 'POST',
			data: JSON.stringify(this.$root.$data.userActivity)
		})
	},
	computed: {
		/**
		 * To compute the format of time the customers car will be ready
		 * @function
		 * @returns {string} - The formatted time
		 */
		computedPromiseTime () {
			let formattedTime = ''
			let fullDate = new Date(this.$root.meta.promise)
			let hour = fullDate.getHours()
			let minutes = fullDate.getMinutes()
			let meridian = 'am'
			let formattedDate = ''
			let day = fullDate.getDate()
			let monthIndex = fullDate.getMonth()
			let year = fullDate.getFullYear()
			const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
			let timeTillTomorrow = new Date().setHours(24, 0, 0, 0) - new Date()

			if (hour === 12) {
				meridian = 'pm'
			} else if (hour > 12) {
				meridian = 'pm'
				hour -= 12
			} else if (hour === 0) {
				hour = 12
			}

			if (minutes === 0) {
				minutes = '00'
			} else if (minutes < 10) {
				minutes = '0' + minutes
			}

			formattedTime = hour + ':' + minutes + meridian

			formattedDate = monthNames[monthIndex] + ' ' + day + ', ' + year

			if (fullDate - new Date() > timeTillTomorrow) {
				return 'on ' + formattedDate + ' at ' + formattedTime
			} else {
				return 'at ' + formattedTime
			}
		}
	}
}
</script>
