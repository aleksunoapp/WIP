/**
 * @module Tax Classes
 */
import GlobalFunctions from '../global'

export default ({
	/**
	 * Call to API to get a list of existing item types.
	 * @function
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getItemTypes: function () {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/item_type',
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
	 * Call to API to create an item type.
	 * @function
	 * @param {object} newItemType - The new item type object.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	createItemType: function (newItemType) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/item_type',
				data: newItemType,
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
	 * Call to API to update an item type.
	 * @function
	 * @param {object} itemType - The edited item type object.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	updateItemType: function (itemType) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'PUT',
				dataType: 'json',
				url: '/app/item_type/' + itemType.id,
				data: itemType,
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
	 * Call to API to delete an item type.
	 * @function
	 * @param {integer} id - Id of the item type to delete.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	deleteItemType: function (id) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'DELETE',
				dataType: 'json',
				url: '/app/item_type/' + id,
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
	 * Call to API to get tax classes for an item type.
	 * @function
	 * @param {integer} id - Id of the item type to get tax classes for.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getTaxClassesForItemType: function (id) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/item_type/' + id + '/taxclass',
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
	 * Call to API to get tax classes for an item type.
	 * @function
	 * @param {integer} id - Id of the item type to get tax classes for.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getTaxClassesForItemType: function (id) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/item_type/' + id + '/taxclass',
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
	 * Call to API to get tax classes for an item type.
	 * @function
	 * @param {integer} id - Id of the item type to get tax classes for.
	 * @param {object} taxClasses - An object containing an array of id of the tax classes to apply.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	applyTaxClassesToItemType: function (id, taxClasses) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/item_type/' + id + '/taxclass',
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