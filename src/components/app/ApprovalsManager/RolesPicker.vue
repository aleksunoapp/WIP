<template>
	<div class="roles-picker">
		<table class="table">
			<thead>
				<tr>
					<th></th>
					<th> Role </th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="role in currentActiveRoles"
				    :key="role.id">
					<td>
						<div class="md-checkbox has-success">
							<input type="checkbox"
							       :id="`${instanceId}-${role.id}`"
							       class="md-check"
										 :disabled="!editable"
							       v-model="role.selected"
							       @change="rolesSelected()">
							<label :for="`${instanceId}-${role.id}`">
								<span class="inc"></span>
								<span class="check"></span>
								<span class="box"></span>
							</label>
						</div>
					</td>
					<td> {{ role.name }} </td>
				</tr>
			</tbody>
		</table>
		<div class="row__wrapper">
			<div class="half-width">
				<div class="form-group form-md-line-input form-md-floating-label">
					<input ref="newRoleName"
					       type="text"
					       class="form-control input-sm"
					       id="form_control_roles_search"
					       v-model="rolesSearchQuery"
					       :class="{'edited': rolesSearchQuery.length}">
					<label for="form_control_roles_search">Search roles</label>
				</div>
			</div>
			<div class="half-width">
				<pagination class="pull-left"
				            :passedPage="rolesPage"
				            :numPages="Math.ceil(roles.length / 10)"
				            @activePageChange="changeRolesPage">
				</pagination>
			</div>
		</div>
	</div>
</template>

<script>
// components
import Pagination from '@/components/modules/Pagination'
// controllers
import RolesFunctions from '@/controllers/Roles'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	name: 'roles-picker',
	components: {
		Pagination
	},
	props: {
		previouslySelected: {
			type: Array,
			required: false,
			default: () => []
		},
		editable: {
			type: Boolean,
			required: false,
			default: () => true
		}
	},
	data () {
		return {
			instanceId: '',
			loadingRoles: false,
			roles: [],
			rolesPage: 1,
			rolesSearchQuery: ''
		}
	},
	computed: {
		rolesSearchResults () {
			if (!this.rolesSearchQuery) {
				return this.roles
			} else {
				return this.roles.filter(role => {
					return role.name.includes(this.rolesSearchQuery)
				})
			}
		},
		currentActiveRoles () {
			return this.rolesSearchResults.slice(
				(this.rolesPage - 1) * 10,
				this.rolesPage * 10
			)
		}
	},
	created () {
		this.getRoles()
	},
	mounted () {
		this.instanceId = this._uid
	},
	methods: {
		/**
		 * To update the roles based on the user's selection.
		 * @function
		 * @returns {undefined}
		 */
		rolesSelected () {
			let selected = this.roles
				.filter(role => role.selected)
				.map(role => role.id)
			this.$emit('rolesSelected', selected)
		},
		/**
		 * To update the roles page being displayed.
		 * @function
		 * @param {integer} number - The new page number
		 * @returns {undefined}
		 */
		changeRolesPage (number) {
			this.rolesPage = number
		},
		/**
		 * To get a list of brand admins.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getRoles () {
			this.loadingRoles = true
			var rolesVue = this
			return RolesFunctions.getRoles()
				.then(response => {
					let rolesArray = []
					if (this.$root.roles.some(role => role.name === 'super admin')) {
						rolesArray = response.payload
					} else {
						rolesArray = response.payload.filter(
							role => role.name !== 'super admin'
						)
					}

					rolesVue.roles = rolesArray.map(role => {
						return {
							...role,
							selected: rolesVue.previouslySelected.includes(role.id)
						}
					})
					rolesVue.loadingRoles = false
				})
				.catch(reason => {
					rolesVue.loadingRoles = false
					ajaxErrorHandler({
						reason,
						errorText: 'Could not get roles',
						errorName: 'createErrorMessage',
						vue: rolesVue
					})
				})
		}
	}
}
</script>
<style scoped>
.roles-picker {
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
