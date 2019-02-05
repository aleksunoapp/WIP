<template>
  <div>
    <div class="page-bar">
      <breadcrumb :crumbs="breadcrumbArray" />
    </div>
    <!-- END PAGE BAR -->
    <!-- BEGIN PAGE TITLE-->
    <h1 class="page-title">
      Modifier Category Option Items
    </h1>
    <!-- END PAGE TITLE-->
    <div class="note note-info">
      <p>Create and manage items for modifier category option '{{ optionDetails.name }}'.</p>
    </div>
    <!-- BEGIN CREATE NEW MENU-->
    <div
      v-if="$root.permissions['menu_manager options items create']"
      class="portlet box blue-hoki"
    >
      <div
        class="portlet-title bg-blue-chambray"
        @click="toggleCreateItemPanel()"
      >
        <div class="custom tools">
          <a :class="{'expand': !createItemCollapse, 'collapse': createItemCollapse}" />
        </div>
        <div class="caption">
          &emsp;Create A New Option
        </div>
      </div>
      <div
        class="portlet-body"
        :class="{'display-hide': createItemCollapse}"
      >
        <form
          role="form"
          @submit.prevent="createOptionItem()"
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
                :image-url="newOptionItem.image_url"
                class="margin-top-15"
                @open="toggleImageMode('newMenu', true)"
                @close="toggleImageMode('newMenu', false)"
                @selected="updateImage"
              />
            </div>
            <div class="col-md-5">
              <div class="form-group form-md-line-input form-md-floating-label margin-top-10">
                <input
                  id="form_control_1"
                  v-model="newOptionItem.name"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newOptionItem.name.length}"
                >
                <label for="form_control_1">
                  Option Name
                </label>
              </div>
              <div class="form-group form-md-line-input form-md-floating-label margin-top-10">
                <input
                  id="form_control_2"
                  v-model="newOptionItem.description"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newOptionItem.description.length}"
                >
                <label for="form_control_2">
                  Option Description
                </label>
              </div>
              <div class="form-group form-md-line-input form-md-floating-label margin-top-10">
                <input
                  id="form_control_3"
                  v-model="newOptionItem.sku"
                  type="type"
                  class="form-control input-sm"
                  :class="{'edited': newOptionItem.sku.length}"
                >
                <label for="form_control_3">
                  Option SKU
                </label>
              </div>
            </div>
            <div class="col-md-5">
              <div class="form-group form-md-line-input form-md-floating-label margin-top-10">
                <input
                  id="form_control_4"
                  v-model="newOptionItem.price"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newOptionItem.price.length}"
                >
                <label for="form_control_4">
                  Option Price
                </label>
              </div>
              <div class="form-group form-md-line-input form-md-floating-label margin-top-10">
                <input
                  id="form_control_5"
                  v-model="newOptionItem.order"
                  type="number"
                  class="form-control input-sm"
                  :class="{'edited': newOptionItem.order}"
                >
                <label for="form_control_5">
                  Option Order
                </label>
              </div>
            </div>
          </div>
          <div class="form-actions right margin-top-20">
            <button
              type="submit"
              class="btn blue"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- END CREATE NEW MENU-->
    <loading-screen
      :show="loadingOptionItemsData"
      :color="'#2C3E50'"
      :display="'inline'"
    />
    <div
      v-if="!loadingOptionItemsData"
      class="portlet light portlet-fit bordered margin-top-20"
    >
      <div class="portlet-title bg-blue-chambray">
        <div class="menu-image-main">
          <img src="../../../../public/client_logo.png">
        </div>
        <div class="caption">
          <span class="caption-subject font-default bold uppercase">
            {{ optionDetails.name }}
          </span>
          <div class="caption-desc font-grey-cascade">
            {{ optionDetails.description }}
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
          v-if="optionItems.length"
          class="mt-element-list margin-top-15"
        >
          <div class="mt-list-container list-news ext-1 no-border">
            <ul>
              <li
                v-for="optionItem in optionItems"
                :id="'optionItem-' + optionItem.id"
                :key="optionItem.id"
                class="mt-list-item actions-at-left margin-top-15"
              >
                <div class="list-item-actions">
                  <el-tooltip
                    v-if="$root.permissions['menu_manager options items update']"
                    content="Edit"
                    effect="light"
                    placement="right"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="editOptionItem(optionItem, $event)"
                    >
                      <i class="fa fa-lg fa-pencil" />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    v-if="$root.permissions['menu_manager options items read'] && !$root.permissions['menu_manager options items update']"
                    content="View"
                    effect="light"
                    placement="right"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="editOptionItem(optionItem, $event)"
                    >
                      <i class="fa fa-lg fa-eye" />
                    </a>
                  </el-tooltip>
                </div>
                <div class="list-thumb">
                  <a v-if="optionItem.image_url">
                    <img
                      alt=""
                      :src="optionItem.image_url"
                    >
                  </a>
                  <a v-else>
                    <img src="../../../assets/img/app/image-placeholder.png">
                  </a>
                </div>
                <div class="list-datetime bold uppercase font-red">
                  <span>{{ optionItem.name }}</span>
                </div>
                <div class="list-item-content height-mod">
                  <div class="col-md-4">
                    <strong>Status:</strong>
                    <span v-if="optionItem.status == 1">
                      Available
                    </span>
                    <span v-if="optionItem.status == 0">
                      Sold Out
                    </span>
                  </div>
                  <div class="col-md-4">
                    <strong>SKU:</strong>
                    <span>{{ optionItem.sku }}</span>
                  </div>
                  <div class="col-md-12">
                    <strong>Description:</strong>
                    <span>{{ optionItem.description }}</span>
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
            :show="!optionItems.length"
            :type="'option items'"
          />
        </div>
      </div>
    </div>
    <edit-option-item
      v-if="showEditOptionItemModal"
      :selected-option-item-id="selectedOptionItemId"
      @updateOptionItem="updateOptionItem"
      @closeEditOptionItemModal="closeEditOptionItemModal"
    />
  </div>
</template>

<script>
import $ from 'jquery'
import Breadcrumb from '../../modules/Breadcrumb'
import Dropdown from '../../modules/Dropdown'
import NoResults from '../../modules/NoResults'
import Modal from '../../modules/Modal'
import LoadingScreen from '../../modules/LoadingScreen'
import ResourcePicker from '../../modules/ResourcePicker'
import OptionsFunctions from '../../../controllers/Options'
import EditOptionItem from './Options/EditOptionItem'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
  components: {
    Breadcrumb,
    Modal,
    LoadingScreen,
    NoResults,
    Dropdown,
    EditOptionItem,
    ResourcePicker
  },
  data () {
    return {
      breadcrumbArray: [
        { name: 'Menu Manager', link: false },
        { name: 'Options', link: '/app/menu_manager/options' },
        { name: 'Option Items', link: false }
      ],
      createItemCollapse: true,
      errorMessage: '',
      loadingOptionItemsData: false,
      listErrorMessage: '',
      newOptionItem: {
        option_id: this.$route.params.option_id,
        name: '',
        description: '',
        image_url: '',
        order: null,
        status: 1,
        sku: '',
        price: ''
      },
      optionItems: [],
      showEditOptionItemModal: false,
      selectedOptionItemId: 0,
      optionDetails: {},
      imageMode: {
        newMenu: false
      }
    }
  },
  mounted () {
    this.getOptionDetails()
    // get the list of available option items
    this.getOptionItems()
  },
  methods: {
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
		 * To set the image to be same as the one emitted by the gallery modal.
		 * @function
		 * @param {object} val - The emitted image object.
		 * @returns {undefined}
		 */
    updateImage (val) {
      this.newOptionItem.image_url = val.image_url
    },
    /**
		 * To toggle the create option panel, initially set to closed
		 * @function
		 * @returns {undefined}
		 */
    toggleCreateItemPanel () {
      this.createItemCollapse = !this.createItemCollapse
    },
    getOptionDetails () {
      var itemsVue = this
      OptionsFunctions.getOptionDetails(
        itemsVue.$route.params.option_id,
        itemsVue.$root.appId,
        itemsVue.$root.appSecret,
        itemsVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            itemsVue.optionDetails = response.payload
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch option info',
            errorName: 'listErrorMessage',
            vue: itemsVue
          })
        })
    },
    /**
		 * To get the list of available option items.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getOptionItems () {
      this.loadingOptionItemsData = true
      var optionItemsVue = this
      optionItemsVue.optionItems = []
      OptionsFunctions.getOptionItems(
        optionItemsVue.$route.params.option_id,
        optionItemsVue.$root.appId,
        optionItemsVue.$root.appSecret,
        optionItemsVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            optionItemsVue.loadingOptionItemsData = false
            optionItemsVue.optionItems = response.payload
          } else {
            optionItemsVue.loadingOptionItemsData = false
          }
        })
        .catch(reason => {
          optionItemsVue.loadingOptionItemsData = false
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch option items',
            errorName: 'listErrorMessage',
            vue: optionItemsVue
          })
        })
    },
    /**
		 * To check if the option data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    validateOptionItemData () {
      var optionItemsVue = this
      return new Promise(function (resolve, reject) {
        if (!optionItemsVue.newOptionItem.name.length) {
          reject('Option name cannot be blank')
        } else if (!optionItemsVue.newOptionItem.image_url.length) {
          reject('Option image URL cannot be blank')
        } else if (!$.isNumeric(optionItemsVue.newOptionItem.order)) {
          reject('Option order should be numerical')
        } else if (!optionItemsVue.newOptionItem.description.length) {
          reject('Option description cannot be blank')
        } else if (!optionItemsVue.newOptionItem.price.length) {
          reject('Option price cannot be blank')
        } else if (!optionItemsVue.newOptionItem.sku.length) {
          reject('Option SKU cannot be blank')
        }
        resolve('Hurray')
      })
    },
    /**
		 * To create a new option type.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    createOptionItem () {
      var optionItemsVue = this
      optionItemsVue.clearError('errorMessage')

      return optionItemsVue
        .validateOptionItemData()
        .then(response => {
          OptionsFunctions.createOptionItem(
            optionItemsVue.newOptionItem,
            optionItemsVue.$root.appId,
            optionItemsVue.$root.appSecret,
            optionItemsVue.$root.userToken
          )
            .then(response => {
              if (response.code === 200 && response.status === 'ok') {
                optionItemsVue.newOptionItem.id = response.payload.id
                optionItemsVue.addOptionItem(optionItemsVue.newOptionItem)
                optionItemsVue.showAlert(response.payload)
                optionItemsVue.clearNewOptionItem()
              } else {
                optionItemsVue.errorMessage = response.message
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'We could not add the option item',
                errorName: 'errorMessage',
                vue: optionItemsVue
              })
            })
        })
        .catch(reason => {
          // If validation fails then display the error message
          optionItemsVue.errorMessage = reason
          window.scrollTo(0, 0)
          throw reason
        })
    },
    /**
		 * To clear the new menu form.
		 * @function
		 * @returns {undefined}
		 */
    clearNewOptionItem () {
      this.newOptionItem = {
        option_id: this.$route.params.option_id,
        name: '',
        description: '',
        image_url: '',
        order: null,
        status: 1,
        sku: '',
        price: ''
      }
    },
    /**
		 * To close the modal to create tags and add the newly created tag to the list.
		 * @function
		 * @param {object} val - The tag object to be added to the list.
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    addOptionItem (val) {
      if (val.order > 1) {
        for (var i = 0; i < this.optionItems.length; i++) {
          if (parseInt(this.optionItems[i].order) + 1 === parseInt(val.order)) {
            this.optionItems.splice(i + 1, 0, val)
            break
          }
        }
      } else {
        this.optionItems.push(val)
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
      let text = 'The Option Item has been created'
      let type = 'success'

      if (payload.pending_approval) {
        title = 'Approval Required'
        text = 'The Option Item has been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      })
    },
    /**
		 * To clear the current error.
		 * @function
		 * @param {string} name - Name of the error to clear
		 * @returns {undefined}
		 */
    clearError (name) {
      this[name] = ''
    },
    /**
		 * To show the modal to edit optionItem details.
		 * @function
		 * @param {object} optionItem - The selected optionItem object.
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
    editOptionItem (optionItem, event) {
      event.stopPropagation()
      this.selectedOptionItemId = optionItem.id
      this.showEditOptionItemModal = true
    },
    /**
		 * To close the modal to edit option details.
		 * @function
		 * @returns {undefined}
		 */
    closeEditOptionItemModal () {
      this.showEditOptionItemModal = false
    },
    /**
		 * To close the modal to edit option details and update the selected option on the option items list.
		 * @function
		 * @param {object} val - The option object to be updated on the list.
		 * @returns {undefined}
		 */
    updateOptionItem (val) {
      this.showEditOptionItemModal = false
      for (var i = 0; i < this.optionItems.length; i++) {
        if (this.optionItems[i].id === val.id) {
          this.optionItems[i] = val
        }
      }
      $('#optionItem-' + val.id).addClass('highlight')
      setTimeout(function () {
        $('#optionItem-' + val.id).removeClass('highlight')
      }, 2000)
    }
  }
}
</script>
<style scoped>
.mt-element-list .list-news.ext-1.mt-list-container ul > .mt-list-item:hover,
.mt-element-list .list-news.ext-2.mt-list-container ul > .mt-list-item:hover {
  background-color: #fff;
}
</style>
