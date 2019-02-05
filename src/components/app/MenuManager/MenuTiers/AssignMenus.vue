<template>
  <modal
    ref="assignModal"
    :show="showAssignMenusModal"
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
        Assign Menus To Tier '{{ tierDetails.name }}'
      </h4>
    </div>
    <div
      slot="modal-body"
      class="modal-body"
    >
      <loading-screen
        :show="displaySpinner"
        :color="'#2C3E50'"
        :display="'inline'"
      />
      <form
        v-show="!displaySpinner"
        role="form"
        novalidate
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
        <div class="form-body invite-user-form height-mod">
          <table
            v-show="menus.length"
            class="table"
          >
            <thead>
              <tr>
                <th>
                  <div
                    class="md-checkbox has-success"
                    @change="selectAll()"
                  >
                    <input
                      id="locations-promocodes"
                      v-model="selectAllSelected"
                      :disabled="!$root.permissions['menu_manager tiers update']"
                      type="checkbox"
                      class="md-check"
                    >
                    <label for="locations-promocodes">
                      <span class="inc" />
                      <span class="check" />
                      <span class="box" />
                    </label>
                  </div>
                </th>
                <th> Menu Name </th>
                <th> Menu Description </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="menu in menus"
                :key="menu.id"
              >
                <td>
                  <div class="md-checkbox has-success">
                    <input
                      :id="`menu-${menu.id}`"
                      v-model="menu.selected"
                      :disabled="!$root.permissions['menu_manager tiers update']"
                      type="checkbox"
                      class="md-check"
                      @change="syncSelectAll(menu.selected)"
                    >
                    <label :for="`menu-${menu.id}`">
                      <span class="inc" />
                      <span class="check" />
                      <span class="box" />
                    </label>
                  </div>
                </td>
                <td> {{ menu.name }} </td>
                <td> {{ menu.desc }} </td>
              </tr>
            </tbody>
          </table>
          <p v-show="!displaySpinner && !menus.length">
            The corporate store does not have any Menus.
          </p>
        </div>
      </form>
    </div>
    <div
      slot="modal-footer"
      class="modal-footer"
    >
      <button
        v-if="!$root.permissions['menu_manager tiers update']"
        type="button"
        class="btn blue"
        @click="closeModal()"
      >
        Close
      </button>
      <button
        v-else
        type="button"
        class="btn blue"
        @click="assignMenusToTier()"
      >
        Assign
      </button>
    </div>
  </modal>
</template>
<script>
import MenusFunctions from '../../../../controllers/Menus'
import MenuTiersFunctions from '../../../../controllers/MenuTiers'
import Modal from '../../../modules/Modal'
import LoadingScreen from '../../../modules/LoadingScreen'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
  components: {
    Modal,
    LoadingScreen
  },
  props: {
    passedTierId: {
      type: Number
    }
  },
  data () {
    return {
      errorMessage: '',
      tierDetails: {},
      menus: [],
      tierMenus: [],
      showAssignMenusModal: false,
      selectAllSelected: false,
      displaySpinner: false
    }
  },
  watch: {
    passedTierId () {
      if (this.passedTierId > 0) {
        this.tierDetails = {}
        this.menus = []
        this.tierMenus = []
        this.getMenuTierDetails()
      }
    }
  },
  mounted () {
    this.showAssignMenusModal = true
    // get the details of the selected menu tier
    this.getMenuTierDetails()
  },
  methods: {
    /**
		 * To get the details of the menu tier to be updated.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getMenuTierDetails () {
      this.displaySpinner = true
      var assignMenusVue = this
      MenuTiersFunctions.getMenuTierDetails(
        assignMenusVue.passedTierId,
        assignMenusVue.$root.appId,
        assignMenusVue.$root.appSecret,
        assignMenusVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            assignMenusVue.tierDetails = response.payload
          }
          assignMenusVue.getTierMenus()
        })
        .catch(reason => {
          assignMenusVue.displaySpinner = false
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch tier info',
            errorName: 'errorMessage',
            vue: assignMenusVue,
            containerRef: 'assignModal'
          })
        })
    },
    /**
		 * To get the list of locations that belong to the current group.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getTierMenus () {
      var assignMenusVue = this

      MenuTiersFunctions.getTierMenus(
        assignMenusVue.passedTierId,
        assignMenusVue.$root.appId,
        assignMenusVue.$root.appSecret,
        assignMenusVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            assignMenusVue.tierMenus = response.payload
          }
          assignMenusVue.getCorporateStoreMenus()
        })
        .catch(reason => {
          assignMenusVue.displaySpinner = false
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch tier menus',
            errorName: 'errorMessage',
            vue: assignMenusVue,
            containerRef: 'assignModal'
          })
        })
    },
    /**
		 * To get a list of store for the current application/business.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getCorporateStoreMenus () {
      var assignMenusVue = this
      assignMenusVue.menus = []
      return MenusFunctions.getStoreMenus(
        assignMenusVue.$root.appId,
        assignMenusVue.$root.appSecret,
        assignMenusVue.$root.corporateStoreId
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            for (var i = 0; i < response.payload.length; i++) {
              for (var j = 0; j < assignMenusVue.tierMenus.length; j++) {
                if (response.payload[i].id === assignMenusVue.tierMenus[j].id) {
                  response.payload[i].selected = true
                }
              }
            }
            assignMenusVue.selectAllSelected =
							response.payload.length &&
							!response.payload.some(menu => !menu.selected)
            assignMenusVue.menus = response.payload
          }
          assignMenusVue.displaySpinner = false
        })
        .catch(reason => {
          assignMenusVue.displaySpinner = false
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch menus',
            errorName: 'errorMessage',
            vue: assignMenusVue,
            containerRef: 'assignModal'
          })
        })
    },
    /**
		 * To assign the selected menus to the current tier.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    assignMenusToTier () {
      var assignMenusVue = this
      var menusToAdd = []
      var menusToRemove = []
      for (var k = 0; k < assignMenusVue.menus.length; k++) {
        if (assignMenusVue.menus[k].selected) {
          menusToAdd.push(assignMenusVue.menus[k].id)
        } else {
          menusToRemove.push(assignMenusVue.menus[k].id)
        }
      }
      MenuTiersFunctions.assignMenusToTier(
        assignMenusVue.passedTierId,
        menusToAdd,
        menusToRemove,
        assignMenusVue.$root.appId,
        assignMenusVue.$root.appSecret,
        assignMenusVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            assignMenusVue.closeModal()
            assignMenusVue.showAlert(response.payload)
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not assign the menus',
            errorName: 'errorMessage',
            vue: assignMenusVue,
            containerRef: 'assignModal'
          })
        })
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
      for (var i = 0; i < this.menus.length; i++) {
        this.menus[i].selected = this.selectAllSelected
      }
    },
    /**
		 * To notify the parent to close the sideways page.
		 * @function
		 * @returns {undefined}
		 */
    closeModal () {
      this.$emit('closeAssignMenusModal')
    },
    /**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    showAlert (payload = {}) {
      let title = 'Success'
      let text = 'The Menus have been saved'
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
