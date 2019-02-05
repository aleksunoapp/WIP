<template>
  <div>
    <div class="row">
      <div class="col-xs-12">
        <div
          v-show="errorMessage.length"
          ref="errorMessage"
          class="alert alert-danger"
        >
          <button
            class="close"
            @click.prevent="clearError('errorMessage')"
          />
          <span>{{ errorMessage }}</span>
        </div>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th class="th-checkboxes">
            <div class="md-checkbox">
              <input
                :id="`select-all`"
                type="checkbox"
                :checked="selectAllSelected"
                class="md-check"
                @change="toggleAll()"
              >
              <label :for="`select-all`">
                <span class="inc" />
                <span class="check" />
                <span class="box" />
              </label>
            </div>
          </th>
          <th class="th-email">
            Name
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="category in modifierCategories"
          :key="category.id"
        >
          <td>
            <div class="md-checkbox">
              <input
                :id="`modifierTier-${category.id}`"
                v-model="category.selected"
                type="checkbox"
                class="md-check"
                @change="emit()"
              >
              <label :for="`modifierTier-${category.id}`">
                <span class="inc" />
                <span class="check" />
                <span class="box" />
              </label>
            </div>
          </td>
          <td class="td-email">
            {{ category.name }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ModifiersFunctions from '@/controllers/Modifiers'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
  name: 'ModifierCategoryPicker',
  props: {
    previouslySelected: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data: () => ({
    errorMessage: '',
    modifierCategories: []
  }),
  computed: {
    selectAllSelected () {
      return (
        this.modifierCategories.length &&
				!this.modifierCategories.some(category => !category.selected)
      )
    }
  },
  created () {
    this.getModifierCategories()
  },
  methods: {
    /**
		 * To toggle selection on all
		 * @function
		 * @returns {undefined}
		 */
    toggleAll () {
      const selected = this.selectAllSelected
      this.modifierCategories.forEach(category => {
        category.selected = !selected
      })
      this.emit()
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
		 * To get a list of modifier categories for the current store.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getModifierCategories () {
      let pickerVue = this
      return ModifiersFunctions.getStoreModifiers(
        pickerVue.$root.activeLocation.id
      )
        .then(response => {
          pickerVue.modifierCategories = response.payload.map(category => {
            return {
              ...category,
              selected: pickerVue.previouslySelected.includes(category.id)
            }
          })
          pickerVue.loading = false
        })
        .catch(reason => {
          pickerVue.loading = false
          ajaxErrorHandler({
            reason,
            errorName: 'errorMessage',
            errorText: "We couldn't fetch modifier categories",
            vue: pickerVue
          })
        })
    },
    /**
		 * To emit an updated selection
		 * @function
		 * @returns {undefined}
		 */
    emit () {
      this.$emit('selected', this.modifierCategories)
    }
  }
}
</script>
