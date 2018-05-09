<template>
	<li>
		<div :class="{bold: isFolder}" @click="toggle">
			<input v-if="model.show_checkbox" type="checkbox" :id="'item_checkbox_' + model.id" class="md-check" v-model="model.selected">
			<i v-if="!open" class="fa fa-folder" :class="{'font-green': model.font === 'font-green', 'font-yellow': model.font === 'font-yellow', 'font-red': model.font === 'font-red'}"></i>
			<i v-else class="fa fa-folder-open" :class="{'font-green': model.font === 'font-green', 'font-yellow': model.font === 'font-yellow', 'font-red': model.font === 'font-red'}"></i>
			{{ model.name }}
		</div>
	    <ul v-show="open" v-if="isFolder">
	      	<tree-view class="item" v-for="model in model.children" :model="model"></tree-view>
	    </ul>
	</li>
</template>

<script>
export default {
	name: 'tree-view',
	data () {
		return {
			open: false
		}
	},
	props: {
		model: {
			type: Object
		}
	},
	computed: {
		isFolder () {
			return this.model.children && this.model.children.length
		}
	},
	methods: {
		toggle () {
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
