<template>
	<div>
		<!-- BEGIN PAGE BAR -->
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<!-- END PAGE BAR -->
		<!-- BEGIN PAGE TITLE-->
		<h1 class="page-title">Social Feed</h1>
		<!-- END PAGE TITLE-->
		<div class="note note-info">
			<p>Create and manage the Social Feed.</p>
		</div>
		<div v-if="socialFeed.length">
			<h5>Filter By:</h5>
			<button-group :value="filterBy"
			              type="primary">
				<checkbox value="facebook">
					<span v-if="filterBy.indexOf('facebook') >= 0">
						<i class="fa fa-check green"></i>&nbsp; </span>Facebook</checkbox>
				<checkbox value="twitter">
					<span v-if="filterBy.indexOf('twitter') >= 0">
						<i class="fa fa-check green"></i>&nbsp; </span>Twitter</checkbox>
				<checkbox value="instagram">
					<span v-if="filterBy.indexOf('instagram') >= 0">
						<i class="fa fa-check green"></i>&nbsp; </span>Instagram</checkbox>
			</button-group>
		</div>
		<div class="margin-top-20">
			<div class="row">
				<div class="col-md-12">
					<div class="alert alert-danger"
					     v-show="listErrorMessage"
					     ref="listErrorMessage">
						<button class="close"
						        @click="clearError('listErrorMessage')"></button>
						<span>{{listErrorMessage}}</span>
					</div>
				</div>
			</div>
			<div class="relative-block">
				<div v-if="filteredSocialFeed.length"
				     class="clearfix">
					<el-dropdown trigger="click"
					             @command="updateSortByOrder"
					             size="mini"
					             :show-timeout="50"
					             :hide-timeout="50">
						<el-button size="mini">
							Sort by
							<span>
								<i class="fa fa-sort-alpha-asc"
								   v-if="sortBy.order === 'ASC'"></i>
								<i class="fa fa-sort-alpha-desc"
								   v-if="sortBy.order === 'DESC'"></i>
							</span>
							<i class="el-icon-arrow-down el-icon--right"></i>
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="ASC">
								<i class="fa fa-sort-alpha-asc"></i>
							</el-dropdown-item>
							<el-dropdown-item command="DESC">
								<i class="fa fa-sort-alpha-desc"></i>
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					<page-results class="pull-right"
					              :totalResults="totalResults"
					              :activePage="activePage"
					              @pageResults="pageResultsUpdate"></page-results>
				</div>
				<div class="blog-page blog-content-1 relative-block margin-top-20">
					<loading-screen :show="loadingFilteredData"
					                :color="'#2C3E50'"
					                :display="'inline'"></loading-screen>
					<div v-if="!loadingFilteredData && socialFeed.length">
						<div class="row"
						     v-if="filteredSocialFeed.length">
							<div class="col-md-3 col-sm-3 col-xs-4"
							     v-for="(feed, index) in filteredSocialFeed"
							     :key="index">
								<div class="blog-post-sm blog-container blog-shadow"
								     :id="'social-feed-' + feed.id">
									<div class="blog-top-wrap">
										<div class="pull-left">
											<span v-if="feed.short_description.length">{{ feed.short_description }}</span>
											<span v-else>NO TITLE</span>
										</div>
									</div>
									<div class="blog-img-thumb small-blog-img-thumb"
									     :class="{'blog-img-thumb-bordered': !feed.url.length}">
										<a>
											<img v-if="feed.url.length"
											     :src="feed.img_full_url">
											<img class="small-image"
											     v-else
											     src="../../assets/img/app/image-placeholder.png">
										</a>
									</div>
									<div class="blog-post-content">
										<p class="blog-post-desc"> {{ feed.description }} </p>
										<div class="blog-post-foot"
										     v-if="feed.facebook || feed.twitter || feed.instagram">
											<div class="socicons">
												<a v-if="feed.facebook"
												   class="socicon-btn socicon-btn-circle socicon-facebook"></a>
												<a v-if="feed.twitter"
												   class="socicon-btn socicon-btn-circle socicon-twitter"></a>
												<a v-if="feed.instagram"
												   class="socicon-btn socicon-btn-circle socicon-instagram"></a>
											</div>
										</div>
										<button v-if="feed.status === 1"
										        type="button"
										        class="btn btn-danger custom-button full-width"
										        @click="updateFeedStatus(feed, 0)"
										        :disabled="updating">
											Off
											<i v-show="updating"
											   class="fa fa-spinner fa-pulse fa-fw">
											</i>
										</button>
										<button v-if="feed.status === 0"
										        type="button"
										        class="btn btn-success custom-button full-width"
										        @click="updateFeedStatus(feed, 1)"
										        :disabled="updating">
											On
											<i v-show="updating"
											   class="fa fa-spinner fa-pulse fa-fw">
											</i>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div v-if="!loadingFilteredData && !socialFeed.length">
						<no-results :show="true"
						            :type="'social feeds'"></no-results>
					</div>
				</div>
				<div v-if="filteredSocialFeed.length"
				     class="margin-top-20">
					<pagination :passedPage="activePage"
					            :numPages="numPages"
					            @activePageChange="activePageUpdate"></pagination>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import Breadcrumb from '../modules/Breadcrumb'
import Dropdown from '../modules/Dropdown'
import LoadingScreen from '../modules/LoadingScreen'
import PageResults from '../modules/PageResults'
import Pagination from '../modules/Pagination'
import ButtonGroup from '../modules/ButtonGroup'
import Checkbox from '../modules/Checkbox'
import NoResults from '../modules/NoResults'
import SocialFeedFunctions from '../../controllers/SocialFeed'
import { findIndex } from 'lodash'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	data () {
		return {
			breadcrumbArray: [{ name: 'Social Feed', link: false }],
			listErrorMessage: '',
			filterBy: ['facebook', 'twitter', 'instagram'],
			filteredSocialFeed: [],
			socialFeed: [],
			numPages: 0,
			activePage: 1,
			pageResultsValue: 25,
			sortBy: {
				order: 'ASC'
			},
			totalResults: 0,
			loadingFilteredData: false,
			updating: false
		}
	},
	mounted () {
		// get the social feed
		this.getSocialFeed(0)
	},
	methods: {
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
		 * To clear an error.
		 * @function
		 * @param {string} name - Name of the error variable to clear
		 * @returns {undefined}
		 */
		clearError (name) {
			this[name] = ''
		},
		/**
		 * To get the social feed for the current page.
		 * @function
		 * @param {integer} pageNumber - The current page that we are retrieving results for.
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getSocialFeed (pageNumber) {
			this.loadingFilteredData = true
			this.socialFeed = []

			var socialFeedVue = this
			return SocialFeedFunctions.getSocialFeed(
				pageNumber,
				socialFeedVue.pageResultsValue,
				socialFeedVue.sortBy.order,
				socialFeedVue.$root.appId,
				socialFeedVue.$root.appSecret,
				socialFeedVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						socialFeedVue.loadingFilteredData = false
						socialFeedVue.socialFeed = response.payload
						socialFeedVue.updateImagePaths()
						socialFeedVue.getFilteredSocialFeed()
					} else {
						socialFeedVue.loadingFilteredData = false
					}
				})
				.catch(reason => {
					socialFeedVue.loadingFilteredData = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch social feeds',
						errorName: 'listErrorMessage',
						vue: socialFeedVue
					})
				})
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
				this.getSocialFeed(this.activePage)
			}
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
				this.getSocialFeed(0)
			}
		},
		/**
		 * To update the paths of the social feed images so that they are absolute.
		 * @function
		 * @returns {undefined}
		 */
		updateImagePaths () {
			for (var i = 0; i < this.socialFeed.length; i++) {
				var tokens = this.socialFeed[i].url.split('/')
				this.socialFeed[i].url =
					'http://35.162.38.115:8005/uploads/' + tokens[2] + '/' + tokens[3]
			}
		},
		/**
		 * To update the results based on the applied filters.
		 * @function
		 * @returns {undefined}
		 */
		getFilteredSocialFeed () {
			this.loadingFilteredData = true
			this.filteredSocialFeed = []
			for (var i = 0; i < this.socialFeed.length; i++) {
				// push appropriate objects (if it does not already exist) in filteredSocialFeed[]
				if (
					this.socialFeed[i].facebook === 1 &&
					findIndex(this.filteredSocialFeed, this.socialFeed[i]) === -1
				) {
					if (this.filterBy.indexOf('facebook') >= 0) {
						this.filteredSocialFeed.push(this.socialFeed[i])
					}
				}
				if (
					this.socialFeed[i].twitter === 1 &&
					findIndex(this.filteredSocialFeed, this.socialFeed[i]) === -1
				) {
					if (this.filterBy.indexOf('twitter') >= 0) {
						this.filteredSocialFeed.push(this.socialFeed[i])
					}
				}
				if (
					this.socialFeed[i].instagram === 1 &&
					findIndex(this.filteredSocialFeed, this.socialFeed[i]) === -1
				) {
					if (this.filterBy.indexOf('instagram') >= 0) {
						this.filteredSocialFeed.push(this.socialFeed[i])
					}
				}
				if (
					this.socialFeed[i].facebook === 0 &&
					this.socialFeed[i].instagram === 0 &&
					this.socialFeed[i].twitter === 0 &&
					findIndex(this.filteredSocialFeed, this.socialFeed[i]) === -1
				) {
					if (
						this.filterBy.indexOf('facebook') === -1 &&
						this.filterBy.indexOf('twitter') === -1 &&
						this.filterBy.indexOf('instagram') === -1
					) {
						this.filteredSocialFeed.push(this.socialFeed[i])
					}
				}
			}
			setTimeout(() => {
				this.loadingFilteredData = false
			}, 500)
		},
		/**
		 * To update the status field of a particular feed.
		 * @function
		 * @param {object} feed - The selected feed.
		 * @param {integer} val - The new value.
		 * @returns {undefined}
		 */
		updateFeedStatus (feed, val) {
			if (!this.$root.permissions['social_feed update']) return

			this.updating = true
			var socialFeedVue = this
			SocialFeedFunctions.updateFeedStatus(
				feed.id,
				val,
				socialFeedVue.$root.appId,
				socialFeedVue.$root.appSecret,
				socialFeedVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						feed.status = val
						socialFeedVue.showSuccessAlert(response.payload)
					} else {
						throw new Error()
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not update the feed',
						errorName: 'listErrorMessage',
						vue: socialFeedVue
					})
				})
				.finally(() => {
					socialFeedVue.updating = false
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showSuccessAlert (payload = {}) {
			let title = 'Success'
			let text = 'The Social Feed has been saved'
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
	},
	watch: {
		'sortBy.order' () {
			if (this.sortBy.order) {
				this.activePageUpdate(1)
				this.getSocialFeed(0)
			}
		},
		filterBy () {
			this.getFilteredSocialFeed()
		}
	},
	components: {
		Breadcrumb,
		ButtonGroup,
		Checkbox,
		NoResults,
		Pagination,
		Dropdown,
		PageResults,
		LoadingScreen
	}
}
</script>
<style scoped>
.icon-container {
  margin-bottom: 10px;
}
.social-feed-status {
  display: inline-block;
  position: absolute;
  right: 22px;
  bottom: 32px;
}
.socicon-btn {
  border: 1px solid #d5d5d5;
}
.blog-page .blog-shadow {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.blog-post-content {
  height: 150px;
  overflow: hidden;
  position: relative;
}
.small-blog-img-thumb {
  height: 100px;
}
.blog-content-1 .blog-img-thumb img.small-image {
  width: 50%;
}
.blog-content-1 .blog-post-sm > .blog-img-thumb-bordered {
  border-bottom: 1px solid #e7ecf1;
}
.blog-post-title a {
  text-decoration: none;
}
.blog-top-wrap {
  position: relative;
  z-index: 3;
  height: 50px;
  opacity: 0.7;
  width: 100%;
  color: #fff;
  font-size: 15px;
  padding: 15px 10px;
  font-weight: 600;
  background-color: #286090;
}
.btn.custom-button:not(.md-skip):not(.bs-select-all):not(.bs-deselect-all) {
  position: absolute;
  bottom: 0;
  height: 30%;
  border-radius: 0;
}
.custom-button.full-width {
  left: 0;
  width: 100%;
}
.socicons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
