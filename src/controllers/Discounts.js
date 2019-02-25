/* eslint-disable camelcase */
import GlobalFunctions from '@/global.js'

/**
  * Call to API to create a discount category
  * @function
  * @param {string} locationId - ID of the location
  * @param {string} data - Discount category details
  * @returns {object} A promise that will return API response or an error.
  */
export const createDiscountCategory = function ({ locationId, data }) {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'POST',
      data,
      url: `/app/location/discount_category/create/${locationId}`,
      success: (r) => resolve(r),
      error: (e) => reject(e)
    })
  })
}

/**
  * Call to API to update a discount category
  * @function
  * @param {string} data - Details of the category
  * @returns {object} A promise that will return API response or an error.
  */
export const updateDiscountCategory = function (data) {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'POST',
      data,
      url: `/app/location/discount_category/update/${data.id}`,
      success: (r) => resolve(r),
      error: (e) => reject(e)
    })
  })
}

/**
  * Call to API to get discount categories for a location
  * @function
  * @param {string} locationId - ID of the location
  * @returns {object} A promise that will return API response or an error.
  */
export const getDiscountCategoriesForLocation = function (locationId) {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'GET',
      url: `/app/location/discount_category/${locationId}`,
      success: (r) => resolve(r),
      error: (e) => reject(e)
    })
  })
}

/**
  * Call to API to delete a discount category
  * @function
  * @param {string} categoryId
  * @returns {object} A promise that will return API response or an error.
  */
export const deleteDiscountCategory = function (categoryId) {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'DELETE',
      url: `/app/location/discount_category/${categoryId}`,
      success: (r) => resolve(r),
      error: (e) => reject(e)
    })
  })
}

/**
 * Call to API to get a discount for a category.
 * @function
 * @param {number} categoryId - ID of the category
 * @returns {object} A promise
 */
export const getDiscountsInCategory = (categoryId) => {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'GET',
      data: {},
      url: `/app/location/discount_category/show/${categoryId}`,
      success: (r) => resolve(r),
      error: (e) => reject(e)
    })
  })
}

/**
 * Call to API to create a discount
 * @function
 * @param {object} discount - The discount to create
 * @param {number} categoryId - ID of the category the discount belongs to
 * @returns {object} A promise
 */
export const createDiscount = (discount, categoryId) => {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'POST',
      dataType: 'json',
      url: `/app/location/discounts/create/${categoryId}`,
      data: discount,
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
 * Call to API to update a discount
 * @function
 * @param {object} discount - The updated discount
 * @returns {object} A promise
 */
export const updateDiscount = (discount) => {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'POST',
      dataType: 'json',
      url: `/app/location/discounts/update/${discount.id}`,
      data: discount,
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
* Call to API to delete a discount
* @function
* @param {object} discountId - ID of the discount to delete
* @returns {object} A promise
*/
export const deleteDiscount = (discountId) => {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'DELETE',
      url: `/app/location/discounts/${discountId}`,
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
  * Call to API to get permissions a discount is associated with
  * @function
  * @param {string} id - ID of the discount
  * @returns {object} A promise that will return API response or an error.
  */
export const getPermissionsOfDiscount = function (id) {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'GET',
      url: `/app/location/discounts/${id}/permissions`,
      success: (r) => resolve(r),
      error: (e) => reject(e)
    })
  })
}

/**
  * Call to API to get discount categories for a location
  * @function
  * @param {string} id - ID of the discount
  * @param {string} data - Array of permission IDs
  * @returns {object} A promise that will return API response or an error.
  */
export const assignPermissionsToDiscount = function ({ id, data }) {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'PUT',
      data,
      url: `/app/location/discounts/${id}/permissions`,
      success: (r) => resolve(r),
      error: (e) => reject(e)
    })
  })
}

export default {
  createDiscountCategory,
  updateDiscountCategory,
  getDiscountCategoriesForLocation,
  deleteDiscountCategory,
  getDiscountsInCategory,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  getPermissionsOfDiscount,
  assignPermissionsToDiscount
}
