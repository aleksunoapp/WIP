export interface Category {
  id: string;
  name: string | null;
  serviceCategoryType: string;
  iconUrl: string;
  sortOrder: number;
  defaultExpended: boolean;
  isPreApproved: boolean;
  showOnSummary: boolean;
  showOnInspection: boolean;
}

export interface Language {
  culture: string;
  name: string;
}

export type ViewName = 'login' | 'tutorial' | 'glance' | 'services' | 'popup' | 'summary';
export type TutorialPage = '1' | '2' | '3';

export interface EventEntry {
  description: string;
  time: number;
}

export interface Log {
  clientId: string;
  events: EventEntry[];
}

export interface Reason {
  id: number;
  name: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  taxAndFee: number;
  isSelected: boolean;
  parentServiceId: string;
  serviceAdvisorComments: string;
  comment: string | null;
  imageUrl: string;
  iconUrl: string | null;
  isHighlighted: false;
  declinedReasonId: number;
  laborMatrixPayment: string;
  laborMatrixPaymentTranslations: string | null;
}

export interface InitialState {
  acceptedTermsAndConditions: boolean;
  activeCategory: Category | null;
  advisor: {
    advisorImageUrl: string,
    advisorName: string,
    marketingImageUrl: string,
  };
  categories: Category[];
  code: string;
  customer: {
    firstName: string,
    isBusiness: boolean,
    lastName: string,
  };
  customerCommentsLabel: string;
  deadlines: {
    respondBy: Date | null,
    readyBy: Date | null,
  };
  dealer: {
    address: string,
    email: string,
    logoUrl: string,
    name: string,
    phone: string,
    smsPhone: string,
  };
  drawer: boolean;
  error: string;
  expired: boolean;
  help: boolean;
  inspectionReportUrl: string;
  languages: Language[];
  loading: {
    getMetadata: false,
    getTax: false,
    logIn: false,
    sendServices: false,
  };
  locale: string;
  log: Log;
  modal: boolean;
  reason: boolean;
  reasons: Reason[];
  service: Service | null;
  services: Service[];
  signature: null;
  slug: string;
  tax: number;
  token: string;
}
