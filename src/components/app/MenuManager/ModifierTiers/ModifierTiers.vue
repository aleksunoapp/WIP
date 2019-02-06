<template>
  <div>
    <div class="page-bar">
      <breadcrumb :crumbs="breadcrumbArray" />
    </div>
    <h1 class="page-title">
      Modifier Tiers
    </h1>
    <div class="note note-info">
      <p>Manage a store's modifier tiers.</p>
    </div>

    <div
      v-if="!corporate"
      class="row"
    >
      <div class="col-xs-12">
        <div
          class="alert alert-info"
        >
          Select a Corporate Store from the panel on the right to use Modifier Tiers.
        </div>
      </div>
    </div>

    <!-- BEGIN CREATE NEW TIER-->
    <div
      v-if="corporate"
      class="portlet box blue-hoki"
    >
      <div
        class="portlet-title bg-blue-chambray"
        @click="toggleCreateModifierTierPanel()"
      >
        <div class="custom tools">
          <a
            :class="{'expand': !createModifierTierCollapse, 'collapse': createModifierTierCollapse}"
          />
        </div>
        <div class="caption">
          &emsp;Create A New Modifier Tier
        </div>
      </div>
      <div
        class="portlet-body"
        :class="{'display-hide': createModifierTierCollapse}"
      >
        <form
          role="form"
          @submit.prevent="createNewModifierTier($event)"
        >
          <div class="form-body row">
            <div class="col-md-12">
              <div
                v-show="createErrorMessage.length"
                ref="createErrorMessage"
                class="alert alert-danger"
              >
                <button
                  class="close"
                  @click.prevent="clearError('createErrorMessage')"
                />
                <span>{{ createErrorMessage }}</span>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_1"
                  v-model="newModifierTier.name"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newModifierTier.name.length}"
                >
                <label for="form_control_1">
                  Modifier Tier Name
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
    <!-- END CREATE NEW TIER-->
    <!-- BEGIN LIST-->
    <div
      v-if="corporate"
      class="portlet light portlet-fit bordered margin-top-20"
    >
      <div class="portlet-title bg-blue-chambray">
        <div class="menu-image-main">
          <img src="../../../../../public/client_logo.png">
        </div>
        <div class="caption">
          <span class="caption-subject font-default bold uppercase">
            Modifier Tiers
          </span>
          <div
            class="caption-desc font-grey-cascade"
          >
            Edit modifier tiers, assign modifier categories to tiers, and remove tiers.
          </div>
        </div>
      </div>
      <div class="portlet-body">
        <div class="col-xs-12">
          <div
            v-show="listErrorMessage.length"
            ref="listErrorMessage"
            class="alert alert-danger"
          >
            <button
              class="close"
              data-close="alert"
              @click="clearError('listErrorMessage')"
            />
            <span>{{ listErrorMessage }}</span>
          </div>
        </div>

        <loading-screen
          :show="loadingModifierTiers"
          :color="'#2C3E50'"
          :display="'inline'"
        />

        <no-results
          :show="!modifierTiers.length"
          :type="'menu tiers'"
        />

        <div class="mt-element-list margin-top-15">
          <div class="mt-list-container list-news">
            <ul>
              <li
                v-for="tier in modifierTiers"
                :id="'tier-' + tier.id"
                :key="tier.id"
                class="mt-list-item margin-top-15"
                :class="{'highlight' : animated === `tier-${tier.id}`}"
              >
                <div class="margin-bottom-15 actions-on-top">
                  <el-tooltip
                    content="Edit"
                    effect="light"
                    placement="top"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="openEditModal(tier)"
                    >
                      <i class="fa fa-lg fa-pencil" />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    content="Assign modifiers"
                    effect="light"
                    placement="top"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="openAssignModal(tier)"
                    >
                      <i class="icon-layers" />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    content="Apply to items"
                    effect="light"
                    placement="top"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="openApplyToMenuItemsModal(tier)"
                    >
                      <i class="fa fa-lg fa-plus" />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    content="Delete tier"
                    effect="light"
                    placement="top"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="openDeleteModal(tier)"
                    >
                      <i class="fa fa-lg fa-trash" />
                    </a>
                  </el-tooltip>
                </div>
                <div class="list-datetime bold uppercase font-red">
                  <span>{{ tier.name }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- END LIST-->
    <edit-modifier-tier
      v-if="showEditTierModal"
      :tier="tierToEdit"
      @close="closeEditModal"
      @updated="updateTier"
    />

    <assign-modifiers
      v-if="showAssignModifiersModal"
      :tier="tierToAssignTo"
      @applied="confirmAssigned"
      @close="closeAssignModal"
    />

    <apply-modifier-tier-to-menu-items
      v-if="showApplyToMenuItemsModal"
      :tier="tierToApplyToMenuItems"
      @assigned="confirmAppliedToMenuItems"
      @close="closeApplyToMenuItemsModal"
    />

    <delete-modifier-tier
      v-if="showDeleteTierModal"
      :tier="tierToDelete"
      @close="closeDeleteModal"
      @deleted="removeTier"
    />
  </div>
</template>

<script>
import Breadcrumb from '@/components/modules/Breadcrumb'
import NoResults from '@/components/modules/NoResults'
import LoadingScreen from '@/components/modules/LoadingScreen'
import ModifierTiersFunctions from '@/controllers/ModifierTiers'
import EditModifierTier from '@/components/app/MenuManager/ModifierTiers/EditModifierTier'
import DeleteModifierTier from '@/components/app/MenuManager/ModifierTiers/DeleteModifierTier'
import AssignModifiers from '@/components/app/MenuManager/ModifierTiers/AssignModifiersToModifierTier'
import ApplyModifierTierToMenuItems from '@/components/app/MenuManager/ModifierTiers/ApplyModifierTierToMenuItems'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
  components: {
    Breadcrumb,
    LoadingScreen,
    NoResults,
    AssignModifiers,
    EditModifierTier,
    DeleteModifierTier,
    ApplyModifierTierToMenuItems
  },
  data () {
    return {
      breadcrumbArray: [
        { name: 'Menu Manager', link: false },
        { name: 'Modifier Tiers', link: false }
      ],
      createModifierTierCollapse: true,
      createErrorMessage: '',
      newModifierTier: {
        name: ''
      },
      loadingModifierTiers: false,
      listErrorMessage: '',
      modifierTiers: [],
      animated: '',
      showAssignModifiersModal: false,
      tierToAssignTo: {},
      showEditTierModal: false,
      tierToEdit: {},
      showApplyToMenuItemsModal: false,
      tierToApplyToMenuItems: {},
      showDeleteTierModal: false,
      tierToDelete: {}
    }
  },
  computed: {
    corporate () {
      return (
        this.$root.activeLocation && this.$root.activeLocation.is_corporate
      )
    }
  },
  created () {
    this.getModifierTiers()
  },
  methods: {
    /**
     * To get a list of modifier tiers.
     * @function
     * @returns {object} - A promise that will either return an error message or perform an action.
     */
    getModifierTiers () {
      this.loadingModifierTiers = true
      var modifierTiersVue = this
      return ModifierTiersFunctions.getModifierTiers()
        .then(response => {
          modifierTiersVue.modifierTiers = response.payload.sort(
            (a, b) => a.name > b.name
          )
          modifierTiersVue.loadingModifierTiers = false
        })
        .catch(reason => {
          modifierTiersVue.loadingModifierTiers = false
          ajaxErrorHandler({
            reason,
            errorText: "We couldn't fetch Modifier Tiers",
            errorName: 'listErrorMessage',
            vue: modifierTiersVue
          })
        })
    },
    /**
     * To clear an error.
     * @function
     * @param {string} name - Name of the variable to clear
     * @returns {undefined}
     */
    clearError (name) {
      this[name] = ''
    },
    /**
     * To toggle the create menu panel
     * @function
     * @returns {undefined}
     */
    toggleCreateModifierTierPanel () {
      this.createModifierTierCollapse = !this.createModifierTierCollapse
    },
    /**
     * To clear the new modifier tier form.
     * @function
     * @returns {undefined}
     */
    clearNewModifierTier () {
      this.newModifierTier = {
        name: ''
      }
    },

    /**
     * To check if the data is valid before submitting to the backend.
     * @function
     * @returns {object} A promise that will validate the input form
     */
    validateModifierTierData () {
      var modifierTiersVue = this
      return new Promise(function (resolve, reject) {
        if (!modifierTiersVue.newModifierTier.name.length) {
          reject('Modifier tier name cannot be blank')
        }
        resolve('Hurray')
      })
    },
    /**
     * To create a new modifier tier.
     * @function
     * @returns {object} - A promise that will either return an error message or perform an action.
     */
    createNewModifierTier () {
      var modifierTiersVue = this
      modifierTiersVue.clearError('createErrorMessage')
      const payload = {
        ...this.newModifierTier,
        location_id: this.$root.activeLocation.id
      }

      return modifierTiersVue
        .validateModifierTierData()
        .then(response => {
          ModifierTiersFunctions.createModifierTier(payload)
            .then(response => {
              modifierTiersVue.confirmCreated(response.payload)
              modifierTiersVue.addMenuTier(response.payload)
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: "We couldn't create the tier",
                errorName: 'createErrorMessage',
                vue: modifierTiersVue
              })
            })
        })
        .catch(reason => {
          modifierTiersVue.createErrorMessage = reason
          modifierTiersVue.$scrollTo(
            modifierTiersVue.$refs.createErrorMessage,
            1000,
            { offset: -50 }
          )
        })
    },
    /**
     * To notify user of the outcome of the call
     * @function
     * @param {object} payload - The payload object from the server response
     * @returns {undefined}
     */
    confirmCreated (payload = {}) {
      let title = 'Success'
      let text = 'The Modifier Tier has been created'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The Modifier Tier has been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      })
    },
    /**
     * To add the newly created tier to the list.
     * @function
     * @param {object} tier - The new modifier tier object
     * @returns {undefined}
     */
    addMenuTier (tier) {
      this.modifierTiers.push(tier)
      this.modifierTiers.sort((a, b) => a.name > b.name)
      this.clearNewModifierTier()
    },
    /**
     * To display the modal for editing a modifier tier.
     * @function
     * @param {object} tier - The selected modifier tier.
     * @returns {undefined}
     */
    openEditModal (tier) {
      this.tierToEdit = tier
      this.showEditTierModal = true
    },
    /**
     * To close the modal for editing a modifier tier.
     * @function
     * @returns {undefined}
     */
    closeEditModal () {
      this.showEditTierModal = false
    },
    /**
     * To update a tier.
     * @function
     * @param {object} payload - The payload object from the server response
     * @returns {undefined}
     */
    updateTier (payload = {}) {
      this.tierToEdit = payload
      this.modifierTiers.forEach(t => {
        if (t.id === payload.id) {
          t.name = payload.name
        }
      })
      this.closeEditModal()

      let title = 'Success'
      let text = 'The Modifier Tier has been saved'
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

      if (!payload.pending_approval) {
        this.animated = `tier-${payload.id}`
      }
    },
    /**
     * To display the modal for assigning modifiers to a menu tier.
     * @function
     * @param {object} tier - The selected modifier tier.
     * @returns {undefined}
     */
    openAssignModal (tier) {
      this.tierToAssignTo = tier
      this.showAssignModifiersModal = true
    },
    /**
     * To notify user of the outcome of the call
     * @function
     * @param {object} payload - The payload object from the server response
     * @returns {undefined}
     */
    confirmAssigned (payload = {}) {
      this.closeAssignModal()

      let title = 'Success'
      let text = 'The Modifiers have been saved'
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
     * To close the modal for assigning modifiers to a menu tier.
     * @function
     * @returns {undefined}
     */
    closeAssignModal () {
      this.showAssignModifiersModal = false
    },
    /**
     * To display the modal for applying a modifier tier to menu items.
     * @function
     * @param {object} tier - The selected modifier tier.
     * @returns {undefined}
     */
    openApplyToMenuItemsModal (tier) {
      this.tierToApplyToMenuItems = tier
      this.showApplyToMenuItemsModal = true
    },
    /**
     * To notify user of the outcome of the call
     * @function
     * @param {object} payload - The payload object from the server response
     * @returns {undefined}
     */
    confirmAppliedToMenuItems (payload = {}) {
      this.closeApplyToMenuItemsModal()

      let title = 'Success'
      let text = 'The Modifier Tiers have been saved'
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
     * To close the modal for applying a modifier tier to menu items.
     * @function
     * @returns {undefined}
     */
    closeApplyToMenuItemsModal () {
      this.showApplyToMenuItemsModal = false
    },
    /**
     * To display the modal for deleting a modifier tier.
     * @function
     * @param {object} tier - The selected modifier tier.
     * @returns {undefined}
     */
    openDeleteModal (tier) {
      this.tierToDelete = tier
      this.showDeleteTierModal = true
    },
    /**
     * To close the modal for deleting a modifier tier.
     * @function
     * @returns {undefined}
     */
    closeDeleteModal () {
      this.showDeleteTierModal = false
    },
    /**
     * To remove a tier and notify user of the outcome of the call
     * @function
     * @param {object} payload - The payload object from the server response
     * @returns {undefined}
     */
    removeTier (payload = {}) {
      this.closeDeleteModal()

      let title = 'Success'
      let text = 'The Modifier has been deleted'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The removal has been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      })

      if (!payload.pending_approval) {
        this.modifierTiers = this.modifierTiers.filter(
          t => t.id !== this.tierToDelete.id
        )
      }
    }
  }
}
</script>

<style scoped>
.mt-element-list .list-news.mt-list-container {
  padding-top: 0;
}
.mt-list-item {
  min-height: 124px;
}
.mt-element-list .list-news.mt-list-container ul > .mt-list-item:hover {
  background-color: #fff;
}
.actions-on-top {
  margin-top: -5px;
}
</style>
