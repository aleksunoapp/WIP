/**
 * @module Login
 */
import GlobalFunctions from '../global'

export default {
	/**
	 * Call to pitapit API to get a store's printers.
	 * @function
	 * @param {string} storeId - The store's id.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getStorePrinters: function (storeId, appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/cloudprinter/' + storeId,
				data: {},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
					xhr.setRequestHeader('auth-token', userToken)
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
	 * Call to pitapit API to create a new printer for a store.
	 * @function
	 * @param {object} newPrinter - The new printer object.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	createNewPrinter: function (newPrinter, appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/cloudprinter/create',
				data: newPrinter,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
					xhr.setRequestHeader('auth-token', userToken)
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
	 * Call to pitapit API to update a printer for a store.
	 * @function
	 * @param {object} updatedPrinter - The updated printer object.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	updatePrinter: function (updatedPrinter, appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/cloudprinter/update',
				data: updatedPrinter,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
					xhr.setRequestHeader('auth-token', userToken)
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
	 * Call to pitapit API to get the details of a specific printer.
	 * @function
	 * @param {object} printerId - The id of the printer to fetch the details for.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getPrinterDetails: function (printerId, appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/cloudprinter/show/' + printerId,
				data: {},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
					xhr.setRequestHeader('auth-token', userToken)
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
