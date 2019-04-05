export const state = {
  acceptedTermsAndConditions: false,
  activeCategory: null,
  advisor: {
    advisorImageUrl: '',
    advisorName: '',
    marketingImageUrl: ''
  },
  categories: [],
  categoryIdMap: {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '5',
    7: '5',
    8: '5',
    9: '5'
  },
  code: '',
  customer: {
    firstName: '',
    isBusiness: false,
    lastName: ''
  },
  customerCommentsLabel: '',
  deadlines: {
    readyBy: null,
    respondBy: null
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
  locale: {
    selected: '',
    default: 'en-CA'
  },
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
  tax: {
    previouslyApproved: 0,
    newlyApproved: 0
  },
  token: '',
  topImageUrl: ''
}

export default state
