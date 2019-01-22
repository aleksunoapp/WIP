import { i18n } from '@/main.js'
import { router } from '@/router'
import {
  fetchToken,
  fetchMetadata,
  fetchServices,
  fetchInspectionReportUrl,
  fetchAdvisor,
  fetchTax,
  postServices
} from '@/services'

export const actions = {
  async handleError ({ state, commit }, e) {
    let text = 'We\'re sorry, something went wrong.'
    try {
      if (e.message) {
        text = e.message
      } else if (e.response) {
        await e.response.json().then((response) => {
          if (typeof response.error === 'string') {
            text = `${i18n.t('were_sorry_we_dont_recognize')} ${state.code} ${i18n.t('in_our_database')}`
          }
        })
      }
    } catch (e) {
      console.log('DMPI error: ', e)
    }
    commit('setError', text)
  },
  async getMetadata ({ state, commit, dispatch }) {
    commit('setLoading', { key: 'getMetadata', loading: true })
    await fetchMetadata()
      .then((response) => {
        const {
          dealerContactInfo,
          declinedReasons,
          firstName,
          lastName,
          isBusiness,
          customerConcernsLabel,
          supportedLanguages,
          serviceCategories,
          local,
          promise,
          responseBy,
          expired
        } = response

        const order = {
          1: 2,
          2: 3,
          3: 4,
          4: 5,
          5: 1
        }
        let categories = serviceCategories.map((category) => {
          return {
            ...category,
            sortOrder: order[category.id]
          }
        })
        categories.sort((a, b) => a.sortOrder - b.sortOrder)
        categories = categories.map((category) => {
          if (category.id === '5') {
            return {
              ...category,
              name: customerConcernsLabel
            }
          } else { return category }
        })

        commit('setLanguages', supportedLanguages)
        commit('setCustomer', { firstName, lastName, isBusiness })
        commit('setCategories', categories)
        commit('setReasons', declinedReasons)
        if (!state.languages.length) {
          commit('setLocale', local)
        }
        commit('setRespondBy', responseBy)
        commit('setReadyBy', promise)
        commit('setExpired', expired)
        commit('setDealer', dealerContactInfo)
        dispatch('routeAfterMetadata')
      })
      .catch((error) => {
        dispatch('handleError', error)
      })
      .finally(() => {
        commit('setLoading', { key: 'getMetadata', loading: false })
      })
  },
  async sendServices ({ commit, dispatch }) {
    commit('setLoading', { key: 'sendServices', loading: true })
    await postServices()
      .catch((error) => {
        dispatch('handleError', error)
      })
      .finally(() => {
        commit('setLoading', { key: 'sendServices', loading: false })
        dispatch('routeAfterApprove')
      })
  },
  async getTax ({ commit, dispatch }) {
    commit('setLoading', { key: 'getTax', loading: true })
    await fetchTax()
      .then((response) => {
        commit('setTax', response.taxAndFee)
      })
      .catch((error) => {
        error.message = i18n.t('we_couldnt_get_tax')
        dispatch('handleError', error)
      })
      .finally(() => {
        commit('setLoading', { key: 'getTax', loading: false })
      })
  },
  routeAfterMetadata ({ state }) {
    if (state.expired) {
      router.push({ name: 'link-expired' })
    }
  },
  routeAfterLogin ({ commit, getters }) {
    if (getters.count.fail || getters.count.warninig || getters.count.concern) {
      router.push({ name: 'tutorial' })
    } else {
      router.push({ name: 'inspection' })
    }
    commit('setLoading', { key: 'logIn', loading: false })
  },
  routeAfterApprove ({ commit }) {
    router.push({ name: 'thanks' })
    commit('setExpired', true)
  },
  async logIn ({ commit, dispatch }) {
    commit('setLoading', { key: 'logIn', loading: true })
    await fetchToken()
      .then((response) => {
        commit('setToken', response.access_token)
        Promise.all([fetchServices(), fetchInspectionReportUrl(), fetchAdvisor()])
          .then((responses) => {
            const [servicesResponse, inspectionReportUrlResponse, advisor] = responses

            const parentServices = []
            for (const service of servicesResponse) {
              if (!service.parentServiceId) {
                if (!parentServices.some((duplicate) => duplicate.id === service.id)) {
                  parentServices.push(service)
                }
              }
            }
            for (const parentService of parentServices) {
              const subServices = servicesResponse.filter((subService) =>
                subService.parentServiceId === parentService.id)
              
              if (subServices.length) {
                parentService.subServices = subServices
              }
            }

            commit('setServices', parentServices)
            commit('setAdvisor', advisor)
            commit('setInspectionReportUrl', inspectionReportUrlResponse.fullInspectionUrl)
            dispatch('routeAfterLogin')
          })
        })
      .catch((error) => {
        dispatch('handleError', error)
          commit('setLoading', { key: 'logIn', loading: false })
        })
  },
  viewService ({ commit, state }, service) {
    if (state.service) {
      commit('logEvent', `Finished viewing service ${service.id}`)
    }
    commit('setService', service)
    commit('logEvent', `Started viewing service ${service.id}`)
    if (!state.modal) {
      commit('openService')
    }
  }
}

export default actions
