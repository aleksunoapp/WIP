<template>
  <div>
    <!-- BEGIN PAGE BAR -->
    <div class="page-bar">
      <breadcrumb :crumbs="breadcrumbArray" />
    </div>
    <!-- END PAGE BAR -->
    <!-- BEGIN PAGE TITLE-->
    <h1 class="page-title">
      Modifier Items
    </h1>
    <!-- END PAGE TITLE-->
    <div class="note note-info">
      <p>View items for modifier category '{{ modifierCategoryDetails.name }}'.</p>
    </div>
    <!-- BEGIN CREATE NEW MODIFIER ITEM -->
    <div
      v-if="$root.activeLocation && $root.activeLocation.id && $root.permissions['menu_manager modifiers items create']"
      class="portlet box blue-hoki"
    >
      <div
        class="portlet-title bg-blue-chambray"
        @click="toggleCreateModifierItemPanel()"
      >
        <div class="custom tools">
          <a :class="{'expand': !createModifierItemCollapse, 'collapse': createModifierItemCollapse}" />
        </div>
        <div class="caption">
          &emsp;Create A New Modifier Item
        </div>
      </div>
      <div
        class="portlet-body"
        :class="{'display-hide': createModifierItemCollapse}"
      >
        <form
          role="form"
          @submit.prevent="addNewModifierItem()"
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
                  @click.prevent="clearError('errorMessage')"
                />
                <span>{{ errorMessage }}</span>
              </div>
            </div>
            <div :class="{'col-md-2' : !imageMode.newMenu, 'col-md-12' : imageMode.newMenu}">
              <resource-picker
                :image-button="true"
                :image-url="newModifierItem.image_url"
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
                  id="form_control_1"
                  v-model="newModifierItem.name"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newModifierItem.name.length}"
                >
                <label for="form_control_1">
                  Modifier Item Name
                </label>
              </div>
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_2"
                  v-model="newModifierItem.desc"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newModifierItem.desc.length}"
                >
                <label for="form_control_2">
                  Modifier Item Description
                </label>
              </div>
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_3"
                  v-model="newModifierItem.price"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newModifierItem.price.length}"
                >
                <label for="form_control_3">
                  Modifier Item Price
                </label>
              </div>
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_4"
                  v-model="newModifierItem.sku"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newModifierItem.sku.length}"
                >
                <label for="form_control_4">
                  Modifier Item SKU
                </label>
              </div>
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_5"
                  v-model="newModifierItem.min"
                  type="number"
                  class="form-control input-sm"
                  :class="{'edited': newModifierItem.min}"
                >
                <label for="form_control_5">
                  Modifier Item Min
                </label>
              </div>
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_6"
                  v-model="newModifierItem.max"
                  type="number"
                  class="form-control input-sm"
                  :class="{'edited': newModifierItem.max}"
                >
                <label for="form_control_6">
                  Modifier Item Max
                </label>
              </div>
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_7"
                  v-model="newModifierItem.order"
                  type="number"
                  class="form-control input-sm"
                  :class="{'edited': newModifierItem.order}"
                >
                <label for="form_control_7">
                  Modifier Item Order
                </label>
              </div>
            </div>
            <div
              v-show="!imageMode.newMenu"
              class="col-md-5"
            >
              <div class="form-group form-md-line-input form-md-floating-label">
                <label>Modifier Item Status:</label><br>
                <el-switch
                  v-model="newModifierItem.status"
                  active-color="#0c6"
                  inactive-color="#ff4949"
                  :active-value="1"
                  :inactive-value="0"
                  active-text="Available"
                  inactive-text="Sold Out"
                />
              </div>
              <div class="form-group form-md-line-input form-md-floating-label">
                <label>Override:</label><br>
                <el-switch
                  v-model="newModifierItem.override"
                  active-color="#0c6"
                  inactive-color="#ff4949"
                  :active-value="1"
                  :inactive-value="0"
                  active-text="Yes"
                  inactive-text="No"
                />
              </div>
              <div class="form-group form-md-line-input form-md-floating-label">
                <label>Show on POS?</label><br>
                <el-switch
                  v-model="newModifierItem.show_on_pos"
                  active-color="#0c6"
                  inactive-color="#ff4949"
                  :active-value="1"
                  :inactive-value="0"
                  active-text="Yes"
                  inactive-text="No"
                />
              </div>
            </div>
          </div>
          <div
            v-show="!imageMode.newMenu"
            class="form-actions right margin-top-20"
          >
            <button
              type="submit"
              :disabled="creating"
              class="btn blue"
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
    <!-- END CREATE NEW MODIFIER ITEM -->
    <loading-screen
      :show="displayModifierItemData"
      :color="'#2C3E50'"
      :display="'inline'"
    />
    <div v-if="$root.activeLocation && $root.activeLocation.id && !displayModifierItemData">
      <div class="portlet light portlet-fit bordered margin-top-20">
        <div class="portlet-title bg-blue-chambray">
          <div class="menu-image">
            <img :src="modifierCategoryDetails.image_url">
          </div>
          <div class="caption">
            <span class="caption-subject font-default bold uppercase">
              {{ modifierCategoryDetails.name }}
            </span>
            <div class="caption-desc font-grey-cascade">
              {{ modifierCategoryDetails.desc }}
            </div>
          </div>
        </div>
        <div class="portlet-body">
          <div class="row">
            <div class="col-md-12">
              <div
                v-show="listErrorMessage"
                ref="listErrorMessage"
                class="alert alert-danger"
              >
                <button
                  class="close"
                  @click="clearError('listErrorMessage')"
                />
                <span>{{ listErrorMessage }}</span>
              </div>
            </div>
          </div>
          <div
            v-if="modifierCategoryItems.length"
            class="mt-element-list margin-top-15"
          >
            <div class="mt-list-container list-news ext-1 no-border">
              <ul>
                <li
                  v-for="modifierItem in modifierCategoryItems"
                  :id="'modifierItem-' + modifierItem.id"
                  :key="modifierItem.id"
                  class="mt-list-item margin-top-15"
                  :class="{'no-hover-highlight' : expanded === modifierItem.id, 'clickable' : expanded !== modifierItem.id}"
                  @click="expandDetails(modifierItem.id)"
                >
                  <div class="margin-bottom-15 actions-on-top">
                    <el-tooltip
                      v-if="$root.permissions['menu_manager modifiers items update']"
                      content="Edit"
                      effect="light"
                      placement="right"
                    >
                      <a
                        class="btn btn-circle btn-icon-only btn-default"
                        @click="displayEditItemModal(modifierItem, $event)"
                      >
                        <i class="fa fa-lg fa-pencil" />
                      </a>
                    </el-tooltip>
                    <el-tooltip
                      v-if="$root.permissions['menu_manager modifiers items read'] && !$root.permissions['menu_manager modifiers items update']"
                      content="View"
                      effect="light"
                      placement="right"
                    >
                      <a
                        class="btn btn-circle btn-icon-only btn-default"
                        @click="displayEditItemModal(modifierItem, $event)"
                      >
                        <i class="fa fa-lg fa-eye" />
                      </a>
                    </el-tooltip>
                    <el-tooltip
                      v-if="$root.permissions['menu_manager modifiers items nutrition read']"
                      content="Nutrition info"
                      effect="light"
                      placement="right"
                    >
                      <a
                        class="btn btn-circle btn-icon-only btn-default"
                        @click="viewModifierNutritionInfo(modifierItem, $event)"
                      >
                        <i class="fa fa-lg fa-heartbeat" />
                      </a>
                    </el-tooltip>
                    <el-tooltip
                      v-if="$root.permissions['menu_manager modifiers items update']"
                      content="Apply To Locations"
                      effect="light"
                      placement="right"
                    >
                      <a
                        class="btn btn-circle btn-icon-only btn-default"
                        @click="openApplyToLocationsModal(modifierItem)"
                      >
                        <i class="icon-layers" />
                      </a>
                    </el-tooltip>
                    <el-tooltip
                      v-if="$root.permissions['menu_manager modifiers items delete']"
                      content="Delete"
                      effect="light"
                      placement="right"
                    >
                      <a
                        class="btn btn-circle btn-icon-only btn-default"
                        @click="displayDeleteItemModal(modifierItem, $event)"
                      >
                        <i class="fa fa-lg fa-trash" />
                      </a>
                    </el-tooltip>
                  </div>
                  <div
                    v-show="expanded !== modifierItem.id"
                    class="list-icon-container"
                  >
                    <a>
                      <i
                        :id="'icon-' + modifierItem.id"
                        class="fa fa-angle-right"
                      />
                    </a>
                  </div>
                  <div class="list-thumb">
                    <a v-if="modifierItem.image_url.length">
                      <img
                        alt=""
                        :src="modifierItem.image_url"
                      >
                    </a>
                    <a v-else>
                      <img src="../../../assets/img/app/login/bg1.jpg">
                    </a>
                  </div>
                  <div class="list-datetime bold uppercase font-red">
                    <span>{{ modifierItem.name }}</span>
                  </div>
                  <div class="row">
                    <div class="col-md-4">
                      <strong>Price:</strong>
                      <span>{{ modifierItem.price }}</span><br>
                      <strong>SKU:</strong>
                      <span>{{ modifierItem.sku }}</span><br>
                    </div>
                    <div class="col-md-4">
                      <strong>Min:</strong>
                      <span>{{ modifierItem.min }}</span><br>
                      <strong>Max:</strong>
                      <span>{{ modifierItem.max }}</span>
                    </div>
                    <div class="col-md-4">
                      <strong>Status:</strong>
                      <span v-if="modifierItem.status == 1">
                        Available
                      </span>
                      <span v-if="modifierItem.status == 0">
                        Sold Out
                      </span>
                      <strong>Description:</strong>
                      <span>{{ modifierItem.desc }}</span>
                    </div>
                  </div>
                  <div
                    class="row"
                    :class="{'mt-list-item-expanded' : expanded === modifierItem.id, 'mt-list-item-collapsed' : expanded !== modifierItem.id}"
                  >
                    <div class="col-md-4">
                      <div class="col-md-12">
                        <h5 class="inline-block">
                          Tags
                        </h5>
                      </div>
                      <div class="col-md-12">
                        <div v-if="modifierItem.tags && modifierItem.tags.length">
                          <ul class="item-modifier-list">
                            <li
                              v-for="tag in modifierItem.tags"
                              :key="tag.id"
                              class="col-md-6"
                            >
                              {{ tag.name }}
                            </li>
                          </ul>
                        </div>
                        <div
                          v-if="!modifierItem.tags || !modifierItem.tags.length"
                          class="col-md-12"
                        >
                          <p class="grey-text">
                            No tags have been applied to this modifier item.
                          </p>
                        </div>
                        <div class="col-md-12">
                          <button
                            v-if="$root.permissions['menu_manager modifiers items update tags']"
                            type="button"
                            class="btn btn-outline btn-xs blue margin-top-10"
                            @click="showTagsModal(modifierItem.id, modifierItem.tags)"
                          >
                            Add Tags
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="col-md-12">
                        <h5 class="inline-block">
                          Portions
                        </h5>
                      </div>
                      <div class="col-md-12">
                        <div v-if="modifierItem.modifier_item_portions && modifierItem.modifier_item_portions.length">
                          <ul class="item-modifier-list">
                            <li
                              v-for="portion in modifierItem.modifier_item_portions"
                              :key="portion.id"
                              class="col-md-6"
                            >
                              {{ portion.name }}
                            </li>
                          </ul>
                        </div>
                        <div
                          v-if="!modifierItem.modifier_item_portions || !modifierItem.modifier_item_portions.length"
                          class="col-md-12"
                        >
                          <p class="grey-text">
                            No portions have been applied to this modifier item.
                          </p>
                        </div>
                        <div class="col-md-12">
                          <button
                            v-if="$root.permissions['menu_manager modifiers items update portions']"
                            type="button"
                            class="btn btn-outline btn-xs blue margin-top-10"
                            @click="showPortionsModal(modifierItem.id, modifierItem.modifier_item_portions)"
                          >
                            Add Portions
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="col-md-12">
                        <h5 class="inline-block">
                          Options
                        </h5>
                      </div>
                      <div class="col-md-12">
                        <div v-if="modifierItem.options && modifierItem.options.length">
                          <ul class="item-modifier-list">
                            <li
                              v-for="option in modifierItem.options"
                              :key="option.id"
                              class="col-md-6"
                            >
                              {{ option.name }}
                            </li>
                          </ul>
                        </div>
                        <div
                          v-if="!modifierItem.options || !modifierItem.options.length"
                          class="col-md-12"
                        >
                          <p class="grey-text">
                            No options have been applied to this modifier item.
                          </p>
                        </div>
                        <div class="col-md-12">
                          <button
                            v-if="$root.permissions['menu_manager modifiers items update options']"
                            type="button"
                            class="btn btn-outline btn-xs blue margin-top-10"
                            @click="showOptionsModal(modifierItem.id, modifierItem.options)"
                          >
                            Add Options
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div
            v-else
            class="margin-top-20"
          >
            <no-results
              :show="!modifierCategoryItems.length"
              :type="'categories'"
              :custom="true"
              :text="customText"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="!displayModifierItemData"
      class="margin-top-20"
    >
      <no-results
        :show="!$root.activeLocation || !$root.activeLocation.id"
        :type="'modifier items'"
      />
    </div>

    <!-- ASSIGN TO STORES MODAL START -->
    <modal
      ref="applyToLocationsModal"
      :show="showApplyToLocationsModal"
      effect="fade"
      @closeOnEscape="closeApplyToLocationsModal"
    >
      <div
        slot="modal-header"
        class="modal-header center"
      >
        <button
          type="button"
          class="close"
          @click="closeApplyToLocationsModal()"
        >
          <span>&times;</span>
        </button>
        <h4 class="modal-title center">
          Assign {{ modifierToApplyToLocations.name }} To Stores
        </h4>
      </div>
      <div
        slot="modal-body"
        class="modal-body relative-block"
      >
        <div
          v-show="applyErrorMessage.length"
          ref="applyErrorMessage"
          class="alert alert-danger"
        >
          <button
            class="close"
            data-close="alert"
            @click="clearError('applyErrorMessage')"
          />
          <span>{{ applyErrorMessage }}</span>
        </div>
        <store-picker
          v-if="showApplyToLocationsModal"
          @update="selectedLocations"
        />
      </div>
      <div
        slot="modal-footer"
        class="modal-footer"
      >
        <button
          type="button"
          class="btn blue"
          :disabled="assigningModifierToLocations"
          @click="applyModifierToLocations()"
        >
          Assign
          <i
            v-show="assigningModifierToLocations"
            class="fa fa-spinner fa-pulse fa-fw"
          />
        </button>
      </div>
    </modal>
    <!-- ASSIGN TO STORES MODAL END -->

    <edit-modifier-item
      v-if="editItemModalActive"
      @editModifierItem="editModifierItem"
      @deactivateEditItemModal="closeEditItemModal"
    />
    <delete-modifier-item
      v-if="deleteItemModalActive"
      :item-id="selectedItemId"
      @closeDeleteModifierItemModal="closeDeleteItemModal"
      @deleteModifierItemAndCloseModal="deleteModifierItemAndCloseModal"
    />
    <modifier-nutrition-info
      v-if="displayNutritionModal"
      :modifier-item="selectedItem"
      @deactivateNutritionInfoModal="displayNutritionModal = false"
    />
    <tags-list
      v-if="displayTagsListModal"
      :item-type="'modifier-item'"
      :applied-tags="appliedTags"
      :selected-item-id="selectedItemId"
      @deactivateTagsListModal="closeTagsListModal"
    />
    <portions-list
      v-if="displayPortionsListModal"
      :item-type="'modifier-item'"
      :applied-portions="appliedPortions"
      :selected-item-id="selectedItemId"
      @closePortionsListModal="closePortionsListModal"
    />
    <options-list
      v-if="displayOptionsListModal"
      :item-type="'modifier-item'"
      :applied-options="appliedOptions"
      :selected-item-id="selectedItemId"
      @closeOptionsListModal="closeOptionsListModal"
    />
  </div>
</template>

<script>
import $ from 'jquery'
import Breadcrumb from '../../modules/Breadcrumb'
import NoResults from '../../modules/NoResults'
import LoadingScreen from '../../modules/LoadingScreen'
import ModifiersFunctions from '../../../controllers/Modifiers'
import EditModifierItem from './Modifiers/EditModifierItem'
import DeleteModifierItem from './Modifiers/DeleteModifierItem'
import ModifierNutritionInfo from './Modifiers/ModifierNutritionInfo'
import TagsList from './Tags/TagsList'
import PortionsList from './Portions/PortionsList'
import OptionsList from './Options/OptionsList'
import ResourcePicker from '../../modules/ResourcePicker'
import ajaxErrorHandler from '@/controllers/ErrorController'
import StorePicker from '@/components/modules/StorePicker'
import Modal from '@/components/modules/Modal'

export default {
  components: {
    Breadcrumb,
    LoadingScreen,
    EditModifierItem,
    DeleteModifierItem,
    ModifierNutritionInfo,
    TagsList,
    NoResults,
    ResourcePicker,
    PortionsList,
    OptionsList,
    StorePicker,
    Modal
  },
  data () {
    return {
      breadcrumbArray: [
        { name: 'Menu Manager', link: false },
        { name: 'Modifiers', link: '/app/menu_manager/modifiers' },
        { name: 'Modifier Items', link: false }
      ],
      editItemModalActive: false,
      deleteItemModalActive: false,
      displayModifierItemData: false,
      displayNutritionModal: false,
      modifierCategoryDetails: {},
      modifierCategoryItems: [],
      selectedItem: {},
      appliedTags: [],
      appliedPortions: [],
      appliedOptions: [],
      selectedItemId: 0,
      displayTagsListModal: false,
      customText:
        'There are no items in this category. Click on the button above to add one.',
      createModifierItemCollapse: true,
      creating: false,
      newModifierItem: {
        modifier_id: this.$route.params.modifier_id,
        name: '',
        desc: '',
        sku: '',
        image_url: '',
        user_id: this.$root.createdBy,
        status: 1,
        price: '',
        min: null,
        max: null,
        order: null,
        override: 0,
        show_on_pos: 0
      },
      showGalleryModal: false,
      errorMessage: '',
      displayPortionsListModal: false,
      displayOptionsListModal: false,
      expanded: null,
      imageMode: {
        newMenu: false
      },
      showApplyToLocationsModal: false,
      assigningModifierToLocations: false,
      modifierToApplyToLocations: {},
      applyErrorMessage: '',
      listErrorMessage: ''
    }
  },
  mounted () {
    if (
      this.$root.activeLocation &&
      this.$root.activeLocation.id &&
      this.$route.params.modifier_id
    ) {
      this.getModifierCategoryDetails()
      this.getModifierCategoryItems()
    }
  },
  methods: {
    /**
     * To update the locations selected in the child component
     * @function
     * @param {array} locations - Arrray of store ids
     * @returns {undefined}
     */
    selectedLocations (locations) {
      this.modifierToApplyToLocations.locations = locations
    },
    /**
     * To open the modal for applying a modifier to locations
     * @function
     * @param {object} modifier - Modifier the user clicked
     * @returns {undefined}
     */
    openApplyToLocationsModal (modifier) {
      this.modifierToApplyToLocations = {
        ...modifier,
        locations: []
      }
      this.showApplyToLocationsModal = true
    },
    /**
     * To close the modal for applying a modifier to locations
     * @function
     * @returns {undefined}
     */
    closeApplyToLocationsModal () {
      this.modifierToApplyToLocations = {}
      this.showApplyToLocationsModal = false
    },
    /**
     * To check if data is ready to post
     * @function
     * @returns {object} - A resolved promise if ok, a reject with error message if failed
     */
    validateApplyToLocations () {
      var modifierItemsVue = this
      return new Promise(function (resolve, reject) {
        if (!modifierItemsVue.modifierToApplyToLocations.locations.length) {
          reject('Select at least one store')
        }
        resolve('Hurray')
      })
    },
    /**
     * To save selected modifier-locaton links in the API
     * @function
     * @returns {undefined}
     */
    applyModifierToLocations () {
      var modifierItemsVue = this
      modifierItemsVue.clearError('applyErrorMessage')

      this.validateApplyToLocations()
        .then(response => {
          modifierItemsVue.assigningModifierToLocations = true
          let payload = {
            modifier_item_id: modifierItemsVue.modifierToApplyToLocations.id,
            locations: modifierItemsVue.modifierToApplyToLocations.locations
          }
          ModifiersFunctions.applyModifierToLocations(payload)
            .then(response => {
              modifierItemsVue.closeApplyToLocationsModal()
              modifierItemsVue.showApplySuccess(response.payload)
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'Could not apply modifier to stores',
                errorName: 'applyErrorMessage',
                vue: modifierItemsVue,
                containterRef: 'applyToLocationsModal'
              })
            })
            .finally(() => {
              modifierItemsVue.assigningModifierToLocations = false
            })
        })
        .catch(reason => {
          // If validation fails then display the error message
          modifierItemsVue.applyErrorMessage = reason
          window.scrollTo(0, 0)
        })
    },
    /**
     * To notify user of the outcome of the call
     * @function
     * @param {object} payload - The payload object from the server response
     * @returns {undefined}
     */
    showApplySuccess (payload = {}) {
      let title = 'Success'
      let text = 'The Modifier Items have been saved'
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
     * To clear an error.
     * @function
     * @param {string} name - Name of the error to clear
     * @returns {undefined}
     */
    clearError (name) {
      this[name] = ''
    },
    /**
     * To set the image to be same as the one emitted by the gallery modal.
     * @function
     * @param {object} val - The emitted image object.
     * @returns {undefined}
     */
    updateImage (val) {
      this.showGalleryModal = false
      this.newModifierItem.image_url = val.image_url
    },
    /**
     * To toggle the create menu panel, initially set to opened
     * @function
     * @returns {undefined}
     */
    toggleCreateModifierItemPanel () {
      this.createModifierItemCollapse = !this.createModifierItemCollapse
    },
    /**
     * To check if the modifier item data is valid before submitting to the backend.
     * @function
     * @returns {object} A promise that will validate the input form
     */
    validateModifierItemData () {
      var modifierItemsVue = this
      return new Promise(function (resolve, reject) {
        if (!modifierItemsVue.newModifierItem.name.length) {
          reject('Modifier Item name cannot be blank')
        } else if (!modifierItemsVue.newModifierItem.desc.length) {
          reject('Modifier Item description cannot be blank')
        } else if (!modifierItemsVue.newModifierItem.sku.length) {
          reject('Modifier Item SKU cannot be blank')
        } else if (!modifierItemsVue.newModifierItem.price.length) {
          reject('Modifier Item price cannot be blank')
        } else if (!modifierItemsVue.newModifierItem.image_url.length) {
          reject('Modifier Item image URL cannot be blank')
        } else if (!$.isNumeric(modifierItemsVue.newModifierItem.status)) {
          reject('Modifier Item status cannot be blank')
        } else if (!$.isNumeric(modifierItemsVue.newModifierItem.min)) {
          reject('Modifier Item min should be a number')
        } else if (!$.isNumeric(modifierItemsVue.newModifierItem.max)) {
          reject('Modifier Item max should be a number')
        } else if (
          Number(modifierItemsVue.newModifierItem.min) >
          Number(modifierItemsVue.newModifierItem.max)
        ) {
          reject('Modifier Item max cannot be larger than min')
        } else if (!$.isNumeric(modifierItemsVue.newModifierItem.order)) {
          reject('Modifier Item order should be a number')
        }
        resolve('Hurray')
      })
    },
    /**
     * To add the new modifier item and close the modal and redirect to the modifier categories page.
     * @function
     * @returns {object} - A promise that will either return an error message or perform an action.
     */
    addNewModifierItem () {
      var modifierItemsVue = this
      modifierItemsVue.clearError('errorMessage')
      this.creating = true
      return modifierItemsVue
        .validateModifierItemData()
        .then(response => {
          ModifiersFunctions.addNewModifierItem(
            modifierItemsVue.newModifierItem,
            modifierItemsVue.$root.appId,
            modifierItemsVue.$root.appSecret,
            modifierItemsVue.$root.userToken
          )
            .then(response => {
              if (response.code === 200 && response.status === 'ok') {
                modifierItemsVue.newModifierItem.id =
                  response.payload.new_modifier_item_id
                if (response.payload && response.payload.pending_approval !== true) {
                  modifierItemsVue.addModifierItem(
                    modifierItemsVue.newModifierItem
                  )
                }
                modifierItemsVue.showAlert(response.payload)
                modifierItemsVue.clearNewModifierItem()
              } else {
                modifierItemsVue.errorMessage = response.message
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'Could not create the item',
                errorName: 'errorMessage',
                vue: modifierItemsVue
              })
            })
            .finally(() => {
              this.creating = false
            })
        })
        .catch(reason => {
          // If validation fails then display the error message
          modifierItemsVue.errorMessage = reason
          window.scrollTo(0, 0)
          throw reason
        })
    },
    /**
     * To get the details of the selected modifier category.
     * @function
     * @returns {object} - A promise that will either return an error message or perform an action.
     */
    getModifierCategoryDetails () {
      var modifierItemsVue = this
      ModifiersFunctions.getModifierCategoryDetails(
        modifierItemsVue.$route.params.modifier_id,
        modifierItemsVue.$root.appId,
        modifierItemsVue.$root.appSecret
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            modifierItemsVue.modifierCategoryDetails = response.payload
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'Could not get category info',
            errorName: 'listErrorMessage',
            vue: modifierItemsVue
          })
        })
    },
    /**
     * To get the list of modifier items for the selected modifier category.
     * @function
     * @returns {object} - A promise that will either return an error message or perform an action.
     */
    getModifierCategoryItems () {
      this.displayModifierItemData = true
      var modifierItemsVue = this
      modifierItemsVue.modifierCategoryItems = []
      return ModifiersFunctions.getModifierCategoryItems(
        modifierItemsVue.$route.params.modifier_id,
        modifierItemsVue.$root.appId,
        modifierItemsVue.$root.appSecret
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            modifierItemsVue.displayModifierItemData = false
            modifierItemsVue.modifierCategoryItems = response.payload
          } else {
            modifierItemsVue.displayModifierItemData = false
          }
        })
        .catch(reason => {
          modifierItemsVue.displayModifierItemData = false
          ajaxErrorHandler({
            reason,
            errorText: 'Could not fetch items',
            errorName: 'listErrorMessage',
            vue: modifierItemsVue
          })
        })
    },
    /**
     * To get the complete details of a modifier item.
     * @function
     * @param {integer} modifierItemId - The selected item id
     * @returns {object} - A promise that will either return an error message or perform an action.
     */
    getModifierItemDetails (modifierItemId) {
      var modifierItemsVue = this
      ModifiersFunctions.getModifierItemDetails(
        modifierItemId,
        modifierItemsVue.$root.appId,
        modifierItemsVue.$root.appSecret
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            for (
              var i = 0;
              i < modifierItemsVue.modifierCategoryItems.length;
              i++
            ) {
              if (
                modifierItemsVue.modifierCategoryItems[i].id === modifierItemId
              ) {
                modifierItemsVue.$set(
                  modifierItemsVue.modifierCategoryItems[i],
                  'tags',
                  response.payload[0].tags
                )
                modifierItemsVue.$set(
                  modifierItemsVue.modifierCategoryItems[i],
                  'modifier_item_portions',
                  response.payload[0].modifier_item_portions
                )
                modifierItemsVue.$set(
                  modifierItemsVue.modifierCategoryItems[i],
                  'options',
                  response.payload[0].options
                )
              }
            }
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'Could not fetch item info',
            errorName: 'listErrorMessage',
            vue: modifierItemsVue
          })
        })
    },
    /**
     * To expand/collapse the dropdown div under a modifier item.
     * @function
     * @param {integer} itemId - The selected modifier item id
     * @returns {undefined}
     */
    expandDetails (itemId) {
      this.expanded = itemId
    },
    /**
     * To display the modal to edit modifier items.
     * @function
     * @param {object} modifierItem - The selected modifier item
     * @param {object} event - The click event that prompted this function.
     * @returns {undefined}
     */
    displayEditItemModal (modifierItem, event) {
      event.stopPropagation()
      this.editItemModalActive = true
      this.$router.push(
        '/app/menu_manager/modifier_items/' +
          this.$route.params.modifier_id +
          '/edit_modifier_item/' +
          modifierItem.id
      )
    },
    /**
     * To display the modal to delete modifier item.
     * @function
     * @param {object} modifierItem - The selected modifier item
     * @param {object} event - The click event that prompted this function.
     * @returns {undefined}
     */
    displayDeleteItemModal (modifierItem, event) {
      event.stopPropagation()
      this.selectedItemId = modifierItem.id
      this.deleteItemModalActive = true
    },
    /**
     * To clear the new modifier item form.
     * @function
     * @returns {undefined}
     */
    clearNewModifierItem () {
      this.newModifierItem = {
        modifier_id: this.$route.params.modifier_id,
        name: '',
        desc: '',
        sku: '',
        image_url: '',
        user_id: this.$root.createdBy,
        status: 1,
        price: '',
        min: null,
        max: null,
        order: null,
        override: 0,
        show_on_pos: 0
      }
    },
    /**
     * To add the modifier item emitted by the child to the items list.
     * @function
     * @param {object} val - The new modifier item
     * @returns {undefined}
     */
    addModifierItem (val) {
      if (parseInt(val.order) > 0) {
        var done = false
        for (var i = 0; i < this.modifierCategoryItems.length; i++) {
          if (
            parseInt(this.modifierCategoryItems[i].order) < parseInt(val.order)
          ) {
            this.modifierCategoryItems.splice(i, 0, val)
            done = true
            break
          }
        }
        if (!done) {
          this.modifierCategoryItems.push(val)
        }
      } else {
        this.modifierCategoryItems.push(val)
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
      let text = 'The Modifier Item has been created'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The Modifier Item has been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      })
    },
    /**
     * To update the modifier item emitted by the child and highlist it on the items list.
     * @function
     * @param {object} val - The updated item
     * @returns {undefined}
     */
    editModifierItem (val) {
      this.editItemModalActive = false
      this.getModifierCategoryItems()
    },
    /**
     * To close the modal to edit a modifier item.
     * @function
     * @returns {undefined}
     */
    closeEditItemModal () {
      this.editItemModalActive = false
    },
    /**
     * To close the modal to delete a modifier item.
     * @function
     * @returns {undefined}
     */
    closeDeleteItemModal () {
      this.deleteItemModalActive = false
    },
    /**
     * To close the modal to delete a modifier item.
     * @function
     * @returns {undefined}
     */
    deleteModifierItemAndCloseModal () {
      this.deleteItemModalActive = false
      this.getModifierCategoryItems()
    },
    /**
     * To view the nutrition info of a modifier item.
     * @function
     * @param {object} item - The selected item
     * @param {object} event - The click event that prompted this function.
     * @returns {undefined}
     */
    viewModifierNutritionInfo (item, event) {
      event.stopPropagation()
      this.displayNutritionModal = true
      this.selectedItem = item
    },
    /**
     * To show the modal to apply tags to an item.
     * @function
     * @param {integer} modifierItemId - The selected modifier item id
     * @param {object} appliedTags - The tags already applied to the item.
     * @returns {undefined}
     */
    showTagsModal (modifierItemId, appliedTags) {
      this.appliedTags = appliedTags
      this.selectedItemId = modifierItemId
      this.displayTagsListModal = true
    },
    /**
     * To show the modal to apply portions to an item.
     * @function
     * @param {integer} modifierItemId - The selected modifier item id
     * @param {object} appliedPortions - The portions already applied to the item.
     * @returns {undefined}
     */
    showPortionsModal (modifierItemId, appliedPortions) {
      this.appliedPortions = appliedPortions
      this.selectedItemId = modifierItemId
      this.displayPortionsListModal = true
    },
    /**
     * To show the modal to apply options to an item.
     * @function
     * @param {integer} modifierItemId - The selected modifier item id
     * @param {object} appliedOptions - The portions already applied to the item.
     * @returns {undefined}
     */
    showOptionsModal (modifierItemId, appliedOptions) {
      this.appliedOptions = appliedOptions
      this.selectedItemId = modifierItemId
      this.displayOptionsListModal = true
    },
    /**
     * To close the tags modal and update the item to show the updated tags.
     * @function
     * @param {integer} val - The id of the item to which the tags were applied
     * @returns {undefined}
     */
    closeTagsListModal (val) {
      this.displayTagsListModal = false
      this.getModifierItemDetails(val)
    },
    /**
     * To close the portions modal and update the item to show the updated portions.
     * @function
     * @param {integer} val - The id of the item to which the portions were applied
     * @returns {undefined}
     */
    closePortionsListModal (val) {
      this.displayPortionsListModal = false
      this.getModifierItemDetails(val)
    },
    /**
     * To close the options modal and update the item to show the updated options.
     * @function
     * @param {integer} val - The id of the item to which the options were applied
     * @returns {undefined}
     */
    closeOptionsListModal (val) {
      this.displayOptionsListModal = false
      this.getModifierItemDetails(val)
    }
  }
}
</script>
<style scoped>
.mt-list-item-collapsed {
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition: max-height 0.2s ease-out, opacity 0.1s ease-out;
}
.mt-list-item-expanded {
  max-height: 100%;
  opacity: 1;
  transition: max-height 0.2s ease-in, opacity 0.5s ease-in;
}
.mt-element-list
  .list-news.ext-1.mt-list-container
  ul
  > .mt-list-item.no-hover-highlight:hover,
.mt-element-list
  .list-news.ext-2.mt-list-container
  ul
  > .mt-list-item.no-hover-highlight:hover {
  background-color: rgb(255, 255, 255);
}
.actions-on-top {
  margin-top: -5px;
}
</style>
