<template>
  <!-- START ASSIGN COUNTRIES -->
  <modal
    ref="assignCountriesModal"
    :show="show"
    effect="fade"
    @closeOnEscape="closeAssignCountriesModal"
  >
    <div
      slot="modal-header"
      class="modal-header"
    >
      <button
        type="button"
        class="close"
        @click="closeAssignCountriesModal()"
      >
        <span>&times;</span>
      </button>
      <h4 class="modal-title center">
        Assign Countries to {{ promotion.name }}
      </h4>
    </div>
    <div
      slot="modal-body"
      class="modal-body"
    >
      <form role="form">
        <div class="row">
          <div class="col-md-12">
            <div
              v-show="assignCountriesErrorMessage.length"
              ref="assignCountriesErrorMessage"
              class="alert alert-danger"
            >
              <button
                class="close"
                data-close="alert"
                @click.prevent="clearError('assignCountriesErrorMessage')"
              />
              <span>{{ assignCountriesErrorMessage }}</span>
            </div>
          </div>
          <loading-screen
            :show="loadingCountries"
            :color="'#2C3E50'"
            :display="'inline'"
          />
          <div
            v-if="!loadingCountries && countries.length"
            class="col-md-12"
          >
            <table class="table">
              <thead>
                <tr>
                  <th class="fit-to-content">
                    <div class="md-checkbox has-success">
                      <input
                        :id="`countries-all`"
                        v-model="allCountriesSelected"
                        type="checkbox"
                        class="md-check"
                      >
                      <label :for="`countries-all`">
                        <span class="inc" />
                        <span class="check" />
                        <span class="box" />
                      </label>
                    </div>
                  </th>
                  <th> Countries </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="country in countries"
                  :key="country.id"
                >
                  <td class="fit-to-content">
                    <div class="md-checkbox has-success">
                      <input
                        :id="`country-${country.id}`"
                        v-model="country.selected"
                        type="checkbox"
                        class="md-check"
                      >
                      <label :for="`country-${country.id}`">
                        <span class="inc" />
                        <span class="check" />
                        <span class="box" />
                      </label>
                    </div>
                  </td>
                  <td> {{ country.name }} </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
    <div
      slot="modal-footer"
      class="modal-footer clear"
    >
      <button
        v-if="
          !$root.permissions['promotions update'] ||
            countries.length === 0
        "
        type="button"
        class="btn blue"
        @click="closeAssignCountriesModal()"
      >
        Close
      </button>
      <button
        v-else
        type="submit"
        class="btn blue"
        :disabled="assigning"
        @click="assignCountriesToPromotion()"
      >
        Save
        <i
          v-show="assigning"
          class="fa fa-spinner fa-pulse fa-fw"
        />
      </button>
    </div>
  </modal>
  <!-- END EDIT -->
</template>

<script>
import LoadingScreen from '@/components/modules/LoadingScreen'
import Modal from '@/components/modules/Modal'
import PromotionsFunctions from '@/controllers/Promotions'
import CountriesFunctions from '@/controllers/Countries'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
  name: 'AssignCountriesToPromotion',
  components: {
    Modal,
    LoadingScreen
  },
  props: {
    promotion: {
      required: true,
      type: Object,
      default: () => ({
        name: '',
        code: ''
      })
    }
  },
  data: () => ({
    show: false,
    loadingCountries: false,
    countries: [],
    assigning: false,
    assignCountriesErrorMessage: ''
  }),
  computed: {
    allCountriesSelected: {
      get () {
        return !this.countries.some(country => !country.selected)
      },
      set (value) {
        this.countries.forEach(country => {
          country.selected = value
        })
      }
    }
  },
  created () {
    this.getCountries()
  },
  mounted () {
    this.show = true
  },
  methods: {
    /**
		 * To get a list of countries.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getCountries () {
      this.countries = []
      var _this = this
      this.loadingCountries = true
      return CountriesFunctions.listCountries()
        .then(response => {
          _this.countries = response.payload.map(country => {
            return {
              ...country,
              selected: false
            }
          })
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch countries',
            errorName: 'assignCountriesErrorMessage',
            vue: _this,
            containerRef: 'assignCountriesModal'
          })
        })
        .finally(() => {
          _this.loadingCountries = false
        })
    },
    /**
		 * To clear the current error.
		 * @function
		 * @param {object} errorMessageName - The error message to be cleared.
		 * @returns {undefined}
		 */
    clearError (errorMessageName) {
      this[errorMessageName] = ''
    },
    /**
		 * To check if countries have been selected
		 * @function
		 * @returns {object} A promise that will validate the input
		 */
    validateCountriesToAssign () {
      var _this = this
      return new Promise(function (resolve, reject) {
        if (!_this.countries.some(country => country.selected)) {
          reject('Select at least one country')
        }
        resolve('Hurray')
      })
    },
    /**
		 * To assign selected countries to a promotion
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    assignCountriesToPromotion () {
      var _this = this
      _this.clearError('assignCountriesErrorMessage')

      return _this
        .validateCountriesToAssign()
        .then(response => {
          _this.assigning = true
          const payload = {
            id: _this.promotion.id,
            countries: _this.countries
              .filter(country => country.selected)
              .map(country => country.id)
          }
          PromotionsFunctions.assignCountriesToPromotion({ ...payload })
            .then(response => {
              _this.closeAssignCountriesModal()
              _this.showAssignCountriesSuccess(response.payload)
            })
            .catch(reason => {
              console.log({ reason })
              ajaxErrorHandler({
                reason,
                errorText: 'We could not assign the countries',
                errorName: 'assignCountriesErrorMessage',
                vue: _this,
                containerRef: 'assignCountriesModal'
              })
            })
            .finally(() => {
              _this.assigning = false
            })
        })
        .catch(reason => {
          _this.assignCountriesErrorMessage = reason
          _this.$scrollTo(_this.$refs.assignCountriesErrorMessage, 1000, {
            container: _this.$refs.assignCountriesModal.$el
          })
        })
    },
    closeAssignCountriesModal () {
      this.$emit('close')
    },
    /**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    showAssignCountriesSuccess (payload = {}) {
      if (payload === null) payload = {}
      let title = 'Success'
      let text = 'The Countries have been saved'
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
  }
}
</script>

<style scoped>
.fit-to-content {
	width: 1%;
}
</style>
