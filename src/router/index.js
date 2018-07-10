import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import App from '../components/App'
// Store Manager
import CreateNewStore from '../components/app/StoreManager/CreateNewStore'
import StoreList from '../components/app/StoreManager/StoreList'
import EditStore from '../components/app/StoreManager/EditStore'
import Amenities from '../components/app/MenuManager/Amenities'
import OrderSettings from '../components/app/StoreManager/OrderSettings'

import NewsFeed from '../components/app/NewsFeed'
import SocialFeed from '../components/app/SocialFeed'
// Tax Manager
import TaxClasses from '../components/app/TaxManager/TaxClasses'
import ItemTypes from '../components/app/TaxManager/ItemTypes'
// Menu Manager
import Menus from '../components/app/MenuManager/Menu'
import Categories from '../components/app/MenuManager/Categories'
import Items from '../components/app/MenuManager/Items'
import Modifiers from '../components/app/MenuManager/Modifiers'
import MenuTiers from '../components/app/MenuManager/MenuTiers'
import ModifierTiers from '../components/app/MenuManager/ModifierTiers/ModifierTiers'
import Tags from '../components/app/MenuManager/Tags'
import Portions from '../components/app/MenuManager/Portions'
import Options from '../components/app/MenuManager/Options'
import OptionItems from '../components/app/MenuManager/OptionItems'
import ModifierItems from '../components/app/MenuManager/ModifierItems'
import ItemAttributes from '../components/app/MenuManager/ItemAttributes'
import UserList from '../components/app/UserManager/UserList'
import UserProfile from '../components/app/UserManager/UserProfile'
import UserGroups from '../components/app/UserManager/UserGroups'
import UserAttributes from '../components/app/UserManager/UserAttributes'
import StoresFAQ from '../components/app/Faq/StoresFAQ'
import UsersFAQ from '../components/app/Faq/UsersFAQ'
import Printers from '../components/app/Printers/Printers'
// Resources
import Gallery from '../components/app/Gallery'
import CreateFolder from '../components/app/Gallery/CreateFolder'
import EditFolder from '../components/app/Gallery/EditFolder'

import StoreGroups from '../components/app/StoreManager/StoreGroups'
import BaseRule from '../components/app/Loyalty/BaseRule'
import PromotionRules from '../components/app/Loyalty/PromotionRules'
import Rewards from '../components/app/Rewards'
import Promocodes from '../components/app/Promocodes'
import RewardItems from '../components/app/RewardItems'
import Promotions from '../components/app/Promotions'
import Geolocations from '../components/app/Promotions/Geolocations'
import Overview from '../components/app/Analytics/Overview'
import LocationSales from '../components/app/Analytics/LocationSales'
import ItemSales from '../components/app/Analytics/ItemSales'
import UserAnalytics from '../components/app/Analytics/UserAnalytics'
import Localization from '../components/app/Localization/Localization'
// Admin Manager
import BrandAdmins from '../components/app/AdminManager/BrandAdmins'
import LocationManagers from '../components/app/AdminManager/LocationManagers'
import OMAUsers from '../components/app/AdminManager/OMAUsers'
import StoreAppUsers from '../components/app/AdminManager/StoreAppUsers'
import Roles from '../components/app/AdminManager/Roles'
import Permissions from '../components/app/AdminManager/Permissions'
import Modules from '../components/app/AdminManager/Modules'
import Approvals from '../components/app/AdminManager/Approvals'

Vue.use(Router)

const router = new Router({
	routes: [
		{path: '/', component: Login, name: 'Login', adminOnly: false},
		{path: '/login/:expired', component: Login, adminOnly: false},
		{path: '/app', redirect: '/app/analytics/overview', adminOnly: false},
		{
			path: '/app',
			component: App,
			name: 'App',
			adminOnly: false,
			children: [
				{path: 'news_feed', component: NewsFeed, name: 'News Feed', meta: { adminOnly: true }},
				{path: 'social_feed', component: SocialFeed, name: 'Social Feed', meta: { adminOnly: true }},
				{path: 'faq', redirect: 'faq/users', meta: { adminOnly: true }},
				{path: 'faq/users', name: 'Users FAQ', component: UsersFAQ, meta: { adminOnly: true }},
				{path: 'faq/stores', name: 'Stores FAQ', component: StoresFAQ, meta: { adminOnly: true }},
				{path: 'printers', component: Printers, name: 'Printers', meta: { adminOnly: false }},

				// Resources
				{path: 'gallery', component: Gallery, name: 'Gallery', meta: { adminOnly: false }},
				{path: 'gallery/create_folder/:parent_id', component: CreateFolder, name: 'Create Resource Folder', meta: { adminOnly: false }},
				{path: 'gallery/edit_folder/:folder', component: EditFolder, name: 'Edit Resource Folder', meta: { adminOnly: false }},

				{path: 'loyalty', redirect: 'loyalty/base_rule', meta: { adminOnly: true }},
				{path: 'loyalty/base_rule', component: BaseRule, name: 'Base Rule', meta: { adminOnly: true }},
				{path: 'loyalty/promotion_rules', component: PromotionRules, name: 'Promotion Rules', meta: { adminOnly: true }},
				{path: 'loyalty/rewards', component: Rewards, name: 'Rewards', meta: { adminOnly: true }},
				{path: 'loyalty/rewards/:reward_id/items', component: RewardItems, props: true, name: 'Reward Items', meta: { adminOnly: true }},
				{path: 'promocodes', component: Promocodes, name: 'Promocodes', meta: { adminOnly: true }},
				{path: 'promotions', component: Promotions, name: 'Promotions', meta: { adminOnly: true }},
				{path: 'promotions/geolocations', component: Geolocations, name: 'Geolocations', meta: { adminOnly: true }},

				// Tax Manager
				{path: 'tax_manager', redirect: 'tax_manager/tax_classes', meta: { adminOnly: false }},
				{path: 'tax_manager/tax_classes', name: 'Tax Classes', component: TaxClasses, meta: { adminOnly: false }},
				{path: 'tax_manager/item_types', name: 'Item Types', component: ItemTypes, meta: { adminOnly: false }},

				// Menu Manager
				{path: 'menu_manager', redirect: 'menu_manager/menus', meta: { adminOnly: false }},
				{path: 'menu_manager/menus', name: 'Menus', component: Menus, meta: { adminOnly: false }},
				{path: 'menu_manager/menu_tiers', name: 'MenuTiers', component: MenuTiers, children: [{path: 'edit_menu_tier/:menu_tier_id', name: 'Edit Menu Tier'}], meta: { adminOnly: false }},
				{path: 'menu_manager/categories/:menu_id', name: 'Categories', component: Categories, children: [{path: 'edit_category/:category_id', name: 'Edit Category', meta: { adminOnly: false }}, {path: 'add_sub_category', name: 'Add Sub Category', meta: { adminOnly: false }}, {path: 'edit_sub_category/:sub_category_id', name: 'Edit Sub Category'}], meta: { adminOnly: false }},
				{path: 'menu_manager/items/:category_id', name: 'Items', component: Items, children: [{path: 'edit_item/:item_id', name: 'Edit Item'}], meta: { adminOnly: false }},
				{path: 'menu_manager/modifiers', name: 'Modifiers', component: Modifiers, children: [{path: 'edit_category/:modifier_category_id', name: 'Edit Modifier Category'}], meta: { adminOnly: false }},
				{path: 'menu_manager/modifier_tiers', name: 'ModifierTiers', component: ModifierTiers, children: [{path: 'edit/:modifier_tier_id', name: 'Edit Modifier Tier'}], meta: { adminOnly: false }},
				{path: 'menu_manager/tags', name: 'Tags', component: Tags, children: [{path: 'edit_tag/:tag_id', name: 'Edit Tag'}], meta: { adminOnly: false }},
				{path: 'menu_manager/portions', name: 'Portions', component: Portions, meta: { adminOnly: false }},
				{path: 'menu_manager/options', name: 'Options', component: Options, meta: { adminOnly: false }},
				{path: 'menu_manager/options/:option_id/option_items', name: 'OptionItems', component: OptionItems, meta: { adminOnly: false }},
				{path: 'menu_manager/modifier_items/:modifier_id', name: 'Modifier Items', component: ModifierItems, children: [{path: 'edit_modifier_item/:modifier_item_id', name: 'Edit Modifier Item'}], meta: { adminOnly: false }},
				{path: 'menu_manager/item_attributes', name: 'Item Attributes', component: ItemAttributes, meta: { adminOnly: false }},
				// admin manager routes
				{path: 'admin', redirect: 'admin/brand_admins', meta: { adminOnly: true }},
				{path: 'admin/brand_admins', name: 'Brand Admins', component: BrandAdmins, meta: { adminOnly: true }},
				{path: 'admin/location_managers', name: 'Location Managers', component: LocationManagers, meta: { adminOnly: true }},
				{path: 'admin/OMA_users', name: 'OMA Users', component: OMAUsers, meta: { adminOnly: true }},
				{path: 'admin/store_app_users', name: 'Store App Users', component: StoreAppUsers, meta: { adminOnly: true }},

				// Approvals, Roles and Permissions routes
				{path: 'approvals/roles', name: 'Roles', component: Roles, meta: { adminOnly: true }},
				{path: 'approvals/permissions', name: 'Permissions', component: Permissions, meta: { adminOnly: true }},
				{path: 'approvals/modules', name: 'Modules', component: Modules, meta: { adminOnly: true }},
				{path: 'approvals/approvals', name: 'Approvals', component: Approvals, meta: { adminOnly: true }},
				// store manager routes
				{path: 'store_manager', redirect: 'store_manager/create_new', meta: { adminOnly: true }},
				{path: 'store_manager/create_new', name: 'Create New Store', component: CreateNewStore, meta: { adminOnly: true }},
				{path: 'store_manager/edit_store/:store_id', name: 'Edit Store', component: EditStore, meta: { adminOnly: false }},
				{path: 'store_manager/stores', name: 'Stores', component: StoreList, meta: { adminOnly: false }},
				{path: 'store_manager/amenities', name: 'Amenities', component: Amenities, meta: { adminOnly: false }},
				{path: 'store_manager/store_groups', name: 'Store Groups', component: StoreGroups, meta: { adminOnly: true }},
				{path: 'store_manager/order_settings', name: 'OrderSettings', component: OrderSettings, meta: { adminOnly: false }},
				// user manager routes
				{path: 'user_manager', redirect: 'user_manager/users', meta: { adminOnly: true }},
				{path: 'user_manager/users', name: 'Users', component: UserList, meta: { adminOnly: true }},
				{path: 'user_manager/users/:user_id', name: 'User Profile', component: UserProfile, meta: { adminOnly: true }},
				{path: 'user_manager/user_groups', name: 'User Groups', component: UserGroups, meta: { adminOnly: true }},
				{path: 'user_manager/user_attributes', name: 'Attributes', component: UserAttributes, meta: { adminOnly: true }},
				// analytics routes
				{path: 'analytics', redirect: 'analytics/overview', meta: { adminOnly: true }},
				{path: 'analytics/overview', name: 'Overview', component: Overview, meta: { adminOnly: true }},
				{path: 'analytics/locationsales', name: 'LocationSales', component: LocationSales, meta: { adminOnly: true }},
				{path: 'analytics/itemsales', name: 'ItemSales', component: ItemSales, meta: { adminOnly: true }},
				{path: 'analytics/useranalytics', name: 'UserAnalytics', component: UserAnalytics, meta: { adminOnly: true }},
				{path: 'localization', name: 'localization', component: Localization, meta: { adminOnly: true }}
			]
		},
		{ path: '*', redirect: '/' }
	],
	scrollBehavior (to, from, savedPosition) {
		return { x: 0, y: 0 }
	}
})

router.beforeEach((to, from, next) => {
	window.scrollTo(0, 0)
	if (to.meta.adminOnly) {
		if (router.app.$root.accountType !== 'application_admin') {
			next({
				path: '/'
			})
		} else {
			next()
		}
	} else {
		next()
	}
})

router.afterEach((to, from, next) => {
	if (to.path !== '/') {
		// eslint-disable-next-line
		sessionStorage.setItem('routePath', to.path)
	}
})

export default router
