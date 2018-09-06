<template>
	<div>
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<h1 class='page-title'>Delivery</h1>

		<!-- LIST START -->
		<div class="portlet light portlet-fit bordered">
			<div class="portlet-title bg-blue-chambray">
				<div class="menu-image-main">
					<img src="../../../../static/client_logo.png">
				</div>
				<div class="caption">
					<span class="caption-subject font-green bold uppercase">Delivery</span>
					<div class="caption-desc font-grey-cascade">Set up and edit delivery profile.</div>
				</div>
			</div>
			<div class="portlet-body relative-block">
				<div class="alert alert-danger"
				     v-show="errorMessage.length"
				     ref="errorMessage">
					<button class="close"
					        @click="clearError('errorMessage')"></button>
					<span>{{errorMessage}}</span>
				</div>
				<loading-screen :show="loading" />
				<div class="row">
					<div class="col-xs-12">
						<map-area v-if="!loading"
						          :polygons="profiles"
						          width="100%"
						          height="500px"
						          :lat="latitude"
						          :lng="longitude"
						          multi
						          @polygonEmitted="updatePolygons">
						</map-area>
					</div>
				</div>
				<div class="row">
					<div class="col-xs-12">
						<div v-for="(profile, index) in profiles"
						     class="legend-row margin-top-20"
						     :key="index">
							<div class="color-box"
							     :style="`background-color:${profile.color}`">
							</div>
							<div class="input-container">
								<div class="input-label-container">
									<label for="base-fee">
										Base fee
									</label>
									<el-tooltip content="The base fee is applied to every delivery as the starting point."
									            effect="light"
									            placement="right">
										<div class="hint">
											<i class="fa fa-question"
											   aria-hidden="true"></i>
										</div>
									</el-tooltip>
								</div>
								<el-input id="base-fee"
								          placeholder="Please input"
								          v-model="profile.base_fee">
								</el-input>
							</div>
							<div class="input-container">
								<div class="input-label-container">
									<label for="base_km">
										No of base kilometers
									</label>
									<el-tooltip content="The number of kilometers included in the base fee."
									            effect="light"
									            placement="right">
										<div class="hint">
											<i class="fa fa-question"
											   aria-hidden="true"></i>
										</div>
									</el-tooltip>
								</div>
								<el-input id="base_km"
								          placeholder="Please input"
								          v-model="profile.base_km">
								</el-input>
							</div>
							<div class="input-container">
								<div class="input-label-container">
									<label for="additional_perkm">
										Extra per kilometer
									</label>
									<el-tooltip content="Per-kilometer charge for distance in excess of base kilometers."
									            effect="light"
									            placement="right">
										<div class="hint">
											<i class="fa fa-question"
											   aria-hidden="true"></i>
										</div>
									</el-tooltip>
								</div>
								<el-input id="additional_perkm"
								          placeholder="Please input"
								          v-model="profile.additional_perkm">
								</el-input>
							</div>
						</div>
					</div>
				</div>
				<no-results :show="!profiles.length && !loading"
				            :custom="true"
				            text="There are no delivery zones to show. Draw the first one above."></no-results>
				<div class="row"
				     v-if="canAny([
						'stores delivery_profile create', 
						'stores delivery_profile update',
						'stores delivery_profile delete'])">
					<div class="col-xs-12"
					     v-show="!loading && profiles.length">
						<button class="btn blue pull-right"
						        @click="saveDeliveryZones()"
						        :disabled="!modified">
							Save
						</button>
					</div>
				</div>
			</div>
		</div>
		<!-- LIST END -->
	</div>
</template>

<script>
import MapArea from '@/components/modules/MapArea'
import Breadcrumb from '@/components/modules/Breadcrumb'
import LoadingScreen from '@/components/modules/LoadingScreen'
import NoResults from '@/components/modules/NoResults'
import DeliveryFunctions from '@/controllers/Delivery'
import ajaxErrorHandler from '@/controllers/ErrorController'
import { mapGetters } from 'vuex'

export default {
	components: {
		Breadcrumb,
		LoadingScreen,
		NoResults,
		MapArea
	},
	data () {
		return {
			breadcrumbArray: [
				{ name: 'Store Manager', link: false },
				{ name: 'Delivery', link: false }
			],
			loading: false,
			profiles: [],
			profilesBackup: [],
			colors: [],
			errorMessage: ''
		}
	},
	computed: {
		latitude () {
			if (
				this.$root.activeLocation.latitude !== null &&
				this.$root.activeLocation.latitude !== undefined
			) {
				return Number(this.$root.activeLocation.latitude)
			} else {
				return 43.6532
			}
		},
		longitude () {
			if (
				this.$root.activeLocation.longitude !== null &&
				this.$root.activeLocation.longitude !== undefined
			) {
				return Number(this.$root.activeLocation.longitude)
			} else {
				return -79.3832
			}
		},
		modified () {
			if (this.profilesBackup.length !== this.profiles.length) {
				return true
			}

			let modified = false
			for (let i = 0; i < this.profilesBackup.length; i++) {
				const originalProfile = this.profilesBackup[i]
				const newProfile = this.profiles.find(
					profile => profile.id === originalProfile.id
				)

				if (this.compareProfiles(originalProfile, newProfile)) {
					modified = true
					break
				}
			}
			return modified
		},
		...mapGetters(['can', 'canAny'])
	},
	watch: {
		'$root.activeLocation': function () {
			this.getDeliveryZones()
		}
	},
	mounted () {
		this.getDeliveryZones()
	},
	beforeRouteLeave (to, from, next) {
		if (this.modified) {
			this.showUnsavedWarning(next)
		} else {
			next()
		}
	},
	methods: {
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
		 * To update the profiles array with polygon paths from the map
		 * @function
		 * @param {array} polygons - An array of objects containing polygon paths and colors
		 * @returns {undefined}
		 */
		updatePolygons (polygons) {
			let updated = []
			polygons.forEach(polygon => {
				let current = this.profiles.find(
					profile => profile.id === polygon.id
				)
				if (current === undefined) {
					updated.push({
						id: polygon.id,
						location_id: null,
						base_fee: '',
						base_km: '',
						additional_perkm: '',
						color: polygon.color,
						delivery_polygon: polygon.paths
					})
				} else {
					updated.push({
						...current,
						delivery_polygon: polygon.paths,
						color: polygon.color
					})
				}
			})
			this.profiles = updated
		},
		/**
		 * To get details of the delivery profile
		 * @function
		 * @returns {object} - An api network call promise
		 */
		getDeliveryZones () {
			if (this.$root.activeLocation.id === undefined) {
				return
			}
			this.loading = true
			var _this = this
			DeliveryFunctions.getDeliveryProfiles(_this.$root.activeLocation.id)
				.then(response => {
					if (response.code === 200) {
						_this.profiles = response.payload.map(profile => {
							return {
								...profile,
								paths: profile.delivery_polygon
							}
						})
						this.profilesBackup = [..._this.profiles]
					} else {
						throw new Error()
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch delivery zones',
						errorName: 'errorMessage',
						vue: _this
					})
				})
				.finally(() => {
					_this.loading = false
				})
		},
		/**
		 * To compare two delivery profiles
		 * @function
		 * @param {object} originalProfile - Profile to compare to
		 * @param {object} newProfile - Profile to compare
		 * @returns {boolean} - True if there's a difference, false if not
		 */
		compareProfiles (originalProfile, newProfile) {
			let modified = false
			if (newProfile === undefined) {
				modified = true
				return modified
			}

			if (
				String(newProfile.base_fee) !== String(originalProfile.base_fee)
			) {
				modified = true
				return modified
			}
			if (
				String(newProfile.base_km) !== String(originalProfile.base_km)
			) {
				modified = true
				return modified
			}
			if (
				String(newProfile.additional_perkm) !==
				String(originalProfile.additional_perkm)
			) {
				modified = true
				return modified
			}
			if (
				newProfile.delivery_polygon.length !==
				originalProfile.delivery_polygon.length
			) {
				modified = true
				return modified
			}

			for (let j = 0; j < newProfile.delivery_polygon.length; j++) {
				if (
					Number(newProfile.delivery_polygon[j][0]).toFixed(12) !==
					Number(originalProfile.delivery_polygon[j][0]).toFixed(12)
				) {
					modified = true
					break
				}
				if (
					Number(newProfile.delivery_polygon[j][1]).toFixed(12) !==
					Number(originalProfile.delivery_polygon[j][1]).toFixed(12)
				) {
					modified = true
					break
				}
			}

			return modified
		},
		/**
		 * To validate data before making a call
		 * @function
		 * @returns {object} - Promise with a rejection reason
		 */
		validate () {
			const _this = this
			const numberRegex = /^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/
			return new Promise(function (resolve, reject) {
				if (
					_this.profiles.some(
						profile => profile.base_fee.length === 0
					)
				) {
					reject('Base fee cannot be blank')
				} else if (
					_this.profiles.some(
						profile => !numberRegex.test(profile.base_fee)
					)
				) {
					reject('Base fee must be a number')
				} else if (
					_this.profiles.some(profile => profile.base_km.length === 0)
				) {
					reject('Number of base kilometers cannot be blank')
				} else if (
					_this.profiles.some(
						profile => !numberRegex.test(profile.base_km)
					)
				) {
					reject('Number of base kilometers must be a number')
				} else if (
					_this.profiles.some(
						profile => profile.additional_perkm.length === 0
					)
				) {
					reject('Extra per kilometer cannot be blank')
				} else if (
					_this.profiles.some(
						profile => !numberRegex.test(profile.additional_perkm)
					)
				) {
					reject('Extra per kilometer must be a number')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To create a new delivery zone
		 * @function
		 * @param {object} profile - The zone to create
		 * @returns {object} - An api network call promise
		 */
		createDeliveryZone (profile) {
			const _this = this
			return DeliveryFunctions.createDeliveryProfile({
				...profile,
				location_id: _this.$root.activeLocation.id
			})
				.then(response => {
					if (response.code === 200) {
						return response
					} else {
						throw new Error()
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not create the delivery zones',
						errorName: 'errorMessage',
						vue: _this
					})
				})
		},
		/**
		 * To update a delivery zone
		 * @function
		 * @param {object} profile - The zone to update
		 * @returns {object} - An api network call promise
		 */
		updateDeliveryZone (profile) {
			const _this = this
			return DeliveryFunctions.updateDeliveryProfile(profile)
				.then(response => {
					if (response.code === 200) {
						return response
					} else {
						throw new Error()
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not update the delivery zones',
						errorName: 'errorMessage',
						vue: _this
					})
				})
		},
		/**
		 * To delete a delivery zone
		 * @function
		 * @param {object} profile - The zone to delete
		 * @returns {object} - An api network call promise
		 */
		deleteDeliveryZone (profile) {
			const _this = this
			return DeliveryFunctions.deleteDeliveryProfile(profile)
				.then(response => {
					if (response.code === 200) {
						return response
					} else {
						throw new Error()
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not delete the delivery zones',
						errorName: 'errorMessage',
						vue: _this
					})
				})
		},
		/**
		 * To save changes made by the user
		 * @function
		 * @returns {undefined}
		 */
		saveDeliveryZones () {
			var _this = this
			this.validate()
				.then(response => {
					_this.clearError('errorMessage')

					// if new, create
					let toCreate = _this.profiles
						.filter(profile => {
							const originalProfile = _this.profilesBackup.find(
								original => original.id === profile.id
							)
							return originalProfile === undefined
						})
						.map(profile => {
							return _this.createDeliveryZone(profile)
						})

					// if modified, update
					let toUpdate = _this.profiles
						.filter(profile => {
							const originalProfile = _this.profilesBackup.find(
								original => original.id === profile.id
							)
							if (originalProfile === undefined) {
								return false
							} else {
								return _this.compareProfiles(
									originalProfile,
									profile
								)
							}
						})
						.map(profile => {
							return _this.updateDeliveryZone(profile)
						})

					// if removed, delete
					let toDelete = _this.profilesBackup
						.filter(profile => {
							const deletedProfile = _this.profiles.find(
								current => current.id === profile.id
							)
							return deletedProfile === undefined
						})
						.map(profile => {
							return _this.deleteDeliveryZone(profile)
						})

					Promise.all([...toCreate, ...toUpdate, ...toDelete]).then(
						response => {
							let pending = response.filter(
								x => x.payload && x.payload.pending_approval
							)
							if (pending.length) {
								_this.showCreateSuccess(pending[0].payload)
							} else if (response.length) {
								_this.showCreateSuccess(response[0].payload)
							}
						}
					)
				})
				.catch(reason => {
					_this.errorMessage = reason
					_this.$scrollTo(_this.$refs.errorMessage, 1000)
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showCreateSuccess (payload = {}) {
			let title = 'Success'
			let text = 'The Delivery Zones have been saved'
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
		 * To warn user before discarding unsaved changes
		 * @function
		 * @param {object} next - A router callback to navigate to the selected route
		 * @returns {undefined}
		 */
		showUnsavedWarning (next) {
			this.$swal({
				title: 'Discard changes?',
				text: 'Changes you made will not be saved',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Discard',
				cancelButtonText: 'Cancel'
			}).then(
				() => {
					next()
				},
				dismiss => {}
			)
		}
	}
}
</script>

<style scoped>
.legend-row {
	width: 100%;
	display: flex;
	align-items: flex-end;
}
.color-box {
	width: 50px;
	height: 20px;
	margin: 0 10px 10px 0;
}
.input-container {
	display: flex;
	flex-direction: column;
	flex-basis: 20%;
	margin: 0 10px;
}
.input-label-container {
	display: flex;
}
.hint {
	width: 20px;
	height: 20px;
	display: inline-flex;
	justify-content: center;
	align-items: center;
}
</style>
