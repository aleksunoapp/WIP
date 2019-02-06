<template>
  <div>
    <div class="page-bar">
      <breadcrumb :crumbs="breadcrumbArray" />
    </div>
    <!-- END PAGE BAR -->
    <!-- BEGIN PAGE TITLE-->
    <h1 class="page-title">
      Tags
    </h1>
    <!-- END PAGE TITLE-->
    <div class="note note-info">
      <p>Create and manage menu tags.</p>
    </div>
    <!-- BEGIN CREATE NEW -->
    <div
      v-if="$root.permissions['menu_manager tags create']"
      class="portlet box blue-hoki"
    >
      <div
        class="portlet-title bg-blue-chambray"
        @click="toggleCreateTagPanel()"
      >
        <div class="custom tools">
          <a :class="{'expand': !createTagCollapse, 'collapse': createTagCollapse}" />
        </div>
        <div class="caption">
          &emsp;Create A New Tag
        </div>
      </div>
      <div
        class="portlet-body"
        :class="{'display-hide': createTagCollapse}"
      >
        <form
          role="form"
          @submit.prevent="createTag()"
        >
          <div class="form-body row">
            <div class="col-md-12">
              <div
                v-show="errorMessage"
                ref="errorMessage"
                class="alert alert-danger"
              >
                <button
                  class="close"
                  @click.prevent="clearError('errorMessage')"
                />
                <span>{{ errorMessage }}</span>
              </div>
            </div>
            <div :class="{'col-md-2' : !imageMode.newMenu, 'col-md-12' : imageMode.newMenu}">
              <resource-picker
                :image-button="true"
                :image-url="newTag.image_url"
                class="margin-top-15"
                @open="toggleImageMode('newMenu', true)"
                @close="toggleImageMode('newMenu', false)"
                @selected="updateImage"
              />
            </div>
            <div
              v-show="!imageMode.newMenu"
              class="col-md-5"
            >
              <el-dropdown
                trigger="click"
                size="small"
                :show-timeout="50"
                :hide-timeout="50"
                class="margin-bottom-20"
                @command="updateNewTagType"
              >
                <el-button size="small">
                  {{ tagTypeLabel }}
                  <i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="contains">
                    contains
                  </el-dropdown-item>
                  <el-dropdown-item command="may_contain">
                    may contain
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <div class="form-group form-md-line-input form-md-floating-label margin-top-10">
                <input
                  id="form_control_1"
                  v-model="newTag.name"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newTag.name.length}"
                >
                <label for="form_control_1">
                  Tag Name
                </label>
              </div>
            </div>
          </div>
          <div
            v-show="!imageMode.newMenu"
            class="form-actions right margin-top-20"
          >
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
    <!-- END CREATE NEW -->
    <loading-screen
      :show="displayTagsData"
      :color="'#2C3E50'"
      :display="'inline'"
    />
    <div
      v-if="!displayTagsData"
      class="portlet light portlet-fit bordered margin-top-20"
    >
      <div class="portlet-title bg-blue-chambray">
        <div class="menu-image-main">
          <img src="../../../../public/client_logo.png">
        </div>
        <div class="caption">
          <span class="caption-subject font-default bold uppercase">
            Tags
          </span>
          <div class="caption-desc font-grey-cascade">
            Tags represent dietary restrictions.
          </div>
        </div>
      </div>
      <div class="portlet-body">
        <div class="row">
          <div class="col-md-12">
            <div
              v-show="listErrorMessage"
              ref="listErrorMessage"
              class="alert alert-danger"
            >
              <button
                class="close"
                @click="clearError('listErrorMessage')"
              />
              <span>{{ listErrorMessage }}</span>
            </div>
          </div>
        </div>
        <div
          v-if="tags.length"
          class="mt-element-list margin-top-15"
        >
          <div class="mt-list-container list-news ext-1 no-border">
            <ul>
              <li
                v-for="tag in tags"
                :id="'tag-' + tag.id"
                :key="tag.id"
                class="mt-list-item actions-at-left margin-top-15"
              >
                <div class="list-item-actions">
                  <el-tooltip
                    v-if="$root.permissions['menu_manager tags update']"
                    content="Edit"
                    effect="light"
                    placement="right"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="editTag(tag)"
                    >
                      <i class="fa fa-lg fa-pencil" />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    v-if="$root.permissions['menu_manager tags read'] && !$root.permissions['menu_manager tags update']"
                    content="View"
                    effect="light"
                    placement="right"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click="editTag(tag)"
                    >
                      <i class="fa fa-lg fa-eye" />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    v-if="can('menu_manager tags add items by sku')"
                    content="Apply to Menu Items"
                    effect="light"
                    placement="right"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click.stop="openApplyTagToMenuItemsModal(tag)"
                    >
                      <dish-icon />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    v-if="can('menu_manager tags add modifier items by sku')"
                    content="Apply to Modifier Items"
                    effect="light"
                    placement="right"
                  >
                    <a
                      class="btn btn-circle btn-icon-only btn-default"
                      @click.stop="openApplyTagToModifierItemsModal(tag)"
                    >
                      <extras-and-sides-icon />
                    </a>
                  </el-tooltip>
                </div>
                <div class="list-thumb">
                  <a v-if="tag.image_url.length">
                    <img
                      alt=""
                      :src="tag.image_url"
                    >
                  </a>
                  <a v-else>
                    <img src="../../../assets/img/app/login/bg1.jpg">
                  </a>
                </div>
                <div class="list-datetime bold uppercase font-red">
                  <span>{{ tag.name }}</span>
                </div>
                <div class="list-item-content height-mod">
                  <strong>Type:</strong>
                  <span>{{ readableTagType(tag.type) }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div
          v-else
          class="margin-top-20"
        >
          <no-results
            :show="!tags.length"
            :type="'tags'"
          />
        </div>
      </div>
    </div>
    <edit-tag
      v-if="displayEditTagModal"
      @updateTag="updateTag"
      @closeEditTagModal="closeEditTagModal"
    />
    <apply-tag-to-menu-items
      v-if="showApplyTagToMenuItemsModal"
      :tag="selectedTag"
      @close="closeApplyTagToMenuItemsModal()"
    />
    <apply-tag-to-modifier-items
      v-if="showApplyTagToModifierItemsModal"
      :tag="selectedTag"
      @close="closeApplyTagToModifierItemsModal()"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '../../modules/Breadcrumb'
import NoResults from '../../modules/NoResults'
import ApplyTagToMenuItems from '@/components/app/MenuManager/Tags/ApplyTagToMenuItems'
import ApplyTagToModifierItems from '@/components/app/MenuManager/Tags/ApplyTagToModifierItems'
import LoadingScreen from '../../modules/LoadingScreen'
import TagsFunctions from '../../../controllers/Tags'
import EditTag from './Tags/EditTag'
import ResourcePicker from '../../modules/ResourcePicker'
import ajaxErrorHandler from '@/controllers/ErrorController'
import DishIcon from '@/assets/icons/dish.svg'
import ExtrasAndSidesIcon from '@/assets/icons/extras-and-sides.svg'

export default {
  components: {
    ApplyTagToMenuItems,
    ApplyTagToModifierItems,
    Breadcrumb,
    LoadingScreen,
    EditTag,
    NoResults,
    ResourcePicker,
    DishIcon,
    ExtrasAndSidesIcon
  },
  data () {
    return {
      breadcrumbArray: [
        { name: 'Menu Manager', link: false },
        { name: 'Tags', link: false }
      ],
      displayTagsData: false,
      listErrorMessage: '',
      displayEditTagModal: false,
      tags: [],
      createTagCollapse: true,
      errorMessage: '',
      newTag: {
        name: '',
        type: '',
        image_url: '',
        user_id: this.$root.createdBy
      },
      showApplyTagToMenuItemsModal: false,
      showApplyTagToModifierItemsModal: false,
      selectedTag: {},
      headerText: '',
      imageMode: {
        newMenu: false
      }
    }
  },
  computed: {
    ...mapGetters(['can']),
    tagTypeLabel () {
      if (!this.newTag.type) {
        return 'Select Tag type'
      } else if (this.newTag.type === 'contains') {
        return 'contains'
      } else if (this.newTag.type === 'may_contain') {
        return 'may contain'
      }
    }
  },
  mounted () {
    // get the list of available tags
    this.getTags()
  },
  methods: {
    /**
     * To provide a formatted version of the tag type.
     * @function
     * @param {string} type - The tag type to format.
     * @returns {string} The formatted string
     */
    readableTagType (type) {
      if (type === 'contains') {
        return 'contains'
      } else if (type === 'may_contain') {
        return 'may contain'
      }
    },
    /**
     * To toggle between the open and closed state of the resource picker
     * @function
     * @param {string} object - The name of the object the image is for
     * @param {object} value - The open / closed value of the picker
     * @returns {undefined}
     */
    toggleImageMode (object, value) {
      this.imageMode[object] = value
    },
    /**
     * To update the type property of newTag.
     * @function
     * @param {object} value - The new value to assign.
     * @returns {undefined}
     */
    updateNewTagType (value) {
      this.newTag.type = value
    },
    /**
     * To display the modal to apply a tag to menu items.
     * @function
     * @param {object} tag - The selected tag.
     * @returns {undefined}
     */
    openApplyTagToMenuItemsModal (tag) {
      this.selectedTag = tag
      this.showApplyTagToMenuItemsModal = true
    },
    /**
     * To display the modal to apply a tag to menu items.
     * @function
     * @returns {undefined}
     */
    closeApplyTagToMenuItemsModal () {
      this.showApplyTagToMenuItemsModal = false
      this.selectedTag = {}
    },
    /**
     * To display the modal to apply a tag to modifier items.
     * @function
     * @param {object} tag - The selected tag.
     * @returns {undefined}
     */
    openApplyTagToModifierItemsModal (tag) {
      this.selectedTag = tag
      this.showApplyTagToModifierItemsModal = true
    },
    /**
     * To close the modal to apply a tag to modifier items.
     * @function
     * @returns {undefined}
     */
    closeApplyTagToModifierItemsModal () {
      this.showApplyTagToModifierItemsModal = false
      this.selectedTag = {}
    },
    /**
     * To get the list of available tags.
     * @function
     * @returns {object} - A promise that will either return an error message or perform an action.
     */
    getTags () {
      this.displayTagsData = true
      var tagsVue = this
      tagsVue.tags = []
      TagsFunctions.getTags(tagsVue.$root.appId, tagsVue.$root.appSecret)
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            tagsVue.displayTagsData = false
            tagsVue.tags = response.payload
          } else {
            tagsVue.displayTagsData = false
          }
        })
        .catch(reason => {
          tagsVue.displayTagsData = false
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch tags',
            errorName: 'listErrorMessage',
            vue: tagsVue
          })
        })
    },
    /**
     * To clear the new menu form.
     * @function
     * @returns {undefined}
     */
    clearNewTag () {
      this.newTag = {
        name: '',
        type: '',
        image_url: '',
        user_id: this.$root.createdBy
      }
    },
    /**
     * To check if the tag data is valid before submitting to the backend.
     * @function
     * @returns {object} A promise that will validate the input form
     */
    validateTagData () {
      var createTagVue = this
      return new Promise(function (resolve, reject) {
        if (!createTagVue.newTag.name.length) {
          reject('Tag name cannot be blank')
        } else if (!createTagVue.newTag.type.length) {
          reject('Tag type cannot be blank')
        } else if (!createTagVue.newTag.image_url.length) {
          reject('Tag image URL cannot be blank')
        }
        resolve('Hurray')
      })
    },
    /**
     * To create a new tag.
     * @function
     * @returns {object} - A promise that will either return an error message or perform an action.
     */
    createTag () {
      var createTagVue = this
      createTagVue.clearError('errorMessage')

      return createTagVue
        .validateTagData()
        .then(response => {
          TagsFunctions.createTag(
            createTagVue.newTag,
            createTagVue.$root.appId,
            createTagVue.$root.appSecret,
            createTagVue.$root.userToken
          )
            .then(response => {
              if (response.code === 200 && response.status === 'ok') {
                createTagVue.newTag.id = response.payload.new_tag_id
                createTagVue.addTag(createTagVue.newTag)
                createTagVue.showAlert(response.payload)
                createTagVue.clearNewTag()
              } else {
                createTagVue.errorMessage = response.message
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'We could not add the tag',
                errorName: 'errorMessage',
                vue: createTagVue
              })
            })
        })
        .catch(reason => {
          // If validation fails then display the error message
          createTagVue.errorMessage = reason
          window.scrollTo(0, 0)
          throw reason
        })
    },
    /**
     * To close the modal to create tags and add the newly created tag to the list.
     * @function
     * @param {object} val - The tag object to be added to the list.
     * @returns {object} - A promise that will either return an error message or perform an action.
     */
    addTag (val) {
      this.tags.push(val)
    },
    /**
     * To notify user of the outcome of the call
     * @function
     * @param {object} payload - The payload object from the server response
     * @returns {undefined}
     */
    showAlert (payload = {}) {
      let title = 'Success'
      let text = 'The Tag has been created'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The Tag has been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      })
    },
    /**
     * To show the modal to edit tag details.
     * @function
     * @param {object} tag - The tag selected object.
     * @returns {undefined}
     */
    editTag (tag) {
      this.displayEditTagModal = true
      this.$router.push('/app/menu_manager/tags/edit_tag/' + tag.id)
    },
    /**
     * To close the modal to edit tag details and update the selected tag on the tags list.
     * @function
     * @param {object} val - The tag object to be updated on the list.
     * @returns {undefined}
     */
    updateTag (val) {
      this.displayEditTagModal = false
      this.getTags()
    },
    /**
     * To close the modal to edit tag details.
     * @function
     * @returns {undefined}
     */
    closeEditTagModal () {
      this.displayEditTagModal = false
      this.$router.push('/app/menu_manager/tags')
    },
    /**
     * To clear the current error.
     * @function
     * @param {string} name - Name of the variable to clear
     * @returns {undefined}
     */
    clearError (name) {
      this[name] = ''
    },
    /**
     * To set the image to be same as the one emitted by the gallery modal.
     * @function
     * @param {object} val - The emitted image object.
     * @returns {undefined}
     */
    updateImage (val) {
      this.showGalleryModal = false
      this.newTag.image_url = val.image_url
    },
    /**
     * To toggle the create tag panel, initially set to closed
     * @function
     * @returns {undefined}
     */
    toggleCreateTagPanel () {
      this.createTagCollapse = !this.createTagCollapse
    }
  }
}
</script>
<style scoped>
.mt-element-list .list-news.ext-1.mt-list-container ul > .mt-list-item:hover,
.mt-element-list .list-news.ext-2.mt-list-container ul > .mt-list-item:hover {
  background-color: #fff;
}
</style>
