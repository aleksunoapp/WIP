
export const formatCurrency = {
  methods: {
    formatCurrency (number) {
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
