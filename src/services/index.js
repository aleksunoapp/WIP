import {
  baseUrl,
  scope,
  logBaseUrl
} from '@/environment.js'
import store from '@/store'

const checkStatus = function (response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    const err = new Error(response.statusText)
    err.response = response
    throw err
  }
}

const fetchWithTimeout = async function (url, options = {}) {
  let didTimeOut = false
  return new Promise(function (resolve, reject) {
    let timeout
    if (options.timeout) {
      timeout = setTimeout(function () {
        didTimeOut = true
        reject(new Error('timeout'))
      }, options.timeout)
    }

    fetch(url, options)
      .then(function (response) {
        if (options.timeout) {
          clearTimeout(timeout)
        }
        if (!didTimeOut) {
          resolve(response)
        }
      })
      .catch(function (err) {
        if (didTimeOut) return
        reject(err)
      })
  })
    .then(function (response) {
      return response
    })
    .catch(function (err) {
      return err
    })
}

export const fetchMetadata = () => {
  const url = new URL(`${baseUrl}/metadata/${store.state.slug}/${store.state.locale}`)
  return fetchWithTimeout(url)
    .then((response) => checkStatus(response))
    .then((response) => response.json())
    .then((response) => {
      if (response.message === 'Token not found') {
        throw new Error(response.message)
      } else return response
    })
    .catch((e) => { throw e })
}

export const fetchToken = async () => {
  const url = new URL(`${baseUrl}/oauth/token`)
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: store.state.slug,
    client_secret: store.state.code.toLowerCase(),
    scope
  })
  const headers = new Headers({
    'accept': '*/*',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  })
  return fetchWithTimeout(url, {
    method: 'POST',
    body,
    headers
  })
    .then((response) => checkStatus(response))
    .then((response) => response.json())
    .then((response) => (response))
    .catch((e) => { throw e })
}

export const fetchServices = async () => {
  const url = new URL(`${baseUrl}/services/${store.state.slug}/${store.state.locale}`)
  const headers = new Headers({
    Authorization: `Bearer ${store.state.token}`
  })
  return fetchWithTimeout(url, {
    headers
  })
    .then((response) => checkStatus(response))
    .then((response) => response.json())
    .then((response) => (response))
    .catch((e) => { throw e })
}

export const fetchInspectionReportUrl = async () => {
  const url = new URL(`${baseUrl}/inspection/${store.state.slug}/${store.state.locale}`)
  const headers = new Headers({
    Authorization: `Bearer ${store.state.token}`
  })
  return fetchWithTimeout(url, {
    headers
  })
    .then((response) => checkStatus(response))
    .then((response) => response.json())
    .then((response) => (response))
    .catch((e) => { throw e })
}

export const fetchAdvisor = async () => {
  const url = new URL(`${baseUrl}/confirmation/${store.state.slug}`)
  const headers = new Headers({
    Authorization: `Bearer ${store.state.token}`
  })
  return fetchWithTimeout(url, {
    headers
  })
    .then((response) => checkStatus(response))
    .then((response) => response.json())
    .then((response) => (response))
    .catch((e) => { throw e })
}

export const fetchTax = async () => {
  const selectedServices = []
  store.state.services.forEach((service) => {
    if (service.category !== '3' && service.category !== '4') {
      if (service.subServices) {
        service.subServices.forEach((subService) => {
          if (subService.isSelected) {
            selectedServices.push(subService.id)
          }
        })
      } else {
        if (service.isSelected) {
          selectedServices.push(service.id)
        }
      }
    }
  })

  const url = new URL(`${baseUrl}/tax/${store.state.slug}`)
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${store.state.token}`
  })
  const body = '{ selectedServices: ' + JSON.stringify(selectedServices) + '}'

  return fetchWithTimeout(url, {
    method: 'POST',
    headers,
    body
  })
    .then((response) => checkStatus(response))
    .then((response) => response.json())
    .then((response) => (response))
    .catch((e) => { throw e })
}

export const postServices = async () => {
  const confirmedServices = []
  store.state.services.forEach((service) => {
    if (service.category !== '4' && service.category !== '3') {
      if (service.subServices) {
        service.subServices.forEach((subService) => {
          if (subService.isSelected) {
            subService.isApproved = true
            subService.reasonId = subService.declinedReasonId
            confirmedServices.push(subService)
          } else {
            subService.isApproved = false
            subService.reasonId = typeof subService.reasonId === 'undefined' ? subService.declinedReasonId : subService.reasonId
            confirmedServices.push(subService)
          }
        })
      } else {
        if (service.isSelected) {
          service.isApproved = true
          service.reasonId = service.declinedReasonId
          confirmedServices.push(service)
        } else {
          service.isApproved = false
          service.reasonId = typeof service.reasonId === 'undefined' ? service.declinedReasonId : service.reasonId
          confirmedServices.push(service)
        }
      }
    }
  })

  const url = new URL(`${baseUrl}/services/${store.state.slug}`)
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${store.state.token}`
  })
  const body = JSON.stringify({
    confirmedServices,
    customerSignature: store.state.signature
  })

  return fetchWithTimeout(url, {
    method: 'POST',
    headers,
    body
  })
    .then((response) => checkStatus(response))
    .then((response) => response.json())
    .then((response) => (response))
    .catch((e) => { throw e })
}

export const postLog = async () => {
  const url = new URL(`${logBaseUrl}`)
  const headers = new Headers({
    'Content-Type': 'application/json'
  })
  const body = JSON.stringify(store.state.log)

  return fetchWithTimeout(url, {
    method: 'POST',
    headers,
    body
  })
    .then((response) => checkStatus(response))
    .then((response) => response.json())
    .then((response) => (response))
    .catch((e) => { throw e })
}

export default {
  fetchMetadata,
  fetchToken
}
