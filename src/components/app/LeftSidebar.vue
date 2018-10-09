<template>
	<div class="page-sidebar-wrapper">
		<div class="page-sidebar navbar-collapse collapse">

			<ul class="page-sidebar-menu page-header-fixed"
			    data-keep-expand="false">
				<li v-if="canAny([
						'analytics overview read', 
						'analytics store read', 
						'analytics item read', 
						'analytics user read',
						'analytics order read'
					])"
				    class="nav-item"
				    :class="{'active': currentRoute === 'analytics'}"
				    id="store_manager_link">
					<a class="nav-link nav-toggle unselectable"
					   @click="toggleNavigation($event)">
						<i class="fa fa-line-chart"></i>
						<span class="title">Analytics</span>
						<i class="fa fa-chevron-down pull-right"
						   aria-hidden="true"></i>
					</a>
					<ul class="sub-menu">
						<li v-if="can('analytics overview read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'analytics' && currentSubRoute === 'overview'}"
						    id="store_manager_create_new_link">
							<router-link to="/app/analytics/overview"
							             class="nav-link">
								<i class="fa fa-compress"></i>
								<span class="title">Overview</span>
							</router-link>
						</li>
						<li v-if="can('analytics store read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'analytics' && currentSubRoute === 'locationsales'}"
						    id="store_manager_applications_link">
							<router-link to="/app/analytics/locationsales"
							             class="nav-link">
								<i class="fa fa-map-marker"></i>
								<span class="title">Store Sales</span>
							</router-link>
						</li>
						<li v-if="can('analytics item read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'analytics' && currentSubRoute === 'itemsales'}"
						    id="item_sales_link">
							<router-link to="/app/analytics/itemsales"
							             class="nav-link">
								<i class="fa fa-th-large"></i>
								<span class="title">Item Sales</span>
							</router-link>
						</li>
						<li v-if="can('analytics user read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'analytics' && currentSubRoute === 'useranalytics'}"
						    id="user_analytics_link">
							<router-link to="/app/analytics/useranalytics"
							             class="nav-link">
								<i class="fa fa-users"></i>
								<span class="title">User Analytics</span>
							</router-link>
						</li>
						<li v-if="can('analytics order read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'analytics' && currentSubRoute === 'orders'}"
						    id="order_history_link">
							<router-link to="/app/analytics/orders"
							             class="nav-link">
								<i class="fa fa-list-alt"></i>
								<span class="title">Order History</span>
							</router-link>
						</li>
					</ul>
				</li>
				<li v-if="canAny([
						'approvals read', 
						'approvals request read', 
						'list role', 
						'list permission', 
						'approvals modules read'
					])"
				    class="nav-item"
				    :class="{'active': currentRoute === 'approvals'}"
				    id="admin_manager_link">
					<a class="nav-link nav-toggle unselectable"
					   @click="toggleNavigation($event)">
						<i class="fa fa-check-square-o"></i>
						<span class="title">Approvals Manager
							<i v-if="$root.requestsPending"
							   class="fa fa-circle danger"></i>
						</span>
						<i class="fa fa-chevron-down pull-right"
						   aria-hidden="true"></i>
					</a>
					<ul class="sub-menu">
						<li v-if="canAny(['approvals read', 'approvals request read'])"
						    class="nav-item"
						    :class="{'active': currentRoute === 'approvals' && currentSubRoute === 'approvals'}"
						    id="admin_manager_approvals_link">
							<router-link to="/app/approvals/approvals"
							             class="nav-link">
								<i class="fa fa-check-square-o"></i>
								<span class="title">Approvals</span>
							</router-link>
						</li>
						<li v-if="can('list permission')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'approvals' && currentSubRoute === 'permissions'}"
						    id="admin_manager_permissions_link">
							<router-link to="/app/approvals/permissions"
							             class="nav-link">
								<i class="fa fa-ban"></i>
								<span class="title">Permissions</span>
							</router-link>
						</li>
						<li v-if="can('approvals modules read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'approvals' && currentSubRoute === 'modules'}"
						    id="admin_manager_modules_link">
							<router-link to="/app/approvals/modules"
							             class="nav-link">
								<i class="fa fa-circle-o"></i>
								<span class="title">Modules</span>
							</router-link>
						</li>
						<li v-if="can('list role')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'approvals' && currentSubRoute === 'roles'}"
						    id="admin_manager_roles_link">
							<router-link to="/app/approvals/roles"
							             class="nav-link">
								<i class="fa fa-id-badge"></i>
								<span class="title">Roles</span>
							</router-link>
						</li>
					</ul>
				</li>
				<li v-if="canAny([
						'admin brand_admins read', 
						'admin location_managers read', 
						'admin store_app_users read'
					])"
				    class="nav-item"
				    :class="{'active': currentRoute === 'admin'}"
				    id="admin_manager_link">
					<a class="nav-link nav-toggle unselectable"
					   @click="toggleNavigation($event)">
						<i class="fa fa-cogs"></i>
						<span class="title">Admin Manager</span>
						<i class="fa fa-chevron-down pull-right"
						   aria-hidden="true"></i>
					</a>
					<ul class="sub-menu">
						<li v-if="can('admin brand_admins read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'admin' && currentSubRoute === 'brand_admins'}"
						    id="store_manager_create_new_link">
							<router-link to="/app/admin/brand_admins"
							             class="nav-link">
								<i class="fa fa-user"></i>
								<span class="title">Brand Admins</span>
							</router-link>
						</li>
						<li v-if="can('admin location_managers read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'admin' && currentSubRoute === 'location_managers'}"
						    id="store_manager_create_new_link">
							<router-link to="/app/admin/location_managers"
							             class="nav-link">
								<i class="fa fa-home"></i>
								<span class="title">Location Managers</span>
							</router-link>
						</li>
						<li v-if="can('admin store_app_users read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'admin' && currentSubRoute === 'store_app_users'}"
						    id="store_manager_applications_link">
							<router-link to="/app/admin/store_app_users"
							             class="nav-link">
								<i class="fa fa-tablet"></i>
								<span class="title">Store App Users</span>
							</router-link>
						</li>
					</ul>
				</li>
				<li v-if="canAny([
						'stores info read', 
						'stores info create', 
						'stores groups read', 
						'stores amenities read', 
						'stores order_settings read'
					])"
				    class="nav-item"
				    :class="{'active': currentRoute === 'store_manager'}"
				    id="store_manager_link">
					<a class="nav-link nav-toggle unselectable"
					   @click="toggleNavigation($event)">
						<i class="fa fa-home"></i>
						<span class="title">Stores Manager</span>
						<i class="fa fa-chevron-down pull-right"
						   aria-hidden="true"></i>
					</a>
					<ul class="sub-menu">
						<li v-if="can('stores info create')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'store_manager' && currentSubRoute === 'create_new'}"
						    id="store_manager_create_new_link">
							<router-link to="/app/store_manager/create_new"
							             class="nav-link">
								<i class="fa fa-plus"></i>
								<span class="title">Create New Store</span>
							</router-link>
						</li>
						<li v-if="can('stores groups read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'store_manager' && currentSubRoute === 'store_groups'}"
						    id="store_manager_applications_link">
							<router-link to="/app/store_manager/store_groups"
							             class="nav-link">
								<i class="fa fa-sitemap"></i>
								<span class="title">Store Groups</span>
							</router-link>
						</li>
						<li v-if="can('stores info read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'store_manager' && (currentSubRoute === 'stores' || currentSubRoute === 'edit_store')}"
						    id="store_manager_applications_link">
							<router-link to="/app/store_manager/stores"
							             class="nav-link">
								<i class="fa fa-map-marker"></i>
								<span class="title">Stores</span>
							</router-link>
						</li>
						<li v-if="can('stores amenities read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'store_manager' && currentSubRoute === 'amenities'}"
						    id="store_manager_amenities_link">
							<router-link to="/app/store_manager/amenities"
							             class="nav-link">
								<i class="fa fa-wifi"></i>
								<span class="title">Amenities</span>
							</router-link>
						</li>
						<li v-if="can('stores order_settings read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'store_manager' && currentSubRoute === 'order_settings'}"
						    id="store_manager_order_settings_link">
							<router-link to="/app/store_manager/order_settings"
							             class="nav-link">
								<i class="fa fa-gear"></i>
								<span class="title">Order Settings</span>
							</router-link>
						</li>
						<li v-if="can('stores delivery_hours read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'store_manager' && currentSubRoute === 'delivery_hours'}"
						    id="store_manager_delivery_hours_link">
							<router-link to="/app/store_manager/delivery_hours"
							             class="nav-link">
								<i class="fa fa-clock-o"></i>
								<span class="title">Delivery Hours</span>
							</router-link>
						</li>
						<li v-if="can('stores delivery_profile read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'store_manager' && currentSubRoute === 'delivery_zones'}"
						    id="store_manager_delivery_zones_link">
							<router-link to="/app/store_manager/delivery_zones"
							             class="nav-link">
								<i class="fa fa-truck"></i>
								<span class="title">Delivery Zones</span>
							</router-link>
						</li>
					</ul>
				</li>
				<li v-if="can('news_feed read')"
				    class="nav-item"
				    :class="{'active': currentRoute === 'news_feed'}">
					<router-link to="/app/news_feed"
					             class="nav-link nav-toggle">
						<i class="fa fa-newspaper-o"></i>
						<span class="title">News Feed</span>
					</router-link>
				</li>
				<li v-if="can('social_feed read')"
				    class="nav-item"
				    :class="{'active': currentRoute === 'social_feed'}">
					<router-link to="/app/social_feed"
					             class="nav-link nav-toggle">
						<i class="fa fa-user"></i>
						<span class="title">Social Feed</span>
					</router-link>
				</li>
				<li v-if="canAny([
						'tax tax_classes read', 
						'tax item_types read'
					])"
				    class="nav-item"
				    :class="{'active': currentRoute === 'tax_manager'}"
				    id="tax_manager_link">
					<a class="nav-link nav-toggle unselectable"
					   @click="toggleNavigation($event)">
						<i class="fa fa-calculator"></i>
						<span class="title">Tax Manager</span>
						<i class="fa fa-chevron-down pull-right"
						   aria-hidden="true"></i>
					</a>
					<ul class="sub-menu">
						<li v-if="can('tax tax_classes read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'tax_manager' && currentSubRoute === 'tax_classes'}"
						    id="tax_manager_tax_classes_link">
							<router-link to="/app/tax_manager/tax_classes"
							             class="nav-link">
								<i class="fa fa-bar-chart"></i>
								<span class="title">Tax Classes</span>
							</router-link>
						</li>
						<li v-if="can('tax item_types read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'tax_manager' && currentSubRoute === 'item_types'}"
						    id="tax_manager_item_types_link">
							<router-link to="/app/tax_manager/item_types"
							             class="nav-link">
								<i class="fa fa-glass"></i>
								<span class="title">Item Types</span>
							</router-link>
						</li>
					</ul>
				</li>
				<li v-if="canAny([
						'menu_manager menus read', 
						'menu_manager tiers read', 
						'menu_manager modifiers read', 
						'menu_manager tags read',
						'menu_manager portions read', 
						'menu_manager options read', 
						'menu_manager attributes read'
					])"
				    class="nav-item"
				    :class="{'active': currentRoute === 'menu_manager'}"
				    id="menu_manager_link">
					<a class="nav-link nav-toggle unselectable"
					   @click="toggleNavigation($event)">
						<i class="fa fa-cutlery"></i>
						<span class="title">Menu Manager</span>
						<i class="fa fa-chevron-down pull-right"
						   aria-hidden="true"></i>
					</a>
					<ul class="sub-menu">
						<li v-if="can('menu_manager menus read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'menu_manager' && (currentSubRoute === 'menus' || currentSubRoute === 'categories' || currentSubRoute === 'items')}"
						    id="menu_manager_menus_link">
							<router-link to="/app/menu_manager/menus"
							             class="nav-link">
								<i class="fa fa-file-text-o"></i>
								<span class="title">Menus</span>
							</router-link>
						</li>
						<li v-if="can('menu_manager tiers read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'menu_manager' && currentSubRoute === 'menu_tiers'}"
						    id="menu_manager_menu_tiers_link">
							<router-link to="/app/menu_manager/menu_tiers"
							             class="nav-link">
								<i class="fa fa-sitemap"></i>
								<span class="title">Menu Tiers</span>
							</router-link>
						</li>
						<li v-if="can('menu_manager modifiers read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'menu_manager' && (currentSubRoute === 'modifiers' || currentSubRoute === 'modifier_items')}"
						    id="menu_manager_modifiers_link">
							<router-link to="/app/menu_manager/modifiers"
							             class="nav-link">
								<i class="fa fa-cogs"></i>
								<span class="title">Modifiers</span>
							</router-link>
						</li>
						<li v-if="can('menu_manager modifier_tiers read')"
						    class="nav-item"
						    v-bind:class="{'active': currentRoute === 'menu_manager' && currentSubRoute === 'modifier_tiers'}"
						    id="menu_manager_modifier_tiers_link">
							<router-link to="/app/menu_manager/modifier_tiers"
							             class="nav-link">
								<i class="fa fa-sitemap"></i>
								<span class="title">Modifier Tiers</span>
							</router-link>
						</li>
						<li v-if="can('menu_manager tags read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'menu_manager' && currentSubRoute === 'tags'}"
						    id="menu_manager_tags_link">
							<router-link to="/app/menu_manager/tags"
							             class="nav-link">
								<i class="fa fa-tags"></i>
								<span class="title">Tags</span>
							</router-link>
						</li>
						<li v-if="can('menu_manager portions read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'menu_manager' && currentSubRoute === 'portions'}"
						    id="menu_manager_portions_link">
							<router-link to="/app/menu_manager/portions"
							             class="nav-link">
								<i class="fa fa-pie-chart"></i>
								<span class="title">Portions</span>
							</router-link>
						</li>
						<li v-if="can('menu_manager options read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'menu_manager' && currentSubRoute === 'options'}"
						    id="menu_manager_options_link">
							<router-link to="/app/menu_manager/options"
							             class="nav-link">
								<i class="fa fa-list-ul"></i>
								<span class="title">Options</span>
							</router-link>
						</li>
						<li v-if="can('menu_manager attributes read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'menu_manager' && currentSubRoute === 'item_attributes'}"
						    id="menu_manager_item_attributes_link">
							<router-link to="/app/menu_manager/item_attributes"
							             class="nav-link">
								<i class="fa fa-sticky-note-o"></i>
								<span class="title">Attributes</span>
							</router-link>
						</li>
					</ul>
				</li>
				<li v-if="can('printers read')"
				    class="nav-item"
				    :class="{'active': currentRoute === 'printers'}"
				    id="printers_link">
					<router-link :to="'/app/printers'"
					             class="nav-link nav-toggle">
						<i class="icon-printer"></i>
						<span class="title">Printers</span>
					</router-link>
				</li>
				<li v-if="canAny([
						'user_manager users read',
						'user_manager user_groups read',
						'user_manager attributes read'
					])"
				    class="nav-item"
				    :class="{'active': currentRoute === 'user_manager'}"
				    id="user_manager_link">
					<a class="nav-link nav-toggle unselectable"
					   @click="toggleNavigation($event)">
						<i class="fa fa-users"></i>
						<span class="title">Users Manager</span>
						<i class="fa fa-chevron-down pull-right"
						   aria-hidden="true"></i>
					</a>
					<ul class="sub-menu">
						<li v-if="can('user_manager users read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'user_manager' && currentSubRoute === 'users'}"
						    id="user_manager_applications_link">
							<router-link to="/app/user_manager/users"
							             class="nav-link">
								<i class="fa fa-user"></i>
								<span class="title">Users</span>
							</router-link>
						</li>
						<li v-if="can('user_manager user_groups read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'user_manager' && currentSubRoute === 'user_groups'}"
						    id="user_manager_applications_link">
							<router-link to="/app/user_manager/user_groups"
							             class="nav-link">
								<i class="fa fa-sitemap"></i>
								<span class="title">User Groups</span>
							</router-link>
						</li>
						<li v-if="can('user_manager attributes read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'user_manager' && currentSubRoute === 'user_attributes'}"
						    id="user_attributes_applications_link">
							<router-link to="/app/user_manager/user_attributes"
							             class="nav-link">
								<i class="fa fa-sticky-note-o"></i>
								<span class="title">Attributes</span>
							</router-link>
						</li>
					</ul>
				</li>
				<li v-if="canAny([
						'faq user read',
						'faq store read'
					])"
				    class="nav-item"
				    :class="{'active': currentRoute === 'faq'}"
				    id="faq_link">
					<a class="nav-link nav-toggle unselectable"
					   @click="toggleNavigation($event)">
						<i class="fa fa-comments"></i>
						<span class="title">FAQ</span>
						<i class="fa fa-chevron-down pull-right"
						   aria-hidden="true"></i>
					</a>
					<ul class="sub-menu">
						<li v-if="can('faq user read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'faq' && currentSubRoute === 'users'}"
						    id="faq_users_link">
							<router-link to="/app/faq/users"
							             class="nav-link">
								<i class="fa fa-user"></i>
								<span class="title">Users</span>
							</router-link>
						</li>
						<li v-if="can('faq store read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'faq' && currentSubRoute === 'stores'}"
						    id="faq_stores_link">
							<router-link to="/app/faq/stores"
							             class="nav-link">
								<i class="fa fa-map-marker"></i>
								<span class="title">Stores</span>
							</router-link>
						</li>
					</ul>
				</li>
				<li v-if="can('gallery read')"
				    class="nav-item"
				    :class="{'active': currentRoute === 'gallery'}">
					<router-link to="/app/gallery"
					             class="nav-link nav-toggle">
						<i class="fa fa-image"></i>
						<span class="title">Gallery</span>
					</router-link>
				</li>
				<li v-if="canAny([
						'loyalty base_rule read',
						'loyalty promotion_rules read',
						'reward_tiers read'
					])"
				    class="nav-item"
				    :class="{'active': currentRoute === 'loyalty'}"
				    id="loyalty_link">
					<a class="nav-link nav-toggle unselectable"
					   @click="toggleNavigation($event)">
						<i class="fa fa-link"></i>
						<span class="title">Loyalty</span>
						<i class="fa fa-chevron-down pull-right"
						   aria-hidden="true"></i>
					</a>
					<ul class="sub-menu">
						<li v-if="can('loyalty base_rule read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'loyalty' && currentSubRoute === 'base_rule'}"
						    id="faq_users_link">
							<router-link to="/app/loyalty/base_rule"
							             class="nav-link">
								<i class="fa fa-paperclip"></i>
								<span class="title">Base Rule</span>
							</router-link>
						</li>
						<li v-if="can('loyalty promotion_rules read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'loyalty' && currentSubRoute === 'promotion_rules'}"
						    id="faq_users_link">
							<router-link to="/app/loyalty/promotion_rules"
							             class="nav-link">
								<i class="fa fa-list-ol"></i>
								<span class="title">Promotion Rules</span>
							</router-link>
						</li>
						<li v-if="can('reward_tiers read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'loyalty' && currentSubRoute === 'rewards'}"
						    id="faq_users_link">
							<router-link to="/app/loyalty/rewards"
							             class="nav-link">
								<i class="fa fa-gift"></i>
								<span class="title">Rewards</span>
							</router-link>
						</li>
					</ul>
				</li>
				<li v-if="can('promocodes read')"
				    class="nav-item"
				    :class="{'active': currentRoute === 'promocodes'}">
					<router-link to="/app/promocodes"
					             class="nav-link nav-toggle">
						<i class="fa fa-scissors"></i>
						<span class="title">Promo codes</span>
					</router-link>
				</li>
				<li v-if="canAny(['promotions read', 'promotions geolocations read'])"
				    class="nav-item"
				    :class="{'active': currentRoute === 'promotions'}"
				    id="promotions_manager_link">
					<a class="nav-link nav-toggle unselectable"
					   @click="toggleNavigation($event)">
						<i class="fa fa-money"></i>
						<span class="title">Promotions Manager</span>
						<i class="fa fa-chevron-down pull-right"
						   aria-hidden="true"></i>
					</a>
					<ul class="sub-menu">
						<li v-if="can('promotions read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'promotions' && currentSubRoute === ''}"
						    id="promotions_manager_promotions_link">
							<router-link to="/app/promotions"
							             class="nav-link">
								<i class="fa fa-money"></i>
								<span class="title">Promotions</span>
							</router-link>
						</li>
						<li v-if="can('promotions geolocations read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'promotions' && currentSubRoute === 'geolocations'}"
						    id="promotions_manager_geolocations_link">
							<router-link to="/app/promotions/geolocations"
							             class="nav-link">
								<i class="fa fa-compass"></i>
								<span class="title">Geolocations</span>
							</router-link>
						</li>
					</ul>
				</li>
				<li v-if="canAny([
						'localization read',
						'localization languages read',
						'localization countries read'
					])"
				    class="nav-item"
				    :class="{'active': currentRoute === 'localization'}"
				    id="localization_link">
					<a class="nav-link nav-toggle unselectable"
					   @click="toggleNavigation($event)">
						<i class="fa fa-link"></i>
						<span class="title">Localization</span>
						<i class="fa fa-chevron-down pull-right"
						   aria-hidden="true"></i>
					</a>
					<ul class="sub-menu">
						<li v-if="can('localization countries read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'localization' && currentSubRoute === 'countries'}"
						    id="localization_countries_link">
							<router-link to="/app/localization/countries"
							             class="nav-link">
								<i class="fa fa-flag-o"></i>
								<span class="title">Countries</span>
							</router-link>
						</li>
						<li v-if="can('localization platforms read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'localization' && currentSubRoute === 'platforms'}"
						    id="localization_platforms_link">
							<router-link to="/app/localization/platforms"
							             class="nav-link">
								<i class="fa fa-mobile"></i>
								<span class="title">Platforms</span>
							</router-link>
						</li>
						<li v-if="can('localization languages read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'localization' && currentSubRoute === 'languages'}"
						    id="localization_languages_link">
							<router-link to="/app/localization/languages"
							             class="nav-link">
								<i class="fa fa-language"></i>
								<span class="title">Languages</span>
							</router-link>
						</li>
						<li v-if="can('localization locale_regions read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'localization' && currentSubRoute === 'language_regions'}"
						    id="localization_language_regions_link">
							<router-link to="/app/localization/language_regions"
							             class="nav-link">
								<i class="fa fa-globe"></i>
								<span class="title">Language Regions</span>
							</router-link>
						</li>
						<li v-if="can('localization read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'localization' && currentSubRoute === 'terms'}"
						    id="localization_terms_link">
							<router-link to="/app/localization/terms"
							             class="nav-link">
								<i class="fa fa-comment-o"></i>
								<span class="title">Terms</span>
							</router-link>
						</li>
						<li v-if="can('localization read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'localization' && currentSubRoute === 'ecomm'}"
						    id="localization_admin_link">
							<router-link to="/app/localization/ecomm"
							             class="nav-link">
								<i class="fa fa-bars"></i>
								<span class="title">eComm Data</span>
							</router-link>
						</li>
						<li v-if="can('localization read')"
						    class="nav-item"
						    :class="{'active': currentRoute === 'localization' && currentSubRoute === 'custom'}"
						    id="localization_static_link">
							<router-link to="/app/localization/custom"
							             class="nav-link">
								<i class="fa fa-bars"></i>
								<span class="title">Custom Data</span>
							</router-link>
						</li>
					</ul>
				</li>
				<li class="nav-item">
					<a class="nav-link nav-toggle">
						<i class=""></i>
						<span class="title"></span>
					</a>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
import $ from 'jquery'
import { mapGetters } from 'vuex'
import ApprovalsFunctions from '@/controllers/Approvals'

export default {
	name: 'left-sidebar',
	data: () => ({
		currentRoute: '',
		currentSubRoute: ''
	}),
	computed: {
		...mapGetters(['can', 'canAny'])
	},
	watch: {
		/**
		 * Watch `$route` so that we can reset the current route on change.
		 * @function
		 * @returns {undefined}
		 */
		$route () {
			this.setCurrentRoute()
		}
	},
	created () {
		this.setCurrentRoute()
		this.getRequests()
	},
	methods: {
		/**
		 * To get a list of pending requests.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getRequests () {
			var appVue = this
			let pagination = {
				page: 1,
				records_per_page: 1,
				status: 0
			}
			return ApprovalsFunctions.getRequests(pagination)
				.then(response => {
					if (response.payload.docs.length) {
						appVue.$root.requestsPending = true
					} else {
						appVue.$root.requestsPending = false
					}
				})
				.catch(reason => {})
		},
		/**
		 * To set the name of the current route and sub route for selecting active navigation.
		 * @function
		 * @returns {undefined}
		 */
		setCurrentRoute () {
			if (this.$route) {
				var firstIndex = this.$route.path.indexOf('/', 1)
				var secondIndex = this.$route.path.indexOf('/', firstIndex + 1)

				if (secondIndex === -1) {
					secondIndex = this.$route.path.length
				}
				this.currentRoute = this.$route.path.substring(
					firstIndex + 1,
					secondIndex
				)

				if (secondIndex < this.$route.path.length - 1) {
					var thirdIndex = this.$route.path.indexOf(
						'/',
						secondIndex + 1
					)
					if (thirdIndex === -1) {
						thirdIndex = this.$route.path.length
					}
					this.currentSubRoute = this.$route.path.substring(
						secondIndex + 1,
						thirdIndex
					)
				} else {
					this.currentSubRoute = ''
				}
			}
		},
		/**
		 * To toggle whether or not a submenu should be toggled open.
		 * @function
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		toggleNavigation (event) {
			var target = $(event.target).closest('.nav-item')
			if (!target.hasClass('active')) {
				// Active menus can't be closed
				if (target.hasClass('open')) {
					target.removeClass('open')
					target.find('.arrow').removeClass('open')
				} else {
					target.addClass('open')
					target.find('.arrow').addClass('open')
				}
			}
		}
	}
}
</script>

<style>
.page-sidebar-menu-closed .fa-chevron-down:before {
	display: none;
}
</style>
