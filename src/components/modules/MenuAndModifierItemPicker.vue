<template>
	<tabset 
		:active="activeTab"
	>
		<tab
			header="Menu Items"
			:disabled="menuDisabled"
		>
			<menu-item-picker 
				:previouslySelected="previouslySelected"
				@update="itemsSelected">
			</menu-item-picker>
		</tab>
		<tab
			header="Modifier Items"
			:disabled="modifierDisabled"
		>
			<modifier-item-picker
				:previouslySelected="previouslySelected"
				@update="itemsSelected"
			>
			</modifier-item-picker>
		</tab>
	</tabset>
</template>
<script>
import Tab from '@/components/modules/Tab'
import Tabset from '@/components/modules/Tabset'
import MenuItemPicker from '@/components/modules/MenuItemPicker'
import ModifierItemPicker from '@/components/modules/ModifierItemPicker'

export default {
	name: 'MenuAndModifierItemPicker',
	components: {
		Tab,
		Tabset,
		MenuItemPicker,
		ModifierItemPicker
	},
	props: {
		previouslySelected: {
			type: Array,
			default: () => [],
			required: false
		},
		menuDisabled: {
			type: Boolean,
			default: () => false,
			required: false
		},
		modifierDisabled: {
			type: Boolean,
			default: () => false,
			required: false
		}
	},
	data: () => ({
		activeTab: 0,
		original: new Set(),
		added: new Set(),
		removed: new Set()
	}),
	created () {
		if (this.previouslySelected.length) {
			this.original = new Set(this.previouslySelected)
		}
		if (this.menuDisabled && !this.modifierDisabled) {
			this.activeTab = 1
		}
	},
	methods: {
		/**
		 * To update selection of items
		 * @function
		 * @param {array} items - Array of items selected by user
		 * @returns {undefined}
		 */
		itemsSelected (items) {
			console.log({items})
			const emitted = new Set(items.map(item => item.sku))
			console.log({emitted})

			this.added = this.difference(emitted, this.original)
			console.log(this.added)

			const previous = this.difference(emitted, this.added)
			console.log({previous})

			const removed = this.difference(this.original, previous)
			console.log({removed})
			this.removed = this.union(removed, this.removed)
			console.log(this.removed)

			const current = this.difference(this.union(this.original, this.added), this.removed)

			console.log({current})
			this.$emit('update', [...current])
		},
		/**
		 * To calculate union of two sets
		 * @function
		 * @param {set} setA - First set
		 * @param {set} setB - Second set
		 * @returns {undefined}
		 */
		union (setA, setB) {
			var _union = new Set(setA)
			for (var elem of setB) {
				_union.add(elem)
			}
			return _union
		},
		/**
		 * To calculate difference of two sets
		 * @function
		 * @param {set} setA - Set to deduct from
		 * @param {set} setB - Set to deduct
		 * @returns {undefined}
		 */
		difference (setA, setB) {
			var _difference = new Set(setA)
			for (var elem of setB) {
				_difference.delete(elem)
			}
			return _difference
		}
	}
}
</script>
