import $ from 'jquery'
import ENV from '../environment'

var authenticateToken = {
	methods: {
		/**
		 * To submit the verification code and redirect to the inspection page
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

						if (!_this.$root.dealer) {
							_this.$router.push({name: 'tutorial'})
						} else {
							_this.$router.push({name: 'inspection'})
						}
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
		}
	}
}

export default authenticateToken
