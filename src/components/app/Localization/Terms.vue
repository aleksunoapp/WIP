<template>
  <div>
    <!-- BEGIN PAGE BAR -->
    <div class="page-bar">
      <breadcrumb :crumbs="breadcrumbArray" />
    </div>
    <!-- END PAGE BAR -->

    <!-- BEGIN PAGE TITLE-->
    <h1 class="page-title">
      Terms
    </h1>
    <!-- END PAGE TITLE -->
    <div class="note note-info">
      <p>Add and manage terms.</p>
    </div>

    <!-- BEGIN CREATE -->
    <div
      v-if="$root.permissions['localization terms create']"
      class="portlet box blue-hoki"
    >
      <div
        class="portlet-title bg-blue-chambray"
        @click="toggleCreatePanel()"
      >
        <div class="caption">
          <i class="fa fa-2x fa-plus-circle" />
          Create a new Term
        </div>
        <div class="tools">
          <a :class="{'expand': !createNewCollapse, 'collapse': createNewCollapse}" />
        </div>
      </div>
      <div
        class="portlet-body relative-block"
        :class="{'display-hide': createNewCollapse}"
      >
        <form
          role="form"
          @submit.prevent="createTerm()"
        >
          <div class="row">
            <div class="col-md-12">
              <div
                v-show="createErrorMessage.length"
                ref="createErrorMessage"
                class="alert alert-danger"
              >
                <button
                  class="close"
                  data-close="alert"
                  @click.prevent="clearError('createErrorMessage')"
                />
                <span>{{ createErrorMessage }}</span>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_1"
                  v-model="newTerm.term"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newTerm.term.length}"
                >
                <label for="form_control_1">
                  Term
                </label>
              </div>
              <div class="margin-top-20">
                <label>
                  Platform:
                  <el-select
                    v-model="newTerm.platform_id"
                    placeholder="Select a platform"
                    size="small"
                    no-data-text="No platforms"
                    remote
                    :loading="loadingPlatforms"
                  >
                    <el-option
                      v-for="platform in platforms"
                      :key="platform.id"
                      :label="platform.name"
                      :value="platform.id"
                    />
                  </el-select>
                </label>
              </div>
              <button
                type="submit"
                class="btn blue pull-right"
                :disabled="creating"
              >
                Create
                <i
                  v-show="creating"
                  class="fa fa-spinner fa-pulse fa-fw"
                />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <!-- END CREATE -->

    <!-- SEARCH START -->
    <div class="margin-top-20">
      <div class="portlet box blue-hoki">
        <div
          class="portlet-title"
          @click="toggleSearchPanel()"
        >
          <div class="caption">
            <i class="fa fa-search" />
            Search
          </div>
          <div class="tools">
            <a :class="{'expand': !searchCollapse, 'collapse': searchCollapse}" />
          </div>
        </div>
        <div
          v-show="!searchCollapse"
          class="portlet-body"
        >
          <div class="row">
            <div class="col-md-12">
              <div
                v-show="searchError.length"
                ref="searchError"
                class="alert alert-danger"
              >
                <button
                  class="close"
                  @click="clearError('searchError')"
                />
                <span>{{ searchError }}</span>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group form-md-line-input form-md-floating-label form-md-line-input-trimmed">
                <div class="input-icon right">
                  <input
                    id="search_terms"
                    ref="search"
                    v-model="searchTerm"
                    type="text"
                    placeholder="Term"
                    class="form-control input-sm"
                    :class="{'edited': searchTerm.length}"
                  >
                  <i
                    class="fa fa-times-circle-o clickable"
                    aria-hidden="true"
                    @click.prevent="resetSearch()"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- SEARCH END -->

    <!-- BEGIN LIST -->
    <div
      id="terms-container"
      class="portlet light portlet-fit bordered margin-top-20"
    >
      <div class="portlet-title bg-blue-chambray">
        <div class="menu-image-main">
          <img src="../../../../public/client_logo.png">
        </div>
        <div class="caption">
          <span class="caption-subject font-green bold uppercase">
            Terms
          </span>
          <div class="caption-desc font-grey-cascade">
            Create, edit or delete terms.
          </div>
        </div>
      </div>
      <div class="col-md-12">
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
      <div class="portlet-body relative-block">
        <loading-screen
          :show="loadingTerms"
          :color="'#2C3E50'"
          :display="'inline'"
        />
        <div
          v-if="terms.length && !loadingTerms"
          class="mt-element-list margin-top-15"
        >
          <div class="mt-list-container list-news ext-1 no-border">
            <ul>
              <li
                v-for="term in terms"
                :id="'term-' + term.id"
                :key="term.id"
                class="mt-list-item actions-at-left margin-top-15 three-vertical-actions"
              >
                <div class="list-item-actions">
                  <el-tooltip
                    v-if="$root.permissions['localization terms update']"
                    content="Edit"
                    effect="light"
                    placement="right"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="editTerm(term, $event)"
                    >
                      <i class="fa fa-lg fa-pencil" />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    v-if="$root.permissions['localization terms read'] && !$root.permissions['localization terms update']"
                    content="View"
                    effect="light"
                    placement="right"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="editTerm(term, $event)"
                    >
                      <i class="fa fa-lg fa-eye" />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    v-if="$root.permissions['localization terms delete']"
                    content="Delete"
                    effect="light"
                    placement="right"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="confirmDelete(term, $event)"
                    >
                      <i class="fa fa-lg fa-trash" />
                    </a>
                  </el-tooltip>
                </div>
                <div class="col-md-12 bold uppercase font-red">
                  <span>{{ term.term }}</span>
                </div>
                <div class="col-md-6">
                  <strong />
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div
          v-if="lastPage > 1"
          class="clearfix margin-top-20"
        >
          <pagination
            :passed-page="currentPage"
            :num-pages="lastPage"
            @activePageChange="changePage"
          />
        </div>
        <div class="margin-top-20">
          <no-results
            :show="!terms.length && !loadingTerms"
            :type="'terms'"
          />
        </div>
      </div>
    </div>
    <!-- END LIST -->

    <!-- START EDIT -->
    <modal
      ref="editModal"
      :show="showEditModal"
      effect="fade"
      @closeOnEscape="closeEditModal"
    >
      <div
        slot="modal-header"
        class="modal-header"
      >
        <button
          type="button"
          class="close"
          @click="closeEditModal()"
        >
          <span>&times;</span>
        </button>
        <h4 class="modal-title center">
          Edit Term
        </h4>
      </div>
      <div
        slot="modal-body"
        class="modal-body"
      >
        <form role="form">
          <div class="row">
            <div class="col-md-12">
              <div
                v-show="editErrorMessage.length"
                ref="editErrorMessage"
                class="alert alert-danger"
              >
                <button
                  class="close"
                  data-close="alert"
                  @click.prevent="clearError('editErrorMessage')"
                />
                <span>{{ editErrorMessage }}</span>
              </div>
            </div>
            <div class="col-md-12">
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_1"
                  v-model="termToEdit.term"
                  :disabled="!$root.permissions['localization terms update']"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': termToEdit.term.length}"
                >
                <label for="form_control_1">
                  Term
                </label>
              </div>
              <div class="margin-top-20">
                <label>
                  Platform:
                  <el-select
                    v-model="termToEdit.platform_id"
                    placeholder="Select a platform"
                    size="small"
                    no-data-text="No platforms"
                    remote
                    :loading="loadingPlatforms"
                    :disabled="!$root.permissions['localization terms update']"
                  >
                    <el-option
                      v-for="platform in platforms"
                      :key="platform.id"
                      :label="platform.name"
                      :value="platform.id"
                    />
                  </el-select>
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer clear"
      >
        <button
          v-if="!$root.permissions['localization terms update']"
          type="button"
          class="btn blue"
          @click="closeEditModal()"
        >
          Close
        </button>
        <button
          v-else
          type="submit"
          class="btn blue"
          :disabled="updating"
          @click="updateTerm()"
        >
          Save
          <i
            v-show="updating"
            class="fa fa-spinner fa-pulse fa-fw"
          />
        </button>
      </div>
    </modal>
    <!-- END EDIT -->

    <!-- START DELETE -->
    <modal
      ref="deleteModal"
      :show="showDeleteModal"
      effect="fade"
      @closeOnEscape="closeDeleteModal"
    >
      <div
        slot="modal-header"
        class="modal-header"
      >
        <button
          type="button"
          class="close"
          @click="closeDeleteModal()"
        >
          <span>&times;</span>
        </button>
        <h4 class="modal-title center">
          Confirm Delete
        </h4>
      </div>
      <div
        slot="modal-body"
        class="modal-body"
      >
        <p>Are you sure you want to delete {{ termToDelete.term }}?</p>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer clear"
      >
        <button
          type="button"
          class="btn blue"
          :disabled="deleting"
          @click="deleteTerm()"
        >
          Delete
          <i
            v-show="deleting"
            class="fa fa-spinner fa-pulse fa-fw"
          />
        </button>
      </div>
    </modal>
    <!-- START DELETE -->
  </div>
</template>

<script>
import Breadcrumb from '@/components/modules/Breadcrumb'
import LoadingScreen from '@/components/modules/LoadingScreen'
import TermsFunctions from '@/controllers/Terms'
import Modal from '@/components/modules/Modal'
import Pagination from '@/components/modules/Pagination'
import NoResults from '@/components/modules/NoResults'
import ajaxErrorHandler from '@/controllers/ErrorController'
import PlatformsFunctions from '@/controllers/Platforms'

export default {
  components: {
    Breadcrumb,
    LoadingScreen,
    Modal,
    NoResults,
    Pagination
  },
  data () {
    return {
      breadcrumbArray: [{ name: 'Terms', link: false }],

      createNewCollapse: true,
      creating: false,
      createErrorMessage: '',
      newTerm: {
        term: '',
        platform_id: null
      },

      searchCollapse: true,
      searchTerm: '',
      searchError: '',
      currentPage: 1,
      itemsPerPage: 10,

      loadingTerms: false,
      listErrorMessage: '',
      allTerms: [],

      showEditModal: false,
      updating: false,
      editErrorMessage: '',
      termToEdit: {
        term: ''
      },

      showDeleteModal: false,
      deleting: false,
      deleteErrorMessage: '',
      termToDelete: {
        term: ''
      },

      loadingPlatforms: false,
      platforms: []
    }
  },
  computed: {
    activeLocationId: function () {
      return this.$root.activeLocation.id
    },
    terms: function () {
      const searchResult = this.allTerms.filter(term => {
        return (
          term.term.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
        )
      })
      searchResult.sort((a, b) => a.term > b.term)

      let begin = (this.currentPage - 1) * this.itemsPerPage
      let end = this.currentPage * this.itemsPerPage

      return searchResult.slice(begin, end)
    },
    lastPage: function () {
      this.currentPage = 1
      return this.searchTerm
        ? Math.ceil(this.terms.length / this.itemsPerPage)
        : Math.ceil(this.allTerms.length / this.itemsPerPage)
    }
  },
  watch: {
    activeLocationId: function (newId) {
      if (newId !== undefined) {
        this.getTerms()
      }
    }
  },
  mounted () {
    this.getTerms()
    this.getPlatforms()
  },
  methods: {
    /**
		 * To get a list of all platforms.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getPlatforms () {
      this.clearError('errorMessage')
      this.loadingPlatforms = true
      this.platforms = []
      var _this = this
      return PlatformsFunctions.listPlatforms()
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            _this.loadingPlatforms = false
            _this.platforms = response.payload
          } else {
            _this.loadingPlatforms = false
          }
        })
        .catch(reason => {
          _this.loadingPlatforms = false
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch the list of platforms',
            errorName: 'errorMessage',
            vue: _this
          })
        })
    },
    /**
		 * To toggle the create tier panel, initially set to closed
		 * @function
		 * @returns {undefined}
		 */
    toggleCreatePanel () {
      this.createNewCollapse = !this.createNewCollapse
    },
    /**
		 * To clear the current error.
		 * @function
		 * @param {object} errorMessageName - The error message to be cleared.
		 * @returns {undefined}
		 */
    clearError (errorMessageName) {
      this[errorMessageName] = ''
    },
    /**
		 * To check if the term data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    validateNewTermData () {
      var _this = this
      return new Promise(function (resolve, reject) {
        if (!_this.newTerm.term.length) {
          reject('Term cannot be blank')
        } else if (_this.newTerm.term.platform_id === null) {
          reject('Select a platform')
        }
        resolve('Hurray')
      })
    },
    /**
		 * To create a new term.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    createTerm () {
      var _this = this
      _this.clearError('createErrorMessage')

      return _this
        .validateNewTermData()
        .then(response => {
          _this.creating = true
          TermsFunctions.createTerm(_this.newTerm)
            .then(response => {
              if (response.code === 200 && response.status === 'ok') {
                _this.showCreateSuccess(response.payload)
                _this.clearNewTerm()
                _this.getTerms()
              } else {
                _this.createErrorMessage = response.message
                _this.$scrollTo(_this.$refs.createErrorMessage, 1000, {
                  offset: -50
                })
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'We could not create the term',
                errorName: 'createErrorMessage',
                vue: _this
              })
            })
            .finally(() => {
              _this.creating = false
            })
        })
        .catch(reason => {
          _this.createErrorMessage = reason
          _this.$scrollTo(_this.$refs.createErrorMessage, 1000, { offset: -50 })
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
      let text = 'The Term has been created'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The Term has been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      })
    },
    /**
		 * To clear the new term form.
		 * @function
		 * @returns {undefined}
		 */
    clearNewTerm () {
      this.newTerm = {
        term: '',
        platform_id: null
      }
    },
    /**
		 * To toggle the search panel
		 * @function
		 * @returns {undefined}
		 */
    toggleSearchPanel () {
      this.searchCollapse = !this.searchCollapse
      this.$nextTick(function () {
        if (!this.searchCollapse) {
          this.$refs.search.focus()
        }
      })
    },
    /**
		 * To reset the search.
		 * @function
		 * @returns {undefined}
		 */
    resetSearch () {
      this.clearError('searchError')
      this.searchTerm = ''
    },
    /**
		 * To update the currently active pagination page.
		 * @function
		 * @param {integer} val - An integer representing the page number that we are updating to.
		 * @returns {undefined}
		 */
    changePage (val) {
      if (parseInt(this.currentPage) !== parseInt(val)) {
        this.currentPage = val
        window.scrollTo(0, 0)
      }
    },
    /**
		 * To get a list of all terms.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getTerms () {
      this.clearError('listErrorMessage')
      this.loadingTerms = true
      this.allTerms = []
      var _this = this
      return TermsFunctions.listTerms()
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            _this.loadingTerms = false
            _this.allTerms = response.payload
          } else {
            _this.loadingTerms = false
          }
        })
        .catch(reason => {
          _this.loadingTerms = false
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch the list of terms',
            errorName: 'listErrorMessage',
            vue: _this
          })
        })
    },
    /**
		 * To show the modal to edit an term details.
		 * @function
		 * @param {object} term - The selected term.
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
    editTerm (term, event) {
      event.stopPropagation()
      this.termToEdit = { ...term }
      this.showEditModal = true
    },
    /**
		 * To check if the term data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    validateEditedTermData () {
      var _this = this
      return new Promise(function (resolve, reject) {
        if (!_this.termToEdit.term.length) {
          reject('Term cannot be blank')
        }
        resolve('Hurray')
      })
    },
    /**
		 * To update a term.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    updateTerm () {
      var _this = this
      _this.clearError('editErrorMessage')
      let payload = { ...this.termToEdit }

      return _this
        .validateEditedTermData()
        .then(response => {
          _this.updating = true
          TermsFunctions.updateTerm(payload)
            .then(response => {
              if (response.code === 200 && response.status === 'ok') {
                _this.getTerms()
                _this.closeEditModal()
                _this.showEditSuccess(response.payload)
                _this.resetEdit()
              } else {
                _this.editErrorMessage = response.message
                _this.$scrollTo(_this.$refs.editErrorMessage, 1000, {
                  offset: -50
                })
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'We could not update the term',
                errorName: 'editErrorMessage',
                vue: _this,
                containerRef: 'editModal'
              })
            })
            .finally(() => {
              _this.updating = false
            })
        })
        .catch(reason => {
          _this.editErrorMessage = reason
          _this.$scrollTo(_this.$refs.editErrorMessage, 1000, {
            container: _this.$refs.editModal.$el
          })
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
      let text = 'The Term has been saved'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The Term has been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      })
    },
    /**
		 * To close the modal for editing a promotion.
		 * @function
		 * @returns {undefined}
		 */
    closeEditModal () {
      this.clearError('editErrorMessage')
      this.showEditModal = false
    },
    /**
		 * To reset the edit form
		 * @function
		 * @returns {undefined}
		 */
    resetEdit () {
      this.termToEdit = {
        term: ''
      }
    },
    /**
		 * To display the modal for deleting an term.
		 * @function
		 * @param {object} term - The selected term
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
    confirmDelete (term, event) {
      event.stopPropagation()
      this.termToDelete = { ...term }
      this.showDeleteModal = true
    },
    /**
		 * To close the modal for deleting a promotion and remove that promotion from DOM.
		 * @function
		 * @returns {undefined}
		 */
    deleteTerm () {
      this.deleting = true
      var _this = this
      return TermsFunctions.deleteTerm(_this.termToDelete)
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            _this.getTerms()
            _this.closeDeleteModal()
            _this.showDeleteSuccess(response.payload)
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: `We could not delete ${this.termToDelete.term}`,
            errorName: 'deleteErrorMessage',
            vue: _this,
            containerRef: 'deleteModal'
          })
        })
        .finally(() => {
          _this.deleting = false
        })
    },
    /**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    showDeleteSuccess (payload = {}) {
      let title = 'Success'
      let text = 'The Term has been deleted'
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
    },
    /**
		 * To close the delete modal.
		 * @function
		 * @returns {undefined}
		 */
    closeDeleteModal () {
      this.clearError('deleteErrorMessage')
      this.showDeleteModal = false
    }
  }
}
</script>

<style scoped>
.mt-element-list .list-news.ext-1.mt-list-container ul > .mt-list-item:hover {
  background-color: white;
}
.three-vertical-actions {
  min-height: 124px;
}
</style>
