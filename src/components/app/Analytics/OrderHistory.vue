<template>
	<div>
		<div class="row">
			<div class="col-xs-12">
				<div class="alert alert-danger" v-show="alert">
				    <button class="close" @click="clearError('alert')"></button>
				    <span>{{alert}}</span>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="col-xs-12">
				<el-date-picker 
					v-model="fromDate" 
					type="date" 
					format="yyyy-MM-dd" 
					value-format="yyyy-MM-dd" 
					:clearable="true" 
					placeholder="From">
				</el-date-picker>
				<el-date-picker 
					v-model="toDate" 
					type="date" 
					format="yyyy-MM-dd" 
					value-format="yyyy-MM-dd" 
					:clearable="true" 
					placeholder="To">
				</el-date-picker>
				<el-select 
					v-model="locationId" 
					filterable 
					clearable
					placeholder="Select store">
					<el-option
						v-for="store in stores"
						:key="store.id"
						:label="store.display_name"
						:value="store.id">
					</el-option>
				</el-select>
				<el-input 
					class="input-width"
					placeholder="Order ID" 
					v-model="orderId">
				</el-input>
				<el-button
					type="primary"
					:loading="loading"
					@click="validateData()">
					Search
				</el-button>
			</div>
		</div>

		<div 
			class="row"
			v-show="!loading && orders.length">

			<div 
				class="
					col-xs-12
					margin-top-20
					margin-bottom-20
				">
				<el-dropdown 
					trigger="click" 
					@command="changeSortBy" 
					size="mini">
					<el-button size="mini">
						Sort by
						<span>
							<i class="fa fa-sort-alpha-asc" v-if="sortBy === 'ASC'"></i>
							<i class="fa fa-sort-alpha-desc" v-if="sortBy === 'DESC'"></i>
						</span>
						<i class="el-icon-arrow-down el-icon--right"></i>
					</el-button>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item command="ASC"><i class="fa fa-sort-alpha-asc"></i></el-dropdown-item>
						<el-dropdown-item command="DESC"><i class="fa fa-sort-alpha-desc"></i></el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				<page-results 
					class="pull-right" 
					:totalResults="total" 
					:activePage="page" 
					@pageResults="changePerPage">
				</page-results>
			</div>

			<div class="col-xs-12">
				<table class="table table-striped table-advance">
					<thead>
						<tr>
							<th>
								ID
							</th>
							<th>
								<i class="fa fa-calendar"></i>
								Order Date
							</th>
							<th>
								Status
							</th>
							<th>
								<i class="fa fa-usd"></i>
								Amount
							</th>

							<th v-if="location">
								<i class="fa fa-home"></i>
								Store
							</th>
							<th v-if="orderItems">
								Items
							</th>
							<th v-if="orderItemModifier">
								Modifiers
							</th>
							<th v-if="orderModifierOption">
								Options
							</th>
							<th v-if="user">
								Name
							</th>
							<th v-if="user">
								Email
							</th>
							<th v-if="user">
								Phone
							</th>
						</tr>
					</thead>

					<tbody>
						<tr 
							v-for="order in orders"
							:key="order.id">

							<td class="align-middle"> 
								{{order.id}}
							</td>
							<td class="align-middle">
								{{order.created_at.substring(0, 10)}}
							</td>
							<td class="align-middle">
								<span 
									class="label label-sm" 
									:class="{ 
										'label-warning' : order.status === 'pending', 
										'label-success' : order.status === 'completed', 
										'label-danger' : order.status === 'overdue',
										'label-danger' : order.status === 'cancelled',
										'label-info' : order.status === 'refunded'
									}">
									{{ order.status }}
								</span>
							</td>
							<td class="align-middle">
								{{order.total}}
							</td>

							<td 
								v-if="location"
								class="align-middle">
								{{order.location_name}}
							</td>
							<td 
								v-if="orderItems"
								class="align-middle">
								<ul class="list-unstyled">
									<li 
										v-for="item in order.order_items"
										:key="item.id">
										{{item.name}}
									</li>
								</ul>
							</td>
							<td 
								v-if="orderItemModifier"
								class="align-middle">
								<ul class="list-unstyled">
									<li 
										v-for="modifier in order.order_modifiers"
										:key="modifier.id">
										{{modifier.name}}
									</li>
								</ul>
							</td>
							<td 
								v-if="orderModifierOption"
								class="align-middle">
								<ul class="list-unstyled">
									<li 
										v-for="option in order.order_options"
										:key="option.id">
										{{option.name}}
									</li>
								</ul>
							</td>
							<td 
								v-if="user"
								class="align-middle">
								{{order.user.first_name}} {{order.user.last_name}}
							</td>
							<td 
								v-if="user"
								class="align-middle">
								{{order.user.email}}
							</td>
							<td 
								v-if="user"
								class="align-middle">
								{{formatPhone(order.user.phone)}}
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div 
				class="col-xs-12"
				v-show="lastPage > 1">
				<pagination 
					:passedPage="page" 
					:numPages="lastPage" 
					@activePageChange="changePage">
				</pagination>
			</div>
		</div>

		<div 
			class="row"
			v-show="loading">
			<div class="col-xs-12 relative-block">
				<loading-screen 
					:show="loading">
				</loading-screen>
			</div>
		</div>

		<div 
			class="row"
			v-show="!loading && !orders.length">
			<div class="col-xs-12">
				<no-results 
					:custom="noResults"
					:show="noResults" 
					:text="noResults">
				</no-results>
			</div>
		</div>

	</div>
</template>

<script>
import AnalyticsFunctions from '@/controllers/Analytics'
import NoResults from '@/components/modules/NoResults'
import PageResults from '@/components/modules/PageResults'
import Pagination from '@/components/modules/Pagination'
import LoadingScreen from '@/components/modules/LoadingScreen'
import ajaxErrorHandler from '../../../controllers/ErrorController'

export default {
	components: {
		'no-results': NoResults,
		'page-results': PageResults,
		'loading-screen': LoadingScreen,
		'pagination': Pagination
	},
	data: function () {
		return {
			// search filters
			locationId: '',
			fromDate: '',
			toDate: '',
			orderId: '',
			// results contents
			orderItems: 0,
			orderItemModifier: 0,
			orderModifierOption: 0,
			user: 1,
			location: 1,
			// UI
			loading: false,
			alert: '',
			noResults: 'Search for something',
			validations: {
				locationId: '',
				fromDate: '',
				toDate: '',
				orderId: ''
			},
			// API data
			payload: {},
			stores: this.$root.storeLocations,
			orders: [],
			// pagination
			total: 0,
			lastPage: 1,
			page: 1,
			perPage: 25,
			sortBy: 'DESC'
		}
	},
	methods: {
		/**
		 * To format a phone number
		 * @function
		 * @param {string} phone - The phone number to format
		 * @returns {string} The formatted phone string
		 */
		formatPhone (phone) {
			try {
				let digits = phone.replace(/\D/g, '')
				return digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6)
			} catch (err) {
				return 'n/a'
			}
		},
		changePage (page) {
			if (this.page !== page) {
				this.page = page
				this.searchOrders()
			}
		},
		changePerPage (perPage) {
			if (this.perPage !== perPage) {
				this.page = 1
				this.perPage = perPage
				this.searchOrders()
			}
		},
		/**
		 * To resort the results
		 * @function
		 * @param {string} order - ASC or DESC
		 * @returns {undefined}
		 */
		changeSortBy (order) {
			if (this.sortBy !== order) {
				this.sortBy = order
				this.searchOrders()
			}
		},
		clearError (name) {
			this[name] = ''
		},
		validateData () {
			if (
				!this.fromDate &&
				!this.toDate &&
				!this.locationId &&
				!this.orderId
			) return
			this.searchOrders()
		},
		searchOrders () {
			window.scrollTo(0, 0)
			this.loading = true
			const _this = this
			this.payload = {
				location_id: this.locationId,
				from_date: this.fromDate,
				to_date: this.toDate,
				order_id: this.orderId,

				order_items: this.orderItems,
				order_item_modifier: this.orderItemModifier,
				order_modifier_option: this.orderModifierOption,
				user: this.user,
				location: this.location,

				page: this.page,
				order: this.sortBy,
				per_page: this.perPage
			}

			return AnalyticsFunctions.searchOrders(this.payload).then(response => {
				if (response.code !== 200) {
					throw Error('Something went wrong')
				} else if (response.payload.total === 0) {
					_this.noResults = 'There are no matching orders'
				} else {
					_this.orders = response.payload.data
					_this.total = response.payload.total
					_this.lastPage = response.payload.last_page
				}
			}).catch(reason => {
				if (reason.message === 'The selected order id is invalid.') {
					_this.orders = []
					_this.total = 0
					return
				}
				ajaxErrorHandler({
					reason,
					errorText: 'Something went wrong',
					errorName: 'alert',
					vue: _this
				})
			}).finally(() => {
				_this.loading = false
			})
		}
	}
}
</script>

<style scoped>
.input-width {
	width: 220px;
}
</style>

