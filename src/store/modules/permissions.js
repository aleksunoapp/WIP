import * as types from '@/store/mutation-types'

const state = {
	permissions: {}
}

export const getters = {
	can: (state) => (permission) => {
		if (permission === undefined) {
			return true
		}
		return state.permissions[permission]
	},
	canAny: (state) => (permissions) => {
		if (permissions === undefined || permissions.length === 0) {
			return true
		}
		let any = false
		for (let i = 0; i < permissions.length; i++) {
			if (state.permissions[permissions[i]]) {
				any = true
				break
			}
		}
		return any
	}
}

export const actions = {
	setPermissions ({ commit }, permissions) {
		commit(types.SET_PERMISSIONS, {
			permissions
		})
	}
}

export const mutations = {
	[types.SET_PERMISSIONS] (state, permissions) {
		state.permissions = permissions
	}
}

export default {
	state,
	getters,
	actions,
	mutations
}
