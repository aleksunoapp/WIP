/**
 * @module Tax Classes
 */
import GlobalFunctions from '../global'

export default ({
	/**
	 * Call to API to get a list of existing tax classes.
	 * @function
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getTaxClasses: function () {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/taxclass',
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
	 * Call to API to create a tax class.
	 * @function
	 * @param {object} newTaxClass - The new tax class object.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	createTaxClass: function (newTaxClass) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/taxclass',
				data: newTaxClass,
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
	 * Call to API to update a tax class.
	 * @function
	 * @param {object} taxClass - The edited tax class object.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	updateTaxClass: function (taxClass) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'PUT',
				dataType: 'json',
				url: '/app/taxclass/' + taxClass.id,
				data: taxClass,
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
	 * Call to API to delete a tax class.
	 * @function
	 * @param {integer} id - Id of the tax class to delete.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	updateTaxClass: function (id) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'DELETE',
				dataType: 'json',
				url: '/app/taxclass/' + id,
				data: {},
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