import * as types from '@/store/mutation-types'

const state = {
  comboOffer: {
    'id': null,
    'name': '',
    'number_of_items': 0,
    'discount': '',
    'discount_type': '',
    'start_from': '',
    'end_on': '',
    'combo_item': [
      {
        'combo_item_sku': []
      }
    ]
  }
}

export const getters = {
  comboOffer: state => {
    return state.comboOffer
  }
}

export const actions = {
  setComboOffer ({ commit }, comboOffer) {
    commit(types.SET_COMBO_OFFER, comboOffer)
  },
  clearComboOffer  ({ commit }) {
    commit(types.SET_COMBO_OFFER, {
      'id': null,
      'name': '',
      'number_of_items': 0,
      'discount': '',
      'discount_type': '',
      'start_from': '',
      'end_on': '',
      'combo_item': [
        {
          'combo_item_sku': []
        }
      ]
    })
  }
}

export const mutations = {
  [types.SET_COMBO_OFFER] (state, comboOffer) {
    state.comboOffer = comboOffer
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
