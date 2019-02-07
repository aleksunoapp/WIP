export const mutations = {
  logEvent (state, description) {
    state.log.events.push({
      time: Date.now(),
      description
    })
  },
  setCategoryExpanded (state, { id, expanded }) {
    for (const category of state.categories) {
      if (category.id === id) {
        category.defaultExpended = expanded
      }
    }
  },
  openDrawer (state) {
    state.drawer = true
  },
  closeDrawer (state) {
    state.drawer = false
  },
  openService (state) {
    state.modal = true
  },
  closeService (state) {
    state.modal = false
  },
  setActiveCategory (state, category) {
    state.activeCategory = category
  },
  clearActiveCategory (state) {
    state.activeCategory = null
  },
  setService (state, service) {
    state.service = service
  },
  selectService (state) {
    if (state.service.id !== undefined) {
      state.service.isSelected = true
    }
  },
  unselectService (state) {
    if (state.service.id !== undefined) {
      state.service.isSelected = false
    }
  },
  openReason (state) {
    state.reason = true
  },
  setReason (state, reasonId) {
    if (state.service.id !== undefined) {
      state.service.declinedReasonId = reasonId
    }
  },
  closeReason (state) {
    state.reason = false
  },
  openHelp (state) {
    state.help = true
  },
  closeHelp (state) {
    state.help = false
  },
  setSlug (state, slug) {
    state.log.clientId = slug
    state.slug = slug
  },
  clearError (state) {
    state.error = ''
  },
  setCode (state, code) {
    state.code = code
  },
  setLocale (state, locale) {
    try {
      const locales = Intl.getCanonicalLocales(locale)
      locale = locales[0]
    } catch (e) {}
    state.locale = locale
  },
  setDealer (state, dealerContactInfo) {
    state.dealer = dealerContactInfo
  },
  setExpired (state, expired) {
    state.expired = expired
  },
  setLanguages (state, supportedLanguages) {
    state.languages = supportedLanguages
  },
  setCustomer (state, { firstName, lastName, isBusiness }) {
    state.customer = { firstName, lastName, isBusiness }
  },
  setCategories (state, serviceCategories) {
    state.categories = serviceCategories
  },
  setReasons (state, reasons) {
    state.reasons = reasons
  },
  setLoading (state, { key, loading }) {
    state.loading[key] = loading
  },
  setToken (state, token) {
    state.token = token
  },
  setCustomerConcernsLabel (state, label) {
    state.customerConcernsLabel = label
  },
  setServices (state, services) {
    state.services = services
  },
  setAdvisor (state, advisor) {
    state.advisor = advisor
  },
  setTax (state, tax) {
    state.tax = tax
  },
  setError (state, error) {
    state.error = error
  },
  setSignature (state, signature) {
    state.signature = signature
  },
  setInspectionReportUrl (state, url) {
    state.inspectionReportUrl = url
  },
  acceptTermsAndConditions (state) {
    state.acceptedTermsAndConditions = true
  },
  declineTermsAndConditions (state) {
    state.acceptedTermsAndConditions = false
  },
  setRespondBy (state, deadline) {
    state.deadlines.respondBy = new Date(deadline)
  },
  setReadyBy (state, deadline) {
    state.deadlines.readyBy = new Date(deadline)
  }
}

export default mutations
