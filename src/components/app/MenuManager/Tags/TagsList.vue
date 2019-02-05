<template>
  <modal
    ref="modal"
    :show="showTagsModal"
    :width="900"
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
        Select a Tag
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
        class="table-scrollable table-fixed-height"
        style="float: left; width: 50%;"
      >
        <table class="table">
          <thead>
            <tr>
              <th>
                <div class="md-checkbox has-success">
                  <input
                    id="select_all_contains"
                    v-model="allContainsTagsSelected"
                    type="checkbox"
                    class="md-check"
                  >
                  <label for="select_all_contains">
                    <span class="inc" />
                    <span class="check" />
                    <span class="box" />
                  </label>
                </div>
              </th>
              <th> Image </th>
              <th> Name </th>
              <th> Type </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="tag in containTags"
              :key="tag.id"
            >
              <td>
                <div class="md-checkbox has-success">
                  <input
                    :id="'tag_checkbox_' + tag.id"
                    v-model="tag.selected"
                    type="checkbox"
                    class="md-check"
                  >
                  <label :for="'tag_checkbox_' + tag.id">
                    <span class="inc" />
                    <span class="check" />
                    <span class="box" />
                  </label>
                </div>
              </td>
              <td>
                <img
                  :src="tag.image_url"
                  width="30"
                  height="30"
                >
              </td>
              <td> {{ tag.name }} </td>
              <td> {{ tag.type }} </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        class="table-scrollable table-fixed-height"
        style="float: left; width: 50%;"
      >
        <table class="table">
          <thead>
            <tr>
              <th>
                <div class="md-checkbox has-success">
                  <input
                    id="select_all_may_contain"
                    v-model="allMayContainTagsSelected"
                    type="checkbox"
                    class="md-check"
                  >
                  <label for="select_all_may_contain">
                    <span class="inc" />
                    <span class="check" />
                    <span class="box" />
                  </label>
                </div>
              </th>
              <th> Image </th>
              <th> Name </th>
              <th> Type </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="tag in mayContainTags"
              :key="tag.id"
            >
              <td>
                <div class="md-checkbox has-success">
                  <input
                    :id="'tag_checkbox_' + tag.id"
                    v-model="tag.selected"
                    type="checkbox"
                    class="md-check"
                  >
                  <label :for="'tag_checkbox_' + tag.id">
                    <span class="inc" />
                    <span class="check" />
                    <span class="box" />
                  </label>
                </div>
              </td>
              <td>
                <img
                  :src="tag.image_url"
                  width="30"
                  height="30"
                >
              </td>
              <td> {{ tag.name }} </td>
              <td> {{ tag.type }} </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style="clear: both;" />
    </div>
    <div
      slot="modal-footer"
      class="modal-footer"
    >
      <button
        type="button"
        class="btn btn-primary"
        :disabled="applying"
        @click="applyTagsToItem()"
      >
        Apply Tags
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
import TagsFunctions from '../../../../controllers/Tags'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
  components: {
    Modal
  },
  props: {
    appliedTags: {
      type: Array,
      default: []
    },
    selectedItemId: {
      type: Number,
      default: 0
    },
    itemType: {
      type: String,
      default: 'menu-item'
    }
  },
  data () {
    return {
      showTagsModal: false,
      applying: false,
      errorMessage: '',
      containTags: [],
      mayContainTags: [],
      allSelected: false
    }
  },
  computed: {
    allContainsTagsSelected: {
      set: function (selected) {
        this.containTags.forEach(tag => {
          tag.selected = selected
        })
      },
      get () {
        return this.containTags.length > 0 && !this.containTags.some(tag => !tag.selected)
      }
    },
    allMayContainTagsSelected: {
      set: function (selected) {
        this.mayContainTags.forEach(tag => {
          tag.selected = selected
        })
      },
      get () {
        return this.mayContainTags.length > 0 && !this.mayContainTags.some(tag => !tag.selected)
      }
    }
  },
  created () {
    this.getTags()
  },
  mounted () {
    this.showTagsModal = true
  },
  methods: {
    /**
		 * To clear the current error.
		 * @function
		 * @returns {undefined}
		 */
    clearError () {
      this.errorMessage = ''
    },
    /**
		 * To get a list of modifier categories for a store.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getTags () {
      var tagsListVue = this
      tagsListVue.containTags = []
      tagsListVue.mayContainTags = []
      TagsFunctions.getTags(
        tagsListVue.$root.appId,
        tagsListVue.$root.appSecret
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            const appliedTagIds = tagsListVue.appliedTags.map(tag => tag.id)
            tagsListVue.containTags = response.payload
              .filter(tag => tag.type === 'contains')
              .map(tag => {
                return {
                  ...tag,
                  selected: appliedTagIds.includes(tag.id)
                }
              })
            tagsListVue.mayContainTags = response.payload
              .filter(tag => tag.type === 'may_contain')
              .map(tag => {
                return {
                  ...tag,
                  selected: appliedTagIds.includes(tag.id)
                }
              })
          } else {
            tagsListVue.errorMessage = response.payload
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch tags',
            errorName: 'errorMessage',
            vue: tagsListVue,
            containerRef: 'modal'
          })
        })
    },
    /**
		 * To apply some of the existing modifiers to an item.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    applyTagsToItem () {
      this.applying = true
      var tagsListVue = this
      var tagsToBeApplied = []
      for (let k = 0; k < tagsListVue.containTags.length; k++) {
        if (tagsListVue.containTags[k].selected) {
          tagsToBeApplied.push(tagsListVue.containTags[k])
        }
      }
      for (let k = 0; k < tagsListVue.mayContainTags.length; k++) {
        if (tagsListVue.mayContainTags[k].selected) {
          tagsToBeApplied.push(tagsListVue.mayContainTags[k])
        }
      }
      if (tagsListVue.itemType === 'menu-item') {
        TagsFunctions.applyTagsToItem(
          tagsListVue.selectedItemId,
          tagsToBeApplied,
          tagsListVue.$root.appId,
          tagsListVue.$root.appSecret,
          tagsListVue.$root.userToken
        )
          .then(response => {
            if (response.code === 200 && response.status === 'ok') {
              tagsListVue.showUpdateSuccess(response.payload)
              tagsListVue.closeModal()
            }
          })
          .catch(reason => {
            ajaxErrorHandler({
              reason,
              errorText: 'We could not apply the tags',
              errorName: 'errorMessage',
              vue: tagsListVue,
              containerRef: 'modal'
            })
          })
          .finally(() => {
            tagsListVue.applying = false
          })
      } else if (tagsListVue.itemType === 'modifier-item') {
        TagsFunctions.applyTagsToModifierItem(
          tagsListVue.selectedItemId,
          tagsToBeApplied,
          tagsListVue.$root.appId,
          tagsListVue.$root.appSecret,
          tagsListVue.$root.userToken
        )
          .then(response => {
            if (response.code === 200 && response.status === 'ok') {
              tagsListVue.showUpdateSuccess(response.payload)
              tagsListVue.closeModal()
            }
          })
          .catch(reason => {
            ajaxErrorHandler({
              reason,
              errorText: 'We could not apply the tags',
              errorName: 'errorMessage',
              vue: tagsListVue,
              containerRef: 'modal'
            })
          })
          .finally(() => {
            tagsListVue.applying = false
          })
      }
    },
    /**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    showUpdateSuccess (payload = {}) {
      let title = 'Success'
      let text = 'The Tags have been saved'
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
		 * To just close the modal when the user clicks on the 'x' to close the modal.
		 * @function
		 * @returns {undefined}
		 */
    closeModal () {
      this.$emit('deactivateTagsListModal', this.selectedItemId)
    }
  }
}
</script>
