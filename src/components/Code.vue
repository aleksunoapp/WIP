<template>
	<div v-if="!$root.dealer">
		<div class="wrapper" v-if="!$root.meta.expired">
			<div class="language-selector">
				<select v-model="selectedLanguage" @change="updateLanguage()">
					<option value="English">English</option>
					<option value="French">French</option>
				</select>
			</div>
			<div class="nissan-logo">
				<img :src="$root.meta.topImageUrl">
			</div>
			<div class="regal-nissan-logo">
				<img :src="$root.meta.dealerContactInfo.logoUrl" v-if="$root.meta.dealerContactInfo.logoUrl.length">
				<h2 v-else>{{ $root.meta.dealerContactInfo.name }}</h2>
			</div>
			<div class="login-header">
				{{ langTerms.vehicle_inspection_update[$root.meta.local] }}
			</div>
			<form class="access-form" @submit.prevent="enterPasscode()">
				<label class="label">
					{{ langTerms.please_enter_your[$root.meta.local] }}
					{{ $root.meta.authenticationHint.hintType === 1 ? langTerms.email[$root.meta.local] : '' }}{{ $root.meta.authenticationHint.hintType === 2 ? langTerms.phone_number[$root.meta.local] : '' }}{{ $root.meta.authenticationHint.hintType === 3 ? langTerms.last_name_or_company[$root.meta.local] : '' }}{{ $root.meta.local === 'en' ? ' below:' : ':' }} 
				</label>
				<div>
					<input type="text" class="access-code" v-model="verificationCode" :placeholder="$root.meta.authenticationHint.hintText">
				</div>
				<div>
					<button class="enter-btn" type="submit">
						{{ langTerms.enter[$root.meta.local] }}
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
							<p>{{ langTerms.expired_link[$root.meta.local] }}</p>
							<p>{{ langTerms.please_contact_dealership[$root.meta.local] }}</p>
						</div>
						<div v-if="$root.mobile" class="timer-page-no-timer">
							<div>
								<a :href="`sms:${$root.meta.dealerContactInfo.smsPhone}`" class="chat-icon"></a>
								<span>{{ langTerms.text_dealership[$root.meta.local] }}</span>
							</div>
							<div>
								<a :href="`tel:${$root.meta.dealerContactInfo.phone}`" class="contact-icon"></a>
								<span>{{ langTerms.phone_dealership[$root.meta.local] }}</span>
							</div>
						</div>
						<p v-else>{{ langTerms.you_can_call_us_at[$root.meta.local] }} {{$root.meta.dealerContactInfo.phone}}.</p>
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
							<li><a @click="tryAgain()"><b>{{ langTerms.try_again[$root.meta.local] }}</b></a></li>
							<li v-if="$root.mobile"><a :href="`tel:${$root.meta.dealerContactInfo.phone}`" @click="$root.logEvent('Clicked Call Dealership')">{{ langTerms.call_dealership[$root.meta.local] }}</a></li>
							<li v-if="$root.mobile"><a :href="`sms:${$root.meta.dealerContactInfo.smsPhone}`" @click="$root.logEvent('Clicked Text Dealership')">{{ langTerms.text_dealership[$root.meta.local] }}</a></li>
						</ul>
						<p v-if="!$root.mobile" class="modal-list-phone">{{ langTerms.call_us_at[$root.meta.local] }} {{$root.meta.dealerContactInfo.phone}}</p>
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
			selectedLanguage: '',
			showErrorMessage: false,
			langTerms: {
				vehicle_inspection_update: {
					en: 'Vehicle Inspection Update',
					fr: 'Résultats d\'inspection'
				},
				enter: {
					en: 'Enter',
					fr: 'Soumettre'
				},
				please_enter_your: {
					en: 'Please enter your',
					fr: 'Veuillez entrer votre'
				},
				last_name_or_company: {
					en: 'last name or company',
					'fr': 'surnom ou nom de d\'entreprise'
				},
				email: {
					en: 'email',
					'fr': 'email'
				},
				phone_number: {
					en: 'phone_number',
					'fr': 'phone_number'
				},
				expired_link: {
					en: 'We are sorry but this link has expired.',
					'fr': 'We are sorry but this link has expired.'
				},
				please_contact_dealership: {
					en: 'Please contact the dealership for the status of your vehicle.',
					'fr': 'Please contact the dealership for the status of your vehicle.'
				},
				text_dealership: {
					en: 'Text Dealership',
					'fr': 'Text Dealership'
				},
				phone_dealership: {
					en: 'Phone Dealership',
					'fr': 'Phone Dealership'
				},
				call_dealership: {
					en: 'Call Dealership',
					'fr': 'Call Dealership'
				},
				call_us_at: {
					en: 'Call us at',
					'fr': 'Call us at'
				},
				you_can_call_us_at: {
					en: 'You can call us at',
					'fr': 'You can call us at'
				},
				try_again: {
					en: 'Try again',
					'fr': 'Try again'
				},
				error: {
					en: 'Error',
					'fr': 'Error'
				},
				enter_access_code: {
					'en_US': 'Please enter your access code.',
					'fr': 'Please enter your access code.'
				}
			}
		}
	},
	created () {
		$('html, body').scrollTop(0)

		if (this.$root.meta.local === 'en') {
			this.selectedLanguage = 'English'
		} else if (this.$root.meta.local === 'fr') {
			this.selectedLanguage = 'French'
		}

		this.$root.logPageDuration('home')
	},
	destroyed () {
		this.$root.logPageDuration('home')
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
				this.modal.title = this.langTerms.error[this.$root.meta.local]
				this.modal.content = this.langTerms.enter_access_code[this.$root.meta.local]
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
		},
		/**
		 * To update the language in the meta data
		 * @function
		 * @returns {undefined}
		 */
		updateLanguage () {
			if (this.selectedLanguage === 'English') {
				this.$root.meta.local = 'en'
			} else if (this.selectedLanguage === 'French') {
				this.$root.meta.local = 'fr'
			}
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
.language-selector {
	position: absolute;
	top: 10px;
	left: 10px;
	background: url(http://i62.tinypic.com/15xvbd5.png) no-repeat 92% 0;
	height: 31px;
	overflow: hidden;
	width: 125px;
	background-color: #fff;
	border: 1px solid #9e9fa4;
}
.language-selector select {
	background: transparent;
	border: none;
	font-size: 14px;
	height: 29px;
	padding: 5px; /* If you add too much padding here, the options won't show in IE */
	width: 143px;
	cursor: pointer;
	color: #9e9fa4;
}
.language-selector select:focus {
	outline: none;
}
</style>
