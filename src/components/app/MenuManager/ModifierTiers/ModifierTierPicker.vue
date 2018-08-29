<template>
	<div>
		<div class="row">
			<div class="col-xs-12">
				<div class="alert alert-danger"
				     v-show="errorMessage.length"
				     ref="errorMessage">
					<button class="close"
					        @click.prevent="clearError('errorMessage')"></button>
					<span>{{errorMessage}}</span>
				</div>
			</div>
		</div>
		<table class="table">
			<thead>
				<tr>
					<th class="th-checkboxes">
						<div class="md-checkbox">
							<input type="checkbox"
							       v-model="selectAllSelected"
							       :id="`select-all`"
							       class="md-check"
							       @change="toggleAll()">
							<label :for="`select-all`">
								<span class="inc"></span>
								<span class="check"></span>
								<span class="box"></span>
							</label>
						</div>
					</th>
					<th class="th-email"> Name </th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="tier in modifierTiers"
				    :key="tier.id">
					<td>
						<div class="md-checkbox">
							<input type="checkbox"
							       v-model="tier.selected"
							       :id="`modifierTier-${tier.id}`"
							       class="md-check"
							       @change="emit()">
							<label :for="`modifierTier-${tier.id}`">
								<span class="inc"></span>
								<span class="check"></span>
								<span class="box"></span>
							</label>
						</div>
					</td>
					<td class="td-email"> {{tier.name}} </td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import ModifierTiersFunctions from '@/controllers/ModifierTiers'
import ajaxErrorHandler from '@/controllers/ErrorController'

export default {
	name: 'ModifierTierPicker',
	data: () => ({
		errorMessage: '',
		modifierTiers: []
	}),
	computed: {
		selectAllSelected() {
			return (
				this.modifierTiers.length &&
				!this.modifierTiers.some(tier => !tier.selected)
			)
		}
	},
	props: {
		previouslySelected: {
			type: Array,
			required: false,
			default: () => []
		}
	},
	created() {
		this.getModifierTiers()
	},
	methods: {
		toggleAll() {
			const selected = this.selectAllSelected
			this.modifierTiers.forEach(tier => {
				tier.selected = !selected
			})
			this.emit()
		},
		clearError(name) {
			this[name] = ''
		},
		getModifierTiers() {
			let pickerVue = this
			return ModifierTiersFunctions.getModifierTiers()
				.then(response => {
					pickerVue.modifierTiers = response.payload.map(tier => {
						return {
							...tier,
							selected: pickerVue.previouslySelected.includes(tier.id)
						}
					})
					pickerVue.loading = false
				})
				.catch(reason => {
					pickerVue.loading = false
					ajaxErrorHandler({
						reason,
						errorName: 'errorMessage',
						errorText: "We couldn't fetch modifier tiers",
						vue: pickerVue
					})
				})
		},
		emit() {
			this.$emit('selected', this.modifierTiers)
		}
	}
}
</script>

