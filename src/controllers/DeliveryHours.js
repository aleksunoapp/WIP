/**
 * @module DeliveryHours
 */
import GlobalFunctions from '../global'

export default {
	/**
	 * Call to create delivery hours.
	 * @function
	 * @param {object} data - The location ID and delivery hours
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	createDeliveryHours (data) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/delivery_hours/create',
				data,
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
	 * Call to get delivery hours for a location.
	 * @function
	 * @param {integer} locationId - The id of the location to get delivery hours for.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getDeliveryHoursForStore (locationId) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/delivery_hours/' + locationId,
				data: {},
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
	 * Call to update delivery hours.
	 * @function
	 * @param {object} data - The edited delivery hours.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	updateDeliveryHours (data) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/delivery_hours/update',
				data,
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
	 * Call to delete delivery hours.
	 * @function
	 * @param {integer} data - IDs of the location and hours
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	deleteDeliveryHours (data) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'DELETE',
				dataType: 'json',
				url: '/app/delivery_hours/delete',
				data,
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
