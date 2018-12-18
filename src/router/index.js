import Vue from 'vue'
import Router from 'vue-router'
// Login
import Login from '@/components/Login'
// App
const Nav = () => import('@/components/App')
// Unauthorized
const Unauthorized = () => import('@/components/Unauthorized')
// Profile
const Profile = () => import('@/components/app/Profile')
// Analytics
const Overview = () => import('@/components/app/Analytics/Overview')
const LocationSales = () => import('@/components/app/Analytics/LocationSales')
const ItemSales = () => import('@/components/app/Analytics/ItemSales')
const UserAnalytics = () => import('@/components/app/Analytics/UserAnalytics')
const OrderHistory = () => import('@/components/app/Analytics/OrderHistory')
// Approvals
const Roles = () => import('@/components/app/ApprovalsManager/Roles')
const Permissions = () => import('@/components/app/ApprovalsManager/Permissions')
const Modules = () => import('@/components/app/ApprovalsManager/Modules')
const Approvals = () => import('@/components/app/ApprovalsManager/Approvals')
// Admin Manager
const BrandAdmins = () => import('@/components/app/AdminManager/BrandAdmins')
const LocationManagers = () => import('@/components/app/AdminManager/LocationManagers')
const OMAUsers = () => import('@/components/app/AdminManager/OMAUsers')
const StoreAppUsers = () => import('@/components/app/AdminManager/StoreAppUsers')
// Store Manager
const CreateNewStore = () => import('@/components/app/StoreManager/CreateNewStore')
const StoreList = () => import('@/components/app/StoreManager/StoreList')
const EditStore = () => import('@/components/app/StoreManager/EditStore')
const Amenities = () => import('@/components/app/StoreManager/Amenities')
const OrderSettings = () => import('@/components/app/StoreManager/OrderSettings')
const DeliveryHours = () => import('@/components/app/StoreManager/DeliveryHours')
const StoreGroups = () => import('@/components/app/StoreManager/StoreGroups')
const DeliveryZones = () => import('@/components/app/StoreManager/DeliveryZones')
const PaymentMethods = () => import('@/components/app/StoreManager/PaymentMethods')
const DeliveryProviders = () => import('@/components/app/StoreManager/DeliveryProviders')
const PaymentTerminals = () => import('@/components/app/StoreManager/PaymentTerminals')
const Discounts = () => import('@/components/app/StoreManager/Discounts')
// News Feed
const NewsFeed = () => import('@/components/app/NewsFeed')
// Social Feed
const SocialFeed = () => import('@/components/app/SocialFeed')
// Tax Manager
const TaxClasses = () => import('@/components/app/TaxManager/TaxClasses')
const ItemTypes = () => import('@/components/app/TaxManager/ItemTypes')
// Menu Manager
const Menus = () => import('@/components/app/MenuManager/Menu')
const Categories = () => import('@/components/app/MenuManager/Categories')
const Items = () => import('@/components/app/MenuManager/Items')
const Modifiers = () => import('@/components/app/MenuManager/Modifiers')
const MenuTiers = () => import('@/components/app/MenuManager/MenuTiers')
const Tags = () => import('@/components/app/MenuManager/Tags')
const Portions = () => import('@/components/app/MenuManager/Portions')
const Options = () => import('@/components/app/MenuManager/Options')
const OptionItems = () => import('@/components/app/MenuManager/OptionItems')
const ModifierItems = () => import('@/components/app/MenuManager/ModifierItems')
const ModifierTiers = () => import('@/components/app/MenuManager/ModifierTiers/ModifierTiers')
const ItemAttributes = () => import('@/components/app/MenuManager/ItemAttributes')
// Printers
const Printers = () => import('@/components/app/Printers/Printers')
// Users Manager
const UserList = () => import('@/components/app/UserManager/UserList')
const UserProfile = () => import('@/components/app/UserManager/UserProfile')
const UserGroups = () => import('@/components/app/UserManager/UserGroups')
const UserAttributes = () => import('@/components/app/UserManager/UserAttributes')
const Transactions = () => import('@/components/app/UserManager/Transactions')
// FAQ
const StoresFAQ = () => import('@/components/app/Faq/StoresFAQ')
const UsersFAQ = () => import('@/components/app/Faq/UsersFAQ')
// Gallery
const Gallery = () => import('@/components/app/Gallery')
const CreateFolder = () => import('@/components/app/Gallery/CreateFolder')
const EditFolder = () => import('@/components/app/Gallery/EditFolder')
// Loyalty
const BaseRule = () => import('@/components/app/Loyalty/BaseRule')
const PromotionRules = () => import('@/components/app/Loyalty/PromotionRules')
const Rewards = () => import('@/components/app/Rewards')
const RewardItems = () => import('@/components/app/RewardItems')
// Combos
const ComboOffers = () => import('@/components/app/Combos/ComboOffers')
const ComboOfferItems = () => import('@/components/app/Combos/ComboOfferItems')
// Promocodes
const Promocodes = () => import('@/components/app/Promocodes')
// Promotions
const Promotions = () => import('@/components/app/Promotions')
const Geolocations = () => import('@/components/app/Promotions/Geolocations')
// Localization
const Countries = () => import('@/components/app/Localization/Countries')
const Platforms = () => import('@/components/app/Localization/Platforms')
const Languages = () => import('@/components/app/Localization/Languages')
const LanguageRegions = () => import('@/components/app/Localization/LanguageRegions')
const Terms = () => import('@/components/app/Localization/Terms')
const EcommTranslations = () => import('@/components/app/Localization/EcommTranslations')
const CustomTranslations = () => import('@/components/app/Localization/CustomTranslations')
// list of permissions
import { App } from '@/main.js'

Vue.use(Router)

export const routes = [
	{
		path: '/',
		component: Login,
		name: 'Login',
		meta: {
			permissions: []
		}
	},
	{
		path: '/login/:expired',
		component: Login,
		name: 'LoginExpired',
		meta: {
			permissions: []
		}
	},
	{
		path: '/forgot-password',
		name: 'ForgotPassword',
		component: Login,
		meta: {
			permissions: []
		}
	},
	{
		path: '/app',
		component: Nav,
		name: 'App',
		adminOnly: false,
		meta: {
			permissions: []
		},
		children: [
			// Analytics
			{
				path: 'analytics',
				redirect: 'analytics/overview',
				meta: {
					adminOnly: true,
					permissions: []
				}
			},
			{
				path: 'analytics/overview',
				name: 'Overview',
				component: Overview,
				meta: {
					adminOnly: true,
					permissions: ['analytics overview read']
				}
			},
			{
				path: 'analytics/locationsales',
				name: 'LocationSales',
				component: LocationSales,
				meta: {
					adminOnly: true,
					permissions: ['analytics store read']
				}
			},
			{
				path: 'analytics/itemsales',
				name: 'ItemSales',
				component: ItemSales,
				meta: {
					adminOnly: true,
					permissions: ['analytics item read']
				}
			},
			{
				path: 'analytics/useranalytics',
				name: 'UserAnalytics',
				component: UserAnalytics,
				meta: {
					adminOnly: true,
					permissions: ['analytics user read']
				}
			},
			{
				path: 'analytics/orders',
				name: 'OrderHistory',
				component: OrderHistory,
				meta: {
					adminOnly: true,
					permissions: ['analytics order read']
				}
			},
			// Approvals Manager
			{
				path: 'approvals/roles',
				name: 'Roles',
				component: Roles,
				meta: {
					adminOnly: true,
					permissions: ['list role']
				}
			},
			{
				path: 'approvals/permissions',
				name: 'Permissions',
				component: Permissions,
				meta: {
					adminOnly: true,
					permissions: ['list permission']
				}
			},
			{
				path: 'approvals/modules',
				name: 'Modules',
				component: Modules,
				meta: {
					adminOnly: true,
					permissions: ['approvals modules read']
				}
			},
			{
				path: 'approvals/approvals',
				name: 'Approvals',
				component: Approvals,
				meta: {
					adminOnly: true,
					permissions: ['approvals read']
				}
			},
			// Admin Manager
			{
				path: 'admin',
				redirect: 'admin/brand_admins',
				meta: {
					adminOnly: true,
					permissions: []
				}
			},
			{
				path: 'admin/brand_admins',
				name: 'Brand Admins',
				component: BrandAdmins,
				meta: {
					adminOnly: true,
					permissions: ['admin brand_admins read']
				}
			},
			{
				path: 'admin/location_managers',
				name: 'Location Managers',
				component: LocationManagers,
				meta: {
					adminOnly: true,
					permissions: ['admin location_managers read']
				}
			},
			{
				path: 'admin/OMA_users',
				name: 'OMA Users',
				component: OMAUsers,
				meta: {
					adminOnly: true,
					permissions: ['admin oma_users read']
				}
			},
			{
				path: 'admin/store_app_users',
				name: 'Store App Users',
				component: StoreAppUsers,
				meta: {
					adminOnly: true,
					permissions: ['admin store_app_users read']
				}
			},
			// Store Manager
			{
				path: 'store_manager',
				redirect: 'store_manager/create_new',
				meta: {
					adminOnly: true,
					permissions: []
				}
			},
			{
				path: 'store_manager/create_new',
				name: 'Create New Store',
				component: CreateNewStore,
				meta: {
					adminOnly: true,
					permissions: ['stores info create']
				}
			},
			{
				path: 'store_manager/edit_store/:store_id',
				name: 'Edit Store',
				component: EditStore,
				meta: {
					adminOnly: false,
					permissions: ['stores info read', 'stores info update']
				}
			},
			{
				path: 'store_manager/stores',
				name: 'Stores',
				component: StoreList,
				meta: {
					adminOnly: false,
					permissions: ['stores info read']
				}
			},
			{
				path: 'store_manager/store_groups',
				name: 'Store Groups',
				component: StoreGroups,
				meta: {
					adminOnly: true,
					permissions: ['stores groups read']
				}
			},
			{
				path: 'store_manager/amenities',
				name: 'Amenities',
				component: Amenities,
				meta: {
					permissions: ['stores amenities read']
				}
			},
			{
				path: 'store_manager/order_settings',
				name: 'OrderSettings',
				component: OrderSettings,
				meta: {
					adminOnly: false,
					permissions: ['stores order_settings read']
				}
			},
			{
				path: 'store_manager/delivery_hours',
				name: 'DeliveryHours',
				component: DeliveryHours,
				meta: {
					permissions: ['stores delivery_hours read']
				}
			},
			{
				path: 'store_manager/delivery_zones',
				name: 'DeliveryZones',
				component: DeliveryZones,
				meta: {
					permissions: ['stores delivery_profile read']
				}
			},
			{
				path: 'store_manager/payment_methods',
				name: 'PaymentMethods',
				component: PaymentMethods,
				meta: {
					permissions: ['stores payment methods read']
				}
			},
			{
				path: 'store_manager/payment_terminals',
				name: 'PaymentTerminals',
				component: PaymentTerminals,
				meta: {
					permissions: ['stores payment terminals read']
				}
			},
			{
				path: 'store_manager/discounts',
				name: 'Discounts',
				component: Discounts,
				meta: {
					permissions: ['stores discounts read']
				}
			},
			{
				path: 'store_manager/delivery_providers',
				name: 'DeliveryProviders',
				component: DeliveryProviders,
				meta: {
					permissions: ['stores delivery_provider read']
				}
			},
			// News Feed
			{
				path: 'news_feed',
				component: NewsFeed,
				name: 'News Feed',
				meta: {
					adminOnly: true,
					permissions: ['news_feed read']
				}
			},
			// Social Feed
			{
				path: 'social_feed',
				component: SocialFeed,
				name: 'Social Feed',
				meta: {
					adminOnly: true,
					permissions: ['social_feed read']
				}
			},
			// Tax Manager
			{
				path: 'tax_manager',
				redirect: 'tax_manager/tax_classes',
				meta: {
					adminOnly: false,
					permissions: []
				}
			},
			{
				path: 'tax_manager/tax_classes',
				name: 'Tax Classes',
				component: TaxClasses,
				meta: {
					adminOnly: false,
					permissions: ['tax tax_classes read']
				}
			},
			{
				path: 'tax_manager/item_types',
				name: 'Item Types',
				component: ItemTypes,
				meta: {
					adminOnly: false,
					permissions: ['tax item_types read']
				}
			},
			// Menu Manager
			{
				path: 'menu_manager',
				redirect: 'menu_manager/menus',
				meta: {
					adminOnly: false,
					permissions: []
				}
			},
			{
				path: 'menu_manager/menus',
				name: 'Menus',
				component: Menus,
				meta: {
					adminOnly: false,
					permissions: ['menu_manager menus read']
				}
			},
			{
				path: 'menu_manager/menu_tiers',
				name: 'MenuTiers',
				component: MenuTiers,
				meta: {
					adminOnly: false,
					permissions: ['menu_manager tiers read']
				},
				children: [
					{
						path: 'edit_menu_tier/:menu_tier_id',
						name: 'Edit Menu Tier',
						meta: {
							permissions: ['menu_manager tiers read']
						}
					}
				]
			},
			{
				path: 'menu_manager/categories/:menu_id',
				name: 'Categories',
				component: Categories,
				meta: {
					adminOnly: false,
					permissions: ['menu_manager menus categories read']
				},
				children: [
					{
						path: 'edit_category/:category_id',
						name: 'Edit Category',
						meta: {
							adminOnly: false,
							permissions: ['menu_manager menus categories read']
						}
					},
					{
						path: 'add_sub_category',
						name: 'Add Sub Category',
						meta: {
							adminOnly: false,
							permissions: [
								'menu_manager menus categories subcategories create'
							]
						}
					},
					{
						path: 'edit_sub_category/:sub_category_id',
						name: 'Edit Sub Category',
						meta: {
							permissions: [
								'menu_manager menus categories subcategories update'
							]
						}
					}
				]
			},
			{
				path: 'menu_manager/items/:category_id',
				name: 'Items',
				component: Items,
				meta: {
					adminOnly: false,
					permissions: [
						'menu_manager menus categories subcategories items read'
					]
				},
				children: [
					{
						path: 'edit_item/:item_id',
						name: 'Edit Item',
						meta: {
							permissions: [
								'menu_manager menus categories subcategories items read'
							]
						}
					}
				]
			},
			{
				path: 'menu_manager/modifiers',
				name: 'Modifiers',
				component: Modifiers,
				meta: {
					adminOnly: false,
					permissions: ['menu_manager modifiers read']
				},
				children: [
					{
						path: 'edit_category/:modifier_category_id',
						name: 'Edit Modifier Category',
						meta: {
							permissions: ['menu_manager modifiers read']
						}
					}
				]
			},
			{
				path: 'menu_manager/modifier_tiers',
				name: 'Modifier Tiers',
				component: ModifierTiers,
				meta: {
					adminOnly: false,
					permissions: ['menu_manager modifier_tiers read']
				},
				children: [
					{
						path: 'edit/:modifier_tier_id',
						name: 'Edit Modifier Tier',
						meta: {
							permissions: ['menu_manager modifier_tiers read']
						}
					}
				]
			},
			{
				path: 'menu_manager/tags',
				name: 'Tags',
				component: Tags,
				meta: {
					adminOnly: false,
					permissions: ['menu_manager tags read']
				},
				children: [
					{
						path: 'edit_tag/:tag_id',
						name: 'Edit Tag',
						meta: {
							permissions: ['menu_manager tags read']
						}
					}
				]
			},
			{
				path: 'menu_manager/portions',
				name: 'Portions',
				component: Portions,
				meta: {
					adminOnly: false,
					permissions: ['menu_manager portions read']
				}
			},
			{
				path: 'menu_manager/options',
				name: 'Options',
				component: Options,
				meta: {
					adminOnly: false,
					permissions: ['menu_manager options read']
				}
			},
			{
				path: 'menu_manager/options/:option_id/option_items',
				name: 'OptionItems',
				component: OptionItems,
				meta: {
					adminOnly: false,
					permissions: ['menu_manager options items read']
				}
			},
			{
				path: 'menu_manager/modifier_items/:modifier_id',
				name: 'Modifier Items',
				component: ModifierItems,
				meta: {
					adminOnly: false,
					permissions: ['menu_manager modifiers items read']
				},
				children: [
					{
						path: 'edit_modifier_item/:modifier_item_id',
						name: 'Edit Modifier Item',
						meta: {
							permissions: ['menu_manager modifiers items read']
						}
					}
				]
			},
			{
				path: 'menu_manager/item_attributes',
				name: 'Item Attributes',
				component: ItemAttributes,
				meta: {
					adminOnly: false,
					permissions: ['menu_manager attributes read']
				}
			},
			// Printers
			{
				path: 'printers',
				component: Printers,
				name: 'Printers',
				meta: {
					adminOnly: false,
					permissions: ['printers read']
				}
			},
			// User Manager
			{
				path: 'user_manager',
				redirect: 'user_manager/users',
				meta: {
					adminOnly: true,
					permissions: []
				}
			},
			{
				path: 'user_manager/users',
				name: 'Users',
				component: UserList,
				meta: {
					adminOnly: true,
					permissions: ['user_manager users read']
				}
			},
			{
				path: 'user_manager/users/:id/:name',
				name: 'UserProfile',
				component: UserProfile,
				meta: {
					adminOnly: true,
					permissions: ['user_manager users read']
				}
			},
			{
				path: 'user_manager/user_groups',
				name: 'User Groups',
				component: UserGroups,
				meta: {
					adminOnly: true,
					permissions: ['user_manager user_groups read']
				}
			},
			{
				path: 'user_manager/user_attributes',
				name: 'Attributes',
				component: UserAttributes,
				meta: {
					adminOnly: true,
					permissions: ['user_manager attributes read']
				}
			},
			{
				path: 'user_manager/transactions',
				name: 'Transactions',
				component: Transactions,
				meta: {
					adminOnly: true,
					permissions: ['user_manager transactions read']
				}
			},
			// FAQ
			{
				path: 'faq',
				redirect: 'faq/users',
				meta: {
					adminOnly: true,
					permissions: []
				}
			},
			{
				path: 'faq/users',
				name: 'Users FAQ',
				component: UsersFAQ,
				meta: {
					adminOnly: true,
					permissions: ['faq user read']
				}
			},
			{
				path: 'faq/stores',
				name: 'Stores FAQ',
				component: StoresFAQ,
				meta: {
					adminOnly: true,
					permissions: ['faq store read']
				}
			},
			// Gallery
			{
				path: 'gallery',
				component: Gallery,
				name: 'Gallery',
				meta: {
					adminOnly: false,
					permissions: ['gallery read']
				}
			},
			{
				path: 'gallery/create_folder/:parent_id',
				component: CreateFolder,
				name: 'Create Resource Folder',
				meta: {
					adminOnly: false,
					permissions: ['gallery create']
				}
			},
			{
				path: 'gallery/edit_folder/:folder',
				component: EditFolder,
				name: 'Edit Resource Folder',
				meta: {
					adminOnly: false,
					permissions: ['gallery update']
				}
			},
			// Loyalty
			{
				path: 'loyalty',
				redirect: 'loyalty/base_rule',
				meta: {
					adminOnly: true,
					permissions: []
				}
			},
			{
				path: 'loyalty/base_rule',
				component: BaseRule,
				name: 'Base Rule',
				meta: {
					adminOnly: true,
					permissions: ['loyalty base_rule read']
				}
			},
			{
				path: 'loyalty/promotion_rules',
				component: PromotionRules,
				name: 'Promotion Rules',
				meta: {
					adminOnly: true,
					permissions: ['loyalty promotion_rules read']
				}
			},
			{
				path: 'loyalty/rewards',
				component: Rewards,
				name: 'Rewards',
				meta: {
					adminOnly: true,
					permissions: ['reward_tiers read']
				}
			},
			{
				path: 'loyalty/rewards/:reward_id/items',
				component: RewardItems,
				props: true,
				name: 'Reward Items',
				meta: {
					adminOnly: true,
					permissions: ['reward_tiers items read']
				}
			},
			// Combos
			{
				path: 'combos/offers',
				component: ComboOffers,
				name: 'ComboOffers',
				meta: {
					adminOnly: true,
					permissions: ['combo_offer read']
				}
			},
			{
				path: 'combos/offer/:offer_id/items',
				component: ComboOfferItems,
				name: 'ComboOfferItems',
				meta: {
					adminOnly: true,
					permissions: ['combo_item read']
				}
			},
			// Promo Codes
			{
				path: 'promocodes',
				component: Promocodes,
				name: 'Promocodes',
				meta: {
					adminOnly: true,
					permissions: ['promocodes read']
				}
			},
			// Promotions
			{
				path: 'promotions',
				component: Promotions,
				name: 'Promotions',
				meta: {
					adminOnly: true,
					permissions: ['promotions read']
				}
			},
			{
				path: 'promotions/geolocations',
				component: Geolocations,
				name: 'Geolocations',
				meta: {
					adminOnly: true,
					permissions: ['promotions geolocations read']
				}
			},
			// Localization
			{
				path: 'localization/countries',
				name: 'Countries',
				component: Countries,
				meta: {
					permissions: ['localization countries read']
				}
			},
			{
				path: 'localization/platforms',
				name: 'Platforms',
				component: Platforms,
				meta: {
					permissions: ['localization platforms read']
				}
			},
			{
				path: 'localization/languages',
				name: 'Languages',
				component: Languages,
				meta: {
					permissions: ['localization languages read']
				}
			},
			{
				path: 'localization/language_regions',
				name: 'Language Regions',
				component: LanguageRegions,
				meta: {
					permissions: ['localization locale_regions read']
				}
			},
			{
				path: 'localization/terms',
				name: 'Terms',
				component: Terms,
				meta: {
					adminOnly: true,
					permissions: ['localization terms read']
				}
			},
			{
				path: 'localization/ecomm',
				name: 'eComm Translations',
				component: EcommTranslations,
				meta: {
					adminOnly: true,
					permissions: ['localization read']
				}
			},
			{
				path: 'localization/custom',
				name: 'Custom Translations',
				component: CustomTranslations,
				meta: {
					adminOnly: true,
					permissions: ['localization read']
				}
			},
			// Unauthorized
			{
				path: 'unauthorized',
				name: 'unauthorized',
				component: Unauthorized,
				meta: {
					permissions: []
				}
			},
			// Profile
			{
				path: 'profile',
				component: Profile,
				name: 'Profile',
				meta: {
					permissions: []
				}
			}
		]
	},
	{
		path: '*',
		redirect: '/',
		meta: {
			permissions: []
		}
	}
]

const router = new Router({
	routes,
	scrollBehavior (to, from, savedPosition) {
		return { x: 0, y: 0 }
	}
})

router.beforeEach((to, from, next) => {
	window.scrollTo(0, 0)
	if (to.meta && to.meta.permissions.length === 0) {
		next()
	} else {
		try {
			if (App === undefined) {
				next()
			} else if (
				to.meta &&
				to.meta.permissions.some(
					permission => App.permissions[permission]
				)
			) {
				next()
			} else {
				next({
					path: '/app/unauthorized'
				})
			}
		} catch (e) {
			next({
				path: '/'
			})
		}
	}
})

router.afterEach((to, from, next) => {
	if (to.path !== '/') {
		// eslint-disable-next-line
		sessionStorage.setItem('routePath', to.path)
	}
})

export default router
