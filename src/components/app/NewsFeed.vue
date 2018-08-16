<template>
	<div>
		<!-- BEGIN PAGE BAR -->
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<!-- END PAGE BAR -->
		<!-- BEGIN PAGE TITLE-->
		<h1 class="page-title">News Feed</h1>
		<!-- END PAGE TITLE-->
		<div class="note note-info">
			<p>Create and manage the Application News Feed.</p>
		</div>
		<!-- CREATE START -->
		<div class="portlet box blue-hoki margin-top-20" v-if="$root.permissions['news_feed create']">
			<div class="portlet-title bg-blue-chambray" @click="toggleCreateFeedPanel()">
				<div class="custom tools">
					<a :class="{'expand': !createFeedCollapse, 'collapse': createFeedCollapse}"></a>
				</div>
				<div class="caption">
					&emsp;Create News Feed
				</div>
			</div>
			<div class="portlet-body" :class="{'display-hide': createFeedCollapse}">
				<form role="form" @submit.prevent="createNewsFeed($event)">
					<div class="row">
						<div class="col-md-12">
							<div class="alert alert-danger" v-show="createFeedError.length" ref="createFeedError">
								<button class="close" data-close="alert" @click.prevent="clearCreateFeedError()"></button>
								<span>{{createFeedError}}</span>
							</div>
						</div>
						<div :class="{'col-md-2' : !imageMode.newMenu, 'col-md-12' : imageMode.newMenu}">
							<resource-picker
								@open="toggleImageMode('newMenu', true)"
								@close="toggleImageMode('newMenu', false)"
								@selected="updateImage"
								:imageButton="true"
								:imageUrl="newNewsFeed.image"
								class="margin-top-15"
							>
							</resource-picker>
						</div>
						<div class="col-md-5" v-show="!imageMode.newMenu">
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text" class="form-control input-sm" id="form_control_1" v-model="newNewsFeed.title" :class="{'edited': newNewsFeed.title.length}">
								<label for="form_control_1">Title</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text" class="form-control input-sm" id="form_control_2" v-model="newNewsFeed.short_description" :class="{'edited': newNewsFeed.short_description.length}">
								<label for="form_control_2">Short Description</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text" class="form-control input-sm" id="form_control_external_url" v-model="newNewsFeed.external_url" :class="{'edited': newNewsFeed.external_url.length}">
								<label for="form_control_2">Link</label>
							</div>
						</div>
						<div class="col-md-5" v-show="!imageMode.newMenu">
							<div class="form-group form-md-line-input form-md-floating-label">
								<textarea class="form-control input-sm" rows="4" v-model="newNewsFeed.body" :class="{'edited': newNewsFeed.body.length}"></textarea>
								<label for="form_control_1">Body</label>
							</div>
						</div>
						<div class="col-xs-12" v-show="!imageMode.newMenu">
							<div class="pull-right">
								<button 
									type="submit" 
									class="btn blue"
									:disabled="creating">
									Save
									<i 
										v-show="creating"
										class="fa fa-spinner fa-pulse fa-fw">
									</i>
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
		<!-- CREATE END -->
	    <div class="margin-top-20">
	    	<div class="relative-block">
				<div class="clearfix" v-if="newsFeed.length">
					<el-dropdown trigger="click" @command="updateSortByOrder" size="mini" :show-timeout="50" :hide-timeout="50">
						<el-button size="mini">
							Sort by
							<span>
								<i class="fa fa-sort-alpha-asc" v-if="sortBy.order === 'ASC'"></i>
								<i class="fa fa-sort-alpha-desc" v-if="sortBy.order === 'DESC'"></i>
							</span>
							<i class="el-icon-arrow-down el-icon--right"></i>
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="ASC"><i class="fa fa-sort-alpha-asc"></i></el-dropdown-item>
							<el-dropdown-item command="DESC"><i class="fa fa-sort-alpha-desc"></i></el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					<page-results class="pull-right" :totalResults="totalResults" :activePage="activePage" @pageResults="pageResultsUpdate"></page-results>
				</div>
				<div class="portlet light portlet-fit bordered margin-top-20" v-if="newsFeed.length">
					<div class="portlet-title">
					<div class="caption">
						<i class="fa fa-newspaper-o font-default"></i>
						<span class="caption-subject bold font-default uppercase"> News Feed</span>
					</div>
					</div>
					<div class="portlet-body">
						<div class="timeline">
							<!-- TIMELINE ITEM -->
							<div class="timeline-item" v-for="(news, index) in newsFeed" :key="index">
								<div class="timeline-badge">
									<img class="timeline-badge-userpic" v-if="news.image.length" :src="news.image">
									<img class="timeline-badge-userpic" v-if="!news.image.length" src="../../../src/assets/img/app/image-placeholder.png">
								</div>
								<div class="timeline-body" :id="'news-' + news.id">
									<div class="timeline-body-arrow"> </div>
									<div class="timeline-body-head">
										<div class="timeline-body-head-caption">
											<a class="timeline-body-title font-blue-madison">{{ news.title }}</a>
										</div>
										<div class="timeline-body-head-actions">
											<div class="btn-group" v-if="$root.permissions['news_feed update']">
												<button class="btn blue btn-sm" type="button" @click="editNewsFeed(news)"> Edit</button>
											</div>
											<div class="btn-group" v-if="$root.permissions['news_feed read'] && !$root.permissions['news_feed update']">
												<button class="btn blue btn-sm" type="button" @click="editNewsFeed(news)"> View</button>
											</div>
											<div class="btn-group" v-if="$root.permissions['news_feed delete']">
												<button class="btn blue btn-outline btn-sm" type="button" @click="openDeleteModal(news)"> Delete</button>
											</div>
										</div>
									</div>
									<div class="timeline-body-content">
										<h5>{{ news.formatted_date }}</h5>
										<span class="font-grey-cascade">{{ news.short_description }}</span>
										<span class="font-grey-cascade">{{ news.external_url }}</span>
									</div>
								</div>
							</div>
						</div>
						<!-- END TIMELINE ITEM -->
					</div>
					<div class="alert alert-danger" v-show="!newsFeed && errorMessage" ref="errorMessage">
						<button class="close" @click="clearError('errorMessage')"></button>
						<span>{{errorMessage}}</span>
					</div>
				</div>
				<div v-else>
					<no-results :show="!newsFeed.length" :type="'news feed'"></no-results>
				</div>
				<pagination v-if="newsFeed.length && numPages > 1" :passedPage="activePage" :numPages="numPages" @activePageChange="activePageUpdate"></pagination>
			</div>
		</div>

		<edit-news-feed v-if="showEditFeedModal" :selectedFeedId="selectedFeedId" @closeEditFeedModal="closeEditFeedModal" @updateNewsFeed="updateNewsFeed"></edit-news-feed>

		<!-- START DELETE -->
		<modal :show="showDeleteModal" effect="fade" @closeOnEscape="closeDeleteModal" ref="deleteModal">
			<div slot="modal-header" class="modal-header">
				<button type="button" class="close" @click="closeDeleteModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Confirm Delete</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<div class="alert alert-danger" v-show="deleteErrorMessage" ref="deleteErrorMessage">
					<button class="close" @click="clearError('deleteErrorMessage')"></button>
					<span>{{deleteErrorMessage}}</span>
				</div>

				<p>Are you sure you want to delete the news feed?</p>
			</div>
			<div slot="modal-footer" class="modal-footer clear">
				<button 
					type="button" 
					class="btn blue" 
					@click="deleteNewsFeed()"
					:disabled="deleting">
					Delete
					<i 
						v-show="deleting"
						class="fa fa-spinner fa-pulse fa-fw">
					</i>
				</button>
			</div>
		</modal>
		<!-- START DELETE -->
	</div>
</template>

<script>
import $ from 'jquery'
import Breadcrumb from '../modules/Breadcrumb'
import NoResults from '../modules/NoResults'
import PageResults from '../modules/PageResults'
import Modal from '@/components/modules/Modal'
import Pagination from '../modules/Pagination'
import Dropdown from '../modules/Dropdown'
import NewsFeedFunctions from '../../controllers/NewsFeed'
import EditNewsFeed from './NewsFeed/EditNewsFeed'
import ResourcePicker from '../modules/ResourcePicker'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	data () {
		return {
			breadcrumbArray: [
				{name: 'News Feed', link: false}
			],
			sortBy: {
				order: 'ASC'
			},
			pageResultsValue: 0,
			numPages: 0,
			totalResults: 0,
			activePage: 1,
			newsFeed: [],
			errorMessage: '',
			createFeedCollapse: true,
			newNewsFeed: {
				title: '',
				short_description: '',
				body: '',
				image: '',
				external_url: ''
			},
			createFeedError: '',
			creating: false,
			showEditFeedModal: false,
			updateFeedError: '',
			selectedFeedId: 0,
			imageMode: {
				newMenu: false
			},
			showDeleteModal: false,
			newsToDelete: {},
			deleting: false,
			deleteErrorMessage: ''
		}
	},
	created () {
		this.getNewsFeed()
	},
	methods: {
		/**
		 * To close the modal for deleting a promotion and remove that promotion from DOM.
		 * @function
		 * @returns {undefined}
		 */
		deleteNewsFeed () {
			this.deleting = true
			var _this = this
			return NewsFeedFunctions.deleteNewsFeed(_this.newsToDelete.id)
			.then(response => {
				if (response.code === 200 && response.status === 'ok') {
					_this.getNewsFeed()
					_this.closeDeleteModal()
					_this.showDeleteSuccess()
				}
			})
			.catch(reason => {
				ajaxErrorHandler({
					reason,
					errorText: `We could not delete the news feed`,
					errorName: 'deleteErrorMessage',
					vue: _this,
					containerRef: 'deleteModal'
				})
			}).finally(() => {
				_this.deleting = false
			})
		},
		/**
		 * To confirm the operaion succeeded
		 * @function
		 * @returns {undefined}
		 */
		showDeleteSuccess () {
			this.$swal({
				title: 'Success!',
				text: `News feed deleted`,
				type: 'success',
				confirmButtonText: 'OK'
			})
		},
		/**
		 * To clear an error
		 * @function
		 * @param {string} name - Name of the variable to clear
		 * @returns {undefined}
		 */
		clearError (name) {
			this[name] = ''
		},
		/**
		 * To show the delete modal
		 * @function
		 * @param {object} news - The news object to delete
		 * @returns {undefined}
		 */
		openDeleteModal (news) {
			this.newsToDelete = {...news}
			this.showDeleteModal = true
		},
		closeDeleteModal () {
			this.clearError('deleteErrorMessage')
			this.showDeleteModal = false
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
		 * To set the image to be same as the one emitted by the resource picker.
		 * @function
		 * @param {object} val - The emitted image object.
		 * @returns {undefined}
		 */
		updateImage (val) {
			this.newNewsFeed.image = val.image_url
		},
		/**
		 * To update the order property of sortBy.
		 * @function
		 * @param {object} value - The new value to assign.
		 * @returns {undefined}
		 */
		updateSortByOrder (value) {
			this.sortBy.order = value
		},
		/**
		 * To catch updates from the PageResults component when the number of page results is updated.
		 * @function
		 * @param {integer} val - The number of page results to be returned.
		 * @returns {undefined}
		 */
		pageResultsUpdate (val) {
			if (parseInt(this.pageResultsValue) !== parseInt(val)) {
				this.pageResultsValue = val
				this.activePageUpdate(1)
				this.getNewsFeed(0)
			}
		},
		/**
		 * To update the currently active pagination page.
		 * @function
		 * @param {integer} val - An integer representing the page number that we are updating to.
		 * @returns {undefined}
		 */
		activePageUpdate (val) {
			if (parseInt(this.activePage) !== parseInt(val)) {
				this.activePage = val
				this.getNewsFeed(this.activePage)
			}
		},
		/**
		 * To get the news feed for the current page.
		 * @function
		 * @param {integer} pageNumber - The current page that we are retrieving results for.
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getNewsFeed (pageNumber) {
			this.newsFeed = []
			var newsFeedVue = this
			return NewsFeedFunctions.getNewsFeed(pageNumber, newsFeedVue.pageResultsValue, newsFeedVue.sortBy.order, newsFeedVue.$root.userToken, newsFeedVue.$root.appId, newsFeedVue.$root.appSecret).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					newsFeedVue.totalResults = response.payload.data.length
					newsFeedVue.newsFeed = response.payload.data
					for (var i = 0; i < newsFeedVue.newsFeed.length; i++) {
						var item = newsFeedVue.newsFeed[i].created_on.split(' ')
						if (item[0] !== '0000-00-00') {
							var date = new Date(item[0])
							var dateSplit = date.toString().split(' ')
							newsFeedVue.$set(newsFeedVue.newsFeed[i], 'formatted_date', dateSplit[1] + ' ' + dateSplit[2] + ', ' + dateSplit[3])
						} else {
							newsFeedVue.$set(newsFeedVue.newsFeed[i], 'formatted_date', 'Invalid Date')
						}
					}
				} else {
					newsFeedVue.errorMessage = response.message
				}
			}).catch(reason => {
				ajaxErrorHandler({
					reason,
					errorText: 'We could not fetch news feeds',
					errorName: 'errorMessage',
					vue: newsFeedVue
				})
			})
		},
		/**
		 * To toggle the create feed panel, initially set to closed
		 * @function
		 * @returns {undefined}
		 * @memberof Users
		 * @version 0.0.4
		 */
		toggleCreateFeedPanel () {
			this.createFeedCollapse = !this.createFeedCollapse
		},
		/**
		 * To clear the current search error.
		 * @function
		 * @returns {undefined}
		 * @memberof Users
		 * @version 0.0.4
		 */
		clearCreateFeedError () {
			this.createFeedError = ''
		},
		/**
		 * To clear the create feed form.
		 * @function
		 * @returns {undefined}
		 * @memberof Users
		 * @version 0.0.4
		 */
		resetForm () {
			this.newNewsFeed = {
				title: '',
				short_description: '',
				body: '',
				image: '',
				external_url: ''
			}
			this.clearCreateFeedError()
		},
		/**
		 * To check if the news feed information are valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateNewsFeedData () {
			var newsFeedVue = this
			return new Promise(function (resolve, reject) {
				if (!newsFeedVue.newNewsFeed.title.length) {
					reject('Title cannot be blank')
				} else if (!newsFeedVue.newNewsFeed.short_description.length) {
					reject('Short description cannot be blank')
				} else if (!newsFeedVue.newNewsFeed.body.length) {
					reject('Body cannot be blank')
				} else if (!newsFeedVue.newNewsFeed.image.length) {
					reject('Image cannot be blank')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To prompt the backend call that creates a new news feed.
		 * @function
		 * @param {object} event - The click event that prompted this function.
		 * @returns {object} A promise that will either return an error message or display the success screen
		 */
		createNewsFeed (event) {
			var newsFeedVue = this

			this.clearCreateFeedError()
			return newsFeedVue.validateNewsFeedData()
			.then(response => {
				newsFeedVue.creating = true
				NewsFeedFunctions.createNewsFeed(newsFeedVue.newNewsFeed, newsFeedVue.$root.userToken, newsFeedVue.$root.appId, newsFeedVue.$root.appSecret).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						newsFeedVue.newsFeed.push(response.payload)
						newsFeedVue.resetForm()
					} else {
						newsFeedVue.createFeedError = response.message
					}
				}).catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'Could not create news feed',
						errorName: 'createFeedError',
						vue: newsFeedVue
					})
				}).finally(() => {
					newsFeedVue.creating = false
				})
			}).catch(reason => {
				// If validation fails then display the error message
				newsFeedVue.createFeedError = reason
				window.scrollTo(0, 0)
				throw reason
			})
		},
		/**
		 * To show input fields instead of the plain text for news feed.
		 * @function
		 * @param {object} news - The news object to be edited
		 * @returns {undefined}
		 */
		editNewsFeed (news) {
			this.showEditFeedModal = true
			this.selectedFeedId = news.id
		},
		/**
		 * To close the edit feed modal and get the updated list of news feed
		 * @function
		 * @returns {undefined}
		 */
		closeEditFeedModal () {
			this.showEditFeedModal = false
		},
		updateNewsFeed (val) {
			this.showEditFeedModal = false
			for (var i = 0; i < this.newsFeed.length; i++) {
				if (this.newsFeed[i].id === val.id) {
					this.newsFeed[i] = val
				}
			}
			$('#news-' + val.id).addClass('highlight')
			setTimeout(function () {
				$('#news-' + val.id).removeClass('highlight')
			}, 2000)
		}
	},
	watch: {
		'sortBy.order' () {
			if (this.sortBy.order) {
				this.activePageUpdate(1)
				this.getNewsFeed(0)
			}
		}
	},
	components: {
		Breadcrumb,
		PageResults,
		Pagination,
		Dropdown,
		EditNewsFeed,
		NoResults,
		ResourcePicker,
		Modal
	}
}
</script>
<style scoped>
.image-wrapper {
	height: 80px;
	max-height: 80px;
	width: 100%;
	border: 1px dotted #c2cad8;
	display: flex;
	justify-content: center;
	align-items: center;
}
.image-fit {
	max-height: 100%;
	max-width: 100%;
}
</style>
