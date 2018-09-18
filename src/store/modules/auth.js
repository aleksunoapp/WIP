import * as types from '@/store/mutation-types'

const state = {
	appId: '',
	appSecret: '',
	userToken: ''
}

export const getters = {
	appId: state => {
		return state.appId
	},
	appSecret: state => {
		return state.appSecret
	},
	userToken: state => {
		return state.userToken
	}
}

export const actions = {
	setAppId ({ commit }, appId) {
		commit(types.SET_APP_ID, appId)
	},
	setAppSecret ({ commit }, appSecret) {
		commit(types.SET_APP_SECRET, appSecret)
	},
	setUserToken ({ commit }, userToken) {
		commit(types.SET_USER_TOKEN, userToken)
	}
}

export const mutations = {
	[types.SET_APP_ID] (state, appId) {
		state.appId = appId
	},
	[types.SET_APP_SECRET] (state, appSecret) {
		state.appSecret = appSecret
	},
	[types.SET_USER_TOKEN] (state, userToken) {
		state.userToken = userToken
	}
}

export default {
	state,
	getters,
	actions,
	mutations
}
