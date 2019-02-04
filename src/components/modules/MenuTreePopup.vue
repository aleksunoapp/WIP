<template>
  <div class="row">
    <div
      v-show="!showApplyToLocationsModal"
      class="col-md-4"
    >
      <h4>Menus</h4>
      <div
        v-if="menus.length"
        id="nestable_list_1"
        class="dd"
      >
        <ol class="dd-list">
          <li
            v-for="menu in menus"
            :key="menu.id"
            class="dd-item"
            :data-id="menu.id"
            @click="selectMenu(menu)"
          >
            <div
              class="dd-handle"
              :class="{'active': menu.id === activeMenu.id}"
            >
              {{ menu.name }}
              <span class="pull-right">
                <i class="fa fa-chevron-right" />
              </span>
            </div>
          </li>
        </ol>
      </div>
      <div v-else>
        <div class="alert alert-warning">
          <span>There are no menus to display.</span>
        </div>
      </div>
    </div>
    <div
      v-if="isMenuSelected"
      v-show="!showApplyToLocationsModal"
      class="col-md-4"
    >
      <h4>{{ activeMenu.name }} - Categories</h4>
      <div
        v-if="categories.length"
        id="nestable_list_2"
        class="dd"
      >
        <ol class="dd-list">
          <li
            v-for="category in categories"
            :key="category.id"
            class="dd-item"
            :data-id="category.id"
            @click="selectCategory(category)"
          >
            <div
              class="dd-handle"
              :class="{'active': category.id === activeCategory.id}"
            >
              {{ category.name }}
              <span class="pull-right">
                <i class="fa fa-chevron-right" />
              </span>
            </div>
          </li>
        </ol>
      </div>
      <div v-else>
        <div class="alert alert-warning">
          <span>There are no categories in the menu '{{ activeMenu.name }}'.</span>
        </div>
      </div>
    </div>
    <div
      v-if="isCategorySelected"
      v-show="!showApplyToLocationsModal"
      class="col-md-4"
    >
      <h4>
        <input
          v-model="selectAllSelected"
          type="checkbox"
          class="md-check"
          @change="selectAll()"
        > {{ activeCategory.name }} - Items
      </h4>
      <div
        v-if="items.length"
        id="nestable_list_3"
        class="dd"
      >
        <ol class="dd-list">
          <li
            v-for="item in items"
            :key="item.id"
            class="dd-item"
            :data-id="item.id"
          >
            <div class="dd-handle">
              <span class="pull-left">
                <input
                  :id="'item_checkbox_' + item.id"
                  v-model="item.selected"
                  type="checkbox"
                  class="md-check"
                >&emsp;
                <label :for="'item_checkbox_' + item.id">
                  {{ item.name }}
                </label>
              </span>
            </div>
          </li>
        </ol>
      </div>
      <div v-else>
        <div class="alert alert-warning">
          <span>There are no items in the category '{{ activeCategory.name }}'.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
	name: 'MenuTreePopup',
	props: {},
	data: function() {
return {};
},
	methods: {}
}
</script>
