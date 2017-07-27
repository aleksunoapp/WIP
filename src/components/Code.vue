<template>
	<div>
		<div class="wrapper">
			<div class="nissan-logo">
				<img :src="$root.meta.dealer.topImageUrl">
			</div>
			<div class="regal-nissan-logo">
				<img :src="$root.meta.dealer.logoUrl" v-if="$root.meta.dealer.logoUrl.length">
				<h2 v-else>{{ $root.meta.dealer.name }}</h2>
			</div>
			<div class="login-header">
				Vehicle Inspection Update
			</div>
			<form class="access-form" @submit.prevent="enterPasscode()">
				<label class="label">
					Please enter your {{ $root.meta.customer.hintType === 1 ? 'email' : 'last name' }} below:
				</label>
				<div>
					<input type="text" class="access-code" v-model="verificationCode" :placeholder="$root.meta.customer.hintText">
				</div>
				<div>
					<button class="enter-btn" type="submit">
						Enter
					</button>
				</div>
				<div>
					<img :src="$root.meta.dealer.bottomImageUrl">
				</div>
			</form>
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
							<li><a :href="`tel:${$root.meta.dealer.phone}`">Call Dealership</a></li>
							<li><a :href="`sms:${$root.meta.dealer.smsPhone}`">Text Dealership</a></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import $ from 'jquery'

export default {
	data () {
		return {
			verificationCode: '',
			modalOpen: false,
			modal: {
				title: '',
				content: ''
			}
		}
	},
	created () {
		$('html, body').scrollTop(0)
	},
	methods: {
		/**
		 * To submit the verification code and redirect to the tutorial page
		 * @function
		 * @returns {undefined}
		 */
		enterPasscode () {
			if (!this.verificationCode.length) {
				this.modalOpen = true
				this.modal.title = 'Error'
				this.modal.content = 'Please enter your access code.'
			} else {
				if (this.verificationCode.toLowerCase() === this.$root.meta.customer.authenticationAnswer.toLowerCase()) {
					this.$router.push({name: 'tutorial'})
				} else {
					this.modalOpen = true
					if (this.$root.meta.customer.hintType === 1) {
						this.modal.title = 'Unrecognized email address'
					} else {
						this.modal.title = 'Unrecognized last name'
					}
					this.modal.content = `We're sorry but we don't recognize <b>${this.verificationCode}</b> in our database.`
				}
			}
		},
		/**
		 * To close the modal
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
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
			this.verificationCode = ''
			this.closeModal()
		}
	}
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
