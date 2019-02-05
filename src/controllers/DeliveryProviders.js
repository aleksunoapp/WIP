/* eslint-disable camelcase */
import GlobalFunctions from '@/global.js'

/**
 * Call to API to get delivery provider for a store.
 * @function
 * @param {number} storeId - ID of the store
 * @returns {object} A promise
 */
export const listDeliveryProviderForStore = (storeId) => {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'GET',
      dataType: 'json',
      url: `/app/location_delivery_provider/${storeId}`,
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
 * Call to API to create delivery provider
 * @function
 * @param {object} deliveryProvider - The delivery provider to update
 * @returns {object} A promise
 */
export const createDeliveryProvider = (deliveryProvider) => {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'POST',
      dataType: 'json',
      url: `/app/location_delivery_provider`,
      data: deliveryProvider,
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
 * Call to API to update delivery provider
 * @function
 * @param {object} deliveryProvider - The updated delivery provider
 * @returns {object} A promise
 */
export const updateDeliveryProvider = (deliveryProvider) => {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'PUT',
      dataType: 'json',
      url: `/app/location_delivery_provider/${deliveryProvider.id}`,
      data: deliveryProvider,
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
* Call to API to delete delivery provider
* @function
* @param {object} deliveryProviderId - ID of the delivery provider to delete
* @returns {object} A promise
*/
export const deleteDeliveryProvider = (deliveryProviderId) => {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'DELETE',
      url: `/app/location_delivery_provider/${deliveryProviderId}`,
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
  listDeliveryProviderForStore,
  createDeliveryProvider,
  updateDeliveryProvider,
  deleteDeliveryProvider
}
