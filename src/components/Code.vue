<template>
	<div v-if="!$root.dealer">
		<div class="wrapper" v-if="!linkExpired">
			<div class="nissan-logo">
				<img :src="$root.meta.topImageUrl">
			</div>
			<div class="regal-nissan-logo">
				<img :src="$root.meta.dealerContactInfo.logoUrl" v-if="$root.meta.dealerContactInfo.logoUrl.length">
				<h2 v-else>{{ $root.meta.dealerContactInfo.name }}</h2>
			</div>
			<div class="login-header">
				Vehicle Inspection Update
			</div>
			<form class="access-form" @submit.prevent="enterPasscode()">
				<label class="label">
					Please enter your 
					{{ $root.meta.authenticationHint.hintType === 1 ? 'email' : '' }} 
					{{ $root.meta.authenticationHint.hintType === 2 ? 'phone number' : '' }} 
					{{ $root.meta.authenticationHint.hintType === 3 ? 'last name' : '' }} 
					below:
				</label>
				<div>
					<input type="text" class="access-code" v-model="verificationCode" :placeholder="$root.meta.authenticationHint.hintText">
				</div>
				<div>
					<button class="enter-btn" type="submit">
						Enter
					</button>
				</div>
				<div>
					<img :src="$root.meta.carImageUrl">
				</div>
			</form>
		</div>
		<div v-else class="wrapper">
			<div class="onboarding">
				<div class="timer-info">
					<img src="../assets/images/clock.png">
					<div class="timer-page-text">
						<div>
							<p>We are sorry but this link has expired.</p>
							<p>Please contact the dealership for the status of your vehicle.</p>
						</div>
						<div v-if="$root.mobile" class="timer-page-no-timer">
							<div>
								<a :href="`sms:${$root.meta.dealerContactInfo.smsPhone}`" class="chat-icon"></a>
								<span>Text Dealership</span>
							</div>
							<div>
								<a :href="`tel:${$root.meta.dealerContactInfo.phone}`" class="contact-icon"></a>
								<span>Phone Dealership</span>
							</div>
						</div>
						<p v-else>You can call us at {{$root.meta.dealerContactInfo.phone}}.</p>
					</div>
				</div>
			</div>
		</div>
		<div class="modal" v-if="modalOpen">
			<div class="modal-window">
				<div @click="closeModal()" class="modal-close"></div>
				<div class="clear"></div>
				<div class="modal-content">
					<div class="modal-header">
						{{ modal.title }}
					</div>
					<div class="modal-message" v-if="!this.verificationCode.length">
						{{ modal.content }}
					</div>
					<div class="modal-message no-padding-bottom" v-else>
						<span v-html="modal.content"></span>
						<ul class="modal-list-options">
							<li><a @click="tryAgain()"><b>Try Again</b></a></li>
							<li v-if="$root.mobile"><a :href="`tel:${$root.meta.dealerContactInfo.phone}`" @click="$root.logEvent('Clicked Call Dealership')">Call Dealership</a></li>
							<li v-if="$root.mobile"><a :href="`sms:${$root.meta.dealerContactInfo.smsPhone}`" @click="$root.logEvent('Clicked Text Dealership')">Text Dealership</a></li>
						</ul>
						<p v-if="!$root.mobile" class="modal-list-phone">Call us at {{$root.meta.dealerContactInfo.phone}}</p>
					</div>
				</div>
			</div>
		</div>
		<error-message v-if="showErrorMessage" @closeErrorModal="closeErrorModal()"></error-message>
	</div>
</template>

<script>
import $ from 'jquery'
import ErrorMessage from './ErrorMessage'
import authenticateToken from '../mixins/authenticateToken.js'

export default {
	data () {
		return {
			verificationCode: '',
			modalOpen: false,
			modal: {
				title: '',
				content: ''
			},
			showErrorMessage: false
		}
	},
	created () {
		$('html, body').scrollTop(0)

		this.$root.logPageDuration('home')
	},
	destroyed () {
		this.$root.logPageDuration('home')
	},
	computed: {
		linkExpired () {
			let deadline = new Date(this.$root.meta.responseBy)
			let now = new Date()
			if (this.$root.meta.expired || now >= deadline) {
				return true
			} else {
				return false
			}
		}
	},
	methods: {
		/**
		 * To verify that the verificationCode is not empty and redirect to the authentication function
		 * @function
		 * @returns {undefined}
		 */
		enterPasscode () {
			if (!this.verificationCode.length) {
				this.$root.logError('Left passcode input empty')
				this.modalOpen = true
				this.modal.title = 'Error'
				this.modal.content = 'Please enter your access code.'
			} else {
				this.$root.logEvent('Entered a passcode')
				this.authenticateToken()
			}
		},
		/**
		 * To close the modal
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$root.logEvent('Closed error window')
			this.modalOpen = false
			this.modal = {
				title: '',
				content: ''
			}
		},
		/**
		 * To clear the input field and close the modal
		 * @function
		 * @returns {undefined}
		 */
		tryAgain () {
			this.$root.logEvent('Clicked "Try Again"')
			this.verificationCode = ''
			this.closeModal()
		},
		/**
		 * To close the error modal
		 * @function
		 * @returns {undefined}
		 */
		closeErrorModal () {
			this.$root.logEvent('Closed error message')
			this.showErrorMessage = false
		}
	},
	components: {
		ErrorMessage
	},
	mixins: [authenticateToken]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.modal {
	position: fixed;
	text-align: center;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	padding: 20px;
	box-sizing: border-box;
	background-color: rgba(255,255,255,0.5);
	z-index: 4;
	overflow: auto;
}
.modal-window {
	margin: auto;
	margin-top: 40px;
	max-width: 370px;
	background-color: #fff;
	z-index: 3;
	box-sizing: border-box;
	box-shadow: 0 0 10px rgba(0,0,0,0.5);
	border-radius: 5px;
}
.modal-close {
	float: right;
	margin-top: -30px;
	width: 20px;
	height: 20px;
	background-image: url('../assets/images/close-button.png');
	background-size: 20px 20px;
	cursor: pointer;
}
</style>
