/**
 * @module User Attributes
 */
import GlobalFunctions from '../global'

export default ({
	/**
	 * Call to pitapit API to create a new User Attribute.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
 	 * @param {string} userToken - The auth token of the logged in user.
	 * @param {object} newUserAttribute - The new User Attribute.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	createUserAttribute: function (appId, appSecret, userToken, newUserAttribute) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/user_attributes/user_create',
				data: newUserAttribute,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
					xhr.setRequestHeader('auth-token', userToken)
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
	 * Call to pitapit API to list a User Attributes.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
 	 * @param {string} userToken - The auth token of the logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	listUserAttributes: function (appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/user_attributes/user_list_attributes',
				data: {},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
					xhr.setRequestHeader('auth-token', userToken)
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
	 * Call to pitapit API to update a User Attribute.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
 	 * @param {string} userToken - The auth token of the logged in user.
	 * @param {object} userAttributeToEdit - The User Attribute to edit.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	updateUserAttribute: function (appId, appSecret, userToken, userAttributeToEdit) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/user_attributes/user_update',
				data: userAttributeToEdit,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
					xhr.setRequestHeader('auth-token', userToken)
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
	 * Call to pitapit API to delete a User Attribute.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
 	 * @param {string} userToken - The auth token of the logged in user.
	 * @param {object} userAttributeToDelete - The User Attribute to delete.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	deleteUserAttribute: function (appId, appSecret, userToken, userAttributeToDelete) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/user_attributes/user_delete',
				data: userAttributeToDelete,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
					xhr.setRequestHeader('auth-token', userToken)
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
	 * Call to pitapit API to list Item Attributes of a User Attribute.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
 	 * @param {string} userToken - The auth token of the logged in user.
	 * @param {integer} userAttributeId - The id of the User Attribute to list Item Attributes for.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	listItemAttributesofUserAttribute: function (appId, appSecret, userToken, userAttributeId) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/user_attributes/getAttributesOfUserAttributes/' + userAttributeId,
				data: {},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
					xhr.setRequestHeader('auth-token', userToken)
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
	 * Call to pitapit API to assign Item Attributes to a User Attribute.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
 	 * @param {string} userToken - The auth token of the logged in user.
	 * @param {integer} userAttributeId - The id of the User Attribute to assign to.
	 * @param {object} userAttributesToAssign - The Item Attributes to assign to the User Attribute.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	assignItemAttributesToUserAttributes: function (appId, appSecret, userToken, userAttributeId, userAttributesToAssign) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/user_attributes/setAttributestoUserAttributes/' + userAttributeId,
				data: userAttributesToAssign,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
					xhr.setRequestHeader('auth-token', userToken)
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
	 * Call to pitapit API to list User Attributes of a User
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
 	 * @param {string} userToken - The auth token of the logged in user.
	 * @param {integer} userId - The id of the User.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getAttributesOfUser: function (appId, appSecret, userToken, userId) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/user_attributes/getAttributesOfUser/' + userId,
				data: {},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
					xhr.setRequestHeader('auth-token', userToken)
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
	 * Call to pitapit API to list Items of a User
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
 	 * @param {string} userToken - The auth token of the logged in user.
	 * @param {integer} userId - The id of the User.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getItemsOfuser: function (appId, appSecret, userToken, userId) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/user_attributes/getItemsOfuser/' + userId,
				data: {},
				beforeSend: function (xhr) {
					xhr.setRequestHeader('app-id', appId)
					xhr.setRequestHeader('app-secret', appSecret)
					xhr.setRequestHeader('auth-token', userToken)
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
})
