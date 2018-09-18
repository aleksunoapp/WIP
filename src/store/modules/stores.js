import * as types from '@/store/mutation-types'

const state = {
	storeLocations: []
}

export const getters = {
	storeLocations: state => {
		return state.storeLocations
	}
}

export const actions = {
	setStoreLocations ({ commit }, storeLocations) {
		commit(types.SET_STORE_LOCATIONS, storeLocations)
	}
}

export const mutations = {
	[types.SET_STORE_LOCATIONS] (state, storeLocations) {
		state.storeLocations = storeLocations
	}
}

export default {
	state,
	getters,
	actions,
	mutations
}
