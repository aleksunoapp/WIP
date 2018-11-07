/* eslint-disable camelcase */
import GlobalFunctions from '@/global.js'

/**
 * Call to API to get payment methods for a store.
 * @function
 * @param {number} storeId - ID of the store
 * @returns {object} A promise
 */
export const listPaymentMethodsForStore = (storeId) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'GET',
			dataType: 'json',
			url: `/app/payment_methods/${storeId}`,
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
 * Call to API to create payment methods
 * @function
 * @param {object} paymentMethods - The payment methods to update
 * @returns {object} A promise
 */
export const createPaymentMethods = (paymentMethods) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'POST',
			dataType: 'json',
			url: `/app/payment_methods/create`,
			data: paymentMethods,
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
 * Call to API to update payment methods
 * @function
 * @param {object} paymentMethods - The updated payment methods
 * @returns {object} A promise
 */
export const updatePaymentMethods = (paymentMethods) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'POST',
			dataType: 'json',
			url: `/app/payment_methods/update/${paymentMethods.id}`,
			data: paymentMethods,
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
* Call to API to delete payment methods
* @function
* @param {object} paymentMethodsId - ID of the payment methods to delete
* @returns {object} A promise
*/
export const deletePaymentMethods = (paymentMethodsId) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'DELETE',
			url: `/app/payment_methods/delete/${paymentMethodsId}`,
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
	listPaymentMethodsForStore,
	createPaymentMethods,
	updatePaymentMethods,
	deletePaymentMethods
}
