/**
 * @module OrderSettings
 */
import GlobalFunctions from '../global'

export default {
  /**
	 * Call to create a new OrderSettings.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @param {object} newOrderSettings - The new OrderSettings object.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  setOrderSettings (appId, appSecret, userToken, newOrderSettings) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'POST',
        dataType: 'json',
        url: '/app/order_config/set',
        data: newOrderSettings,
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
	 * Call to get OrderSettings for a location.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @param {integer} locationId - The id of the location to get OrderSettings for.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  getOrderSettingsForStore (appId, appSecret, userToken, locationId) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'GET',
        dataType: 'json',
        url: '/app/order_config/show/' + locationId,
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
	 * Call to delete an OrderSettings.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @param {integer} locationId - The id of location to delete setttings for
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  deleteOrderSettings (appId, appSecret, userToken, locationId) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'DELETE',
        dataType: 'json',
        url: '/app/order_config/delete/' + locationId,
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
  }
}
