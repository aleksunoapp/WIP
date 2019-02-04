<template>
  <div>
    <div class="page-bar">
      <breadcrumb :crumbs="breadcrumbArray" />
    </div>
    <!-- END PAGE BAR -->
    <!-- BEGIN PAGE TITLE-->
    <h1 class="page-title">
      Modifier Category Options
    </h1>
    <!-- END PAGE TITLE-->
    <div class="note note-info">
      <p>Create and manage options for modifier categories.</p>
    </div>
    <!-- BEGIN CREATE NEW MENU-->
    <div
      v-if="$root.permissions['menu_manager options create']"
      class="portlet box blue-hoki"
    >
      <div
        class="portlet-title bg-blue-chambray"
        @click="toggleCreateOptionPanel()"
      >
        <div class="custom tools">
          <a :class="{'expand': !createOptionCollapse, 'collapse': createOptionCollapse}" />
        </div>
        <div class="caption">
          &emsp;Create A New Option
        </div>
      </div>
      <div
        class="portlet-body"
        :class="{'display-hide': createOptionCollapse}"
      >
        <form
          role="form"
          @submit.prevent="createOption()"
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
                :image-url="newOption.image_url"
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
              <div class="form-group form-md-line-input form-md-floating-label margin-top-10">
                <input
                  id="form_control_1"
                  v-model="newOption.name"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newOption.name.length}"
                >
                <label for="form_control_1">
                  Option Name
                </label>
              </div>
              <div class="form-group form-md-line-input form-md-floating-label margin-top-10">
                <input
                  id="form_control_2"
                  v-model="newOption.description"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newOption.description}"
                >
                <label for="form_control_2">
                  Option Description
                </label>
              </div>
            </div>
            <div
              v-show="!imageMode.newMenu"
              class="col-md-5"
            >
              <div class="form-group form-md-line-input form-md-floating-label margin-top-10">
                <input
                  id="form_control_3"
                  v-model="newOption.order"
                  type="number"
                  class="form-control input-sm"
                  :class="{'edited': newOption.order}"
                >
                <label for="form_control_3">
                  Option Order
                </label>
              </div>
            </div>
          </div>
          <div
            v-show="!imageMode.newMenu"
            class="form-actions right margin-top-20"
          >
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
      :show="loadingOptionsData"
      :color="'#2C3E50'"
      :display="'inline'"
    />
    <div
      v-if="!loadingOptionsData"
      class="portlet light portlet-fit bordered margin-top-20"
    >
      <div class="portlet-title bg-blue-chambray">
        <div class="menu-image-main">
          <img src="../../../../public/client_logo.png">
        </div>
        <div class="caption">
          <span class="caption-subject font-default bold uppercase">
            Options
          </span>
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
          v-if="options.length"
          class="mt-element-list margin-top-15"
        >
          <div class="mt-list-container list-news ext-1 no-border">
            <ul>
              <li
                v-for="option in options"
                :id="'option-' + option.id"
                :key="option.id"
                class="mt-list-item actions-at-left margin-top-15 clickable"
                @click="viewOptionItems(option)"
              >
                <div class="list-item-actions">
                  <el-tooltip
                    v-if="$root.permissions['menu_manager options update']"
                    content="Edit"
                    effect="light"
                    placement="right"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="editOption(option, $event)"
                    >
                      <i class="fa fa-lg fa-pencil" />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    v-if="$root.permissions['menu_manager options read'] && !$root.permissions['menu_manager options update']"
                    content="View"
                    effect="light"
                    placement="right"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="editOption(option, $event)"
                    >
                      <i class="fa fa-lg fa-eye" />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    v-if="$root.permissions['menu_manager options add modifier items']"
                    content="Apply to multiple"
                    effect="light"
                    placement="right"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="displayMenuTreeModal(option, $event)"
                    >
                      <i class="icon-layers" />
                    </a>
                  </el-tooltip>
                </div>
                <div class="list-icon-container">
                  <i class="fa fa-angle-right" />
                </div>
                <div class="list-thumb">
                  <a v-if="option.image_url">
                    <img
                      alt=""
                      :src="option.image_url"
                    >
                  </a>
                  <a v-else>
                    <img src="../../../assets/img/app/image-placeholder.png">
                  </a>
                </div>
                <div class="list-datetime bold uppercase font-red">
                  <span>{{ option.name }}</span>
                </div>
                <div class="list-item-content height-mod">
                  <strong>Description:</strong>
                  <span>{{ option.description }}</span>
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
            :show="!options.length"
            :type="'options'"
          />
        </div>
      </div>
    </div>
    <edit-option
      v-if="showEditOptionModal"
      :selected-option-id="selectedOption.id"
      @updateOption="updateOption"
      @closeEditOptionModal="closeEditOptionModal"
    />
    <modifier-tree
      v-if="showModifierTreeModal"
      :selected-object="selectedOption"
      :header-text="headerText"
      :update-type="'option'"
      @closeModifierTreeModal="closeModifierTreeModal"
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
import OptionsFunctions from '../../../controllers/Options'
import EditOption from './Options/EditOption'
import ModifierTree from '../../modules/ModifierTree'
import ResourcePicker from '../../modules/ResourcePicker'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	components: {
		Breadcrumb,
		Modal,
		LoadingScreen,
		NoResults,
		Dropdown,
		EditOption,
		ModifierTree,
		ResourcePicker
	},
	data () {
		return {
			breadcrumbArray: [
				{ name: 'Menu Manager', link: false },
				{ name: 'Options', link: false }
			],
			createOptionCollapse: true,
			errorMessage: '',
			loadingOptionsData: false,
			listErrorMessage: '',
			newOption: {
				name: '',
				description: '',
				image_url: '',
				order: null,
				status: 1
			},
			options: [],
			showEditOptionModal: false,
			selectedOption: {},
			headerText: '',
			imageMode: {
				newMenu: false
			},
			showModifierTreeModal: false
		}
	},
	mounted () {
		// get the list of available options
		this.getOptions()
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
		 * To display the modal to apply a option to multiple modifier items.
		 * @function
		 * @param {object} option - The selected option.
		 * @param {object} event - The click event that triggered the action.
		 * @returns {undefined}
		 */
		displayMenuTreeModal (option, event) {
			event.stopPropagation()
			this.selectedOption = option
			this.headerText = "Option '" + this.selectedOption.name + "'"
			this.showModifierTreeModal = true
		},
		/**
		 * To close the menu tree modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModifierTreeModal () {
			this.showModifierTreeModal = false
		},
		/**
		 * To route to the items page for the selected option.
		 * @function
		 * @param {object} option - The selected option
		 * @returns {undefined}
		 */
		viewOptionItems (option) {
			this.$router.push(
				'/app/menu_manager/options/' + option.id + '/option_items'
			)
		},
		/**
		 * To toggle the create option panel, initially set to closed
		 * @function
		 * @returns {undefined}
		 */
		toggleCreateOptionPanel () {
			this.createOptionCollapse = !this.createOptionCollapse
		},
		/**
		 * To get the list of available options.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getOptions () {
			this.loadingOptionsData = true
			var optionsVue = this
			optionsVue.options = []
			OptionsFunctions.getOptions(
				optionsVue.$root.appId,
				optionsVue.$root.appSecret,
				optionsVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						optionsVue.loadingOptionsData = false
						optionsVue.options = response.payload
					} else {
						optionsVue.loadingOptionsData = false
					}
				})
				.catch(reason => {
					optionsVue.loadingOptionsData = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch option categories',
						errorName: 'listErrorMessage',
						vue: optionsVue
					})
				})
		},
		/**
		 * To set the image to be same as the one emitted by the gallery modal.
		 * @function
		 * @param {object} val - The emitted image object.
		 * @returns {undefined}
		 */
		updateImage (val) {
			this.newOption.image_url = val.image_url
		},
		/**
		 * To check if the option data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateOptionData () {
			var optionsVue = this
			return new Promise(function (resolve, reject) {
				if (!optionsVue.newOption.name.length) {
					reject('Option name cannot be blank')
				} else if (!optionsVue.newOption.image_url.length) {
					reject('Option image URL cannot be blank')
				} else if (!$.isNumeric(optionsVue.newOption.order)) {
					reject('Option order should be numerical')
				} else if (!optionsVue.newOption.description.length) {
					reject('Option description cannot be blank')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To create a new option type.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		createOption () {
			var optionsVue = this
			optionsVue.clearError('errorMessage')

			return optionsVue
				.validateOptionData()
				.then(response => {
					OptionsFunctions.createOption(
						optionsVue.newOption,
						optionsVue.$root.appId,
						optionsVue.$root.appSecret,
						optionsVue.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								optionsVue.newOption.id = response.payload.id
								optionsVue.getOptions()
								optionsVue.showAlert(response.payload)
								optionsVue.clearNewOption()
							} else {
								optionsVue.errorMessage = response.message
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could not add the option category',
								errorName: 'errorMessage',
								vue: optionsVue
							})
						})
				})
				.catch(reason => {
					// If validation fails then display the error message
					optionsVue.errorMessage = reason
					window.scrollTo(0, 0)
					throw reason
				})
		},
		/**
		 * To clear the new menu form.
		 * @function
		 * @returns {undefined}
		 */
		clearNewOption () {
			this.newOption = {
				name: '',
				description: '',
				image_url: '',
				order: null,
				status: 1
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
			let text = 'The Option has been created'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Option has been sent for approval'
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
		 * @param {string} name - Name of the error variable to clear
		 * @returns {undefined}
		 */
		clearError (name) {
			this[name] = ''
		},
		/**
		 * To show the modal to edit option details.
		 * @function
		 * @param {object} option - The selected option object.
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		editOption (option, event) {
			event.stopPropagation()
			this.selectedOption = option
			this.showEditOptionModal = true
		},
		/**
		 * To close the modal to edit option details.
		 * @function
		 * @returns {undefined}
		 */
		closeEditOptionModal () {
			this.showEditOptionModal = false
		},
		/**
		 * To close the modal to edit option details and update the selected option on the options list.
		 * @function
		 * @param {object} val - The option object to be updated on the list.
		 * @returns {undefined}
		 */
		updateOption (val) {
			this.showEditOptionModal = false
			this.getOptions()
		}
	}
}
</script>
