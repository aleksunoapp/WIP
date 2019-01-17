<template>
	<div class="wrapper">
		<v-touch @swipeleft="changeOnboarding('left')" class="onboarding text" v-if="currentOnboarding === 'first'">
			<div class="content-body">
				<div class="onboarding-first-text">
					<div>{{ langTerms.your_service_advisor[$root.meta.local.toLowerCase()] }},</div>
					<div><b>{{ $root.meta.advisor.advisorName }}</b>, {{ langTerms.has[$root.meta.local.toLowerCase()] }}</div>
					<span class="onboarding-first-text-highlight blue">
						{{ this.$root.inspectionCounts.concernCount + this.$root.inspectionCounts.failCount + this.$root.inspectionCounts.warningCount }} {{ langTerms.recommendations[$root.meta.local.toLowerCase()] }}
					</span>
					<div>{{ langTerms.for_your[$root.meta.local.toLowerCase()] }} <b>{{ $root.meta.carDescription }}.</b></div>
				</div>
				<img class="onboarding-first-image" :src="$root.meta.advisor.advisorImageUrl">
				<div class="onboarding-first-break">{{ langTerms.there_are[$root.meta.local.toLowerCase()] }}:</div>
				<div class="onboarding-first-bottom" v-for="(count, i) in inspectionCounts" :key="i">
					<img :src="count.image">
					<div class="onboarding-first-bottom-text"><b> {{ count.count }} {{ count.text }} </b></div>
				</div>
			</div>
			<div class="footer">
				<button @click="changeOnboarding('left')" class="button btn red"> {{ langTerms.continue[$root.meta.local.toLowerCase()] }} </button>
			</div>
		</v-touch>

		<v-touch @swipeleft="finishTutorial()" class="onboarding text" v-if="currentOnboarding === 'second'">
			<div class="content-body">
				<div class="timer-info">
					<img src="../assets/images/clock.png">
					<div class="timer-page-text">
						<div>{{ langTerms.select_your_services_in[$root.meta.local.toLowerCase()] }}</div>
						<div id="timer">
							<span v-if="timer.days > 0">{{ timer.days }}</span>
							<span v-if="timer.days > 0" class="timer-text">d</span>
							{{ timer.hours }}
							<span class="timer-text">h</span>
							{{ timer.minutes }}
							<span class="timer-text">m</span>
							{{ timer.seconds }}
							<span class="timer-text">s</span>
						</div>
						<div>{{ langTerms.to_have_your_vehicle[$root.meta.local.toLowerCase()] }}</div>
						<div class="onboarding-second-bottom">{{ formatTime(this.$root.meta.promise) }}!</div>
					</div>
				</div>
			</div>
			<div class="footer">
				<button @click="finishTutorial()" class="button btn red"> {{ langTerms.continue[$root.meta.local.toLowerCase()] }} </button>
			</div>
		</v-touch>
	</div>
</template>

<script>
import $ from 'jquery'

let allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

/**
 * To get the time remaining in the countdown
 * @param {string} endtime - The endtime of the countdown
 * @function
 * @returns {undefined}
 */
const getTimeRemaining = endtime => {
	let t = endtime - new Date()
	let seconds = Math.floor((t / 1000) % 60)
	let minutes = Math.floor((t / 1000 / 60) % 60)
	let hours = Math.floor((t / (1000 * 60 * 60)) % 24)
	let days = Math.floor(t / (1000 * 60 * 60 * 24))
	return {
		'total': t,
		'days': days,
		'hours': hours,
		'minutes': minutes,
		'seconds': seconds
	}
}

export default {
	data () {
		return {
			currentOnboarding: 'first',
			inspectionCounts: [
				{text: this.toTitleCase(this.$root.meta.customerConcernsLabel), count: this.$root.inspectionCounts.concernCount, image: require('../assets/images/concern.png')},
				{text: this.toTitleCase(this.$root.serviceCategories[1].name), count: this.$root.inspectionCounts.failCount, image: require('../assets/images/fail.png')},
				{text: this.toTitleCase(this.$root.serviceCategories[2].name), count: this.$root.inspectionCounts.warningCount, image: require('../assets/images/warning.png')}
			],
			timer: '',
			timeExpired: false,
			langTerms: {
				your_service_advisor: {
					'en-ca': 'Your service advisor',
					'en-us': 'Your service advisor',
					'fr-ca': 'Votre conseiller au service',
					'es-mx': 'Su asesor de servicio'
				},
				has: {
					'en-ca': 'has',
					'en-us': 'has',
					'fr-ca': 'a',
					'es-mx': 'tiene'
				},
				recommendations: {
					'en-ca': 'RECOMMENDATIONS',
					'en-us': 'RECOMMENDATIONS',
					'fr-ca': 'RECOMMANDATIONS',
					'es-mx': 'RECOMENDACIONES'
				},
				for_your: {
					'en-ca': 'for your',
					'en-us': 'for your',
					'fr-ca': 'pour votre',
					'es-mx': 'para su'
				},
				there_are: {
					'en-ca': 'There are',
					'en-us': 'There are',
					'fr-ca': 'Elles sont',
					'es-mx': 'Estas son'
				},
				continue: {
					'en-ca': 'CONTINUE',
					'en-us': 'CONTINUE',
					'fr-ca': 'SUIVANT',
					'es-mx': 'CONTINUAR'
				},
				select_your_services_in: {
					'en-ca': 'Select your services in',
					'en-us': 'Select your services in',
					'fr-ca': 'Sélectionnez vos services dans',
					'es-mx': 'Para seleccionar su servicio, tendra'
				},
				to_have_your_vehicle: {
					'en-ca': 'To have your vehicle ready by',
					'en-us': 'To have your vehicle ready by',
					'fr-ca': 'Pour que votre véhicule soit prêt pour',
					'es-mx': 'Y tendra su vehículo listo'
				},
				today: {
					'en-ca': 'today',
					'en-us': 'today',
					'fr-ca': 'aujourd\'hui',
					'es-mx': 'hoy'
				},
				on: {
					'en-ca': 'on',
					'en-us': 'on',
					'fr-ca': 'le',
					'es-mx': 'el'
				}
			}
		}
	},
	created () {
		if (this.$root.meta.expired) {
			this.$router.push('/')
		}
		$('html, body').scrollTop(0)

		this.initTimer()

		let dateConst = new Date()
		let responseDate = new Date(this.$root.meta.responseBy)
		this.timeExpired = responseDate < dateConst

		this.$root.logTutorialDuration(this.currentOnboarding)
	},
	destroyed () {
		this.$root.logTutorialDuration(this.currentOnboarding)
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
			} else if (this.$root.meta.local.toLowerCase() === 'es-mx') {
				preposition = 'el'
			}

			if (
				this.$root.meta.local.toLowerCase() === 'en-ca' ||
				this.$root.meta.local.toLowerCase() === 'en-us' ||
				this.$root.meta.local.toLowerCase() === 'es-mx'
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
			} else if (this.$root.meta.local.toLowerCase() === 'es-mx') {
				allMonths = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
			}
			if (this.checkSameDate(time)) {
				if (this.$root.meta.local.toLowerCase() === 'es-mx') {
					formattedTime = ` ${this.langTerms.today[this.$root.meta.local.toLowerCase()]} a las ${formattedTime}`
				} else {
					formattedTime += ` ${this.langTerms.today[this.$root.meta.local.toLowerCase()]}`
				}
			} else {
				if (this.$root.meta.local.toLowerCase() === 'es-mx') {
					formattedTime = ` ${preposition} ${fullDate.getDate()} de ${allMonths[fullDate.getMonth()]} de ${fullDate.getFullYear()} a las ${formattedTime}`
				} else {
					formattedTime += ` ${preposition} ${allMonths[fullDate.getMonth()]} ${fullDate.getDate()}, ${fullDate.getFullYear()}`
				}
			}
			return formattedTime
		},
		/**
		 * To capitalize the first letter of every word in a string
		 * @function
		 * @param {string} str - The string to be reformatted
		 * @returns {string} - The formatted string
		 */
		toTitleCase (str) {
			if (typeof str !== 'string') return ''
			return str.replace(/\w\S*/g, (txt) => { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })
		},
		/**
		 * To complete the tutorial and move to the inspection route
		 * @function
		 * @returns {undefined}
		 */
		finishTutorial () {
			this.$router.push({name: 'inspection'})
		},
		/**
		 * To move to the next or previous onboarding step
		 * @function
		 * @param {string} direction - The direction in which the user 'swiped' (clicking the `CONTINUE` button is reigisted as a swipe left)
		 * @returns {undefined}
		 */
		changeOnboarding (direction) {
			// Skip tutorial if dealer is logging in
			if (this.$root.dealer) {
				this.$router.push({name: 'inspection'})
				return
			}

			switch (this.currentOnboarding) {
			case 'first':
				if (direction === 'left') {
					this.$root.logTutorialDuration(this.currentOnboarding)
					if (this.timeExpired) {
						this.finishTutorial()
					} else {
						this.currentOnboarding = 'second'
					}
					this.$root.logTutorialDuration(this.currentOnboarding)
				}
				break

			case 'second':
				if (direction === 'right') {
					this.$root.logTutorialDuration(this.currentOnboarding)
					this.currentOnboarding = 'first'
					this.$root.logTutorialDuration(this.currentOnboarding)
				}
				break

			default:
				// Do nothing
			}
		},
		/**
		 * To initialize the timer
		 * @function
		 * @returns {undefined}
		 */
		initTimer () {
			let deadline = new Date(this.$root.meta.responseBy)
			let timeInterval = setInterval(() => {
				this.timer = getTimeRemaining(deadline)
				if (this.timer.total <= 0) {
					clearInterval(timeInterval)
					this.timer.days = 0
					this.timer.hours = 0
					this.timer.minutes = 0
					this.timer.seconds = 0
				}
			}, 1000)
		},
		/**
		 * To check whether a time is today or on a future date
		 * @function
		 * @param {string} time - The time to check
		 * @returns {boolean} - Whether or not it's today
		 */
		checkSameDate (time) {
			let checkDate = new Date(time)
			let now = new Date()

			return checkDate.getFullYear() === now.getFullYear() && checkDate.getMonth() === now.getMonth() && checkDate.getDate() === now.getDate()
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper {
	max-width: 414px;
	overflow: hidden;
	margin-left: auto;
	margin-right: auto;
	left: 0;
	right: 0;
}
.text {
	color: #000;
}
.pad-t-b {
	padding-top:5px;
}
.blue {
	color:#2A5EB8;
}
.blue-time {
	color: #0067B1;
	font-weight: 700;
	font-size: 24px;
}
.footer {
	max-width: 414px;
	min-width: 320px;
	/* position: fixed; */
	margin-left: auto;
	margin-top: 55px;
	margin-right: auto;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #fff;
}
.button {
	width:80%;
	height:60px;
	font-size: 24px;
	text-transform: uppercase;
	color: #fff;
	background-color: #c3002f;
	padding: 8px 0;
	margin-bottom:32px;
	cursor: pointer;
}

@media (max-height: 530px) {
	.button {
		margin-bottom: 10px;
	}
}

.button:hover {
	cursor:pointer;
	background-color: #aa0000;
}
#timer {
	/*font-family: 'Open Sans';*/
	font-weight: 700;
	font-size: 24px;
	color: #0067B1;
	padding-top: 15px;
	padding-bottom: 15px;
}
.onboarding-button {
	color: #fff;
	background-color: #c71444;
	padding: 18px;
	width: 68%;
	position: absolute;
	bottom: 67px;
	left: 50%;
	transform: translate(-50%);
}
.onboarding-first-text {
	font-size: 16px;
	margin-top: 20px;
	margin-bottom: 20px;
}

@media (max-height: 495px) {
	.onboarding-first-text {
		margin-bottom: 10px;
	}
}

.onboarding-first-text-highlight {
	font-size: 24px;
	font-weight: 700;
}
.onboarding-first-image {
	width: 50%;
	height: 50%;
}

@media (max-height: 495px) {
	.onboarding-first-image {
		width: 30%;
		height: 30%;
	}
}

.onboarding-first-break {
	margin-bottom: 20px;
}

@media (max-height: 450px) {
	.onboarding-first-break {
		margin-bottom: 10px;
	}
}

.onboarding-first-bottom {
	text-align: left;
	font-size: 16px;
	font-weight: 600;
	width: 70%;
	min-width: 275px;
	margin: 0 auto 5px;
	position: relative;
}
.onboarding-first-bottom img {
	width: 25px;
	position: absolute;
	left: 0;
	top: calc(50% - 13px);
	margin-right: 10px;
	display: inline-block;
}
.onboarding-first-bottom-text {
	margin-left: 40px;
}
.onboarding-second-bottom {
	font-size: 16px;
	font-weight: bold;
}
.onboarding-third-text {
	font-size: 16px;
}
.onboarding-fourth-text {
	font-size: 16px;
	padding-top: 15px;
}
.timer-text {
	text-transform: lowercase;
	color: black;
}
.forced-size-image {
	max-height: calc(100vh - 160px);
}
@media (min-width: 600px) {
	.content-body {
		padding-top: 10px;
	}
	.wrapper {
		position: relative;
	}
	.forced-size-image {
		max-height: calc(100vh - 92px);
	}
}
</style>
