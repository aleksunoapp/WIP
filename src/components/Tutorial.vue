<template>
	<div class="wrapper">
		<v-touch @swipeleft="changeOnboarding('left')" class="onboarding text" v-if="currentOnboarding === 'first'">
			<div class="content-body">
				<div class="onboarding-first-text">
					<div>Your service advisor,</div>
					<div><b>{{ $root.meta.advisor.advisorName }}</b>, has</div>
					<span class="onboarding-first-text-highlight blue">
						{{ this.$root.inspectionCounts.failCount + this.$root.inspectionCounts.warningCount }} RECOMMENDATIONS
					</span>
					<div>for your <b>{{ $root.meta.carDescription }}.</b></div>
				</div>
				<img class="onboarding-first-image" :src="$root.meta.advisor.advisorImageUrl">
				<div class="onboarding-first-break">There are:</div>
				<div class="onboarding-first-bottom" v-for="count in inspectionCounts">
					<img :src="count.image">
					<span><b> {{ count.count }} - {{ count.text }} </b></span>
				</div>
			</div>
			<div class="footer">
				<button @click="changeOnboarding('left')" class="button btn red"> CONTINUE </button>
			</div>
		</v-touch>

		<v-touch @swipeleft="finishTutorial()" class="onboarding text" v-if="currentOnboarding === 'second'">
			<div class="content-body">
				<div class="timer-info">
					<img src="../assets/images/clock.png">
					<div class="timer-page-text">
						<div>Select your services in</div>
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
						<div>To have your vehicle ready by</div>
						<div class="onboarding-second-bottom">{{ computedEndTimeFormat }} {{ (checkSameDate()) ? 'today' : 'on ' + formatPromiseDate }}!</div>
					</div>
				</div>
			</div>
			<div class="footer">
				<button @click="finishTutorial()" class="button btn red"> CONTINUE </button>
			</div>
		</v-touch>
	</div>
</template>

<script>
import $ from 'jquery'

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
				{text: 'Safety concerns', count: this.$root.inspectionCounts.failCount, image: require('../assets/images/fail.png')},
				{text: 'Items requiring attention', count: this.$root.inspectionCounts.warningCount, image: require('../assets/images/warning.png')}
			],
			timer: '',
			timeExpired: false
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
	computed: {
		/**
		 * To compute the format of time the customers car will be ready
		 * @function
		 * @returns {string} - The formatted time
		 */
		computedEndTimeFormat () {
			let formattedTime = ''
			let fullDate = new Date(this.$root.meta.promise)
			let hour = fullDate.getHours()
			let minutes = fullDate.getMinutes()
			let meridian = 'AM'

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

			formattedTime = hour + ':' + minutes + ' ' + meridian
			return formattedTime
		},
		/**
		 * To compute the format of date on which customers must approve by
		 * @function
		 * @returns {string} - The formatted date
		 */
		formatPromiseDate () {
			let promiseDate = new Date(this.$root.meta.promise)
			let allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
			let formattedDate = `${allMonths[promiseDate.getMonth()]} ${promiseDate.getDate()}, ${promiseDate.getFullYear()}`
			return formattedDate
		}
	},
	methods: {
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
		 * To check whether the promise date is today or a future date
		 * @function
		 * @returns {boolean} - Whether or not it is the same date
		 */
		checkSameDate () {
			let promiseDate = new Date(this.$root.meta.promise)
			let now = new Date()

			return promiseDate.getFullYear() === now.getFullYear() && promiseDate.getMonth() === now.getMonth() && promiseDate.getDate() === now.getDate()
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
	position: fixed;
	margin-left: auto;
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
}
.onboarding-first-bottom img {
	width: 25px;
	position: relative;
	left: 0;
	top: 6px;
	margin-right: 10px;
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
