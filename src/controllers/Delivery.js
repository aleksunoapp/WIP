/**
 * @module Delivery
 */
import GlobalFunctions from '../global'

export default {
	/**
	 * Call to API to show delivery profiles for a location.
	 * @function
	 * @param {integer} locationId - The id of the location to show the profile for.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getDeliveryProfiles: function (locationId) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/delivery_profile/show/' + locationId,
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
	 * Call to API to create a delivery profile.
	 * @function
	 * @param {object} data - The data to post to create a delivery profile.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	createDeliveryProfile: function (data) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/delivery_profile/create',
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
	 * Call to API to update a delivery profile.
	 * @function
	 * @param {object} data - The data to post to update a delivery profile.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	updateDeliveryProfile: function (data) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/delivery_profile/update',
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
	 * Call to API to delete a delivery profile.
	 * @function
	 * @param {object} data - The data to post to update a delivery profile.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	deleteDeliveryProfile: function (data) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'DELETE',
				dataType: 'json',
				url: '/app/delivery_profile/delete',
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
