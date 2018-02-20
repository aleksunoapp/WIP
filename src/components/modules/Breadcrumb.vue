<template>
	<ul class="page-breadcrumb">
		<li v-for="(crumb, index) in crumbs">
			<router-link v-bind:to="crumb.link" v-if="crumb.link">{{crumb.name}}</router-link>
			<span v-if="!crumb.link">{{crumb.name}}</span>
			<i v-if="index != crumbs.length - 1" class="fa fa-circle"></i>
		</li>
	</ul>
</template>

<script>
export default {
	name: 'breadcrumb',
	props: {
		crumbs: {
			default: []
		}
	}
}
</script>
