import GlobalFunctions from '@/global.js'
/**
 * Call to API to get all available terms.
 * @function
 * @returns {object} A promise with response shaped
 * [
 *   {
 *       "id": 1,
 *       "name": "France"
 *   }
 * ]
 */
export const listTerms = () => {
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'GET',
			dataType: 'json',
			url: '/app/term',
			data: {},
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
 * Call to API to get all terms for a language.
 * @function
 * @returns {object} A promise with response shaped
 * [
 *   {
 *		"id": 1,
 *		"term": "termdata",
 *		"translation": null || 'termus datus'
 *   }
 * ]
 */

export const listTermsForLanguage = (
	locale = ''
) => {
	if (!locale) {
		return Error('Please provide a locale')
	}
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'GET',
			dataType: 'json',
			url: '/app/term_translation/allTermswithTranslationsByLanguage',
			data: {locale},
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
 * Call to API to translate terms.
 * @function
 * @param {integer} localeId - ID of the language to translate into
 * @param {integer} translation - An array of objects containing a term_id and a translation
 * @returns {object} A promise with response shaped
 * [
 *   {
 *		"id": 1,
 *		"term": "termdata",
 *		"translation": null || 'termus datus'
 *   }
 * ]
 */

export const translateTerms = ({
	localeId = null,
	translations = null
}) => {
	if (localeId === null) {
		return Error('Please provide a locale ID')
	}
	if (translations === null) {
		return Error('Please provide translations')
	}
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'POST',
			dataType: 'json',
			url: '/app/term_translation/update',
			data: {
				locale_id: localeId,
				translations
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
 * Call to API to create a term.
 * @function
 * @returns {object} A promise with response shaped
 * {
 *      "term": "My First Term",
 *      "created_by": 16,
 *      "id": 201
 *  }
 */
export const createTerm = ({
	term = ''
}) => {
	if (!term) {
		return Error('Please provide a term')
	}
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'POST',
			dataType: 'json',
			url: '/app/term/create',
			data: {term},
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
 * Call to API to update a term.
 * @function
 * @returns {object} A promise with response shaped
 * {
 *     "id": 16,
 *     "term": "My First Updated Term",
 *     "created_by": 34,
 *     "updated_by": 18
 * }
 */
export const updateTerm = ({
	term = '',
	id = null
}) => {
	if (!term) {
		return Error('Please provide a term')
	}
	if (!id && id !== 0) {
		return Error('Term ID is missing.')
	}
	return new Promise(function (resolve, reject) {
		GlobalFunctions.$ajax({
			method: 'POST',
			dataType: 'json',
			url: `/app/term/${id}/update`,
			data: {term},
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
 * Call to API to delete a term.
 * @function
 * @returns {object} A promise with response shaped ...
 */
export const deleteTerm = ({
	id = null
}) => {
	return new Promise(function (resolve, reject) {
		if (id !== 0 && !id) {
			reject('Term ID is missing.')
			return
		}

		GlobalFunctions.$ajax({
			method: 'DELETE',
			dataType: 'json',
			url: `/app/country/${id}/delete`,
			data: {},
			success: function (response) {
				resolve(response)
			},
			error: function (error) {
				reject(error)
			}
		})
	})
}

export default ({
	listTerms,
	listTermsForLanguage,
	translateTerms,
	createTerm,
	updateTerm,
	deleteTerm
})

