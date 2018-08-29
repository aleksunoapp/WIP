<template>
	<div>
		<!-- BEGIN PAGE BAR -->
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<!-- END PAGE BAR -->
		<!-- BEGIN PAGE TITLE-->
		<h1 class="page-title">Items</h1>
		<!-- END PAGE TITLE-->
		<div class="note note-info">
			<p>View items for category '{{ categoryDetails.name }}'.</p>
		</div>
		<!-- BEGIN CREATE NEW MENU-->
		<div class="portlet box blue-hoki"
		     v-if="$root.permissions['menu_manager menus categories subcategories items create']">
			<div class="portlet-title bg-blue-chambray"
			     @click="toggleCreateItemPanel()">
				<div class="custom tools">
					<a :class="{'expand': !createItemCollapse, 'collapse': createItemCollapse}"></a>
				</div>
				<div class="caption">
					&emsp;Create A New Item
				</div>
			</div>
			<div class="portlet-body"
			     :class="{'display-hide': createItemCollapse}">
				<form role="form"
				      @submit.prevent="addNewCategoryItem()"
				      :disabled="noItemTypes">
					<div class="form-body row">
						<div class="col-md-12">
							<div class="alert alert-danger"
							     v-show="errorMessage"
							     ref="errorMessage">
								<button class="close"
								        data-close="alert"
								        @click.prevent="clearError('errorMessage')"></button>
								<span>{{errorMessage}}</span>
							</div>
							<div class="alert alert-info"
							     v-show="noItemTypes"
							     ref="noItemTypes">
								Menu Items require a tax classification.
								<router-link to="/app/tax_manager/item_types">Create an Item Type in Tax Manager</router-link> before creating a Menu Item.
							</div>
						</div>
						<div class="col-md-12 margin-bottom-20"
						     v-if="$root.activeLocation.is_corporate !== undefined && $root.activeLocation.is_corporate !== 1">
							<button class="btn create-or-edit"
							        @click.prevent="flipCopyCreate"
							        :class="{'blue-chambray' : copyMode, 'blue btn-outline' : !copyMode}">Copy existing</button>
							<button class="btn"
							        @click.prevent="flipCopyCreate"
							        :class="{'blue-chambray' : !copyMode, 'blue btn-outline' : copyMode}">Create new</button>
						</div>
						<div class="col-md-12 margin-bottom-20"
						     v-if="showCorporateItems">
							<div class="col-md-4">
								<h4>Select Menu</h4>
								<div class="dd"
								     id="nestable_list_1"
								     v-if="menus.length">
									<ol class="dd-list">
										<li class="dd-item clickable"
										    v-for="menu in menus"
										    :data-id="menu.id"
										    @click="selectMenu(menu)"
										    :key="menu.id">
											<div class="dd-handle clickable"
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
							     v-if="isMenuSelected">
								<h4>Select Category</h4>
								<div class="dd"
								     id="nestable_list_2"
								     v-if="categories.length">
									<ol class="dd-list">
										<li class="dd-item clickable"
										    v-for="category in categories"
										    :data-id="category.id"
										    @click="selectCategory(category)"
										    :key="category.id">
											<div class="dd-handle clickable"
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
							     v-if="isCategorySelected">
								<h4>Select Item</h4>
								<div class="dd"
								     id="nestable_list_3"
								     v-if="items.length">
									<ol class="dd-list clickable">
										<li class="dd-item clickable"
										    v-for="item in items"
										    :data-id="item.id"
										    @click="copyItem(item)"
										    :key="item.id">
											<div class="dd-handle clickable">
												<span class="pull-left">
													<label class="clickable">{{ item.name }}
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
						<div :class="{'col-md-2' : !imageMode.newMenu, 'col-md-12' : imageMode.newMenu}"
						     v-show="!showCorporateItems">
							<resource-picker @open="toggleImageMode('newMenu', true)"
							                 @close="toggleImageMode('newMenu', false)"
							                 @selected="updateImage"
							                 :imageButton="true"
							                 :imageUrl="newItem.image_url"
							                 class="margin-top-15">
							</resource-picker>
						</div>
						<div class="col-md-5"
						     v-show="!showCorporateItems && !imageMode.newMenu">
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text"
								       class="form-control input-sm"
								       :class="{'edited': newItem.name.length}"
								       id="form_control_2"
								       v-model="newItem.name">
								<label for="form_control_2">Item Name</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text"
								       class="form-control input-sm"
								       :class="{'edited': newItem.desc.length}"
								       id="form_control_2"
								       v-model="newItem.desc">
								<label for="form_control_2">Item Description</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text"
								       class="form-control input-sm"
								       :class="{'edited': newItem.short_description.length}"
								       id="form_control_2"
								       v-model="newItem.short_description">
								<label for="form_control_2">Item Short Description</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text"
								       class="form-control input-sm"
								       :class="{'edited': newItem.price.length}"
								       id="form_control_3"
								       v-model="newItem.price">
								<label for="form_control_3">Item Price</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text"
								       class="form-control input-sm"
								       :class="{'edited': newItem.nutrition_summary.length}"
								       id="form_control_3"
								       v-model="newItem.nutrition_summary">
								<label for="form_control_3">Nutrition Summary</label>
							</div>
						</div>
						<div class="col-md-5"
						     v-show="!showCorporateItems && !imageMode.newMenu">
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="number"
								       class="form-control input-sm"
								       :class="{'edited': newItem.order}"
								       id="form_control_4"
								       v-model="newItem.order">
								<label for="form_control_4">Item Order</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<input type="text"
								       :readonly="SKUreadonly"
								       class="form-control input-sm"
								       :class="{'edited': newItem.sku.length}"
								       id="form_control_5"
								       v-model="newItem.sku">
								<label for="form_control_5">Item SKU</label>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label"
							     v-if="itemTypes.length">
								<label>Item Type:</label><br>
								<el-dropdown trigger="click"
								             @command="updateTaxClass"
								             size="mini"
								             :show-timeout="50"
								             :hide-timeout="50">
									<el-button size="mini">
										{{ newTaxClassLabel }}
										<i class="el-icon-arrow-down el-icon--right"></i>
									</el-button>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item v-for="type in itemTypes"
										                  :command="type.id"
										                  :key="type.id">{{type.name}}</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<label>Type:</label><br>
								<el-dropdown trigger="click"
								             @command="updateItemType"
								             size="mini"
								             :show-timeout="50"
								             :hide-timeout="50">
									<el-button size="mini">
										{{ newItemTypeLabel }}
										<i class="el-icon-arrow-down el-icon--right"></i>
									</el-button>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item command="regular">regular</el-dropdown-item>
										<el-dropdown-item command="custom">custom</el-dropdown-item>
										<el-dropdown-item command="preset">preset</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
							</div>
							<div class="form-group form-md-line-input form-md-floating-label">
								<label>Item Status:</label><br>
								<el-switch v-model="newItem.status"
								           active-color="#0c6"
								           inactive-color="#ff4949"
								           :active-value="1"
								           :inactive-value="0"
								           active-text="Active"
								           inactive-text="Sold Out">
								</el-switch>
							</div>
						</div>
					</div>
					<div class="form-actions right margin-top-20"
					     v-show="!showCorporateItems && !imageMode.newMenu">
						<button type="submit"
						        class="btn blue"
						        :disabled="noItemTypes || creating">
							Create
							<i v-show="creating"
							   class="fa fa-spinner fa-pulse fa-fw">
							</i>
						</button>
					</div>
				</form>
			</div>
		</div>
		<!-- END CREATE NEW MENU-->
		<loading-screen :show="displayItemData"
		                :color="'#2C3E50'"
		                :display="'inline'"></loading-screen>
		<div v-if="$root.activeLocation && $root.activeLocation.id && !displayItemData">
			<div class="portlet light portlet-fit bordered margin-top-20">
				<div class="portlet-title bg-blue-chambray">
					<div class="menu-image">
						<img :src="categoryDetails.image_url">
					</div>
					<div class="caption">
						<span class="caption-subject font-default bold uppercase">{{ categoryDetails.name }}</span>
						<div class="caption-desc font-grey-cascade">{{ categoryDetails.desc }}</div>
					</div>
				</div>
				<div class="portlet-body">
					<div class="row">
						<div class="col-md-12">
							<div class="alert alert-danger"
							     v-show="listErrorMessage"
							     ref="listErrorMessage">
								<button class="close"
								        @click="clearError('listErrorMessage')"></button>
								<span>{{listErrorMessage}}</span>
							</div>
						</div>
					</div>
					<div class="mt-element-list margin-top-15"
					     v-if="categoryItems.length">
						<div class="mt-list-container list-news ext-1 no-border">
							<ul>
								<li v-for="item in categoryItems"
								    class="mt-list-item margin-top-15"
								    :class="{'no-hover-highlight' : expanded === item.id, 'clickable' : expanded !== item.id, 'animated' : animated === `item-${item.id}`}"
								    :id="'item-' + item.id"
								    @click="expandDetails(item)"
								    :key="item.id">
									<div class="margin-bottom-15 actions-on-top">
										<el-tooltip v-if="$root.permissions['menu_manager menus categories subcategories items update']"
										            content="Edit"
										            effect="light"
										            placement="bottom">
											<a class="btn btn-circle btn-icon-only btn-default"
											   @click="displayEditItemModal(item, $event)">
												<i class="fa fa-lg fa-pencil"></i>
											</a>
										</el-tooltip>
										<el-tooltip v-if="$root.permissions['menu_manager menus categories subcategories items read'] && !$root.permissions['menu_manager menus categories subcategories items update']"
										            content="View"
										            effect="light"
										            placement="bottom">
											<a class="btn btn-circle btn-icon-only btn-default"
											   @click="displayEditItemModal(item, $event)">
												<i class="fa fa-lg fa-eye"></i>
											</a>
										</el-tooltip>
										<el-tooltip v-if="$root.permissions['menu_manager menus categories subcategories items update']"
										            content="Images"
										            effect="light"
										            placement="bottom">
											<a class="btn btn-circle btn-icon-only btn-default"
											   @click="openImagesModal(item, $event)">
												<i class="fa fa-lg fa-image"></i>
											</a>
										</el-tooltip>
										<el-tooltip v-if="
												$root.permissions['menu_manager menus categories subcategories items nutrition read'] ||
												$root.permissions['menu_manager menus categories subcategories items nutrition create'] ||
												$root.permissions['menu_manager menus categories subcategories items nutrition update']
											"
										            content="Nutrition Info"
										            effect="light"
										            placement="bottom">
											<a class="btn btn-circle btn-icon-only btn-default"
											   @click="viewNutritionInfo(item, $event)">
												<i class="fa fa-lg fa-heartbeat"></i>
											</a>
										</el-tooltip>
										<el-tooltip v-if="$root.permissions['menu_manager menus categories subcategories items update']"
										            content="Apply To Locations"
										            effect="light"
										            placement="bottom">
											<a class="btn btn-circle btn-icon-only btn-default"
											   @click="displayApplyToLocationsModal(item, $event)">
												<i class="icon-layers"></i>
											</a>
										</el-tooltip>
										<el-tooltip v-if="$root.permissions['menu_manager menus categories subcategories items delete']"
										            content="Delete"
										            effect="light"
										            placement="bottom">
											<a class="btn btn-circle btn-icon-only btn-default"
											   @click="displayDeleteItemModal(item, $event)">
												<i class="fa fa-lg fa-trash"></i>
											</a>
										</el-tooltip>
									</div>
									<div class="list-icon-container"
									     v-show="expanded !== item.id">
										<i :id="'icon-' + item.id"
										   class="fa fa-angle-right"></i>
									</div>
									<div class="list-thumb">
										<a v-if="item.image_url.length">
											<img alt=""
											     :src="item.image_url" />
										</a>
										<a v-else>
											<img src="../../../assets/img/app/image-placeholder.png">
										</a>
									</div>
									<div class="list-datetime bold uppercase font-red">
										<span>{{ item.name }}</span>
									</div>
									<div class="row height-mod">
										<div class="col-md-4">
											<strong>Price:</strong>
											<span>{{ item.price }}</span><br>
											<strong>SKU:</strong>
											<span>{{ item.sku }}</span><br>
											<strong>Status:</strong>
											<span v-if="item.status == 1">Available</span>
											<span v-if="item.status == 0">Sold Out</span><br>
											<strong>Nutrition summary:</strong>
											<span>{{ item.nutrition_summary }}</span><br>
											<strong>Item type:</strong>
											<span>{{ getItemTypeName(item.item_type_id) }}</span>
										</div>
										<div class="col-md-4">
											<strong>Description:</strong>
											<span>{{ item.desc }}</span><br>
											<strong>Short description:</strong>
											<span>{{ item.short_description }}</span>
										</div>
									</div>
									<div class="row"
									     :class="{'mt-list-item-expanded' : expanded === item.id, 'mt-list-item-collapsed' : expanded !== item.id}">
										<div :class="{'col-md-3' : item.type === 'preset', 'col-md-4' : item.type !== 'preset'}">
											<div class="col-md-12">
												<h5 class="inline-block">Modifiers</h5>
											</div>
											<div class="col-md-12">
												<div v-if="item.modifiers && item.modifiers.length">
													<ul class="item-modifier-list">
														<li v-for="modifier in item.modifiers"
														    :key="modifier.id">
															<router-link :to="'/app/menu_manager/modifier_items/' + modifier.id">{{modifier.name}}</router-link>
														</li>
													</ul>
												</div>
												<div class="col-md-12"
												     v-if="!item.modifiers || !item.modifiers.length">
													<p class="grey-text">No modifiers have been applied to this item.</p>
												</div>
												<div class="col-md-12">
													<button v-if="$root.permissions['menu_manager menus categories subcategories items assign modifier']"
													        type="button"
													        class="btn btn-outline btn-xs blue margin-top-10"
													        @click.stop="showModifierModal(item.id, item.modifiers)">
														Add Modifiers
													</button>
												</div>
											</div>
										</div>
										<div :class="{'col-md-3' : item.type === 'preset', 'col-md-4' : item.type !== 'preset'}">
											<div class="col-md-12">
												<h5 class="inline-block">Tags</h5>
											</div>
											<div class="col-md-12">
												<div v-if="item.tags && item.tags.length">
													<ul class="item-modifier-list">
														<li v-for="tag in item.tags"
														    :key="tag.id">
															<span v-show="tag.type === 'may_contain'">may contain</span>
															<span v-show="tag.type === 'contains'">contains</span>
															{{tag.name}}
														</li>
													</ul>
												</div>
												<div class="col-md-12"
												     v-if="!item.tags || !item.tags.length">
													<p class="grey-text">No tags have been applied to this item.</p>
												</div>
												<div class="col-md-12">
													<button v-if="$root.permissions['menu_manager menus categories subcategories items tags update']"
													        type="button"
													        class="btn btn-outline btn-xs blue margin-top-10"
													        @click.stop="showTagsModal(item.id, item.tags)">
														Add Tags
													</button>
												</div>
											</div>
										</div>
										<div :class="{'col-md-3' : item.type === 'preset', 'col-md-4' : item.type !== 'preset'}">
											<div class="col-md-12">
												<h5 class="inline-block">Attributes</h5>
											</div>
											<div class="col-md-12">
												<div v-show="selectedItemAttributes.length">
													<ul class="item-modifier-list">
														<li class="col-md-6"
														    v-for="attribute in selectedItemAttributes"
														    :key="attribute.id">
															{{attribute.name}}
														</li>
													</ul>
												</div>
												<div class="col-md-12"
												     v-show="!selectedItemAttributes.length">
													<p class="grey-text">No attributes have been applied to this item.</p>
												</div>
												<div class="col-md-12">
													<button v-if="$root.permissions['menu_manager menus categories subcategories items update']"
													        type="button"
													        class="btn btn-outline btn-xs blue margin-top-10"
													        @click.stop="showAttributesModal(item)">
														Add Attributes
													</button>
												</div>
											</div>
										</div>
										<div class="col-md-3"
										     v-show="item.type === 'preset'">
											<h5>Preset Settings</h5>
											<ul class="item-modifier-list"
											    v-show="item.preset_item_modifier_item">
												<li v-for="(modifier, index) in item.preset_item_modifier_item"
												    :key="index">
													{{modifier.modifier_item_name}}
													<span v-if="modifier.preset_item_modifier_item_option_item.length > 0">
														(
														<span v-for="(option, index) in modifier.preset_item_modifier_item_option_item"
														      :key="index">{{option.option_item_name}}
															<span v-show="modifier.preset_item_modifier_item_option_item.length - 1 !== index"> | </span>
														</span>)
													</span>
												</li>
											</ul>
											<p class="grey-text"
											   v-show="item.preset_item_modifier_item && !item.preset_item_modifier_item.length">No preset settings yet.</p>
											<button v-if="$root.permissions['menu_manager menus categories subcategories items update']"
											        type="button"
											        class="btn btn-outline btn-xs blue margin-top-10"
											        @click.stop="showPresetModal(item)">
												<span v-if="item.preset_item_modifier_item && !item.preset_item_modifier_item.length">Add</span>
												<span v-else>Edit</span> Preset Settings
											</button>
										</div>
									</div>
								</li>
							</ul>
						</div>
					</div>
					<div class="margin-top-20"
					     v-else>
						<no-results :show="!categoryItems.length"
						            :type="'items'"
						            :custom="true"
						            :text="customText"></no-results>
					</div>
				</div>
			</div>
		</div>
		<div class="margin-top-20"
		     v-if="!displayItemData">
			<no-results :show="!$root.activeLocation || !$root.activeLocation.id"
			            :type="'items'"></no-results>
		</div>

		<edit-item v-if="editItemModalActive"
		           @editItem="editItem"
		           @deactivateEditItemModal="closeEditItemModal">
		</edit-item>

		<delete-item v-if="deleteItemModalActive"
		             :passedItemId="passedItemId"
		             @closeDeleteItemModal="closeDeleteItemModal"
		             @deleteItemAndCloseModal="deleteItemAndCloseModal">
		</delete-item>

		<nutrition-info v-if="displayNutritionModal"
		                :item="selectedItem"
		                @nutritionInfoSaved="nutritionInfoSaved"
		                @deactivateNutritionInfoModal="displayNutritionModal = false">
		</nutrition-info>

		<modifiers-list v-if="displayModifierModal"
		                :appliedModifiers="appliedModifiers"
		                :selectedItemId="selectedItemId"
		                @deactivateModifierModal="closeModifierModal">
		</modifiers-list>

		<tags-list v-if="displayTagsListModal"
		           :appliedTags="appliedTags"
		           :selectedItemId="selectedItemId"
		           @deactivateTagsListModal="closeTagsListModal">
		</tags-list>

		<!-- ASSIGN ITEM ATTRIBUTES START -->
		<modal :show="showAssignItemAttributesModal"
		       effect="fade"
		       @closeOnEscape="closeAssignItemAttributesModal"
		       ref="assignItemAttributesModal">
			<div slot="modal-header"
			     class="modal-header">
				<button type="button"
				        class="close"
				        @click="closeAssignItemAttributesModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Apply Attributes</h4>
			</div>
			<div slot="modal-body"
			     class="modal-body">
				<div class="row"
				     v-show="assignItemAttributesErrorMessage"
				     ref="assignItemAttributesErrorMessage">
					<div class="col-md-12">
						<div class="alert alert-danger">
							<button class="close"
							        @click="clearAttributesError()"></button>
							<span>{{assignItemAttributesErrorMessage}}</span>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-md-12">
						<table class="table">
							<thead>
								<tr>
									<th class="table-column--checkboxes">
										<div class="md-checkbox has-success"
										     @change="selectAllAttributes()">
											<input type="checkbox"
											       id="locations-promocodes"
											       class="md-check"
											       v-model="selectAllAttributesSelected">
											<label for="locations-promocodes">
												<span class="inc"></span>
												<span class="check"></span>
												<span class="box"></span>
											</label>
										</div>
									</th>
									<th> Name </th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="itemAttribute in itemAttributes"
								    :key="itemAttribute.id">
									<td class="table-column--names">
										<div class="md-checkbox has-success">
											<input type="checkbox"
											       class="md-check"
											       v-model="itemAttribute.selected"
											       @change="syncSelectAllAttributes(itemAttribute.selected)"
											       :id="`ia-${itemAttribute.id}`">
											<label :for="`ia-${itemAttribute.id}`">
												<span class="inc"></span>
												<span class="check"></span>
												<span class="box"></span>
											</label>
										</div>
									</td>
									<td> {{ itemAttribute.name }} </td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div slot="modal-footer"
			     class="modal-footer clear">
				<div class="row">
					<div class="col-md-12">
						<button @click="assignItemAttributesToItem()"
						        type="button"
						        class="btn blue pull-right"
						        :disabled="assigningAttributes">
							Save
							<i v-show="assigningAttributes"
							   class="fa fa-spinner fa-pulse fa-fw">
							</i>
						</button>
					</div>
				</div>
			</div>
		</modal>
		<!-- ASSIGN ITEM ATTRIBUTES END -->

		<!-- APPLY TO LOCATIONS START -->
		<modal :show="applyToLocationsModalActive"
		       effect="fade"
		       @closeOnEscape="closeApplyToLocationsModal"
		       ref="applyToLocationsModal">
			<div slot="modal-header"
			     class="modal-header">
				<button type="button"
				        class="close"
				        @click="closeApplyToLocationsModal()">
					<span>&times;</span>
				</button>
				<h4 class="modal-title center">Apply Item To Locations</h4>
			</div>
			<div slot="modal-body"
			     class="modal-body">
				<div class="row"
				     v-show="applyToLocationsErrorMessage"
				     ref="applyToLocationsErrorMessage">
					<div class="col-md-12">
						<div class="alert alert-danger">
							<button class="close"
							        @click="clearLocationsError()"></button>
							<span>{{applyToLocationsErrorMessage}}</span>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-md-12">
						<select-locations-popup @selectedLocations="selectedLocations"
						                        :previouslySelected="locationsToApplyItemTo"
						                        :withButton="false">
						</select-locations-popup>
					</div>
				</div>
			</div>
			<div slot="modal-footer"
			     class="modal-footer clear">
				<div class="row">
					<div class="col-md-12">
						<button @click="applyItemToLocations()"
						        type="button"
						        class="btn blue pull-right"
						        :disabled="applyingItemToLocations">
							Apply
							<i v-show="applyingItemToLocations"
							   class="fa fa-spinner fa-pulse fa-fw">
							</i>
						</button>
					</div>
				</div>
			</div>
		</modal>
		<!-- APPLY TO LOCATIONS END -->

		<!-- ITEM IMAGES START -->
		<item-images v-if="displayImagesModal"
		             :item="selectedItem"
		             @closeImagesModal="closeImagesModal"
		             @closeImagesModalAndUpdate="closeImagesModalAndUpdate">
		</item-images>
		<!-- ITEM IMAGES END -->

		<!-- PRESET SETTINGS START -->
		<preset-settings v-if="displayPresetModal"
		                 :item="itemToSetPresetSettingsFor"
		                 @closePresetModal="closePresetModal"
		                 @closeAndUpdate="closePresetModalAndUpdate">
		</preset-settings>
		<!-- PRESET SETTINGS START -->
	</div>
</template>

<script>
import $ from 'jquery'
import Breadcrumb from '../../modules/Breadcrumb'
import NoResults from '../../modules/NoResults'
import Modal from '../../modules/Modal'
import LoadingScreen from '../../modules/LoadingScreen'
import CategoriesFunctions from '../../../controllers/Categories'
import ItemsFunctions from '../../../controllers/Items'
import ItemAttributesFunctions from '../../../controllers/ItemAttributes'
import EditItem from './Items/EditItem'
import ItemImages from './Items/ItemImages'
import DeleteItem from './Items/DeleteItem'
import NutritionInfo from './Items/NutritionInfo'
import ModifiersList from './Modifiers/ModifiersList'
import TagsList from './Tags/TagsList'
import ResourcePicker from '../../modules/ResourcePicker'
import MenusFunctions from '../../../controllers/Menus'
import ItemTypesFunctions from '../../../controllers/ItemTypes'
import ajaxErrorHandler from '@/controllers/ErrorController'
import SelectLocationsPopup from '../../modules/SelectLocationsPopup'
import PresetSettings from '@/components/app/MenuManager/Items/PresetSettings'

export default {
	data () {
		return {
			breadcrumbArray: [
				{ name: 'Menu Manager', link: false },
				{ name: 'Menus', link: '/app/menu_manager/menus' },
				{
					name: 'Categories',
					link: '/app/menu_manager/categories/' + this.$root.activeMenuId
				},
				{ name: 'Items', link: false }
			],
			editItemModalActive: false,
			deleteItemModalActive: false,
			displayItemData: false,
			displayNutritionModal: false,
			categoryDetails: {},
			categoryItems: [],
			selectedItem: {},
			displayModifierModal: false,
			appliedModifiers: [],
			appliedTags: [],
			selectedItemId: 0,
			displayTagsListModal: false,
			displayCreateTagModal: false,
			customText:
				'There are no items in this category. Click on the button above to add one.',
			errorMessage: '',
			createItemCollapse: true,
			creating: false,
			newItem: {
				category_id: this.$route.params.category_id,
				name: '',
				desc: '',
				short_description: '',
				sku: '',
				image_url: '',
				user_id: this.$root.createdBy,
				status: 1,
				price: '',
				order: null,
				item_type_id: null,
				nutrition_summary: '',
				type: '',
				preset_item_modifier_item: []
			},
			menus: [],
			categories: [],
			items: [],
			isMenuSelected: false,
			selectAllSelected: false,
			isCategorySelected: false,
			activeMenu: {},
			activeCategory: {},
			itemCopied: false,
			copyMode: true,
			expanded: null,
			loadingItemAttributes: false,
			itemAttributes: [],
			assigningAttributes: false,
			itemToAssignItemAttributesTo: {
				id: null,
				name: ''
			},
			showAssignItemAttributesModal: false,
			selectAllAttributesSelected: false,
			assignItemAttributesErrorMessage: '',
			selectedItemAttributes: [],
			animated: null,
			displayImagesModal: false,
			loadingImages: false,
			imagesErrorMessage: '',
			itemImages: [],
			selectedImage: {},
			itemTypes: [],
			applyToLocationsModalActive: false,
			applyToLocationsErrorMessage: '',
			passedItemId: null,
			applyingItemToLocations: false,
			locationsToApplyItemTo: [],
			imageMode: {
				newMenu: false
			},
			noItemTypes: false,
			displayPresetModal: false,
			itemToSetPresetSettingsFor: {
				id: null,
				name: '',
				preset_item_modifier_item: []
			},
			listErrorMessage: ''
		}
	},
	computed: {
		showCorporateItems () {
			if (
				this.$root.activeLocation.is_corporate !== undefined &&
				this.$root.activeLocation.is_corporate !== 1 &&
				!this.itemCopied &&
				this.copyMode
			) {
				return true
			} else {
				return false
			}
		},
		SKUreadonly () {
			if (
				this.$root.activeLocation.is_corporate !== undefined &&
				this.$root.activeLocation.is_corporate === 1
			) {
				return false
			} else if (
				this.$root.activeLocation.is_corporate !== undefined &&
				this.$root.activeLocation.is_corporate !== 1 &&
				!this.copyMode
			) {
				return false
			} else if (
				this.$root.activeLocation.is_corporate !== undefined &&
				this.$root.activeLocation.is_corporate !== 1 &&
				this.copyMode
			) {
				return true
			}
		},
		newTaxClassLabel () {
			if (this.newItem.item_type_id === null) {
				return 'Select'
			} else {
				return this.itemTypes
					.filter(type => type.id === this.newItem.item_type_id)
					.map(type => type.name)[0]
			}
		},
		newItemTypeLabel () {
			if (!this.newItem.type) {
				return 'Select'
			} else {
				return this.newItem.type
			}
		}
	},
	watch: {
		'$root.activeLocation' () {
			this.$router.push({ name: 'Menus' })
		}
	},
	mounted () {
		if (
			this.$root.activeLocation &&
			this.$root.activeLocation.id &&
			this.$route.params.category_id
		) {
			this.getCategoryDetails()
			this.getCategoryItems()
		}
		this.getCorporateMenus()
		this.listItemAttributes()
		this.getItemTypes()
	},
	methods: {
		/**
		 * To get the preset settings of an item.
		 * @function
		 * @param {integer} itemId - The selected item id
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getPresetDetails (itemId) {
			var itemsVue = this
			return ItemsFunctions.getPresetDetails(
				itemId,
				itemsVue.$root.appId,
				itemsVue.$root.appSecret,
				itemsVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						for (var i = 0; i < itemsVue.categoryItems.length; i++) {
							if (itemsVue.categoryItems[i].id === itemId) {
								itemsVue.$set(
									itemsVue.categoryItems[i],
									'preset_item_modifier_item',
									response.payload.preset_item_modifier_item
								)
							}
						}
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not get preset info',
						errorName: 'listErrorMessage',
						vue: itemsVue
					})
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showPresetItemAlert (payload = {}) {
			let title = 'Success'
			let html = `
				<div>
					The Item has been created
					<br/>
					<br/>
					<strong>
						Do you want to add preset settings now?
					</strong>
				</div>`
			let type = 'success'
			let showCancelButton = true
			let confirmButtonText = 'Yes'
			let cancelButtonText = 'No'

			if (payload.pending_approval) {
				title = 'Approval Required'
				html = `
					<div>
						The Item has been sent for approval
					</div>`
				type = 'info'
				showCancelButton = false
				confirmButtonText = 'OK'
			}

			this.$swal({
				title,
				html,
				type,
				showCancelButton,
				confirmButtonText,
				cancelButtonText
			}).then(
				() => {
					if (!payload.pending_approval) {
						this.showPresetModal(payload)
					}
				},
				dismiss => {}
			)
		},

		/**
		 * To display the Preset settings modal
		 * @function
		 * @param {object} item - The item to set Preset Settings for
		 * @returns {undefined}
		 */
		showPresetModal (item) {
			this.itemToSetPresetSettingsFor.id = item.id
			this.itemToSetPresetSettingsFor.name = item.name
			this.itemToSetPresetSettingsFor.modifiers = item.modifiers
			this.itemToSetPresetSettingsFor.preset_item_modifier_item =
				item.preset_item_modifier_item
			this.displayPresetModal = true
		},
		/**
		 * To close the Preset settings modal
		 * @function
		 * @returns {undefined}
		 */
		closePresetModal () {
			this.displayPresetModal = false
		},
		/**
		 * To close the Preset settings modal and update Preset settins
		 * @function
		 * @param {array} updatedSettings - The updated settings
		 * @returns {undefined}
		 */
		closePresetModalAndUpdate ({updatedSettings, payload}) {
			this.categoryItems.forEach(item => {
				if (item.id === this.itemToSetPresetSettingsFor.id) {
					item.preset_item_modifier_item = updatedSettings
				}
			})
			this.displayPresetModal = false
			this.confirmPresetSettings(payload)
			this.itemToSetPresetSettingsFor.id = null
			this.itemToSetPresetSettingsFor.name = ''
			this.itemToSetPresetSettingsFor.preset_item_modifier_item = []
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		confirmPresetSettings (payload = {}) {
			let title = 'Success'
			let text = 'The Preset Settings have been saved'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Preset Settings have been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},
		/**
		 * To update the type field of the new item
		 * @function
		 * @param {string} type - The selected type
		 * @returns {undefined}
		 */
		updateItemType (type) {
			this.newItem.type = type
		},
		/**
		 * To toggle between the open and closed state of the resource picker
		 * @function
		 * @param {string} object - The name of the object the image is for
		 * @param {object} value - The open / closed value of the picker
		 * @returns {undefined}
		 */
		toggleImageMode (object, value) {
			this.imageMode[object] = value
		},
		/**
		 * To apply an Item to selected locations
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		applyItemToLocations () {
			var itemsVue = this
			if (!this.locationsToApplyItemTo.length) {
				this.applyToLocationsErrorMessage =
					'Please select at least one location'
				return
			}

			this.applyingItemToLocations = true
			let payload = {
				item_id: this.passedItemId,
				locations: this.locationsToApplyItemTo
			}
			return ItemsFunctions.applyItemToLocations(
				payload,
				itemsVue.$root.appId,
				itemsVue.$root.appSecret,
				itemsVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						itemsVue.passedItemId = null
						itemsVue.closeApplyToLocationsModal()
						itemsVue.confirmItemsAppliedToLocaions(response.payload)
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not apply the item',
						errorName: 'applyToLocationsErrorMessage',
						vue: itemsVue,
						containerRef: 'applyToLocationsModal'
					})
				})
				.finally(() => {
					itemsVue.applyingItemToLocations = false
				})
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		confirmItemsAppliedToLocaions (payload = {}) {
			let title = 'Success'
			let text = 'The Items have been saved'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The changes have been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},
		/**
		 * To record the selected locations
		 * @function
		 * @param {array} locations - An array of location ids
		 * @returns {undefined}
		 */
		selectedLocations (locations) {
			this.locationsToApplyItemTo = locations
		},
		/**
		 * To clear the error message in modal for applying to locations
		 * @function
		 * @returns {undefined}
		 */
		clearLocationsError () {
			this.applyToLocationsErrorMessage = ''
		},
		/**
		 * To close the modal to copy an item to multiple locations
		 * @function
		 * @returns {undefined}
		 */
		closeApplyToLocationsModal () {
			this.applyToLocationsModalActive = false
			this.passedItemId = null
			this.clearLocationsError()
		},
		/**
		 * To display the modal to copy an item to multiple locations
		 * @function
		 * @param {object} item - The selected item
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		displayApplyToLocationsModal (item, event) {
			event.stopPropagation()
			this.applyToLocationsModalActive = true
			this.passedItemId = item.id
		},
		/**
		 * To view the images of an item.
		 * @function
		 * @param {object} item - The selected item
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		openImagesModal (item, event) {
			event.stopPropagation()
			this.selectedItem = item
			this.displayImagesModal = true
		},
		/**
		 * To close the images modal.
		 * @function
		 * @param {object} item - The selected item
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		closeImagesModal () {
			this.getCategoryItems()
			this.displayImagesModal = false
			this.selectedItem = {}
		},
		/**
		 * To close the images modal and refresh the list of items.
		 * @function
		 * @returns {undefined}
		 */
		closeImagesModalAndUpdate () {
			this.getCategoryItems()
			this.displayImagesModal = false
			this.selectedItem = {}
		},
		/**
		 * To to highlight the recently updated item
		 * @function
		 * @param {integer} id - The id of the item to animate
		 * @returns {undefined}
		 */
		nutritionInfoSaved (id) {
			this.displayNutritionModal = false
			this.animated = `item-${id}`
			var itemsVue = this
			window.setTimeout(() => {
				itemsVue.animated = `item-${id}`
			}, 3000)
		},
		/**
		 * To switch copying an item and creating an item from scratch.
		 * @function
		 * @returns {undefined}
		 */
		flipCopyCreate () {
			this.clearNewItem()
			this.copyMode = !this.copyMode
		},
		/**
		 * To get a list of all menus for the corporate location.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getCorporateMenus () {
			this.menus = []
			var itemsVue = this
			return MenusFunctions.getStoreMenus(
				itemsVue.$root.appId,
				itemsVue.$root.appSecret,
				itemsVue.$root.corporateStoreId
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						itemsVue.menus = response.payload
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch menus',
						errorName: 'listErrorMessage',
						vue: itemsVue
					})
				})
		},
		/**
		 * To set the value of the variable 'activeMenu' as the selected menu object.
		 * @function
		 * @param {object} menu - The selected menu.
		 * @returns {undefined}
		 */
		selectMenu (menu) {
			this.activeMenu = menu
			if (this.isCategorySelected) {
				this.isCategorySelected = false
			}
			this.clearActiveCategory()
			this.getCategoriesForActiveMenu()
		},
		/**
		 * To clear the categories array and also the active category.
		 * @function
		 * @returns {undefined}
		 */
		clearActiveCategory () {
			this.activeCategory = {}
			this.categories = []
		},
		/**
		 * To get a list of all categories for the current active menu.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getCategoriesForActiveMenu () {
			var itemsVue = this
			itemsVue.categories = []
			return CategoriesFunctions.getMenuCategories(
				itemsVue.activeMenu.id,
				itemsVue.$root.appId,
				itemsVue.$root.appSecret,
				itemsVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						itemsVue.categories = response.payload
						itemsVue.isMenuSelected = true
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could fetch categories',
						errorName: 'applyToLocationsErrorMessage',
						vue: itemsVue,
						containerRef: 'applyToLocationsModal'
					})
				})
		},
		/**
		 * To set the value of the variable 'activeCategory' as the selected category object.
		 * @function
		 * @param {object} category - The selected category.
		 * @returns {undefined}
		 */
		selectCategory (category) {
			this.activeCategory = category
			this.getItemsForActiveCategory()
			this.selectAllSelected = false
		},
		/**
		 * To get a list of all item for the current active category.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getItemsForActiveCategory () {
			var itemsVue = this
			itemsVue.items = []
			return ItemsFunctions.getCategoryItemsFull(
				itemsVue.activeCategory.id,
				itemsVue.$root.appId,
				itemsVue.$root.appSecret
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						itemsVue.items = response.payload
						itemsVue.isCategorySelected = true
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could fetch items',
						errorName: 'applyToLocationsErrorMessage',
						vue: itemsVue,
						containerRef: 'applyToLocationsModal'
					})
				})
		},
		/**
		 * To copy item data into the newItem object.
		 * @function
		 * @param {object} item - The selected item
		 * @returns {undefined}
		 */
		copyItem (item) {
			this.newItem.name = item.name
			this.newItem.desc = item.desc
			this.newItem.short_description = item.short_description
			this.newItem.sku = item.sku
			this.newItem.image_url = item.image_url
			this.newItem.status = item.status
			this.newItem.price = item.price
			this.newItem.nutrition_summary = item.nutrition_summary
			this.newItem.order = item.order
			this.newItem.item_type_id = item.item_type_id
			this.newItem.type = item.type || 'custom'
			this.itemCopied = true
			this.newItem.preset_item_modifier_item =
				item.preset_item_modifier_item || []
		},
		/**
		 * To clear the current error.
		 * @function
		 * @returns {undefined}
		 */
		clearError () {
			this.errorMessage = ''
		},
		/**
		 * To set the image to be same as the one emitted by the gallery modal.
		 * @function
		 * @param {object} val - The emitted image object.
		 * @returns {undefined}
		 */
		updateImage (val) {
			this.newItem.image_url = val.image_url
		},
		/**
		 * To toggle the create item panel, initially set to opened
		 * @function
		 * @returns {undefined}
		 */
		toggleCreateItemPanel () {
			this.createItemCollapse = !this.createItemCollapse
		},
		/**
		 * To check if the item data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateItemData () {
			var itemsVue = this
			return new Promise(function (resolve, reject) {
				if (!itemsVue.newItem.name.length) {
					reject('Item name cannot be blank')
				} else if (!itemsVue.newItem.desc.length) {
					reject('Item description cannot be blank')
				} else if (!itemsVue.newItem.short_description.length) {
					reject('Item short description cannot be blank')
				} else if (!itemsVue.newItem.price.length) {
					reject('Item price cannot be blank')
				} else if (!itemsVue.newItem.nutrition_summary.length) {
					reject('Nutrition summary cannot be blank')
				} else if (!$.isNumeric(itemsVue.newItem.order)) {
					reject('Item order should be a number')
				} else if (!itemsVue.newItem.sku.length) {
					reject('Item SKU cannot be blank')
				} else if (!itemsVue.newItem.item_type_id) {
					reject('Select an item type')
				} else if (!itemsVue.newItem.image_url.length) {
					reject('Item image URL cannot be blank')
				} else if (!$.isNumeric(itemsVue.newItem.status)) {
					reject('Item status cannot be blank')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To add the new item to the category and close the modal and redirect to the categories page.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		addNewCategoryItem () {
			var itemsVue = this
			itemsVue.clearError('errorMessage')

			return itemsVue
				.validateItemData()
				.then(response => {
					itemsVue.creating = true
					ItemsFunctions.addNewCategoryItem(
						itemsVue.newItem,
						itemsVue.$root.appId,
						itemsVue.$root.appSecret,
						itemsVue.$root.userToken
					)
						.then(response => {
							if (response.code === 200 && response.status === 'ok') {
								itemsVue.newItem.id = response.payload.new_item_id
								itemsVue.addItem(itemsVue.newItem)
								if (itemsVue.newItem.type === 'preset') {
									itemsVue.showPresetItemAlert(response.payload)
								} else {
									itemsVue.showAlert(response.payload)
								}
								itemsVue.clearNewItem()
							} else {
								itemsVue.errorMessage = response.message
							}
						})
						.catch(reason => {
							ajaxErrorHandler({
								reason,
								errorText: 'We could fetch categories',
								errorName: 'errorMessage',
								vue: itemsVue
							})
						})
						.finally(() => {
							itemsVue.creating = false
						})
				})
				.catch(reason => {
					// If validation fails then display the error message
					itemsVue.errorMessage = reason
					window.scrollTo(0, 0)
					throw reason
				})
		},
		/**
		 * To get the deatils of the category to show the items for.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getCategoryDetails () {
			var itemsVue = this
			CategoriesFunctions.getCategoryDetails(
				itemsVue.$route.params.category_id,
				itemsVue.$root.appId,
				itemsVue.$root.appSecret,
				itemsVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						itemsVue.categoryDetails = response.payload[0]
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch category info',
						errorName: 'listErrorMessage',
						vue: itemsVue
					})
				})
		},
		/**
		 * To get a list of items for the current category.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getCategoryItems () {
			this.displayItemData = true
			var itemsVue = this
			itemsVue.categoryItems = []
			return ItemsFunctions.getCategoryItems(
				itemsVue.$route.params.category_id,
				itemsVue.$root.appId,
				itemsVue.$root.appSecret
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						itemsVue.displayItemData = false
						itemsVue.categoryItems = response.payload.sort(
							(a, b) => a.name > b.name
						)
					} else {
						itemsVue.displayItemData = false
					}
				})
				.catch(reason => {
					itemsVue.displayItemData = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch items',
						errorName: 'listErrorMessage',
						vue: itemsVue
					})
				})
		},
		/**
		 * To expand/collapse the dropdown div under an item.
		 * @function
		 * @param {object} item - The selected item
		 * @returns {undefined}
		 */
		expandDetails (item) {
			if (this.expanded === item.id) return

			const itemsVue = this
			Promise.all([
				itemsVue.getItemDetailsFull(item.id),
				itemsVue.getItemAttributesOfItem(item.id),
				item.type === 'preset' ? itemsVue.getPresetDetails(item.id) : null
			]).then(() => {
				itemsVue.expanded = item.id
			})
			this.itemAttributes.forEach(itemAttribute => {
				itemAttribute.selected = false
			})
		},
		/**
		 * To get the complete details of an item.
		 * @function
		 * @param {integer} itemId - The selected item id
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getItemDetailsFull (itemId) {
			var itemsVue = this
			return ItemsFunctions.getItemDetailsFull(
				itemId,
				itemsVue.$root.appId,
				itemsVue.$root.appSecret
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						for (var i = 0; i < itemsVue.categoryItems.length; i++) {
							if (itemsVue.categoryItems[i].id === itemId) {
								itemsVue.$set(
									itemsVue.categoryItems[i],
									'modifiers',
									response.payload.modifiers
								)
								itemsVue.$set(
									itemsVue.categoryItems[i],
									'tags',
									response.payload.tags
								)
							}
						}
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch item info',
						errorName: 'listErrorMessage',
						vue: itemsVue
					})
				})
		},
		/**
		 * To show the modal to add attributes.
		 * @function
		 * @param {object} item - The Item to assign Item Attributes to
		 * @returns {undefined}
		 */
		showAttributesModal (item) {
			this.itemToAssignItemAttributesTo.id = item.id
			this.itemToAssignItemAttributesTo.name = item.name
			this.showAssignItemAttributesModal = true
		},
		/**
		 * To get a list of Item Attributes.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		listItemAttributes () {
			this.loadingItemAttributes = true
			const itemsVue = this

			return ItemAttributesFunctions.listItemAttributes(
				itemsVue.$root.appId,
				itemsVue.$root.appSecret,
				itemsVue.$root.userToken
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						itemsVue.itemAttributes = response.payload
					} else {
						itemsVue.loadingItemAttributes = false
					}
				})
				.catch(reason => {
					itemsVue.loadingItemAttributes = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch attributes',
						errorName: 'errorMessage',
						vue: itemsVue
					})
				})
		},
		/**
		 * To get the attributes of an item.
		 * @function
		 * @param {integer} itemId - The selected item id
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getItemAttributesOfItem (itemId) {
			this.selectedItemAttributes = []
			var itemsVue = this
			return ItemAttributesFunctions.getItemAttributesOfItem(
				itemsVue.$root.appId,
				itemsVue.$root.appSecret,
				itemsVue.$root.userToken,
				itemId
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						for (let r = 0; r < itemsVue.itemAttributes.length; r++) {
							if (response.payload.itemattributes.length) {
								for (
									let s = 0;
									s < response.payload.itemattributes.length;
									s++
								) {
									let itemAttribute = itemsVue.itemAttributes[r]
									if (
										itemAttribute.id === response.payload.itemattributes[s].id
									) {
										itemAttribute.selected = true
										break
									} else {
										itemAttribute.selected = false
									}
								}
							}
						}
						let notAll = itemsVue.itemAttributes.some(itemAttribute => {
							return itemAttribute.selected === false
						})
						notAll
							? (itemsVue.selectAllAttributesSelected = false)
							: (itemsVue.selectAllAttributesSelected = true)
						itemsVue.selectedItemAttributes = response.payload.itemattributes
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch attributes',
						errorName: 'listErrorMessage',
						vue: itemsVue
					})
				})
		},
		/**
		 * To select all or deselect all
		 * @function
		 * @returns {undefined}
		 */
		selectAllAttributes () {
			for (var i = 0; i < this.itemAttributes.length; i++) {
				this.itemAttributes[i].selected = this.selectAllAttributesSelected
			}
		},
		/**
		 * To sync Select All checkbox
		 * @function
		 * @param {boolean} value - The value of the checkbox
		 * @returns {undefined}
		 */
		syncSelectAllAttributes (value) {
			if (!value) {
				this.selectAllAttributesSelected = false
			} else {
				this.selectAllAttributesSelected = this.itemAttributes.every(
					itemAttribute => {
						return itemAttribute.selected === true
					}
				)
			}
		},
		/**
		 * To assign Item Attributes to the Item
		 * @function
		 * @returns {undefined}
		 */
		assignItemAttributesToItem () {
			this.assigningAttributes = true
			let payload = {
				attribute: []
			}
			this.itemAttributes.forEach(itemAttribute => {
				if (itemAttribute.selected) {
					payload.attribute.push({
						id: itemAttribute.id,
						created_by: itemAttribute.created_by
					})
				}
			})
			const itemsVue = this
			return ItemAttributesFunctions.assignItemAttributesToItem(
				itemsVue.$root.appId,
				itemsVue.$root.appSecret,
				itemsVue.$root.userToken,
				itemsVue.itemToAssignItemAttributesTo.id,
				payload
			)
				.then(response => {
					if (response.code === 200 && response.status === 'ok') {
						let newAttributesArray = []
						this.itemAttributes.forEach(itemAttribute => {
							if (itemAttribute.selected) {
								newAttributesArray.push(itemAttribute)
							}
						})
						this.selectedItemAttributes = newAttributesArray
						itemsVue.closeAssignItemAttributesModal()
						itemsVue.confirmAssignItemAttributes(response.payload)
						itemsVue.resetAssignItemAttributes()
					} else {
						window.scrollTo(0, 0)
						itemsVue.assignItemAttributesErrorMessage =
							'Something went wrong ...'
					}
				})
				.catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not apply the item',
						errorName: 'assignItemAttributesErrorMessage',
						vue: itemsVue,
						containerRef: 'assignItemAttributesModal'
					})
				})
				.finally(() => {
					itemsVue.assigningAttributes = false
				})
		},
		/**
		 * To clear the error.
		 * @function
		 * @returns {undefined}
		 */
		clearAttributesError () {
			this.assignItemAttributesErrorMessage = ''
		},
		/**
		 * To reset assign Item Attributes
		 * @function
		 * @returns {undefined}
		 */
		resetAssignItemAttributes () {
			this.selectAllAttributesSelected = false
			this.itemToAssignItemAttributesTo.id = null
			this.itemToAssignItemAttributesTo.name = ''
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		confirmAssignItemAttributes (payload = {}) {
			let title = 'Success'
			let text = 'The Item Attributes have been saved'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The changes have been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},
		/**
		 * To close the modal to add attributes.
		 * @function
		 * @returns {undefined}
		 */
		closeAssignItemAttributesModal () {
			this.clearAttributesError()
			this.showAssignItemAttributesModal = false
		},
		/**
		 * To display the modal to add items.
		 * @function
		 * @returns {undefined}
		 */
		displayAddItemModal () {
			this.addItemModalActive = true
			this.$router.push(
				'/app/menu_manager/items/' +
					this.$route.params.category_id +
					'/add_item'
			)
		},
		/**
		 * To display the modal to edit items.
		 * @function
		 * @param {object} item - The selected item
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		displayEditItemModal (item, event) {
			event.stopPropagation()
			this.editItemModalActive = true
			this.$router.push(
				'/app/menu_manager/items/' +
					this.$route.params.category_id +
					'/edit_item/' +
					item.id
			)
		},
		/**
		 * To display the modal to delete item.
		 * @function
		 * @param {object} item - The selected item
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		displayDeleteItemModal (item, event) {
			event.stopPropagation()
			this.deleteItemModalActive = true
			this.passedItemId = item.id
		},
		/**
		 * To clear the new item form.
		 * @function
		 * @returns {undefined}
		 */
		clearNewItem () {
			this.newItem = {
				category_id: this.$route.params.category_id,
				name: '',
				desc: '',
				short_description: '',
				sku: '',
				image_url: '',
				user_id: this.$root.createdBy,
				status: 1,
				price: '',
				order: null,
				item_type_id: null,
				nutrition_summary: '',
				type: 'custom',
				preset_item_modifier_item: []
			}
			this.itemCopied = false
		},
		/**
		 * To add the item emitted by the child to the items list.
		 * @function
		 * @param {object} val - The new item
		 * @returns {undefined}
		 */
		addItem (val) {
			if (parseInt(val.order) > 0) {
				var done = false
				for (var i = 0; i < this.categoryItems.length; i++) {
					if (parseInt(this.categoryItems[i].order) < parseInt(val.order)) {
						this.categoryItems.splice(i, 0, val)
						done = true
						break
					}
				}
				if (!done) {
					this.categoryItems.push(val)
				}
			} else {
				this.categoryItems.push(val)
			}
		},
		/**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
		showAlert (payload = {}) {
			let title = 'Success'
			let text = 'The Item has been created'
			let type = 'success'

			if (payload.pending_approval) {
				title = 'Approval Required'
				text = 'The Item has been sent for approval'
				type = 'info'
			}

			this.$swal({
				title,
				text,
				type
			})
		},
		/**
		 * To update the item emitted by the child and highlist it on the items list.
		 * @function
		 * @param {object} val - The updated item
		 * @returns {undefined}
		 */
		editItem (val) {
			this.getItemDetailsFull(val.id)
			if (val.type === 'preset') {
				this.getPresetDetails(val.id)
			}
			this.editItemModalActive = false
			for (let i = 0; i < this.categoryItems.length; i++) {
				if (this.categoryItems[i].id === val.id) {
					this.categoryItems.splice(i, 1)
					break
				}
			}
			var done = false
			for (let i = 0; i < this.categoryItems.length; i++) {
				if (
					parseInt(this.categoryItems[i].order) < parseInt(val.order) ||
					(parseInt(this.categoryItems[i].order) === parseInt(val.order) &&
						parseInt(this.categoryItems[i].id) > parseInt(val.id))
				) {
					this.categoryItems.splice(i, 0, val)
					done = true
					break
				}
			}
			if (!done) {
				this.categoryItems.push(val)
			}
			this.categoryItems.sort((a, b) => a.name > b.name)
			setTimeout(function () {
				$('#item-' + val.id).addClass('highlight')
				setTimeout(function () {
					$('#item-' + val.id).removeClass('highlight')
				}, 2000)
			}, 10)
		},
		/**
		 * To close the modal to edit an item.
		 * @function
		 * @returns {undefined}
		 */
		closeEditItemModal () {
			this.editItemModalActive = false
		},
		/**
		 * To close the modal to delete an item.
		 * @function
		 * @returns {undefined}
		 */
		closeDeleteItemModal () {
			this.deleteItemModalActive = false
		},
		/**
		 * To close the modal to delete an item.
		 * @function
		 * @returns {undefined}
		 */
		deleteItemAndCloseModal () {
			this.deleteItemModalActive = false
			for (var i = 0; i < this.categoryItems.length; i++) {
				if (
					parseInt(this.categoryItems[i].id) === parseInt(this.passedItemId)
				) {
					this.categoryItems.splice(i, 1)
					break
				}
			}
		},
		/**
		 * To view the nutrition info of an item.
		 * @function
		 * @param {object} item - The selected item
		 * @param {object} event - The click event that prompted this function.
		 * @returns {undefined}
		 */
		viewNutritionInfo (item, event) {
			event.stopPropagation()
			this.displayNutritionModal = true
			this.selectedItem = item
		},
		/**
		 * To display the modal that lists all available modifiers.
		 * @function
		 * @param {integer} itemId - The selected item id
		 * @param {object} appliedModifiers - The modifiers already applied to the item.
		 * @returns {undefined}
		 */
		showModifierModal (itemId, appliedModifiers) {
			this.appliedModifiers = appliedModifiers
			this.selectedItemId = itemId
			this.displayModifierModal = true
		},
		/**
		 * To close the modifier modal.
		 * @function
		 * @param {object} val - The selected item
		 * @returns {undefined}
		 */
		closeModifierModal (val) {
			this.displayModifierModal = false
			this.getItemDetailsFull(val)
		},
		/**
		 * To display the modal to create new tags.
		 * @function
		 * @param {integer} itemId - The selected item id
		 * @param {object} appliedTags - The tags already applied to the item.
		 * @returns {undefined}
		 */
		showTagsModal (itemId, appliedTags) {
			this.appliedTags = appliedTags
			this.selectedItemId = itemId
			this.displayTagsListModal = true
		},
		/**
		 * To close the tags modal and update the item to show the updated tags.
		 * @function
		 * @param {integer} val - The id of the item to which the tags were applied
		 * @returns {undefined}
		 */
		closeTagsListModal (val) {
			this.displayTagsListModal = false
			this.getItemDetailsFull(val)
		},
		/**
		 * To get a list of all item types.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getItemTypes () {
			var _this = this
			let payload = { location_id: this.$root.activeLocation.id }
			return ItemTypesFunctions.getItemTypes(
				payload,
				_this.$root.appId,
				_this.$root.appSecret,
				_this.$root.userToken
			)
				.then(response => {
					_this.itemTypes = response.payload
					if (response.payload.length === 0) {
						this.noItemTypes = true
					}
				})
				.catch(reason => {
					_this.loadingItemTypes = false
					ajaxErrorHandler({
						reason,
						errorText: 'We could not fetch the list of item types',
						errorName: 'errorMessage',
						vue: _this
					})
				})
		},
		/**
		 * To update the item_type_id field of the new item
		 * @function
		 * @param {integer} id - The selected id
		 * @returns {undefined}
		 */
		getItemTypeName (id) {
			if (!id || !this.itemTypes.length) {
				return 'n/a'
			} else {
				return this.itemTypes
					.filter(type => type.id === id)
					.map(type => type.name)[0]
			}
		},
		/**
		 * To update the item_type_id field of the new item
		 * @function
		 * @param {integer} id - The selected id
		 * @returns {undefined}
		 */
		updateTaxClass (id) {
			this.newItem.item_type_id = id
		}
	},
	components: {
		Breadcrumb,
		Modal,
		LoadingScreen,
		EditItem,
		DeleteItem,
		NutritionInfo,
		ModifiersList,
		TagsList,
		NoResults,
		ResourcePicker,
		ItemImages,
		SelectLocationsPopup,
		PresetSettings
	}
}
</script>
<style scoped>
.actions-on-top {
  margin-top: -5px;
}
.grey-text {
  color: rgb(128, 128, 128);
  font-weight: 200;
  margin-bottom: 0;
}
.mt-list-item-collapsed {
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition: max-height 0.2s ease-out, opacity 0.1s ease-out;
}
.mt-list-item-expanded {
  max-height: 100%;
  opacity: 1;
  transition: max-height 0.2s ease-in, opacity 0.5s ease-in;
}
.mt-element-list
  .list-news.ext-1.mt-list-container
  ul
  > .mt-list-item.no-hover-highlight:hover,
.mt-element-list
  .list-news.ext-2.mt-list-container
  ul
  > .mt-list-item.no-hover-highlight:hover {
  background-color: rgb(255, 255, 255);
}
.animated {
  animation: listItemHighlight 1s 3 ease-in-out both;
}
</style>
