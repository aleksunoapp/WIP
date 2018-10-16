<template>
	<div v-if="!$root.dealer">
		<div class="wrapper" v-if="!$root.meta.expired">
			<div class="top-row">
				<div class="language-selector">
					<select v-model="selectedLanguage" @change="updateLanguage()">
						<template v-for="(lang, i) in $root.meta.supportedLanguages">
							<option :value="lang.culture" :key="i">{{ lang.name }}</option>
						</template>
					</select>
				</div>
				<h2 class="dealer-name">{{ $root.meta.dealerContactInfo.name }}</h2>
			</div>
			<div class="nissan-logo">
				<img :src="$root.meta.topImageUrl">
			</div>
			<div class="login-header">
				{{ langTerms.vehicle_inspection_update[$root.meta.local.toLowerCase()] }}
			</div>
			<form class="access-form" @submit.prevent="enterPasscode()">
				<label class="label">
					{{ $root.meta.isBusiness ?
						langTerms.please_enter_your_company_name[$root.meta.local.toLowerCase()] :
						langTerms.please_enter_your_last_name[$root.meta.local.toLowerCase()]
					}}:
				</label>
				<div>
					<input type="text" class="access-code" v-model="verificationCode">
				</div>
				<div>
					<button class="enter-btn" type="submit">
						{{ langTerms.enter[$root.meta.local.toLowerCase()] }}
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
							<p>{{ langTerms.expired_link[$root.meta.local.toLowerCase()] }}</p>
							<p>{{ langTerms.please_contact_dealership[$root.meta.local.toLowerCase()] }}</p>
						</div>
						<div v-if="$root.mobile" class="timer-page-no-timer">
							<div>
								<a :href="`sms:${$root.meta.dealerContactInfo.smsPhone}`" class="chat-icon"></a>
								<span>{{ langTerms.text_dealership[$root.meta.local.toLowerCase()] }}</span>
							</div>
							<div>
								<a :href="`tel:${$root.meta.dealerContactInfo.phone}`" class="contact-icon"></a>
								<span>{{ langTerms.phone_dealership[$root.meta.local.toLowerCase()] }}</span>
							</div>
						</div>
						<p v-else>{{ langTerms.you_can_call_us_at[$root.meta.local.toLowerCase()] }} {{$root.meta.dealerContactInfo.phone}}.</p>
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
							<li><a @click="tryAgain()"><b>{{ langTerms.try_again[$root.meta.local.toLowerCase()] }}</b></a></li>
							<li v-if="$root.mobile"><a :href="`tel:${$root.meta.dealerContactInfo.phone}`" @click="$root.logEvent('Clicked Call Dealership')">{{ langTerms.call_dealership[$root.meta.local.toLowerCase()] }}</a></li>
							<li v-if="$root.mobile"><a :href="`sms:${$root.meta.dealerContactInfo.smsPhone}`" @click="$root.logEvent('Clicked Text Dealership')">{{ langTerms.text_dealership[$root.meta.local.toLowerCase()] }}</a></li>
						</ul>
						<p v-if="!$root.mobile" class="modal-list-phone">{{ langTerms.call_us_at[$root.meta.local.toLowerCase()] }} {{$root.meta.dealerContactInfo.phone}}</p>
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
					'en-ca': 'Vehicle Inspection Update',
					'en-us': 'Vehicle Inspection Update',
					'fr-ca': 'Résultats d\'inspection'
				},
				enter: {
					'en-ca': 'Enter',
					'en-us': 'Enter',
					'fr-ca': 'Soumettre'
				},
				please_enter_your_last_name: {
					'en-ca': 'Please enter your last name',
					'en-us': 'Please enter your last name',
					'fr-ca': 'Veuillez inscrire votre nom de famille'
				},
				please_enter_your_company_name: {
					'en-ca': 'Please enter your company name',
					'en-us': 'Please enter your company name',
					'fr-ca': 'Veuillez inscrire le nom de votre compagnie'
				},
				phone_number: {
					'en-ca': 'phone_number',
					'en-us': 'phone_number',
					'fr-ca': 'phone_number'
				},
				expired_link: {
					'en-ca': 'We are sorry but this link has expired.',
					'en-us': 'We are sorry but this link has expired.',
					'fr-ca': 'We are sorry but this link has expired.'
				},
				please_contact_dealership: {
					'en-ca': 'Please contact the dealership for the status of your vehicle.',
					'en-us': 'Please contact the dealership for the status of your vehicle.',
					'fr-ca': 'Please contact the dealership for the status of your vehicle.'
				},
				text_dealership: {
					'en-ca': 'Text Dealership',
					'en-us': 'Text Dealership',
					'fr-ca': 'Text Dealership'
				},
				phone_dealership: {
					'en-ca': 'Phone Dealership',
					'en-us': 'Phone Dealership',
					'fr-ca': 'Phone Dealership'
				},
				call_dealership: {
					'en-ca': 'Call Dealership',
					'en-us': 'Call Dealership',
					'fr-ca': 'Call Dealership'
				},
				call_us_at: {
					'en-ca': 'Call us at',
					'en-us': 'Call us at',
					'fr-ca': 'Veuillez nous contacter au'
				},
				you_can_call_us_at: {
					'en-ca': 'You can call us at',
					'en-us': 'You can call us at',
					'fr-ca': 'Veuillez nous contacter au'
				},
				try_again: {
					'en-ca': 'Try again',
					'en-us': 'Try again',
					'fr-ca': 'Réessayer'
				},
				error: {
					'en-ca': 'Error',
					'en-us': 'Error',
					'fr-ca': 'Erreur'
				},
				enter_access_code: {
					'en-ca': 'Please enter your access code.',
					'en-us': 'Please enter your access code.',
					'fr-ca': 'Veuillez entrer votre code d\'accès.'
				}
			}
		}
	},
	created () {
		$('html, body').scrollTop(0)

		this.selectedLanguage = this.$root.meta.local

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
				this.modal.title = this.langTerms.error[this.$root.meta.local.toLowerCase()]
				this.modal.content = this.langTerms.enter_access_code[this.$root.meta.local.toLowerCase()]
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
			this.$root.meta.local = this.selectedLanguage
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
.top-row {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;
}
.dealer-name {
	display: inline-block;
	align-self: flex-end;
	font-size: 10pt;
	font-weight: normal;
	margin-left: 10px;
	margin-right: 10px;
}
.language-selector {
	display: inline-block;
	margin-top: 10px;
	margin-left: 10px;
	background: url(http://i62.tinypic.com/15xvbd5.png) no-repeat 92% 0;
	height: 31px;
	overflow: hidden;
	width: 135px;
	background-color: #fff;
	border: 1px solid #9e9fa4;
}
.language-selector select {
	background: transparent;
	border: none;
	font-size: 14px;
	height: 29px;
	padding: 5px; /* If you add too much padding here, the options won't show in IE */
	width: 153px;
	cursor: pointer;
	color: #9e9fa4;
}
.language-selector select:focus {
	outline: none;
}
</style>
