/**
 * @module Stores
 */
import GlobalFunctions from '../global'

export default {
	/**
	 * Call to API to get all promo codes.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @param {string} brandId - The id of the brand.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getAllPromoCodes (appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/promocodes',
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
	 * Call to API to get all promo codes.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @param {string} promoCodeId - The id of the promo code.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getAllPromoCodeDetails (appId, appSecret, userToken, promoCodeId) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/promocodes/show/' + promoCodeId,
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
	 * Call to API to create a new promo code.
	 * @function
	 * @param {string} promoCode - The new promo code object to be created.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	createNewPromoCode (promoCode, appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/promocodes/create',
				data: promoCode,
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
	 * Call to API to update a promo code.
	 * @function
	 * @param {string} promoCode - The promo code object to be edited.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	updatePromoCode (promoCode, appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/promocodes/' + promoCode.id + '/update',
				data: promoCode,
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
	 * Call to API to get all promotions.
	 * @function
	 * @param {string} promoCodeId - The id of the promo code to be deleted.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	deletePromoCode (promoCodeId, appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'DELETE',
				dataType: 'json',
				url: '/app/promocodes/' + promoCodeId + '/delete',
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
}
