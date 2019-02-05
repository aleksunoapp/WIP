<template>
  <modal
    ref="modal"
    :show="showEditGroupModal"
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
      <h4
        v-if="$root.permissions['stores groups update']"
        class="modal-title center"
      >
        Edit Store Group
      </h4>
      <h4
        v-if="!$root.permissions['stores groups update'] && $root.permissions['stores groups read']"
        class="modal-title center"
      >
        View Store Group
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
      <div class="form-group form-md-line-input form-md-floating-label">
        <input
          id="form_control_1"
          v-model="groupToBeEdited.name"
          type="text"
          class="form-control input-sm edited"
          :disabled="!$root.permissions['stores groups update']"
        >
        <label for="form_control_1">
          Group Name
        </label>
      </div>
      <div class="form-group form-md-line-input form-md-floating-label">
        <input
          id="form_control_2"
          v-model="groupToBeEdited.description"
          type="text"
          class="form-control input-sm edited"
          :disabled="!$root.permissions['stores groups update']"
        >
        <label for="form_control_2">
          Group Description
        </label>
      </div>
    </div>
    <div
      slot="modal-footer"
      class="modal-footer"
    >
      <button
        v-if="$root.permissions['stores groups update']"
        type="button"
        class="btn btn-primary"
        :disabled="updating"
        @click="updateGroup()"
      >
        Save
        <i
          v-show="updating"
          class="fa fa-spinner fa-pulse fa-fw"
        />
      </button>
      <button
        v-if="!$root.permissions['stores groups update'] && $root.permissions['stores groups read']"
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
import Modal from '../../modules/Modal'
import StoreGroupsFunctions from '../../../controllers/StoreGroups'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
  components: {
    Modal
  },
  props: {
    passedGroupId: {
      type: Number
    }
  },
  data () {
    return {
      showEditGroupModal: false,
      updating: false,
      groupToBeEdited: {},
      errorMessage: ''
    }
  },
  created () {
    // get folder details
    this.getGroupDetails()
  },
  mounted () {
    this.showEditGroupModal = true
  },
  methods: {
    /**
		 * To check if the group data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    validateGroupData () {
      var editStoreGroupVue = this
      return new Promise(function (resolve, reject) {
        if (!editStoreGroupVue.groupToBeEdited.name.length) {
          reject('Group name cannot be blank')
        } else if (!editStoreGroupVue.groupToBeEdited.description.length) {
          reject('Group description cannot be blank')
        }
        resolve('Hurray')
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
		 * To get the details of the group to be updated.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getGroupDetails () {
      var editStoreGroupVue = this
      StoreGroupsFunctions.getGroupDetails(
        editStoreGroupVue.passedGroupId,
        editStoreGroupVue.$root.appId,
        editStoreGroupVue.$root.appSecret,
        editStoreGroupVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            editStoreGroupVue.groupToBeEdited = response.payload
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch group info',
            errorName: 'errorMessage',
            vue: editStoreGroupVue,
            containerRef: 'modal'
          })
        })
    },
    /**
		 * To update the group and close the modal.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    updateGroup () {
      var editStoreGroupVue = this
      editStoreGroupVue.clearError()
      editStoreGroupVue.groupToBeEdited.updated_by =
				editStoreGroupVue.$root.createdBy

      return editStoreGroupVue
        .validateGroupData()
        .then(response => {
          editStoreGroupVue.updating = true
          StoreGroupsFunctions.updateGroup(
            editStoreGroupVue.groupToBeEdited,
            editStoreGroupVue.$root.appId,
            editStoreGroupVue.$root.appSecret,
            editStoreGroupVue.$root.userToken
          )
            .then(response => {
              if (response.code === 200 && response.status === 'ok') {
                this.closeModalAndUpdate(response.payload)
              } else {
                editStoreGroupVue.errorMessage = response.message
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'We could not update the group',
                errorName: 'errorMessage',
                vue: editStoreGroupVue,
                containerRef: 'modal'
              })
            })
            .finally(() => {
              editStoreGroupVue.updating = false
            })
        })
        .catch(reason => {
          // If validation fails then display the error message
          editStoreGroupVue.errorMessage = reason
          window.scrollTo(0, 0)
          throw reason
        })
    },
    /**
		 * To just close the modal when the user clicks on the 'x' to close the modal.
		 * @function
		 * @returns {undefined}
		 */
    closeModal () {
      this.$emit('closeEditGroupModal')
    },
    /**
		 * To close the modal and emit the updated folder object to the parent.
		 * @function
		 * @param {object} payload - The payload property of the server response
		 * @returns {undefined}
		 */
    closeModalAndUpdate (payload = {}) {
      this.$emit('updateGroup', {
        group: this.groupToBeEdited,
        payload
      })
    }
  }
}
</script>
