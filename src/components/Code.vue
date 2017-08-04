<template>
	<div>
		<div class="wrapper">
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
					<img :src="$root.meta.bottomImageUrl">
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
							<li><a :href="`tel:${$root.meta.dealerContactInfo.phone}`">Call Dealership</a></li>
							<li><a :href="`sms:${$root.meta.dealerContactInfo.smsPhone}`">Text Dealership</a></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<error-message v-if="showErrorMessage" @closeErrorModal="closeErrorModal()"></error-message>
	</div>
</template>

<script>
import $ from 'jquery'
import ENV from '../environment'
import ErrorMessage from './ErrorMessage'

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
	},
	methods: {
		/**
		 * To verify that the verificationCode is not empty and redirect to the authentication function
		 * @function
		 * @returns {undefined}
		 */
		enterPasscode () {
			if (!this.verificationCode.length) {
				this.modalOpen = true
				this.modal.title = 'Error'
				this.modal.content = 'Please enter your access code.'
			} else {
				this.authenticateToken()
			}
		},
		/**
		 * To submit the verification code and redirect to the tutorial page
		 * @function
		 * @returns {undefined}
		 */
		authenticateToken () {
			let _this = this

			$.ajax({
				url: ENV.production_url + '/oauth/token',
				method: 'POST',
				data: {
					grant_type: 'client_credentials',
					client_id: _this.$root.token,
					client_secret: _this.verificationCode
				}
			}).done((response, textStatus, xhr) => {
				if (xhr.status === 200) {
					_this.$root.accessToken = response.access_token

					let getServices = new Promise((resolve, reject) => {
						$.ajax({
							url: ENV.production_url + '/services/' + _this.$root.token,
							method: 'GET',
							beforeSend (xhr) {
								xhr.setRequestHeader('Authorization', 'Bearer ' + _this.$root.accessToken)
							}
						}).then((response, textStatus, xhr) => {
							if (xhr.status === 200) {
								resolve(response)
							} else {
								reject()
							}
						})
					})

					let getInspection = new Promise((resolve, reject) => {
						$.ajax({
							url: ENV.production_url + '/inspection/' + _this.$root.token,
							method: 'GET',
							beforeSend (xhr) {
								xhr.setRequestHeader('Authorization', 'Bearer ' + _this.$root.accessToken)
							}
						}).then((response, textStatus, xhr) => {
							if (xhr.status === 200) {
								resolve(response)
							} else {
								reject()
							}
						})
					})

					let getConfirmation = new Promise((resolve, reject) => {
						$.ajax({
							url: ENV.production_url + '/confirmation/' + _this.$root.token,
							method: 'GET',
							beforeSend (xhr) {
								xhr.setRequestHeader('Authorization', 'Bearer ' + _this.$root.accessToken)
							}
						}).then((response, textStatus, xhr) => {
							if (xhr.status === 200) {
								resolve(response)
							} else {
								reject()
							}
						})
					})

					// Need to pull all other data before proceeding
					Promise.all([getServices, getInspection, getConfirmation]).then(values => {
						let inspectionCounts = {
							failCount: 0,
							warningCount: 0,
							passCount: 0,
							approvedCount: 0
						}
						let inspectionTotal = 0
						let serviceTotal = 0
						let serviceTaxTotal = 0

						_this.$root.meta.inspectionPdfUrl = values[1].fullInspectionUrl
						_this.$root.meta.advisor = values[2]

						values[0].forEach(service => {
							if (service.parentServiceId) {
								values[0].forEach(secondService => {
									if (secondService.id === service.parentServiceId) {
										if (!secondService.subServices) {
											secondService.subServices = []
										}
										secondService.subServices.push(service)
									}
								})
							}
						})

						_this.$root.services = values[0].filter(service => {
							return !service.parentServiceId
						})

						// Loop through each service and sub service to get the total counts
						_this.$root.services.forEach(service => {
							if (service.category === '1') {
								if (service.subServices) {
									service.subServices.forEach(subService => {
										inspectionCounts.failCount += 1
									})
								} else {
									inspectionCounts.failCount += 1
								}
							} else if (service.category === '2') {
								if (service.subServices) {
									service.subServices.forEach(subService => {
										inspectionCounts.warningCount += 1
									})
								} else {
									inspectionCounts.warningCount += 1
								}
							} else if (service.category === '3') {
								if (service.subServices) {
									service.subServices.forEach(subService => {
										inspectionCounts.passCount += 1
									})
								} else {
									inspectionCounts.passCount += 1
								}
							} else if (service.category === '4') {
								if (service.subServices) {
									service.subServices.forEach(subService => {
										inspectionCounts.approvedCount += 1
									})
								} else {
									inspectionCounts.approvedCount += 1
								}
							}
						})

						// Loop through all services to calculate the value of all pre approved services
						_this.$root.serviceCategories.forEach(category => {
							if (category.showOnInspection && category.id !== '3') {
								_this.$root.services.forEach(service => {
									if (service.category === category.id) {
										if (service.subServices) {
											service.subServices.forEach(subService => {
												if (subService.isSelected) {
													inspectionTotal += subService.price
												}
											})
										} else {
											if (service.isSelected) {
												inspectionTotal += service.price
											}
										}
									}
								})
							}

							if (category.id === '4') {
								_this.$root.services.forEach(service => {
									if (service.category === '4') {
										if (service.subServices) {
											service.subServices.forEach(subService => {
												serviceTotal += subService.price
											})
										} else {
											serviceTotal += service.price
										}
									}
								})
							}
						})

						_this.$root.serviceCategories.sort((a, b) => {
							return a.sortOrder - b.sortOrder
						})

						_this.$root.totals = {
							inspectionTotal: {
								total: inspectionTotal
							},
							serviceTotal: {
								total: serviceTotal,
								tax: serviceTaxTotal
							}
						}

						_this.$root.inspectionCounts = inspectionCounts

						_this.$router.push({name: 'tutorial'})
					}).catch(reason => {
						this.showErrorMessage = true
					})
				} else {
					this.showErrorMessage = true
				}
			}).fail(reason => {
				_this.modalOpen = true
				if (_this.$root.meta.authenticationHint.hintType === 1) {
					_this.modal.title = 'Unrecognized email address'
				} else if (_this.$root.meta.authenticationHint.hintType === 2) {
					_this.modal.title = 'Unrecognized phone number'
				} else {
					_this.modal.title = 'Unrecognized last name'
				}
				_this.modal.content = `We're sorry but we don't recognize <b>${_this.verificationCode}</b> in our database.`
			})
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
		},
		/**
		 * To close the error modal
		 * @function
		 * @returns {undefined}
		 */
		closeErrorModal () {
			this.showErrorMessage = false
		}
	},
	components: {
		ErrorMessage
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
