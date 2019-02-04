<template>
	<div>

		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<h1 class="page-title">Location Items</h1>

		<div class="note note-info">
			<p>View all Menu Items of a location.</p>
		</div>

		<div v-if="$root.activeLocation.id === undefined">
			<div class="row">
				<div class="col-md-12">
					<div class="alert alert-info center margin-top-20">
						<h4>No Store Selected</h4>
						<p>Please select a store from the stores panel on the right</p>
					</div>
				</div>
			</div>
		</div>

		<div v-else>
			<div class="portlet light portlet-fit bordered margin-top-20">
				<div class="portlet-title bg-blue-chambray">
					<div class="menu-image">
						<img src="../../../../public/client_logo.png">
					</div>
					<div class="caption">
						<span class="caption-subject font-default bold uppercase">Location Items</span>
						<div class="caption-desc font-grey-cascade">View all Menu Items for {{$root.activeLocation.display_name}}</div>
					</div>
				</div>
				<div class="portlet-body relative-block">

					<div class="row">
						<div class="col-xs-12">
							<div class="alert alert-danger text-center"
							     v-show="errorMessage"
							     ref="errorMessage">
								<button class="close"
								        @click.prevent="clearError('errorMessage')"></button>
								<span>{{errorMessage}}</span>
							</div>
						</div>
					</div>

					<loading-screen :show="loadingItems"
					                color="#2C3E50"
					                display="inline">
					</loading-screen>

					<no-results :show="!loadingItems && !items.length">
					</no-results>

					<div class="mt-element-list margin-top-15"
					     v-if="items.length">
						<div class="mt-list-container list-news ext-1 no-border">
							<ul>
								<li v-for="item in items"
								    class="mt-list-item margin-top-15"
								    :key="item.id">

									<div class="list-thumb">
										<a v-if="item.image_url.length">
											<img alt=""
											     :src="item.image_url" />
										</a>
										<a v-else>
											<img src="../../../assets/img/app/image-placeholder.png">
										</a>
									</div>

									<div class="list-datetime bold uppercase font-red">
										<span>{{ item.name }}</span>
									</div>

									<div class="row height-mod">
										<div class="col-md-4">
											<strong>Price:</strong>
											<span>{{ item.price }}</span><br>
											<strong>SKU:</strong>
											<span>{{ item.sku }}</span><br>
											<strong>Status:</strong>
											<span v-if="item.status == 1">Available</span>
											<span v-if="item.status == 0">Sold Out</span><br>
										</div>
										<div class="col-md-4">
											<strong>Description:</strong>
											<span>{{ item.desc }}</span>
										</div>
									</div>

								</li>
							</ul>
						</div>
					</div>

				</div>
			</div>
		</div>

	</div>
</template>

<script>
import Breadcrumb from '@/components/modules/Breadcrumb'
import LoadingScreen from '@/components/modules/LoadingScreen'
import NoResults from '@/components/modules/NoResults'
import ItemsFunctions from '@/controllers/Items'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	name: 'LocationItems',
	data: () => ({
		breadcrumbArray: [
			{ name: 'Menu Manager', link: false },
			{ name: 'Location Items', link: false }
		],
		errorMessage: '',
		loadingItems: false,
		items: []
	}),
	watch: {
		'$root.activeLocation'() {
			this.getAllItemsOfLocation()
		}
	},
	mounted() {
		this.getAllItemsOfLocation()
	},
	methods: {
		/**
		 * To clear an error
		 * @function
		 * @param {string} name - Name of the error variable to clear
		 * @returns {object} - A network call promise
		 */
		clearError(name) {
			this[name] = ''
		},
		/**
		 * To fetch items for the current active location
		 * @function
		 * @returns {object} - A network call promise
		 */
		getAllItemsOfLocation() {
			if (this.$root.activeLocation.id === undefined) return
			const locationItemsVue = this
			this.loadingItems = true
			this.items = []

			return ItemsFunctions.getAllItemsOfLocation(this.$root.activeLocation.id)
				.then(response => {
					locationItemsVue.items = response.payload
					locationItemsVue.loadingItems = false
				})
				.catch(reason => {
					locationItemsVue.loadingItems = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch items',
						errorName: 'errorMessage',
						vue: locationItemsVue
					})
				})
		}
	},
	components: {
		LoadingScreen,
		NoResults,
		Breadcrumb
	}
}
</script>

<style scoped>
.mt-element-list .list-news.ext-1.mt-list-container ul > .mt-list-item:hover {
  background-color: #fff;
}
</style>

