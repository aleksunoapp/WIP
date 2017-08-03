<template>
	<div class="wrapper">
		<div class="summary-header">
			Service Summary
		</div>
		<div class="service-header">
			<div class="large">
				Newly Approved Services
			</div>
			<div class="small">
				Items you approved after the inspection
			</div>
		</div>
		<div class="summary-table">
			<template v-for="service in $root.services">
				<template v-if="checkSubServices(service)">
					<div class="summary-table-row summary-item">
						<div class="summary-table-cell">
							<span class="information-icon no-icon-bg"></span>
							<span class="service-name"><b>{{ service.name }}</b></span>
						</div>
						<div class="summary-table-cell"></div>
					</div>
					<template v-for="subService in service.subServices">
						<template v-if="subService.isSelected && service.category !== '4' && service.category !== '3'">
							<div class="summary-table-row summary-item">
								<div class="summary-table-cell">
									<span class="information-icon" @click="openServiceModal(subService)"></span>
									<span class="service-name">{{ subService.name }}</span>
								</div>
								<div class="summary-table-cell">
									<span class="price" v-if="subService.price !== 0"> ${{ (subService.price).toFixed(2) }} </span>
									<span class="price" v-else> Free </span>
								</div>
							</div>
						</template>
					</template>
				</template>
				<template v-if="!service.subServices">
					<template v-if="service.isSelected && service.category !== '4' && service.category !== '3'">
						<div class="summary-table-row summary-item">
							<div class="summary-table-cell">
								<span class="information-icon" @click="openServiceModal(service)"></span>
								<span class="service-name">{{ service.name }}</span>
							</div>
							<div class="summary-table-cell">
								<span class="price" v-if="service.price !== 0"> ${{ (service.price).toFixed(2) }} </span>
								<span class="price" v-else> Free </span>
							</div>
						</div>
					</template>
				</template>
			</template>
			<div class="summary-table-row service-subtotal">
				<div class="summary-table-cell">
					Subtotal:
				</div>
				<div class="summary-table-cell">
					<span class="price"> ${{ (this.$root.totals.inspectionTotal.total).toFixed(2) }} </span>
				</div>
			</div>
		</div>

		<div :class="{'accordion-open': this.accordion, 'accordion-closed': !this.accordion}" class="service-accordion">
			<div @click="toggleAccordion()" class="service-accordion-header service-header">
				<div class="service-accordion-status"></div>
				<div class="large">
					Previously Approved Services
				</div>
				<div class="small">
					Items you approved when you checked into the dealership
				</div>
			</div>
			<div class="accordion-contents">
				<div class="summary-table">
					<template v-for="service in $root.services">
						<template v-if="service.category === '4'">
							<template v-if="service.subServices">
								<div class="summary-table-row summary-item">
									<div class="summary-table-cell">
										<span class="information-icon no-icon-bg"></span>
										<span class="service-name"><b>{{ service.name }}</b></span>
									</div>
									<div class="summary-table-cell"></div>
								</div>
								<template v-for="subService in service.subServices">
									<div class="summary-table-row summary-item">
										<div class="summary-table-cell">
											<span class="information-icon no-icon-bg"></span>
											<span class="service-name">{{ subService.name }}</span>
										</div>
										<div class="summary-table-cell">
											<span class="price" v-if="subService.price !== 0"> ${{ (subService.price).toFixed(2) }} </span>
											<span class="price" v-else> Free </span>
										</div>
									</div>
								</template>
							</template>
							<template v-else>
								<div class="summary-table-row summary-item">
									<div class="summary-table-cell">
										<span class="information-icon no-icon-bg"></span>
										<span class="service-name">{{ service.name }}</span>
									</div>
									<div class="summary-table-cell">
										<span class="price" v-if="service.price !== 0"> ${{ (service.price).toFixed(2) }} </span>
										<span class="price" v-else> Free </span>
									</div>
								</div>
							</template>
						</template>
					</template>
					<div class="summary-table-row service-subtotal">
						<div class="summary-table-cell">
							Subtotal:
						</div>
						<div class="summary-table-cell">
							<span class="price"> ${{ (this.$root.totals.serviceTotal.total).toFixed(2) }} </span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="accept-estimate-component" v-if="!open">
			<div class="service-total">
				<div class="time-notice" :class="{'danger-flag': timeExpired}">
					<span v-if="!timeExpired">If approved by {{ computedReponseTime }} your vehicle will be ready for pickup by {{ computedPromiseTime }}.</span>
					<span v-else>Your service advisor will contact you when your services are completed</span>
				</div>
				<div class="summary-table">
					<div class="summary-table-row service-subtotal">
						<div class="summary-table-cell">
							Estimated Taxes &amp; Fees
						</div>
						<div class="summary-table-cell">
							<span class="price">${{ tax.toFixed(2) }}</span>
						</div>
					</div>
				</div>
				<div class="summary-table">
					<div class="summary-table-row service-subtotal">
						<div class="summary-table-cell grand-total">
							Estimate Total
						</div>
						<div class="summary-table-cell">
							<span class="price">${{ (tax + this.$root.totals.inspectionTotal.total + this.$root.totals.serviceTotal.total).toFixed(2) }}</span>
						</div>
					</div>
				</div>
			</div>
			<div @click="openSignature(true)" class="proceed-btn">
				Accept Estimate
			</div>
			<div class="footer-bar">
				<div class="footer-bar">
					<a :href="`tel:${$root.meta.dealerContactInfo.phone}`" class="contact-icon"></a>
					<a :href="`sms:${$root.meta.dealerContactInfo.smsPhone}`" class="chat-icon"></a>
					<a :href="this.$root.meta.inspectionPdfUrl" target="_blank" class="inspection-summary-link">
						Inspection Summary
					</a>
				</div>
			</div>
		</div>

		<div class="signature-component" v-if="open">
			<div class="service-total white-background">
				<div class="summary-table">
					<div class="summary-table-row service-subtotal">
						<div class="summary-table-cell">
							Estimated Taxes &amp; Fees:
						</div>
						<div class="summary-table-cell">
							<span class="price">${{ tax.toFixed(2) }}</span>
						</div>
					</div>
				</div>
				<div class="summary-table">
					<div class="summary-table-row service-subtotal">
						<div class="summary-table-cell grand-total">
							Estimate Total
						</div>
						<div class="summary-table-cell">
							<span class="price">${{ (tax + this.$root.totals.inspectionTotal.total + this.$root.totals.serviceTotal.total).toFixed(2) }}</span>
						</div>
					</div>
				</div>
			</div>
			<div class="sign-below">
				Please sign below
			</div>
			<signature-pad @signatureUpdate="signatureStatusChanged"></signature-pad>
			<div>
				<div class="css-checkbox">
					<input type="checkbox" id="terms-and-conditions" v-model="termsAndConditions">
					<label for="terms-and-conditions">
						<span class="check"></span>
						<span class="box"></span>
						I acknowledge the agreement of the Dealership's <a @click.prevent="toggleTerms(true)">terms and conditions</a>
					</label>
				</div>
			</div>
			<div class="modal-buttons">
				<div @click="openThanks()" class="approve-btn" :class="{'disabled': !termsAndConditions || !signagtureSigned}">
					Approve
				</div>
				<div @click="returnToInspection()" class="not-today-btn">
					Cancel
				</div>
			</div>
		</div>
		<div class="terms-and-conditions" v-if="showTerms">
			<span class="close-btn" @click="toggleTerms(false)"></span>
			<div class="terms-header">
				<h2>Terms and Conditions</h2>
			</div>
			<div class="terms-body">
				<h3>Exclusion of warranties</h3>
				<p>All warranties on the parts and accessories sold hereby are made by the manufacturer. The undersigned purchaser understand and agrees that dealer makes no warranties of any kind, express or implied, and disclaims all warranties, including warranties of merchantability or fitness for a particular purpose; and that in no event shall dealer be liable for incidental or consequential damages or commercial losses arising out of such purchase. The undersighed purchaser further agrees that the warranties excluded by the dealer, include, but are not limited to any warranties that such parts and/or accessories are of merchantable quality or that they will enable any vehicle or any of its systems to perform with reasonable safety, efficiency, or comfort.</p>
			</div>
			<div class="terms-body">
				<h3>Authorization for repairs</h3>
				<p>I hereby authorize the repair work herein set forth to be done along with the necessary material and agree that you are not responsible for loss or damage to vehicle or articles left in vehicle in case of fire, theft, or any cause beyond your control or for any delays caused by unavailability of parts or delays in parts shipments by the supplier or transporter. I hereby grant you and/or your employees permission to operate the behicle herein described on streets, highways, or elsewhere for the purpose of testing and/or inspection. An express mechanical lien is hereby acknowledged on above vehicle to secure the amount of repairs thereto. The dealership is not responsible for damages from freezing due to lack of antifreeze.</p>
			</div>
			<div class="terms-close">
				<div class="terms-close-btn" @click="toggleTerms(false)">CLOSE</div>
			</div>
		</div>
		<info-popup v-if="modalOpen" :viewingService="viewingService" @closeModal="closeServiceModal" @approve="approveService" @defer="deferService"></info-popup>
	</div>
</template>

<script>
import $ from 'jquery'
import InfoPopup from './InfoPopup'
import SignaturePad from './SignaturePad'

export default {
	data () {
		return {
			signaturePad: null,
			accordion: false,
			open: false,
			termsAndConditions: false,
			signagtureSigned: false,
			showTerms: false,
			modalOpen: false,
			viewingService: {},
			timeExpired: false,
			signaturePadData: '',
			tax: 0
		}
	},
	created () {
		this.$root.serviceCategories.forEach(category => {
			if (category.id === '4') {
				this.accordion = category.defaultExpended
			}
		})

		$('html, body').scrollTop(0)

		let dateConst = new Date()
		let responseDate = new Date(this.$root.meta.responseBy)
		this.timeExpired = responseDate < dateConst
		this.tax = this.$root.totals.serviceTotal.tax

		this.getTaxTotals()
	},
	computed: {
		/**
		 * To compute the format of time the customer needs to respond by
		 * @function
		 * @returns {string} - The formatted time
		 */
		computedReponseTime () {
			let formattedTime = ''
			let fullDate = new Date(this.$root.meta.responseBy)
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
			}

			formattedTime = hour + ':' + minutes + ' ' + meridian
			return formattedTime
		},
		/**
		 * To compute the format of time the customers car will be ready
		 * @function
		 * @returns {string} - The formatted time
		 */
		computedPromiseTime () {
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
			}

			formattedTime = hour + ':' + minutes + ' ' + meridian
			return formattedTime
		}
	},
	methods: {
		/**
		 * To toggle the accordion open and close
		 * @function
		 * @returns {undefined}
		 */
		toggleAccordion () {
			this.accordion = !this.accordion
		},
		/**
		 * To open and close the signature pad
		 * @param {boolean} val - Whether it is open or closed
		 * @function
		 * @returns {undefined}
		 */
		openSignature (val) {
			this.open = val
		},
		/**
		 * To return to the inspection page
		 * @function
		 * @returns {undefined}
		 */
		returnToInspection () {
			this.$router.push({name: 'inspection'})
		},
		/**
		 * To redirect to the thanks route
		 * @function
		 * @returns {undefined}
		 */
		openThanks () {
			let _this = this
			let approvedServices = []
			this.$root.services.forEach(service => {
				if (service.category !== '4' && service.category !== '3') {
					if (service.subServices) {
						service.subServices.forEach(subService => {
							if (subService.isSelected) {
								approvedServices.push(subService.id)
							}
						})
					} else {
						if (service.isSelected) {
							approvedServices.push(service.id)
						}
					}
				}
			})

			if (this.termsAndConditions && this.signagtureSigned) {
				$.ajax({
					url: 'https://testdynamicmpi.dealer-fx.com/services/' + _this.$root.token,
					method: 'POST',
					data: {
						approvedServices,
						customerSignature: _this.signaturePadData
					},
					beforeSend (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer ' + _this.$root.accessToken)
					}
				}).done(response => {
					this.$router.push({name: 'thanks'})
				}).fail(reason => {
					console.log(reason)
				})
			}
		},
		/**
		 * To check if the signature pad has been signed and set the proper variable
		 * @function
		 * @param {boolean} val - The current value of isEmpty() on the signature pad
		 * @returns {undefined}
		 */
		signatureStatusChanged (val) {
			this.signagtureSigned = !val.isEmpty
			this.signaturePadData = val.data
		},
		/**
		 * To toggle visibility of the terms and conditions overlay
		 * @function
		 * @param {boolean} val - Whether to show or hide the terms and conditions overlay
		 * @returns {undefined}
		 */
		toggleTerms (val) {
			this.showTerms = val
		},
		/**
		 * To open the detailed view modal
		 * @function
		 * @param {object} service - The service to be viewed in detail
		 * @returns {undefined}
		 */
		openServiceModal (service) {
			this.viewingService = service
			this.modalOpen = true
		},
		/**
		 * To close the detailed view modal
		 * @function
		 * @returns {undefined}
		 */
		closeServiceModal () {
			this.viewingService = {}
			this.modalOpen = false
		},
		/**
		 * To close the detailed view modal since the service is already approved
		  * @function
		  * @returns {undefined}
		  */
		approveService () {
			// No need to do anything because the service is already approved
			this.closeServiceModal()
		},
		/**
		 * To remove the service from approved services
		  * @function
		  * @returns {undefined}
		  */
		deferService () {
			this.viewingService.isSelected = false
			this.$root.totals.inspectionTotal.total -= parseFloat(this.viewingService.price)
			this.getTaxTotals()
			this.closeServiceModal()
		},
		/**
		 * To get the tax totals for the backend
		 * @function
		 * @returns {undefined}
		 */
		getTaxTotals () {
			let _this = this
			let approvedServices = []
			this.$root.services.forEach(service => {
				if (service.category !== '3') {
					if (service.subServices) {
						service.subServices.forEach(subService => {
							if (subService.isSelected) {
								approvedServices.push(subService.id)
							}
						})
					} else {
						if (service.isSelected) {
							approvedServices.push(service.id)
						}
					}
				}
			})

			$.ajax({
				url: 'https://testdynamicmpi.dealer-fx.com/tax/' + _this.$root.token,
				method: 'POST',
				data: JSON.stringify(approvedServices),
				beforeSend (xhr) {
					xhr.setRequestHeader('Content-Type', 'application/json')
					xhr.setRequestHeader('Authorization', 'Bearer ' + _this.$root.accessToken)
				}
			}).done(response => {
				_this.$root.totals.serviceTotal.tax = response.taxAndFee
				_this.tax = response.taxAndFee
			}).fail(reason => {
				console.log(reason)
			})
		},
		/**
		 * To check if the service has subServices and if it does, to check if at least one of them is selected
		 * @function
		 * @param {object} service - The service to be tested
		 * @returns {boolean} - Whether the service passes or fails the test
		 */
		checkSubServices (service) {
			let isSelected = false
			if (service.subServices) {
				service.subServices.forEach(subService => {
					if (subService.isSelected) {
						isSelected = true
					}
				})
			}
			return isSelected
		}
	},
	components: {
		InfoPopup,
		SignaturePad
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper {
	margin-bottom:235px;
}
</style>
