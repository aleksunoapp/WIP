<template>
  <div>
    <!-- BEGIN PAGE BAR -->
    <div class="page-bar">
      <breadcrumb :crumbs="breadcrumbArray" />
    </div>
    <!-- END PAGE BAR -->
    <!-- BEGIN PAGE TITLE-->
    <h1 class="page-title">
      Menus
    </h1>
    <!-- END PAGE TITLE-->
    <div class="note note-info">
      <p>Manage a store's menus.</p>
    </div>
    <!-- BEGIN CREATE NEW MENU-->
    <div
      v-if="$root.activeLocation && $root.activeLocation.id && $root.permissions['menu_manager menus create']"
      class="portlet box blue-hoki"
    >
      <div
        class="portlet-title bg-blue-chambray"
        @click="toggleCreateMenuPanel()"
      >
        <div class="custom tools">
          <a :class="{'expand': !createMenuCollapse, 'collapse': createMenuCollapse}" />
        </div>
        <div class="caption">
          &emsp;Create A New Menu
        </div>
      </div>
      <div
        class="portlet-body"
        :class="{'display-hide': createMenuCollapse}"
      >
        <form
          role="form"
          @submit.prevent="createNewMenu($event)"
        >
          <div class="form-body row">
            <div class="col-md-12">
              <div
                v-show="errorMessage"
                ref="errorMessage"
                class="alert alert-danger"
              >
                <button
                  class="close"
                  @click.prevent="clearError()"
                />
                <span>{{ errorMessage }}</span>
              </div>
            </div>
            <div :class="{'col-md-2' : !imageMode.newMenu, 'col-md-12' : imageMode.newMenu}">
              <resource-picker
                :image-button="true"
                :image-url="newMenu.image_url"
                class="margin-top-15"
                @open="toggleImageMode('newMenu', true)"
                @close="toggleImageMode('newMenu', false)"
                @selected="updateImage"
              />
            </div>
            <div
              v-show="!imageMode.newMenu"
              class="col-md-5"
            >
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_2"
                  v-model="newMenu.name"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newMenu.name.length}"
                >
                <label for="form_control_2">
                  Menu Name
                </label>
              </div>
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_3"
                  v-model="newMenu.order"
                  type="number"
                  class="form-control input-sm"
                  :class="{'edited': newMenu.order !== null}"
                >
                <label for="form_control_3">
                  Menu Order
                </label>
              </div>
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_4"
                  v-model="newMenu.desc"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newMenu.desc.length}"
                >
                <label for="form_control_4">
                  Menu Description
                </label>
              </div>
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_5"
                  v-model="newMenu.sku"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newMenu.sku.length}"
                >
                <label for="form_control_5">
                  Menu SKU
                </label>
              </div>
              <div class="form-group form-md-checkboxes">
                <label>Availability</label>
                <div class="md-checkbox-list">
                  <div class="md-checkbox">
                    <input
                      id="availability_pos"
                      v-model="newMenu.pos"
                      type="checkbox"
                      class="md-check"
                    >
                    <label for="availability_pos">
                      <span class="inc" />
                      <span class="check" />
                      <span class="box" /> POS
                    </label>
                  </div>
                  <div class="md-checkbox">
                    <input
                      id="availability_kiosk"
                      v-model="newMenu.kiosk"
                      type="checkbox"
                      class="md-check"
                      checked=""
                    >
                    <label for="availability_kiosk">
                      <span />
                      <span class="check" />
                      <span class="box" /> Kiosk
                    </label>
                  </div>
                  <div class="md-checkbox">
                    <input
                      id="availability_online"
                      v-model="newMenu.online"
                      type="checkbox"
                      class="md-check"
                    >
                    <label for="availability_online">
                      <span />
                      <span class="check" />
                      <span class="box" /> Online
                    </label>
                  </div>
                  <div class="md-checkbox">
                    <input
                      id="availability_web"
                      v-model="newMenu.web"
                      type="checkbox"
                      class="md-check"
                    >
                    <label for="availability_web">
                      <span />
                      <span class="check" />
                      <span class="box" /> Web
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-show="!imageMode.newMenu"
              class="col-md-5"
            >
              <div class="form-group form-md-line-input form-md-floating-label">
                <label>Menu Status:</label><br>
                <el-switch
                  v-model="newMenu.status"
                  active-color="#0c6"
                  inactive-color="#ff4949"
                  :active-value="1"
                  :inactive-value="0"
                  active-text="Active"
                  inactive-text="Sold Out"
                />
              </div>
              <div class="form-group form-md-line-input form-md-floating-label">
                <label>Menu Type:</label><br>
                <el-switch
                  v-model="newMenu.catering"
                  active-color="#0c6"
                  inactive-color="#ff4949"
                  :active-value="1"
                  :inactive-value="0"
                  active-text="Catering"
                  inactive-text="Regular"
                />
              </div>
              <div
                v-if="newMenu.catering"
                class="form-group form-md-line-input form-md-floating-label"
              >
                <input
                  id="form_control_6"
                  v-model="newMenu.min"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newMenu.min.length}"
                >
                <label for="form_control_6">
                  Minimum order value
                </label>
              </div>
              <div
                v-if="newMenu.catering"
                class="form-group form-md-line-input form-md-floating-label"
              >
                <input
                  id="form_control_7"
                  v-model="newMenu.max"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newMenu.max.length}"
                >
                <label for="form_control_7">
                  Maximum order value
                </label>
              </div>

              <div class="form-group form-md-line-input form-md-floating-label margin-bottom-20">
                <label>Is an Add-on Menu:</label><br>
                <el-switch
                  v-model="newMenu.addon"
                  active-color="#0c6"
                  inactive-color="#ff4949"
                  :active-value="1"
                  :inactive-value="0"
                  active-text="Yes"
                  inactive-text="No"
                  class="margin-right-10"
                />
                <button
                  v-if="newMenu.addon === 1"
                  type="submit"
                  class="btn btn-xs blue btn-outline"
                  @click="selectAddOnCategories(newMenu, $event)"
                >
                  Select add-on categories
                </button>
                <p
                  v-if="newMenu.add_on.length"
                  class="grey-label margin-top-10"
                >
                  Selected {{ newMenu.add_on.length }}
                  <span v-if="newMenu.add_on.length === 1">
                    category
                  </span>
                  <span v-else>
                    categories
                  </span>
                </p>
              </div>

              <el-date-picker
                v-model="newMenu.start_from"
                :editable="false"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="From"
              />
              -
              <el-date-picker
                v-model="newMenu.stop_on"
                :editable="false"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="To"
              />
            </div>
          </div>
          <div
            v-show="!imageMode.newMenu"
            class="form-actions right margin-top-20"
          >
            <button
              type="submit"
              class="btn blue"
              :disabled="creating"
            >
              Create
              <i
                v-show="creating"
                class="fa fa-spinner fa-pulse fa-fw"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- END CREATE NEW MENU-->

    <div
      v-if="!$root.activeLocation.id"
      class="alert alert-info center margin-top-20"
    >
      <h4>No Store Selected</h4>
      <p>Please select a store from the stores panel on the right to view its menus</p>
    </div>

    <!-- BEGIN MENUS LIST-->
    <div v-if="$root.activeLocation && $root.activeLocation.id">
      <loading-screen
        :show="loadingMenus"
        :color="'#2C3E50'"
        :display="'inline'"
      />
      <div
        v-if="!loadingMenus"
        class="portlet light portlet-fit bordered margin-top-20"
      >
        <div class="portlet-title bg-blue-chambray">
          <div class="menu-image-main">
            <img src="../../../../public/client_logo.png">
          </div>
          <div class="caption">
            <span class="caption-subject font-default bold uppercase">
              Menus
            </span>
            <div class="caption-desc font-grey-cascade">
              Click on a menu to view its categories.
            </div>
          </div>
          <div
            class="btn-group-vertical pull-right"
            data-toggle="buttons"
          >
            <button
              ref="filterButton0"
              class="btn blue btn-xs"
              :class="{'btn-outline no-hover-highlight' : !menuFilter.includes('0')}"
              @click="setMenuFilter('0')"
            >
              Regular Menus
            </button>
            <button
              ref="filterButton1"
              class="btn blue btn-xs"
              :class="{'btn-outline no-hover-highlight' : !menuFilter.includes('1')}"
              @click="setMenuFilter('1')"
            >
              Catering Menus
            </button>
            <button
              ref="filterButton2"
              class="btn blue btn-xs"
              :class="{'btn-outline no-hover-highlight' : !menuFilter.includes('2')}"
              @click="setMenuFilter('2')"
            >
              Add-on Menus
            </button>
          </div>
        </div>

        <div
          v-if="$root.activeLocation && $root.activeLocation.id"
          class="portlet-body"
        >
          <div class="row">
            <div class="col-md-12">
              <div
                v-show="listErrorMessage.length"
                ref="listErrorMessage"
                class="alert alert-danger"
              >
                <button
                  class="close"
                  @click.prevent="clearError('listErrorMessage')"
                />
                <span>{{ listErrorMessage }}</span>
              </div>
            </div>
          </div>

          <div
            v-show="$root.activeLocation.is_corporate"
            class="row"
          >
            <div class="col-xs-12">
              <el-select
                v-if="menuTiers !== null"
                v-model="indexOfTierToDisplay"
                size="small"
                placeholder="Select Tier"
                :clearable="true"
                @change="updateList()"
              >
                <el-option
                  v-for="(tier, index) in menuTiers"
                  :key="tier.id"
                  :label="tier.name"
                  :value="index"
                />
              </el-select>
            </div>
          </div>

          <div v-if="!storeMenus.length">
            <no-results
              :show="!storeMenus.length"
              :type="'menus'"
              :custom="true"
              :text="customText"
            />
          </div>

          <div class="mt-element-list margin-top-15">
            <div class="mt-list-container list-news ext-1 no-border">
              <ul>
                <li
                  v-for="menu in storeMenus"
                  :id="'menu-' + menu.id"
                  :key="menu.id"
                  class="mt-list-item margin-top-15 clickable"
                  :class="{'animated' : animated === `menu-${menu.id}`}"
                  @click="viewMenuCategories(menu)"
                >
                  <div class="margin-bottom-15 actions-on-top">
                    <el-tooltip
                      v-if="$root.permissions['menu_manager menus update']"
                      content="Edit"
                      effect="light"
                      placement="top"
                    >
                      <a
                        class="btn btn-circle btn-icon-only btn-default"
                        @click="editMenu(menu, $event)"
                      >
                        <i class="fa fa-lg fa-pencil" />
                      </a>
                    </el-tooltip>
                    <el-tooltip
                      v-if="$root.permissions['menu_manager menus read'] && !$root.permissions['menu_manager menus update']"
                      content="View"
                      effect="light"
                      placement="top"
                    >
                      <a
                        class="btn btn-circle btn-icon-only btn-default"
                        @click="editMenu(menu, $event)"
                      >
                        <i class="fa fa-lg fa-eye" />
                      </a>
                    </el-tooltip>
                    <el-tooltip
                      v-if="
                        $root.permissions['menu_manager menus menu_hours read'] ||
                          $root.permissions['menu_manager menus menu_hours create'] ||
                          $root.permissions['menu_manager menus menu_hours update']
                      "
                      content="Menu Hours"
                      effect="light"
                      placement="top"
                    >
                      <a
                        class="btn btn-circle btn-icon-only btn-default"
                        @click="showMenuHours(menu, $event)"
                      >
                        <i class="fa fa-lg fa-clock-o" />
                      </a>
                    </el-tooltip>
                    <el-tooltip
                      v-if="$root.permissions['add category addons']"
                      content="Apply Add-on Category"
                      effect="light"
                      placement="top"
                    >
                      <a
                        v-if="menuFilter !== '2'"
                        class="btn btn-circle btn-icon-only btn-default"
                        @click="applyAddOnCategories(menu, $event)"
                      >
                        <i class="icon-layers" />
                      </a>
                    </el-tooltip>
                    <el-tooltip
                      v-if="$root.permissions['menu_manager menus copy_menu']"
                      content="Duplicate"
                      effect="light"
                      placement="top"
                    >
                      <a
                        class="btn btn-circle btn-icon-only btn-default"
                        @click="duplicateMenu(menu, $event)"
                      >
                        <i class="fa fa-lg fa-clone" />
                      </a>
                    </el-tooltip>
                    <el-tooltip
                      v-if="$root.permissions['menu_manager menus copy_menu']"
                      content="Copy"
                      effect="light"
                      placement="top"
                    >
                      <a
                        class="btn btn-circle btn-icon-only btn-default"
                        @click="copyMenu(menu, $event)"
                      >
                        <i class="fa fa-lg fa-files-o" />
                      </a>
                    </el-tooltip>
                    <el-tooltip
                      v-if="$root.permissions['menu_manager menus delete']"
                      content="Delete"
                      effect="light"
                      placement="top"
                    >
                      <a
                        class="btn btn-circle btn-icon-only btn-default"
                        @click="deleteMenu(menu, $event)"
                      >
                        <i class="fa fa-lg fa-trash" />
                      </a>
                    </el-tooltip>
                  </div>
                  <div class="list-icon-container">
                    <i class="fa fa-angle-right" />
                  </div>
                  <div class="list-thumb">
                    <a v-if="menu.image_url.length">
                      <img
                        alt=""
                        :src="menu.image_url"
                      >
                    </a>
                    <a v-else>
                      <img src="../../../assets/img/app/image-placeholder.png">
                    </a>
                  </div>
                  <div class="list-datetime bold uppercase font-red">
                    <span>{{ menu.name }}</span>
                  </div>
                  <div class="list-item-content row">
                    <div class="col-md-4">
                      <strong>Description:</strong>
                      <span>{{ menu.desc }}</span><br>
                      <strong>Status:</strong>
                      <span v-if="menu.status == 1">
                        Available
                      </span>
                      <span v-if="menu.status == 0">
                        Sold Out
                      </span>
                    </div>
                    <div
                      v-show="menu.start_from || menu.stop_on"
                      class="col-md-4"
                    >
                      <strong>From:</strong>
                      <span>{{ menu.start_from }}</span><br>
                      <strong>To:</strong>
                      <span>{{ menu.stop_on }}</span><br>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- END MENUS LIST-->

    <apply-add-on-categories
      v-if="addOnCategoriesModalActive"
      :passed-menu="passedMenu"
      @closeAddOnCategoriesModal="closeAddOnCategoriesModal"
      @updateAddOnCategories="updateAddOnCategories"
    />

    <edit-menu
      v-if="editMenuModalActive"
      :passed-menu-id="passedMenuId"
      @closeEditMenuModal="closeEditMenuModal"
      @updateMenu="updateMenu"
    />

    <menu-hours
      v-if="menuHoursModalActive"
      :menu="menuToAssignHoursTo"
      @closeHoursModal="closeMenuHoursModal"
    />

    <duplicate-menu
      v-if="duplicateMenuModalActive"
      :passed-menu-id="passedMenuId"
      @closeDuplicateMenuModal="closeDuplicateMenuModal"
      @duplicateSuccess="confirmDuplicateSuccess"
    />

    <copy-menu
      v-if="copyMenuModalActive"
      :passed-menu-id="passedMenuId"
      @closeCopyMenuModal="closeCopyMenuModal"
      @copySuccess="confirmCopySuccess"
    />

    <delete-menu
      v-if="deleteMenuModalActive"
      :passed-menu-id="passedMenuId"
      @closeDeleteMenuModal="closeDeleteMenuModal"
      @deleteMenuAndCloseModal="deleteMenuAndCloseModal"
    />
  </div>
</template>

<script>
import $ from 'jquery'
import Breadcrumb from '../../modules/Breadcrumb'
import Modal from '../../modules/Modal'
import NoResults from '../../modules/NoResults'
import LoadingScreen from '../../modules/LoadingScreen'
import MenusFunctions from '../../../controllers/Menus'
import Categories from './Categories'
import EditMenu from './Menus/EditMenu'
import DuplicateMenu from './Menus/DuplicateMenu'
import CopyMenu from './Menus/CopyMenu'
import ApplyAddOnCategories from './Menus/ApplyAddOnCategories'
import DeleteMenu from './Menus/DeleteMenu'
import MenuHours from './Menus/MenuHours'
import ResourcePicker from '../../modules/ResourcePicker'
import ajaxErrorHandler from '@/controllers/ErrorController'
import MenuTiersFunctions from '@/controllers/MenuTiers'

export default {
  components: {
    Breadcrumb,
    LoadingScreen,
    Categories,
    ApplyAddOnCategories,
    EditMenu,
    DeleteMenu,
    NoResults,
    Modal,
    MenuHours,
    ResourcePicker,
    DuplicateMenu,
    CopyMenu
  },
  data () {
    return {
      breadcrumbArray: [
        { name: 'Menu Manager', link: false },
        { name: 'Menus', link: false }
      ],
      storeMenus: [],
      loadingMenus: false,
      errorMessage: '',
      editMenuModalActive: false,
      deleteMenuModalActive: false,
      addOnCategoriesModalActive: false,
      passedMenuId: 0,
      passedMenu: {},
      creating: false,
      newMenu: {
        id: 'new',
        name: '',
        desc: '',
        image_url: '',
        user_id: this.$root.createdBy,
        status: 1,
        addon: 0,
        catering: 0,
        min: '',
        max: '',
        sku: '',
        order: null,
        start_from: '',
        stop_on: '',
        add_on: [],
        pos: false,
        kiosk: false,
        online: false,
        web: false
      },
      createMenuCollapse: true,
      menuHoursModalActive: false,
      promptForLocation: false,
      menuFilter: ['0'],
      animated: '',
      menuToAssignHoursTo: {},
      imageMode: {
        newMenu: false
      },
      duplicateMenuModalActive: false,
      copyMenuModalActive: false,
      menuTiers: null,
      listErrorMessage: '',
      indexOfTierToDisplay: null
    }
  },
  computed: {
    customText () {
      if (!this.indexOfTierToDisplay) {
        return 'This location does not have any Menus.'
      } else {
        return 'This Tier does not have any Menus.'
      }
    }
  },
  watch: {
    '$root.activeLocation' () {
      this.getStoreMenus()
      this.indexOfTierToDisplay = null
      this.getMenuTiers()
    },
    menuFilter () {
      this.getStoreMenus()
    }
  },
  mounted () {
    if (this.$root.activeLocation && this.$root.activeLocation.id) {
      this.getStoreMenus()
    }
    this.getMenuTiers()
  },
  methods: {
    setMenuFilter (selectedType) {
      const indexOfSelected = this.menuFilter.indexOf(selectedType)
      let updated = []

      if (selectedType === '0') {
        updated = ['0']
      } else {
        if (indexOfSelected === -1) {
          updated = this.menuFilter.filter(type => type !== '0')
          updated.push(selectedType)
        } else {
          updated = this.menuFilter.filter(type => type !== selectedType)
        }
      }
      if (updated.length === 0) {
        updated = ['0']
      }
      this.menuFilter = updated
      this.$refs[`filterButton${selectedType}`].blur()
    },
    /**
		 * To update the modifiers shown in the list based on user's filter selection
		 * @function
		 * @returns {undefined}
		 */
    updateList () {
      if (this.indexOfTierToDisplay !== '') {
        this.getMenuTierDetails()
      } else {
        this.getStoreMenus()
      }
    },
    /**
		 * To fetch a list of modifiers for a tier
		 * @function
		 * @returns {object} - A network call promise
		 */
    getMenuTierDetails () {
      let menusVue = this
      const tier = menusVue.menuTiers[menusVue.indexOfTierToDisplay]
      return MenuTiersFunctions.getTierMenus(tier.id)
        .then(response => {
          menusVue.storeMenus = response.payload
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorName: 'listErrorMessage',
            errorText: "We couldn't fetch modifiers for this tier",
            vue: menusVue
          })
        })
    },
    /**
		 * To fetch a list of Menu Tiers
		 * @function
		 * @returns {object} Network call promise
		 */
    getMenuTiers () {
      let menusVue = this
      return MenuTiersFunctions.getMenuTiers()
        .then(response => {
          menusVue.menuTiers = response.payload
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorName: 'listErrorMessage',
            errorText: "We couldn't fetch modifier tiers",
            vue: menusVue
          })
        })
    },
    /**
		 * To display the modal for copying menus.
		 * @function
		 * @param {object} menu - The selected menu
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
    copyMenu (menu, event) {
      event.stopPropagation()
      this.passedMenuId = menu.id
      this.copyMenuModalActive = true
    },
    /**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {integer} ids - Array of location IDs menu was copied to
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    confirmCopySuccess ({ ids, payload }) {
      if (ids.includes(this.$root.activeLocation.id)) {
        this.getStoreMenus()
      }
      this.closeCopyMenuModal()

      let title = 'Success'
      let text = 'The Menu has been created'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The Menu has been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      })
    },
    /**
		 * To close the menu copy modal
		 * @function
		 * @returns {undefined}
		 */
    closeCopyMenuModal () {
      this.copyMenuModalActive = false
    },
    /**
		 * To display the modal for duplicating menus.
		 * @function
		 * @param {object} menu - The selected menu
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
    duplicateMenu (menu, event) {
      event.stopPropagation()
      this.passedMenuId = menu.id
      this.duplicateMenuModalActive = true
    },
    /**
		 * To confirm the duplication succeeded
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    confirmDuplicateSuccess (payload = {}) {
      this.getStoreMenus()
      this.closeDuplicateMenuModal()

      let title = 'Success'
      let text = 'The Menu has been created'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The Menu has been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      })
    },
    /**
		 * To close the menu duplication modal
		 * @function
		 * @returns {undefined}
		 */
    closeDuplicateMenuModal () {
      this.duplicateMenuModalActive = false
    },
    /**
		 * To toggle between the open and closed state of the resource picker
		 * @function
		 * @param {string} object - The name of the object the image is for
		 * @param {object} value - The open / closed value of the picker
		 * @returns {undefined}
		 */
    toggleImageMode (object, value) {
      this.imageMode[object] = value
    },
    /**
		 * To display the add-on categories modal
		 * @function
		 * @param {object} menu - The menu to apply the category to
		 * @param {object} event - The click event that initiated the action
		 * @returns {undefined}
		 */
    selectAddOnCategories (menu, event) {
      event.stopPropagation()
      event.preventDefault()
      this.passedMenu = menu
      this.addOnCategoriesModalActive = true
    },
    /**
		 * To display the add-on categories modal
		 * @function
		 * @param {object} menu - The menu to apply the category to
		 * @param {object} event - The click event that initiated the action
		 * @returns {undefined}
		 */
    applyAddOnCategories (menu, event) {
      event.stopPropagation()
      event.preventDefault()
      this.passedMenu = menu
      this.addOnCategoriesModalActive = true
    },
    /**
		 * To get a list of menus for the current store.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getStoreMenus () {
      this.loadingMenus = true
      this.storeMenus = []
      var menusVue = this
      let params = {}
      if (this.menuFilter.includes('1')) {
        params.catering = 1
      }
      if (this.menuFilter.includes('2')) {
        params.addon = 1
      }
      return MenusFunctions.getStoreMenus(
        menusVue.$root.appId,
        menusVue.$root.appSecret,
        menusVue.$root.activeLocation.id,
        params
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            menusVue.storeMenus = response.payload
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorName: 'listErrorMessage',
            errorText: 'We could not fetch menus',
            vue: menusVue
          })
        })
        .finally(() => {
          menusVue.loadingMenus = false
        })
    },
    /**
		 * To route to the categories page for the selected menu.
		 * @function
		 * @param {object} menu - The selected menu
		 * @returns {undefined}
		 */
    viewMenuCategories (menu) {
      this.$root.activeMenuId = menu.id
      this.$router.push('categories/' + menu.id)
    },
    /**
		 * To display the modal for editing menus.
		 * @function
		 * @param {object} menu - The selected menu
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
    editMenu (menu, event) {
      event.stopPropagation()
      this.passedMenuId = menu.id
      this.editMenuModalActive = true
    },
    /**
		 * To display the modal for menus hours.
		 * @function
		 * @param {object} menu - The selected menu
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
    showMenuHours (menu, event) {
      event.stopPropagation()
      this.menuToAssignHoursTo = menu
      this.menuHoursModalActive = true
    },
    /**
		 * To display the modal for deleting menu.
		 * @function
		 * @param {object} menu - The selected menu
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
    deleteMenu (menu, event) {
      event.stopPropagation()
      this.passedMenuId = menu.id
      this.deleteMenuModalActive = true
    },
    /**
		 * To close the modal for editing menus.
		 * @function
		 * @returns {undefined}
		 */
    closeEditMenuModal () {
      this.editMenuModalActive = false
    },
    /**
		 * To close the modal for menu hours.
		 * @function
		 * @returns {undefined}
		 */
    closeMenuHoursModal () {
      this.menuHoursModalActive = false
    },
    /**
		 * To close the modal for deleting menus.
		 * @function
		 * @returns {undefined}
		 */
    closeDeleteMenuModal () {
      this.deleteMenuModalActive = false
    },
    /**
		 * To close the modal for adding add-on categories.
		 * @function
		 * @returns {undefined}
		 */
    closeAddOnCategoriesModal () {
      this.addOnCategoriesModalActive = false
    },
    /**
		 * To close the modal for deleting menus and remove menu from DOM.
		 * @function
		 * @returns {undefined}
		 */
    deleteMenuAndCloseModal () {
      this.deleteMenuModalActive = false
      this.getStoreMenus()
    },
    /**
		 * To clear the new menu form.
		 * @function
		 * @returns {undefined}
		 */
    clearNewMenu () {
      this.newMenu = {
        id: 'new',
        name: '',
        desc: '',
        image_url: '',
        user_id: this.$root.createdBy,
        status: 1,
        addon: 0,
        catering: 0,
        min: '',
        max: '',
        sku: '',
        order: null,
        start_from: '',
        stop_on: '',
        add_on: [],
        pos: false,
        kiosk: false,
        online: false,
        web: false
      }
    },
    /**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    showAlert (payload = {}) {
      let title = 'Success'
      let text = 'The Menu has been created'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The Menu has been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      })
    },
    /**
		 * To update the menu object emitted by the child.
		 * @function
		 * @param {object} menu - The updated menu object
		 * @returns {undefined}
		 */
    updateMenu ({ menu, payload }) {
      this.editMenuModalActive = false
      for (let i = 0; i < this.storeMenus.length; i++) {
        if (this.storeMenus[i].id === menu.id) {
          this.storeMenus.splice(i, 1)
          break
        }
      }
      var done = false
      for (let i = 0; i < this.storeMenus.length; i++) {
        if (
          parseInt(this.storeMenus[i].order) < parseInt(menu.order) ||
					(parseInt(this.storeMenus[i].order) === parseInt(menu.order) &&
						parseInt(this.storeMenus[i].id) > parseInt(menu.id))
        ) {
          this.storeMenus.splice(i, 0, menu)
          done = true
          break
        }
      }
      if (!done) {
        this.storeMenus.push(menu)
      }
      setTimeout(function () {
        $('#menu-' + menu.id).addClass('highlight')
        setTimeout(function () {
          $('#menu-' + menu.id).removeClass('highlight')
        }, 2000)
      }, 10)

      this.showUpdateSuccess(payload)
    },
    /**
		 * To confirm the duplication succeeded
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    showUpdateSuccess (payload = {}) {
      this.getStoreMenus()
      this.closeDuplicateMenuModal()

      let title = 'Success'
      let text = 'The Menu has been updated'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The changes have been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      })
    },
    /**
		 * To update the add on categories.
		 * @function
		 * @param {object} val - The updated categories
		 * @returns {undefined}
		 */
    updateAddOnCategories (val) {
      if (this.passedMenu.id === 'new') {
        this.newMenu.add_on = val.map(category => category.addon_category_id)
      } else {
        this.storeMenus.forEach(menu => {
          if (menu.id === this.passedMenu.id) {
            menu.add_on = val
          }
        })
        this.animated = `menu-${this.passedMenu.id}`
        let menusVue = this
        window.setTimeout(() => {
          menusVue.animated = ''
        }, 3000)
      }
      this.addOnCategoriesModalActive = false
      this.passedMenu = {}
    },
    /**
		 * To check if the menu data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    validateMenuData () {
      var createMenuVue = this
      return new Promise(function (resolve, reject) {
        if (!createMenuVue.newMenu.image_url.length) {
          reject('Menu image cannot be blank')
        } else if (!createMenuVue.newMenu.name.length) {
          reject('Menu name cannot be blank')
        } else if (!$.isNumeric(createMenuVue.newMenu.order)) {
          reject('Menu order should be a number')
        } else if (!createMenuVue.newMenu.desc.length) {
          reject('Menu description cannot be blank')
        } else if (!createMenuVue.newMenu.sku.length) {
          reject('Menu SKU cannot be blank')
        } else if (
          createMenuVue.newMenu.start_from &&
					!createMenuVue.newMenu.stop_on
        ) {
          reject('Please provide an end date')
        } else if (
          !createMenuVue.newMenu.start_from.length &&
					createMenuVue.newMenu.stop_on.length
        ) {
          reject('Please provide a start date')
        } else if (
          createMenuVue.newMenu.catering &&
					!createMenuVue.newMenu.min
        ) {
          reject('Minimum order value cannot be blank')
        } else if (
          createMenuVue.newMenu.catering &&
					!createMenuVue.newMenu.max
        ) {
          reject('Maximum order value cannot be blank')
        }
        resolve('Hurray')
      })
    },
    /**
		 * To create a new menu.
		 * @function
		 * @param {object} event - The click event that prompted this function.
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    createNewMenu (event) {
      var createMenuVue = this
      createMenuVue.clearError()

      return createMenuVue
        .validateMenuData()
        .then(response => {
          createMenuVue.creating = true
          let payload = {
            ...createMenuVue.newMenu,
            location_id: createMenuVue.$root.activeLocation.id,
            pos: createMenuVue.newMenu.pos ? 1 : 0,
            kiosk: createMenuVue.newMenu.kiosk ? 1 : 0,
            online: createMenuVue.newMenu.online ? 1 : 0,
            web: createMenuVue.newMenu.web ? 1 : 0
          }
          MenusFunctions.createNewMenu(
            payload,
            createMenuVue.$root.appId,
            createMenuVue.$root.appSecret,
            createMenuVue.$root.userToken
          )
            .then(response => {
              if (response.code === 200 && response.status === 'ok') {
                createMenuVue.getStoreMenus()
                createMenuVue.clearNewMenu()
                createMenuVue.showAlert(response.payload)
              } else {
                createMenuVue.errorMessage = response.message
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorName: 'errorMessage',
                errorText: 'We could not create the menu',
                vue: createMenuVue
              })
            })
            .finally(() => {
              createMenuVue.creating = false
            })
        })
        .catch(reason => {
          // If validation fails then display the error message
          createMenuVue.errorMessage = reason
          window.scrollTo(0, 0)
          throw reason
        })
    },
    /**
		 * To clear the current error.
		 * @function
		 * @returns {undefined}
		 */
    clearError () {
      this.errorMessage = ''
    },
    /**
		 * To set the image to be same as the one emitted by the gallery modal.
		 * @function
		 * @param {object} val - The emitted image object.
		 * @returns {undefined}
		 */
    updateImage (val) {
      this.newMenu.image_url = val.image_url
    },
    /**
		 * To toggle the create menu panel, initially set to opened
		 * @function
		 * @returns {undefined}
		 */
    toggleCreateMenuPanel () {
      this.createMenuCollapse = !this.createMenuCollapse
    }
  }
}
</script>

<style scoped>
.height-mod {
  min-height: 60px;
}
.mt-element-list .list-news.mt-list-container.no-border {
  border: none;
}
.clickable {
  cursor: pointer;
}
.green {
  color: rgba(46, 204, 64, 0.8);
}
.portlet > .portlet-title > .tools.custom {
  float: left;
}
.actions-on-top {
  margin-top: -5px;
}
.animated {
  animation: listItemHighlight 1s 2 ease-in-out both;
}
.grey-label {
  margin-top: 5px;
  color: rgb(153, 153, 153);
}
.no-hover-highlight {
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.18) 0px 1px 2px 0px !important;
  border-color: rgb(53, 152, 220) !important;
  color: rgb(53, 152, 220) !important;
  background-color: rgba(0, 0, 0, 0) !important;
}
</style>
