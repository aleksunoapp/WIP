export const getters = {
  categories: (state) => {
    return state.categories;
  },
  categoriesShownOnInspection: (state, getters) => {
    const categoriesShownOnInspection = [];
    for (const category of state.categories) {
      if (
        category.showOnInspection &&
        category.serviceCategoryType !== 'PRE' &&
        category.serviceCategoryType !== 'CC'
      ) {
        if (getters.categoryServices(category.id).length) {
          categoriesShownOnInspection.push(category);
        }
      }
      if (category.serviceCategoryType === 'CC') {
        if (getters.categoryServices(category.id).length) {
          categoriesShownOnInspection.push(category);
        }
      }
    }
    return categoriesShownOnInspection;
  },
  categoryName: (state, getters) => (id) => {
    const category = state.categories.find((category) => category.id === id);
    return category ? category.name : '';
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
      9: 'concern',
    };
    return getters.count[map[id]];
  },
  serviceById : (state) => (id) => {
    return state.services.find((service) => service.id === id);
  },
  categoryServices : (state, getters) => (id) => {
    let nested = [];
    let flattened = [];
    if (id < '5') {
      nested = state.services.filter((service) => service.category === id);
    } else {
      nested = state.services.filter((service) =>
        service.category === '6' ||
          service.category === '7' ||
          service.category === '8' ||
          service.category === '9',
      );
    }

    for (const service of nested) {
      if (service.subServices) {
        flattened = flattened.concat(service.subServices);
      } else {
        flattened.push(service);
      }
    }

    return flattened;
  },
  categoryContainsHiglightedServices: (state, getters) => (id) => {
    return getters.categoryServices(id).some((service) => service.isHighlighted);
  },
  count: (state, getters) => {
    let fail = 0;
    let warning = 0;
    let approved = 0;
    let pass = 0;
    let concern = 0;

    state.services.forEach((service) => {
      if (service.category === '1') {
        if (service.subServices) {
          fail = fail + service.subServices.length;
        } else {
          fail++;
        }
      } else if (service.category === '2') {
        if (service.subServices) {
          warning = warning + service.subServices.length;
        } else {
          warning++;
        }
      } else if (service.category === '3') {
        if (service.subServices) {
          pass = pass + service.subServices.length;
        } else {
          pass++;
        }
      } else if (service.category === '4') {
        if (service.subServices) {
          approved = approved + service.subServices.length;
        } else {
          approved++;
        }
      } else if (
        service.category === '6' ||
        service.category === '7' ||
        service.category === '8' ||
        service.category === '9'
      ) {
        concern++;
      }
    });
    return {
      fail,
      warning,
      approved,
      pass,
      concern,
    };
  },
  total: (state, getters) => {
    let inspectionTotal = 0;
    let serviceTotal = 0;

    // limit to displayed and leave out the pass category
    state.categories.forEach((category) => {
      if (category.showOnInspection && category.id !== '3') {
        state.services.forEach((service) => {
          if (service.category === category.id) {
            if (service.subServices) {
              service.subServices.forEach((subService) => {
                if (subService.isSelected) {
                  inspectionTotal += subService.price;
                }
              });
            } else {
              if (service.isSelected) {
                inspectionTotal += service.price;
              }
            }
          }
        });
      }

      if (category.id === '4') {
        state.services.forEach((service) => {
          if (service.category === '4') {
            if (service.subServices) {
              service.subServices.forEach((subService) => {
                serviceTotal += subService.price;
              });
            } else {
              serviceTotal += service.price;
            }
          }
        });
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
                  inspectionTotal += subService.price;
                }
              });
            }
          }
        });
      }
    });

    return {
      service: serviceTotal,
      inspection: inspectionTotal,
    };
  },
  respondBy: (state) => {
    return state.deadlines.respondBy === null ? null : new Date(state.deadlines.respondBy);
  },
  readyBy: (state) => {
    return state.deadlines.readyBy === null ? null : new Date(state.deadlines.readyBy);
  },
};

export default getters;
