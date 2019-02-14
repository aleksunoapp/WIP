<template>
  <div class="roles-picker">
    <loading-screen :show="loadingRoles" />
    <template v-if="!loadingRoles && !roles.length">
      <p class="text-center">
        There are no roles
      </p>
    </template>
    <template v-else-if="roles.length">
      <div class="column__wrapper">
        <table class="table">
          <thead>
            <tr>
              <th class="fit-to-content" />
              <th> Role </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="role in currentActiveRoles"
              :key="role.id"
            >
              <td class="fit-to-content">
                <div class="md-checkbox has-success">
                  <input
                    :id="`${instanceId}-${role.id}`"
                    v-model="role.selected"
                    type="checkbox"
                    class="md-check"
                    :disabled="!editable"
                    @change="rolesSelected()"
                  >
                  <label :for="`${instanceId}-${role.id}`">
                    <span class="inc" />
                    <span class="check" />
                    <span class="box" />
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
              <input
                id="form_control_roles_search"
                ref="newRoleName"
                v-model="rolesSearchQuery"
                type="text"
                class="form-control input-sm"
                :class="{'edited': rolesSearchQuery.length}"
              >
              <label for="form_control_roles_search">
                Search roles
              </label>
            </div>
          </div>
          <div class="half-width">
            <pagination
              class="pull-left"
              :passed-page="rolesPage"
              :num-pages="Math.ceil(roles.length / 10)"
              @activePageChange="changeRolesPage"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
// components
import LoadingScreen from '@/components/modules/LoadingScreen'
import Pagination from '@/components/modules/Pagination'
// controllers
import RolesFunctions from '@/controllers/Roles'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
  name: 'RolesPicker',
  components: {
    LoadingScreen,
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
          return role.name.toLowerCase().includes(this.rolesSearchQuery.toLowerCase())
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
      this.$emit('selected', selected)
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
          console.log({ reason })
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
  height: 500px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.column__wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.row__wrapper {
  width: 100%;
  display: flex;
  align-items: center;
}
.fit-to-content {
  width: 1%;
}
.half-width {
  display: inline-block;
  width: 50%;
}
</style>
