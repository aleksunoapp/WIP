import * as types from '@/store/mutation-types'

const state = {}

export const getters = {
	can: (state) => (permission) => {
		if (permission === undefined) {
			return true
		}
		return state[permission]
	},
	canAny: (state) => (permissions) => {
		if (permissions === undefined || permissions.length === 0) {
			return true
		}
		let any = false
		for (let i = 0; i < permissions.length; i++) {
			if (state[permissions[i]]) {
				any = true
				break
			}
		}
		return any
	}
}

export const actions = {
	setPermissions ({ commit }, permissions) {
		commit(types.SET_PERMISSIONS, permissions)
	}
}

export const mutations = {
	[types.SET_PERMISSIONS] (state, permissions) {
		const oldPermissions = Object.keys(state)
		oldPermissions.forEach(permission => {
			if (!permissions[permission]) {
				state[permission] = false
			}
		})

		const newPermissions = Object.keys(permissions)
		newPermissions.forEach(permission => {
			state[permission] = true
		})
	}
}

export default {
	state,
	getters,
	actions,
	mutations
}
