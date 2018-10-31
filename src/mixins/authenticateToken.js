import $ from 'jquery'
import ENV from '../environment'

var langTerms = {
	unrecognized_email: {
		'en-ca': 'Unrecognized email address',
		'en-us': 'Unrecognized email address',
		'fr-ca': 'Unrecognized email address'
	},
	unrecognized_phone: {
		'en-ca': 'Unrecognized phone number',
		'en-us': 'Unrecognized phone number',
		'fr-ca': 'Unrecognized phone number'
	},
	unrecognized_name: {
		'en-ca': 'Unrecognized last name',
		'en-us': 'Unrecognized last name',
		'fr-ca': 'Nom de famille non reconnu'
	},
	were_sorry: {
		'en-ca': 'We\'re sorry but we don\'t recognize',
		'en-us': 'We\'re sorry but we don\'t recognize',
		'fr-ca': 'Désolé mais le nom'
	},
	database: {
		'en-ca': 'in our database',
		'en-us': 'in our database',
		'fr-ca': 'est non reconnu dans notre système.'
	}
}

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
					client_secret: _this.verificationCode.toLowerCase(),
					scope: ENV.scope
				}
			}).done((response, textStatus, xhr) => {
				if (xhr.status === 200) {
					_this.$root.accessToken = response.access_token

					let getServices = new Promise((resolve, reject) => {
						let url = ENV.production_url + '/services/' + _this.$root.token
						if (this.$root.meta.local) {
							url += '/' + this.$root.meta.local
						}
						$.ajax({
							url,
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
						let url = ENV.production_url + '/inspection/' + _this.$root.token
						if (this.$root.meta.local) {
							url += '/' + this.$root.meta.local
						}
						$.ajax({
							url,
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
							approvedCount: 0,
							concernCount: 0
						}
						let inspectionTotal = 0
						let serviceTotal = 0
						let serviceTaxTotal = 0

						_this.$root.meta.inspectionPdfUrl = values[1].fullInspectionUrl
						_this.$root.meta.advisor = values[2]

						values[0].forEach(service => {
							if (service.parentServiceId) {
								values[0].forEach(parentService => {
									if (parentService.id === service.parentServiceId) {
										if (!parentService.subServices) {
											parentService.subServices = []
										}
										parentService.subServices.push(service)
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
							} else if (service.category === '6') {
								inspectionCounts.concernCount += 1
							} else if (service.category === '7') {
								inspectionCounts.concernCount += 1
							} else if (service.category === '8') {
								inspectionCounts.concernCount += 1
							} else if (service.category === '9') {
								inspectionCounts.concernCount += 1
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

							if (category.id === '5') {
								_this.$root.services.forEach(service => {
									if (
										service.category === '6' ||
										service.category === '7' ||
										service.category === '8' ||
										service.category === '9'
									) {
										if (service.subServices) {
											service.subServices.forEach(subService => {
												inspectionTotal += subService.price
											})
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

						if (inspectionCounts.failCount === 0 && inspectionCounts.warningCount === 0) {
							_this.$router.push({name: 'inspection'})
						} else {
							_this.$router.push({name: 'tutorial'})
						}
					}).catch(reason => {
						this.showErrorMessage = true
					})
				} else {
					this.$root.logError('Token authentication failed, error message displayed')
					this.showErrorMessage = true
				}
			}).fail(reason => {
				this.$root.logError('Passcode failed authentication, error message displayed')
				_this.modalOpen = true
				_this.modal.content = `${langTerms.were_sorry[this.$root.meta.local.toLowerCase()]} <b>${_this.verificationCode}</b> ${langTerms.database[this.$root.meta.local.toLowerCase()]}.`
			})
		}
	}
}

export default authenticateToken
