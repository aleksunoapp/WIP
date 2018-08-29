/**
 * @module Login
 */
import GlobalFunctions from '../global'

export default {
	/**
	 * Call to pitapit API to get a list of the modifiers for a store.
	 * @function
	 * @param {integer} storeId - The id of the store to get the modifier for.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getStoreModifiers: function (storeId) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/modifiers/' + storeId,
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
	 * Call to pitapit API to apply a modifier to an item.
	 * @function
	 * @param {ineteger} itemId - The id of the item to apply the modifier on.
	 * @param {object} modifiers - The object of the modifier to be applied.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	applyModifiersToItem: function (
		itemId,
		modifiers,
		appId,
		appSecret,
		userToken
	) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/items/updatemodifier/' + itemId,
				data: { modifiers: modifiers },
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
	 * Call to pitapit API to get the details of a given modifier category.
	 * @function
	 * @param {integer} modifierCategoryId - The id of the modifier category to fetch the details of.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getModifierCategoryDetails: function (modifierCategoryId, appId, appSecret) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/modifiers/show/' + modifierCategoryId,
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
	 * Call to pitapit API to update a modifier category.
	 * @function
	 * @param {object} modifierCategory - The object of the modifier category.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	updateModifierCategory: function (
		modifierCategory,
		appId,
		appSecret,
		userToken
	) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/modifiers/update/' + modifierCategory.id,
				data: modifierCategory,
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
	 * Call to pitapit API to create a new modifier category.
	 * @function
	 * @param {object} modifierCategory - The new modifier category object.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	addNewModifierCategory: function (
		modifierCategory,
		appId,
		appSecret,
		userToken
	) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/modifiers/create',
				data: modifierCategory,
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
	 * Call to pitapit API to get a list of modifier items for a modifier category.
	 * @function
	 * @param {integer} modifierCategoryId - The id the modifier category.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getModifierCategoryItems: function (modifierCategoryId, appId, appSecret) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/moditems/' + modifierCategoryId,
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
	 * Call to pitapit API to get the details of a modifier item.
	 * @function
	 * @param {integer} modifierItemId - The id of the modifier item.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getModifierItemDetails: function (modifierItemId, appId, appSecret) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/moditems/show/' + modifierItemId,
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
	 * Call to pitapit API to update a modifier item.
	 * @function
	 * @param {object} modifierItem - The updated object of the modifier item.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	updateModifierItem: function (modifierItem, appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/moditems/update/' + modifierItem.id,
				data: modifierItem,
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
	 * Call to pitapit API to delete a modifier item.
	 * @function
	 * @param {integer} modifierItemId - The modifierItemId to be deleted.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	deleteModifierItem: function (modifierItemId, appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'DELETE',
				dataType: 'json',
				url: '/app/moditems/' + modifierItemId + '/delete',
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
	 * Call to pitapit API to delete a modifier category.
	 * @function
	 * @param {integer} modifierCategoryId - The modifierCategoryId to be deleted.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	deleteModifierCategory: function (
		modifierCategoryId,
		appId,
		appSecret,
		userToken
	) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'DELETE',
				dataType: 'json',
				url: '/app/modifiers/' + modifierCategoryId + '/delete',
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
	 * Call to pitapit API to create a new modifier item.
	 * @function
	 * @param {object} modifierItem - The new modifier item object.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	addNewModifierItem: function (modifierItem, appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/moditems/create',
				data: modifierItem,
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
	 * Call to pitapit API to get the nutrition info for a given modifier item id.
	 * @function
	 * @param {integer} modifierItemId - The id of the modifier item.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getModifierItemNutritionInfo: function (modifierItemId, appId, appSecret) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/moditemnutrition/' + modifierItemId,
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
	 * Call to pitapit API to update nutrition info for a modifier item.
	 * @function
	 * @param {object} updatedNutritionInfo - The object of the nutrition info.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	updateModifierNutritionInfo: function (
		updatedNutritionInfo,
		appId,
		appSecret,
		userToken
	) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/moditemnutrition/update/' + updatedNutritionInfo.id,
				data: updatedNutritionInfo,
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
	 * Call to pitapit API to create new nutrition info for a modifier item.
	 * @function
	 * @param {object} newNutritionInfo - The new nutrition info object.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	createModifierNutritionInfo: function (
		newNutritionInfo,
		appId,
		appSecret,
		userToken
	) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/moditemnutrition/create',
				data: newNutritionInfo,
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
	 * Call to pitapit API to apply one modifier to multiple items.
	 * @function
	 * @param {integer} modifierId - The id of the selected modifier.
	 * @param {array} itemsToAdd - The array of ids of selected items.
	 * @param {array} itemsToRemove - The array of ids of unselected items.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	applyModifierToMultipleItems (
		modifierId,
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
				url: '/app/modifiers/addItems/' + modifierId,
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
	},
	/**
	 * Call to API to apply a modifier to locations.
	 * @function
	 * @param {object} data - An object containing IDs of the modifier and of the locations
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	applyModifierToLocations (data) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/moditems/addModifierItemToMultipleLocations',
				data,
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
	 * Call to pitapit API to apply a modifier category to items at selected locations.
	 * @function
	 * @param {integer} data - An object containing modifier ID and selected items and locations.
	 * @param {string} appId - The appId of the current application.
	 * @param {string} appSecret - The appSecret of the current application.
	 * @param {string} userToken - The token of the current logged in user.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	applyModifierToItemsAtLocations (data, appId, appSecret, userToken) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/modifiers/addItemToMultipleLocation',
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
	 * Call to pitapit API to apply a modifier category to items at selected locations.
	 * @function
	 * @param {integer} data - An object containing modifier ID and location IDs.
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	copyModifierToMultipleLocations (data) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/modifiers/copyModifierToMultipleLocations',
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
