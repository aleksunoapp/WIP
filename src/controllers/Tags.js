/**
 * @module Login
 */
import GlobalFunctions from '../global'

export default {
  /**
	 * Call to pitapit API to get a list of the tags for a store.
	 * @function
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {integer} storeId - The id of the store to get the modifier for.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  getTags: function (appId, appSecret) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'GET',
        dataType: 'json',
        url: '/app/tags',
        data: {},
        beforeSend: function (xhr) {
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
	 * Call to pitapit API to create a new tag.
	 * @function
	 * @param {object} newTag - The new tag object.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  createTag: function (newTag, appId, appSecret, userToken) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'POST',
        dataType: 'json',
        url: '/app/tags/create',
        data: newTag,
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
	 * Call to pitapit API to apply multiple tags to one item.
	 * @function
	 * @param {integer} itemId - The id of the selected item.
	 * @param {array} tags - The array of selected tags to be applied.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  applyTagsToItem: function (itemId, tags, appId, appSecret, userToken) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'POST',
        dataType: 'json',
        url: '/app/items/updatetags/' + itemId,
        data: { tags: tags },
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
	 * Call to pitapit API to apply multiple tags to one modifier item.
	 * @function
	 * @param {integer} modifierItemId - The id of the selected modifier item.
	 * @param {array} tags - The array of selected tags to be applied.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  applyTagsToModifierItem: function (
    modifierItemId,
    tags,
    appId,
    appSecret,
    userToken
  ) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'POST',
        dataType: 'json',
        url: '/app/moditems/updatetags/' + modifierItemId,
        data: { tags: tags },
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
	 * Call to pitapit API to get the details of a specific tag.
	 * @function
	 * @param {integer} tagId - The id of the selected tag.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  getTagDetails: function (tagId, appId, appSecret, userToken) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'GET',
        dataType: 'json',
        url: '/app/tags/show/' + tagId,
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
	 * Call to pitapit API to update the details of a specific tag.
	 * @function
	 * @param {object} tag - The updated tag object.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  updateTag: function (tag, appId, appSecret, userToken) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'POST',
        dataType: 'json',
        url: '/app/tags/update/' + tag.id,
        data: tag,
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
	 * Call to pitapit API to apply one tag to multiple modifier items.
	 * @function
	 * @param {integer} tagId - The id of the selected tag.
	 * @param {array} modifierItems - The array of ids of selected modifier items.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  applyTagToMultipleModItems (
    tagId,
    modifierItems,
    appId,
    appSecret,
    userToken
  ) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'POST',
        dataType: 'json',
        url: '/app/tags/addModifierItems/' + tagId,
        data: { modifier_items_id: modifierItems },
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
	 * Call to pitapit API to apply one tag to multiple items.
	 * @function
	 * @param {integer} tagId - The id of the selected tag.
	 * @param {array} itemsToAdd - The array of ids of selected items.
	 * @param {array} itemsToRemove - The array of ids of unselected items.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
  applyTagToMultipleItems (
    tagId,
    itemsToAdd,
    itemsToRemove,
    appId,
    appSecret,
    userToken
  ) {
    return new Promise(function (resolve, reject) {
      GlobalFunctions.$ajax({
        method: 'POST',
        dataType: 'json',
        url: '/app/tags/addItems/' + tagId,
        data: {
          items_to_add: itemsToAdd,
          items_to_remove: itemsToRemove
        },
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
