import { i18n } from '@/main.js'
import { router } from '@/router'
import {
  fetchToken,
  fetchMetadata,
  fetchServices,
  fetchInspectionReportUrl,
  fetchAdvisor,
  fetchTax,
  postServices,
  postLog
} from '@/services'

export const actions = {
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
          customerCommentsLabel,
          supportedLanguages,
          serviceCategories,
          local,
          promise,
          responseBy,
          expired,
          topImageUrl
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

        commit('setCustomerCommentsLabel', customerCommentsLabel)
        commit('setLanguages', supportedLanguages)
        commit('setCustomer', { firstName, lastName, isBusiness })
        commit('setCategories', categories)
        commit('setReasons', declinedReasons)
        commit('setDefaultLocale', local)
        // if 'en-CA' language isn't supported, use locale from payload
        const match = supportedLanguages.find(locale => {
          if (Intl.getCanonicalLocales(locale.culture)[0] === state.locale.selected) {
            return locale
          }
        })
        if (match === undefined) {
          commit('setLocale', local)
        }
        commit('setRespondBy', responseBy)
        commit('setReadyBy', promise)
        commit('setExpired', expired)
        commit('setDealer', dealerContactInfo)
        commit('setTopImageUrl', topImageUrl || '')
        dispatch('routeAfterMetadata')
      })
      .then(() => {
        if (state.code) {
          dispatch('logIn')
        }
      })
      .catch((error) => {
        dispatch('handleError', error)
      })
      .finally(() => {
        commit('setLoading', { key: 'getMetadata', loading: false })
      })
  },
  async getTax ({ commit, dispatch, getters, state }) {
    let selectedServiceIds = []
    state.services.forEach((service) => {
      if (service.category !== '3' && service.category !== '4') {
        if (service.subServices) {
          service.subServices.forEach((subService) => {
            if (subService.isSelected) {
              selectedServiceIds.push(subService.id)
            }
          })
        } else {
          if (service.isSelected) {
            selectedServiceIds.push(service.id)
          }
        }
      }
    })

    const previouslyApprovedServiceIds = getters.previouslyApprovedServices.map(service => service.id)
    selectedServiceIds = selectedServiceIds.filter(id => !previouslyApprovedServiceIds.includes(id))

    commit('setLoading', { key: 'getTax', loading: true })

    Promise.all([fetchTax(selectedServiceIds), fetchTax(previouslyApprovedServiceIds)])
      .then((responses) => {
        const [newlyApprovedServicesTaxResponse, previouslyApprovedServicesTaxResponse] = responses
        commit('setNewlyApprovedTax', newlyApprovedServicesTaxResponse.taxAndFee)
        commit('setPreviouslyApprovedTax', previouslyApprovedServicesTaxResponse.taxAndFee)
      })
      .catch((error) => {
        error.message = i18n.t('we_couldnt_get_tax')
        dispatch('handleError', error)
      })
      .finally(() => {
        commit('setLoading', { key: 'getTax', loading: false })
      })
  },
  async handleError ({ state, commit }, e) {
    let text = i18n.t('something_went_wrong')
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
  async logIn ({ commit, dispatch }) {
    commit('setLoading', { key: 'logIn', loading: true })
    await fetchToken()
      .then((response) => {
        commit('setToken', response.access_token)
        Promise.all([fetchServices(), fetchInspectionReportUrl(), fetchAdvisor()])
          .then((responses) => {
            const [servicesResponse, inspectionReportUrlResponse, advisor] = responses

            let additional = false
            const parentServices = []

            for (const service of servicesResponse) {
              service.tax = 0
              if (
                typeof service.declinedReasonId === 'number' &&
                service.declinedReasonId > -1 &&
                service.declinedReasonId !== 8
              ) {
                service.deferred = true
              } else {
                service.deferred = false
              }
              if (service.isHighlighted) {
                additional = true
              }
              if (!service.parentServiceId) {
                if (!parentServices.some((duplicate) => duplicate.id === service.id)) {
                  parentServices.push(service)
                }
              }
            }

            if (additional) {
              for (const service of servicesResponse) {
                if (service.deferred) {
                  if (
                    service.category === '1' ||
                    service.category === '2' ||
                    service.category === '6' ||
                    service.category === '7'
                  ) {
                    service.isSelected = false
                  }
                }
              }
            }

            for (const parentService of parentServices) {
              const subServices = servicesResponse
                .filter((subService) => subService.parentServiceId === parentService.id)
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
  sendLog () {
    postLog()
      .catch((error) => {
        console.log({ error })
      })
  },
  async sendServices ({ commit, dispatch }) {
    commit('setLoading', { key: 'sendServices', loading: true })
    await postServices()
      .then(() => {
        dispatch('routeAfterApprove')
      })
      .catch((error) => {
        dispatch('handleError', error)
      })
      .finally(() => {
        commit('setLoading', { key: 'sendServices', loading: false })
      })
  },
  routeAfterApprove ({ commit }) {
    router.push({ name: 'thanks' })
    commit('setExpired', true)
  },
  routeAfterLogin ({ commit, getters }) {
    if (getters.additionalServices.length) {
      router.push({ name: 'additional' })
    } else {
      if (getters.count.actionable) {
        router.push({ name: 'at-a-glance' })
      } else {
        router.push({ name: 'services' })
      }
    }
    commit('setLoading', { key: 'logIn', loading: false })
  },
  routeAfterMetadata ({ state }) {
    if (state.expired) {
      router.push({ name: 'link-expired' })
    }
  },
  viewService ({ commit, state }, service) {
    if (state.service.id !== undefined) {
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
