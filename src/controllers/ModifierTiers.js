import GlobalFunctions from '@/global.js'

export default ({
	/**
	 * Call to API to get a list of modifier tiers.
	 * @function
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getModifierTiers () {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/modifier_tiers',
				data: {},
				success: (response) => resolve(response),
				error: (error) => reject(error)
			})
		})
	},
	/**
	 * Call to API to create a modifier tier.
	 * @function
	 * @param {object} tier - New tier data
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	createModifierTier (tier) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/modifier_tiers/create',
				data: tier,
				success: (response) => resolve(response),
				error: (error) => reject(error)
			})
		})
	},
	/**
	 * Call to API to update a modifier tier.
	 * @function
	 * @param {object} tier - Updated tier data
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	updateModifierTier (tier) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'PUT',
				dataType: 'json',
				url: '/app/modifier_tiers/' + tier.id + '/update',
				data: tier,
				success: (response) => resolve(response),
				error: (error) => reject(error)
			})
		})
	},
	/**
	 * Call to API to get modifier categories in tier.
	 * @function
	 * @param {object} tier - Tier to get details for
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	getModifierTierDetails (tier) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'GET',
				dataType: 'json',
				url: '/app/modifier_tiers/' + tier.id + '/modifiers',
				data: tier,
				success: (response) => resolve(response),
				error: (error) => reject(error)
			})
		})
	},
	/**
	 * Call to API to delete a modifier tier.
	 * @function
	 * @param {object} tier - Tier to delete
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	deleteModifierTier (tier) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'DELETE',
				dataType: 'json',
				url: '/app/modifier_tiers/' + tier.id + '/delete',
				data: tier.id,
				success: (response) => resolve(response),
				error: (error) => reject(error)
			})
		})
	},
	/**
	 * Call to API add and remove modifier categories to tier.
	 * @function
	 * @param {object} data - Arrays of IDs of modifier categories to add and to remove
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	addModifiersToTier (data) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/modifier_tiers/' + data.id + '/add_modifiers',
				data,
				success: (response) => resolve(response),
				error: (error) => reject(error)
			})
		})
	},
	/**
	 * Call to API apply a tier of modifiers to menu items
	 * @function
	 * @param {object} data - ID of the tier and array of menu item IDs
	 * @returns {object} A promise that will return either a success object or an error object.
	 */
	applyModifierTierToMenuItems (data) {
		return new Promise(function (resolve, reject) {
			GlobalFunctions.$ajax({
				method: 'POST',
				dataType: 'json',
				url: '/app/modifier_tiers/items',
				data,
				success: (response) => resolve(response),
				error: (error) => reject(error)
			})
		})
	}
})
