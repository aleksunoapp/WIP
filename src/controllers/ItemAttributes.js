/**
 * @module Item Attributes
 */
import GlobalFunctions from '../global'

export default {
  /**
	 * Call to pitapit API to create a new Item Attribute.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The auth token of the logged in user.
	 * @param {object} newItemAttribute - The new Item Attribute.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  createItemAttribute: function (
    appId,
    appSecret,
    userToken,
    newItemAttribute
  ) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'POST',
        dataType: 'json',
        url: '/attributes/create',
        data: newItemAttribute,
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
	 * Call to pitapit API to list a Item Attributes.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The auth token of the logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  listItemAttributes: function (appId, appSecret, userToken) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'GET',
        dataType: 'json',
        url: '/attributes/list_attributes',
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
	 * Call to pitapit API to update an Item Attribute.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The auth token of the logged in user.
	 * @param {object} itemAttributeToEdit - The Item Attribute to edit.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  updateItemAttribute: function (
    appId,
    appSecret,
    userToken,
    itemAttributeToEdit
  ) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'POST',
        dataType: 'json',
        url: '/attributes/update',
        data: itemAttributeToEdit,
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
	 * Call to pitapit API to delete an Item Attribute.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The auth token of the logged in user.
	 * @param {object} itemAttributeToDelete - The Item Attribute to delete.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  deleteItemAttribute: function (
    appId,
    appSecret,
    userToken,
    itemAttributeToDelete
  ) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'POST',
        dataType: 'json',
        url: '/attributes/delete',
        data: itemAttributeToDelete,
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
	 * Call to pitapit API to list a Items with the selected Item Attribute.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The auth token of the logged in user.
	 * @param {integer} itemAttributeId - The id of the Item Attribute to list Items for.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  listItemsOfItemAttribute: function (
    appId,
    appSecret,
    userToken,
    itemAttributeId
  ) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'GET',
        dataType: 'json',
        url: '/attributes/getItemsOfAttributes/' + itemAttributeId,
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
	 * Call to pitapit API to assign Items to an Item Attribute.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The auth token of the logged in user.
	 * @param {integer} itemAttributeId - The id of the Item Attribute to assign to.
	 * @param {object} itemsToAssign - The Items to assign.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  assignItemsToItemAttribute: function (
    appId,
    appSecret,
    userToken,
    itemAttributeId,
    itemsToAssign
  ) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'POST',
        dataType: 'json',
        url: '/attributes/assignItemsToAttribute/' + itemAttributeId,
        data: itemsToAssign,
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
	 * Call to pitapit API to list User Attributes of an Item Attribute.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The auth token of the logged in user.
	 * @param {integer} itemAttributeId - The id of the Item Attribute to list User Attributes for.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  listUserAttributesofItemAttribute: function (
    appId,
    appSecret,
    userToken,
    itemAttributeId
  ) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'GET',
        dataType: 'json',
        url:
					'/user_attributes/getUserAttributesOfAttributes/' +
					itemAttributeId,
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
	 * Call to pitapit API to assign User Attributes to an Item Attribute.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The auth token of the logged in user.
	 * @param {integer} itemAttributeId - The id of the Item Attribute to assign to.
	 * @param {object} userAttributesToAssign - The User Attributes to assign to the Item Attribute.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  assignUserAttributesToItemAttributes: function (
    appId,
    appSecret,
    userToken,
    itemAttributeId,
    userAttributesToAssign
  ) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'POST',
        dataType: 'json',
        url:
					'/user_attributes/setUserAttributesToAttributes/' +
					itemAttributeId,
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
	 * Call to pitapit API to list of Item Attributes for an Item.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The auth token of the logged in user.
	 * @param {integer} itemId - The ID of the Item.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  getItemAttributesOfItem: function (appId, appSecret, userToken, itemId) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'GET',
        dataType: 'json',
        url: '/attributes/getAttributesOfItem/' + itemId,
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
	 * Call to pitapit API to assign Item Attributes to an Item.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The auth token of the logged in user.
	 * @param {integer} itemId - The ID of the Item.
	 * @param {object} itemAttributesToAssign - The Item Attributes to assign.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  assignItemAttributesToItem: function (
    appId,
    appSecret,
    userToken,
    itemId,
    itemAttributesToAssign
  ) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'POST',
        dataType: 'json',
        url: '/attributes/setAttributesOfItem/' + itemId,
        data: itemAttributesToAssign,
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
}
