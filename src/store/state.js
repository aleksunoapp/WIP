export const state = {
  acceptedTermsAndConditions: false,
  activeCategory: null,
  advisor: {
    advisorImageUrl: '',
    advisorName: '',
    marketingImageUrl: ''
  },
  categories: [],
  code: '',
  customer: {
    firstName: '',
    isBusiness: false,
    lastName: ''
  },
  customerConcernsLabel: '',
  deadlines: {
    respondBy: null,
    readyBy: null
  },
  dealer: {
    address: '',
    email: '',
    logoUrl: '',
    name: '',
    phone: '',
    smsPhone: ''
  },
  drawer: false,
  error: '',
  expired: false,
  help: false,
  inspectionReportUrl: '',
  languages: [
    {
      culture: 'en-CA',
      name: 'English'
    }
  ],
  loading: {
    getMetadata: false,
    getTax: false,
    logIn: false,
    sendServices: false
  },
  locale: 'en-CA',
  log: {
    clientId: '',
    events: []
  },
  modal: false,
  reason: false,
  reasons: [],
  service: {},
  services: [],
  signature: null,
  slug: '',
  tax: 0,
  token: ''
}

export default state
