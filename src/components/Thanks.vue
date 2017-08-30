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
				Thanks for your time.
			</div>
			<div class="ready-box" v-if="!timeExpired">Your car will be ready {{ computedPromiseTime }}</div>
			<div class="thanks-confirm-text">
				I will confirm with you when your vehicle is ready.
			</div>
		</div>
		<img class="profile" :src="this.$root.meta.advisor.advisorImageUrl">
		<div class="mechanic-name">
			{{ this.$root.meta.advisor.advisorName }}
		</div>
		<div class="mechanic-title">
			Service Advisor
		</div>
		<div>
			<img :src="this.$root.meta.carImageUrl">
		</div>
	</div>
</template>

<script>
import $ from 'jquery'

export default {
	data () {
		return {
			timeExpired: false
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

		document.cookie = `userActivity=${JSON.stringify(this.$root.$data.userActivity)}`
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
			let meridian = 'AM'
			let formattedDate = ''
			let weekday = fullDate.getDate()
			let monthIndex = fullDate.getMonth()
			const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

			if (hour === 12) {
				meridian = 'PM'
			} else if (hour > 12) {
				meridian = 'PM'
				hour -= 12
			} else if (hour === 0) {
				hour = 12
			}

			if (minutes === 0) {
				minutes = '00'
			} else if (minutes < 10) {
				minutes = '0' + minutes
			}

			formattedTime = 'at ' + hour + ':' + minutes + ' ' + meridian

			formattedDate = 'on ' + weekday + ' ' + monthNames[monthIndex]

			if (fullDate - new Date() > 86400000) {
				return formattedDate
			} else {
				return formattedTime
			}
		}
	}
}
</script>
