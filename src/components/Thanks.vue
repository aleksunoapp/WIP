<template>
	<div class="wrapper thanks-page">
		<div class="nissan-logo">
			<img :src="this.$root.meta.topImageUrl">
		</div>
		<div class="regal-nissan-logo">
			<img :src="this.$root.meta.dealerContactInfo.logoUrl">
		</div>
		<div class="login-header">
			<div>
				Thanks for your time.
			</div>
			<div class="ready-box">{{ this.$root.thanksInfo.confirmedMsg }}</div>
			<div class="thanks-confirm-text">
				I will confirm with you when your vehicle is ready.
			</div>
		</div>
		<img class="profile" :src="this.$root.thanksInfo.advisorImageUrl">
		<div class="mechanic-name">
			{{ this.$root.thanksInfo.advisorName }}
		</div>
		<div class="mechanic-title">
			Service Advisor
		</div>
		<div>
			<img :src="this.$root.meta.bottomImageUrl">
		</div>
	</div>
</template>

<script>
export default {
	data () {
		return {}
	},
	created: function () {
		if (localStorage.getItem('verificationCode') === null) {
			this.$router.push({name: 'code'})
			return
		}
	}
}
</script>
