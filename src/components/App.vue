<template>
	<div class="page-wrapper">
		<loading-screen :show="displayLoadingScreen" :appBackground="true" :autoStop="true" @stopLoadingScreen="displayLoadingScreen = false"></loading-screen>
		<!-- BEGIN HEADER -->
		<div class="page-header navbar navbar-fixed-top">
			<!-- BEGIN HEADER INNER -->
			<div class="page-header-inner">
				<div class="page-logo">
					<a>
						<img src="../assets/img/app/unoapp-commerce-logo.png" alt="logo" class="logo-default logo-unoapp" />
					</a>
					<div class="menu-toggler sidebar-toggler">
						<span></span>
					</div>
				</div>
				<!-- END LOGO -->
				<!-- BEGIN RESPONSIVE MENU TOGGLER -->
				<a href="javascript:;" class="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse">
					<span></span>
				</a>
				<!-- END RESPONSIVE MENU TOGGLER -->
				<!-- BEGIN TOP NAVIGATION MENU -->
				<div class="top-menu">
					<ul class="nav navbar-nav pull-right"><!-- BEGIN USER LOGIN DROPDOWN -->
						<li class="dropdown dropdown-user left" @click="logOut()">
						   <a href="javascript:;" class="dropdown-toggle log-out-button">
						   	<span class="username username-hide-on-mobile">Log out</span>
						   </a>
						</li>
						<!-- END USER LOGIN DROPDOWN -->
						<!-- BEGIN QUICK SIDEBAR TOGGLER -->
						<li class="dropdown dropdown-quick-sidebar-toggler width-auto" @click="toggleQuickSidebar($event)">
							<a class="dropdown-toggle location-panel width-auto">
								<div class="logo-container">
									<img class="business-logo" src="../assets/img/app/logo-refresh.png" width="38" height="38">
								</div>
								<div class="location-name-container" v-if="activeLocation.display_name">
									<span class="business-name">{{$root.activeUser.name}}</span>
									<span class="business-location-name">{{activeLocation.display_name}}</span>
								</div>
								<div class="location-name-container" v-else>
									<span class="business-name big">{{$root.activeUser.name}}</span>
								</div>
							</a>
						</li>
						<!-- END QUICK SIDEBAR TOGGLER -->
					</ul>
				</div>
				<!-- END TOP NAVIGATION MENU -->
			</div>
			<!-- END HEADER INNER -->
		</div>
		<!-- END HEADER -->
		<!-- BEGIN HEADER & CONTENT DIVIDER -->
		<div class="clearfix"> </div>
		<!-- END HEADER & CONTENT DIVIDER -->
		<!-- BEGIN CONTAINER -->
		<div class="page-container">
			<!-- BEGIN SIDEBAR -->
			<div class="page-sidebar-wrapper">
				<!-- NOTE: Set data-auto-scroll="false" to disable the sidebar from auto scrolling/focusing -->
				<!-- NOTE: Change data-auto-speed="200" to adjust the sub menu slide up/down speed -->
				<div class="page-sidebar navbar-collapse collapse">
					<!-- NOTE: Apply "page-sidebar-menu-light" class right after "page-sidebar-menu" to enable light sidebar menu style(without borders) -->
					<!-- NOTE: Apply "page-sidebar-menu-hover-submenu" class right after "page-sidebar-menu" to enable hoverable(hover vs accordion) sub menu mode -->
					<!-- NOTE: Apply "page-sidebar-menu-closed" class right after "page-sidebar-menu" to collapse("page-sidebar-closed" class must be applied to the body element) the sidebar sub menu mode -->
					<!-- NOTE: Set data-auto-scroll="false" to disable the sidebar from auto scrolling/focusing -->
					<!-- NOTE: Set data-keep-expand="true" to keep the submenues expanded -->
					<!-- NOTE: Set data-auto-speed="200" to adjust the sub menu slide up/down speed -->
					<ul class="page-sidebar-menu page-header-fixed" data-keep-expand="false">
						<li class="heading" v-if="$root.accountType === 'application_admin'">
							<h3 class="uppercase">Application Admin Tools</h3>
						</li>
						<li class="heading" v-if="$root.accountType === 'store_admin'">
							<h3 class="uppercase">Store Admin Tools</h3>
						</li>
						<li class="nav-item" v-bind:class="{'active': currentRoute === 'analytics'}" id="store_manager_link" v-if="$root.accountType === 'application_admin'">
							<router-link to="/app/analytics/overview" class="nav-link nav-toggle unselectable" @click="toggleNavigation($event)">
								<i class="fa fa-line-chart"></i>
								<span class="title">Analytics</span>
								<span class="arrow"></span>
							</router-link>
							<ul class="sub-menu">
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'analytics' && currentSubRoute === 'overview'}" id="store_manager_create_new_link">
									<router-link to="/app/analytics/overview" class="nav-link">
										<i class="fa fa-compress"></i>
										<span class="title">Overview</span>
									</router-link>
								</li>
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'analytics' && currentSubRoute === 'locationsales'}" id="store_manager_applications_link">
									<router-link to="/app/analytics/locationsales" class="nav-link">
										<i class="fa fa-map-marker"></i>
										<span class="title">Store Sales</span>
									</router-link>
								</li>
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'analytics' && currentSubRoute === 'itemsales'}" id="item_sales_link">
									<router-link to="/app/analytics/itemsales" class="nav-link">
										<i class="fa fa-th-large"></i>
										<span class="title">Item Sales</span>
									</router-link>
								</li>
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'analytics' && currentSubRoute === 'useranalytics'}" id="user_analytics_link">
									<router-link to="/app/analytics/useranalytics" class="nav-link">
										<i class="fa fa-users"></i>
										<span class="title">User Analytics</span>
									</router-link>
								</li>
							</ul>
						</li>
						<li class="nav-item" v-bind:class="{'active': currentRoute === 'approvals'}" id="admin_manager_link" v-if="$root.accountType === 'application_admin'">
							<router-link to="/app/approvals/approvals" class="nav-link nav-toggle unselectable" @click="toggleNavigation($event)">
								<i class="fa fa-check-square-o"></i>
								<span class="title">Approvals Manager
									<i v-if="$root.requestsPending" class="fa fa-circle danger"></i>
								</span>
							</router-link>
							<ul class="sub-menu">
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'approvals' && currentSubRoute === 'approvals'}" id="admin_manager_approvals_link">
									<router-link to="/app/approvals/approvals" class="nav-link">
										<i class="fa fa-check-square-o"></i>
										<span class="title">Approvals</span>
									</router-link>
								</li>
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'approvals' && currentSubRoute === 'roles'}" id="admin_manager_roles_link">
									<router-link to="/app/approvals/roles" class="nav-link">
										<i class="fa fa-id-badge"></i>
										<span class="title">Roles</span>
									</router-link>
								</li>
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'approvals' && currentSubRoute === 'permissions'}" id="admin_manager_permissions_link">
									<router-link to="/app/approvals/permissions" class="nav-link">
										<i class="fa fa-ban"></i>
										<span class="title">Permissions</span>
									</router-link>
								</li>
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'approvals' && currentSubRoute === 'modules'}" id="admin_manager_modules_link">
									<router-link to="/app/approvals/modules" class="nav-link">
										<i class="fa fa-circle-o"></i>
										<span class="title">Modules</span>
									</router-link>
								</li>
							</ul>
						</li>
						<li class="nav-item" v-bind:class="{'active': currentRoute === 'admin'}" id="admin_manager_link" v-if="$root.accountType === 'application_admin'">
							<router-link to="/app/admin/brand_admins" class="nav-link nav-toggle unselectable" @click="toggleNavigation($event)">
								<i class="fa fa-cogs"></i>
								<span class="title">Admin Manager</span>
							</router-link>
							<ul class="sub-menu">
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'admin' && currentSubRoute === 'brand_admins'}" id="store_manager_create_new_link">
									<router-link to="/app/admin/brand_admins" class="nav-link">
										<i class="fa fa-user"></i>
										<span class="title">Brand Admins</span>
									</router-link>
								</li>
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'admin' && currentSubRoute === 'location_managers'}" id="store_manager_create_new_link">
									<router-link to="/app/admin/location_managers" class="nav-link">
										<i class="fa fa-home"></i>
										<span class="title">Location Managers</span>
									</router-link>
								</li>
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'admin' && currentSubRoute === 'OMA_users'}" id="store_manager_applications_link">
									<router-link to="/app/admin/OMA_users" class="nav-link">
										<i class="fa fa-bar-chart"></i>
										<span class="title">OMA Users</span>
									</router-link>
								</li>
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'admin' && currentSubRoute === 'store_app_users'}" id="store_manager_applications_link">
									<router-link to="/app/admin/store_app_users" class="nav-link">
										<i class="fa fa-tablet"></i>
										<span class="title">Store App Users</span>
									</router-link>
								</li>
							</ul>
						</li>
						<li class="nav-item" v-bind:class="{'active': currentRoute === 'store_manager'}" id="store_manager_link" v-if="$root.accountType === 'application_admin'">
							<router-link to="/app/store_manager/create_new" class="nav-link nav-toggle unselectable" @click="toggleNavigation($event)">
								<i class="fa fa-home"></i>
								<span class="title">Stores Manager</span>
								<span class="arrow"></span>
							</router-link>
							<ul class="sub-menu">
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'store_manager' && currentSubRoute === 'create_new'}" id="store_manager_create_new_link">
									<router-link to="/app/store_manager/create_new" class="nav-link">
										<i class="fa fa-plus"></i>
										<span class="title">Create New Store</span>
									</router-link>
								</li>
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'store_manager' && currentSubRoute === 'store_groups'}" id="store_manager_applications_link">
									<router-link to="/app/store_manager/store_groups" class="nav-link">
										<i class="fa fa-sitemap"></i>
										<span class="title">Store Groups</span>
									</router-link>
								</li>
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'store_manager' && (currentSubRoute === 'stores' || currentSubRoute === 'edit_store')}" id="store_manager_applications_link">
									<router-link to="/app/store_manager/stores" class="nav-link">
										<i class="fa fa-map-marker"></i>
										<span class="title">Stores</span>
									</router-link>
								</li>
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'store_manager' && currentSubRoute === 'amenities'}" id="store_manager_amenities_link">
									<router-link to="/app/store_manager/amenities" class="nav-link">
										<i class="fa fa-wifi"></i>
										<span class="title">Amenities</span>
									</router-link>
								</li>
							</ul>
						</li>
						<li class="nav-item" v-bind:class="{'active': currentRoute === 'store_manager'}" id="store_manager_link" v-if="$root.accountType === 'store_admin'">
							<router-link :to="'/app/store_manager/stores'" class="nav-link nav-toggle">
								<i class="fa fa-dashboard"></i>
								<span class="title">Store Manager</span>
								<span class="selected"></span>
							</router-link>
						</li>
						<li class="nav-item" v-bind:class="{'active': currentRoute === 'news_feed'}" v-if="$root.accountType === 'application_admin'">
							<router-link to="/app/news_feed" class="nav-link nav-toggle">
								<i class="fa fa-newspaper-o"></i>
								<span class="title">News Feed</span>
								<span class="selected"></span>
							</router-link>
						</li>
						<li class="nav-item" v-bind:class="{'active': currentRoute === 'social_feed'}" v-if="$root.accountType === 'application_admin'">
							<router-link to="/app/social_feed" class="nav-link nav-toggle">
								<i class="fa fa-user"></i>
								<span class="title">Social Feed</span>
								<span class="selected"></span>
							</router-link>
						</li>
						<li class="nav-item" v-bind:class="{'active': currentRoute === 'tax_manager'}" id="tax_manager_link">
							<router-link to="/app/tax_manager" class="nav-link nav-toggle unselectable" @click="toggleNavigation($event)">
								<i class="fa fa-calculator"></i>
								<span class="title">Tax Manager</span>
								<span class="arrow"></span>
							</router-link>
							<ul class="sub-menu">
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'tax_manager' && currentSubRoute === 'tax_classes'}" id="tax_manager_tax_classes_link">
									<router-link to="/app/tax_manager/tax_classes" class="nav-link">
										<i class="fa fa-bar-chart"></i>
										<span class="title">Tax Classes</span>
									</router-link>
								</li>
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'tax_manager' && currentSubRoute === 'item_types'}" id="tax_manager_item_types_link">
									<router-link to="/app/tax_manager/item_types" class="nav-link">
										<i class="fa fa-glass"></i>
										<span class="title">Item Types</span>
									</router-link>
								</li>
							</ul>
						</li>
						<li class="nav-item" v-bind:class="{'active': currentRoute === 'menu_manager'}" id="menu_manager_link">
							<router-link to="/app/menu_manager/menus" class="nav-link nav-toggle unselectable" @click="toggleNavigation($event)">
								<i class="fa fa-cutlery"></i>
								<span class="title">Menu Manager</span>
								<span class="arrow"></span>
							</router-link>
							<ul class="sub-menu">
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'menu_manager' && (currentSubRoute === 'menus' || currentSubRoute === 'categories' || currentSubRoute === 'items')}" id="menu_manager_menus_link">
									<router-link to="/app/menu_manager/menus" class="nav-link">
										<i class="fa fa-file-text-o"></i>
										<span class="title">Menus</span>
									</router-link>
								</li>
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'menu_manager' && currentSubRoute === 'menu_tiers'}" id="menu_manager_menu_tiers_link">
									<router-link to="/app/menu_manager/menu_tiers" class="nav-link">
										<i class="fa fa-sitemap"></i>
										<span class="title">Menu Tiers</span>
									</router-link>
								</li>
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'menu_manager' && (currentSubRoute === 'modifiers' || currentSubRoute === 'modifier_items')}" id="menu_manager_modifiers_link">
									<router-link to="/app/menu_manager/modifiers" class="nav-link">
										<i class="fa fa-cogs"></i>
										<span class="title">Modifiers</span>
									</router-link>
								</li>
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'menu_manager' && currentSubRoute === 'tags'}" id="menu_manager_tags_link">
									<router-link to="/app/menu_manager/tags" class="nav-link">
										<i class="fa fa-tags"></i>
										<span class="title">Tags</span>
									</router-link>
								</li>
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'menu_manager' && currentSubRoute === 'portions'}" id="menu_manager_portions_link">
									<router-link to="/app/menu_manager/portions" class="nav-link">
										<i class="fa fa-pie-chart"></i>
										<span class="title">Portions</span>
									</router-link>
								</li>
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'menu_manager' && currentSubRoute === 'options'}" id="menu_manager_options_link">
									<router-link to="/app/menu_manager/options" class="nav-link">
										<i class="fa fa-list-ul"></i>
										<span class="title">Options</span>
									</router-link>
								</li>
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'menu_manager' && currentSubRoute === 'item_attributes'}" id="menu_manager_item_attributes_link">
									<router-link to="/app/menu_manager/item_attributes" class="nav-link">
										<i class="fa fa-sticky-note-o"></i>
										<span class="title">Attributes</span>
									</router-link>
								</li>
							</ul>
						</li>
						<li class="nav-item" v-bind:class="{'active': currentRoute === 'printers'}" id="printers_link">
							<router-link :to="'/app/printers'" class="nav-link nav-toggle">
								<i class="icon-printer"></i>
								<span class="title">Printers</span>
								<span class="selected"></span>
							</router-link>
						</li>
						<li class="nav-item" v-bind:class="{'active': currentRoute === 'user_manager'}" id="user_manager_link" v-if="$root.accountType === 'application_admin'">
							<router-link to="/app/user_manager/users" class="nav-link nav-toggle unselectable" @click="toggleNavigation($event)">
								<i class="fa fa-users"></i>
								<span class="title">Users Manager</span>
								<span class="arrow"></span>
							</router-link>
							<ul class="sub-menu">
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'user_manager' && currentSubRoute === 'users'}" id="user_manager_applications_link">
									<router-link to="/app/user_manager/users" class="nav-link">
										<i class="fa fa-user"></i>
										<span class="title">Users</span>
									</router-link>
								</li>
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'user_manager' && currentSubRoute === 'user_groups'}" id="user_manager_applications_link">
									<router-link to="/app/user_manager/user_groups" class="nav-link">
										<i class="fa fa-sitemap"></i>
										<span class="title">User Groups</span>
									</router-link>
								</li>
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'user_manager' && currentSubRoute === 'user_attributes'}" id="user_attributes_applications_link">
									<router-link to="/app/user_manager/user_attributes" class="nav-link">
										<i class="fa fa-sticky-note-o"></i>
										<span class="title">Attributes</span>
									</router-link>
								</li>
							</ul>
						</li>
						<li class="nav-item" v-bind:class="{'active': currentRoute === 'faq'}" id="faq_link" v-if="$root.accountType === 'application_admin'">
							<router-link to="/app/faq/users" class="nav-link nav-toggle unselectable" @click="toggleNavigation($event)">
								<i class="fa fa-comments"></i>
								<span class="title">FAQ</span>
								<span class="arrow"></span>
							</router-link>
							<ul class="sub-menu">
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'faq' && currentSubRoute === 'users'}" id="faq_users_link">
									<router-link to="/app/faq/users" class="nav-link">
										<i class="fa fa-user"></i>
										<span class="title">Users</span>
									</router-link>
								</li>
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'faq' && currentSubRoute === 'stores'}" id="faq_stores_link">
									<router-link to="/app/faq/stores" class="nav-link">
										<i class="fa fa-map-marker"></i>
										<span class="title">Stores</span>
									</router-link>
								</li>
							</ul>
						</li>
						<li class="nav-item" v-bind:class="{'active': currentRoute === 'gallery'}">
							<router-link to="/app/gallery" class="nav-link nav-toggle">
								<i class="fa fa-image"></i>
								<span class="title">Gallery</span>
								<span class="selected"></span>
							</router-link>
						</li>
						<li class="nav-item" v-bind:class="{'active': currentRoute === 'loyalty'}" id="loyalty_link" v-if="$root.accountType === 'application_admin'">
							<router-link to="/app/loyalty" class="nav-link nav-toggle unselectable" @click="toggleNavigation($event)">
								<i class="fa fa-link"></i>
								<span class="title">Loyalty</span>
								<span class="selected"></span>
							</router-link>
							<ul class="sub-menu">
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'loyalty' && currentSubRoute === 'base_rule'}" id="faq_users_link">
									<router-link to="/app/loyalty/base_rule" class="nav-link">
										<i class="fa fa-paperclip"></i>
										<span class="title">Base Rule</span>
									</router-link>
								</li>
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'loyalty' && currentSubRoute === 'promotion_rules'}" id="faq_users_link">
									<router-link to="/app/loyalty/promotion_rules" class="nav-link">
										<i class="fa fa-list-ol"></i>
										<span class="title">Promotion Rules</span>
									</router-link>
								</li>
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'loyalty' && currentSubRoute === 'rewards'}" id="faq_users_link">
									<router-link to="/app/loyalty/rewards" class="nav-link">
										<i class="fa fa-gift"></i>
										<span class="title">Rewards</span>
									</router-link>
								</li>
							</ul>
						</li>
						<li class="nav-item" v-bind:class="{'active': currentRoute === 'promocodes'}" v-if="$root.accountType === 'application_admin'">
							<router-link to="/app/promocodes" class="nav-link nav-toggle">
								<i class="fa fa-scissors"></i>
								<span class="title">Promo codes</span>
								<span class="selected"></span>
							</router-link>
						</li>
						<li class="nav-item" v-bind:class="{'active': currentRoute === 'promotions'}" v-if="$root.accountType === 'application_admin'">
							<router-link to="/app/promotions" class="nav-link nav-toggle">
								<i class="fa fa-money"></i>
								<span class="title">Promotions</span>
								<span class="arrow"></span>
							</router-link>
							<ul class="sub-menu">
								<li class="nav-item" v-bind:class="{'active': currentRoute === 'promotions' && currentSubRoute === 'geolocations'}" id="promotions_geolocations_link">
									<router-link to="/app/promotions/geolocations" class="nav-link">
										<i class="fa fa-compass"></i>
										<span class="title">Geolocations</span>
									</router-link>
								</li>
							</ul>
						</li>
						<li class="nav-item" v-bind:class="{'active': currentRoute === 'localization'}" v-if="$root.accountType === 'application_admin'">
							<router-link to="/app/localization" class="nav-link nav-toggle">
								<i class="fa fa-language"></i>
								<span class="title">Localization</span>
								<span class="selected"></span>
							</router-link>
						</li>
					</ul>
				</div>
			</div>
			<!-- END SIDEBAR -->
			<!-- BEGIN CONTENT -->
			<div class="page-content-wrapper">
				<!-- BEGIN CONTENT BODY -->
				<div class="page-content">
					<router-view></router-view>
				</div>
			</div>
			<!-- BEGIN QUICK SIDEBAR -->
			<div class="page-quick-sidebar-wrapper" data-close-on-body-click="false">
				<a class="page-quick-sidebar-toggler" @click="toggleQuickSidebar($event)">
					<span class="icon-close"></span>
				</a>
				<div class="page-quick-sidebar">
					<div>
						<div class="tab-content">
							<div class="tab-pane active page-quick-sidebar-chat">
								<div class="page-quick-sidebar-chat-users active-business" data-rail-color="#ddd" data-wrapper-class="page-quick-sidebar-list">
									<ul class="media-list list-items">
										<li class="media selected-location current-location">
											<img class="media-object" src="../assets/img/app/logo-refresh.png" alt="...">
											<div class="media-status" v-if="!activeLocation.display_name">
												<i class="fa fa-circle"></i>
											</div>
											<div class="media-status deactivate-location-dot-top" v-if="activeLocation.display_name" @click="unselectLocation($event)">
												<i class="fa fa-times-circle"></i>
											</div>
											<div class="media-body">
												<h4 class="media-heading">{{ $root.activeUser.name }}</h4>
												<div class="media-heading-sub" v-if="!activeLocation.display_name">Master Account Selected</div>
												<div class="media-heading-sub" v-else>{{ activeLocation.display_name }}</div>
											</div>
										</li>
									</ul>
								</div>
							</div>
						</div>
						<div class="padding-box">
	                        <div class="alert alert-danger" v-if="noRecordsError.length">
	                            <span>{{ noRecordsError }}</span>
	                        </div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text" class="form-control input-sm padding-right-20" id="location_search" v-model="locationSearch.search" :class="{'edited': locationSearch.search.length}">
								<i v-if="locationSearch.search.length" class="fa fa-times clear-icon" @click="clearSearch()"></i>
								<label for="location_search">Search All Stores</label>
								<span class="help-block persist">
									<span v-if="searchError.length">{{ searchError }}</span>
									<span v-else>Search by Store Name or Store Address.</span>
								</span>
							</div>
						</div>
						<div class="margin-top-30" v-if="filteredLocationsPaginated.length">
							<h3 class="list-heading location-panel-heading blue">Search Results</h3>
							<div class="tab-content" v-if="!searchError.length">
								<div class="tab-pane active page-quick-sidebar-chat scrollable">
									<div class="page-quick-sidebar-chat-users" data-rail-color="#ddd" data-wrapper-class="page-quick-sidebar-list">
										<ul class="media-list list-items">
											<li class="media" v-for="location in filteredLocationsPaginated" @click="selectLocation(location)" :key="location.id">
												<div class="media-status" v-if="location.id === activeLocation.id" @click="unselectLocation($event)">
													<div class="active-location-dots">
														<div class="active-location-dot">
															<i class="fa fa-circle blue"></i>
														</div>
														<div class="deactivate-location-dot">
															<i class="fa fa-times-circle"></i>
														</div>
													</div>
												</div>
												<div class="media-body">
													<h4 class="media-heading">{{ location.display_name }}</h4>
													<div class="media-heading-sub">{{ location.address_line_1 }}</div>
												</div>
											</li>
										</ul>
										<div class="pagination-wrapper">
											<div @click="goToPreviousPageFiltered()" class="pagination-arrow" :class="{ 'disabled' : currentPageFiltered === 1 }"><i class="fa fa-angle-left" aria-hidden="true"></i></div>
											<div @click="goToNextPageFiltered()" class="pagination-arrow" :class="{ 'disabled' : currentPageFiltered === lastPageFiltered }"><i class="fa fa-angle-right" aria-hidden="true"></i></div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="margin-top-30" v-else>
							<h3 class="list-heading location-panel-heading blue">Stores</h3>
							<div class="tab-content">
								<div class="tab-pane active page-quick-sidebar-chat scrollable">
									<div class="page-quick-sidebar-chat-users" data-rail-color="#ddd" data-wrapper-class="page-quick-sidebar-list">
										<ul class="media-list list-items">
											<li class="media" v-if="activeLocation && activeLocation.id">
												<div class="media-status" @click="unselectLocation($event)">
													<div class="active-location-dots">
														<div class="active-location-dot">
															<i class="fa fa-circle blue"></i>
														</div>
														<div class="deactivate-location-dot">
															<i class="fa fa-times-circle"></i>
														</div>
													</div>
												</div>
												<div class="media-body">
													<h4 class="media-heading">{{ activeLocation.display_name }}</h4>
													<div class="media-heading-sub">{{ activeLocation.address_line_1 }}</div>
												</div>
											</li>
											<li class="media" v-if="locations.length" v-for="location in locations" @click="selectLocation(location)" :key="location.id">
												<div class="media-body">
													<h4 class="media-heading">{{ location.display_name }}</h4>
													<div class="media-heading-sub">{{ location.address_line_1 }}</div>
												</div>
											</li>
										</ul>
										<div class="pagination-wrapper" v-show="lastPage > 1">
											<div @click="goToPreviousPage()" class="pagination-arrow" :class="{ 'disabled' : currentPage === 1 }"><i class="fa fa-angle-left" aria-hidden="true"></i></div>
											<div @click="goToNextPage()" class="pagination-arrow" :class="{ 'disabled' : currentPage === lastPage }"><i class="fa fa-angle-right" aria-hidden="true"></i></div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div v-if="!locations.length" class="padding-box">
							<div class="alert alert-info">
                                <span>There are no store locations for this application.</span>
                            </div>
						</div>
					</div>
				</div>
			</div>
			<!-- END QUICK SIDEBAR -->
		</div>
	</div>
</template>

<script>
import $ from 'jquery'
import App from '../controllers/App'
import Modal from './modules/Modal'
import Dropdown from './modules/Dropdown'
import LoadingScreen from './modules/LoadingScreen'
import { findIndex } from 'lodash'
import ApprovalsFunctions from '../controllers/Approvals'

/**
 * App module is the main component which holds the navigation, page header, and side panel.
 * @class App
 */

export default {
	data () {
		return {
			currentRoute: '',
			currentSubRoute: '',
			routeMessage: '',
			displayImStillHere: false,
			displayLoadingScreen: false,
			waitingForData: true,
			activeTab: 0,
			locationSearch: {
				search: ''
			},
			filteredLocations: [],
			activeLocation: {},
			searchError: '',
			noRecordsError: '',
			currentPage: 1,
			currentPageFiltered: 1
		}
	},
	computed: {
		locations () {
			let begin = ((this.currentPage - 1) * 10)
			let end = (this.currentPage * 10)
			return this.$root.storeLocations.slice(begin, end)
		},
		filteredLocationsPaginated () {
			let begin = ((this.currentPageFiltered - 1) * 10)
			let end = (this.currentPageFiltered * 10)
			return this.filteredLocations.slice(begin, end)
		},
		lastPage () {
			return Math.ceil(this.$root.storeLocations.length / 10)
		},
		lastPageFiltered () {
			return Math.ceil(this.filteredLocations.length / 10)
		}
	},
	watch: {
		/**
		 * Watch `$route` so that we can reset the current route on change.
		 * @function
		 * @returns {undefined}
		 */
		'$route' () {
			this.setCurrentRoute()
		},
		'locationSearch.search' () {
			if (!this.locationSearch.search.length) {
				this.clearSearchError()
				this.filteredLocations = []
			} else {
				this.getFilteredLocations()
			}
		}
	},
	/**
	 * Run on `created` to check whether or not the user is supposed to be logged in.
	 * @function
	 * @returns {undefined}
	 */
	created () {
		this.setCurrentRoute()
		this.getRequests()
	},
	/**
	 * Run on `mounted` to initialize the app defaults.
	 * @function
	 * @returns {undefined}
	 */
	mounted () {
		this.displayLoadingScreen = true

		// This will add all of the necessary classes to the body that aren't required outside of the app
		$('body').addClass('page-header-fixed').addClass('page-sidebar-closed-hide-logo').addClass('page-content-white').addClass('page-md').addClass('app-body')

		App.init()
		App.initApp()

		// get list of stores
		if (this.$root.accountType === 'application_admin') {
			this.getStoreLocations()
		}
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
				records_per_page: 1
			}
			return ApprovalsFunctions.getRequests(pagination)
			.then(response => {
				if (response.payload.docs.length) {
					appVue.$root.requestsPending = true
				} else {
					appVue.$root.requestsPending = false
				}
			}).catch(reason => {
				console.log(reason)
			})
		},
		/**
		 * To move to the next page of stores.
		 * @function
		 * @returns {undefined}
		 */
		goToNextPage () {
			if (this.currentPage < this.lastPage) {
				this.currentPage = this.currentPage + 1
			}
		},
		/**
		 * To move to the previous page of stores.
		 * @function
		 * @returns {undefined}
		 */
		goToPreviousPage () {
			if (this.currentPage > 1) {
				this.currentPage = this.currentPage - 1
			}
		},
		/**
		 * To move to the next page of stores search results.
		 * @function
		 * @returns {undefined}
		 */
		goToNextPageFiltered () {
			if (this.currentPageFiltered < this.lastPageFiltered) {
				this.currentPageFiltered = this.currentPageFiltered + 1
			}
		},
		/**
		 * To move to the previous page of stores search results.
		 * @function
		 * @returns {undefined}
		 */
		goToPreviousPageFiltered () {
			if (this.currentPageFiltered > 1) {
				this.currentPageFiltered = this.currentPageFiltered - 1
			}
		},
		/**
		 * To clear the search field.
		 * @function
		 * @returns {undefined}
		 */
		clearSearch () {
			this.locationSearch.search = ''
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
				this.currentRoute = this.$route.path.substring(firstIndex + 1, secondIndex)

				if (secondIndex < this.$route.path.length - 1) {
					var thirdIndex = this.$route.path.indexOf('/', secondIndex + 1)
					if (thirdIndex === -1) {
						thirdIndex = this.$route.path.length
					}
					this.currentSubRoute = this.$route.path.substring(secondIndex + 1, thirdIndex)
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
		},
		/**
		 * To toggle whether or not the sidebar should be toggled open.
		 * @function
		 * @returns {undefined}
		 */
		toggleQuickSidebar () {
			if (this.$root.activeAccountType !== 'location') {
				$('body').toggleClass('page-quick-sidebar-open')
			}
		},
		/**
		 * To get a list of store locations for the current application.
		 * @function
		 * @returns {undefined}
		 */
		getStoreLocations () {
			var appVue = this
			App.getPaginatedStoreLocations(appVue.$root.appId, appVue.$root.appSecret, appVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					appVue.$root.storeLocations = response.payload
					for (var i = 0; i < appVue.$root.storeLocations.length; i++) {
						if (appVue.$root.storeLocations[i].is_corporate === 1) {
							appVue.$root.corporateStoreId = appVue.$root.storeLocations[i].id
						}
					}
					// set the active location if already present in local storage
					// eslint-disable-next-line
					var activeLocation = localStorage.getItem('activeLocation')
					if (activeLocation) {
						appVue.selectLocation(JSON.parse(activeLocation))
					}
				}
			}).catch(reason => {
				if (reason.responseJSON) {}
				throw reason
			})
		},
		/**
		 * To select another location from the list of locations for the current application.
		 * @function
		 * @param {object} location - The location object to be selected.
		 * @returns {undefined}
		 */
		selectLocation (location) {
			// ToDo: make a call to the appropriate endpoint and update the logic once this part is scoped out
			if (this.activeLocation && this.activeLocation.id) {
				this.$root.storeLocations.splice(findIndex(this.$root.storeLocations, location), 1)
				this.$root.storeLocations.unshift(this.activeLocation)
			} else {
				this.$root.storeLocations.splice(findIndex(this.$root.storeLocations, location), 1)
			}
			this.activeLocation = location
			this.$root.activeLocation = location
			/* eslint-disable no-undef */
			localStorage.setItem('activeLocation', JSON.stringify(this.$root.activeLocation))
			this.toggleQuickSidebar()
		},
		/**
		* To clear the selection of location.
		* @function
		* @param {object} event - The event that triggered the function.
		* @returns {undefined}
		*/
		unselectLocation (event) {
			event.stopPropagation()
			this.$root.storeLocations.unshift(this.activeLocation)
			/* eslint-disable no-undef */
			localStorage.removeItem('activeLocation')
			this.$root.activeLocation = {}
			this.activeLocation = {}
		},
		/**
		 * To clear the current search error.
		 * @function
		 * @returns {undefined}
		 */
		clearSearchError () {
			this.searchError = ''
			this.noRecordsError = ''
		},
		/**
		 * To filter the stores based on the search term.
		 * @function
		 * @returns {undefined}
		 */
		getFilteredLocations () {
			this.clearSearchError()
			this.filteredLocations = []
			if (this.locationSearch.search.length) {
				if (this.locationSearch.search.length < 3) {
					this.searchError = 'Search term must be at least 3 characters'
				} else {
					if (this.activeLocation && this.activeLocation.id && ((this.activeLocation.display_name.toLowerCase().indexOf(this.locationSearch.search.toLowerCase()) > -1) || (this.activeLocation.address_line_1.toLowerCase().indexOf(this.locationSearch.search.toLowerCase()) > -1))) {
						this.filteredLocations.push(this.activeLocation)
					} else {
						for (var i = 0; i < this.$root.storeLocations.length; i++) {
							if ((this.$root.storeLocations[i].display_name.toLowerCase().indexOf(this.locationSearch.search.toLowerCase()) > -1) || (this.$root.storeLocations[i].address_line_1.toLowerCase().indexOf(this.locationSearch.search.toLowerCase()) > -1)) {
								this.filteredLocations.push(this.$root.storeLocations[i])
							}
						}
					}
				}
				if (!this.filteredLocations.length && !this.searchError.length) {
					this.noRecordsError = 'There are no matching records. Please try again.'
				}
			}
		},
		/**
		 * To log the user out of their current session and clear global variables and local storage.
		 * @function
		 * @returns {undefined}
		 */
		logOut () {
			App.logOut()

			this.$root.clearGlobalVariables()
			// eslint-disable-next-line
			localStorage.clear()

			this.$router.push({name: 'Login'})
		}
	},
	components: {
		Modal,
		Dropdown,
		LoadingScreen
	}
}
</script>

<style>
	body .modal {
		z-index: 10501;
	}
	.app-bg {
		position: absolute;
	    width: 100%;
	    height: 100%;
	    background-color: #292E33;
	    z-index: 10000;
	}
	.page-header.navbar .page-logo .logo-default.logo-unoapp {
		width: auto;
		max-width: 125px;
		height: auto;
		display: block;
		margin: 9px 0px 0px;
	}
	.page-sidebar .page-sidebar-menu li.open>.sub-menu {
		display: block;
	}
	.center {
		text-align: center;
	}
	.form-body {
		margin-top: 20px;
	}
	body .swal2-container {
		z-index: 10050;
	}
	.swal2-modal .swal2-confirm:focus {
		outline: none;
	}
	.location-panel .logo-container {
		width: 48px;
		height: 100%;
		display: inline-block;
	}
	.location-panel .location-name-container {
		display: inline-block;
		margin-right: 8px;
	}
	.location-panel .logo-container .business-logo {
		height: 38px;
	    border-radius: 50%;
	    position: absolute;
	    top: 6px;
	    left: 0;
	    margin: 0px 8px;
	}
	.location-panel .location-name-container .business-name, .location-panel .location-name-container .business-location-name {
		color: #c6cfda;
		width: auto;
		max-width: 155px;
		display: block;
	    font-size: 11px;
	    font-weight: 300;
	    word-break: break-word;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    overflow: hidden;
	}
	.location-panel .location-name-container .business-name.big {
		font-size: 13px;
		line-height: 41px;
	}
	.location-panel .location-name-container .business-location-name {
		font-size: 13px;
	}
	.page-quick-sidebar {
		margin-top: 50px;
	}
	.page-quick-sidebar-wrapper .page-quick-sidebar .page-quick-sidebar-chat .page-quick-sidebar-chat-users .media-list .media.selected-location {
		background-color: rgba(55, 183, 217, .3);
	}
	.page-quick-sidebar-wrapper .page-quick-sidebar .page-quick-sidebar-chat .page-quick-sidebar-chat-users .media-list .media.selected-location:hover {
		background-color: rgba(55, 183, 217, .5);
	}
	.page-quick-sidebar-wrapper .page-quick-sidebar .page-quick-sidebar-chat .page-quick-sidebar-chat-users .media-list .media.current-location:hover {
		cursor: default;
	}
	.deactivate-location-dot-top {
		transition: opacity 0.2s ease-in;
		opacity: 0;
	}
	.page-quick-sidebar-wrapper .page-quick-sidebar .page-quick-sidebar-chat .page-quick-sidebar-chat-users .media-list .media.selected-location:hover .deactivate-location-dot-top {
		opacity: 1;
		cursor: pointer;
	}
	.page-quick-sidebar-wrapper .page-quick-sidebar .list-heading.location-panel-heading {
		color: rgba(55, 183, 217, .5);
		font-size: 18px;
		text-transform: uppercase;
	}
	.page-header .top-menu .dropdown-quick-sidebar-toggler>.dropdown-toggle.location-panel {
		padding: 5px 0px!important;
		height: 50px;
		width: 120px;
	}
	.page-header .top-menu .dropdown-quick-sidebar-toggler>.dropdown-toggle.location-panel.width-auto {
		width: auto;
		max-width: 220px;
	}
	.page-quick-sidebar-wrapper .page-quick-sidebar-toggler {
		position: absolute;
	}
	.page-quick-sidebar-open .page-quick-sidebar-toggler > span {
		color: #99a8b5;
		font-size: 20px;
	}
	.page-quick-sidebar-toggler > span:hover {
	    color: #fff!important;
	}
	a.panel-link {
		color: #99a8b5;
		text-decoration: underline;
	}
	a.panel-link:hover {
		color: #fff!important;
	}
	.scrollable {
		height: calc(100vh - 295px);
	    overflow-y: auto;
	    overflow-x: hidden;
	}
	div.tab-pane::-webkit-scrollbar {
		background-color: transparent;
		width: 7px;
	}
	div.tab-pane::-webkit-scrollbar-thumb {
		background-color: #99a8b5;
		border-radius: 10px;
		-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); 
	}
	div.tab-pane::-webkit-scrollbar-track {
	    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	    border-radius: 10px;
	}
	.col-sm-3.no-padding, .col-sm-8.no-padding {
		padding: 0;
		margin-left: 5px;
	}
	.page-quick-sidebar-wrapper .page-quick-sidebar .page-quick-sidebar-chat .page-quick-sidebar-chat-users.active-business {
		padding-top: 0px;
	}
	.page-quick-sidebar-wrapper .page-quick-sidebar .page-quick-sidebar-chat .page-quick-sidebar-chat-users .media-list .media .media-body .media-heading-sub {
		margin-top: 5px;
	}
	.padding-box {
		padding: 10px;
	}
	#location_search {
		color: #99a8b5;
	}
	.blue {
		color: rgba(55, 183, 217, .5);
	}
	.form-group.form-md-line-input .form-control.input-sm.padding-right-20 {
		padding-right: 20px;
	}
	.clear-icon {
		position: absolute;
	    right: 0;
	    top: 30px;
	    color: #32c5d2;
	    cursor: pointer;
	}
	.page-header.navbar .top-menu .navbar-nav>li.dropdown.width-auto {
		width: auto;
		max-width: 220px;
	}
	.pagination-wrapper {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
	}
	.pagination-arrow {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 2.5em;
		width: 2.5em;
		border-radius: 50%;
		background-color: #ddd;
		color: #666;
		font-size: 1em;
		cursor: pointer;
	}
	.pagination-arrow:hover {
		background-color: #67809F;
		color: #fff;
	}
	.pagination-arrow.disabled {
		cursor: not-allowed;
	}
	.pagination-arrow.disabled:hover {
		background-color: #ddd;
		color: #666;
	}
	.active-location-dots {
		position: relative;
	}
	.active-location-dot {
		position: absolute;
		top: 0;
		left: -20px;
	}
	.deactivate-location-dot {
		position: absolute;
		top: 0;
		left: -20px;
		transition: opacity 0.3s ease-in;
		opacity: 0;
	}
	.deactivate-location-dot:hover {
		opacity: 1;
	}
	@media(min-width: 992px) {
		.page-sidebar-wrapper {
			position: fixed;
			height: calc(100vh - 35px);
			overflow: scroll;
		}
	}
	.page-header.navbar .top-menu .navbar-nav>li.dropdown>.dropdown-toggle.log-out-button:last-child {
		padding-right: 8px;
	}
	.fa.danger {
		color: rgba(201, 0, 0, .8)
	}
</style>
