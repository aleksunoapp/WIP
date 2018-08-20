/**
 * @module Admin Manager
 */
import GlobalFunctions from '../global'

export default {
	/**
	 * Call to API to get a list of permissions.
	 * @function
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getAllPermissions: function () {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/admin/permissions',
				data: {
					guard_name: 'admin'
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
	 * Call to API to create a new permission.
	 * @function
	 * @param {object} permission - The permission to create
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	createPermission: function (permission) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/admin/permissions',
				data: permission,
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
	 * Call to API to update a permission.
	 * @function
	 * @param {object} permission - The permission to update
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	updatePermission: function (permission) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'PUT',
				dataType: 'json',
				url: '/app/admin/permissions/' + permission.id,
				data: permission,
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
	 * Call to API to delete a permission.
	 * @function
	 * @param {object} permission - The permission to delete
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	deletePermission: function (permission) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'DELETE',
				dataType: 'json',
				url: '/app/admin/permissions/' + permission.id,
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
	 * Call to API to get a list of permissions of a user.
	 * @function
	 * @param {integer} id - ID of the user
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getPermissionsOfUser: function (id) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: `/app/admin/users/${id}/all_permissions`,
				data: {
					guard_name: 'admin'
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
