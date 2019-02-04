export const getters = {
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
    if (state.route.name === 'additional-services' || state.route.name === 'additional-summary') {
      return getters.categoriesShown.filter(category => {
        return getters.categoryContainsHiglightedServices(category.id) && !getters.isPass(category.id)
      })
    }
    if (state.route.name === 'wait-services') {
      return getters.categoriesShown.filter(category => {
        return getters.categoryContainsUnhiglightedUnselectedServices(category.id) &&
          !getters.isPass(category.id)
      })
    }
    return getters.categoriesShown
  },
  categoryName: (state) => (id) => {
    const idMap = {
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      6: '5',
      7: '5',
      8: '5',
      9: '5'
    }
    const category = state.categories.find((category) => category.id === idMap[id])
    return category ? category.name : ''
  },
  isPass: (state) => (id) => {
    const idMap = {
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      6: '5',
      7: '5',
      8: '5',
      9: '5'
    }
    const category = state.categories.find((category) => category.id === idMap[id])
    if (
      category &&
      typeof category.serviceCategoryType === 'string' &&
      category.serviceCategoryType.toLowerCase() === 'pass'
    ) {
      return true
    } else return false
  },
  categoryById: (state) => (id) => {
    return state.categories.find((category) => category.id === id)
  },
  categoryServicesShownOnRoute: (state, getters) => (id) => {
    if (state.route.name === 'additional-services') {
      return getters.categoryServices(id).filter(service => service.isHighlighted)
    }
    if (state.route.name === 'wait-services') {
      return getters.categoryServices(id).filter(service => !service.isHighlighted && !service.wasSelected)
    }
    if (state.route.name === 'additional-summary') {
      return getters.categoryServices(id).filter(service => service.isHighlighted || !service.wasSelected)
    }
    return getters.categoryServices(id)
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

    return flattened
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
        if (service.subServices) {
          concern = concern + service.subServices.length
        } else {
          concern++
        }
      }
    })
    return {
      fail,
      warning,
      approved,
      pass,
      concern,
      actionable: fail + warning + concern
    }
  },
  additionalServices: (state, getters) => {
    let highlighted = []
    for (const category of state.categories) {
      if (!getters.isPass(category.id) && category.id !== '4') {
        const services = getters.categoryServices(category.id).filter(service => service.isHighlighted)
        highlighted = highlighted.concat(services)
      }
    }
    return highlighted
  },
  respondBy: (state) => {
    return state.deadlines.respondBy === null ? null : new Date(state.deadlines.respondBy)
  },
  readyBy: (state) => {
    return state.deadlines.readyBy === null ? null : new Date(state.deadlines.readyBy)
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
  total: (state, getters) => {
    let inspectionTotal = 0
    let serviceTotal = 0
    let additionalTotal = 0

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

    for (const category of getters.categoriesShownOnRoute) {
      for (const service of getters.categoryServicesShownOnRoute(category.id)) {
        if (service.isSelected) {
          additionalTotal += service.price
        }
      }
    }

    return {
      service: serviceTotal,
      inspection: inspectionTotal,
      additional: additionalTotal
    }
  },
  previouslyUnapprovedServices: (state, getters) => {
    const services = []
    for (const category of getters.categoriesShown) {
      if (!getters.isPass(category.id) && category.id !== '4') {
        for (const service of getters.categoryServices(category.id)) {
          if (!service.isHighlighted && !service.isSelected) {
            services.push(service)
          }
        }
      }
    }
    return services
  }
}

export default getters
