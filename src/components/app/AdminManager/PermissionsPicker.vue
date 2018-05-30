<template>
	<div class="permissions-picker">
		<table class="table">
			<thead>
				<tr>
					<th></th>
					<th> Permission </th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="permission in currentActivePermissions" :key="permission.id">
					<td>
						<div class="md-checkbox has-success">
							<input 
								type="checkbox" 
								:id="`${instanceId}-${permission.id}`"
								 class="md-check" 
								 v-model="permission.selected"
								 @change="permissionsSelected()"
							>
							<label :for="`${instanceId}-${permission.id}`">
								<span class="inc"></span>
								<span class="check"></span>
								<span class="box"></span>
							</label>
						</div>
					</td>
					<td> {{ permission.name }} </td>
				</tr>
			</tbody>
		</table>
		<div class="row__wrapper">
			<div class="half-width">
				<div class="form-group form-md-line-input form-md-floating-label">
					<input ref="newRoleName" type="text" class="form-control input-sm" id="form_control_permissions_search" v-model="permissionsSearchQuery" :class="{'edited': permissionsSearchQuery.length}">
					<label for="form_control_permissions_search">Search permissions</label>
				</div>
			</div>
			<div class="half-width">
				<pagination 
					class="pull-left"
					:passedPage="permissionsPage" 
					:numPages="Math.ceil(permissions.length / 10)" 
					@activePageChange="changePermissionsPage">
				</pagination>
			</div>
		</div>
	</div>
</template>

<script>
// components
import Pagination from '@/components/modules/Pagination'
// controllers
import PermissionsFunctions from '@/controllers/Permissions'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	name: 'permissions-picker',
	components: {
		Pagination
	},
	props: {
		previouslySelected: {
			type: Array,
			required: false,
			default: () => []
		}
	},
	data () {
		return {
			instanceId: '',
			loadingPermissions: false,
			permissions: [],
			permissionsPage: 1,
			permissionsSearchQuery: ''
		}
	},
	computed: {
		permissionsSearchResults () {
			if (!this.permissionsSearchQuery) {
				return this.permissions
			} else {
				return this.permissions.filter(permission => {
					return permission.name.includes(this.permissionsSearchQuery)
				})
			}
		},
		currentActivePermissions () {
			return this.permissionsSearchResults.slice((this.permissionsPage - 1) * 10, this.permissionsPage * 10)
		}
	},
	created () {
		this.getPermissions()
	},
	mounted () {
		this.instanceId = this._uid
	},
	methods: {
		/**
		 * To update the permissions of the newRole object based on the user's selection.
		 * @function
		 * @returns {undefined}
		 */
		permissionsSelected () {
			let selected = this.permissions.filter(permission => permission.selected).map(permission => permission.id)
			this.$emit('permissionsSelected', selected)
		},
		/**
		 * To update the permissions page being displayed.
		 * @function
		 * @param {integer} number - The new page number
		 * @returns {undefined}
		 */
		changePermissionsPage (number) {
			this.permissionsPage = number
		},
		/**
		 * To get a list of brand admins.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getPermissions () {
			this.loadingPermissions = true
			var permissionsVue = this
			return PermissionsFunctions.getPermissions()
			.then(response => {
				permissionsVue.permissions = response.payload.map(permission => {
					return {
						...permission,
						selected: permissionsVue.previouslySelected.includes(permission.id)
					}
				})
				permissionsVue.loadingPermissions = false
			}).catch(reason => {
				permissionsVue.loadingPermissions = false
				ajaxErrorHandler({
					reason,
					errorText: 'Could not get permissions',
					errorName: 'createErrorMessage',
					vue: permissionsVue
				})
			})
		}
	}
}
</script>
<style scoped>
.permissions-picker {
	width: 100%;
	display: flex;
	flex-direction: column;
}
.row__wrapper {
	width: 100%;
	display: flex;
	align-items: center;
}
.half-width {
	display: inline-block;
	width: 50%;
}
</style>
