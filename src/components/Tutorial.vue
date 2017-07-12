<template>
	<div class="wrapper">
		<v-touch @swipeleft="changeOnboarding('second')" class="onboarding text" v-if="currentOnboarding === 'first'">
			<div class="content-body">
				<div class="onboarding-first-text">
					<div>Your Service Advisor,</div>
					<div>Dennis Smith has</div>
					<span class="onboarding-first-text-highlight blue">
						{{ this.$root.inspectionCounts.failCount + this.$root.inspectionCounts.warningCount }} recommendations
					</span>
					<div>for your 2014 Altima.</div>
				</div>
				<img class="onboarding-first-image" src="../assets/images/guy.png">
				<div class="onboarding-first-bottom pad-t-b" v-for="count in inspectionCounts">
					<img :src="count.image">
					<span> {{ count.count }} - {{ count.text }} </span>
				</div>
			</div>
			<div class="footer">
				<button @click="changeOnboarding('second')" class="button btn red"> CONTINUE </button>
			</div>
		</v-touch>

		<v-touch @swipeleft="changeOnboarding('third')" @swiperight="changeOnboarding('first')" class="onboarding text" v-if="currentOnboarding === 'second'">
			<div class="content-body">
				<div class="timer-info">
					<img src="../assets/images/clock.png">
					<div class="timer-page-text">
						<div>Select your services in</div>
						<div id="timer">
							{{ timer.hours }}
							<span class="timer-text">h</span>
							{{ timer.minutes }}
							<span class="timer-text">m</span>
							{{ timer.seconds }}
							<span class="timer-text">s</span>
						</div>
						<div>to have your car ready</div>
						<div class="onboarding-second-bottom blue">by <span class="blue-time">4:00PM </span> today!</div>
					</div>
				</div>
			</div>
			<div class="footer">
				<button @click="changeOnboarding('third')" class="button btn red"> CONTINUE </button>
			</div>
		</v-touch>

		<v-touch @swipeleft="changeOnboarding('fourth')" @swiperight="changeOnboarding('second')" class="onboarding text" v-if="currentOnboarding === 'third'">
			<div class="content-body">
				<div class="onboarding-third-text pad-t-b">HELP IS ALWAYS A CLICK AWAY!</div>
				<img src="../assets/images/page-3b.png">
			</div>
			<div class="footer">
				<button @click="changeOnboarding('fourth')" class="button btn red"> CONTINUE </button>
			</div>
		</v-touch>

		<v-touch @swipeleft="finishTutorial()" @swiperight="changeOnboarding('third')" class="onboarding text" v-if="currentOnboarding === 'fourth'">
			<div class="content-body">
				<div class="onboarding-fourth-text">APPROVE SERVICES</div>
				<img src="../assets/images/page-4b.png">
			</div>
			<div class="footer">
				<button class="button btn red" @click="finishTutorial()"> CONTINUE </button>
			</div>
		</v-touch>
	</div>
</template>

<script>
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
				{text: 'SAFETY CONCERNS', count: this.$root.inspectionCounts.failCount, image: require('../assets/images/fail.png')},
				{text: 'NEEDS ATTENTION', count: this.$root.inspectionCounts.warningCount, image: require('../assets/images/warning.png')}
			],
			timer: ''
		}
	},
	created () {
		if (localStorage.getItem('verificationCode') === null) {
			this.$router.push({name: 'code'})
			return
		}

		this.initTimer()
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
		 * @param {string} val - The value of the onboarding step to move to
		 * @returns {undefined}
		 */
		changeOnboarding (val) {
			this.currentOnboarding = val
		},
		/**
		 * To initialize the timer
		 * @function
		 * @returns {undefined}
		 */
		initTimer () {
			let now = new Date()
			let deadline = new Date().setHours(now.getHours() + 2)
			let timeInterval = setInterval(() => {
				this.timer = getTimeRemaining(deadline)
				if (this.timer.total <= 0) {
					clearInterval(timeInterval)
				}
			}, 1000)
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper {
	text-transform: uppercase;
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
@media (min-width: 600px) {
	.content-body{
		padding-top:60px;
		min-height:530px;
	}
	.wrapper {
		position:fixed
	}
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
.button:hover {
	cursor:pointer;
	background-color: #aa0000;
}
.onboarding {
	position: relative;
	background-color: #fff;
	height: 100vh;
	width: 100%;
}
.timer-page-text {
	color: #000;
	font-size: 16px;
	font-weight:600;
}
.timer-page-text .blue {
	color: #000;
}
.timer-info {
	padding-top: 50px;
}
#timer {
	/*font-family: 'Open Sans';*/
	font-weight: 700;
	font-size: 24px;
	color: #0067B1;
	padding-top: 15px;
	padding-bottom: 15px;
}
#timer span {
	color: #000;
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
	font-weight: 600;
	margin-top: 20px;
	margin-bottom: 20px;
}
.onboarding-first-text-highlight {
	font-size: 24px;
	font-weight: 700;
}
.onboarding-first-image {
	width: 50%;
	height: 50%;
	margin-bottom: 20px;
}
.onboarding-first-bottom {
	font-size: 16px;
	font-weight: 600;
}
.onboarding-first-bottom img {
	width: 30px;
	position: relative;
	left: 0;
	top: 6px;
}
.onboarding-second-bottom {
	font-size: 16px;
	font-weight: 600;
}
.onboarding-third-text {
	font-size: 16px;
	font-weight: 600;
	padding-top: 50px;
	padding-bottom: 67px;
}
.onboarding-fourth-text {
	font-size: 16px;
	font-weight: 600;
	padding-top: 50px;
}
.timer-text {
	text-transform: lowercase;
	color: black;
}
</style>
