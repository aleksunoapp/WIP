import * as types from '@/store/mutation-types'

const state = {
  user: {
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    address2: '',
    city: '',
    province: '',
    postal_code: '',
    country: '',
    date_of_birth: '',
    ref_code: '',
    send_notification: 0,
    send_email: 0
  }
}

export const mutations = {
  [types.SET_USER] (state, user) {
    state.user = user
  },
  [types.CLEAR_USER] (state) {
    state.user = {}
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
