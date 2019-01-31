<template>
	<div>
		<div>
			<h1 class='page-title'>Profile</h1>
			<div class="note note-info">
				<p>View your account information.</p>
			</div>

			<div class="row">
				<div class="col-xs-12">
					<p>Name: {{$root.activeUser.name}}</p>
					<p>Email: {{$root.activeUser.email}}</p>
					<p>Assigned: {{userLocationCount}}
						<span v-if="userLocationCount !== 1">stores</span>
						<span v-else>store</span>
					</p>
					<p>Roles: </p>
					<ul>
						<li v-for="(role, index) in $root.roles"
						    :key="index">{{role.name}}</li>
					</ul>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
export default {
	computed: {
		userLocationCount () {
			let count = this.$root.storeLocations.length
			if (this.$root.activeLocation.id !== undefined) {
				return count + 1
			} else {
				return count
			}
		}
	}
}
</script>
