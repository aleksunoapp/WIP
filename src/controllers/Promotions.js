/**
 * @module Stores
 */
import GlobalFunctions from '../global'

export default ({
	/**
	 * Call to pitapit API to get all promotions.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} locationId - The id of the store.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getPromotionsForAStore (appId, appSecret, locationId) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/locations/' + locationId + '/promotions',
				data: {},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
				},
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			})
		})
	},
	/**
	 * Call to pitapit API to get all promotions.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getPromotionsList (appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/promotions',
				data: {},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('auth-token', userToken)
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
				},
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			})
		})
	},
	/**
	 * Call to pitapit API to get details of a promotion.
	 * @function
	 * @param {string} promotionId - The id of the promotion.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getPromotionDetails (promotionId, appId, appSecret) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/promotions/' + promotionId + '/show',
				data: {},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
				},
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			})
		})
	},
	/**
	 * Call to pitapit API to create a promotion.
	 * @function
	 * @param {object} newPromotion - The new promotion object.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	createNewPromotion (newPromotion, appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/promotions/create',
				data: newPromotion,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('auth-token', userToken)
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
				},
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			})
		})
	},
	/**
	 * Call to pitapit API to update a promotion.
	 * @function
	 * @param {object} updatedPromotion - The selected promotion object.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	updatePromotion (updatedPromotion, appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'PUT',
				dataType: 'json',
				url: '/app/promotions/' + updatedPromotion.id + '/update',
				data: updatedPromotion,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('auth-token', userToken)
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
				},
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			})
		})
	},
	/**
	 * Call to pitapit API to delete a promotion.
	 * @function
	 * @param {object} promotionId - The id of the promotion object to be deleted.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	deletePromotion (promotionId, appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'DELETE',
				dataType: 'json',
				url: '/app/promotions/' + promotionId + '/delete',
				data: {},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('auth-token', userToken)
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
				},
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			})
		})
	},
	/**
	 * Call to pitapit API to apply selected promotions to a location.
	 * @function
	 * @param {integer} locationId - The id of the store.
	 * @param {array} itemsToAdd - The array of ids of selected promotions.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	assignPromotionsToLocation (locationId, itemsToAdd, appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/locations/' + locationId + '/assign_promotions',
				data: {
					promotions: itemsToAdd
				},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('auth-token', userToken)
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
				},
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			})
		})
	},
	/**
	 * Call to pitapit API to get a list of geolocations.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getGeolocations (appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/geolocations',
				data: {},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('auth-token', userToken)
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
				},
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			})
		})
	},
	/**
	 * Call to pitapit API to create a geolocation.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @param {object} geolocation - The geolocation to create
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	createGeolocation (appId, appSecret, userToken, geolocation) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/geolocations',
				data: geolocation,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('auth-token', userToken)
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
				},
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			})
		})
	},
	/**
	 * Call to pitapit API to update a geolocation.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @param {object} geolocation - The geolocation to create
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	updateGeolocation (appId, appSecret, userToken, geolocation) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'PUT',
				dataType: 'json',
				url: '/app/geolocations/' + geolocation.id,
				data: geolocation,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('auth-token', userToken)
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
				},
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			})
		})
	},
	/**
	 * Call to pitapit API to update a geolocation.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @param {object} geolocation - The geolocation to create
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	deleteGeolocation (appId, appSecret, userToken, geolocation) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'DELETE',
				dataType: 'json',
				url: '/app/geolocations/' + geolocation.id,
				data: geolocation,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('auth-token', userToken)
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
				},
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			})
		})
	},
	/**
	 * Call to pitapit API to assign a promotion to all stores.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @param {object} promotion - The promotion to assign
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	applyToAllStores (appId, appSecret, userToken, promotion) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/locations/assign_promotions_to_all',
				data: promotion,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('auth-token', userToken)
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
				},
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			})
		})
	},
	/**
	 * Call to pitapit API to assign a promotion to a store group.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @param {object} promotion - The promotion to assign
	 * @param {integer} groupId - The id of the store group
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	applyToGroup (appId, appSecret, userToken, promotion, groupId) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/location_groups/' + groupId + '/assign_promotion',
				data: promotion,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('auth-token', userToken)
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
				},
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			})
		})
	},
	/**
	 * Call to pitapit API to assign a promotion to a user group.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @param {object} promotion - The promotion to assign
	 * @param {integer} groupId - The id of the user group
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	applyToUserGroup (appId, appSecret, userToken, promotion, groupId) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/userGroup/' + groupId + '/assign_promotions',
				data: promotion,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('auth-token', userToken)
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
				},
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			})
		})
	},
	/**
	 * Call to pitapit API to assign a promotions to a geolocation.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @param {object} promotions - The promotion to assign
	 * @param {integer} geolocationId - The geolocation ID to assign the promotions to
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	applyToGeolocation (appId, appSecret, userToken, promotions, geolocationId) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/geolocations/' + geolocationId + '/assign_promotions',
				data: promotions,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('auth-token', userToken)
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
				},
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			})
		})
	},
	/**
	 * Call to pitapit API to get a QR code for a promotion.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @param {object} promotion - The promotion to assign
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	generateQrcode (appId, appSecret, userToken, promotion) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/promotion_qrcodes/generate',
				data: promotion,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('auth-token', userToken)
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
				},
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			})
		})
	},
	/**
	 * Call to pitapit API to delete a QR code.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @param {object} qrCodeId - The id of the QR code to delete
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	deleteQrCode (appId, appSecret, userToken, qrCodeId) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'DELETE',
				dataType: 'json',
				url: '/app/promotion_qrcodes/' + qrCodeId,
				data: {},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('auth-token', userToken)
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
				},
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			})
		})
	},
	/**
	 * Call to pitapit API to get a QR code for a promotion.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getQrCodes (appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/promotion_qrcodes',
				data: {},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('auth-token', userToken)
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
				},
				success: function (response) {
					resolve(response)
				},
				error: function (error) {
					reject(error)
				}
			})
		})
	}
})
