<template>
  <modal
    ref="modal"
    :show="showMenuTreeModal"
    :width="900"
    :full-height="true"
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
      <h4
        v-if="updateType !== 'sku'"
        class="modal-title center"
      >
        Apply
        <i>{{ headerText }}</i> To Multiple Items
      </h4>
      <h4
        v-else
        class="modal-title center"
      >
        {{ headerText }}
      </h4>
    </div>
    <div
      slot="modal-body"
      class="modal-body height-100"
    >
      <div class="portlet light">
        <div class="portlet-body">
          <div
            v-show="errorMessage"
            ref="errorMessage"
            class="row"
          >
            <div class="col-md-12">
              <div class="alert alert-danger">
                <button
                  class="close"
                  @click="clearError()"
                />
                <span>{{ errorMessage }}</span>
              </div>
            </div>
          </div>
          <div
            v-show="$root.activeLocation.id === undefined"
            class="row"
          >
            <div class="col-md-12">
              <div class="alert alert-info">
                <h4>No Store Selected</h4>
                <p>Please select a store from the stores panel on the right to view its menus</p>
              </div>
            </div>
          </div>
          <div
            v-show="$root.activeLocation.id !== undefined"
            class="row"
          >
            <menu-item-picker
              :previously-selected="selectedSKUs"
              @update="itemsSelected"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      slot="modal-footer"
      class="modal-footer"
    >
      <button
        v-show="$root.activeLocation.id === undefined"
        type="button"
        class="btn btn-primary"
        @click="closeModal()"
      >
        Close
      </button>
      <button
        v-show="$root.activeLocation.id !== undefined"
        type="button"
        class="btn btn-primary"
        @click="applySelectedItems()"
      >
        Save
      </button>
    </div>
  </modal>
</template>

<script>
// import $ from 'jquery'
import Modal from './Modal'
import ModifiersFunctions from '../../controllers/Modifiers'
import TagsFunctions from '../../controllers/Tags'
import ajaxErrorHandler from '@/controllers/ErrorController'
import MenuItemPicker from '@/components/modules/MenuItemPicker'

export default {
  components: {
    Modal,
    MenuItemPicker
  },
  props: {
    headerText: {
      type: String
    },
    selectedObject: {
      type: Object,
      default: () => {
        return {}
      }
    },
    updateType: {
      type: String
    },
    showCorporateMenus: {
      type: Boolean,
      default: false
    },
    selectedSKUs: {
      type: Array,
      default: () => {
        return []
      }
    },
    errorMessage: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showMenuTreeModal: false,
      items: [],
      isMenuSelected: false,
      selectAllSelected: false,
      isCategorySelected: false,
      activeMenu: {},
      activeCategory: {}
    }
  },
  mounted () {
    this.showMenuTreeModal = true
  },
  methods: {
    /**
		 * To update the selection of items.
		 * @function
		 * @param {array} selected - Array of selected items
		 * @returns {undefined}
		 */
    itemsSelected (selected) {
      this.items = selected
    },
    /**
		 * To close the modal.
		 * @function
		 * @param {object} payload - payload property of the server response
		 * @returns {undefined}
		 */
    closeModal (payload) {
      this.$emit('closeMenuTreeModal', payload)
    },
    /**
		 * To notify parent error should be cleared.
		 * @function
		 * @returns {undefined}
		 */
    clearError () {
      this.$emit('clearError')
    },
    /**
		 * To apply the selected modifier to all the checked off menu items.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    applyModifierToSelectedItems () {
      var menuTreeVue = this
      var selectedItems = []
      var unselectedItems = []
      for (var i = 0; i < menuTreeVue.items.length; i++) {
        if (menuTreeVue.items[i].selected) {
          selectedItems.push(menuTreeVue.items[i].id)
        } else {
          unselectedItems.push(menuTreeVue.items[i].id)
        }
      }
      ModifiersFunctions.applyModifierToMultipleItems(
        menuTreeVue.selectedObject.id,
        selectedItems,
        unselectedItems,
        menuTreeVue.$root.appId,
        menuTreeVue.$root.appSecret,
        menuTreeVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            menuTreeVue.closeModal()
            menuTreeVue.showApplyToItemsSuccess(response.payload)
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not apply the modifier',
            errorName: 'errorMessage',
            vue: menuTreeVue,
            containerRef: 'modal'
          })
        })
    },
    /**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    showApplyToItemsSuccess (payload = {}) {
      if (payload === null) {
        payload = {}
      }
      let title = 'Success'
      let text = 'The Modifier has been saved'
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
		 * To apply the selected tag to all the checked off menu items.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    applyTagToSelectedItems () {
      var menuTreeVue = this
      var selectedItems = []
      var unselectedItems = []
      for (var i = 0; i < menuTreeVue.items.length; i++) {
        if (menuTreeVue.items[i].selected) {
          selectedItems.push(menuTreeVue.items[i].id)
        } else {
          unselectedItems.push(menuTreeVue.items[i].id)
        }
      }
      TagsFunctions.applyTagToMultipleItems(
        menuTreeVue.selectedObject.id,
        selectedItems,
        unselectedItems,
        menuTreeVue.$root.appId,
        menuTreeVue.$root.appSecret,
        menuTreeVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            menuTreeVue.closeModal()
            menuTreeVue.showApplyToTagsSuccess(response.payload)
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not apply the tag',
            errorName: 'errorMessage',
            vue: menuTreeVue,
            containerRef: 'modal'
          })
        })
    },
    /**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    showApplyToTagsSuccess (payload = {}) {
      if (payload === null) payload = {}
      let title = 'Success'
      let text = 'The Tag has been saved'
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
    applyItemSKUToRewardItem () {
      var menuTreeVue = this
      var selectedItems = []
      for (var i = 0; i < menuTreeVue.items.length; i++) {
        if (menuTreeVue.items[i].selected) {
          selectedItems.push(menuTreeVue.items[i].sku)
        }
      }
      this.$emit('updateSKUs', selectedItems)
    },
    selectItemsForPromoCode () {
      var selectedItems = []
      var unselectedItems = []
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].selected) {
          selectedItems.push(this.items[i].sku)
        } else {
          unselectedItems.push(this.items[i].sku)
        }
      }
      this.$emit('closeMenuTreeModal', { selectedItems, unselectedItems })
    },
    selectItemsForAttributes () {
      var selectedItems = []
      var unselectedItems = []
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].selected) {
          selectedItems.push(this.items[i].id)
        } else {
          unselectedItems.push(this.items[i].id)
        }
      }
      this.$emit('selectedItems', { selectedItems, unselectedItems })
    },
    /**
		 * To determine which function to call based on the update type passed in by the parent as a prop.
		 * @function
		 * @returns {undefined}
		 */
    applySelectedItems () {
      if (this.updateType === 'modifier') {
        this.applyModifierToSelectedItems()
      } else if (this.updateType === 'tag') {
        this.applyTagToSelectedItems()
      } else if (this.updateType === 'sku') {
        this.applyItemSKUToRewardItem()
      } else if (this.updateType === 'promocode') {
        this.selectItemsForPromoCode()
      } else if (this.updateType === 'attribute') {
        this.selectItemsForAttributes()
      }
    }
  }
}
</script>
<style scoped>
.portlet.light {
  box-shadow: none;
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
