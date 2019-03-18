export const getters = {
  categoriesShown: (state) => {
    let categoriesShown = []
    for (const category of state.categories) {
      if (
        category.showOnInspection &&
        category.serviceCategoryType !== 'PRE' &&
        category.serviceCategoryType !== 'CC'
      ) {
        categoriesShown.push(category)
      }
      if (category.serviceCategoryType === 'CC') {
        categoriesShown.push(category)
      }
    }

    return categoriesShown
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
    return state.categories.find((category) => state.categoryIdMap[id] === category.id)
  },
  categoryServicesShownOnRoute: (state, getters) => (id) => {
    if (state.route.name === 'additional-services') {
      return getters.categoryServices(id).filter(service => service.isHighlighted)
    }
    if (state.route.name === 'wait-services') {
      return getters.categoryServices(id).filter(service => !service.isHighlighted && service.deferred)
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
  categoryContainsUnhiglightedServices: (state, getters) => (id) => {
    return getters.categoryServices(id).some((service) => !service.isHighlighted)
  },
  count: (state, getters) => {
    let fail = 0
    let warning = 0
    let approved = 0
    let pass = 0
    let actionableConcern = 0
    let greenConcern = 0

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
        service.category === '7'
      ) {
        if (service.subServices) {
          actionableConcern = actionableConcern + service.subServices.length
        } else {
          actionableConcern++
        }
      } else if (
        service.category === '8' ||
        service.category === '9'
      ) {
        if (service.subServices) {
          greenConcern = greenConcern + service.subServices.length
        } else {
          greenConcern++
        }
      }
    })
    return {
      fail,
      warning,
      approved,
      pass,
      concern: actionableConcern + greenConcern,
      actionable: fail + warning + actionableConcern
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
  actionableAdditionalServices: (state, getters) => {
    return getters.additionalServices.filter(service => service.category < '8')
  },
  deferredServices: (state) => {
    let deferred = []
    for (const service of state.services) {
      if (service.category !== '3' && service.category !== '4' && service.category < '8') {
        if (service.subServices) {
          for (const subService of service.subServices) {
            if (subService.deferred) {
              deferred.push(subService)
            }
          }
        } else if (service.deferred) {
          deferred.push(service)
        }
      }
    }
    return deferred
  },
  previouslyApprovedServices: (state, getters) => {
    const additional = getters.additionalServices.length > 0
    const services = []
    for (const service of state.services) {
      if (service.subServices) {
        for (const subService of service.subServices) {
          if (subService.declinedReasonId !== 8) {
            if (subService.category === '4') {
              services.push(subService)
            } else if (additional) {
              if (!subService.deferred && !subService.isHighlighted) {
                services.push(subService)
              }
            }
          }
        }
      } else {
        if (service.declinedReasonId !== 8) {
          if (service.category === '4') {
            services.push(service)
          } else if (additional) {
            if (!service.deferred && !service.isHighlighted) {
              services.push(service)
            }
          }
        }
      }
    }
    return services
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
                  inspectionTotal += subService.price + subService.tax
                }
              })
            } else {
              if (service.isSelected) {
                inspectionTotal += service.price + service.tax
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
                serviceTotal += subService.price + subService.tax
              })
            } else {
              serviceTotal += service.price + service.tax
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
                  inspectionTotal += subService.price + subService.tax
                }
              })
            }
          }
        })
      }
    })

    for (const category of getters.categoriesShown) {
      for (const service of getters.categoryServicesShownOnRoute(category.id)) {
        if (service.isSelected) {
          additionalTotal += service.price + service.tax
        }
      }
    }

    return {
      service: serviceTotal,
      inspection: inspectionTotal,
      additional: additionalTotal
    }
  }
}

export default getters
