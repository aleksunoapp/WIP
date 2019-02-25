<template>
  <div class="permissions-picker">
    <table class="table">
      <thead>
        <tr>
          <th />
          <th> Permission </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="permission in currentActivePermissions"
          :key="permission.id"
        >
          <td class="fit-to-content">
            <div class="md-checkbox has-success">
              <input
                :id="`${instanceId}-${permission.id}`"
                v-model="permission.selected"
                type="checkbox"
                class="md-check"
                @change="permissionsSelected()"
              >
              <label :for="`${instanceId}-${permission.id}`">
                <span class="inc" />
                <span class="check" />
                <span class="box" />
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
          <input
            id="form_control_permissions_search"
            ref="newRoleName"
            v-model="permissionsSearchQuery"
            type="text"
            class="form-control input-sm"
            :class="{'edited': permissionsSearchQuery.length}"
          >
          <label for="form_control_permissions_search">
            Search permissions
          </label>
        </div>
      </div>
      <div class="half-width">
        <pagination
          class="pull-left"
          :passed-page="permissionsPage"
          :num-pages="Math.ceil(permissionsSearchResults.length / 10)"
          @activePageChange="changePermissionsPage"
        />
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
  name: 'PermissionsPicker',
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
      return this.permissionsSearchResults.slice(
        (this.permissionsPage - 1) * 10,
        this.permissionsPage * 10
      )
    }
  },
  created () {
    this.getAllPermissions()
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
      let selected = this.permissions
        .filter(permission => permission.selected)
        .map(permission => permission.id)
      this.$emit('selected', selected)
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
    getAllPermissions () {
      this.loadingPermissions = true
      var permissionsVue = this
      return PermissionsFunctions.getAllPermissions()
        .then(response => {
          permissionsVue.permissions = response.payload.map(permission => {
            return {
              ...permission,
              selected: permissionsVue.previouslySelected.includes(
                permission.id
              )
            }
          })
          permissionsVue.loadingPermissions = false
        })
        .catch(reason => {
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
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.fit-to-content {
  width: 1%;
}
.row__wrapper {
  width: 100%;
  display: flex;
  align-items: center;
}
.half-width {
  display: inline-block;
  width: 50%;
  margin-right: 2rem;
}
</style>
