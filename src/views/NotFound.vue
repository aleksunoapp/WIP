<template>
  <div class="container">
    <p>There's nothing here</p>
    <div class="buttons">
      <button
        class="button"
        @click="$router.go(-1)"
      >
        {{$t("go_back")}}
      </button>
      <button
        v-if="slug"
        @click="logIn()"
        class="button"
      >
        {{$t("log_in")}}
      </button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
export default Vue.extend({
  computed: {
    ...mapState([
      'slug'
    ])
  },
  methods: {
    logIn () {
      this.$router.push({ name: 'login', params: { slug: this.slug } })
    }
  }
})
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .buttons {
    display: flex;
    justify-content: center;
    .button {
      margin: 1rem;
      border: none;
      padding: 1rem;
      background-color: var(--white);
      white-space: nowrap;
    }
  }
}
</style>
