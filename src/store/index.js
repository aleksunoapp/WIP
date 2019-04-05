import Vue from 'vue'
import Vuex from 'vuex'
import { actions } from '@/store/actions.js'
import { getters } from '@/store/getters.js'
import { mutations } from '@/store/mutations.js'
import { state } from '@/store/state.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,
  state,
  getters,
  mutations,
  actions
})

export default store
