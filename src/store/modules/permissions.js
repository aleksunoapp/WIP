import * as types from '@/store/mutation-types'

const state = {
	permissions: {}
}

export const getters = {
	can: (state) => (permission) => {
		return state.permissions[permission]
	},
	canAny: (state) => (permissions) => {
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
