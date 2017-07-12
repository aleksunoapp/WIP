<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
import $ from 'jquery'

export default {
	name: 'app',
	/**
	 * Run on `created` to check whether or not localStorage has been set to determine where to pull data from.
	 * @function
	 * @returns {undefined}
	 */
	created: function () {
		const uniqueUrl = this.$route.params.uniqueUrl
		const storedUrl = localStorage.getItem('unique-url')

		if (storedUrl === null) {
			// If this is the first time a user is accessing the app or the localStorage was cleared since last visit
			localStorage.clear()
			localStorage.setItem('unique-url', uniqueUrl)
			this.getServices()
		} else if (storedUrl !== uniqueUrl) {
			// If the user has been here before but has a new url then we want to clear everything in localStorage as it's no longer relevant
			localStorage.clear()
			localStorage.setItem('unique-url', uniqueUrl)
			this.getServices()
		} else {
			// If the storedUrl matches the uniqueUrl then we need to double check that we have everything stored in localStorage, if not we need to refetch, otherwise we can use what is there.
			if (localStorage.getItem('total') === null || localStorage.getItem('services') === null || localStorage.getItem('meta') === null || localStorage.getItem('inspectionCounts') === null || localStorage.getItem('thanksInfo') === null) {
				this.getServices()
			} else {
				this.$root.services = JSON.parse(localStorage.getItem('services'))
				this.$root.meta = JSON.parse(localStorage.getItem('meta'))
				this.$root.total = parseFloat(localStorage.getItem('total'))
				this.$root.inspectionCounts = JSON.parse(localStorage.getItem('inspectionCounts'))
				this.$root.thanksInfo = JSON.parse(localStorage.getItem('thanksInfo'))
				this.$root.fullInspectionLink = localStorage.getItem('inspectionLink')
			}
		}
	},
	data () {
		return {}
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

			$.when(
				$.getJSON('/static/json/GetServices.json'),
				$.getJSON('/static/json/GetMetaData.json'),
				$.getJSON('/static/json/GetConfirmationDetails.json'),
				$.getJSON('/static/json/GetFullInspectionLink.json')
			).done((result, result2, result3, result4) => {
				let inspectionCounts = {
					failCount: 0,
					warningCount: 0,
					passCount: 0
				}
				let total = 0

				_this.$root.services = result[0].services
				_this.$root.meta = result2[0]
				_this.$root.thanksInfo = result3[0]
				_this.$root.fullInspectionLink = result4[0].fullInspectionUrl

				// Loop through each service and sub service to get the total counts
				_this.$root.services.forEach(service => {
					if (service.category === 1) {
						service.subServices.forEach(subService => {
							inspectionCounts.failCount += 1
						})
					} else if (service.category === 2) {
						service.subServices.forEach(subService => {
							inspectionCounts.warningCount += 1
						})
					} else if (service.category === 3) {
						service.subServices.forEach(subService => {
							inspectionCounts.passCount += 1
						})
					}
				})

				// Loop through all services to calculate the value of all pre approved services
				_this.$root.meta.serviceCategories.forEach(category => {
					if (category.isPreApproved) {
						_this.$root.services.forEach(service => {
							if (service.category === category.id) {
								service.subServices.forEach(subService => {
									total += subService.price
									subService.isSelected = true
								})
							}
						})
					}
				})

				_this.$root.total = total
				_this.$root.inspectionCounts = inspectionCounts

				localStorage.setItem('services', JSON.stringify(_this.$root.services))
				localStorage.setItem('meta', JSON.stringify(_this.$root.meta))
				localStorage.setItem('total', _this.$root.total)
				localStorage.setItem('inspectionCounts', JSON.stringify(_this.$root.inspectionCounts))
				localStorage.setItem('thanksInfo', JSON.stringify(_this.$root.thanksInfo))
				localStorage.setItem('inspectionLink', _this.$root.fullInspectionLink)
			})
		}
	}
}
</script>
