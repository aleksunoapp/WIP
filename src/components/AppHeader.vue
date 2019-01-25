<template>
  <header>
    <transition
      name="fade"
      mode="out-in"
    >
      <div
        v-if="$route.name === 'login'"
        key="login"
        class="header"
      >
        <select
          class="select"
          v-model="locale"
        >
          <option
            v-for="language in languages"
            :key="language.culture"
            :value="language.culture"
          >
            {{language.name}}
          </option>
        </select>
        <p
          class="text"
        >
          {{dealer.name}}
        </p>
      </div>
      <div
        v-else
        key="app"
        class="header"
      >
        <menu-buttons />
        <p
          class="text"
          :class="{'uppercase' : $route.name !== 'login'}"
        >
          {{text()}}
        </p>
        <div class="placeholder">
          <transition name="fade">
            <button
              v-if="$route.name === 'services'"
              class="help"
              @click="toggleHelp()"
              aria-label="help"
            >
              <transition name="fade">
                <img
                  v-if="help"
                  class="image"
                  src="@/assets/images/cross.svg"
                  aria-hidden="true"
                >
                <img
                  v-else
                  class="image"
                  src="@/assets/images/question-mark.svg"
                  aria-hidden="true"
                >
              </transition>
            </button>
          </transition>
        </div>
      </div>
    </transition>
  </header>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapState, mapMutations } from 'vuex'
import MenuButtons from '@/components/MenuButtons.vue'

export default Vue.extend({
  name: 'AppHeader',
  components: {
    MenuButtons
  },
  computed: {
    ...mapState([
      'languages',
      'dealer',
      'help',
      'locale'
    ]),
    locale: {
      get () {
        return this.$store.state.locale
      },
      set (code) {
        this.setLocale(code)
        this.$i18n.locale = this.locale
        this.getMetadata()
      }
    }
  },
  methods: {
    toggleHelp () {
      this.help ? this.closeHelp() : this.openHelp()
    },
    text () {
      if (this.$route.name === 'tutorial') {
        return this.$t('how_it_works')
      }
      if (
        this.$route.name === 'glance' ||
        this.$route.name === 'services' ||
        this.$route.name === 'additional' ||
        this.$route.name === 'additional-services' ||
        this.$route.name === 'wait' ||
        this.$route.name === 'wait-services'

      ) {
        return this.$t('recommendations')
      }
      if (
        this.$route.name === 'summary' ||
        this.$route.name === 'additional-summary'
      ) {
        return this.$t('service_summary')
      }
      if (this.$route.name === 'thanks') {
        return this.$t('services_approved')
      }
    },
    ...mapMutations({
      setLocale: 'setLocale',
      openHelp: 'openHelp',
      closeHelp: 'closeHelp'
    }),
    ...mapActions({
      getMetadata: 'getMetadata'
    })
  }
})
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  width: 100%;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 6rem;
}
.select {
  /* styling */
  background-color: white;
  border: none;
  border-radius: 4px;
  display: inline-block;
  font: inherit;
  line-height: 1.5em;
  padding: 0.5em 3.5em 0.5em 1em;

  background-image:
    linear-gradient(45deg, transparent 50%, gray 50%),
    linear-gradient(135deg, gray 50%, transparent 50%),
    linear-gradient(to right, #ccc, #ccc);
  background-position:
    calc(100% - 20px) calc(1em + 2px),
    calc(100% - 15px) calc(1em + 2px),
    calc(100% - 2.5em) 0.5em;
  background-size:
    5px 5px,
    5px 5px,
    1px 1.5em;
  background-repeat: no-repeat;
  /* reset */
  margin: 0;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-appearance: none;
  -moz-appearance: none;
  box-shadow: var(--shadow);
}
.text {
  font-size: 1.5rem;
}
.uppercase {
  text-transform: uppercase;
}
.placeholder {
  width: 6rem;
  .help {
    max-width: 6rem;
    max-height: calc(6rem - 2px);
    padding: 1.5rem;
    border: none;
    background-color: var(--white);
    .image {
      max-width: 100%;
      max-height: 100%;
    }
  }
}
</style>
