/**
 * @module Admin Manager
 */
import GlobalFunctions from '../global'

export default {
	/**
	 * Call to API to get a list of roles.
	 * @function
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getRoles: function () {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/admin/roles',
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
	 * Call to API to create a new role.
	 * @function
	 * @param {object} role - The role to create
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	createRole: function (role) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/admin/roles',
				data: role,
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
	 * Call to API to update a role.
	 * @function
	 * @param {object} role - The role to update
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	updateRole: function (role) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'PUT',
				dataType: 'json',
				url: '/app/admin/roles/' + role.id,
				data: role,
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
	 * Call to API to delete a role.
	 * @function
	 * @param {object} role - The role to delete
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	deleteRole: function (role) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'DELETE',
				dataType: 'json',
				url: '/app/admin/roles/' + role.id,
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
	 * Call to API to get permissions of a role.
	 * @function
	 * @param {object} role - The role to get permissions for
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	listRolePermissions: function (role) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/admin/roles/' + role.id + '/permissions',
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
	 * Call to API to add permissions to a role.
	 * @function
	 * @param {object} role - The role to add permissions to
	 * @param {object} permissions - The permissions to add
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	addPermissionsToRole: function (role, permissions) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/admin/roles/' + role.id + '/permissions',
				data: permissions,
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
	 * Call to API to remove permissions from a role.
	 * @function
	 * @param {object} role - The role to remove permissions from
	 * @param {object} permissions - The permissions to remove
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	removePermissionsFromRole: function (role, permissions) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'DELETE',
				dataType: 'json',
				url: '/app/admin/roles/' + role.id + '/permissions',
				data: permissions,
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
	 * Call to API to replace permissions of a role.
	 * @function
	 * @param {object} role - The role to overwrite permissions for
	 * @param {object} permissions - The new permissions
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	overwriteRolePermissions: function (role, permissions) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'PUT',
				dataType: 'json',
				url: '/app/admin/roles/' + role.id + '/permissions',
				data: permissions,
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
