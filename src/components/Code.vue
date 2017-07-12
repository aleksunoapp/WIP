<template>
	<div>
		<div class="wrapper">
			<div class="nissan-logo">
				<img :src="topImageUrl">
			</div>
			<div class="regal-nissan-logo">
				<img :src="dealerLogo">
			</div>
			<div class="login-header">
				Vehicle Inspection Update
			</div>
			<form class="access-form" @submit.prevent="enterPasscode()">
				<label class="label">
					Please enter your access code here:
				</label>
				<div>
					<input type="text" class="access-code" v-model="verificationCode">
				</div>
				<div>
					<button class="enter-btn" type="submit">
						Enter
					</button>
				</div>
				<div>
					<img :src="bottomImageUrl">
				</div>
			</form>
		</div>
		<div class="modal" v-if="modalOpen">
			<div class="modal-window">
				<div @click="closeModal()" class="modal-close"></div>
					<div class="clear"></div>
				<div class="modal-content">
					<div class="modal-header">
						Error
					</div>
					<div class="modal-message">
						Please enter your access code.
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// import jquery
import $ from 'jquery'
export default {
	data () {
		return {
			verificationCode: '',
			bottomImageUrl: '',
			topImageUrl: '',
			dealerLogo: '',
			modalOpen: false
		}
	},
	/**
	 * Run on `created` to pull in meta data.
	 * @function
	 * @returns {undefined}
	 */
	created: function () {
		this.getJson()
	},
	methods: {
		/**
		 * To submit the verification code and redirect to the tutorial page
		 * @function
		 * @returns {undefined}
		 */
		enterPasscode: function () {
			if (!this.verificationCode.length) {
				this.modalOpen = true
			} else {
				// The verification will need to be verified at this point before continuing but for now we will assume it is correct
				localStorage.setItem('verificationCode', this.verificationCode)
				this.$router.push({name: 'tutorial'})
			}
		},
		/**
		 * To pull in the meta data and assign to the proper models
		 * @function
		 * @returns {undefined}
		 */
		getJson: function () {
			let _this = this
			$.getJSON('/static/json/GetMetaData.json', function (result) {
				_this.topImageUrl = result.topImageUrl
				_this.bottomImageUrl = result.bottomImageUrl
				_this.dealerLogo = result.dealerContactInfo.logoUrl
			})
		},
		/**
		 * To close the modal
		 * @function
		 * @returns {undefined}
		 */
		closeModal: function () {
			this.modalOpen = false
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
.modal-header {
	font-size: 16px;
	font-weight: 600;
	text-transform: uppercase;
	padding-top: 1em;
	padding-bottom: 1em;
	background-color: #fde7e7;
}
.modal-message {
	font-size: 14px;
	font-weight: 400;
	text-transform: uppercase;
	padding-top: 3em;
	padding-bottom: 3em;
}
</style>
