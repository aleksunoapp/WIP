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
				{{ langTerms.thanks_for_your_time[$root.meta.local.toLowerCase()] }}
			</div>
			<div class="ready-box" v-if="!timeExpired">{{ langTerms.your_vehicle_is_estimated[$root.meta.local.toLowerCase()] }} <br />{{ formatTime(this.$root.meta.promise) }}</div>
			<div class="thanks-confirm-text">
				{{ langTerms.your_service_advisor_will_confirm[$root.meta.local.toLowerCase()] }}
			</div>
		</div>
		<img class="profile" :src="this.$root.meta.advisor.advisorImageUrl">
		<div class="mechanic-name">
			{{ this.$root.meta.advisor.advisorName }}
		</div>
		<div class="mechanic-title">
			{{ langTerms.service_advisor[$root.meta.local.toLowerCase()] }}
		</div>
		<div>
			<img :src="this.$root.meta.carImageUrl">
		</div>
	</div>
</template>

<script>
import $ from 'jquery'
import ENV from '../environment.js'

let allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

export default {
	data () {
		return {
			timeExpired: false,
			langTerms: {
				thanks_for_your_time: {
					'en-ca': 'Thanks for your time.',
					'en-us': 'Thanks for your time.',
					'fr-ca': 'Merci de votre temps.',
					'es-us': 'Gracias por su tiempo.'
				},
				your_vehicle_is_estimated: {
					'en-ca': 'Your vehicle is estimated to be ready',
					'en-us': 'Your vehicle is estimated to be ready',
					'fr-ca': 'Votre véhicule sera prêt, approximativement',
					'es-us': 'Se estima que su vehículo estará listo'
				},
				your_service_advisor_will_confirm: {
					'en-ca': 'Your Service Advisor will confirm with you when your vehicle is ready.',
					'en-us': 'Your Service Advisor will confirm with you when your vehicle is ready.',
					'fr-ca': 'Votre conseiller au service vous notifiera lorsque votre véhicule sera prêt.',
					'es-us': 'Su Asesor de Servicio confirmará con usted cuando su vehículo esté listo.'
				},
				service_advisor: {
					'en-ca': 'Service Advisor',
					'en-us': 'Service Advisor',
					'fr-ca': 'Conseiller au service',
					'es-us': 'Asesor de Servicio'
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
	methods: {
		/**
		 * To format a time for the active locale
		 * @function
		 * @param {string} time - The time to format
		 * @returns {String} - A formatted string
		 */
		formatTime (time) {
			let formattedTime = ''
			let fullDate = new Date(time)
			let hour = fullDate.getHours()
			let minutes = fullDate.getMinutes()
			let meridian = 'AM'
			let preposition = 'on'
			if (this.$root.meta.local.toLowerCase() === 'fr-ca') {
				preposition = 'le'
			} else if (this.$root.meta.local.toLowerCase() === 'es-us') {
				preposition = 'el'
			}

			if (
				this.$root.meta.local.toLowerCase() === 'en-ca' ||
				this.$root.meta.local.toLowerCase() === 'en-us' ||
				this.$root.meta.local.toLowerCase() === 'es-us'
			) {
				if (hour === 12) {
					meridian = 'PM'
				} else if (hour > 12) {
					meridian = 'PM'
					hour -= 12
				} else if (hour === 0) {
					hour = 12
				}
			}

			if (minutes === 0) {
				minutes = '00'
			} else if (minutes < 10) {
				minutes = '0' + minutes
			}

			if (this.$root.meta.local.toLowerCase() === 'fr-ca') {
				formattedTime = hour + ' h ' + minutes
			} else {
				formattedTime = hour + ':' + minutes + ' ' + meridian
			}

			if (this.$root.meta.local.toLowerCase() === 'fr-ca') {
				allMonths = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juill.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
			} else if (this.$root.meta.local.toLowerCase() === 'es-us') {
				allMonths = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
			}
			if (!this.checkSameDate(time)) {
				if (this.$root.meta.local.toLowerCase() === 'es-us') {
					formattedTime = ` ${preposition} ${fullDate.getDate()} de ${allMonths[fullDate.getMonth()]} de ${fullDate.getFullYear()} a las ${formattedTime}`
				} else {
					formattedTime += ` ${preposition} ${allMonths[fullDate.getMonth()]} ${fullDate.getDate()}, ${fullDate.getFullYear()}`
				}
			}
			return formattedTime
		}
	}
}
</script>
