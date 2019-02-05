import GlobalFunctions from '@/global.js'

/**
 * Call to API to get all locale regions.
 * @function
 * @returns {object} A promise with response shaped
 * [{
	"id": 5,
	"locale_id": 1,
	"name": "test2",
	"region": [
		[
			[88.6541, -79.3978],
			[9.190602686, 45.463993916],
			[9.191622331, 45.464506215],
			[9.190586853, 45.46451897],
			[88.6541, -79.3978]
		]
	]
 * }]
 */
export const listLocaleRegions = () => {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'GET',
      dataType: 'json',
      url: `/app/locale_regions`,
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
 * Call to API to get a locale region.
 * @function
 * @param {integer} id - ID of the locale region to show
 * @returns {object} A promise with response shaped
 * {
	"id": 5,
	"locale_id": 1,
	"name": "test2",
	"region": [
		[
			[88.6541, -79.3978],
			[9.190602686, 45.463993916],
			[9.191622331, 45.464506215],
			[9.190586853, 45.46451897],
			[88.6541, -79.3978]
		]
	]
 * }
 */
export const showLocaleRegion = (id) => {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'GET',
      dataType: 'json',
      url: `/app/locale_regions/show/${id}`,
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
 * Call to API to create a locale region.
 * @function
 * @param {object} localeRegion - The locale region to create
 * @returns {object} A promise with response shaped
 * {
	"id": 5,
	"locale_id": 1,
	"name": "test2",
	"region": [
		[
			[88.6541, -79.3978],
			[9.190602686, 45.463993916],
			[9.191622331, 45.464506215],
			[9.190586853, 45.46451897],
			[88.6541, -79.3978]
		]
	]
 * }
 */
export const createLocaleRegion = (localeRegion) => {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'POST',
      dataType: 'json',
      url: '/app/locale_regions/create',
      data: localeRegion,
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
 * Call to API to update a locale region.
 * @function
 * @param {object} localeRegion - The locale region to update
 * @returns {object} A promise with response shaped
 * {
	"id": 5,
	"locale_id": 1,
	"name": "test2",
	"region": [
		[
			[88.6541, -79.3978],
			[9.190602686, 45.463993916],
			[9.191622331, 45.464506215],
			[9.190586853, 45.46451897],
			[88.6541, -79.3978]
		]
	]
 * }
 */
export const updateLocaleRegion = (localeRegion) => {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'POST',
      dataType: 'json',
      url: `/app/locale_regions/update/${localeRegion.id}`,
      data: localeRegion,
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
 * Call to API to delete a country
 * @function
 * @param {object} localeRegion - The locale region to delete
 * @returns {object} A promise with response shaped ...
 */
export const deleteLocaleRegion = ({ id = null }) => {
  return new Promise(function (resolve, reject) {
    GlobalFunctions.$ajax({
      method: 'DELETE',
      dataType: 'json',
      url: `/app/locale_regions/delete/${id}`,
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
  listLocaleRegions,
  showLocaleRegion,
  createLocaleRegion,
  updateLocaleRegion,
  deleteLocaleRegion
}
