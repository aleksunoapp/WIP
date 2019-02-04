<template>
  <ul class="page-breadcrumb">
    <li
      v-for="(crumb, index) in crumbs"
      :key="index"
    >
      <router-link
        v-if="crumb.link"
        :to="crumb.link"
      >
        {{ crumb.name }}
      </router-link>
      <span v-if="!crumb.link">
        {{ crumb.name }}
      </span>
      <i
        v-if="index != crumbs.length - 1"
        class="fa fa-circle"
      />
    </li>
  </ul>
</template>

<script>
export default {
	name: 'Breadcrumb',
	props: {
		crumbs: {
			default: []
		}
	}
}
</script>
