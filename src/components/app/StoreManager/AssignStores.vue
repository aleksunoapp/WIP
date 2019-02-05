<template>
  <modal
    ref="modal"
    :show="showAssignStoresModal"
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
        Assign Stores To Group '{{ groupDetails.name }}'
      </h4>
    </div>
    <div
      slot="modal-body"
      class="modal-body relative-block"
    >
      <div class="row">
        <div class="col-md-12">
          <div
            v-show="errorMessage"
            ref="errorMessage"
            class="alert alert-danger"
          >
            <button
              class="close"
              @click="clearError('errorMessage')"
            />
            <span>{{ errorMessage }}</span>
          </div>
        </div>
      </div>
      <loading-screen
        :show="displaySpinner"
        :color="'#2C3E50'"
        :display="'inline'"
      />
      <store-picker
        v-if="!displaySpinner"
        :previously-selected="groupLocations"
        @update="selectStores"
      />
    </div>
    <div
      slot="modal-footer"
      class="modal-footer"
    >
      <button
        type="button"
        class="btn blue"
        :disabled="assigning"
        @click="assignStoresToGroup()"
      >
        Assign
        <i
          v-show="assigning"
          class="fa fa-spinner fa-pulse fa-fw"
        />
      </button>
    </div>
  </modal>
</template>
<script>
import StoreGroupsFunctions from '../../../controllers/StoreGroups'
import Modal from '../../modules/Modal'
import LoadingScreen from '../../modules/LoadingScreen'
import StorePicker from '../../modules/StorePicker'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
  components: {
    Modal,
    LoadingScreen,
    StorePicker
  },
  props: {
    passedGroupId: {
      type: Number
    }
  },
  data () {
    return {
      errorMessage: '',
      assigning: false,
      groupDetails: {},
      stores: [],
      groupLocations: [],
      showAssignStoresModal: false,
      selectAllSelected: false,
      displaySpinner: false
    }
  },
  watch: {
    passedGroupId () {
      if (this.passedGroupId > 0) {
        this.groupDetails = {}
        this.stores = []
        this.groupLocations = []
        this.getGroupDetails()
      }
    }
  },
  mounted () {
    this.showAssignStoresModal = true
    // get the details of the selected group
    this.getGroupDetails()
  },
  methods: {
    /**
		 * To clear an error
		 * @function
		 * @param {string} name - Name of the variable to clear
		 * @returns {undefined}
		 */
    clearError (name) {
      this[name] = ''
    },
    selectStores (selectedStores) {
      this.groupLocations = selectedStores
    },
    /**
		 * To notify the parent to close the sideways page.
		 * @function
		 * @returns {undefined}
		 */
    closeModal () {
      this.getGroupDetails()
      this.$emit('closeAssignStoresModal')
    },
    /**
		 * To select all or deselect all items
		 * @function
		 * @param {boolean} value - The value of the checkbox
		 * @returns {undefined}
		 */
    syncSelectAll (value) {
      if (!value) {
        this.selectAllSelected = false
      }
    },
    /**
		 * To select all or deselect all items
		 * @function
		 * @returns {undefined}
		 */
    selectAll () {
      for (var i = 0; i < this.stores.length; i++) {
        this.stores[i].selected = this.selectAllSelected
      }
    },
    /**
		 * To get the details of the selected group.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getGroupDetails () {
      this.displaySpinner = true
      var assignStoresVue = this

      StoreGroupsFunctions.getGroupDetails(
        assignStoresVue.passedGroupId,
        assignStoresVue.$root.appId,
        assignStoresVue.$root.appSecret,
        assignStoresVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            assignStoresVue.groupDetails = response.payload
          }
          assignStoresVue.getGroupLocations()
        })
        .catch(reason => {
          assignStoresVue.displaySpinner = false
          ajaxErrorHandler({
            reason,
            errorText: 'We could not assign the stores',
            errorName: 'errorMessage',
            vue: assignStoresVue,
            containerRef: 'modal'
          })
        })
    },
    /**
		 * To get the list of locations that belong to the current group.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getGroupLocations () {
      var assignStoresVue = this

      StoreGroupsFunctions.getGroupLocations(
        assignStoresVue.passedGroupId,
        assignStoresVue.$root.appId,
        assignStoresVue.$root.appSecret,
        assignStoresVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            assignStoresVue.groupLocations = response.payload.locations.map(
              location => location.id
            )
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch group info',
            errorName: 'errorMessage',
            vue: assignStoresVue,
            containerRef: 'modal'
          })
        })
        .finally(() => {
          assignStoresVue.displaySpinner = false
        })
    },
    /**
		 * To assign the selected stores to the current group.
		 * @function
		 * @param {array} storesToBeAssigned - An array of store ids
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    assignStoresToGroup () {
      var assignStoresVue = this
      if (this.groupLocations.length === 0) {
        this.errorMessage = 'You have not selected any stores'
        this.$el.scrollTop = 0
        return
      }
      this.assigning = true
      StoreGroupsFunctions.assignStoresToGroup(
        assignStoresVue.passedGroupId,
        assignStoresVue.groupLocations,
        assignStoresVue.$root.appId,
        assignStoresVue.$root.appSecret,
        assignStoresVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            assignStoresVue.closeModal()
            assignStoresVue.showAlert(response.payload)
            assignStoresVue.closeSidewaysPage()
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not assign the stores',
            errorName: 'errorMessage',
            vue: assignStoresVue,
            containerRef: 'modal'
          })
        })
        .finally(() => {
          assignStoresVue.assigning = false
        })
    },
    /**
		 * To notify the parent to close the sideways page.
		 * @function
		 * @returns {undefined}
		 */
    closeSidewaysPage () {
      this.$emit('closeSidewaysPage')
    },
    /**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    showAlert (payload = {}) {
      let title = 'Success'
      let text = 'The Stores have been saved'
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
    }
  }
}
</script>
<style scoped>
.height-mod {
  max-height: 550px;
  overflow: auto;
}
</style>
