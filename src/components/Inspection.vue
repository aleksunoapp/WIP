<template>
	<div>
		<div class="wrapper">
			<div class="summary-header"> Inspection Summary </div>
			<div class="summary-icons">
				<div class="icon">
					<img src="../assets/images/fail.png">
					({{ this.$root.inspectionCounts.failCount }})
				</div>
				<div class="icon">
					<img src="../assets/images/warning.png">
					({{ this.$root.inspectionCounts.warningCount }})
				</div>
				<div class="icon">
					<img src="../assets/images/pass.png">
					({{ this.$root.inspectionCounts.passCount }}) 
				</div>
			</div>
			<template v-for="(category, index) in serviceCategories" v-if="category.showOnInspection">
				<div :class="{'accordion-open': category.defaultExpended, 'accordion-closed': !category.defaultExpended, 'red': category.serviceCategoryType === 'SAFETY', 'yellow': category.serviceCategoryType === 'ATTN', 'green': category.serviceCategoryType === 'PASS'}" class="accordion">
					<div @click="toggleAccordion(category)" class="accordion-header">
						<img :src="category.iconUrl"> {{ category.name }} ({{ $root.inspectionCounts[countVariables[category.serviceCategoryType]] }})
						<div class="accordion-status"></div>
						<div class="clear"></div>
					</div>
					<div class="accordion-contents">
						<div v-if="category.serviceCategoryType === 'PASS'" class="view-full-report">
							<div class="view-full-report-btn" @click="openFullInspection()">
								<a id="viewReport">
									View Full Report
									<img src="../assets/images/external-link.png">
								</a>
							</div>
						</div>
						<div class="summary-table">
							<div v-if="category.serviceCategoryType !== 'PASS'" class="summary-table-row">
								<div class="summary-table-cell">
									<span class="summary-legend">
										<b>Check the recommended services you authorize.</b>
									</span>
								</div>

								<div class="summary-table-cell">
									<span> {{ (category.allSelected) ? 'Remove All' : 'Select All' }} </span>
									<div class="service-checkbox">
										<input type="checkbox" :id="`select-${category.serviceCategoryType}`" v-model="category.allSelected" @change="toggleAll(category)">
										<label :for="`select-${category.serviceCategoryType}`">
											<span class="check"></span>
											<span class="box"></span>
										</label>
									</div>
								</div>
							</div>

							<template v-for="service in $root.services">
								<template v-if="service.category === category.id">
									<template v-if="service.subServices">
										<div class="summary-table-row summary-item">
											<div class="summary-table-cell">
												<b>{{ service.name }}</b>
											</div>
											<div class="summary-table-cell">
											</div>
										</div>
										<div class="summary-table-row summary-item" v-for="subService in service.subServices">
											<div class="summary-table-cell">
												<span class="information-icon" :class="{'no-icon-bg': category.serviceCategoryType === 'PASS'}" @click="openServiceModal(subService)"></span>
												<span class="service-name">{{ subService.name }}</span>
											</div>
											<div class="summary-table-cell">
												<template v-if="category.serviceCategoryType !== 'PASS'">
													<span class="price"> ${{ (subService.price).toFixed(2) }} </span>
													<div class="service-checkbox">
														<input type="checkbox" :id="`sub-service-${subService.id}`" v-model="subService.isSelected" @change="toggleCheckbox(category, subService)">
														<label :for="`sub-service-${subService.id}`">
															<span class="check"></span>
															<span class="box"></span>
														</label>
													</div>
												</template>
											</div>
										</div>
									</template>
									<div class="summary-table-row summary-item" v-else>
										<div class="summary-table-cell">
											<span class="information-icon" :class="{'no-icon-bg': category.serviceCategoryType === 'PASS'}" @click="openServiceModal(service)"></span>
											<span class="service-name">{{ service.name }}</span>
										</div>
										<div class="summary-table-cell">
											<template v-if="category.serviceCategoryType !== 'PASS'">
												<span class="price"> ${{ (service.price).toFixed(2) }} </span>
												<div class="service-checkbox">
													<input type="checkbox" :id="`sub-service-${service.id}`" v-model="service.isSelected" @change="toggleCheckbox(category, service)">
													<label :for="`sub-service-${service.id}`">
														<span class="check"></span>
														<span class="box"></span>
													</label>
												</div>
											</template>
										</div>
									</div>
								</template>
							</template>
						</div>
					</div>
				</div>
			</template>

			<div class="proceed-component">
				<div class="time-notice" :class="{'danger-flag': timeExpired}">
					<span v-if="!timeExpired">If approved by {{ computedReponseTime }} your vehicle will be ready for pickup by {{ computedPromiseTime }}.</span>
					<span v-else>Your service advisor will contact you when your services are completed</span>
				</div>
				<div class="total-estimate">
					<div class="total-label">
						<div class="large">
							Estimate for Selected Services (not including taxes and fees)
						</div>
					</div>
					<div class="total-estimate-value">
						${{ inspectionTotal.total.toFixed(2) }}
					</div>
				</div>
				<div class="total-estimate">
					<div class="total-label">
						<div class="large">
							Estimate for Previously Approved Services
						</div>
					</div>
					<div class="total-estimate-value">
						${{ $root.totals.serviceTotal.total.toFixed(2) }}
					</div>
				</div>
				<div @click="openServices()" class="proceed-btn">
					Next
				</div>
				<div class="footer-bar">
					<a :href="`tel:${$root.meta.dealerContactInfo.phone}`" class="contact-icon"></a>
					<a :href="`sms:${$root.meta.dealerContactInfo.smsPhone}`" class="chat-icon"></a>
					<a :href="this.$root.meta.inspectionPdfUrl" target="_blank" class="inspection-summary-link">
						Inspection Summary
					</a>
				</div>
			</div>
		</div>
		<info-popup v-if="modalOpen" :viewingService="viewingService" @closeModal="closeServiceModal" @approve="approveService" @defer="deferService"></info-popup>
	</div>
</template>

<script>
import $ from 'jquery'
import InfoPopup from './InfoPopup'

export default {
	data () {
		return {
			countVariables: {
				'SAFETY': 'failCount',
				'ATTN': 'warningCount',
				'PASS': 'passCount'
			},
			modalOpen: false,
			serviceCategories: [],
			inspectionTotal: 0,
			viewingService: {},
			timeExpired: false
		}
	},
	created () {
		this.serviceCategories = this.$root.serviceCategories
		this.inspectionTotal = this.$root.totals.inspectionTotal

		$('html, body').scrollTop(0)

		let dateConst = new Date()
		let responseDate = new Date(this.$root.meta.responseBy)
		this.timeExpired = responseDate < dateConst

		this.checkSelectAll()
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
		 * To open the full inspection in a separate tab
		 * @function
		 * @returns {undefined}
		 */
		openFullInspection () {
			window.open(this.$root.meta.inspectionPdfUrl, '_blank')
		},
		/**
		 * To toggle the category accordion open and close
		 * @param {object} category - The category to toggle
		 * @function
		 * @returns {undefined}
		 */
		toggleAccordion (category) {
			category.defaultExpended = !category.defaultExpended
		},
		/**
		 * To add and subtract the selected service from the total price
		 * @param {object} category - The parent category of the service
		 * @param {object} service - The service being toggled
		 * @function
		 * @returns {undefined}
		 */
		toggleCheckbox (category, service) {
			if (service.isSelected) {
				this.inspectionTotal.total += parseFloat(service.price)
				this.checkSelectAll()
			} else {
				this.inspectionTotal.total -= parseFloat(service.price)
				if (category) {
					if (category.allSelected) {
						category.allSelected = false
					}
				} else {
					this.checkSelectAll()
				}
			}

			// Doing this only to prevent value of -0.00
			this.inspectionTotal.total = Math.abs(this.inspectionTotal.total)

			this.$root.totals.inspectionTotal = this.inspectionTotal
		},
		/**
		 * To turn on or off the checkboxes for all category services as well as add and subtract the selected service from the total price
		 * @param {object} category - The category to be toggled
		 * @function
		 * @returns {undefined}
		 */
		toggleAll (category) {
			if (category.allSelected) {
				this.$root.services.forEach(service => {
					if (service.category === category.id) {
						if (service.subServices) {
							service.subServices.forEach(subService => {
								if (!subService.isSelected) {
									subService.isSelected = true
									this.inspectionTotal.total += parseFloat(subService.price)
								}
							})
						} else {
							if (!service.isSelected) {
								service.isSelected = true
								this.inspectionTotal.total += parseFloat(service.price)
							}
						}
					}
				})
			} else {
				this.$root.services.forEach(service => {
					if (service.category === category.id) {
						if (service.subServices) {
							service.subServices.forEach(subService => {
								if (subService.isSelected) {
									subService.isSelected = false
									this.inspectionTotal.total -= parseFloat(subService.price)
								}
							})
						} else {
							if (service.isSelected) {
								service.isSelected = false
								this.inspectionTotal.total -= parseFloat(service.price)
							}
						}
					}
				})
			}

			// Doing this only to prevent value of -0.00
			this.inspectionTotal.total = Math.abs(this.inspectionTotal.total)

			this.$root.totals.inspectionTotal = this.inspectionTotal
		},
		/**
		 * To check if the select all toggle should be on or off
		 * @function
		 * @returns {undefined}
		 */
		checkSelectAll () {
			this.serviceCategories.forEach(category => {
				let count = 0
				let total = 0

				this.$root.services.forEach(service => {
					if (service.category === category.id) {
						if (service.subServices) {
							service.subServices.forEach(subService => {
								total += 1
								if (subService.isSelected) {
									count += 1
								}
							})
						} else {
							total += 1
							if (service.isSelected) {
								count += 1
							}
						}
					}
				})

				if (count === total) {
					this.$set(category, 'allSelected', true)
				} else {
					this.$set(category, 'allSelected', false)
				}
			})
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
		 * To approve the service and close the modal
		 * @function
		 * @returns {undefined}
		 */
		approveService () {
			if (!this.viewingService.isSelected) {
				this.viewingService.isSelected = true
				this.toggleCheckbox(null, this.viewingService)
			}
			this.closeServiceModal()
		},
		/**
		 * To defer the service and close the modal
		 * @function
		 * @returns {undefined}
		 */
		deferService () {
			this.viewingService.isSelected = false
			this.toggleCheckbox(null, this.viewingService)
			this.closeServiceModal()
		},
		/**
		 * To redirect to the services route
		 * @function
		 * @returns {undefined}
		 */
		openServices () {
			this.$router.push({name: 'services'})
		}
	},
	components: {
		InfoPopup
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.accordion-open .accordion-status {
	float: right;
	margin-top: 8px;
	width: 0;
	height: 0;
	border-left: 6px solid transparent;
	border-right: 6px solid transparent;
	border-top: 6px solid #fff;
}
.accordion-closed .accordion-status {
	float: right;
	margin-top: 8px;
	width: 0;
	height: 0;
	border-left: 6px solid transparent;
	border-right: 6px solid transparent;
	border-bottom: 6px solid #fff;
}
.service-checkbox {
	display: inline-block;
	position: relative;
	height: 15px;
	width: 15px;
	vertical-align: middle;
	margin-left: 5px;
}
.service-checkbox input {
	visibility: hidden;
	position: absolute;
}
.service-checkbox label {
	display: block;
	background: #fff;
	width: 100%;
	height: 100%;
	background-size: 15px 15px;
}
.service-checkbox input[type=checkbox]:checked~label {
	background-image: url('../assets/images/checkbox-checked.png');
}
</style>
