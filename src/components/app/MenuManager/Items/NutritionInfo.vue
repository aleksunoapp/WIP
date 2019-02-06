<template>
  <modal
    ref="nutritionModal"
    :show="showNutritionModal"
    effect="fade"
    @closeOnEscape="closeModal"
  >
    <div
      slot="modal-header"
      class="modal-header"
    >
      <button
        type="button"
        class="close"
        @click="closeModal()"
      >
        <span>&times;</span>
      </button>
      <transition
        name="fade"
        mode="out-in"
      >
        <h4
          v-if="!selectLocationMode"
          key="mainEditMode"
          class="modal-title center"
        >
          Item Nutrition Info
        </h4>
        <h4
          v-if="selectLocationMode"
          key="selectLocationMode"
          class="modal-title center"
        >
          <i
            class="fa fa-chevron-left clickable pull-left back-button"
            @click="closeSelectLocationsPopup()"
          />Select Stores
        </h4>
      </transition>
    </div>
    <div
      v-if="!creatingNutritionInfo"
      slot="modal-body"
      class="modal-body"
    >
      <div
        v-show="errorMessage"
        ref="errorMessage"
        class="margin-top-20"
      >
        <div class="alert alert-info">
          <span>{{ errorMessage }}</span>
        </div>
      </div>
      <div
        v-if="itemNutritionInfo.length === 0"
        class="margin-top-15"
      >
        <button
          type="button"
          class="btn blue"
          @click="enableCreate()"
        >
          Add Nutrition Info
        </button>
      </div>
      <div
        v-if="!errorMessage.length && !selectLocationMode"
        class="portlet light bg-inverse clear"
      >
        <div class="portlet-title">
          <div class="caption">
            Click on the button on the right to edit
          </div>
          <div class="actions">
            <a
              class="btn btn-circle btn-icon-only btn-default"
              @click="enableEdit()"
            >
              <i class="fa fa-lg fa-pencil" />
            </a>
          </div>
        </div>
        <div class="portlet-body">
          <div
            v-show="editNutritionError"
            ref="editNutritionError"
          >
            <div class="alert alert-danger">
              <button
                class="close"
                @click="clearError('editNutritionError')"
              />
              <span>{{ editNutritionError }}</span>
            </div>
          </div>
          <div class="table-scrollable table-fixed-height">
            <table class="table">
              <thead>
                <tr>
                  <th> Category </th>
                  <th> Value </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="info in itemNutritionInfo"
                  v-if="info.key !== 'kcal'"
                  :key="info.id"
                >
                  <td v-if="info.key !== 'id' && info.key !== 'item_id'">
                    {{ info.name }}
                  </td>
                  <td v-if="info.key !== 'id' && info.key !== 'item_id'">
                    <input
                      v-model="info.value"
                      :disabled="!editingNutritionInfo || !can('menu_manager menus categories subcategories items nutrition update')"
                      type="text"
                      class="form-control input-sm"
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <div class="form-group form-md-line-input form-md-floating-label">
              <label>Display calories as kilocalories?</label><br>
              <el-switch
                v-model="kcal"
                :disabled="!editingNutritionInfo || !can('menu_manager menus categories subcategories items nutrition update')"
                active-color="#0c6"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
                active-text="Yes"
                inactive-text="No"
              />
            </div>
          </div>
          <div>
            <p class="margin-bottom-10 margin-top-30 margin-right-10">
              Select locations to apply the changes to:
            </p>
            <button
              type="submit"
              class="btn blue btn-outline"
              @click="selectLocations($event)"
            >
              Select locations
            </button>
            <p
              v-if="selectedLocations.length"
              class="grey-label margin-top-10"
            >
              Selected {{ selectedLocations.length }}
              <span v-if="selectedLocations.length !== 1">
                locations
              </span>
              <span v-else>
                location
              </span>
            </p>
            <div class="form-group form-md-line-input form-md-floating-label">
              <label>Update all items?</label><br>
              <el-switch
                v-model="update_all_items"
                :disabled="!editingNutritionInfo || !can('menu_manager menus categories subcategories items nutrition update')"
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
      </div>

      <store-picker-with-button
        v-if="selectLocationMode"
        :previously-selected="selectedLocations"
        @close="updateSelectedLocations"
      />
    </div>
    <div
      v-if="creatingNutritionInfo"
      slot="modal-body"
      class="modal-body"
    >
      <div class="portlet light bg-inverse clear">
        <div class="portlet-title">
          <div class="caption">
            Add nutrition info for '{{ item.name }}'
          </div>
        </div>
        <div class="portlet-body">
          <div
            v-show="createNutritionError"
            ref="createNutritionError"
            class="margin-top-20"
          >
            <div class="alert alert-danger">
              <button
                class="close"
                @click="clearError('createNutritionError')"
              />
              <span>{{ createNutritionError }}</span>
            </div>
          </div>
          <div class="table-scrollable table-fixed-height">
            <fieldset :disabled="!can('menu_manager menus categories subcategories items nutrition create')">
              <table class="table">
                <thead>
                  <tr>
                    <th> Category </th>
                    <th> Value </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td> Calories </td>
                    <td>
                      <input
                        v-model="newNutritionInfo.calories"
                        type="text"
                        class="form-control input-sm"
                      >
                    </td>
                  </tr>
                  <tr>
                    <td> Minimum Calories </td>
                    <td>
                      <input
                        v-model="newNutritionInfo.min_cal"
                        type="text"
                        class="form-control input-sm"
                      >
                    </td>
                  </tr>
                  <tr>
                    <td> Total Fat </td>
                    <td>
                      <input
                        v-model="newNutritionInfo.total_fat"
                        type="text"
                        class="form-control input-sm"
                      >
                    </td>
                  </tr>
                  <tr>
                    <td> Saturated Fat </td>
                    <td>
                      <input
                        v-model="newNutritionInfo.saturated_fat"
                        type="text"
                        class="form-control input-sm"
                      >
                    </td>
                  </tr>
                  <tr>
                    <td> Trans Fat </td>
                    <td>
                      <input
                        v-model="newNutritionInfo.trans_fat"
                        type="text"
                        class="form-control input-sm"
                      >
                    </td>
                  </tr>
                  <tr>
                    <td> Cholesterol </td>
                    <td>
                      <input
                        v-model="newNutritionInfo.cholesterol"
                        type="text"
                        class="form-control input-sm"
                      >
                    </td>
                  </tr>
                  <tr>
                    <td> Sodium </td>
                    <td>
                      <input
                        v-model="newNutritionInfo.sodium"
                        type="text"
                        class="form-control input-sm"
                      >
                    </td>
                  </tr>
                  <tr>
                    <td> Carbohydrates </td>
                    <td>
                      <input
                        v-model="newNutritionInfo.carbs"
                        type="text"
                        class="form-control input-sm"
                      >
                    </td>
                  </tr>
                  <tr>
                    <td> Fibre </td>
                    <td>
                      <input
                        v-model="newNutritionInfo.fibre"
                        type="text"
                        class="form-control input-sm"
                      >
                    </td>
                  </tr>
                  <tr>
                    <td> Sugar </td>
                    <td>
                      <input
                        v-model="newNutritionInfo.sugar"
                        type="text"
                        class="form-control input-sm"
                      >
                    </td>
                  </tr>
                  <tr>
                    <td> Protein </td>
                    <td>
                      <input
                        v-model="newNutritionInfo.protein"
                        type="text"
                        class="form-control input-sm"
                      >
                    </td>
                  </tr>
                  <tr>
                    <td> Vitamin A </td>
                    <td>
                      <input
                        v-model="newNutritionInfo.vit_a"
                        type="text"
                        class="form-control input-sm"
                      >
                    </td>
                  </tr>
                  <tr>
                    <td> Vitamin C </td>
                    <td>
                      <input
                        v-model="newNutritionInfo.vit_c"
                        type="text"
                        class="form-control input-sm"
                      >
                    </td>
                  </tr>
                  <tr>
                    <td> Calcium </td>
                    <td>
                      <input
                        v-model="newNutritionInfo.calcium"
                        type="text"
                        class="form-control input-sm"
                      >
                    </td>
                  </tr>
                  <tr>
                    <td> Iron </td>
                    <td>
                      <input
                        v-model="newNutritionInfo.iron"
                        type="text"
                        class="form-control input-sm"
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
    <div
      slot="modal-footer"
      class="modal-footer"
    >
      <button
        v-if="editingNutritionInfo && !creatingNutritionInfo && !selectLocationMode"
        type="button"
        class="btn btn-primary"
        :disabled="updating"
        @click="updateItemNutritionInfo()"
      >
        Save
        <i
          v-show="updating"
          class="fa fa-spinner fa-pulse fa-fw"
        />
      </button>
      <button
        v-if="!editingNutritionInfo && creatingNutritionInfo && !selectLocationMode"
        type="button"
        class="btn btn-primary"
        :disabled="creating"
        @click="createItemNutritionInfo()"
      >
        Create
        <i
          v-show="creating"
          class="fa fa-spinner fa-pulse fa-fw"
        />
      </button>
      <button
        v-if="!editingNutritionInfo && !creatingNutritionInfo && !selectLocationMode"
        type="button"
        class="btn btn-primary"
        @click="closeModal()"
      >
        Close
      </button>
    </div>
  </modal>
</template>

<script>
import $ from 'jquery'
import Modal from '../../../modules/Modal'
import ItemsFunctions from '../../../../controllers/Items'
import StorePickerWithButton from '@/components/modules/StorePickerWithButton'
import ajaxErrorHandler from '@/controllers/ErrorController'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      showNutritionModal: false,
      itemNutritionInfo: [],
      editingNutritionInfo: false,
      updating: false,
      creatingNutritionInfo: false,
      creating: false,
      createNutritionError: '',
      editNutritionError: '',
      errorMessage: '',
      newNutritionInfo: {
        item_id: this.item.id,
        user_id: this.$root.createdBy
      },
      selectLocationMode: false,
      selectedLocations: [],
      update_all_items: false,
      kcal: 0
    }
  },
  computed: {
    ...mapGetters(['can', 'canAny'])
  },
  components: {
    Modal,
    StorePickerWithButton
  },
  props: {
    item: {
      type: Object,
      default: {}
    }
  },
  mounted () {
    this.showNutritionModal = true
    this.getItemNutritionInfo()
  },
  methods: {
    /**
		 * To toggle edit mode on.
		 * @function
		 * @returns {undefined}
		 */
    enableCreate () {
      if (
        this.can(
          'menu_manager menus categories subcategories items nutrition create'
        )
      ) {
        this.creatingNutritionInfo = true
      }
    },
    /**
		 * To toggle edit mode on.
		 * @function
		 * @returns {undefined}
		 */
    enableEdit () {
      if (
        this.can(
          'menu_manager menus categories subcategories items nutrition update'
        )
      ) {
        this.editingNutritionInfo = true
      }
    },
    /**
		 * To toggle select location mode on.
		 * @function
		 * @param {object} event - The event that triggered the action
		 * @returns {undefined}
		 */
    selectLocations (event) {
      event.preventDefault()
      this.selectLocationMode = true
    },
    /**
		 * To toggle select location mode on.
		 * @function
		 * @param {array} locations - The array of selected locations
		 * @returns {undefined}
		 */
    updateSelectedLocations (locations) {
      this.selectedLocations = locations
      this.closeSelectLocationsPopup()
    },
    /**
		 * To toggle select location mode on.
		 * @function
		 * @returns {undefined}
		 */
    closeSelectLocationsPopup () {
      this.selectLocationMode = false
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
		 * To get the nutrition info for the item.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getItemNutritionInfo () {
      var nutritionInfoVue = this
      nutritionInfoVue.itemNutritionInfo = []
      nutritionInfoVue.errorMessage = ''
      ItemsFunctions.getItemNutritionInfo(
        nutritionInfoVue.item.id,
        nutritionInfoVue.$root.appId,
        nutritionInfoVue.$root.appSecret
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            nutritionInfoVue.itemNutritionInfo = response.payload[0]
            let kcal = response.payload[0].find(field => field.key === 'kcal')
            nutritionInfoVue.kcal = kcal === undefined ? 0 : kcal.value
          } else {
            nutritionInfoVue.errorMessage = response.payload
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch nutrition info',
            errorName: 'errorMessage',
            vue: nutritionInfoVue,
            containerRef: 'nutritionModal'
          })
        })
    },
    /**
		 * To check if the nutrition data is valid before submitting to the backend.
		 * @function
		 * @param {object} inputObject - The object to be validated
		 * @returns {object} A promise that will validate the input form
		 */
    validateNutritionData (inputObject) {
      return new Promise(function (resolve, reject) {
        if (!$.isNumeric(inputObject.calories)) {
          reject('Calories should be a number')
          // } else if (!$.isNumeric(inputObject.min_cal)) {
          // 	reject('Minimum Calories should be a number')
        } else if (!$.isNumeric(inputObject.total_fat)) {
          reject('Total Fat should be a number')
        } else if (!$.isNumeric(inputObject.saturated_fat)) {
          reject('Saturated Fat should be a number')
        } else if (!$.isNumeric(inputObject.trans_fat)) {
          reject('Trans Fat should be a number')
        } else if (!$.isNumeric(inputObject.cholesterol)) {
          reject('Cholesterol should be a number')
        } else if (!$.isNumeric(inputObject.sodium)) {
          reject('Sodium should be a number')
        } else if (!$.isNumeric(inputObject.carbs)) {
          reject('Carbohydrates should be a number')
        } else if (!$.isNumeric(inputObject.fibre)) {
          reject('Fibre should be a number')
        } else if (!$.isNumeric(inputObject.sugar)) {
          reject('Sugar should be a number')
        } else if (!$.isNumeric(inputObject.protein)) {
          reject('Protein should be a number')
        } else if (!$.isNumeric(inputObject.vit_a)) {
          reject('Vitamin A should be a number')
        } else if (!$.isNumeric(inputObject.vit_c)) {
          reject('Vitamin C should be a number')
        } else if (!$.isNumeric(inputObject.calcium)) {
          reject('Calcium should be a number')
        } else if (!$.isNumeric(inputObject.iron)) {
          reject('Iron should be a number')
        }
        resolve('Hurray')
      })
    },
    /**
		 * To send the updated nutrition info to the backend and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    updateItemNutritionInfo () {
      var nutritionInfoVue = this
      var updatedNutritionInfo = {}
      for (
        var i = 0;
        i < nutritionInfoVue.itemNutritionInfo.length;
        i++
      ) {
        if (
          nutritionInfoVue.itemNutritionInfo[i].key !==
					'modifier_item_id'
        ) {
          var tempKey = nutritionInfoVue.itemNutritionInfo[i].key
          updatedNutritionInfo[tempKey] =
						nutritionInfoVue.itemNutritionInfo[i].value
        }
      }
      updatedNutritionInfo.item_id = nutritionInfoVue.item.id
      updatedNutritionInfo.user_id = nutritionInfoVue.$root.createdBy
      updatedNutritionInfo.update_locations =
				nutritionInfoVue.selectedLocations
      updatedNutritionInfo.update_all_items =
				nutritionInfoVue.update_all_items
      updatedNutritionInfo.kcal = nutritionInfoVue.kcal
      nutritionInfoVue.editNutritionError = ''

      return nutritionInfoVue
        .validateNutritionData(updatedNutritionInfo)
        .then(response => {
          nutritionInfoVue.updating = true
          nutritionInfoVue.editingNutritionInfo = false
          ItemsFunctions.updateItemNutritionInfo(
            updatedNutritionInfo,
            nutritionInfoVue.$root.appId,
            nutritionInfoVue.$root.appSecret,
            nutritionInfoVue.$root.userToken
          )
            .then(response => {
              if (
                response.code === 200 &&
								response.status === 'ok'
              ) {
                this.closeModalAndUpdate()
                this.showEditSuccess(response.payload)
              } else {
                nutritionInfoVue.editNutritionError =
									'Something'
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'We could not update nutrition info',
                errorName: 'editNutritionError',
                vue: nutritionInfoVue,
                containerRef: 'nutritionModal'
              })
            })
            .finally(() => {
              nutritionInfoVue.updating = false
            })
        })
        .catch(reason => {
          // If validation fails then display the error message
          nutritionInfoVue.editNutritionError = reason
          window.scrollTo(0, 0)
          throw reason
        })
    },
    /**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    showEditSuccess (payload = {}) {
      let title = 'Success'
      let text = 'The Nutrition Info has been saved'
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
		 * To create new nutrition info for the item (if it doesn't exist) and send it to the backend and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    createItemNutritionInfo () {
      var nutritionInfoVue = this

      return nutritionInfoVue
        .validateNutritionData(nutritionInfoVue.newNutritionInfo)
        .then(response => {
          nutritionInfoVue.creating = true
          nutritionInfoVue.createNutritionError = false
          ItemsFunctions.createItemNutritionInfo(
            nutritionInfoVue.newNutritionInfo,
            nutritionInfoVue.$root.appId,
            nutritionInfoVue.$root.appSecret,
            nutritionInfoVue.$root.userToken
          )
            .then(response => {
              if (
                response.code === 200 &&
								response.status === 'ok'
              ) {
                this.closeModalAndUpdate()
                this.showCreateSuccess(response.payload)
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'We could not add nutrition info',
                errorName: 'createNutritionError',
                vue: nutritionInfoVue,
                containerRef: 'nutritionModal'
              })
            })
            .finally(() => {
              nutritionInfoVue.creating = false
            })
        })
        .catch(reason => {
          // If validation fails then display the error message
          nutritionInfoVue.createNutritionError = reason
          window.scrollTo(0, 0)
          throw reason
        })
    },
    /**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    showCreateSuccess (payload = {}) {
      let title = 'Success'
      let text = 'The Nutrition Information has been created'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The Nutrition Information has been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      })
    },
    /**
		 * To notify that changes were saved
		 * @function
		 * @returns {undefined}
		 */
    closeModalAndUpdate () {
      this.$emit('nutritionInfoSaved', this.item.id)
    },
    /**
		 * To just close the modal when the user clicks on the 'x' to close the modal.
		 * @function
		 * @returns {undefined}
		 */
    closeModal () {
      this.$emit('deactivateNutritionInfoModal')
    }
  }
}
</script>
