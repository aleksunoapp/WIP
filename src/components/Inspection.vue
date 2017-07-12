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
			<template v-for="(category, index) in $root.meta.serviceCategories">
				<div :class="{'accordian-open': category.defaultExpended, 'accordian-closed': !category.defaultExpended}" :style="{'background-color': category.bodyBgColor}" class="accordian">
					<div @click="toggleAccordian(category)" :style="{'background-color': category.headerBgColor}" class="accordian-header">
						<img :src="category.iconUrl"> {{ category.name }} ({{ $root.inspectionCounts[countVariables[category.type]] }})
						<div class="accordian-status"></div>
						<div class="clear"></div>
					</div>
					<div class="accordian-contents">
						<div class="summary-table">
							<div v-if="category.type !== 'pass'" class="summary-table-row">
								<div class="summary-table-cell">
									<span class="summary-legend">
										<b>PLEASE CHECK THE RECOMMENDATION THAT YOU WOULD WANT TO DO TODAY.</b>
									</span>
								</div>

								<div class="summary-table-cell">
									<span> {{ (category.allSelected) ? 'Remove All' : 'Select All' }} </span>
									<div class="service-checkbox">
										<input type="checkbox" :id="`select-${category.type}`" v-model="category.allSelected" @change="toggleAll(category)">
										<label :for="`select-${category.type}`">
											<span class="check"></span>
											<span class="box"></span>
										</label>
									</div>
								</div>
							</div>

							<div v-if="category.type == 'pass'" class="view-full-report">
								<div class="view-full-report-btn" @click="openFullInspection()">
									<a id="viewReport">
										View Full Report
										<img src="../assets/images/external-link.png">
									</a>
								</div>
							</div>

							<template v-for="service in $root.services">
								<template v-if="service.category === category.id">
									<template v-for="subService in service.subServices">
										<div class="summary-table-row  summary-item">
											<div class="summary-table-cell">
												<span class="information-icon"></span>
												{{ subService.name }}
											</div>
											<div class="summary-table-cell">
												<template v-if="category.type !== 'pass'">
													<span class="price"> ${{ subService.price }} </span>
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
								</template>
							</template>
						</div>
					</div>
				</div>
			</template>

			<div class="proceed-component">
				<div class="time-notice">
					If approved by 2:00PM your vehicle will be ready for pickup by 4:00PM.
				</div>
				<div class="total-estimate">
					<div class="total-label">
						<div class="large">
							Total Estimate:
						</div>
						<div class="small">
							Tax Included
						</div>
					</div>
					<div class="total-estimate-value">
						${{ $root.total.toFixed(2) }}
					</div>
				</div>
				<div @click="openServices()" class="proceed-btn">
					Next
				</div>
				<div class="footer-bar">
					<a href="tel:14166288553" class="contact-icon"></a>
					<a href="sms:14166288553" class="chat-icon"></a>
					<a :href="this.$root.fullInspectionLink" target="_blank" class="inspection-summary-link">
						Inspection Summary
					</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data () {
		return {
			countVariables: {
				fail: 'failCount',
				warning: 'warningCount',
				pass: 'passCount'
			}
		}
	},
	created () {
		if (localStorage.getItem('verificationCode') === null) {
			this.$router.push({name: 'code'})
			return
		}

		this.checkSelectAll()
	},
	methods: {
		/**
		 * To open the full inspection in a separate tab
		 * @function
		 * @returns {undefined}
		 */
		openFullInspection () {
			window.open(this.$root.fullInspectionLink, '_blank')
		},
		/**
		 * To toggle the category accordian open and close
		 * @param {object} category - The category to toggle
		 * @function
		 * @returns {undefined}
		 */
		toggleAccordian (category) {
			category.defaultExpended = !category.defaultExpended
		},
		/**
		 * To add and subtract the selected service from the total price and update localStorage
		 * @param {object} category - The parent category of the service
		 * @param {object} subService - The service being toggled
		 * @function
		 * @returns {undefined}
		 */
		toggleCheckbox (category, subService) {
			if (subService.isSelected) {
				this.$root.total += parseFloat(subService.price)
				this.checkSelectAll()
			} else {
				this.$root.total -= parseFloat(subService.price)
				if (category.allSelected) {
					category.allSelected = false
				}
			}

			localStorage.setItem('services', JSON.stringify(this.$root.services))
			localStorage.setItem('total', this.$root.total)
		},
		/**
		 * To turn on or off the checkboxes for all category services as well as add and subtract the selected service from the total price and update localStorage
		 * @param {object} category - The category to be toggled
		 * @function
		 * @returns {undefined}
		 */
		toggleAll (category) {
			if (category.allSelected) {
				this.$root.services.forEach(service => {
					if (service.category === category.id) {
						service.subServices.forEach(subService => {
							if (!subService.isSelected) {
								subService.isSelected = true
								this.$root.total += parseFloat(subService.price)
							}
						})
					}
				})
			} else {
				this.$root.services.forEach(service => {
					if (service.category === category.id) {
						service.subServices.forEach(subService => {
							if (subService.isSelected) {
								subService.isSelected = false
								this.$root.total -= parseFloat(subService.price)
							}
						})
					}
				})
			}
			localStorage.setItem('services', JSON.stringify(this.$root.services))
			localStorage.setItem('total', this.$root.total)
		},
		/**
		 * To check if the select all toggle should be on or off
		 * @function
		 * @returns {undefined}
		 */
		checkSelectAll () {
			this.$root.meta.serviceCategories.forEach(category => {
				let count = 0
				let total = 0

				this.$root.services.forEach(service => {
					if (service.category === category.id) {
						service.subServices.forEach(subService => {
							total += 1
							if (subService.isSelected) {
								count += 1
							}
						})
					}
				})

				if (count === total) {
					category.allSelected = true
				} else {
					category.allSelected = false
				}
			})
		},
		/**
		 * To redirect to the services route
		 * @function
		 * @returns {undefined}
		 */
		openServices () {
			this.$router.push({name: 'services'})
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.accordian-header {
	margin-top:30px;
	font-size: 14px;
	color: #fff;
	padding: 5px 20px;
	line-height: 24px;
	text-align: left;
	text-transform: uppercase;
	cursor: pointer;
}
.accordian .accordian-header > img {
	float: left;
	width: 24px;
	padding-right: 10px;
}
.accordian-open .accordian-status {
	float: right;
	margin-top: 8px;
	width: 0;
	height: 0;
	border-left: 6px solid transparent;
	border-right: 6px solid transparent;
	border-top: 6px solid #fff;
}
.accordian-closed .accordian-status {
	float: right;
	margin-top: 8px;
	width: 0;
	height: 0;
	border-left: 6px solid transparent;
	border-right: 6px solid transparent;
	border-bottom: 6px solid #fff;
}
.accordian-closed .accordian-contents {
	display: none;
}
.summary-table {
	display: table;
	width: 100%;
}
.summary-table-row {
	display: table-row;
}
.summary-table-row .summary-table-cell {
	border-bottom: 1px solid rgba(0,0,0,0.15);
}
.summary-table-cell {
	font-size: 10px;
	display: table-cell;
	text-align: left;
	padding: 5px 10px;
}
.summary-table-cell:first-child {
	width: 66.6667%;
}
.summary-table-cell:last-child {
	width: 33.3333%;
	text-align: right;
}
.inspection .summary-item {
	cursor: pointer;
}
.proceed-btn {
	font-size: 18px;
	font-weight: 700;
	color: #266797;
	padding: 5px 0;
	text-transform: uppercase;
	background-color: #bae4ff;
	cursor: pointer;
}
.proceed-btn:hover {
	background-color: #aad4ef;
}
.inspection .time-notice {
	background-color: #f5f5f5;
}
.inspection .total-estimate {
	background-color: #f5f5f5;
}
.inspection .footer-bar {
	background-color: #f5f5f5;
	text-align: right;
}
.proceed-component {
	position: fixed;
	min-width: 320px;
	max-width: 414px;
	width: 100%;
	bottom: 0;
	z-index: 3;
	background-color:white;
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
