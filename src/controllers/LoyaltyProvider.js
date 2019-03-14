/* eslint-disable camelcase */
import GlobalFunctions from '@/global.js'

/**
 * Call to API to get loyalty providers for a store.
 * @function
 * @param {number} locationId - ID of the store to get providers for
 * @returns {object} A promise
 */
export const getLoyaltyProvider = (locationId) => {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'GET',
      url: `/app/locations/${locationId}/locationLoyaltyProvider`,
      success: (r) => resolve(r),
      error: (e) => reject(e)
    })
  })
}

/**
 * Call to API to create a loyalty provider
 * @function
 * @param {object} provider - The loyalty provider to create
 * @param {number} locationId - ID of the store the provider belongs to
 * @returns {object} A promise
 */
export const createLoyaltyProvider = (provider, locationId) => {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'POST',
      url: `/app/loyalty_provider`,
      data: provider,
      success: (r) => resolve(r),
      error: (e) => reject(e)
    })
  })
}

/**
 * Call to API to update a loyalty provider
 * @function
 * @param {object} provider - The updated loyalty provider
 * @returns {object} A promise
 */
export const updateLoyaltyProvider = (provider) => {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'PUT',
      url: `/app/loyalty_provider/${provider.id}`,
      data: provider,
      success: (r) => resolve(r),
      error: (e) => reject(e)
    })
  })
}

/**
* Call to API to delete a loyalty provider
* @function
* @param {object} provider - The loyalty provider to delete
* @returns {object} A promise
*/
export const deleteLoyaltyProvider = (provider) => {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'DELETE',
      url: `/app/loyalty_provider/${provider.id}`,
      data: {
        location_id: provider.location_id
      },
      success: (r) => resolve(r),
      error: (e) => reject(e)
    })
  })
}

export default {
  getLoyaltyProvider,
  createLoyaltyProvider,
  updateLoyaltyProvider,
  deleteLoyaltyProvider
}
