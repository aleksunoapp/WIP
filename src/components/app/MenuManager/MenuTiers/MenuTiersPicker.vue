<template>
	<table class="table">
		<thead>
			<th>
				<span class="padding-left-35">
					Tier name
				</span>
			</th>
		</thead>
		<tbody>
			<tr v-for="tier in displayTiers"
			    :key="tier.id">
				<td>
					<div class="md-radio">
						<input type="radio"
						       :id="`${idPrefix}-${tier.id}`"
						       :name="tier.name"
						       class="md-radiobtn"
						       v-model="radioValue"
						       :value="tier.id"
						       @change="tiersSelected">
						<label :for="`${idPrefix}-${tier.id}`">
							<span></span>
							<span class="check"></span>
							<span class="box"></span>
							{{ tier.name }}
						</label>
					</div>
				</td>
			</tr>
		</tbody>
	</table>
</template>
<script>
import MenuTiersFunctions from '@/controllers/MenuTiers.js'
export default {
	name: 'menu-tiers-picker',
	props: {
		radio: {
			required: false,
			default: true
		}
	},
	data: () => ({
		idPrefix: '',
		sourceTiers: [],
		search: '',
		radioValue: null
	}),
	computed: {
		/**
		 * To get filter the list of available tiers through a search term
		 * @function
		 * @returns {array} An array of menu tiers whose names include the search string
		 */
		displayTiers () {
			return this.sourceTiers.filter(tier => {
				return tier.name.includes(this.search)
			})
		}
	},
	created () {
		this.idPrefix = this._uid
		this.getMenuTiers()
	},
	methods: {
		tiersSelected () {
			if (this.radio) {
				this.$emit('tiersSelect', this.radioValue)
			}
		},
		/**
		 * To get a list of menu tiers.
		 * @function
		 * @returns {undefined}
		 */
		getMenuTiers () {
			let pickerVue = this
			MenuTiersFunctions.getMenuTiers(
				pickerVue.$root.corporateStoreId,
				pickerVue.$root.appId,
				pickerVue.$root.appSecret,
				pickerVue.$root.userToken
			)
				.then(response => {
					pickerVue.sourceTiers = response.payload.map(tier => {
						return {
							...tier,
							selected: false
						}
					})
				})
				.catch(reason => {
					this.$emit('fetchError', reason)
				})
		}
	}
}
</script>

<style scoped>
.padding-left-35 {
  padding-left: 35px;
}
</style>
