<template>
  <modal
    :show="displayModal"
    effect="fade"
    @closeOnEscape="closeModal"
  >
    <!-- HEADER START -->
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
        <i
          v-show="mode !== 'list'"
          class="fa fa-chevron-left clickable pull-left back-button"
          @click="listMode()"
        />
        <span v-show="mode === 'list'">
          Images for {{ item.name }}
        </span>
        <span v-show="mode === 'create'">
          Add Image
        </span>
        <span v-show="mode === 'preview'">
          Preview
        </span>
        <span v-show="mode === 'edit'">
          Edit Image
        </span>
        <span v-show="mode === 'delete'">
          Delete Image
        </span>
      </h4>
    </div>
    <!-- HEADER END -->

    <div
      slot="modal-body"
      class="modal-body relative-block"
    >
      <loading-screen
        :show="loadingImages"
        :color="'#2C3E50'"
        :display="'inline'"
      />
      <div class="row">
        <div
          v-show="errorMessage.length"
          ref="errorMessage"
          class="col-md-12"
        >
          <div class="alert alert-danger">
            <button
              class="close"
              @click="clearError('errorMessage')"
            />
            <span>{{ errorMessage }}</span>
          </div>
        </div>
        <div
          v-if="!loadingImages"
          class="col-md-12"
        >
          <!-- LIST START -->
          <div v-if="mode === 'list'">
            <div
              v-for="image in images"
              :id="'image-' + image.id"
              :key="image.id"
              class="col-md-4 margin-bottom-15"
            >
              <div class="tile image">
                <div class="tile-body custom-tile-body">
                  <img
                    class="custom-tile-body-img clickable"
                    :src="image.url"
                    @click="previewMode(image)"
                  >
                </div>
                <div class="actions-under-image">
                  <div
                    class="padding-x-5"
                    @click="flipDefault(image)"
                  >
                    <el-tooltip
                      :content="defaultButtonText(image.default)"
                      effect="light"
                      popper-class="tooltip-in-modal"
                    >
                      <a class="btn btn-circle btn-icon-only btn-edit">
                        <i
                          v-show="image.default === 0"
                          class="fa fa-lg fa-check black-text"
                        />
                        <i
                          v-show="image.default === 1"
                          class="fa fa-lg fa-times black-text"
                        />
                      </a>
                    </el-tooltip>
                  </div>
                  <div class="padding-x-5">
                    <el-tooltip
                      content="Edit"
                      effect="light"
                      popper-class="tooltip-in-modal"
                    >
                      <a
                        class="btn btn-circle btn-icon-only btn-edit"
                        @click="editMode(image)"
                      >
                        <i class="fa fa-lg fa-pencil black-text" />
                      </a>
                    </el-tooltip>
                  </div>
                  <div class="padding-x-5">
                    <el-tooltip
                      content="Delete Image"
                      effect="light"
                      popper-class="tooltip-in-modal"
                    >
                      <a
                        class="btn btn-circle btn-icon-only btn-default"
                        @click="deleteMode(image)"
                      >
                        <i class="fa fa-lg fa-trash black-text" />
                      </a>
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="add-container">
                <el-tooltip
                  content="Add Image"
                  effect="light"
                  popper-class="tooltip-in-modal"
                >
                  <a
                    class="btn btn-circle btn-icon-only btn-edit"
                    @click="createMode()"
                  >
                    <i class="fa fa-lg fa-plus black-text" />
                  </a>
                </el-tooltip>
              </div>
            </div>
          </div>
          <!-- LIST END -->

          <!-- PREVIEW START -->
          <div
            v-if="mode === 'preview'"
            class="col-md-12"
          >
            <div class="preview-container">
              <img
                class="preview-image"
                :src="imageToPreview.url"
              >
            </div>
          </div>
          <!-- PREVIEW END -->

          <!-- CREATE START -->
          <div
            v-show="mode === 'create'"
            class="col-md-12"
          >
            <div class="col-md-6">
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_1"
                  ref="order"
                  v-model="imageToCreate.order"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': imageToCreate.order.length}"
                >
                <label for="form_control_1">
                  Order
                </label>
              </div>
            </div>
            <div class="col-md-6">
              <div class="row">
                <label>Default</label><br>
                <el-switch
                  v-model="imageToCreate.default"
                  active-color="#0c6"
                  inactive-color="#ff4949"
                  :active-value="1"
                  :inactive-value="0"
                  active-text="Yes"
                  inactive-text="No"
                />
              </div>
              <div class="row margin-top-10">
                <label>Update in all stores</label><br>
                <el-switch
                  v-model="imageToCreate.update_all_locations"
                  active-color="#0c6"
                  inactive-color="#ff4949"
                  :active-value="1"
                  :inactive-value="0"
                  active-text="Yes"
                  inactive-text="No"
                />
              </div>
            </div>
            <resource-picker
              :no-button="true"
              :show-done-button="false"
              :image-button="false"
              :select-only="true"
              @selected="updateImageToCreate"
            />
          </div>
          <!-- CREATE END -->

          <!-- EDIT START -->
          <div
            v-if="mode === 'edit'"
            class="col-md-12"
          >
            <div class="col-md-6">
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_1"
                  ref="order"
                  v-model="imageToEdit.order"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': imageToEdit.order.length}"
                >
                <label for="form_control_1">
                  Order
                </label>
              </div>
            </div>
            <div class="col-md-6">
              <div class="row">
                <label>Default</label><br>
                <el-switch
                  v-model="imageToEdit.default"
                  active-color="#0c6"
                  inactive-color="#ff4949"
                  :active-value="1"
                  :inactive-value="0"
                  active-text="Yes"
                  inactive-text="No"
                />
              </div>
              <div class="row margin-top-10">
                <label>Update in all stores</label><br>
                <el-switch
                  v-model="imageToEdit.update_all_locations"
                  active-color="#0c6"
                  inactive-color="#ff4949"
                  :active-value="1"
                  :inactive-value="0"
                  active-text="Yes"
                  inactive-text="No"
                />
              </div>
            </div>
            <resource-picker
              :no-button="true"
              :show-done-button="false"
              :image-button="false"
              :select-only="true"
              @selected="updateImageToEdit"
            />
          </div>
          <!-- EDIT END -->

          <!-- DELETE START -->
          <div
            v-if="mode === 'delete'"
            class="col-md-12"
          >
            <div class="col-md-12">
              <div class="delete-preview-container">
                <img
                  class="preview-image"
                  :src="imageToDelete.url"
                >
              </div>
              <p class="center margin-bottom-0">
                Are you sure you want to delete this image?
              </p>
            </div>
          </div>
          <!-- DELETE END -->
        </div>
      </div>
    </div>
    <div
      v-show="mode !== 'create' && mode !== 'edit'"
      slot="modal-footer"
      class="modal-footer clear"
    >
      <div class="row">
        <div class="col-md-12">
          <button
            v-show="mode === 'list'"
            type="button"
            class="btn"
            @click="closeModal()"
          >
            Close
          </button>
          <button
            v-show="mode === 'delete'"
            type="button"
            class="btn blue"
            :disabled="deleting"
            @click="deleteImage()"
          >
            Delete
            <i
              v-show="deleting"
              class="fa fa-spinner fa-pulse fa-fw"
            />
          </button>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import $ from 'jquery'
import Modal from '../../../modules/Modal'
import LoadingScreen from '../../../modules/LoadingScreen'
import ItemsFunctions from '../../../../controllers/Items'
import ResourcePicker from '../../../modules/ResourcePicker'
import ajaxErrorHandler from '../../../../controllers/ErrorController'

export default {
  components: {
    Modal,
    LoadingScreen,
    ResourcePicker
  },
  props: {
    item: {
      type: Object,
      default: () => ({
        name: ''
      }),
      required: true
    }
  },
  data () {
    return {
      displayModal: false,
      mode: 'list',
      loadingImages: false,
      errorMessage: '',
      images: [],
      imageToPreview: {
        id: null
      },
      imageToCreate: {
        url: '',
        order: '',
        type: 'image',
        default: 0,
        update_all_locations: 0
      },
      imageToEdit: {},
      deleting: false,
      imageToDelete: {}
    }
  },
  mounted () {
    this.getItemImages()
    this.displayModal = true
  },
  methods: {
    /**
		 * To get images for the selected item.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getItemImages () {
      this.loadingImages = true
      var itemsVue = this
      itemsVue.images = []
      return ItemsFunctions.getItemImages(
        itemsVue.$root.appId,
        itemsVue.$root.appSecret,
        itemsVue.$root.userToken,
        itemsVue.item.id
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            itemsVue.images = response.payload.item_images
            itemsVue.loadingImages = false
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: `We could not fetch images for ${itemsVue.item.name}`,
            errorName: 'errorMessage',
            vue: itemsVue
          })
        })
    },
    /**
		 * To determine the tooltip text
		 * @function
		 * @param {integer} isDefault - The default status of the image
		 * @returns {string} - The tooltip text
		 */
    defaultButtonText (isDefault) {
      return isDefault ? 'Remove Default' : 'Make Default'
    },
    /**
		 * To clear the error
		 * @param {string} errorName - The error to clear
		 * @function
		 * @returns {undefined}
		 */
    clearError (errorName) {
      this[errorName] = ''
    },
    /**
		 * To set the active image.
		 * @function
		 * @param {object} image - The selected image.
		 * @returns {undefined}
		 */
    previewMode (image) {
      this.clearError('errorMessage')
      this.imageToPreview = image
      this.mode = 'preview'
    },
    /**
		 * To open the create interface
		 * @function
		 * @returns {undefined}
		 */
    createMode () {
      this.clearError('errorMessage')
      this.mode = 'create'
      this.$nextTick(function () {
        this.$refs.order.focus()
      })
    },
    /**
		 * To replace the url with the selected url
		 * @function
		 * @param {object} image - The image to edit
		 * @returns {undefined}
		 */
    updateImageToCreate (image) {
      this.imageToCreate.url = image.image_url
      this.createImage()
    },
    /**
		 * To validate new image data before submitting
		 * @function
		 * @returns {undefined}
		 */
    validateImageToCreate () {
      var imagesVue = this
      return new Promise(function (resolve, reject) {
        if (!$.isNumeric(imagesVue.imageToCreate.order)) {
          reject('Order must be a number')
        } else if (!imagesVue.imageToCreate.url.length) {
          reject('Select an image')
        }
        resolve('Hurray')
      })
    },
    /**
		 * To add an image to an item
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    createImage () {
      const imagesVue = this
      this.clearError('errorMessage')
      return imagesVue
        .validateImageToCreate()
        .then(response => {
          return ItemsFunctions.createItemImage(
            imagesVue.$root.appId,
            imagesVue.$root.appSecret,
            imagesVue.$root.userToken,
            imagesVue.item.id,
            imagesVue.imageToCreate
          )
            .then(response => {
              if (response.code === 200 && response.status === 'ok') {
                imagesVue.images = response.payload.item_images
                imagesVue.mode = 'list'
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: `We could not set the image as default`,
                errorName: 'errorMessage',
                vue: imagesVue
              })
            })
        })
        .catch(reason => {
          imagesVue.errorMessage = reason
          imagesVue.$scrollTo(imagesVue.$refs.errorMessage, 1000, {
            offset: -50
          })
        })
    },
    /**
		 * To reset the create form
		 * @function
		 * @returns {undefined}
		 */
    clearCreateForm () {
      this.imageToCreate = {
        url: '',
        order: '',
        type: 'image',
        default: 0,
        update_all_locations: 0
      }
    },
    /**
		 * To open the main list interface
		 * @function
		 * @param {object} image - The image to edit
		 * @returns {undefined}
		 */
    listMode () {
      this.clearError('errorMessage')
      if (this.mode === 'create') {
        this.clearCreateForm()
      } else if (this.mode === 'edit') {
        this.clearEditForm()
      }
      this.mode = 'list'
    },
    /**
		 * To set an image as the default image
		 * @function
		 * @param {object} image - The image to make default
		 * @returns {undefined}
		 */
    flipDefault (image) {
      this.imageToEdit = {
        ...image,
        default: Number(image.default) === 1 ? 0 : 1
      }
      this.editImage()
    },
    /**
		 * To open the image edit interface
		 * @function
		 * @param {object} image - The image to edit
		 * @returns {undefined}
		 */
    editMode (image) {
      this.clearError('errorMessage')
      this.imageToEdit = {
        ...image,
        order: String(image.order)
      }
      this.mode = 'edit'
    },
    /**
		 * To replace the url with the selected url
		 * @function
		 * @param {object} image - The image to edit
		 * @returns {undefined}
		 */
    updateImageToEdit (image) {
      this.imageToEdit.url = image.image_url
      this.editImage()
    },
    /**
		 * To validate new image data before submitting
		 * @function
		 * @returns {undefined}
		 */
    validateImageToEdit () {
      var imagesVue = this
      return new Promise(function (resolve, reject) {
        if (!$.isNumeric(imagesVue.imageToEdit.order)) {
          reject('Order must be a number')
        } else if (!imagesVue.imageToEdit.url.length) {
          reject('Select an image')
        }
        resolve('Hurray')
      })
    },
    /**
		 * To update image data in the backend
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    editImage () {
      var imagesVue = this
      this.clearError('errorMessage')
      return imagesVue
        .validateImageToEdit()
        .then(response => {
          return ItemsFunctions.updateItemImage(
            imagesVue.$root.appId,
            imagesVue.$root.appSecret,
            imagesVue.$root.userToken,
            imagesVue.item.id,
            imagesVue.imageToEdit
          )
            .then(response => {
              if (response.code === 200 && response.status === 'ok') {
                imagesVue.images = response.payload.item_images
                imagesVue.mode = 'list'
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: `We could not update the image`,
                errorName: 'errorMessage',
                vue: imagesVue
              })
            })
        })
        .catch(reason => {
          imagesVue.errorMessage = reason
          imagesVue.$scrollTo(imagesVue.$refs.errorMessage, 1000, {
            offset: -50
          })
        })
    },
    /**
		 * To reset the edit form
		 * @function
		 * @returns {undefined}
		 */
    clearEditForm () {
      this.imageToEdit = {}
    },
    /**
		 * To open the delete interface
		 * @function
		 * @param {object} image - The image to delete
		 * @returns {undefined}
		 */
    deleteMode (image) {
      this.clearError('errorMessage')
      this.imageToDelete = image
      this.mode = 'delete'
    },
    /**
		 * To delete the image
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    deleteImage () {
      this.deleting = true
      var imagesVue = this

      return ItemsFunctions.deleteItemImage(
        imagesVue.$root.appId,
        imagesVue.$root.appSecret,
        imagesVue.$root.userToken,
        imagesVue.item.id,
        imagesVue.imageToDelete.id
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            imagesVue.images = imagesVue.images.filter(image => {
              return image.id !== imagesVue.imageToDelete.id
            })
            imagesVue.mode = 'list'
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: `We could not delete the image`,
            errorName: 'errorMessage',
            vue: imagesVue
          })
        })
        .finally(() => {
          imagesVue.deleting = false
        })
    },
    /**
		 * To close the images modal.
		 * @function
		 * @returns {undefined}
		 */
    closeModal () {
      this.$emit('closeImagesModal')
    }
  }
}
</script>

<style>
.tooltip-in-modal {
  z-index: 11000 !important;
}
</style>

<style scoped>
.actions-under-image {
  width: 100%;
  padding: 5px 0 0 0;
  display: flex;
  justify-content: center;
}
.custom-tile-body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}
.custom-tile-body-img {
  width: auto !important;
  height: auto !important;
  min-width: auto !important;
  min-height: auto !important;
  max-width: 100% !important;
  max-height: 100% !important;
  margin-right: 0 !important;
}
.preview-container {
  height: 100%;
  width: 100%;
  max-height: ;
  display: flex;
  justify-content: center;
  align-items: center;
}
.preview-image {
  max-width: 100%;
  max-height: 100%;
}
.add-container {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.delete-preview-container {
  height: 100px;
  width: 100%;
  max-height: ;
  display: flex;
  justify-content: center;
  align-items: center;
}
.black-text {
  color: #333;
}
.margin-bottom-0 {
  margin-bottom: 0;
}
.padding-x-5 {
  padding: 0 3px 0 3px;
}
</style>
