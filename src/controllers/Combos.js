/* eslint-disable camelcase */
import GlobalFunctions from '@/global.js'

/**
 * Call to API to get combo offers.
 * @function
 * @returns {object} A promise
 */
export const listComboOffers = () => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'GET',
			dataType: 'json',
			url: `/app/combooffers/`,
			success: function (response) {
				resolve(response)
			},
			error: function (error) {
				reject(error)
			}
		})
	})
}

/**
 * Call to API to create a combo offer
 * @function
 * @param {object} comboOffer - The new combo offer
 * @returns {object} A promise
 */
export const createComboOffer = (comboOffer) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'POST',
			dataType: 'json',
			url: `/app/combooffers/create`,
			data: comboOffer,
			success: function (response) {
				resolve(response)
			},
			error: function (error) {
				reject(error)
			}
		})
	})
}

/**
 * Call to API to update a combo offer
 * @function
 * @param {object} comboOffer - The edited combo offer
 * @returns {object} A promise
 */
export const updateComboOffer = (comboOffer) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'POST',
			dataType: 'json',
			url: `/app/combooffers/${comboOffer.id}/update`,
			data: comboOffer,
			success: function (response) {
				resolve(response)
			},
			error: function (error) {
				reject(error)
			}
		})
	})
}

/**
 * Call to API to get combo offers for a store
 * @function
 * @param {number} storeId - ID of the store to get combo offers for
 * @returns {object} A promise
 */
export const getComboOffersForAStore = (storeId) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'GET',
			dataType: 'json',
			url: `/app/locations/${storeId}/combos`,
			success: function (response) {
				resolve(response)
			},
			error: function (error) {
				reject(error)
			}
		})
	})
}

/**
 * Call to API to assign combo offers to a store
 * @function
 * @param {number} storeId - ID of the store to assign combo offers to
 * @param {array} comboOffers - IDs of the combo offers to assign
 * @returns {object} A promise
 */
export const assignComboOffersToAStore = (storeId, comboOffers) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'POST',
			dataType: 'json',
			url: `/app/locations/${storeId}/assign_combos`,
			data: comboOffers,
			success: function (response) {
				resolve(response)
			},
			error: function (error) {
				reject(error)
			}
		})
	})
}

/**
 * Call to API to assign combo offers to all stores
 * @function
 * @param {array} comboOffers - IDs of the combo offers to assign
 * @returns {object} A promise
 */
export const assignComboOffersToAllStores = (comboOffers) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'POST',
			dataType: 'json',
			url: `/app/locations/assign_combos_to_all`,
			data: comboOffers,
			success: function (response) {
				resolve(response)
			},
			error: function (error) {
				reject(error)
			}
		})
	})
}

/**
* Call to API to delete a combo offer
* @function
* @param {number} comboOfferId - ID of the combo offer to delete
* @returns {object} A promise
*/
export const deleteComboOffer = (comboOfferId) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'DELETE',
			url: `/app/combooffers/${comboOfferId}/delete/`,
			success: function (response) {
				resolve(response)
			},
			error: function (error) {
				reject(error)
			}
		})
	})
}

/**
 * Call to API to get items in a combo offer
 * @function
 * @param {number} comboOfferId - ID of the combo offer to get items for
 * @returns {object} A promise
 */
export const listComboItems = (comboOfferId) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'GET',
			dataType: 'json',
			url: `/app/combo_items/${comboOfferId}/show`,
			success: function (response) {
				resolve(response)
			},
			error: function (error) {
				reject(error)
			}
		})
	})
}

/**
 * Call to API to create a combo offer item
 * @function
 * @param {object} comboOfferId - ID of the combo offer to add an item to
 * @returns {object} A promise
 */
export const createComboOfferItem = (comboOfferId) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'POST',
			dataType: 'json',
			url: `/app/combo_items/create`,
			data: {
				combo_id: comboOfferId
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

/**
 * Call to API to update a combo offer item
 * @function
 * @param {object} comboOfferItem - The new combo offer item
 * @returns {object} A promise
 */
export const updateComboOfferItem = (comboOfferItem) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'POST',
			dataType: 'json',
			url: `/app/combo_items/update`,
			data: comboOfferItem,
			success: function (response) {
				resolve(response)
			},
			error: function (error) {
				reject(error)
			}
		})
	})
}

/**
 * Call to API to delete a combo offer item
 * @function
 * @param {number} comboOfferItemId - The new combo offer item
 * @returns {object} A promise
 */
export const deleteComboOfferItem = (comboOfferItemId) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'DELETE',
			dataType: 'json',
			url: `/app/combo_items/${comboOfferItemId}/delete`,
			success: function (response) {
				resolve(response)
			},
			error: function (error) {
				reject(error)
			}
		})
	})
}

/**
 * Call to API to get an SKU by ID
 * @function
 * @param {number} skuId - The id of the SKU
 * @returns {object} A promise
 */
export const getComboOfferItemSKUById = (skuId) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'GET',
			dataType: 'json',
			url: `/app/combo_items_sku/${skuId}/show`,
			success: function (response) {
				resolve(response)
			},
			error: function (error) {
				reject(error)
			}
		})
	})
}

/**
 * Call to API to add SKUs to a Combo Offer Item
 * @function
 * @param {object} data - Object containing the Combo Offer Item ID and an array of SKUs
 * @returns {object} A promise
 */
export const createComboOfferItemSKUs = (data) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'POST',
			dataType: 'json',
			data,
			url: `/app/combo_items_sku/create`,
			success: function (response) {
				resolve(response)
			},
			error: function (error) {
				reject(error)
			}
		})
	})
}

/**
 * Call to API to update SKUs in a Combo Offer Item
 * @function
 * @param {object} data - Object containing the Combo Offer Item ID and an array of SKUs
 * @returns {object} A promise
 */
export const updateComboOfferItemSKUs = (data) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'POST',
			dataType: 'json',
			data,
			url: `/app/combo_items_sku/${data.combo_item_id}/update`,
			success: function (response) {
				resolve(response)
			},
			error: function (error) {
				reject(error)
			}
		})
	})
}

/**
 * Call to API to delete an SKU from a Combo Offer Item
 * @function
 * @param {number} skuId - ID of the SKU to delete
 * @returns {object} A promise
 */
export const deleteSKUFromComboOfferItem = (skuId) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'DELETE',
			dataType: 'json',
			url: `/app/combo_items_sku/${skuId}/delete`,
			success: function (response) {
				resolve(response)
			},
			error: function (error) {
				reject(error)
			}
		})
	})
}

/**
 * Call to API to delete SKUs from a Combo Offer Item
 * @function
 * @param {object} data - ID of the Combo Offer Item and array of SKUs
 * @returns {object} A promise
 */
export const deleteSKUsFromComboOfferItem = (data) => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'DELETE',
			dataType: 'json',
			url: `/app/combo_items_sku/deleteMultiple`,
			success: function (response) {
				resolve(response)
			},
			error: function (error) {
				reject(error)
			}
		})
	})
}

export default {
	listComboOffers,
	createComboOffer,
	updateComboOffer,
	getComboOffersForAStore,
	assignComboOffersToAStore,
	assignComboOffersToAllStores,
	deleteComboOffer,
	listComboItems,
	createComboOfferItem,
	updateComboOfferItem,
	deleteComboOfferItem,
	getComboOfferItemSKUById,
	createComboOfferItemSKUs,
	updateComboOfferItemSKUs,
	deleteSKUFromComboOfferItem,
	deleteSKUsFromComboOfferItem
}
