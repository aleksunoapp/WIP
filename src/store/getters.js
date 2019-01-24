import router from '@/router.js'

export const getters = {
  categories: (state) => {
    return state.categories
  },
  categoriesShown: (state, getters) => {
    let categoriesShown = []
    for (const category of state.categories) {
      if (
        category.showOnInspection &&
        category.serviceCategoryType !== 'PRE' &&
        category.serviceCategoryType !== 'CC'
      ) {
        if (getters.categoryServices(category.id).length) {
          categoriesShown.push(category)
        }
      }
      if (category.serviceCategoryType === 'CC') {
        if (getters.categoryServices(category.id).length) {
          categoriesShown.push(category)
        }
      }
    }

    return categoriesShown
  },
  categoriesShownOnRoute: (state, getters) => {
    if (name === 'additional-services') {
      return getters.categoriesShown
        .filter(category => getters.categoryContainsHiglightedServices(category.id))
    }
    if (name === 'wait-services') {
      return getters.categoriesShown
        .filter(category => getters.categoryContainsUnhiglightedUnselectedServices(category.id))
    }
    return getters.categoriesShown
  },
  waitServices: (state, getters) => {
    const services = []
    for (const category of getters.categoriesShown) {
      for (const service of getters.categoryServices(category.id)) {
        if (!service.isHighlighted && !service.isSelected) {
          services.push(service)
        }
      }
    }
    return services
  },
  categoryName: (state, getters) => (id) => {
    const category = state.categories.find((category) => category.id === id)
    return category ? category.name : ''
  },
  categoryCount: (state, getters) => (id) => {
    const map = {
      1: 'fail',
      2: 'warning',
      3: 'pass',
      4: 'approved',
      5: 'concern',
      6: 'concern',
      7: 'concern',
      8: 'concern',
      9: 'concern'
    }
    return getters.count[map[id]]
  },
  serviceById: (state) => (id) => {
    for (const service of state.services) {
      if (service.id === id) {
        return service
      }
      if (service.subServices) {
        for (const subService of service.subServices) {
          if (subService.id === id) {
            return subService
          }
        }
      }
    }
  },
  categoryServices: (state, getters) => (id) => {
    let nested = []
    let flattened = []
    if (id < '5') {
      nested = state.services.filter((service) => service.category === id)
    } else {
      nested = state.services.filter((service) =>
        service.category === '6' ||
          service.category === '7' ||
          service.category === '8' ||
          service.category === '9'
      )
    }

    for (const service of nested) {
      if (service.subServices) {
        flattened = flattened.concat(service.subServices)
      } else {
        flattened.push(service)
      }
    }

    if (state.route.name === 'additional-services') {
      flattened = flattened.filter(service => service.isHighlighted)
    }
    if (state.route.name === 'wait-services') {
      flattened = flattened.filter(service => !service.isHighlighted && !service.isSelected)
    }

    return flattened
  },
  highlightedServices: (state, getters) => {
    const highlighted = []
    for (const service of state.services) {
      const children = []
      if (service.subServices) {
        for (const subService of service.subServices) {
          if (subService.isHighlighted) {
            children.push(subService)
          }
        }
      }
      if (children.length) {
        highlighted.push({
          ...service,
          subServices: children
        })
      } else if (service.isHighlighted) {
        highlighted.push(service)
      }
    }
    return highlighted
  },
  unhighlightedUnselectedServices: (state, getters) => {
    let count = 0
    for (const category of getters.categoriesShown) {
      for (const service of getters.categoryServices(category.id)) {
        if (!service.isHighlighted && !service.isSelected) {
          count++
        }
      }
    }
    return count
  },
  categoryContainsHiglightedServices: (state, getters) => (id) => {
    return getters.categoryServices(id).some((service) => service.isHighlighted)
  },
  categoryContainsUnhiglightedUnselectedServices: (state, getters) => (id) => {
    return getters.categoryServices(id).some((service) => !service.isHighlighted && !service.isSelected)
  },
  count: (state, getters) => {
    let fail = 0
    let warning = 0
    let approved = 0
    let pass = 0
    let concern = 0

    state.services.forEach((service) => {
      if (service.category === '1') {
        if (service.subServices) {
          fail = fail + service.subServices.length
        } else {
          fail++
        }
      } else if (service.category === '2') {
        if (service.subServices) {
          warning = warning + service.subServices.length
        } else {
          warning++
        }
      } else if (service.category === '3') {
        if (service.subServices) {
          pass = pass + service.subServices.length
        } else {
          pass++
        }
      } else if (service.category === '4') {
        if (service.subServices) {
          approved = approved + service.subServices.length
        } else {
          approved++
        }
      } else if (
        service.category === '6' ||
        service.category === '7' ||
        service.category === '8' ||
        service.category === '9'
      ) {
        concern++
      }
    })
    return {
      fail,
      warning,
      approved,
      pass,
      concern
    }
  },
  total: (state, getters) => {
    let inspectionTotal = 0
    let serviceTotal = 0

    // limit to displayed and leave out the pass category
    state.categories.forEach((category) => {
      if (category.showOnInspection && category.id !== '3') {
        state.services.forEach((service) => {
          if (service.category === category.id) {
            if (service.subServices) {
              service.subServices.forEach((subService) => {
                if (subService.isSelected) {
                  inspectionTotal += subService.price
                }
              })
            } else {
              if (service.isSelected) {
                inspectionTotal += service.price
              }
            }
          }
        })
      }

      if (category.id === '4') {
        state.services.forEach((service) => {
          if (service.category === '4') {
            if (service.subServices) {
              service.subServices.forEach((subService) => {
                serviceTotal += subService.price
              })
            } else {
              serviceTotal += service.price
            }
          }
        })
      }

      if (category.id === '5') {
        state.services.forEach((service) => {
          if (
            service.category === '6' ||
            service.category === '7' ||
            service.category === '8' ||
            service.category === '9'
          ) {
            if (service.subServices) {
              service.subServices.forEach((subService) => {
                if (subService.isSelected) {
                  inspectionTotal += subService.price
                }
              })
            }
          }
        })
      }
    })

    return {
      service: serviceTotal,
      inspection: inspectionTotal
    }
  },
  respondBy: (state) => {
    return state.deadlines.respondBy === null ? null : new Date(state.deadlines.respondBy)
  },
  readyBy: (state) => {
    return state.deadlines.readyBy === null ? null : new Date(state.deadlines.readyBy)
  }
}

export default getters
