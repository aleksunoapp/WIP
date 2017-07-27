<template>
	<div id="app">
		<router-view v-if="computedMeta"></router-view>
	</div>
</template>

<script>
import $ from 'jquery'
import { isEmpty } from 'lodash'

export default {
	name: 'app',
	/**
	 * Run on `created` to pull all of the data.
	 * @function
	 * @returns {undefined}
	 */
	created: function () {
		this.getServices()
	},
	data () {
		return {}
	},
	computed: {
		/**
		 * To compute whether the meta data object is empty
		 * @function
		 * @returns {boolean} - Whether the meta data object is empty or not
		 */
		computedMeta () {
			return !isEmpty(this.$root.meta)
		}
	},
	methods: {
		/**
		 * To retreive services and meta data from api
		 * @function
		 * @returns {undefined}
		 */
		getServices () {
			let _this = this

			// Since we are repulling the data, the user should not be able to get past the verification screen
			if (this.$route.name !== 'code') {
				this.$router.push({name: 'code'})
			}

			$.getJSON('https://testdynamicmpi.dealer-fx.com/test/').done(response => {
				let inspectionCounts = {
					failCount: 0,
					warningCount: 0,
					passCount: 0,
					approvedCount: 0
				}
				let inspectionTotal = 0
				let inspectionTaxTotal = 0
				let serviceTotal = 0
				let serviceTaxTotal = 0

				_this.$root.services = response.services
				_this.$root.serviceCategories = response.serviceCategory
				_this.$root.meta = {
					repairOrderId: response.repairOrderId,
					customer: response.customer,
					advisor: response.advisor,
					dealer: response.dealer,
					inspectionPdfUrl: response.inspectionPdfUrl,
					carDescription: response.carDescription,
					carImageUrl: response.carImageUrl,
					themeId: response.themeId,
					promise: response.promise,
					responseBy: response.responseBy
				}

				// Loop through each service and sub service to get the total counts
				_this.$root.services.forEach(service => {
					if (service.serviceCategoryId === '1') {
						inspectionCounts.failCount += 1
					} else if (service.serviceCategoryId === '2') {
						inspectionCounts.warningCount += 1
					} else if (service.serviceCategoryId === '3') {
						inspectionCounts.passCount += 1
					} else if (service.serviceCategoryId === '4') {
						inspectionCounts.approvedCount += 1
					}
				})

				// Loop through all services to calculate the value of all pre approved services
				_this.$root.serviceCategories.forEach(category => {
					if (category.showOnInspection && category.serviceCategoryId !== '3') {
						_this.$root.services.forEach(service => {
							if (service.serviceCategoryId === category.serviceCategoryId) {
								if (service.isSelected) {
									inspectionTotal += service.laborPrice + service.partsPrice
									inspectionTaxTotal += service.taxAndFee
									serviceTotal += service.laborPrice + service.partsPrice
									serviceTaxTotal += service.taxAndFee
								}
							}
						})
					}

					if (category.serviceCategoryId === '4') {
						_this.$root.services.forEach(service => {
							if (service.serviceCategoryId === '4') {
								serviceTotal += service.laborPrice + service.partsPrice
								serviceTaxTotal += service.taxAndFee
							}
						})
					}
				})

				_this.$root.serviceCategories.sort((a, b) => {
					return a.sortOrder - b.sortOrder
				})

				_this.$root.totals = {
					inspectionTotal: {
						total: inspectionTotal,
						tax: inspectionTaxTotal
					},
					serviceTotal: {
						total: serviceTotal,
						tax: serviceTaxTotal
					}
				}

				_this.$root.inspectionCounts = inspectionCounts
			})
		}
	}
}
</script>
