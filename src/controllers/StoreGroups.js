/**
 * @module Stores
 */
import GlobalFunctions from '../global'

export default {
  /**
	 * Call to pitapit API to create a new location group.
	 * @function
	 * @param {object} newStoreGroup - The new store group object.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The auth token of the logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  createNewGroup: function (newStoreGroup, appId, appSecret, userToken) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'POST',
        dataType: 'json',
        url: '/app/location_groups/create',
        data: newStoreGroup,
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
	 * Call to pitapit API to get a list of location groups.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The auth token of the logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  getGroups (appId, appSecret, userToken) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'GET',
        dataType: 'json',
        url: '/app/location_groups',
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
	 * Call to pitapit API to get the details of a specific group.
	 * @function
	 * @param {integer} groupId - The id of the selected group.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The auth token of the logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  getGroupDetails (groupId, appId, appSecret, userToken) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'GET',
        dataType: 'json',
        url: '/app/location_groups/' + groupId + '/show',
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
	 * Call to pitapit API to update the details of a specific group.
	 * @function
	 * @param {object} group - The updated group object.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The auth token of the logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  updateGroup (group, appId, appSecret, userToken) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'POST',
        dataType: 'json',
        url: '/app/location_groups/' + group.id + '/update',
        data: group,
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
	 * Call to pitapit API to get the list of locations that belong to the current group.
	 * @function
	 * @param {integer} groupId - The id of the selected group.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The auth token of the logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  getGroupLocations (groupId, appId, appSecret, userToken) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'GET',
        dataType: 'json',
        url: '/app/location_groups/' + groupId + '/stores',
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
	 * Call to pitapit API to apply menus to a group of locations.
	 * @function
	 * @param {integer} groupId - The id of the selected group.
	 * @param {object} menusToBeApplied - The selected menus.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The auth token of the logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  applyMenusToGroup (groupId, menusToBeApplied, appId, appSecret, userToken) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'POST',
        dataType: 'json',
        url: '/app/sync/' + groupId + '/corporateto/group',
        data: menusToBeApplied,
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
	 * Call to pitapit API to assign store location to a group.
	 * @function
	 * @param {integer} groupId - The id of the selected group.
	 * @param {object} storesToBeAssigned - The selected store locations.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The auth token of the logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  assignStoresToGroup (
    groupId,
    storesToBeAssigned,
    appId,
    appSecret,
    userToken
  ) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'POST',
        dataType: 'json',
        url: '/app/location_groups/' + groupId + '/addstores',
        data: { stores: storesToBeAssigned },
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
	 * Call to pitapit API to assign a menu tier to a location group.
	 * @function
	 * @param {object} data - Object containing location IDs and override options
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  assignMenuTiersToGroup (data) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'POST',
        dataType: 'json',
        url: '/app/sync/' + data.tier + '/menu_tier_to_locations',
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
