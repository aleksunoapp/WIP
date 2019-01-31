import * as types from '@/store/mutation-types'
import environment from '@/environment'
const { production, staging, development } = environment

const state = {
	redirectUrl: (function () {
		if (development) return 'https://accounts.dev.unoapp.io/'
		if (staging) return 'https://accounts.beta.unoapp.io/'
		if (production) return ''
	}()),
	accountToken: '',
	appId: '',
	appSecret: '',
	userToken: ''
}

export const getters = {
	redirectUrl: state => {
		return state.redirectUrl
	},
	appId: state => {
		return state.appId
	},
	appSecret: state => {
		return state.appSecret
	},
	userToken: state => {
		return state.userToken
	},
	accountToken: state => {
		return state.accountToken
	}
}

export const actions = {
	setRedirectUrl ({ commit }, redirectUrl) {
		commit(types.SET_REDIRECT_URL, redirectUrl)
	},
	setAppId ({ commit }, appId) {
		commit(types.SET_APP_ID, appId)
	},
	setAppSecret ({ commit }, appSecret) {
		commit(types.SET_APP_SECRET, appSecret)
	},
	setUserToken ({ commit }, userToken) {
		commit(types.SET_USER_TOKEN, userToken)
	},
	setAccountToken ({ commit }, accountToken) {
		commit(types.SET_ACCOUNT_TOKEN, accountToken)
	}
}

export const mutations = {
	[types.SET_REDIRECT_URL] (state, redirectUrl) {
		state.redirectUrl = redirectUrl
	},
	[types.SET_APP_ID] (state, appId) {
		state.appId = appId
	},
	[types.SET_APP_SECRET] (state, appSecret) {
		state.appSecret = appSecret
	},
	[types.SET_USER_TOKEN] (state, userToken) {
		state.userToken = userToken
	},
	[types.SET_ACCOUNT_TOKEN] (state, accountToken) {
		state.accountToken = accountToken
	}
}

export default {
	state,
	getters,
	actions,
	mutations
}
