/* eslint-disable camelcase */
import GlobalFunctions from '@/global.js'

/**
 * Call to API to get payment terminal for a store.
 * @function
 * @param {number} storeId - ID of the store
 * @returns {object} A promise
 */
export const listPaymentTerminalForStore = (storeId) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'GET',
			dataType: 'json',
			url: `/app/location/payment_terminal/${storeId}`,
			success: function (response) {
				resolve(response)
			},
			error: function (error) {
				reject(error)
			}
		})
	})
}

/**
 * Call to API to create payment terminal
 * @function
 * @param {object} paymentTerminal - The payment terminal to update
 * @param {number} storeId - ID of the store
 * @returns {object} A promise
 */
export const createPaymentTerminal = (paymentTerminal, storeId) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'POST',
			dataType: 'json',
			url: `/app/location/payment_terminal/create/${storeId}`,
			data: paymentTerminal,
			success: function (response) {
				resolve(response)
			},
			error: function (error) {
				reject(error)
			}
		})
	})
}

/**
 * Call to API to update payment terminal
 * @function
 * @param {object} paymentTerminal - The updated payment terminal
 * @returns {object} A promise
 */
export const updatePaymentTerminal = (paymentTerminal) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'POST',
			dataType: 'json',
			url: `/app/location/payment_terminal/update/${paymentTerminal.id}`,
			data: paymentTerminal,
			success: function (response) {
				resolve(response)
			},
			error: function (error) {
				reject(error)
			}
		})
	})
}

/**
* Call to API to delete payment terminal
* @function
* @param {object} paymentTerminalId - ID of the payment terminal to delete
* @returns {object} A promise
*/
export const deletePaymentTerminal = (paymentTerminalId) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'DELETE',
			url: `/app/location/payment_terminal/${paymentTerminalId}`,
			success: function (response) {
				resolve(response)
			},
			error: function (error) {
				reject(error)
			}
		})
	})
}

export default {
	listPaymentTerminalForStore,
	createPaymentTerminal,
	updatePaymentTerminal,
	deletePaymentTerminal
}
