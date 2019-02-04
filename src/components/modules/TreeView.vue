<template>
  <li>
    <div
      :class="{bold: isFolder}"
      @click="toggle"
    >
      <input
        v-if="model.show_checkbox"
        :id="'item_checkbox_' + model.id"
        v-model="model.selected"
        type="checkbox"
        class="md-check"
      >
      <i
        v-if="!open"
        class="fa fa-folder"
        :class="{'font-default': model.font === 'font-default', 'font-yellow': model.font === 'font-yellow', 'font-red': model.font === 'font-red'}"
      />
      <i
        v-else
        class="fa fa-folder-open"
        :class="{'font-default': model.font === 'font-default', 'font-yellow': model.font === 'font-yellow', 'font-red': model.font === 'font-red'}"
      />
      {{ model.name }}
    </div>
    <ul
      v-show="open"
      v-if="isFolder"
    >
      <tree-view
        v-for="model in model.children"
        :key="model.id"
        class="item"
        :model="model"
      />
    </ul>
  </li>
</template>

<script>
export default {
	name: 'TreeView',
	props: {
		model: {
			type: Object
		}
	},
	data() {
		return {
			open: false
		}
	},
	computed: {
		isFolder() {
			return this.model.children && this.model.children.length
		}
	},
	methods: {
		toggle() {
			if (this.isFolder) {
				this.open = !this.open
			}
		}
	}
}
</script>
<style scoped>
.item {
  cursor: pointer;
}
.bold {
  font-weight: bold;
}
ul {
  padding-left: 1.5em;
  line-height: 2em;
  list-style-type: none;
}
</style>
