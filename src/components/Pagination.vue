<template>
  <nav>
    <ul
      class="list"
    >
      <li
        v-for="i in total"
        :key="i"
        class="item"
        @click.stop="goTo(i)"
      >
        <div
          class="dot"
          :class="{'active' : i === current}"
        />
      </li>
    </ul>
  </nav>
</template>
<script>
import Vue from 'vue'
export default Vue.extend({
  name: 'Pagination',
  props: {
    total: {
      type: Number,
      required: true,
      default: () => 1
    },
    current: {
      type: Number,
      required: true,
      default: () => 1
    }
  },
  methods: {
    goTo (i) {
      this.$emit('page', i)
    }
  }
})
</script>

<style scoped lang="scss">
.list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
}
.item {
  width: 1.5rem;
  height: 1.5rem;
  margin-right: .5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.item:last-child {
  margin-right: 0;
}
.dot {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: var(--grey-pagination);
  transition: all .2s ease-in;
  &.active {
    background-color: var(--blue);
    transition: all .2s ease-out;
  }
}
</style>
