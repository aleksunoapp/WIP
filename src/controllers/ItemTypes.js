/**
 * @module Tax Classes
 */
import GlobalFunctions from '../global'

export default {
  /**
	 * Call to API to get a list of existing item types.
	 * @function
	 * @param {object} data - An object containing the location ID to get Item Types for
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The auth token of the logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  getItemTypes: function (data, appId, appSecret, userToken) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'GET',
        dataType: 'json',
        url: '/app/item_type',
        data,
        beforeSend: function (xhr) {
          xhr.setRequestHeader('auth-token', userToken)
          xhr.setRequestHeader('app-id', appId)
          xhr.setRequestHeader('app-secret', appSecret)
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
	 * Call to API to create an item type.
	 * @function
	 * @param {object} newItemType - The new item type object.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The auth token of the logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  createItemType: function (newItemType, appId, appSecret, userToken) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'POST',
        dataType: 'json',
        url: '/app/item_type',
        data: newItemType,
        beforeSend: function (xhr) {
          xhr.setRequestHeader('auth-token', userToken)
          xhr.setRequestHeader('app-id', appId)
          xhr.setRequestHeader('app-secret', appSecret)
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
	 * Call to API to update an item type.
	 * @function
	 * @param {object} itemType - The edited item type object.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The auth token of the logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  updateItemType: function (itemType, appId, appSecret, userToken) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'PUT',
        dataType: 'json',
        url: '/app/item_type/' + itemType.id,
        data: itemType,
        beforeSend: function (xhr) {
          xhr.setRequestHeader('auth-token', userToken)
          xhr.setRequestHeader('app-id', appId)
          xhr.setRequestHeader('app-secret', appSecret)
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
	 * Call to API to delete an item type.
	 * @function
	 * @param {integer} id - Id of the item type to delete.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The auth token of the logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  deleteItemType: function (id, appId, appSecret, userToken) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'DELETE',
        dataType: 'json',
        url: '/app/item_type/' + id,
        data: {},
        beforeSend: function (xhr) {
          xhr.setRequestHeader('auth-token', userToken)
          xhr.setRequestHeader('app-id', appId)
          xhr.setRequestHeader('app-secret', appSecret)
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
	 * Call to API to get tax classes for an item type.
	 * @function
	 * @param {integer} id - Id of the item type to get tax classes for.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The auth token of the logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  getTaxClassesForItemType: function (id, appId, appSecret, userToken) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'GET',
        dataType: 'json',
        url: '/app/item_type/' + id + '/taxclass',
        data: {},
        beforeSend: function (xhr) {
          xhr.setRequestHeader('auth-token', userToken)
          xhr.setRequestHeader('app-id', appId)
          xhr.setRequestHeader('app-secret', appSecret)
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
	 * Call to API to get tax classes for an item type.
	 * @function
	 * @param {integer} id - Id of the item type to get tax classes for.
	 * @param {object} taxClasses - An object containing an array of id of the tax classes to apply.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The auth token of the logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  applyTaxClassesToItemType: function (
    id,
    taxClasses,
    appId,
    appSecret,
    userToken
  ) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'POST',
        dataType: 'json',
        url: '/app/item_type/' + id + '/syncTaxclass',
        data: taxClasses,
        beforeSend: function (xhr) {
          xhr.setRequestHeader('auth-token', userToken)
          xhr.setRequestHeader('app-id', appId)
          xhr.setRequestHeader('app-secret', appSecret)
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
