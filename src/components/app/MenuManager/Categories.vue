<template>
  <div>
    <!-- BEGIN PAGE BAR -->
    <div class="page-bar">
      <breadcrumb :crumbs="breadcrumbArray" />
    </div>
    <!-- END PAGE BAR -->
    <!-- BEGIN PAGE TITLE-->
    <h1 class="page-title">
      Categories
    </h1>
    <!-- END PAGE TITLE-->
    <div class="note note-info">
      <p>View categories for menu '{{ menuDetails.name }}'.</p>
    </div>
    <!-- BEGIN CREATE NEW MENU-->
    <div
      v-if="$root.permissions['menu_manager menus categories create']"
      class="portlet box blue-hoki"
    >
      <div
        class="portlet-title bg-blue-chambray"
        @click="toggleCreateCategoryPanel()"
      >
        <div class="custom tools">
          <a :class="{'expand': !createCategoryCollapse, 'collapse': createCategoryCollapse}" />
        </div>
        <div class="caption">
          &emsp;Create A New Category
        </div>
      </div>
      <div
        class="portlet-body"
        :class="{'display-hide': createCategoryCollapse}"
      >
        <form
          role="form"
          @submit.prevent="addNewMenuCategory()"
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
                  @click.prevent="clearError()"
                />
                <span>{{ errorMessage }}</span>
              </div>
            </div>
            <div :class="{'col-md-2' : !imageMode.newMenu, 'col-md-12' : imageMode.newMenu}">
              <resource-picker
                :image-button="true"
                :image-url="newCategory.image_url"
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
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_2"
                  v-model="newCategory.name"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newCategory.name.length}"
                >
                <label for="form_control_2">
                  Category Name
                </label>
              </div>
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_3"
                  v-model="newCategory.desc"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newCategory.desc.length}"
                >
                <label for="form_control_3">
                  Category Description
                </label>
              </div>
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_4"
                  v-model="newCategory.sku"
                  type="text"
                  class="form-control input-sm"
                  :class="{'edited': newCategory.sku.length}"
                >
                <label for="form_control_4">
                  Category SKU
                </label>
              </div>
            </div>
            <div
              v-show="!imageMode.newMenu"
              class="col-md-5"
            >
              <div class="form-group form-md-line-input form-md-floating-label">
                <input
                  id="form_control_5"
                  v-model="newCategory.order"
                  type="number"
                  class="form-control input-sm"
                  :class="{'edited': newCategory.order}"
                >
                <label for="form_control_5">
                  Category Order
                </label>
              </div>
              <div class="form-group form-md-line-input form-md-floating-label">
                <label>Category Status:</label><br>
                <el-switch
                  v-model="newCategory.status"
                  active-color="#0c6"
                  inactive-color="#ff4949"
                  :active-value="1"
                  :inactive-value="0"
                  active-text="Active"
                  inactive-text="Sold Out"
                />
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
              :disabled="creating"
            >
              Create
              <i
                v-show="creating"
                class="fa fa-spinner fa-pulse fa-fw"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- END CREATE NEW MENU-->
    <loading-screen
      :show="displayCategoryData"
      :color="'#2C3E50'"
      :display="'inline'"
    />
    <div v-if="$root.activeLocation && $root.activeLocation.id && !displayCategoryData">
      <div
        id="categories-container"
        class="portlet light portlet-fit bordered margin-top-20"
      >
        <div class="portlet-title bg-blue-chambray">
          <div class="menu-image">
            <img :src="menuDetails.image_url">
          </div>
          <div class="caption">
            <span class="caption-subject font-default bold uppercase">
              {{ menuDetails.name }}
            </span>
            <div class="caption-desc font-grey-cascade">
              {{ menuDetails.desc }}
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
            v-if="menuCategories.length"
            class="mt-element-list margin-top-15"
          >
            <div class="mt-list-container list-news ext-1 no-border">
              <ul
                v-for="category in menuCategories"
                :key="category.id"
              >
                <li
                  :id="'category-' + category.id"
                  class="mt-list-item margin-top-15 clickable"
                  @click="determineNextAction(category)"
                >
                  <div class="margin-bottom-15 actions-on-top">
                    <el-tooltip
                      v-if="$root.permissions['menu_manager menus categories update']"
                      content="Edit"
                      effect="light"
                      placement="top"
                    >
                      <a
                        class="btn btn-circle btn-icon-only btn-default"
                        @click="editCategory(category, $event)"
                      >
                        <i class="fa fa-lg fa-pencil" />
                      </a>
                    </el-tooltip>
                    <el-tooltip
                      v-if="$root.permissions['menu_manager menus categories read'] && !$root.permissions['menu_manager menus categories update']"
                      content="View"
                      effect="light"
                      placement="top"
                    >
                      <a
                        class="btn btn-circle btn-icon-only btn-default"
                        @click="editCategory(category, $event)"
                      >
                        <i class="fa fa-lg fa-eye" />
                      </a>
                    </el-tooltip>
                    <el-tooltip
                      v-if="
                        $root.permissions['menu_manager menus categories hours create'] ||
                          $root.permissions['menu_manager menus categories hours read'] ||
                          $root.permissions['menu_manager menus categories hours update']
                      "
                      content="Category Hours"
                      effect="light"
                      placement="top"
                    >
                      <a
                        class="btn btn-circle btn-icon-only btn-default"
                        @click="showHoursModal(category, $event)"
                      >
                        <i class="fa fa-lg fa-clock-o" />
                      </a>
                    </el-tooltip>
                    <el-tooltip
                      v-if="$root.permissions['menu_manager menus categories subcategories create']"
                      content="Add subcategory"
                      effect="light"
                      placement="top"
                    >
                      <a
                        class="btn btn-circle btn-icon-only btn-default"
                        @click="displayAddSubCategoryModal(category, $event)"
                      >
                        <i class="fa fa-lg fa-plus" />
                      </a>
                    </el-tooltip>
                    <el-tooltip
                      v-if="$root.permissions['menu_manager menus categories delete']"
                      content="Delete"
                      effect="light"
                      placement="top"
                    >
                      <a
                        class="btn btn-circle btn-icon-only btn-default"
                        @click="deleteCategory(category, $event)"
                      >
                        <i class="fa fa-lg fa-trash" />
                      </a>
                    </el-tooltip>
                  </div>
                  <div class="list-icon-container">
                    <i
                      :id="'icon-' + category.id"
                      class="fa fa-angle-right"
                    />
                  </div>
                  <div class="list-thumb">
                    <a v-if="category.image_url.length">
                      <img
                        alt=""
                        :src="category.image_url"
                      >
                    </a>
                    <a v-else>
                      <img src="../../../assets/img/app/image-placeholder.png">
                    </a>
                  </div>
                  <div class="list-datetime bold uppercase font-red">
                    <span>{{ category.name }}</span>
                  </div>
                  <div class="list-item-content height-mod">
                    <div class="col-md-4">
                      <strong>Status:</strong>
                      <span v-if="category.status == 1">
                        Available
                      </span>
                      <span v-if="category.status == 0">
                        Sold Out
                      </span>
                    </div>
                    <div class="col-md-4">
                      <strong>SKU:</strong>
                      <span>{{ category.sku }}</span>
                    </div>
                    <div class="col-md-12">
                      <strong>Description:</strong>
                      <span>{{ category.desc }}</span>
                    </div>
                  </div>
                </li>
                <li
                  v-if="category.subcategories && category.subcategories.length"
                  :id="'category-details-' + category.id"
                  class="mt-list-item collapsed"
                >
                  <h4>Sub Categories</h4>
                  <ul>
                    <li
                      v-for="subcategory in category.subcategories"
                      :id="'subcategory-' + subcategory.id"
                      :key="subcategory.id"
                      class="mt-list-item actions-at-left margin-top-15 white clickable sub-mt-list-item"
                      @click="viewCategoryItems(subcategory)"
                    >
                      <div class="list-item-actions">
                        <el-tooltip
                          v-if="$root.permissions['menu_manager menus categories subcategories update']"
                          content="Edit"
                          effect="light"
                          placement="right"
                        >
                          <a
                            class="btn btn-circle btn-icon-only btn-default"
                            @click="editSubCategory(subcategory, $event)"
                          >
                            <i class="fa fa-lg fa-pencil" />
                          </a>
                        </el-tooltip>
                        <el-tooltip
                          v-if="$root.permissions['menu_manager menus categories subcategories read'] && !$root.permissions['menu_manager menus categories subcategories update']"
                          content="View"
                          effect="light"
                          placement="right"
                        >
                          <a
                            class="btn btn-circle btn-icon-only btn-default"
                            @click="editSubCategory(subcategory, $event)"
                          >
                            <i class="fa fa-lg fa-eye" />
                          </a>
                        </el-tooltip>
                        <el-tooltip
                          v-if="$root.permissions['menu_manager menus categories subcategories delete']"
                          content="Delete"
                          effect="light"
                          placement="right"
                        >
                          <a
                            class="btn btn-circle btn-icon-only btn-default"
                            @click="deleteSubCategory(subcategory, $event)"
                          >
                            <i class="fa fa-lg fa-trash" />
                          </a>
                        </el-tooltip>
                      </div>
                      <div class="list-icon-container">
                        <i class="fa fa-angle-right" />
                      </div>
                      <div class="list-thumb">
                        <a v-if="subcategory.image_url.length">
                          <img
                            alt=""
                            :src="subcategory.image_url"
                          >
                        </a>
                        <a v-else>
                          <img src="../../../assets/img/app/image-placeholder.png">
                        </a>
                      </div>
                      <div class="list-datetime bold uppercase font-red">
                        <span>{{ subcategory.name }}</span>
                      </div>
                      <div class="list-item-content height-mod">
                        <div class="col-md-4">
                          <strong>Status:</strong>
                          <span v-if="subcategory.status == 1">
                            Available
                          </span>
                          <span v-if="subcategory.status == 0">
                            Sold Out
                          </span>
                        </div>
                        <div class="col-md-4">
                          <strong>SKU:</strong>
                          <span>{{ subcategory.sku }}</span>
                        </div>
                        <div class="col-md-12">
                          <strong>Description:</strong>
                          <span>{{ subcategory.desc }}</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          <div
            v-else
            class="margin-top-20"
          >
            <no-results
              :show="!menuCategories.length"
              :type="'categories'"
              :custom="true"
              :text="customText"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-if="!displayCategoryData">
      <no-results
        :show="!$root.activeLocation || !$root.activeLocation.id"
        :type="'categories'"
      />
    </div>

    <edit-category
      v-if="editCategoryModalActive"
      @updateCategory="updateCategory"
      @deactivateEditCategoryModal="closeEditCategoryModal"
    />

    <add-sub-category
      v-if="addSubCategoryModalActive"
      :parent-category-id="selectedCategoryId"
      @addSubCategory="addSubCategory"
      @deactivateAddSubCategoryModal="closeAddSubCategoryModal"
    />

    <edit-sub-category
      v-if="editSubCategoryModalActive"
      @updateSubCategory="updateSubCategory"
      @deactivateEditSubCategoryModal="closeEditSubCategoryModal"
    />

    <delete-category
      v-if="deleteCategoryModalActive"
      :passed-category-id="passedCategoryId"
      @closeDeleteCategoryModal="closeDeleteCategoryModal"
      @deleteCategoryAndCloseModal="deleteCategoryAndCloseModal"
    />

    <delete-sub-category
      v-if="deleteSubCategoryModalActive"
      :passed-sub-category-id="passedSubCategoryId"
      @closeDeleteSubCategoryModal="closeDeleteSubCategoryModal"
      @deleteSubCategoryAndCloseModal="deleteSubCategoryAndCloseModal"
    />

    <category-hours
      v-if="hoursModalActive"
      :category="categoryToAssignHoursTo"
      @closeHoursModal="closeHoursModal"
    />
  </div>
</template>

<script>
import $ from 'jquery'
import Breadcrumb from '../../modules/Breadcrumb'
import NoResults from '../../modules/NoResults'
import Modal from '../../modules/Modal'
import LoadingScreen from '../../modules/LoadingScreen'
import CategoriesFunctions from '../../../controllers/Categories'
import MenusFunctions from '../../../controllers/Menus'
import EditCategory from './Categories/EditCategory'
import CategoryHours from './Categories/CategoryHours'
import DeleteCategory from './Categories/DeleteCategory'
import AddSubCategory from './SubCategories/AddSubCategory'
import EditSubCategory from './SubCategories/EditSubCategory'
import DeleteSubCategory from './SubCategories/DeleteSubCategory'
import ResourcePicker from '../../modules/ResourcePicker'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
  components: {
    Breadcrumb,
    Modal,
    LoadingScreen,
    EditCategory,
    DeleteCategory,
    AddSubCategory,
    EditSubCategory,
    DeleteSubCategory,
    NoResults,
    ResourcePicker,
    CategoryHours
  },
  data () {
    return {
      breadcrumbArray: [
        { name: 'Menu Manager', link: false },
        { name: 'Menus', link: '/app/menu_manager/menus' },
        { name: 'Categories', link: false }
      ],
      editCategoryModalActive: false,
      displayCategoryData: false,
      addSubCategoryModalActive: false,
      editSubCategoryModalActive: false,
      deleteCategoryModalActive: false,
      deleteSubCategoryModalActive: false,
      menuDetails: {},
      listErrorMessage: '',
      menuCategories: [],
      errorMessage: '',
      selectedCategoryId: 0,
      customText:
				'There are no categories in this menu. Click on the button above to add one.',
      createCategoryCollapse: true,
      creating: false,
      newCategory: {
        menu_id: this.$route.params.menu_id,
        name: '',
        desc: '',
        sku: '',
        image_url: '',
        user_id: this.$root.createdBy,
        status: 1,
        order: null,
        parent_category: 0
      },
      hoursModalActive: false,
      categoryToAssignHoursTo: {},
      imageMode: {
        newMenu: false
      }
    }
  },
  watch: {
    '$root.activeLocation' () {
      this.$router.push({ name: 'Menus' })
    }
  },
  mounted () {
    if (
      this.$root.activeLocation &&
			this.$root.activeLocation.id &&
			this.$route.params.menu_id
    ) {
      this.getMenuDetails()
      this.getMenuCategories()
    }
  },
  methods: {
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
		 * To set the image to be same as the one emitted by the gallery modal.
		 * @function
		 * @param {object} val - The emitted image object.
		 * @returns {undefined}
		 */
    updateImage (val) {
      this.newCategory.image_url = val.image_url
    },
    /**
		 * To display the modal for category hours.
		 * @function
		 * @param {object} category - The selected category
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
    showHoursModal (category, event) {
      event.stopPropagation()
      this.categoryToAssignHoursTo = category
      this.hoursModalActive = true
    },
    /**
		 * To close the modal for category hours.
		 * @function
		 * @returns {undefined}
		 */
    closeHoursModal () {
      this.hoursModalActive = false
    },
    /**
		 * To toggle the create category panel, initially set to opened
		 * @function
		 * @returns {undefined}
		 */
    toggleCreateCategoryPanel () {
      this.createCategoryCollapse = !this.createCategoryCollapse
    },
    /**
		 * To check if the category data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    validateCategoryData () {
      var addCategoryVue = this
      return new Promise(function (resolve, reject) {
        if (!addCategoryVue.newCategory.name.length) {
          reject('Category name cannot be blank')
        } else if (!addCategoryVue.newCategory.desc.length) {
          reject('Category description cannot be blank')
        } else if (!addCategoryVue.newCategory.sku.length) {
          reject('Category SKU cannot be blank')
        } else if (!addCategoryVue.newCategory.image_url.length) {
          reject('Category image URL cannot be blank')
        } else if (!$.isNumeric(addCategoryVue.newCategory.status)) {
          reject('Category status cannot be blank')
        } else if (!$.isNumeric(addCategoryVue.newCategory.order)) {
          reject('Category order should be a number')
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
		 * To add the new category to the menu and close the modal and redirect to the menus page.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    addNewMenuCategory () {
      var addCategoryVue = this
      addCategoryVue.clearError()

      return addCategoryVue
        .validateCategoryData()
        .then(response => {
          addCategoryVue.creating = true
          CategoriesFunctions.addNewMenuCategory(
            addCategoryVue.newCategory,
            addCategoryVue.$root.appId,
            addCategoryVue.$root.appSecret,
            addCategoryVue.$root.userToken
          )
            .then(response => {
              if (response.code === 200 && response.status === 'ok') {
                addCategoryVue.newCategory.id = response.payload.new_category_id
                if (response.payload && response.payload.pending_approval !== true) {
                  addCategoryVue.addCategory(addCategoryVue.newCategory)
                }
                addCategoryVue.showAlert(response.payload)
                addCategoryVue.clearNewCategory()
              } else {
                addCategoryVue.errorMessage = response.message
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'We could not create the menu',
                errorName: 'errorMessage',
                vue: addCategoryVue
              })
            })
            .finally(() => {
              addCategoryVue.creating = false
            })
        })
        .catch(reason => {
          // If validation fails then display the error message
          addCategoryVue.errorMessage = reason
          window.scrollTo(0, 0)
          throw reason
        })
    },
    /**
		 * To get the deatils of the menu to show the categories for.
		 * @function
		 * @returns {undefined}
		 */
    getMenuDetails () {
      var categoriesVue = this
      MenusFunctions.getMenuDetails(
        categoriesVue.$route.params.menu_id,
        categoriesVue.$root.appId,
        categoriesVue.$root.appSecret
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            categoriesVue.menuDetails = response.payload
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch menu info',
            errorName: 'listErrorMessage',
            vue: categoriesVue
          })
        })
    },
    /**
		 * To get a list of categories for the current menu.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getMenuCategories () {
      this.displayCategoryData = true
      var categoriesVue = this
      categoriesVue.menuCategories = []
      return CategoriesFunctions.getMenuCategories(
        categoriesVue.$route.params.menu_id,
        categoriesVue.$root.appId,
        categoriesVue.$root.appSecret,
        categoriesVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            categoriesVue.displayCategoryData = false
            categoriesVue.menuCategories = response.payload
          } else {
            categoriesVue.displayCategoryData = false
          }
        })
        .catch(reason => {
          categoriesVue.displayCategoryData = false
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch categories',
            errorName: 'listErrorMessage',
            vue: categoriesVue
          })
        })
    },
    /**
		 * To route to the items page.
		 * @function
		 * @param {object} category - The selected category
		 * @returns {undefined}
		 */
    viewCategoryItems (category) {
      this.$router.push('/app/menu_manager/items/' + category.id)
    },
    /**
		 * To display the modal to edit a category.
		 * @function
		 * @param {object} category - The selected category
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
    editCategory (category, event) {
      event.stopPropagation()
      this.editCategoryModalActive = true
      this.$router.push(
        '/app/menu_manager/categories/' +
					this.$route.params.menu_id +
					'/edit_category/' +
					category.id
      )
    },
    /**
		 * To display the modal to delete a category.
		 * @function
		 * @param {object} category - The selected category
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
    deleteCategory (category, event) {
      event.stopPropagation()
      this.deleteCategoryModalActive = true
      this.passedCategoryId = category.id
    },
    /**
		 * To display the modal to edit a sub category.
		 * @function
		 * @param {object} subCategory - The selected sub category
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
    editSubCategory (subCategory, event) {
      event.stopPropagation()
      this.editSubCategoryModalActive = true
      this.$router.push(
        '/app/menu_manager/categories/' +
					this.$route.params.menu_id +
					'/edit_sub_category/' +
					subCategory.id
      )
    },
    /**
		 * To display the modal to delete a sub-category.
		 * @function
		 * @param {object} subCategory - The selected sub-category
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
    deleteSubCategory (subCategory, event) {
      event.stopPropagation()
      this.deleteSubCategoryModalActive = true
      this.passedCategoryId = subCategory.parent_category
      this.passedSubCategoryId = subCategory.id
    },
    /**
		 * To display the modal to add a new category.
		 * @function
		 * @param {object} category - The selected category
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
    displayAddSubCategoryModal (category, event) {
      event.stopPropagation()
      this.selectedCategoryId = category.id
      this.addSubCategoryModalActive = true
      this.$router.push(
        '/app/menu_manager/categories/' +
					this.$route.params.menu_id +
					'/add_sub_category'
      )
    },
    /**
		 * To clear the new category form.
		 * @function
		 * @returns {undefined}
		 */
    clearNewCategory () {
      this.newCategory = {
        menu_id: this.$route.params.menu_id,
        name: '',
        desc: '',
        sku: '',
        image_url: '',
        user_id: this.$root.createdBy,
        status: 1,
        order: null,
        parent_category: 0
      }
    },
    /**
		 * To add the category emitted by the child to the categories list.
		 * @function
		 * @param {object} val - The new category
		 * @returns {undefined}
		 */
    addCategory (val) {
      if (parseInt(val.order) > 0) {
        var done = false
        for (var i = 0; i < this.menuCategories.length; i++) {
          if (parseInt(this.menuCategories[i].order) < parseInt(val.order)) {
            this.menuCategories.splice(i, 0, val)
            done = true
            break
          }
        }
        if (!done) {
          this.menuCategories.push(val)
        }
      } else {
        this.menuCategories.push(val)
      }
    },
    /**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    showAlert (payload = {}) {
      let title = 'Success'
      let text = 'The Category has been created'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The Category has been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      })
    },
    /**
		 * To add the sub category emitted by the child to the sub categories list.
		 * @function
		 * @param {object} val - The new sub category
		 * @returns {undefined}
		 */
    addSubCategory (val) {
      this.addSubCategoryModalActive = false
      this.getMenuCategories()
    },
    /**
		 * To update the category emitted by the child and highlist it on the categories list.
		 * @function
		 * @param {object} val - The updated category
		 * @returns {undefined}
		 */
    updateCategory (val) {
      this.editCategoryModalActive = false
      this.getMenuCategories()
    },
    /**
		 * To update the sub category emitted by the child and highlist it on the categories list.
		 * @function
		 * @param {object} val - The updated sub category
		 * @returns {undefined}
		 */
    updateSubCategory (val) {
      this.editSubCategoryModalActive = false
      this.getMenuCategories()
    },
    /**
		 * To close the modal to edit a category.
		 * @function
		 * @returns {undefined}
		 */
    closeEditCategoryModal () {
      this.editCategoryModalActive = false
    },
    /**
		 * To close the modal to delete a category.
		 * @function
		 * @returns {undefined}
		 */
    closeDeleteCategoryModal () {
      this.deleteCategoryModalActive = false
    },
    /**
		 * To close the modal to delete a category.
		 * @function
		 * @returns {undefined}
		 */
    deleteCategoryAndCloseModal () {
      this.getMenuCategories()
      this.deleteCategoryModalActive = false
    },
    /**
		 * To close the modal to edit a sub category.
		 * @function
		 * @returns {undefined}
		 */
    closeEditSubCategoryModal () {
      this.editSubCategoryModalActive = false
    },
    /**
		 * To close the modal to delete a sub-category.
		 * @function
		 * @returns {undefined}
		 */
    closeDeleteSubCategoryModal () {
      this.deleteSubCategoryModalActive = false
    },
    /**
		 * To close the modal to delete a sub-category.
		 * @function
		 * @returns {undefined}
		 */
    deleteSubCategoryAndCloseModal () {
      this.deleteSubCategoryModalActive = false
      this.getMenuCategories()
    },
    /**
		 * To close the modal to add a sub category.
		 * @function
		 * @returns {undefined}
		 */
    closeAddSubCategoryModal () {
      this.addSubCategoryModalActive = false
    },
    /**
		 * To determine if the dropdown or the items page should be displayed based on whether the category has subcategories or not.
		 * @function
		 * @param {object} category - The selected category
		 * @returns {undefined}
		 */
    determineNextAction (category) {
      if (category.subcategories && category.subcategories.length) {
        if ($('#category-details-' + category.id).hasClass('collapsed')) {
          $('#category-details-' + category.id).removeClass('collapsed')
          $('#category-details-' + category.id).addClass('expanded')

          // change the icon
          $('#icon-' + category.id).removeClass('fa-angle-right')
          $('#icon-' + category.id).addClass('fa-angle-down')
        } else if ($('#category-details-' + category.id).hasClass('expanded')) {
          $('#category-details-' + category.id).removeClass('expanded')
          $('#category-details-' + category.id).addClass('collapsed')

          // change the icon
          $('#icon-' + category.id).removeClass('fa-angle-down')
          $('#icon-' + category.id).addClass('fa-angle-right')
        }
      } else if (!category.subcategories || !category.subcategories.length) {
        this.viewCategoryItems(category)
      }
    }
  }
}
</script>
<style scoped>
.mt-element-list
  .list-news.ext-1.mt-list-container
  ul
  > .sub-mt-list-item:hover {
  background-color: #fff;
}
.actions-on-top {
  margin-top: -5px;
}
</style>
