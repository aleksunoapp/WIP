/* eslint-disable camelcase */
import GlobalFunctions from '@/global.js'

/**
 * Call to API to get a discount for a store.
 * @function
 * @param {number} storeId - ID of the store
 * @returns {object} A promise
 */
export const listDiscountsForStore = (storeId) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'GET',
			dataType: 'json',
			url: `/app/location/discounts/${storeId}`,
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
 * Call to API to create a discount
 * @function
 * @param {object} discount - The discount to create
 * @param {number} storeId - ID of the store the discount belongs to
 * @returns {object} A promise
 */
export const createDiscount = (discount, storeId) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'POST',
			dataType: 'json',
			url: `/app/location/discounts/create/${storeId}`,
			data: discount,
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
 * Call to API to update a discount
 * @function
 * @param {object} discount - The updated discount
 * @returns {object} A promise
 */
export const updateDiscount = (discount) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'POST',
			dataType: 'json',
			url: `/app/location/discounts/update/${discount.id}`,
			data: discount,
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
* Call to API to delete a discount
* @function
* @param {object} discountId - ID of the discount to delete
* @returns {object} A promise
*/
export const deleteDiscount = (discountId) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'DELETE',
			url: `/app/location/discounts/${discountId}`,
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
	listDiscountsForStore,
	createDiscount,
	updateDiscount,
	deleteDiscount
}
