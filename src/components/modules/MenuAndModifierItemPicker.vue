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
				@update="menuItemsSelected">
			</menu-item-picker>
		</tab>
		<tab
			header="Modifier Items"
			:disabled="modifierDisabled"
		>
			<modifier-item-picker
				:previouslySelected="previouslySelected"
				@update="modifierItemsSelected"
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
		modifierItems: {
			added: new Set(),
			removed: new Set()
		},
		menuItems: {
			added: new Set(),
			removed: new Set()
		}
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
		 * To update selection of menu items
		 * @function
		 * @param {array} items - Array of items selected by user
		 * @returns {undefined}
		 */
		menuItemsSelected (items) {
			const emitted = new Set(items.map(item => item.sku))
			this.menuItems.added = this.difference(emitted, this.original)
			const added = this.union(this.menuItems.added, this.modifierItems.added)
			this.menuItems.removed = this.difference(this.original, emitted)
			const removed = this.union(this.menuItems.removed, this.modifierItems.removed)
			const current = this.difference(this.union(this.original, added), removed)
			this.$emit('update', [...current])
		},
		/**
		 * To update selection of modifier items
		 * @function
		 * @param {array} items - Array of items selected by user
		 * @returns {undefined}
		 */
		modifierItemsSelected (items) {
			const emitted = new Set(items.map(item => item.sku))
			this.modifierItems.added = this.difference(emitted, this.original)
			const added = this.union(this.modifierItems.added, this.menuItems.added)
			this.modifierItems.removed = this.difference(this.original, emitted)
			const removed = this.union(this.modifierItems.removed, this.menuItems.removed)
			const current = this.difference(this.union(this.original, added), removed)
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
