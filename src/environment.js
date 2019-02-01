function isDev () {
  return window.location.hostname.split('.')[0] === 'localhost'
}
function isStaging () {
  return ['dmpi2', 'dfx-dmpi2'].includes(window.location.hostname.split('.')[0])
}

export const baseUrl = (() => {
  if (isDev() || isStaging()) {
    return 'https://test2dmpiapi.dealer-fx.com'
  } else {
    return '#{ApiUrl}#'
  }
})()
export const scope = (() => {
  if (isDev() || isStaging()) {
    return 'TEST2_DynamicAPIUser'
  } else {
    return '#{DmpiScope}#'
  }
})()
export const logBaseUrl = (() => {
  if (isDev() || isStaging()) {
    return 'https://test2dmpiapi.dealer-fx.com'
  } else {
    return '#{UserActivityLog}#'
  }
})()

export default {
  baseUrl,
  scope,
  logBaseUrl
}
