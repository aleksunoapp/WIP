<template>
	<div class="row">
		<div class="col-md-4"
		     v-show="!showApplyToLocationsModal">
			<h4>Menus</h4>
			<div class="dd"
			     id="nestable_list_1"
			     v-if="menus.length">
				<ol class="dd-list">
					<li class="dd-item"
					    v-for="menu in menus"
					    :data-id="menu.id"
					    @click="selectMenu(menu)"
					    :key="menu.id">
						<div class="dd-handle"
						     :class="{'active': menu.id === activeMenu.id}"> {{ menu.name }}
							<span class="pull-right">
								<i class="fa fa-chevron-right"></i>
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
		<div class="col-md-4"
		     v-if="isMenuSelected"
		     v-show="!showApplyToLocationsModal">
			<h4>{{ activeMenu.name }} - Categories</h4>
			<div class="dd"
			     id="nestable_list_2"
			     v-if="categories.length">
				<ol class="dd-list">
					<li class="dd-item"
					    v-for="category in categories"
					    :data-id="category.id"
					    @click="selectCategory(category)"
					    :key="category.id">
						<div class="dd-handle"
						     :class="{'active': category.id === activeCategory.id}"> {{ category.name }}
							<span class="pull-right">
								<i class="fa fa-chevron-right"></i>
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
		<div class="col-md-4"
		     v-if="isCategorySelected"
		     v-show="!showApplyToLocationsModal">
			<h4><input type="checkbox"
				       @change="selectAll()"
				       class="md-check"
				       v-model="selectAllSelected"> {{ activeCategory.name }} - Items</h4>
			<div class="dd"
			     id="nestable_list_3"
			     v-if="items.length">
				<ol class="dd-list">
					<li class="dd-item"
					    v-for="item in items"
					    :data-id="item.id"
					    :key="item.id">
						<div class="dd-handle">
							<span class="pull-left">
								<input type="checkbox"
								       :id="'item_checkbox_' + item.id"
								       class="md-check"
								       v-model="item.selected">&emsp;
								<label :for="'item_checkbox_' + item.id">{{ item.name }}
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
	name: 'menu-tree-popup',
	props: {},
	data: {},
	methods: {}
}
</script>
