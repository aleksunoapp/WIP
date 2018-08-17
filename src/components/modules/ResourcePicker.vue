<template>
	<div class="resource-picker">
		<img v-show="imageButton && !showResourceModal" @click.stop.prevent="openResourceModal()" :src="placeholderUrl" alt="A greyed out outline of a mountain and the sun">
		<button v-show="!showResourceModal && !noButton" class="btn blue btn-outline" @click.stop.prevent="openResourceModal()">{{ buttonText }}</button>
		<section v-show="showResourceModal">
			<div class="col-sm-4 margin-top-10">
				<div class="jstree-default">
					<ul class="jstree-container-ul jstree-children">
						<li class="jstree-node jstree-last" :class="{'jstree-open': folders.expanded, 'jstree-closed': !folders.expanded}">
							<i class="jstree-icon jstree-ocl" @click="expandNode(folders)"></i>
							<a class="jstree-anchor" @click="activePageUpdate(1, folders, true)" :class="{'jstree-clicked': folders.id === activeFolder.id}">
								{{ activeLocationId ? activeLocationName : activeBusinessName }} Resources
							</a>
							<ul class="jstree-children" v-if="folders.expanded">
								<li 
									v-if="!selectOnly && $root.permissions['gallery create']"
									class="jstree-node jstree-leaf" 
									:class="{'jstree-last': !folders.children || !folders.children.length}">
									<i class="jstree-icon jstree-ocl"></i>
									<a 
										class="jstree-anchor" 
										@click="createFolder(folders)"
									>
										<button class="btn blue btn-xs btn-outline">Create Folder</button>
									</a>
								</li>
								<template v-for="(folder, index) in folders.children">
									<resource-folder 
										:folder="folder" 
										:activeFolder="activeFolder.id" 
										:last="index === folders.children.length - 1" 
										@expandNode="expandNode" 
										@createFolder="createFolder" 
										@manageFolder="manageFolder" 
										@getResources="activePageUpdate" 
										:selectOnly="selectOnly"
										:key="index"
									>
									</resource-folder>
								</template>
							</ul>
						</li>
					</ul>
				</div>
			</div>
			<div class="col-sm-8  margin-top-10">
				<div v-if="!activeFolder.id && !allFoldersView" class="center margin-top-20">Select a folder to view resources.</div>
				<div v-if="activeFolder.id || allFoldersView">
					<loading-screen :show="loadingResourceData || isSaving" :color="'#3598dc'" :display="'inline'"></loading-screen>
					<div class="relative cbp cbp-caption-active cbp-caption-overlayBottomReveal cbp-ready">
						<div class="cbp-wrapper-outer">
							<div class="cbp-wrapper">
								<div v-show="!loadingResourceData && !isSaving">
									<div>
										<dropdown>
											<button slot="button" type="button" class="btn btn-sm btn-outline dropdown-toggle btn-default" data-toggle="dropdown">
												<span v-if="sortBy.field"><b>{{ sortOptions[sortBy.field] }} <i class="fa fa-sort-alpha-asc" v-if="sortBy.order === 'asc'"></i><i class="fa fa-sort-alpha-desc" v-if="sortBy.order === 'desc'"></i></b></span>
												<i class="fa fa-angle-down"></i>
											</button>
											<ul slot="dropdown-menu" class="dropdown-menu">
												<li class="rounded-button-group-block">
													<div class="btn-group" data-toggle="buttons">
														<label class="btn blue btn-outline" for="sort_asc" :class="{'active': sortBy.order === 'asc'}">
															<input type="radio" class="toggle" id="sort_asc" value="asc" v-model="sortBy.order">
															<i class="fa fa-sort-alpha-asc"></i>
														</label>
														<label class="btn blue btn-outline" for="sort_desc" :class="{'active': sortBy.order === 'desc'}">
															<input type="radio" class="toggle" id="sort_desc" value="desc" v-model="sortBy.order">
															<i class="fa fa-sort-alpha-desc"></i>
														</label>
													</div>
												</li>
												<li :class="{'active': sortBy.field === 'name'}">
													<a @click="setSortField('name')">Name</a>
												</li>
												<li :class="{'active': sortBy.field === 'size'}">
													<a @click="setSortField('size')">Size</a>
												</li>
												<li :class="{'active': sortBy.field === 'created_at'}">
													<a @click="setSortField('created_at')">Date Added</a>
												</li>
											</ul>
										</dropdown>
										<button type="button" class="btn btn-sm btn-outline btn-default" @click="toggleFilterPanel()">
											<i v-if="filterCollapse" class="fa fa-filter" aria-hidden="true"></i>
											<i v-else class="fa fa-times-circle" aria-hidden="true"></i>
										</button>
										<div class="portlet-body" :class="{'display-hide': filterCollapse}">
											<form role="form" @submit.prevent="advancedResourceSearch()">
												<div class="alert alert-danger" v-if="searchError.length">
													<button class="close" data-close="alert" @click="clearSearchError()"></button>
													<span>{{ searchError }}</span>
												</div>
												<div class="filter-tags margin-top-10" v-if="tags.length">
													<label>Resource Tags <small>(Toggle the tags you want to filter by.)</small></label>
													<div>
														<template v-for="(tag, index) in tags">
															<button
																type="button"
																class="btn btn-default btn-xs"
																:class="{'blue': tag.active}"
																@click="toggleTag(tag)"
																:key="index"
															>
																	{{ tag.name }}
															</button>
														</template>
													</div>
												</div>
												<div class="filter-tags margin-top-10">
													<template v-for="(type, index) in fileTypes">
														<button type="button" :key="index" class="btn btn-default btn-xs" :class="{'blue': type.active}" @click="toggleFileType(type)"><i :class="type.icon"></i> {{ type.name }}</button>
													</template>
												</div>
												<div class="form-group form-md-line-input form-md-floating-label margin-top-10">
													<input type="text" class="form-control input-sm" id="search_options_search" :class="{'edited': advancedSearch.search.length}" v-model="advancedSearch.search">
													<label for="search_options_search">Search</label>
												</div>
												<div class="md-radio-inline">
													<div class="md-radio" v-for="option in advancedSearch.searchOptions" :key="option.id">
														<input type="radio" :id="`advanced_search_radio_${option.value}`" :name="`advanced_search_radio_${option.value}`" class="md-radiobtn" v-model="advancedSearch.range" :value="option.value">
														<label :for="`advanced_search_radio_${option.value}`">
															<span></span>
															<span class="check"></span>
															<span class="box"></span>
															{{ option.name }}
														</label>
													</div>
												</div>
												<div class="form-actions right">
													<button type="button" class="btn btn-default" @click="resetResourceSearch()"> Reset Search </button>
													<button type="submit" class="btn blue"><i class="fa fa-search"></i> Search </button>
												</div>
											</form>
										</div>
									</div>
									<page-results class="margin-top-10 margin-bottom-10" :totalResults="totalResults" :activePage="activePage" @pageResults="updatePerPage"></page-results>
									<div class="cbp-no-files text-center margin-top-20" v-if="!currentResources.length">There are currently no resources in this folder.</div>
									<template v-for="resource in currentResources">
										<div class="col-xs-6 margin-bottom-10" :ref="resource.id" :key="resource.id">
											<div @click="setResource(resource)" @dblclick="selectAndComplete(resource)" class="resource-wrapper clickable" :class="{'selected': selectedResource.id === resource.id}">
												<img class="resource-image" :src="resource.url">
											</div>
										</div>
									</template>
									<div v-if="currentResources.length">
										<pagination :passedPage="activePage" :numPages="numPages" @activePageChange="activePageUpdate"></pagination>
									</div>
									<file-upload 
										v-show="!allFoldersView && $root.permissions['gallery create']" 
										:folderId="activeFolder.id" 
										@savingUpdate="checkSaving" 
										@uploadSuccess="imageUploaded()">
									</file-upload>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-sm-12 margin-top-10">
				<button 
					v-if="showDoneButton"
					type="button" 
					class="btn btn-default pull-right" 
					@click="closeResourceModal()"
				>
					Done
				</button>
				<button
					v-show="selectedResource.id"
					type="button" 
					class="btn btn-primary pull-right margin-right-10" 
					@click="resourceSelectionComplete()" 
				>
					Select
				</button>
			</div>
		</section>
	</div>
</template>
<script>
import Dropdown from './Dropdown'
import LoadingScreen from './LoadingScreen'
import Modal from './Modal'
import PageResults from './PageResults'
import Pagination from './Pagination'
import ResourceFolder from './ResourceFolder'
import FileUpload from './FileUpload'
import Resources from '../../controllers/Resources'
import '../../assets/css/jstree/style.min.css'
import ImagePlaceholder from '@/assets/img/app/image-placeholder.png'

/**
 * Resource Modal module is a modal for selecting resources for general use.
 * @class ResourceModal
 * @extends Resources
 * @since 0.0.9
 */

export default {
	name: 'resource-picker',
	props: {
		buttonText: {
			type: String,
			default: 'Select Resource'
		},
		noButton: {
			type: Boolean,
			default: () => true
		},
		imageUrl: {
			type: String,
			default: ImagePlaceholder
		},
		imageButton: {
			type: Boolean,
			default: () => false
		},
		showDoneButton: {
			type: Boolean,
			default: true
		},
		selectOnly: {
			type: Boolean,
			default: true
		}
	},
	data () {
		return {
			showResourceModal: false,
			filterCollapse: true,
			folders: {},
			activeFolder: {},
			currentResources: [],
			numPages: 0,
			totalResults: 0,
			activePage: 1,
			recordsPerPage: 25,
			loadingResourceData: false,
			allFoldersView: false,
			advancedSearch: {
				search: '',
				range: 'this_folder',
				searchOptions: [
					{ name: 'All Folders', value: 'all_folders' },
					{ name: 'This Folder', value: 'this_folder' }
				]
			},
			sortBy: {
				field: 'name',
				order: 'asc'
			},
			sortOptions: {
				name: 'Name',
				size: 'Size',
				created_at: 'Date Added'
			},
			isSaving: false,
			searchError: '',
			tags: [],
			fileTypes: [
				{ name: 'image', icon: 'fa fa-file-image-o', active: false },
				{ name: 'video', icon: 'fa fa-file-video-o', active: false },
				{ name: 'documents', icon: 'fa fa-file-text-o', active: false },
				{ name: 'other', icon: 'fa fa-file-o', active: false }
			],
			selectedResource: {},
			activeBusinessId: global.resourcesBusinessId,
			activeBusinessName: null,
			activeLocationId: null,
			activeLocationName: null,
			errorMessage: ''
		}
	},
	computed: {
		placeholderUrl () {
			if (this.imageUrl) {
				return this.imageUrl
			} else {
				return ImagePlaceholder
			}
		}
	},
	mounted () {
		if (!this.imageButton && this.noButton) { this.openResourceModal() }
	},
	methods: {
		/**
		 * To initialize the edit folder process by redirecting to the edit folder route
		 * @function
		 * @param {object} folder - The parent folder where the user is creating a new folder
		 * @returns {undefined}
		 * @memberof Resources
		 * @version 0.0.9
		 */
		manageFolder (folder) {
			this.$router.push({path: `/app/gallery/edit_folder/${JSON.stringify(folder)}`})
		},
		/**
		 * To initialize the create folder process by redirecting to the create folder route
		 * @function
		 * @param {object} folder - The parent folder where the user is creating a new folder
		 * @returns {undefined}
		 * @memberof Resources
		 * @version 0.0.9
		 */
		createFolder (folder) {
			this.$router.push({path: `/app/gallery/create_folder/${folder.id}`})
		},
		/**
		 * To update the number of images shown on a page
		 * @function
		 * @param {integer} val - The number of items to display
		 * @returns {undefined}
		 * @memberof ResourceModal
		 * @version 0.0.9
		 */
		updatePerPage (val) {
			this.recordsPerPage = val
		},
		/**
		 * To open the resource modal and initialize content
		 * @function
		 * @returns {undefined}
		 * @memberof ResourceModal
		 * @version 0.0.9
		 */
		openResourceModal () {
			this.$emit('open')
			this.showResourceModal = true
			this.getFolders()
			this.getTags()
		},
		/**
		 * To close the resource modal
		 * @function
		 * @returns {undefined}
		 * @memberof ResourceModal
		 * @version 0.0.9
		 */
		closeResourceModal () {
			this.showResourceModal = false
			this.$emit('close')
		},
		/**
		 * To pull in folders under the selected parent id (or root)
		 * @function
		 * @param {integer} parentId - The id of the parent folder being pulled from.
		 * @param {object} folder - The parent folder.
		 * @returns {undefined}
		 * @memberof ResourceModal
		 * @version 0.0.9
		 */
		getFolders (parentId, folder) {
			let _this = this
			const businessId = this.activeBusinessId
			const locationId = this.activeLocationId
			const pageNumber = 1
			const recordsPerPage = this.recordsPerPage
			if (!parentId) {
				parentId = 0
			}

			return Resources.getFolders(
				businessId,
				locationId,
				parentId,
				pageNumber,
				recordsPerPage
			)
			.then(response => {
				if (parentId === 0) {
					_this.folders = Object.assign({}, _this.folders, response.payload.folders[0])
					_this.$set(_this.folders, 'expanded', false)
					_this.$set(_this.folders, 'children_fetched', false)
				} else {
					_this.$set(folder, 'children_fetched', true)
					_this.$set(folder, 'children', response.payload.folders)
				}
			})
			.catch(
				_this.$root.errorWrapper(e => {
					if (e.responseJSON) {
						switch (e.responseJSON.declaration) {
						case 'folder_not_found':
							_this.$set(folder, 'children_fetched', true)
							_this.$set(folder, 'children', [])
							break

						case 'business_not_found':
							break

						case 'invalid_page_number':
							break

						default:
							// No default
						}
					}
				})
			)
		},
		/**
		 * To expand or collapse the selected folder and to pull in all child folders.
		 * @function
		 * @param {object} folder - The folder being toggled.
		 * @returns {undefined}
		 * @memberof ResourceModal
		 * @version 0.0.9
		 */
		expandNode (folder) {
			if (folder.expanded) {
				this.$set(folder, 'expanded', false)
			} else {
				this.$set(folder, 'expanded', true)

				this.getFolders(folder.id, folder)
			}
		},
		/**
		 * To update the currently active pagination page.
		 * @function
		 * @param {integer} val - An integer representing the page number that we are updating to.
		 * @param {object} folder - If the user is also selecting a new folder then it will be passed here.
		 * @param {boolean} override - Whether or not to override the if condition.
		 * @returns {undefined}
		 * @memberof ResourceModal
		 * @version 0.0.9
		 */
		activePageUpdate (val, folder, override) {
			if (parseInt(this.activePage) !== parseInt(val)) {
				this.activePage = val
				if (folder) {
					this.getResources(folder, this.activePage)
				} else {
					this.getResources(this.activeFolder, this.activePage)
				}
			} else if (override) {
				if (folder) {
					this.getResources(folder, this.activePage)
				} else {
					this.getResources(this.activeFolder, this.activePage)
				}
			}
		},
		/**
		 * To format the search criteria for use in the api call
		 * @function
		 * @returns {object} - An object of the formated search data
		 * @memberof ResourceModal
		 * @version 0.0.9
		 */
		formatSearchCriteria () {
			let searchCriteria = {}

			if (this.advancedSearch.search.length > 2) {
				searchCriteria.search_query = this.advancedSearch.search
				searchCriteria.search_in = 'name'
			}

			if (this.tags.length) {
				searchCriteria.tags = []
				this.tags.forEach(tag => {
					if (tag.active) {
						searchCriteria.tags.push(tag.id)
					}
				})
			}

			return searchCriteria
		},
		/**
		 * To preload images to avoid delayed loading in the UI.
		 * @function
		 * @returns {object} A promise that will return either a success object or an error object.
		 * @memberof ResourceModal
		 * @version 0.0.9
		 */
		// preloadImages () {
		// 	let _this = this

		// 	return new Promise((resolve, reject) => {
		// 		if (!_this.currentResources.length) {
		// 			resolve()
		// 		}

		// 		_this.currentResources.forEach(resource => {
		// 		/* eslint-disable no-undef */
		// 			let img = new Image()
		// 			img.src = resource.url
		// 		})

		// 		resolve()
		// 	})
		// },
		/**
		 * To fetch the resources in the selected folder.
		 * @function
		 * @param {object} folder - The folder being fetched.
		 * @param {integer} pageNumber - The current page that we are retrieving results for.
		 * @returns {undefined}
		 * @memberof ResourceModal
		 * @version 0.0.9
		 */
		getResources (folder, pageNumber) {
			this.loadingResourceData = true
			this.currentResources = []

			let _this = this
			const businessId = this.activeBusinessId
			const locationId = this.activeLocationId
			const recordsPerPage = this.recordsPerPage
			const searchCriteria = this.formatSearchCriteria()
			const sortCriteria = {
				sort_by: this.sortBy.field,
				sort_order: this.sortBy.order
			}

			if (!pageNumber) {
				pageNumber = this.activePage
			}

			let folderId = folder.id
			if (this.advancedSearch.range === 'all_folders') {
				folderId = null
				this.allFoldersView = true
				this.activeFolder = Object.assign({})
			} else {
				this.allFoldersView = false
				this.activeFolder = Object.assign({}, folder)
			}

			return Resources.getResources(
				businessId,
				locationId,
				folderId,
				pageNumber,
				recordsPerPage,
				searchCriteria,
				sortCriteria
			)
			.then(response => {
				_this.currentResources = response.payload.files
				_this.numPages = response.payload.number_of_pages
				_this.totalResults = response.payload.number_of_records
				_this.loadingResourceData = false

				// _this.preloadImages()
				// .then(response => {
				// 	setTimeout(() => {
				// 	}, 500)
				// })
				// .catch(error => {
				// 	console.log(error)
				// })
			})
			.catch(
				_this.$root.errorWrapper(e => {
					if (e.responseJSON) {
						switch (e.responseJSON.declaration) {
						case 'file_not_found':
							_this.numPages = 0
							_this.totalResults = 0
							break

						case 'business_not_found':
							_this.numPages = 0
							_this.totalResults = 0
							_this.$swal({
								title: 'Error',
								html: 'There is an issue with your business account. Please contact your admin.',
								type: 'warning'
							})
							break

						case 'invalid_page_number':
							_this.numPages = e.responseJSON.payload.number_of_pages
							_this.totalResults = e.responseJSON.payload.number_of_records
							if (_this.numPages !== 0) {
								_this.getResources(this.activeFolder, e.responseJSON.payload.number_of_pages)
							}
							break

						default:
							// No default
						}
					}
					_this.loadingResourceData = false
				})
			)
		},
		/**
		 * To pull in all tags belonging to the business or location
		 * @function
		 * @returns {undefined}
		 * @memberof ResourceModal
		 * @version 0.0.9
		 */
		getTags () {
			let _this = this
			const businessId = this.activeBusinessId
			const locationId = this.activeLocationId
			const pageNumber = 1
			const recordsPerPage = this.recordsPerPage

			return Resources.getTags(
				businessId,
				locationId,
				pageNumber,
				recordsPerPage
			)
			.then(response => {
				_this.tags = response.payload.tags.map(tag => {
					tag.active = false
					return tag
				})
			})
			.catch(
				_this.$root.errorWrapper(e => {
					if (e.responseJSON) {
						switch (e.responseJSON.declaration) {
						case 'tags_not_found':
							_this.tags = []
							return

						default:
							_this.errorMessage = "We couldn't fetch file types"
						}
					}
				})
			)
		},
		/**
		 * To check whether or not a file is currently being uploaded.
		 * @function
		 * @param {boolean} val - Whether or not a file is currently being uploaded.
		 * @returns {undefined}
		 * @memberof ResourceModal
		 * @version 0.0.9
		 */
		checkSaving (val) {
			this.isSaving = val
		},
		/**
		 * Called when a file is uploaded to give the user the opportunity to manage the file.
		 * @function
		 * @param {integer} val - The id of the uploaded file.
		 * @returns {undefined}
		 * @memberof ResourceModal
		 * @version 0.0.9
		 */
		imageUploaded (val) {
			this.getResources(this.activeFolder, this.activePage)
		},
		/**
		 * To update the sort by field and make a backend call to pull the sorted data.
		 * @function
		 * @param {string} field - The field that the user wants to sort by.
		 * @returns {undefined}
		 * @memberof ResourceModal
		 * @version 0.0.9
		 */
		setSortField (field) {
			if (field !== this.sortBy.field) {
				this.sortBy.field = field
				if (parseInt(this.activePage) === 1) {
					this.getResources(this.activeFolder, 1)
				} else {
					this.activePageUpdate(1, this.activeFolder)
				}
			}
		},
		/**
		 * To toggle the filter panel, initially set to closed
		 * @function
		 * @returns {undefined}
		 * @memberof ResourceModal
		 * @version 0.0.9
		 */
		toggleFilterPanel () {
			this.filterCollapse = !this.filterCollapse
		},
		/**
		 * To toggle a tag on and off as a filter option.
		 * @function
		 * @param {object} tag - The tag being toggled
		 * @returns {undefined}
		 * @memberof ResourceModal
		 * @version 0.0.9
		 */
		toggleTag (tag) {
			tag.active = !tag.active
		},
		/**
		 * To toggle a file type on and off as a filter option.
		 * @function
		 * @param {object} type - The type being toggled
		 * @returns {undefined}
		 * @memberof ResourceModal
		 * @version 0.0.9
		 */
		toggleFileType (type) {
			type.active = !type.active
		},
		/**
		 * To clear the current search error.
		 * @function
		 * @returns {undefined}
		 * @memberof ResourceModal
		 * @version 0.0.9
		 */
		clearSearchError () {
			this.searchError = ''
		},
		/**
		 * To send the advanced search options to the backend to fetch resources.
		 * @function
		 * @returns {undefined}
		 * @memberof ResourceModal
		 * @version 0.0.9
		 */
		advancedResourceSearch () {
			this.clearSearchError()
			if (this.advancedSearch.search.length && this.advancedSearch.search.length < 3) {
				this.searchError = 'In order to use the search field your term must be at least 3 characters.'
			} else {
				if (parseInt(this.activePage) === 1) {
					this.getResources(this.activeFolder, 1)
				} else {
					this.activePageUpdate(1, this.activeFolder)
				}
			}
		},
		/**
		 * To select a resource to use.
		 * @function
		 * @param {object} resource - The resource being selected.
		 * @returns {undefined}
		 * @memberof ResourceModal
		 * @version 0.0.9
		 */
		setResource (resource) {
			this.selectedResource = Object.assign({}, resource)
		},
		/**
		 * To clear the current resource search criteria.
		 * @function
		 * @returns {undefined}
		 * @memberof ResourceModal
		 * @version 0.0.9
		 */
		resetResourceSearch () {
			this.advancedSearch = {
				search: '',
				range: 'this_folder',
				searchOptions: [
					{ name: 'All Folders', value: 'all_folders' },
					{ name: 'This Folder', value: 'this_folder' }
				]
			}

			this.tags.forEach(tag => {
				tag.active = false
			})
			this.fileTypes.forEach(type => {
				type.active = false
			})

			this.clearSearchError()
		},
		/**
		 * To close the resource modal and emit the selected resource
		 * @function
		 * @returns {undefined}
		 * @memberof ResourceModal
		 * @version 0.0.9
		 */
		resourceSelectionComplete () {
			let payload = { ...this.selectedResource }
			payload.image_url = payload.url
			this.$emit('selected', payload)
			if (this.showDoneButton) { this.closeResourceModal() }
		},
		/**
		 * To select the resource and complete the selection process
		 * @function
		 * @param {object} resource - The selected resource
		 * @returns {undefined}
		 * @memberof ResourceModal
		 * @version 0.0.9
		 */
		selectAndComplete (resource) {
			this.setResource(resource)
			this.resourceSelectionComplete()
		}
	},
	components: {
		Dropdown,
		LoadingScreen,
		Modal,
		PageResults,
		Pagination,
		FileUpload,
		ResourceFolder
	},
	watch: {
		'sortBy.order' () {
			if (this.sortBy.field) {
				if (parseInt(this.activePage) === 1) {
					this.getResources(this.activeFolder, 1)
				} else {
					this.activePageUpdate(1, this.activeFolder)
				}
			}
		}
	}
}
</script>

<style scoped>
.resource-header > * {
  float: right;
}

.portlet.box.blue-hoki.portlet-blue-override {
  border: none;
  box-shadow: none;
}

.filter-tags label {
  color: #999;
}
.filter-tags button {
  margin: 3px;
}

.resource-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 10000px;
  max-height: 150px;
  border: 2px solid rgba(0,0,0,0);
}
.resource-image {
  max-width: 100%;
  max-height: 100%;
}
.selected {
  border: 2px solid #727d88;
}
.relative {
  position: relative;
}

.cbp-wrapper {
  min-height: 100px;
}
.resource-picker {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.resource-picker img {
  max-height: 100%;
  max-width: 100%;
}
section {
	width: 100%;
}
</style>
