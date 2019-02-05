<template>
  <modal
    ref="applyModal"
    :show="showComponent"
    :width="900"
    effect="fade"
    @closeOnEscape="closeModal"
  >
    <div
      slot="modal-header"
      class="modal-header center"
    >
      <button
        type="button"
        class="close"
        @click="closeModal()"
      >
        <span>&times;</span>
      </button>
      <h4 class="modal-title center">
        Apply Modifier
      </h4>
    </div>
    <div
      slot="modal-body"
      class="modal-body"
    >
      <div
        v-show="errorMessage"
        ref="errorMessage"
        class="row"
      >
        <div class="col-md-12">
          <div class="alert alert-danger">
            <button
              class="close"
              @click="clearError('errorMessage')"
            />
            <span>{{ errorMessage }}</span>
          </div>
        </div>
      </div>
      <div
        v-show="itemSelection"
        class="row"
      >
        <div class="col-xs-12">
          <menu-item-picker @update="itemsSelected" />
        </div>
      </div>
      <div
        v-if="locationSelection"
        class="row"
      >
        <div class="col-xs-12">
          <store-picker
            @update="updateLocations"
          />
        </div>
      </div>
    </div>
    <div
      slot="modal-footer"
      class="modal-footer"
    >
      <button
        v-show="itemSelection"
        type="button"
        class="btn btn-primary"
        @click="showLocationSelection()"
      >
        Next
      </button>
      <button
        v-show="locationSelection"
        type="button"
        class="btn btn-outline"
        @click="showItemSelection()"
      >
        Back
      </button>
      <button
        v-show="locationSelection"
        type="button"
        class="btn btn-primary"
        :disabled="saving"
        @click="applyModifierToItemsAtLocations()"
      >
        Save
        <i
          v-show="saving"
          class="fa fa-spinner fa-pulse fa-fw"
        />
      </button>
    </div>
  </modal>
</template>

<script>
import Modal from '@/components/modules/Modal'
import ModifiersFunctions from '@/controllers/Modifiers'
import StorePicker from '@/components/modules/StorePicker'
import ajaxErrorHandler from '@/controllers/ErrorController'
import MenuItemPicker from '@/components/modules/MenuItemPicker'

export default {
  name: 'ApplyModifierToItemsAtLocations',
  components: {
    Modal,
    StorePicker,
    MenuItemPicker
  },
  props: {
    modifier: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      saving: false,
      errorMessage: '',
      showComponent: false,
      itemSelection: true,
      locationSelection: false,
      selectedItems: [],
      selectedLocations: [],
      showApplyToLocationsModal: false,
      modifierToApplyToLocations: {}
    }
  },
  mounted () {
    this.showComponent = true
  },
  methods: {
    /**
		 * To update selection of items
		 * @function
		 * @param {array} items - Array of selected items
		 * @returns {undefined}
		 */
    itemsSelected (items) {
      this.selectedItems = items.map(item => item.sku)
    },
    /**
		 * To display the location selecor
		 * @function
		 * @returns {undefined}
		 */
    showLocationSelection () {
      if (this.selectedItems.length) {
        this.itemSelection = false
        this.locationSelection = true
      } else {
        this.errorMessage = 'Select at least one item to apply the Modifier to'
      }
    },
    /**
		 * To display the item selecor
		 * @function
		 * @returns {undefined}
		 */
    showItemSelection () {
      this.locationSelection = false
      this.itemSelection = true
    },
    /**
		 * To update the locations selected in the child component
		 * @function
		 * @param {array} locations - Arrray of store ids
		 * @returns {undefined}
		 */
    updateLocations (locations) {
      this.selectedLocations = locations
    },
    /**
		 * To clear an error
		 * @function
		 * @param {string} name - Name of the error variable to clear
		 * @returns {undefined}
		 */
    clearError (name) {
      this[name] = ''
    },
    /**
		 * To apply the selected modifier to all the checked off menu items.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    applyModifierToItemsAtLocations () {
      if (!this.selectedLocations.length) {
        this.errorMessage = 'Select at least one store'
        return
      }

      this.saving = true
      var menuTreeVue = this
      let payload = {
        modifier_id: this.modifier.id,
        item_sku: this.selectedItems,
        locations: this.selectedLocations
      }
      ModifiersFunctions.applyModifierToItemsAtLocations(
        payload,
        menuTreeVue.$root.appId,
        menuTreeVue.$root.appSecret,
        menuTreeVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            menuTreeVue.closeModal()
            menuTreeVue.emitSuccess(response.payload)
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could apply the modifier',
            errorName: 'errorMessage',
            vue: menuTreeVue,
            containerRef: 'applyModal'
          })
        })
        .finally(() => {
          menuTreeVue.saving = false
        })
    },
    /**
		 * To close the modal.
		 * @function
		 * @returns {undefined}
		 */
    closeModal () {
      this.$emit('closeApplyModifierToItemsAtLocations')
    },
    /**
		 * To close the modal.
		 * @function
		 * @param {object} payload - The payload property of the response
		 * @returns {undefined}
		 */
    emitSuccess (payload = {}) {
      this.$emit('applyModifierToItemsAtLocationsSuccess', payload)
    }
  }
}
</script>
<style scoped>
.height-mod {
  max-height: 500px;
  overflow: auto;
}
.dd-handle {
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  white-space: nowrap;
}
.dd-handle * {
  cursor: pointer;
}
.active {
  color: #2ea8e5;
  background: #fff;
}
</style>
