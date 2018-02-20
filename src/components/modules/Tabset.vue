<template>
	<div>
		<!-- Nav tabs -->
		<ul class="nav" :class="'nav-' + navStyle" role="tablist">
		  	<template v-for="t in headers">
				<li v-if="!t._tabgroup" :class="{active:t.active, disabled:t.disabled}" @click.prevent="select(t)">
			  		<a href="#"><slot name="header">{{t.header}}</slot></a>
				</li>
				<dropdown v-else :text="t.header" :class="{active:t.active}" :disabled="t.disabled">
			  		<li v-for="tab in t.tabs" :class="{disabled:tab.disabled}"><a href="#" @click.prevent="select(tab)">{{tab.header}}</a></li>
				</dropdown>
		  	</template>
		</ul>
		<div class="tab-content">
		  	<slot></slot>
		</div>
  	</div>
</template>

<script>
import dropdown from './Dropdown.vue'

export default {
	components: {
		dropdown
	},
	props: {
		navStyle: {
			type: String,
			default: 'tabs'
		},
		effect: {
			type: String,
			default: 'fadein'
		},
		active: {
			twoWay: true,
			type: Number,
			default: 0
		}
	},
	data () {
		return {
			show: null,
			headers: [],
			tabs: [],
			activeTab: this.active
		}
	},
	created () {
		this._tabset = true
	},
	mounted () {
		this.show = this.tabs[this.activeTab]
	},
	methods: {
		select (tab) {
			if (!tab.disabled) {
				this.activeTab = tab.index
				this.show = this.tabs[this.activeTab]
			}
		}
	},
	watch: {
		active (val) {
			this.show = this.tabs[val]
		}
	}
}
</script>

<style scoped>
.nav-tabs {
  margin-bottom: 15px;
}
</style>
