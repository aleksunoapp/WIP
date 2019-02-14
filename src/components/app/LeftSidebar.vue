<template>
  <div class="page-sidebar-wrapper">
    <div class="page-sidebar navbar-collapse collapse">
      <ul
        class="page-sidebar-menu page-header-fixed"
        data-keep-expand="false"
      >
        <li
          v-if="canAny([
            'analytics overview read',
            'analytics store read',
            'analytics item read',
            'analytics user read',
            'analytics order read'
          ])"
          id="store_manager_link"
          class="nav-item"
          :class="{'active': currentRoute === 'analytics'}"
        >
          <a
            class="nav-link nav-toggle unselectable"
            @click="toggleNavigation($event)"
          >
            <i class="fa fa-line-chart" />
            <span class="title">
              Analytics
            </span>
            <i
              class="fa fa-chevron-down pull-right"
              aria-hidden="true"
            />
          </a>
          <ul class="sub-menu">
            <li
              v-if="can('analytics overview read')"
              id="store_manager_create_new_link"
              class="nav-item"
              :class="{'active': currentRoute === 'analytics' && currentSubRoute === 'overview'}"
            >
              <router-link
                to="/app/analytics/overview"
                class="nav-link"
              >
                <i class="fa fa-compress" />
                <span class="title">
                  Overview
                </span>
              </router-link>
            </li>
            <li
              v-if="can('analytics store read')"
              id="store_manager_applications_link"
              class="nav-item"
              :class="{'active': currentRoute === 'analytics' && currentSubRoute === 'locationsales'}"
            >
              <router-link
                to="/app/analytics/locationsales"
                class="nav-link"
              >
                <i class="fa fa-map-marker" />
                <span class="title">
                  Store Sales
                </span>
              </router-link>
            </li>
            <li
              v-if="can('analytics item read')"
              id="item_sales_link"
              class="nav-item"
              :class="{'active': currentRoute === 'analytics' && currentSubRoute === 'itemsales'}"
            >
              <router-link
                to="/app/analytics/itemsales"
                class="nav-link"
              >
                <i class="fa fa-th-large" />
                <span class="title">
                  Item Sales
                </span>
              </router-link>
            </li>
            <li
              v-if="can('analytics user read')"
              id="user_analytics_link"
              class="nav-item"
              :class="{'active': currentRoute === 'analytics' && currentSubRoute === 'useranalytics'}"
            >
              <router-link
                to="/app/analytics/useranalytics"
                class="nav-link"
              >
                <i class="fa fa-users" />
                <span class="title">
                  User Analytics
                </span>
              </router-link>
            </li>
            <li
              v-if="can('analytics order read')"
              id="order_history_link"
              class="nav-item"
              :class="{'active': currentRoute === 'analytics' && currentSubRoute === 'orders'}"
            >
              <router-link
                to="/app/analytics/orders"
                class="nav-link"
              >
                <i class="fa fa-list-alt" />
                <span class="title">
                  Order History
                </span>
              </router-link>
            </li>
          </ul>
        </li>
        <li
          v-if="canAny([
            'approvals read',
            'approvals request read',
            'list role',
            'list permission',
            'approvals modules read'
          ])"
          id="admin_manager_link"
          class="nav-item"
          :class="{'active': currentRoute === 'approvals'}"
        >
          <a
            class="nav-link nav-toggle unselectable"
            @click="toggleNavigation($event)"
          >
            <i class="fa fa-check-square-o" />
            <span class="title">
              Approvals Manager
              <i
                v-if="$root.requestsPending"
                class="fa fa-circle danger"
              />
            </span>
            <i
              class="fa fa-chevron-down pull-right"
              aria-hidden="true"
            />
          </a>
          <ul class="sub-menu">
            <li
              v-if="canAny(['approvals read', 'approvals request read'])"
              id="admin_manager_approvals_link"
              class="nav-item"
              :class="{'active': currentRoute === 'approvals' && currentSubRoute === 'approvals'}"
            >
              <router-link
                to="/app/approvals/approvals"
                class="nav-link"
              >
                <i class="fa fa-check-square-o" />
                <span class="title">
                  Approvals
                </span>
              </router-link>
            </li>
            <li
              v-if="can('list permission')"
              id="admin_manager_permissions_link"
              class="nav-item"
              :class="{'active': currentRoute === 'approvals' && currentSubRoute === 'permissions'}"
            >
              <router-link
                to="/app/approvals/permissions"
                class="nav-link"
              >
                <i class="fa fa-ban" />
                <span class="title">
                  Permissions
                </span>
              </router-link>
            </li>
            <li
              v-if="can('approvals modules read')"
              id="admin_manager_modules_link"
              class="nav-item"
              :class="{'active': currentRoute === 'approvals' && currentSubRoute === 'modules'}"
            >
              <router-link
                to="/app/approvals/modules"
                class="nav-link"
              >
                <i class="fa fa-circle-o" />
                <span class="title">
                  Modules
                </span>
              </router-link>
            </li>
            <li
              v-if="can('list role')"
              id="admin_manager_roles_link"
              class="nav-item"
              :class="{'active': currentRoute === 'approvals' && currentSubRoute === 'roles'}"
            >
              <router-link
                to="/app/approvals/roles"
                class="nav-link"
              >
                <i class="fa fa-id-badge" />
                <span class="title">
                  Roles
                </span>
              </router-link>
            </li>
          </ul>
        </li>
        <li
          v-if="canAny([
            'admin brand_admins read',
            'admin location_managers read',
            'admin oma_users read',
            'admin store_app_users read'
          ])"
          id="admin_manager_link"
          class="nav-item"
          :class="{'active': currentRoute === 'admin'}"
        >
          <a
            class="nav-link nav-toggle unselectable"
            @click="toggleNavigation($event)"
          >
            <i class="fa fa-cogs" />
            <span class="title">
              Admin Manager
            </span>
            <i
              class="fa fa-chevron-down pull-right"
              aria-hidden="true"
            />
          </a>
          <ul class="sub-menu">
            <li
              v-if="can('admin brand_admins read')"
              id="store_manager_create_new_link"
              class="nav-item"
              :class="{'active': currentRoute === 'admin' && currentSubRoute === 'brand_admins'}"
            >
              <router-link
                to="/app/admin/brand_admins"
                class="nav-link"
              >
                <i class="fa fa-user" />
                <span class="title">
                  Brand Admins
                </span>
              </router-link>
            </li>
            <li
              v-if="can('admin location_managers read')"
              id="store_manager_create_new_link"
              class="nav-item"
              :class="{'active': currentRoute === 'admin' && currentSubRoute === 'location_managers'}"
            >
              <router-link
                to="/app/admin/location_managers"
                class="nav-link"
              >
                <i class="fa fa-home" />
                <span class="title">
                  Location Managers
                </span>
              </router-link>
            </li>
            <li
              v-if="can('admin oma_users read')"
              id="store_manager_applications_link"
              class="nav-item"
              :class="{'active': currentRoute === 'admin' && currentSubRoute === 'OMA_users'}"
            >
              <router-link
                to="/app/admin/OMA_users"
                class="nav-link"
              >
                <i class="fa fa-bar-chart" />
                <span class="title">
                  OMA Users
                </span>
              </router-link>
            </li>
            <li
              v-if="can('admin store_app_users read')"
              id="store_manager_applications_link"
              class="nav-item"
              :class="{'active': currentRoute === 'admin' && currentSubRoute === 'store_app_users'}"
            >
              <router-link
                to="/app/admin/store_app_users"
                class="nav-link"
              >
                <i class="fa fa-tablet" />
                <span class="title">
                  Store App Users
                </span>
              </router-link>
            </li>
          </ul>
        </li>
        <li
          v-if="canAny([
            'stores info read',
            'stores info create',
            'stores groups read',
            'stores amenities read',
            'stores order_settings read'
          ])"
          id="store_manager_link"
          class="nav-item"
          :class="{'active': currentRoute === 'store_manager'}"
        >
          <a
            class="nav-link nav-toggle unselectable"
            @click="toggleNavigation($event)"
          >
            <i class="fa fa-home" />
            <span class="title">
              Stores Manager
            </span>
            <i
              class="fa fa-chevron-down pull-right"
              aria-hidden="true"
            />
          </a>
          <ul class="sub-menu">
            <li
              v-if="can('stores info create')"
              id="store_manager_create_new_link"
              class="nav-item"
              :class="{'active': currentRoute === 'store_manager' && currentSubRoute === 'create_new'}"
            >
              <router-link
                to="/app/store_manager/create_new"
                class="nav-link"
              >
                <i class="fa fa-plus" />
                <span class="title">
                  Create New Store
                </span>
              </router-link>
            </li>
            <li
              v-if="can('stores groups read')"
              id="store_manager_applications_link"
              class="nav-item"
              :class="{'active': currentRoute === 'store_manager' && currentSubRoute === 'store_groups'}"
            >
              <router-link
                to="/app/store_manager/store_groups"
                class="nav-link"
              >
                <i class="fa fa-sitemap" />
                <span class="title">
                  Store Groups
                </span>
              </router-link>
            </li>
            <li
              v-if="can('stores info read')"
              id="store_manager_applications_link"
              class="nav-item"
              :class="{'active': currentRoute === 'store_manager' && (currentSubRoute === 'stores' || currentSubRoute === 'edit_store')}"
            >
              <router-link
                to="/app/store_manager/stores"
                class="nav-link"
              >
                <i class="fa fa-map-marker" />
                <span class="title">
                  Stores
                </span>
              </router-link>
            </li>
            <li
              v-if="can('stores amenities read')"
              id="store_manager_amenities_link"
              class="nav-item"
              :class="{'active': currentRoute === 'store_manager' && currentSubRoute === 'amenities'}"
            >
              <router-link
                to="/app/store_manager/amenities"
                class="nav-link"
              >
                <i class="fa fa-wifi" />
                <span class="title">
                  Amenities
                </span>
              </router-link>
            </li>
            <li
              v-if="can('stores order_settings read')"
              id="store_manager_order_settings_link"
              class="nav-item"
              :class="{'active': currentRoute === 'store_manager' && currentSubRoute === 'order_settings'}"
            >
              <router-link
                to="/app/store_manager/order_settings"
                class="nav-link"
              >
                <i class="fa fa-gear" />
                <span class="title">
                  Order Settings
                </span>
              </router-link>
            </li>
            <li
              v-if="can('stores delivery_hours read')"
              id="store_manager_delivery_hours_link"
              class="nav-item"
              :class="{'active': currentRoute === 'store_manager' && currentSubRoute === 'delivery_hours'}"
            >
              <router-link
                to="/app/store_manager/delivery_hours"
                class="nav-link"
              >
                <i class="fa fa-clock-o" />
                <span class="title">
                  Delivery Hours
                </span>
              </router-link>
            </li>
            <li
              v-if="can('stores delivery_provider read')"
              id="store_manager_delivery_providers_link"
              class="nav-item"
              :class="{'active': currentRoute === 'store_manager' && currentSubRoute === 'delivery_providers'}"
            >
              <router-link
                to="/app/store_manager/delivery_providers"
                class="nav-link"
              >
                <i class="fa fa-truck" />
                <span class="title">
                  Delivery Providers
                </span>
              </router-link>
            </li>
            <li
              v-if="can('stores delivery_profile read')"
              id="store_manager_delivery_zones_link"
              class="nav-item"
              :class="{'active': currentRoute === 'store_manager' && currentSubRoute === 'delivery_zones'}"
            >
              <router-link
                to="/app/store_manager/delivery_zones"
                class="nav-link"
              >
                <i class="fa fa-bullseye" />
                <span class="title">
                  Delivery Zones
                </span>
              </router-link>
            </li>
            <li
              v-if="can('stores payment methods read')"
              id="store_manager_payment_methods_link"
              class="nav-item"
              :class="{'active': currentRoute === 'store_manager' && currentSubRoute === 'payment_methods'}"
            >
              <router-link
                to="/app/store_manager/payment_methods"
                class="nav-link"
              >
                <i class="fa fa-credit-card" />
                <span class="title">
                  Payment Methods
                </span>
              </router-link>
            </li>
            <li
              v-if="can('stores payment terminals read')"
              id="store_manager_payment_terminals_link"
              class="nav-item"
              :class="{'active': currentRoute === 'store_manager' && currentSubRoute === 'payment_terminals'}"
            >
              <router-link
                to="/app/store_manager/payment_terminals"
                class="nav-link"
              >
                <i class="fa fa-cc-stripe" />
                <span class="title">
                  Payment Terminals
                </span>
              </router-link>
            </li>
            <li

              id="store_manager_discounts_link"
              class="nav-item"
              :class="{'active': routeName === 'DiscountCategories'}"
            >
              <router-link
                :to="{name: 'DiscountCategories'}"
                class="nav-link"
              >
                <i class="fa fa-arrow-down" />
                <span class="title">
                  Discounts
                </span>
              </router-link>
            </li>
          </ul>
        </li>
        <li
          v-if="can('news_feed read')"
          class="nav-item"
          :class="{'active': currentRoute === 'news_feed'}"
        >
          <router-link
            to="/app/news_feed"
            class="nav-link nav-toggle"
          >
            <i class="fa fa-newspaper-o" />
            <span class="title">
              News Feed
            </span>
          </router-link>
        </li>
        <li
          v-if="can('social_feed read')"
          class="nav-item"
          :class="{'active': currentRoute === 'social_feed'}"
        >
          <router-link
            to="/app/social_feed"
            class="nav-link nav-toggle"
          >
            <i class="fa fa-user" />
            <span class="title">
              Social Feed
            </span>
          </router-link>
        </li>
        <li
          v-if="canAny([
            'tax tax_classes read',
            'tax item_types read'
          ])"
          id="tax_manager_link"
          class="nav-item"
          :class="{'active': currentRoute === 'tax_manager'}"
        >
          <a
            class="nav-link nav-toggle unselectable"
            @click="toggleNavigation($event)"
          >
            <i class="fa fa-calculator" />
            <span class="title">
              Tax Manager
            </span>
            <i
              class="fa fa-chevron-down pull-right"
              aria-hidden="true"
            />
          </a>
          <ul class="sub-menu">
            <li
              v-if="can('tax tax_classes read')"
              id="tax_manager_tax_classes_link"
              class="nav-item"
              :class="{'active': currentRoute === 'tax_manager' && currentSubRoute === 'tax_classes'}"
            >
              <router-link
                to="/app/tax_manager/tax_classes"
                class="nav-link"
              >
                <i class="fa fa-bar-chart" />
                <span class="title">
                  Tax Classes
                </span>
              </router-link>
            </li>
            <li
              v-if="can('tax item_types read')"
              id="tax_manager_item_types_link"
              class="nav-item"
              :class="{'active': currentRoute === 'tax_manager' && currentSubRoute === 'item_types'}"
            >
              <router-link
                to="/app/tax_manager/item_types"
                class="nav-link"
              >
                <i class="fa fa-glass" />
                <span class="title">
                  Item Types
                </span>
              </router-link>
            </li>
          </ul>
        </li>
        <li
          v-if="canAny([
            'menu_manager menus read',
            'menu_manager tiers read',
            'menu_manager modifiers read',
            'menu_manager tags read',
            'menu_manager portions read',
            'menu_manager options read',
            'menu_manager attributes read'
          ])"
          id="menu_manager_link"
          class="nav-item"
          :class="{'active': currentRoute === 'menu_manager'}"
        >
          <a
            class="nav-link nav-toggle unselectable"
            @click="toggleNavigation($event)"
          >
            <i class="fa fa-cutlery" />
            <span class="title">
              Menu Manager
            </span>
            <i
              class="fa fa-chevron-down pull-right"
              aria-hidden="true"
            />
          </a>
          <ul class="sub-menu">
            <li
              v-if="can('menu_manager menus read')"
              id="menu_manager_menus_link"
              class="nav-item"
              :class="{'active': currentRoute === 'menu_manager' && (currentSubRoute === 'menus' || currentSubRoute === 'categories' || currentSubRoute === 'items')}"
            >
              <router-link
                to="/app/menu_manager/menus"
                class="nav-link"
              >
                <i class="fa fa-file-text-o" />
                <span class="title">
                  Menus
                </span>
              </router-link>
            </li>
            <li
              v-if="can('menu_manager tiers read')"
              id="menu_manager_menu_tiers_link"
              class="nav-item"
              :class="{'active': currentRoute === 'menu_manager' && currentSubRoute === 'menu_tiers'}"
            >
              <router-link
                to="/app/menu_manager/menu_tiers"
                class="nav-link"
              >
                <i class="fa fa-sitemap" />
                <span class="title">
                  Menu Tiers
                </span>
              </router-link>
            </li>
            <li
              v-if="can('menu_manager modifiers read')"
              id="menu_manager_modifiers_link"
              class="nav-item"
              :class="{'active': currentRoute === 'menu_manager' && (currentSubRoute === 'modifiers' || currentSubRoute === 'modifier_items')}"
            >
              <router-link
                to="/app/menu_manager/modifiers"
                class="nav-link"
              >
                <i class="fa fa-cogs" />
                <span class="title">
                  Modifiers
                </span>
              </router-link>
            </li>
            <li
              v-if="can('menu_manager modifier_tiers read')"
              id="menu_manager_modifier_tiers_link"
              class="nav-item"
              :class="{'active': currentRoute === 'menu_manager' && currentSubRoute === 'modifier_tiers'}"
            >
              <router-link
                to="/app/menu_manager/modifier_tiers"
                class="nav-link"
              >
                <i class="fa fa-sitemap" />
                <span class="title">
                  Modifier Tiers
                </span>
              </router-link>
            </li>
            <li
              v-if="can('menu_manager tags read')"
              id="menu_manager_tags_link"
              class="nav-item"
              :class="{'active': currentRoute === 'menu_manager' && currentSubRoute === 'tags'}"
            >
              <router-link
                to="/app/menu_manager/tags"
                class="nav-link"
              >
                <i class="fa fa-tags" />
                <span class="title">
                  Tags
                </span>
              </router-link>
            </li>
            <li
              v-if="can('menu_manager portions read')"
              id="menu_manager_portions_link"
              class="nav-item"
              :class="{'active': currentRoute === 'menu_manager' && currentSubRoute === 'portions'}"
            >
              <router-link
                to="/app/menu_manager/portions"
                class="nav-link"
              >
                <i class="fa fa-pie-chart" />
                <span class="title">
                  Portions
                </span>
              </router-link>
            </li>
            <li
              v-if="can('menu_manager options read')"
              id="menu_manager_options_link"
              class="nav-item"
              :class="{'active': currentRoute === 'menu_manager' && currentSubRoute === 'options'}"
            >
              <router-link
                to="/app/menu_manager/options"
                class="nav-link"
              >
                <i class="fa fa-list-ul" />
                <span class="title">
                  Options
                </span>
              </router-link>
            </li>
            <li
              v-if="can('menu_manager attributes read')"
              id="menu_manager_item_attributes_link"
              class="nav-item"
              :class="{'active': currentRoute === 'menu_manager' && currentSubRoute === 'item_attributes'}"
            >
              <router-link
                to="/app/menu_manager/item_attributes"
                class="nav-link"
              >
                <i class="fa fa-sticky-note-o" />
                <span class="title">
                  Attributes
                </span>
              </router-link>
            </li>
          </ul>
        </li>
        <li
          v-if="can('printers read')"
          id="printers_link"
          class="nav-item"
          :class="{'active': currentRoute === 'printers'}"
        >
          <router-link
            :to="'/app/printers'"
            class="nav-link nav-toggle"
          >
            <i class="icon-printer" />
            <span class="title">
              Printers
            </span>
          </router-link>
        </li>
        <li
          v-if="canAny([
            'user_manager users read',
            'user_manager user_groups read',
            'user_manager attributes read'
          ])"
          id="user_manager_link"
          class="nav-item"
          :class="{'active': currentRoute === 'user_manager'}"
        >
          <a
            class="nav-link nav-toggle unselectable"
            @click="toggleNavigation($event)"
          >
            <i class="fa fa-users" />
            <span class="title">
              Users Manager
            </span>
            <i
              class="fa fa-chevron-down pull-right"
              aria-hidden="true"
            />
          </a>
          <ul class="sub-menu">
            <li
              v-if="can('user_manager users read')"
              id="user_manager_applications_link"
              class="nav-item"
              :class="{'active': currentRoute === 'user_manager' && currentSubRoute === 'users'}"
            >
              <router-link
                to="/app/user_manager/users"
                class="nav-link"
              >
                <i class="fa fa-user" />
                <span class="title">
                  Users
                </span>
              </router-link>
            </li>
            <li
              v-if="can('user_manager user_groups read')"
              id="user_manager_applications_link"
              class="nav-item"
              :class="{'active': currentRoute === 'user_manager' && currentSubRoute === 'user_groups'}"
            >
              <router-link
                to="/app/user_manager/user_groups"
                class="nav-link"
              >
                <i class="fa fa-sitemap" />
                <span class="title">
                  User Groups
                </span>
              </router-link>
            </li>
            <li
              v-if="can('user_manager attributes read')"
              id="user_attributes_applications_link"
              class="nav-item"
              :class="{'active': currentRoute === 'user_manager' && currentSubRoute === 'user_attributes'}"
            >
              <router-link
                to="/app/user_manager/user_attributes"
                class="nav-link"
              >
                <i class="fa fa-sticky-note-o" />
                <span class="title">
                  Attributes
                </span>
              </router-link>
            </li>
            <li
              v-if="can('user_manager transactions read')"
              id="user_transactions_link"
              class="nav-item"
              :class="{'active': currentRoute === 'user_manager' && currentSubRoute === 'transactions'}"
            >
              <router-link
                to="/app/user_manager/transactions"
                class="nav-link"
              >
                <i class="fa fa-list-alt" />
                <span class="title">
                  Transactions
                </span>
              </router-link>
            </li>
          </ul>
        </li>
        <li
          v-if="canAny([
            'faq user read',
            'faq store read'
          ])"
          id="faq_link"
          class="nav-item"
          :class="{'active': currentRoute === 'faq'}"
        >
          <a
            class="nav-link nav-toggle unselectable"
            @click="toggleNavigation($event)"
          >
            <i class="fa fa-comments" />
            <span class="title">
              FAQ
            </span>
            <i
              class="fa fa-chevron-down pull-right"
              aria-hidden="true"
            />
          </a>
          <ul class="sub-menu">
            <li
              v-if="can('faq user read')"
              id="faq_users_link"
              class="nav-item"
              :class="{'active': currentRoute === 'faq' && currentSubRoute === 'users'}"
            >
              <router-link
                to="/app/faq/users"
                class="nav-link"
              >
                <i class="fa fa-user" />
                <span class="title">
                  Users
                </span>
              </router-link>
            </li>
            <li
              v-if="can('faq store read')"
              id="faq_stores_link"
              class="nav-item"
              :class="{'active': currentRoute === 'faq' && currentSubRoute === 'stores'}"
            >
              <router-link
                to="/app/faq/stores"
                class="nav-link"
              >
                <i class="fa fa-map-marker" />
                <span class="title">
                  Stores
                </span>
              </router-link>
            </li>
          </ul>
        </li>
        <li
          v-if="can('gallery read')"
          class="nav-item"
          :class="{'active': currentRoute === 'gallery'}"
        >
          <router-link
            to="/app/gallery"
            class="nav-link nav-toggle"
          >
            <i class="fa fa-image" />
            <span class="title">
              Gallery
            </span>
          </router-link>
        </li>
        <li
          v-if="canAny([
            'loyalty base_rule read',
            'loyalty promotion_rules read',
            'reward_tiers read'
          ])"
          id="loyalty_link"
          class="nav-item"
          :class="{'active': currentRoute === 'loyalty'}"
        >
          <a
            class="nav-link nav-toggle unselectable"
            @click="toggleNavigation($event)"
          >
            <i class="fa fa-link" />
            <span class="title">
              Loyalty
            </span>
            <i
              class="fa fa-chevron-down pull-right"
              aria-hidden="true"
            />
          </a>
          <ul class="sub-menu">
            <li
              v-if="can('loyalty base_rule read')"
              id="faq_users_link"
              class="nav-item"
              :class="{'active': currentRoute === 'loyalty' && currentSubRoute === 'base_rule'}"
            >
              <router-link
                to="/app/loyalty/base_rule"
                class="nav-link"
              >
                <i class="fa fa-paperclip" />
                <span class="title">
                  Base Rule
                </span>
              </router-link>
            </li>
            <li
              v-if="can('loyalty promotion_rules read')"
              id="faq_users_link"
              class="nav-item"
              :class="{'active': currentRoute === 'loyalty' && currentSubRoute === 'promotion_rules'}"
            >
              <router-link
                to="/app/loyalty/promotion_rules"
                class="nav-link"
              >
                <i class="fa fa-list-ol" />
                <span class="title">
                  Promotion Rules
                </span>
              </router-link>
            </li>
            <li
              v-if="can('reward_tiers read')"
              id="faq_users_link"
              class="nav-item"
              :class="{'active': currentRoute === 'loyalty' && currentSubRoute === 'rewards'}"
            >
              <router-link
                to="/app/loyalty/rewards"
                class="nav-link"
              >
                <i class="fa fa-gift" />
                <span class="title">
                  Rewards
                </span>
              </router-link>
            </li>
          </ul>
        </li>
        <li
          v-if="can('combo_offer read')"
          class="nav-item"
          :class="{'active': currentRoute === 'combos'}"
        >
          <router-link
            to="/app/combos/offers"
            class="nav-link nav-toggle"
          >
            <i class="fa fa-cubes" />
            <span class="title">
              Combos
            </span>
          </router-link>
        </li>
        <li
          v-if="can('promocodes read')"
          class="nav-item"
          :class="{'active': currentRoute === 'promocodes'}"
        >
          <router-link
            to="/app/promocodes"
            class="nav-link nav-toggle"
          >
            <i class="fa fa-scissors" />
            <span class="title">
              Promo codes
            </span>
          </router-link>
        </li>
        <li
          v-if="canAny(['promotions read', 'promotions geolocations read'])"
          id="promotions_manager_link"
          class="nav-item"
          :class="{'active': currentRoute === 'promotions'}"
        >
          <a
            class="nav-link nav-toggle unselectable"
            @click="toggleNavigation($event)"
          >
            <i class="fa fa-money" />
            <span class="title">
              Promotions Manager
            </span>
            <i
              class="fa fa-chevron-down pull-right"
              aria-hidden="true"
            />
          </a>
          <ul class="sub-menu">
            <li
              v-if="can('promotions read')"
              id="promotions_manager_promotions_link"
              class="nav-item"
              :class="{'active': currentRoute === 'promotions' && currentSubRoute === ''}"
            >
              <router-link
                to="/app/promotions"
                class="nav-link"
              >
                <i class="fa fa-money" />
                <span class="title">
                  Promotions
                </span>
              </router-link>
            </li>
            <li
              v-if="can('promotions geolocations read')"
              id="promotions_manager_geolocations_link"
              class="nav-item"
              :class="{'active': currentRoute === 'promotions' && currentSubRoute === 'geolocations'}"
            >
              <router-link
                to="/app/promotions/geolocations"
                class="nav-link"
              >
                <i class="fa fa-compass" />
                <span class="title">
                  Geolocations
                </span>
              </router-link>
            </li>
          </ul>
        </li>
        <li
          v-if="canAny([
            'localization read',
            'localization languages read',
            'localization countries read'
          ])"
          id="localization_link"
          class="nav-item"
          :class="{'active': currentRoute === 'localization'}"
        >
          <a
            class="nav-link nav-toggle unselectable"
            @click="toggleNavigation($event)"
          >
            <i class="fa fa-link" />
            <span class="title">
              Localization
            </span>
            <i
              class="fa fa-chevron-down pull-right"
              aria-hidden="true"
            />
          </a>
          <ul class="sub-menu">
            <li
              v-if="can('localization countries read')"
              id="localization_countries_link"
              class="nav-item"
              :class="{'active': currentRoute === 'localization' && currentSubRoute === 'countries'}"
            >
              <router-link
                to="/app/localization/countries"
                class="nav-link"
              >
                <i class="fa fa-flag-o" />
                <span class="title">
                  Countries
                </span>
              </router-link>
            </li>
            <li
              v-if="can('localization platforms read')"
              id="localization_platforms_link"
              class="nav-item"
              :class="{'active': currentRoute === 'localization' && currentSubRoute === 'platforms'}"
            >
              <router-link
                to="/app/localization/platforms"
                class="nav-link"
              >
                <i class="fa fa-mobile" />
                <span class="title">
                  Platforms
                </span>
              </router-link>
            </li>
            <li
              v-if="can('localization languages read')"
              id="localization_languages_link"
              class="nav-item"
              :class="{'active': currentRoute === 'localization' && currentSubRoute === 'languages'}"
            >
              <router-link
                to="/app/localization/languages"
                class="nav-link"
              >
                <i class="fa fa-language" />
                <span class="title">
                  Languages
                </span>
              </router-link>
            </li>
            <li
              v-if="can('localization locale_regions read')"
              id="localization_language_regions_link"
              class="nav-item"
              :class="{'active': currentRoute === 'localization' && currentSubRoute === 'language_regions'}"
            >
              <router-link
                to="/app/localization/language_regions"
                class="nav-link"
              >
                <i class="fa fa-globe" />
                <span class="title">
                  Language Regions
                </span>
              </router-link>
            </li>
            <li
              v-if="can('localization read')"
              id="localization_terms_link"
              class="nav-item"
              :class="{'active': currentRoute === 'localization' && currentSubRoute === 'terms'}"
            >
              <router-link
                to="/app/localization/terms"
                class="nav-link"
              >
                <i class="fa fa-comment-o" />
                <span class="title">
                  Terms
                </span>
              </router-link>
            </li>
            <li
              v-if="can('localization read')"
              id="localization_admin_link"
              class="nav-item"
              :class="{'active': currentRoute === 'localization' && currentSubRoute === 'ecomm'}"
            >
              <router-link
                to="/app/localization/ecomm"
                class="nav-link"
              >
                <i class="fa fa-bars" />
                <span class="title">
                  eComm Data
                </span>
              </router-link>
            </li>
            <li
              v-if="can('localization read')"
              id="localization_static_link"
              class="nav-item"
              :class="{'active': currentRoute === 'localization' && currentSubRoute === 'custom'}"
            >
              <router-link
                to="/app/localization/custom"
                class="nav-link"
              >
                <i class="fa fa-bars" />
                <span class="title">
                  Custom Data
                </span>
              </router-link>
            </li>
          </ul>
        </li>
        <li class="nav-item">
          <a class="nav-link nav-toggle">
            <i class="" />
            <span class="title" />
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
  name: 'LeftSidebar',
  data: () => ({
    currentRoute: '',
    currentSubRoute: ''
  }),
  computed: {
    routeName () {
      return this.$route.name
    },
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
