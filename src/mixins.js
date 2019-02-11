export const formatCurrency = {
  methods: {
    formatCurrency (number) {
      if (typeof number !== 'number') return ''
      const locale = this.$store.state.locale
      const local = number.toLocaleString(locale, {
        minimumFractionDigits: 2, maximumFractionDigits: 2
      })
      if (locale === 'fr-CA') {
        return `${local} $`
      } else {
        return `$${local}`
      }
    }
  }
}

export const getServiceDisplayPrice = {
  methods: {
    getServiceDisplayPrice (service) {
      const category = this.$store.getters.categoryById(service.category)
      if (
        category &&
        typeof category.serviceCategoryType === 'string' &&
        category.serviceCategoryType.toLowerCase() === 'pass'
      ) {
        return false
      } else if (service.category === '8') {
        return false
      } else if (service.category > '5' && !service.parentServiceId) {
        return false
      } else if (service.price === 0 && service.laborMatrixPayment) {
        if (service.laborMatrixPayment === 'NA' || service.laborMatrixPayment === 'None') {
          return this.formatCurrency(service.price)
        } else {
          return service.laborMatrixPaymentTranslations || ''
        }
      } else if (service.price === 0) {
        return this.$t('free')
      } else {
        return this.formatCurrency(service.price)
      }
    }
  }
}

export const getTotal = {
  methods: {
    getTotal (services) {
      let total = 0
      for (const service of services) {
        if (service.isSelected) {
          const category = this.$store.getters.categoryById(service.category)
          if (
            category &&
            typeof category.serviceCategoryType === 'string' &&
            category.serviceCategoryType.toLowerCase() === 'pass'
          ) {
            total += 0
          } else if (service.category === '8') {
            total += 0
          } else if (service.category > '5' && !service.parentServiceId) {
            total += 0
          } else if (service.price === 0 && service.laborMatrixPayment) {
            if (service.laborMatrixPayment === 'NA' || service.laborMatrixPayment === 'None') {
              total += service.price
            }
          } else if (service.price === 0) {
            total += 0
          } else {
            total += service.price
          }
        }
      }
      return total
    }
  }
}

export const focus = {
  methods: {
    focus (selector) {
      const element = document.querySelector(selector)
      if (element) element.focus()
    }
  }
}
