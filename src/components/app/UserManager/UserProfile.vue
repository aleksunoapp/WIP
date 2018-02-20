<template>
	<div>
		<!-- BEGIN PAGE BAR -->
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<!-- END PAGE BAR -->
		<!-- BEGIN PAGE TITLE-->
		<h1 class="page-title">User Profile</h1>
		<!-- END PAGE TITLE-->
		<div class="profile">
			<div class="content">
				<div class="row">
					<div class="col-md-3">
						<ul class="list-unstyled profile-nav">
							<li>
								<div class="portlet light profile-sidebar-portlet ">
									<!-- SIDEBAR USERPIC -->
									<div class="profile-userpic">
											<img src="http://www.clker.com/cliparts/B/R/Y/m/P/e/blank-profile-hi.png" style="width:150px;height:150px;" class="img-responsive" alt=""> </div>
									<!-- END SIDEBAR USERPIC -->
									<!-- SIDEBAR USER TITLE -->
									<div style="text-align:center" class="profile-usertitle">
											<div class="profile-usertitle-name"> <h2>{{ user.first_name }} {{ user.last_name }}</h2> </div>
									</div>
									<!-- END SIDEBAR USER TITLE -->
									<!-- SIDEBAR BUTTONS -->
									<div class="profile-userbuttons">
											<button type="button" class="btn btn-circle red btn-sm" @click="showMessageModal()">Message</button>
									</div>
									<!-- END SIDEBAR BUTTONS -->
									<!-- SIDEBAR MENU -->
									<div class="profile-usermenu">
										<ul class="nav">
											<li :class="{ active: isActive(this.tab1, 0) }" >
												<a a @click="changeTab(1, 0)" aria-expanded="true">
														<i class="fa fa-list-ol" aria-hidden="true"></i> Orders </a>
											</li>
											<li :class="{ active: isActive(this.tab1, 1) }" >
												<a a @click="changeTab(1, 1)" aria-expanded="true">
														<i class="fa fa-picture-o" aria-hidden="true"></i> Gallery </a>
											</li>
										</ul>
									</div>
									<!-- END MENU -->
								</div>
							</li>
							<li>
								<div class="portlet light ">
									<!-- STAT -->
									<div class="row list-separated profile-stat">
											<div>
												<div class="uppercase profile-stat-title"> {{ user.total_orders }} </div>
												<div class="uppercase profile-stat-text"> Total Orders </div>
											</div>
											<div class="margin-top-20">
												<div class="uppercase profile-stat-title"> ${{ user.total_spent }} </div>
												<div class="uppercase profile-stat-text"> Total Spent </div>
											</div>
									</div>
								</div>
							</li>
							<li>
								<div class="portlet light " v-show="userAttributes.length">
									<div class="uppercase profile-stat-text margin-bottom-20"> Attributes </div>
									<span class="badge badge-info margin-bottom-10 margin-right-10" v-for="attribute in userAttributes" :key="attribute.id">
										{{attribute.name}}
									</span>
								</div>
							</li>
							<li>
								<div class="portlet light " >
									<!-- STAT -->
									<div class="uppercase profile-stat-text margin-bottom-10"> Items </div>
									<div class="container__flex--column">
                                        <div v-for="item in userItems" :key="item.id" class="container__flex--row">
                                            <div class="container__item--image margin-right-10">
                                                <img :src="item.image_url" style="width: 40px; height: 40px;"> </a>
                                            </div>
                                            	<p class="font-blue-madison margin-left-10">
                                            		{{item.name}}
                                            	</p>
                                        </div>
									</div>
								</div>
							</li>
						</ul>
					</div>
					<div class="col-md-9" v-show="errorMessage.length">
						<div class="alert alert-danger">
						    <button class="close" data-close="alert" @click.prevent="clearError('errorMessage')"></button>
						    <span>{{errorMessage}}</span>
						</div>
					</div>
					<div class="col-md-9">
						<div class="tabbable-custom-profile">
							<div class="tab-content">
								<!--tab-pane-->
								<div v-show="tab1 === 0" class="tab-pane active">
									<div class="portlet-body">
										<div class="clearfix margin-bottom-10" v-if="orders.length">
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
							  				<page-results class="pull-right" :totalResults="orders.length" :activePage="activePage" @pageResults="pageResultsUpdate"></page-results>
										</div>
										<table class="table table-striped table-bordered table-advance table-hover">
											<thead>
												<tr>
													<th><i class="fa fa-building"></i> Store </th>
													<th class="hidden-xs"><i class="fa fa-usd"></i> Amount </th>
													<th><i class="fa fa-calendar"></i> Order Date </th>
													<th> <i class="fa fa-hourglass-start"></i> Status </th>
													<th> </th>
												</tr>
											</thead>
											<tbody>
												<tr v-for="order in currentActivePageOrders">
													<td class="align-middle"> 
														<span v-if="order.location_name !=='NULL'"> {{ order.location_name }} </span>
													</td>
													<td class="align-middle"> ${{ order.total }} </td>
													<td class="align-middle"> {{ order.created_at.substring(0, 10) }} </td>
													<td class="align-middle"><span class="label label-sm" :class="{ 'label-warning' : order.status === 'pending', 'label-success' : order.status === 'completed', 'label-danger' : order.status === 'overdue','label-danger' : order.status === 'cancelled', 'label-info' : order.status === 'refunded' }"> {{ order.status }} </span></td>
													<td class="align-middle">
														<a class="btn btn-sm grey-salsa btn-outline" @click="showViewOrderModal(order)"> View </a>
													</td>
												</tr>
											</tbody>
										</table>
										<div class="clearfix" v-if="orders.length && numPages > 1">
											<pagination :passedPage="activePage" :numPages="numPages" @activePageChange="activePageUpdate"></pagination>
										</div>
										<p v-if="!orders.length" class="text-center">
											This user hasn't made any orders yet
										</p>
									</div>
								</div>
								<!--tab-pane-->
								<div v-show="tab1 === 1" class="tab-pane active">
						    		<div class="row" v-if="socialFeed.length">
						    			<div class="col-md-3 col-sm-3 col-xs-4" v-for="feed in socialFeed">
	    				    				<div class="blog-post-sm blog-container blog-shadow" :id="'social-feed-' + feed.id">
	    				    					<div class="blog-top-wrap">
	    				    						<div class="pull-left">
	    					    						<span v-if="feed.short_description.length">{{ feed.short_description }}</span>
	    							                	<span v-else>NO TITLE</span>
	    				    						</div>
	    				    					</div>
	    				    			        <div class="blog-img-thumb small-blog-img-thumb" :class="{'blog-img-thumb-bordered': !feed.url.length}">
	    				    			        	<img class="small-image" v-if="feed.url.length" :src="feed.url">
	    				    			        	<img v-else class="small-image" src="../../../assets/img/app/image-placeholder.png">
	    				    			        </div>
	    				    			        <div class="blog-post-content">
	    				    			        	<p class="blog-post-desc"> {{ feed.description }} </p>
	    				    			        	<div class="blog-post-foot" v-if="feed.facebook || feed.twitter || feed.instagram">
	    				    			        		<div class="socicons">
	    				    			        			<a v-if="feed.facebook" class="socicon-btn socicon-btn-circle socicon-facebook"></a>
	    				    			        			<a v-if="feed.twitter" class="socicon-btn socicon-btn-circle socicon-twitter"></a>
	    				    			        			<a v-if="feed.instagram" class="socicon-btn socicon-btn-circle socicon-instagram"></a>
	    				    			        		</div>
	    				    			            </div>
	    				    			        </div>
	    				    			    </div>
						    			</div>
						    		</div>
								</div>
								<!--tab-pane-->
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<view-order v-if="viewOrderModalDisplayed" :order="orderBeingViewed" @closeViewOrderModal="closeViewOrderModal"></view-order>
		<message v-if="messageModalDisplayed" :userId="user.id" @closeMessageModal="closeMessageModal"></message>
	</div>
</template>

<script>
import Breadcrumb from '../../modules/Breadcrumb'
import Tabset from '../../modules/Tabset'
import ViewOrder from './ViewOrder'
import Message from './Message'
import Tab from '../../modules/Tab'
import '../../../assets/css/profile.min.css'
import UsersFunctions from '../../../controllers/Users'
import UserAttributesFunctions from '../../../controllers/UserAttributes'
import ButtonGroup from '../../modules/ButtonGroup'
import Checkbox from '../../modules/Checkbox'
import Dropdown from '../../modules/Dropdown'
import Pagination from '../../modules/Pagination'
import PageResults from '../../modules/PageResults'

export default {
	data () {
		return {
			breadcrumbArray: [
				{name: 'Users', link: '/app/user_manager/users'},
				{name: 'User Profile', link: false}
			],
			tab0: 0,
			tab1: 0,
			tab2: 0,
			user: {},
			orders: [],
			orderBeingViewed: {},
			viewOrderModalDisplayed: false,
			socialFeed: [],
			messageModalDisplayed: false,
			activePage: 1,
			resultsPerPage: 25,
			sortBy: {
				order: 'DESC'
			},
			userAttributes: [],
			userItems: [],
			errorMessage: ''
		}
	},
	computed: {
		numPages () {
			return Math.ceil(this.orders.length / this.resultsPerPage)
		},
		currentActivePageOrders () {
			return this.userSort(this.orders).slice(this.resultsPerPage * (this.activePage - 1), this.resultsPerPage * (this.activePage - 1) + this.resultsPerPage)
		}
	},
	mounted () {
		this.getUserDetails()
		this.getAttributesOfUser()
		this.getItemsOfuser()
		this.getUserOrders()
		this.getUserSocialFeed()
		window.scrollTo(0, 0)
	},
	methods: {
		/**
		 * To clear an error
		 * @function
		 * @param {string} errorName - The name of the error variable to clear
		 * @returns {undefined}
		 */
		clearError (errorName) {
			this[errorName] = ''
		},
		/**
		 * To update the order property of sortBy.
		 * @function
		 * @param {object} value - The new value to assign.
		 * @returns {undefined}
		 */
		updateSortByOrder (value) {
			this.sortBy.order = value
			this.filteredResults.length ? this.activeSearchPageUpdate(1) : this.activePageUpdate(1)
		},
		/**
		 * To sort the orders list.
		 * @function
		 * @param {array} orders - The array of orders.
		 * @returns {array} - The sorted array of orders
		 */
		userSort (orders) {
			let input = orders
			function asc (a, b) {
				if (new Date(a.created_at) < new Date(b.created_at)) {
					return -1
				} else if (new Date(a.created_at) > new Date(b.created_at)) {
					return 1
				} else {
					if (a.id > b.id) {
						return -1
					} else if (a.id < b.id) {
						return 1
					} else {
						return 0
					}
				}
			}

			function desc (a, b) {
				if (new Date(a.created_at) > new Date(b.created_at)) {
					return -1
				} else if (new Date(a.created_at) < new Date(b.created_at)) {
					return 1
				} else {
					if (a.id > b.id) {
						return -1
					} else if (a.id < b.id) {
						return 1
					} else {
						return 0
					}
				}
			}

			if (this.sortBy.order === 'ASC') {
				return input.sort(asc)
			} else {
				return input.sort(desc)
			}
		},
		/**
		 * To catch updates from the PageResults component when the number of page results is updated.
		 * @function
		 * @param {integer} val - The number of page results to be returned.
		 * @returns {undefined}
		 */
		pageResultsUpdate (val) {
			if (parseInt(this.resultsPerPage) !== parseInt(val)) {
				this.resultsPerPage = val
				this.activePage = 1
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
			}
		},
		/**
		 * To display a modal with the details of an order.
		 * @function
		 * @param {object} order - The order object whose details should be displayed.
		 * @returns {undefined}
		 */
		showViewOrderModal (order) {
			this.orderBeingViewed = order
			this.getOrderDetails()
		},
		/**
		 * To get the details of a user.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getOrderDetails () {
			var usersVue = this

			UsersFunctions.getOrderDetails(usersVue.$root.appId, usersVue.$root.appSecret, usersVue.$root.userToken, usersVue.orderBeingViewed.id)
			.then(response => {
				usersVue.orderBeingViewed.order_items = response.payload.order_items || []
				usersVue.viewOrderModalDisplayed = true
			})
			.catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					usersVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
					usersVue.errorMessage = reason.responseJSON.message || 'Could not retrieve order items'
					window.scrollTo(0, 0)
				} else {
					usersVue.errorMessage = reason.message || 'Could not retrieve order items'
					window.scrollTo(0, 0)
				}
			})
		},
		/**
		 * To close the modal with the details of an order.
		 * @function
		 * @returns {undefined}
		 */
		closeViewOrderModal () {
			this.orderBeingViewed = {}
			this.viewOrderModalDisplayed = false
		},
		/**
		 * To display a message modal.
		 * @function
		 * @returns {undefined}
		 */
		showMessageModal () {
			this.messageModalDisplayed = true
		},
		/**
		 * To close the message modal.
		 * @function
		 * @returns {undefined}
		 */
		closeMessageModal () {
			this.messageModalDisplayed = false
		},
		/**
		 * To check if the passed in tab is active or not.
		 * @function
		 * @param {object} menu - The passed in tab.
		 * @param {integer} val - The value of the tab.
		 * @returns {undefined}
		 */
		isActive: function (menu, val) {
			if (val === menu) {
				return true
			} else return false
		},
		/**
		 * To set the passed in tab as the active tab.
		 * @function
		 * @param {object} menu - The passed in tab.
		 * @param {integer} val - The value of the tab.
		 * @returns {undefined}
		 */
		changeTab: function (menu, val) {
			if (menu === 1) {
				this.tab1 = val
			} else if (menu === 2) {
				this.tab2 = val
			} else if (menu === 3) {
				this.tab3 = val
			}
		},
		/**
		 * To get the details of a user.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getUserDetails () {
			this.displayUserData = true
			var usersVue = this

			UsersFunctions.getUserDetails(usersVue.$root.appId, usersVue.$root.appSecret, usersVue.$root.userToken, usersVue.$route.params.user_id).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					usersVue.user = response.payload
					usersVue.displayUserData = false
				} else {
					usersVue.displayUserData = false
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					usersVue.$router.push('/login/expired')
					return
				}
				usersVue.displayUserData = false
				if (reason.responseJSON) {}
				throw reason
			})
		},
		/**
		 * To get a list of user's attributes.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getAttributesOfUser () {
			var usersVue = this

			UserAttributesFunctions.getAttributesOfUser(usersVue.$root.appId, usersVue.$root.appSecret, usersVue.$root.userToken, usersVue.$route.params.user_id).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					usersVue.userAttributes = response.payload.userattributes
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					usersVue.$router.push('/login/expired')
					return
				}
				throw reason
			})
		},
		/**
		 * To get a list of user's attributes.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getItemsOfuser () {
			var usersVue = this

			UserAttributesFunctions.getItemsOfuser(usersVue.$root.appId, usersVue.$root.appSecret, usersVue.$root.userToken, usersVue.$route.params.user_id).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					usersVue.userItems = response.payload
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					usersVue.$router.push('/login/expired')
					return
				}
				throw reason
			})
		},
		/**
		 * To get a list of user's orders.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getUserOrders () {
			this.displayUserData = true
			var usersVue = this

			UsersFunctions.getUserOrders(usersVue.$root.appId, usersVue.$root.appSecret, usersVue.$root.userToken, usersVue.$route.params.user_id).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					usersVue.orders = response.payload
					usersVue.displayUserData = false
				} else {
					usersVue.displayUserData = false
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					usersVue.$router.push('/login/expired')
					return
				}
				usersVue.displayUserData = false
				if (reason.responseJSON) {}
				throw reason
			})
		},
		/**
		 * To get a list of user's social media posts.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getUserSocialFeed () {
			this.displayUserData = true
			var usersVue = this

			UsersFunctions.getUserSocialFeed(usersVue.$root.appId, usersVue.$root.appSecret, usersVue.$root.userToken, usersVue.$route.params.user_id).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					usersVue.socialFeed = response.payload
					usersVue.displayUserData = false
				} else {
					usersVue.displayUserData = false
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					usersVue.$router.push('/login/expired')
					return
				}
				usersVue.displayUserData = false
				if (reason.responseJSON) {}
				throw reason
			})
		}
	},
	components: {
		Breadcrumb,
		Tabset,
		Tab,
		ViewOrder,
		ButtonGroup,
		Checkbox,
		Message,
		Pagination,
		PageResults,
		Dropdown
	}
}
</script>
<style scoped>
.list-separated {
	margin-top:10px;
	margin-bottom:10px;
}
.profile-stat {
    padding-bottom: 0;
    border-bottom: 0;
}
.label-success {
    background-color: #36c6d3;
}
.btn.green:not(.btn-outline) {
    color: #FFF;
    background-color: #32c5d2;
    border-color: #32c5d2;
}
.btn.red:not(.btn-outline) {
    color: #fff;
    background-color: #e7505a;
    border-color: #e7505a;
}
.profile ul.profile-nav li a {
		background: transparent;
    border-left: none;
		padding: 10px 15px;
}
.profile-usermenu ul li.active a {
    color: #5b9bd1;
    background-color: #f6f9fb;
    border-left: 2px solid #5b9bd1;
    margin-left: -2px;
}
.portlet{
	box-shadow: 0 2px 3px 2px rgba(0,0,0,0.4)
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
.blog-shadow {
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.blog-post-content {
	padding-left: 15px;
	padding-right: 15px;
	padding-bottom: 10px;
	height: 125px;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.small-blog-img-thumb {
	height: 125px;
	overflow: hidden;
	display: flex;
	justify-content: center;
}
img.small-image {
	max-width: 100%;
	min-width: 100%;
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
.align-middle {
	vertical-align: middle;
}
.container__flex--column {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
}
.container__flex--row {
	width: 100%;
	display: flex;
	align-items: center;
	/*padding-left: 15px;*/
}
.container__item--image {
	width: 40px;
	height: 40px;
	max-width: 40px;
	max-height: 40px;
}
.item--image {
	max-height: 100%;
	max-width: 100%;
}
</style>
