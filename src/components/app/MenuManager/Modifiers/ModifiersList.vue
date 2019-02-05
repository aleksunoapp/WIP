<template>
  <modal
    ref="modal"
    :show="showModifierModal"
    :width="700"
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
      <h4 class="modal-title center">
        Select Modifiers
      </h4>
    </div>
    <div
      slot="modal-body"
      class="modal-body"
    >
      <div
        v-show="errorMessage"
        ref="errorMessage"
        class="alert alert-danger"
      >
        <button
          class="close"
          @click="clearError()"
        />
        <span>{{ errorMessage }}</span>
      </div>
      <div
        v-if="storeModifiers.length"
        class="table-scrollable table-fixed-height"
      >
        <table class="table">
          <thead>
            <tr>
              <th>
                <div class="md-checkbox has-success">
                  <input
                    id="select_all"
                    v-model="allSelected"
                    type="checkbox"
                    class="md-check"
                    @click="selectAllModifiers"
                  >
                  <label for="select_all">
                    <span class="inc" />
                    <span class="check" />
                    <span class="box" />
                  </label>
                </div>
              </th>
              <th> Image </th>
              <th> Name </th>
              <th> Description </th>
              <th> Max </th>
              <th> Min </th>
              <th> Status </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="modifier in storeModifiers"
              :key="modifier.id"
            >
              <td>
                <div class="md-checkbox has-success">
                  <input
                    :id="'modifier_checkbox_' + modifier.id"
                    v-model="modifier.selected"
                    type="checkbox"
                    class="md-check"
                  >
                  <label :for="'modifier_checkbox_' + modifier.id">
                    <span class="inc" />
                    <span class="check" />
                    <span class="box" />
                  </label>
                </div>
              </td>
              <td>
                <img
                  :src="modifier.image_url"
                  width="30"
                  height="30"
                >
              </td>
              <td> {{ modifier.name }} </td>
              <td> {{ modifier.desc }} </td>
              <td> {{ modifier.max }} </td>
              <td> {{ modifier.min }} </td>
              <td>
                <span v-if="modifier.status === 1">
                  Available
                </span>
                <span v-if="modifier.status === 0">
                  Sold Out
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div
      slot="modal-footer"
      class="modal-footer"
    >
      <button
        type="button"
        class="btn btn-primary"
        :disabled="!storeModifiers.length || applying"
        @click="applyModifiersToItem()"
      >
        Apply Modifiers
        <i
          v-show="applying"
          class="fa fa-spinner fa-pulse fa-fw"
        />
      </button>
    </div>
  </modal>
</template>

<script>
import Modal from '../../../modules/Modal'
import ModifiersFunctions from '../../../../controllers/Modifiers'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
  components: {
    Modal
  },
  props: {
    appliedModifiers: {
      type: Array,
      default: []
    },
    selectedItemId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      showModifierModal: false,
      applying: false,
      errorMessage: '',
      storeModifiers: [],
      allSelected: false
    }
  },
  created () {
    this.getStoreModifiers()
  },
  mounted () {
    this.showModifierModal = true
  },
  methods: {
    /**
		 * To clear the error message.
		 * @function
		 * @returns {undefined}
		 */
    clearError () {
      this.errorMessage = ''
    },
    /**
		 * To just close the modal and emit the selected item to the parent.
		 * @function
		 * @returns {undefined}
		 */
    closeModal () {
      this.$emit('deactivateModifierModal', this.selectedItemId)
    },
    /**
		 * To get a list of modifier categories for a store.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getStoreModifiers () {
      var modifiersListVue = this
      modifiersListVue.storeModifiers = []
      ModifiersFunctions.getStoreModifiers(
        modifiersListVue.$root.activeLocation.id
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            modifiersListVue.storeModifiers = response.payload
            if (modifiersListVue.appliedModifiers.length) {
              for (var i = 0; i < modifiersListVue.storeModifiers.length; i++) {
                for (
                  var j = 0;
                  j < modifiersListVue.appliedModifiers.length;
                  j++
                ) {
                  if (
                    modifiersListVue.storeModifiers[i].id ===
										modifiersListVue.appliedModifiers[j].id
                  ) {
                    modifiersListVue.$set(
                      modifiersListVue.storeModifiers[i],
                      'selected',
                      true
                    )
                    break
                  } else {
                    modifiersListVue.$set(
                      modifiersListVue.storeModifiers[i],
                      'selected',
                      false
                    )
                  }
                }
              }
            }
          } else {
            modifiersListVue.errorMessage = response.payload
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch modifiers',
            errorName: 'errorMessage',
            vue: modifiersListVue,
            containerRef: 'modal'
          })
        })
    },
    /**
		 * To apply some of the existing modifiers to an item.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    applyModifiersToItem () {
      this.applying = true
      var modifiersListVue = this
      var modifiersToBeApplied = []
      for (var k = 0; k < modifiersListVue.storeModifiers.length; k++) {
        if (modifiersListVue.storeModifiers[k].selected) {
          modifiersToBeApplied.push(modifiersListVue.storeModifiers[k])
        }
      }
      ModifiersFunctions.applyModifiersToItem(
        modifiersListVue.selectedItemId,
        modifiersToBeApplied,
        modifiersListVue.$root.appId,
        modifiersListVue.$root.appSecret,
        modifiersListVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            modifiersListVue.showUpdateSuccess(response.payload)
            modifiersListVue.closeModal()
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch modifiers',
            errorName: 'errorMessage',
            vue: modifiersListVue,
            containerRef: 'modal'
          })
        })
        .finally(() => {
          modifiersListVue.applying = false
        })
    },
    /**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    showUpdateSuccess (payload = {}) {
      let title = 'Success'
      let text = 'The Modifiers have been saved'
      let type = 'success'

      if (payload.pending_approval) {
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
		 * To select all modifiers on an item
		 * @function
		 * @returns {undefined}
		 */
    selectAllModifiers () {
      this.allSelected = !this.allSelected
      for (let i = 0; i < this.storeModifiers.length; i++) {
        this.storeModifiers[i].selected = this.allSelected
      }
    }
  }
}
</script>
