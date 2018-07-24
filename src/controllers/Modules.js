/**
 * @module Admin Manager
 */
import GlobalFunctions from '../global'

export default ({
	/**
	 * Call to API to get a list of modules.
	 * @function
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getModules: function () {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/admin/modules',
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
	 * Call to API to get a list of modules with associated permissions.
	 * @function
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getFullModules: function () {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/admin/modules/full',
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
	 * Call to API to get a permissions of a module.
	 * @function
	 * @param {object} mod - The module to get permissions for
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getPermissionsForModule: function (mod) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/admin/modules/' + mod.id + '/permissions',
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
	 * Call to API to create a module.
	 * @function
	 * @param {object} mod - The new module
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	createModule: function (mod) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/admin/modules/',
				data: mod,
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
	 * Call to API to update a module.
	 * @function
	 * @param {object} mod - The module to modify
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	updateModule: function (mod) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'PUT',
				dataType: 'json',
				url: '/app/admin/modules/' + mod.id,
				data: mod,
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
	 * Call to API to assign permissions to a module.
	 * @function
	 * @param {object} mod - The module to assign permissions to
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	assignPermissionsToModule: function (mod) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'PUT',
				dataType: 'json',
				url: '/app/admin/modules/' + mod.id + '/permissions',
				data: {permissions: mod.permissions},
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
	 * Call to API to delete a module.
	 * @function
	 * @param {object} mod - The module to delete
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	deleteModule: function (mod) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'DELETE',
				dataType: 'json',
				url: '/app/admin/modules/' + mod.id,
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
