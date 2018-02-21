<template>
	<div>
		<div class="page-bar">
			<breadcrumb v-bind:crumbs="breadcrumbArray"></breadcrumb>
		</div>
		<h1 class='page-title'>Edit {{ storeToBeEdited.display_name || $route.params.store_id }}</h1>
		<div class="note note-info">
            <p>Update the general details, customs and hours of operation for a store.</p>
        </div>
        <tabset class="margin-top-20">
        	<tab header="Store Information">
        		<div class="tab-content">
				    <div class="portlet light bordered">
			            <div class="portlet-body form">
			                <form role="form" @submit.prevent="updateStoreInformation()" novalidate>
			                    <div class="row">
				                    <div class="alert alert-danger" v-show="storeInformationError.length" ref="storeInformationError">
				                        <button class="close" data-close="alert" @click.prevent="clearError('storeInformationError')"></button>
				                        <span>{{storeInformationError}}</span>
				                    </div>
				                    <div class="col-md-6">
				                    	<div class="form-group form-md-line-input form-md-floating-label">
				                    	    <input type="text" class="form-control input-sm edited" id="form_control_1" v-model="storeToBeEdited.name">
				                    	    <label for="form_control_1">Store Name</label>
				                    	</div>
				                    	<div class="form-group form-md-line-input form-md-floating-label">
				                    	    <input type="text" class="form-control input-sm edited" id="form_control_2" v-model="storeToBeEdited.address_line_1" @focus="locationFocus(true)" @blur="locationFocus(false)" autocomplete="off">
				                    	    <label for="form_control_2">Address Line 1</label>
				                    	</div>
				                    	<div v-if="displayLocationsDropdown" class="new-location-search-dropdown">
											<div v-if="!googleSearchResults.length">There are no locations that match your search.</div>
											<div v-for="location in googleSearchResults" @mousedown.prevent="selectLocation(location)" :class="{'active': storeToBeEdited.address_line_1 == location.description}">{{location.description}}</div>
										</div>
				                    	<div class="form-group form-md-line-input form-md-floating-label">
				                    	    <input type="text" class="form-control input-sm edited" id="form_control_3" v-model="storeToBeEdited.address_line_2">
				                    	    <label for="form_control_3">Address Line 2</label>
				                    	</div>
				                    	<div class="form-group form-md-line-input form-md-floating-label">
				                    	    <input type="text" class="form-control input-sm edited" id="form_control_4" v-model="storeToBeEdited.city">
				                    	    <label for="form_control_4">Store City</label>
				                    	</div>
				                    	<div class="form-group form-md-line-input form-md-floating-label">
				                    	    <input type="text" class="form-control input-sm edited" id="form_control_5" v-model="storeToBeEdited.province">
				                    	    <label for="form_control_5">Store Province</label>
				                    	</div>
				                    	<div class="form-group form-md-line-input form-md-floating-label">
				                    	    <input type="text" class="form-control input-sm edited" id="form_control_6" v-model="storeToBeEdited.country">
				                    	    <label for="form_control_6">Store Country</label>
				                    	</div>
				                    	<div class="form-group form-md-line-input form-md-floating-label">
				                    	    <input type="text" class="form-control input-sm edited" id="form_control_7" v-model="storeToBeEdited.postal_code">
				                    	    <label for="form_control_7">Store Postal Code</label>
				                    	</div>
            	                        <div class="form-group form-md-line-input form-md-floating-label">
				                    		<label>Store Group:</label><br>
				                    		<el-dropdown trigger="click" @command="updateStoreGroupId" size="mini" :show-timeout="50" :hide-timeout="50">
				                    			<el-button size="mini">
				                    				{{ selectedGroupName || 'Select a group' }}
				                    				<i class="el-icon-arrow-down el-icon--right"></i>
				                    			</el-button>
				                    			<el-dropdown-menu slot="dropdown">
				                    				<el-dropdown-item v-for="group in storeGroups" :command="group"  :key="group.id">
				                    					{{ group.name }}
				                    				</el-dropdown-item>
				                    			</el-dropdown-menu>
				                    		</el-dropdown>
				                    	</div>
				                    	<div class="form-group form-md-line-input form-md-floating-label">
            	                        	<label>Store Timezone:</label><br>
            	                        	<el-dropdown trigger="click" @command="updateTimezone" size="mini" :show-timeout="50" :hide-timeout="50">
            	                        		<el-button size="mini">
            	                        			{{ selectedTimezone || 'Select a Timezone' }}
            	                        			<i class="el-icon-arrow-down el-icon--right"></i>
            	                        		</el-button>
            	                        		<el-dropdown-menu slot="dropdown">
            	                        			<el-dropdown-item command="America/New_York">
            	                        				Eastern Time
            	                        			</el-dropdown-item>
            	                        			<el-dropdown-item command="America/Chicago">
            	                        				Central Time
            	                        			</el-dropdown-item>
            	                        			<el-dropdown-item command="America/Denver">
            	                        				Mountain Time
            	                        			</el-dropdown-item>            	                        			<el-dropdown-item command="America/Los_Angeles">
            	                        				Pacific Time
            	                        			</el-dropdown-item>            	                        			<el-dropdown-item command="America/Anchorage">
            	                        				Alaska Time
            	                        			</el-dropdown-item>            	                        			<el-dropdown-item command="America/Adak">
            	                        				Hawaii-Aleutian
            	                        			</el-dropdown-item>
            	                        		</el-dropdown-menu>
            	                        	</el-dropdown>
            	                        </div>
				                    	<div class="form-group form-md-line-input form-md-floating-label">
				                    		<label>Store Currency:</label><br>
											<el-dropdown trigger="click" @command="updateStoreCurrency" size="mini" :show-timeout="50" :hide-timeout="50">
												<el-button size="mini">
													{{ storeToBeEdited.currency || 'Select a currency' }}
													<i class="el-icon-arrow-down el-icon--right"></i>
												</el-button>
												<el-dropdown-menu slot="dropdown">
													<el-dropdown-item command="CAD">
														CAD
													</el-dropdown-item>
													<el-dropdown-item command="USD">
														USD
													</el-dropdown-item>
												</el-dropdown-menu>
											</el-dropdown>
				                    	</div>
				                    </div>
				                    <div class="col-md-6">
				                    	<div class="form-group form-md-line-input form-md-floating-label">
				                    	    <input type="text" class="form-control input-sm edited" id="form_control_8" v-model="storeToBeEdited.display_name">
				                    	    <label for="form_control_8">Store Display Name</label>
				                    	</div>
				                    	<div class="form-group form-md-line-input form-md-floating-label">
				                    	    <input type="text" class="form-control input-sm edited" id="form_control_9" v-model="storeToBeEdited.internal_id">
				                    	    <label for="form_control_9">Store Internal ID</label>
				                    	</div>
				                    	<div class="form-group form-md-line-input form-md-floating-label">
				                    	    <input type="text" :readonly="$root.accountType === 'store_admin'" class="form-control input-sm edited" id="form_control_10" v-model="storeToBeEdited.api_key">
				                    	    <label for="form_control_10">External API Key (optional)</label>
				                    	</div>
				                    	<div class="form-group form-md-line-input form-md-floating-label">
				                    	    <input type="text" class="form-control input-sm edited" id="form_control_11" v-model="storeToBeEdited.phone">
				                    	    <label for="form_control_11">Store Phone Number</label>
				                    	</div>
				                    	<div class="form-group form-md-line-input form-md-floating-label">
				                    	    <input type="text" class="form-control input-sm edited" id="form_control_12" v-model="storeToBeEdited.fax">
				                    	    <label for="form_control_12">Store Fax Number</label>
				                    	</div>
				                    	<div class="form-group form-md-line-input form-md-floating-label">
				                    	    <input type="text" class="form-control input-sm edited" id="form_control_13" v-model="storeToBeEdited.email">
				                    	    <label for="form_control_13">Store Email</label>
				                    	</div>
            	                        <div class="form-group form-md-line-input form-md-floating-label">
			                    		    <label>Store Is Corporate:</label><br>
			                    		    <el-switch
			                    		    	v-model="storeToBeEdited.is_corporate"
			                    		    	@change="updateStoreIsCorporate"
			                    		    	active-color="#0c6"
			                    		    	inactive-color="#ff4949"
			                    		    	:active-value="1"
			                    		    	:inactive-value="0"
			                    		    	active-text="Yes"
			                    		    	inactive-text="No">
			                    		    </el-switch>
			                    		    <p v-if="isCorporateUpdated">Corporate Store updates will take effect next time you log in.</p>
			                    		</div>
				                    </div>
			                    </div>
			                    <div class="form-actions noborder clear">
			                        <button type="submit" class="btn blue">Save</button>
			                    </div>
			                </form>
			            </div>
			        </div>
        		</div>
        	</tab>
        	<tab header="Store Meta">
        		<div class="tab-content">
				    <div class="portlet light bordered">
			            <div class="portlet-body form">
			                <form role="form" @submit.prevent="updateStoreMeta()" novalidate v-if="!noProfileData.length">
			                    <div class="form-body">
			                    	<div class="alert alert-danger" v-if="storeMetaError.length">
			                    	    <button class="close" data-close="alert" @click.prevent="clearError('storeMetaError')"></button>
			                    	    <span>{{storeMetaError}}</span>
			                    	</div>
			                    	<div class="col-md-6">
				                    	<table class="table">
				                    	    <thead>
				                    	        <tr>
				                    	        	<th> Field </th>
				                    	        	<th> Value </th>
				                    	        </tr>
				                    	    </thead>
    			                    	    <tbody>
            									<tr>
            	                    	        	<td>
            	                    	        		Opening Soon
            	                    	        	</td>
            	                    	            <td>
            	                    	            	<el-switch
    	        	                    	            	ref="openingSoon"
            	                    	            		v-model="metaToBeEdited.opening_soon"
            	                    	            		active-color="#0c6"
            	                    	            		inactive-color="#ff4949"
            	                    	            		:active-value="1"
            	                    	            		:inactive-value="0"
            	                    	            		active-text="Yes"
            	                    	            		inactive-text="No">
            	                    	            	</el-switch>
            	                    	            </td>
                                	            </tr>
            									<tr>
            	                    	        	<td>
            	                    	        		Store Has Delivery
            	                    	        	</td>
            	                    	            <td>
    	        	    								<el-switch
    	            	    								ref="delivery"
    	        	    									v-model="metaToBeEdited.delivery"
    	        	    									active-color="#0c6"
    	        	    									inactive-color="#ff4949"
    	        	    									:active-value="1"
    	        	    									:inactive-value="0"
    	        	    									active-text="Yes"
    	        	    									inactive-text="No">
    	        	    								</el-switch>
            	                    	            </td>
                                	            </tr>
            									<tr>
            	                    	        	<td>
            	                    	        		Store Has Delivery Enabled
            	                    	        	</td>
            	                    	            <td>
            	                    	            	<el-switch
            	                    	            		v-model="metaToBeEdited.current_delivery_status"
            	                    	            		active-color="#0c6"
            	                    	            		inactive-color="#ff4949"
            	                    	            		:active-value="1"
            	                    	            		:inactive-value="0"
            	                    	            		active-text="Yes"
            	                    	            		inactive-text="No">
            	                    	            	</el-switch>
            	                    	            </td>
                                	            </tr>
    											<tr>
    			                    	        	<td>
    			                    	        		Delivery Price
    			                    	        	</td>
    			                    	            <td>
    			                    	            	<input type="text" class="form-control input-sm" v-model="metaToBeEdited.delivery_price">
    			                    	            </td>
    		                    	            </tr>
    		                    	            <tr>
    		                    	            	<td>
    		                    	            		Delivery Radius
    		                    	            	</td>
    		                    	                <td>
    	                	                    		<el-select v-model="metaToBeEdited.delivery_radius" placeholder="0" size="mini">
    	                									<el-option
    	                										v-for="n in 11"
    	                										:key="n"
    	                										:label="n - 1"
    	                										:value="n - 1">
    	                									</el-option>
    	                	                    		</el-select>
    		                    	                </td>
    	                    	                </tr>
    	                    	                <tr>
    	                    	                	<td>
    	                    	                		Tax
    	                    	                	</td>
    	                    	                    <td>
    	                    	                    	<input ref="tax" type="text" class="form-control input-sm" v-model="metaToBeEdited.tax">
    	                    	                    </td>
                        	                    </tr>
        										<tr>
        		                    	        	<td>
        		                    	        		Gift Cards
        		                    	        	</td>
        		                    	            <td>
        		                    	            	<el-switch
        		                    	            		v-model="metaToBeEdited.gift_card"
        		                    	            		active-color="#0c6"
        		                    	            		inactive-color="#ff4949"
        		                    	            		:active-value="1"
        		                    	            		:inactive-value="0"
        		                    	            		active-text="Yes"
        		                    	            		inactive-text="No">
        		                    	            	</el-switch>
        		                    	            </td>
        	                    	            </tr>
    	    									<tr>
    	    	                    	        	<td>
    	    	                    	        		Catering
    	    	                    	        	</td>
    	    	                    	            <td>
    	    	                    	            	<el-switch
    	    	                    	            		v-model="metaToBeEdited.catering"
    	    	                    	            		active-color="#0c6"
    	    	                    	            		inactive-color="#ff4949"
    	    	                    	            		:active-value="1"
    	    	                    	            		:inactive-value="0"
    	    	                    	            		active-text="Yes"
    	    	                    	            		inactive-text="No">
    	    	                    	            	</el-switch>
    	    	                    	            </td>
    	                        	            </tr>
            									<tr>
            	                    	        	<td>
            	                    	        		Catering Enabled
            	                    	        	</td>
            	                    	            <td>
            	                    	            	<el-switch
            	                    	            		v-model="metaToBeEdited.current_catering_status"
            	                    	            		active-color="#0c6"
            	                    	            		inactive-color="#ff4949"
            	                    	            		:active-value="1"
            	                    	            		:inactive-value="0"
            	                    	            		active-text="Yes"
            	                    	            		inactive-text="No">
            	                    	            	</el-switch>
            	                    	            </td>
                                	            </tr>
            									<tr>
            	                    	        	<td>
            	                    	        		Digital Rewards
            	                    	        	</td>
            	                    	            <td>
            	                    	            	<el-switch
            	                    	            		v-model="metaToBeEdited.digital_reward"
            	                    	            		active-color="#0c6"
            	                    	            		inactive-color="#ff4949"
            	                    	            		:active-value="1"
            	                    	            		:inactive-value="0"
            	                    	            		active-text="Yes"
            	                    	            		inactive-text="No">
            	                    	            	</el-switch>
            	                    	            </td>
                                	            </tr>
    			                    	    	<tr>
    		                    	    			<td>
    		                    	    				Store Has Online Ordering
    		                    	    			</td>
    		                    	    		    <td>
    		                    	    		    	<el-switch
    		                    	    		    		v-model="metaToBeEdited.online_ordering"
    		                    	    		    		active-color="#0c6"
    		                    	    		    		inactive-color="#ff4949"
    		                    	    		    		:active-value="1"
    		                    	    		    		:inactive-value="0"
    		                    	    		    		active-text="Yes"
    		                    	    		    		inactive-text="No">
    		                    	    		    	</el-switch>
    		                    	    		    </td>
    			                    	    	</tr>
        		                    	    	<tr>
        	                    	    			<td>
        	                    	    				Store Has Online Ordering Enabled
        	                    	    			</td>
        	                    	    		    <td>
        	                    	    		    	<el-switch
        	                    	    		    		v-model="metaToBeEdited.current_online_ordering_status"
        	                    	    		    		active-color="#0c6"
        	                    	    		    		inactive-color="#ff4949"
        	                    	    		    		:active-value="1"
        	                    	    		    		:inactive-value="0"
        	                    	    		    		active-text="Yes"
        	                    	    		    		inactive-text="No">
        	                    	    		    	</el-switch>
        	                    	    		    </td>
        		                    	    	</tr>
    		                    	            <tr>
                    	                        	<td>
                    	                        		Merchant ID
                    	                        	</td>
                    	                            <td>
                    	                            	<input type="text" class="form-control input-sm" v-model="metaToBeEdited.merchant_id">
                    	                            </td>
                	                            </tr>
                	                            <tr>
                	                            	<td>
                	                            		Merchant Key
                	                            	</td>
                	                                <td>
                	                                	<input type="text" class="form-control input-sm" v-model="metaToBeEdited.merchant_key">
                	                                </td>
    			                    	        </tr>
    			                    	    </tbody>
				                    	</table>
			                    	</div>
			                    </div>
			                    <div class="form-actions noborder clear">
			                    	<div class="col-md-12">
			                        	<button type="submit" class="btn blue">Save</button>
			                    	</div>
			                    </div>
			                </form>
			                <div v-if="noProfileData.length">
	                    		<no-results :show="noProfileData.length" :type="'store profile'" :custom="true" :text="noProfileData"></no-results>
	                    	</div>
			            </div>
			        </div>
        		</div>
        	</tab>
        	<tab header="Store Hours">
        		<div class="tab-content">
				    <div class="portlet light bordered">
			            <div class="portlet-body form">
			            	<form role="form" @submit.prevent="updateStoreHours()" novalidate v-if="!noHoursData.length">
				            	<div class="form-body">
					            	<div class="alert alert-danger" v-if="storeHourError.length">
					            	    <button class="close" data-close="alert" @click="clearError('storeHourError')"></button>
					            	    <span>{{storeHourError}}</span>
					            	</div>
		            		        <table class="table">
		            		            <thead>
		            		                <tr>
		            		                	<th>Day</th>
		            		                	<th>Opening Time</th>
		            		                    <th>Closing Time</th>
		            		                    <th>Status</th>
		            		                </tr>
		            		            </thead>
		            		            <tbody>
		            		                <tr v-for="hour in hoursToBeEdited">
		            		                	<td  class="align-middle" v-if="hour.day === 0"> Sunday </td>
		            		                	<td  class="align-middle" v-if="hour.day === 1"> Monday </td>
		            		                	<td  class="align-middle" v-if="hour.day === 2"> Tuesday </td>
		            		                	<td  class="align-middle" v-if="hour.day === 3"> Wednesday </td>
		            		                	<td  class="align-middle" v-if="hour.day === 4"> Thursday </td>
		            		                	<td  class="align-middle" v-if="hour.day === 5"> Friday </td>
		            		                	<td  class="align-middle" v-if="hour.day === 6"> Saturday </td>
		            		                    <td class="align-middle">
		            		                    	<el-time-select v-model="hour.open_time" :picker-options="{ start: '00:00', step: '00:15', end: '23:45' }" placeholder="Opening time" class="narrow-picker"></el-time-select>
		            		                    	<button data-toggle="tooltip" title="Copy to all" class="btn btn-icon-only btn-outline blue" @click="applyOpeningTimeToAll(hour.open_time, $event)">
		            		                    		<i class="fa fa-clone" aria-hidden="true"></i>
		            		                    	</button>
		            		                    </td>
		            		                    <td class="align-middle">
		            		                    	<el-time-select v-model="hour.close_time" :picker-options="{ start: '00:00', step: '00:15', end: '23:45' }" placeholder="Closing time" class="narrow-picker"></el-time-select>
		            		                    	<button data-toggle="tooltip" title="Copy to all" class="btn btn-icon-only btn-outline blue" @click="applyClosingTimeToAll(hour.close_time, $event)">
		            		                    		<i class="fa fa-clone" aria-hidden="true"></i>
		            		                    	</button>
		            		                    </td>
		            		                    <td class="align-middle">
		            		                    	<el-switch
		            		                    		v-model="hour.open"
		            		                    		active-color="#0c6"
		            		                    		inactive-color="#ff4949"
		            		                    		:active-value="1"
		            		                    		:inactive-value="0"
		            		                    		active-text="Open"
		            		                    		inactive-text="Closed">
		            		                    	</el-switch>
		            		                    </td>
		            		                </tr>
		            		            </tbody>
		            		        </table>
			                    </div>
			                    <div class="form-actions noborder clear">
			                        <button type="submit" class="btn blue">Save</button>
			                    </div>
		                    </form>
		                    <div v-if="noHoursData.length">
	                    		<no-results :show="noHoursData.length" :type="'store profile'" :custom="true" :text="noHoursData"></no-results>
	                    	</div>
			            </div>
			        </div>
        		</div>
        	</tab>
        	<tab header="Store Holiday Hours">
        		<div class="tab-content">
				    <div class="portlet light bordered">
			            <div class="portlet-body form">
			            	<div class="margin-bottom-20">
			            		<button class="btn create-or-edit" @click="flipAddCreateHoliday" :class="{'blue' : addAHoliday, 'blue btn-outline' : !addAHoliday}">Add a holiday</button>
			            		<button class="btn" @click="flipAddCreateHoliday" :class="{'blue' : !addAHoliday, 'blue btn-outline' : addAHoliday}">Edit a holiday</button>
			            	</div>
			            	<add-holiday-hours v-if="addAHoliday" :selectedLocationId="parseInt($route.params.store_id)" @closeHolidayHoursModal="showHolidayHoursModal = false" @addHolidayHours="addHolidayHours"></add-holiday-hours>
    	    	    	    <div v-else class="margin-top-20">
    	    	    	    	<div class="alert alert-danger" v-if="updateHolidayHoursError.length">
    	    	    	    	    <button class="close" data-close="alert" @click="clearError('updateHolidayHoursError')"></button>
    	    	    	    	    <span>{{updateHolidayHoursError}}</span>
    	    	    	    	</div>
    	    	    	    	<div v-if="holidayHoursToBeEdited.length">
						            <table class="table">
			    	    	            <thead>
			    	    	                <tr>
			    	    	                	<th> Holiday </th>
			    	    	                	<th> Day </th>
			    	    	                	<th> Start date </th>
			    	    	                	<th> End date </th>
			    	    	                	<th> Opening Time </th>
			    	    	                    <th> Closing Time </th>
			    	    	                    <th> Status </th>
			    	    	                    <th></th>
			    	    	                </tr>
			    	    	            </thead>
			    	    	            <tbody>
			    	    	                <tr v-for="hour in holidayHoursToBeEdited">
			    	    	                	<td class="align-middle"> <input type="text" class="form-control input-sm" v-model="hour.name"> </td>
			    	    	                	<td class="align-middle" v-if="hour.day === 0"> Sun </td>
			    	    	                	<td class="align-middle" v-if="hour.day === 1"> Mon </td>
			    	    	                	<td class="align-middle" v-if="hour.day === 2"> Tue </td>
			    	    	                	<td class="align-middle" v-if="hour.day === 3"> Wed </td>
			    	    	                	<td class="align-middle" v-if="hour.day === 4"> Thu </td>
			    	    	                	<td class="align-middle" v-if="hour.day === 5"> Fri </td>
			    	    	                	<td class="align-middle" v-if="hour.day === 6"> Sat </td>
			    	    	                	<td class="align-middle" > 
			    	    	                		<el-date-picker 
			    	    	                			class="narrow-date-picker" 
			    	    	                			v-model="hour.start_date" 
			    	    	                			type="date" 
			    	    	                			placeholder="Start date" 
			    	    	                			format="yyyy-MM-dd" 
			    	    	                			value-format="yyyy-MM-dd" 
			    	    	                			:clearable="false" 
			    	    	                			size="small">
			    	    	                		</el-date-picker> 
			    	    	                	</td>
			    	    	                	<td class="align-middle"> 
			    	    	                		<el-date-picker 
			    	    	                			class="narrow-date-picker" 
			    	    	                			v-model="hour.end_date" 
			    	    	                			type="date" 
			    	    	                			placeholder="End date" 
			    	    	                			format="yyyy-MM-dd"
			    	    	                			value-format="yyyy-MM-dd" 
			    	    	                			:clearable="false" 
			    	    	                			size="small">
			    	    	                			</el-date-picker> 
			    	    	                	</td>
			    	    	                    <td class="align-middle">
			    	    	                    	<el-time-select class="narrow-time-picker" v-model="hour.open_time" :picker-options="{ start: '00:00', step: '00:15', end: '23:45' }" :clearable="false" placeholder="Set store opening time" size="small"></el-time-select>
			    	    	                    </td>
			    	    	                    <td class="align-middle">
			    	    	                    	<el-time-select class="narrow-time-picker" v-model="hour.close_time" :picker-options="{ start: '00:00', step: '00:15', end: '23:45' }" :clearable="false" placeholder="Set store closing time" size="small"></el-time-select>
			    	    	                    </td>
			    	    	                    <td class="align-middle">
			    	    	                    	<el-switch
			    	    	                    		v-model="hour.open"
			    	    	                    		active-color="#0c6"
			    	    	                    		inactive-color="#ff4949"
			    	    	                    		:active-value="1"
			    	    	                    		:inactive-value="0"
			    	    	                    		active-text="Open"
			    	    	                    		inactive-text="Closed">
			    	    	                    	</el-switch>
			    	    	                    </td>
			    	    	                    <td class="align-middle">
			    	    	                    	<el-button 
			    	    	                    		type="primary" 
			    	    	                    		:loading="hour.loading"
			    	    	                    		:disabled="hour.loading"
			    	    	                    		size="small"
			    	    	                    		@click="updateHolidayHours(hour, $event)"
			    	    	                    	><span v-show="!hour.loading">Save</span></el-button>
			    	    	                    </td>
			    	    	                </tr>
			    	    	            </tbody>
			    	    	        </table>
    	    	    	    	</div>
    					        <div v-else>
    					        	<no-results :show="!holidayHoursToBeEdited.length" :type="'holiday hours'" :custom="true" :text="customText"></no-results>
    					        </div>
    				        </div>
			            </div>
			        </div>
        		</div>
        	</tab>
        </tabset>
	</div>
</template>

<script>
import $ from 'jquery'
import Breadcrumb from '../../modules/Breadcrumb'
import Tab from '../../modules/Tab'
import Tabset from '../../modules/Tabset'
import Dropdown from '../../modules/Dropdown'
import AppFunctions from '../../../controllers/App'
import StoresFunctions from '../../../controllers/Stores'
import StoreGroupsFunctions from '../../../controllers/StoreGroups'
import NoResults from '../../modules/NoResults'
import AddHolidayHours from './AddHolidayHours'
import ajaxErrorHandler from '../../../controllers/ErrorController'
import { debounce } from 'lodash'

/**
 * Define the email pattern to check for valid emails.
 * @var {regex}
 * @memberof Login
 */
var emailPattern = /^.+@.+\..+$/

export default {
	data () {
		return {
			breadcrumbArray: [
				{name: 'Store Manager', link: false},
				{name: 'Stores', link: '/app/store_manager/stores'},
				{name: 'Edit Store', link: false}
			],
			storeInformationError: '',
			storeMetaError: '',
			storeHourError: '',
			updateHolidayHoursError: '',
			storeToBeEdited: {},
			metaToBeEdited: {},
			hoursToBeEdited: [],
			holidayHoursToBeEdited: [],
			displayLocationsDropdown: false,
			googleSearchResults: [],
			locationDetails: {},
			selectedTimezone: '',
			customText: 'Click on the button above to add holiday hours for this location.',
			showHolidayHoursModal: false,
			noProfileData: '',
			noHoursData: '',
			newHolidayHours: [],
			storeGroups: [],
			selectedGroupName: '',
			nullPOSsettingsReceived: true,
			storePOSsettingsError: '',
			isCorporateUpdated: false,
			addAHoliday: true
		}
	},
	created () {
		this.getStoreDetails()
		this.getStoreHolidayHours()
	},
	methods: {
		flipAddCreateHoliday () {
			this.addAHoliday = !this.addAHoliday
		},
		/**
		 * To copy the time to other days.
		 * @function
		 * @param {string} time - The time to copy
		 * @param {object} event - The click event that initiated the action
		 * @returns {undefined}
		 */
		applyOpeningTimeToAll (time, event) {
			event.preventDefault()
			this.hoursToBeEdited.forEach(day => {
				day.open_time = time
			})
		},
		/**
		 * To copy the time to other days.
		 * @function
		 * @param {string} time - The time to copy
		 * @param {object} event - The click event that initiated the action
		 * @returns {undefined}
		 */
		applyClosingTimeToAll (time, event) {
			event.preventDefault()
			this.hoursToBeEdited.forEach(day => {
				day.close_time = time
			})
		},
		/**
		 * To update the selected provider.
		 * @function
		 * @param {sring} provider - The selected provider.
		 * @returns {undefined}
		 */
		updatePOSprovider (provider) {
			this.storeToBeEdited.pos_partner.pos_provider = provider
		},
		/**
		 * To add location POS settings.
		 * @function
		 * @returns {undefined}
		 */
		displayPOSsettingsForm () {
			this.storeToBeEdited.pos_partner = {
				'pos_provider': '',
				'domain': '',
				'user': '',
				'key': '',
				'company_id': '',
				'note': ''
			}
		},
		/**
		 * To update the store group on the store being edited.
		 * @function
		 * @param {object} group - The new group object.
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updateStoreGroupId (group) {
			this.selectedGroupName = group.name
			this.storeToBeEdited.locationsgroup_id = group.id
		},
		/**
		 * To get a list of store groups.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getStoreGroups () {
			var storeGroupsVue = this
			storeGroupsVue.storeGroups = []
			return StoreGroupsFunctions.getGroups(storeGroupsVue.$root.appId, storeGroupsVue.$root.appSecret, storeGroupsVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					storeGroupsVue.storeGroups = response.payload
					storeGroupsVue.storeGroups.forEach((group) => { if (group.id === storeGroupsVue.storeToBeEdited.locationsgroup_id) { storeGroupsVue.selectedGroupName = group.name } })
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					storeGroupsVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To add holiday hours emitted by the child modal, to the list of holiday hours and submits the same to the backend.
		 * @function
		 * @param {object} val - The object emitted by the child.
		 * @returns {undefined}
		 */
		addHolidayHours (val) {
			this.showHolidayHoursModal = false
			this.createHolidayHours(val)
		},
		determineMonth (monthName) {
			if (monthName === 'Jan') {
				return '01'
			} else if (monthName === 'Feb') {
				return '02'
			} else if (monthName === 'Mar') {
				return '03'
			} else if (monthName === 'Apr') {
				return '04'
			} else if (monthName === 'May') {
				return '05'
			} else if (monthName === 'Jun') {
				return '06'
			} else if (monthName === 'Jul') {
				return '07'
			} else if (monthName === 'Aug') {
				return '08'
			} else if (monthName === 'Sep') {
				return '09'
			} else if (monthName === 'Oct') {
				return '10'
			} else if (monthName === 'Nov') {
				return '11'
			} else if (monthName === 'Dec') {
				return '12'
			}
		},
		/**
		 * To submit the holiday hours (that are oassed in a parameter) to the backend.
		 * @function
		 * @param {object} val - The object emitted by the child.
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		createHolidayHours (val) {
			var createStoreVue = this

			StoresFunctions.createHolidayHours(val, createStoreVue.$root.appId, createStoreVue.$root.appSecret, createStoreVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					createStoreVue.holidayHoursToBeEdited = response.payload
					createStoreVue.showAlert()
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					createStoreVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {}
				throw reason
			})
		},
		/**
		 * To submit the holiday hours (that are oassed in a parameter) to the backend.
		 * @function
		 * @param {object} val - The object emitted by the child.
		 * @param {object} event - The click event that initiated the action.
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updateHolidayHours (val, event) {
			event.stopPropagation()
			event.preventDefault()
			var createStoreVue = this
			val.loading = true

			let payload = {
				'close_time': val.close_time,
				'created_at': val.created_at,
				'created_by': val.created_by,
				'day': val.day,
				'end_date': val.end_date,
				'id': val.id,
				'location_id': val.location_id,
				'name': val.name,
				'open': val.open,
				'open_time': val.open_time,
				'start_date': val.start_date,
				'status': val.status,
				'updated_at': val.updated_at,
				'updated_by': val.updated_by
			}

			StoresFunctions.updateHolidayHours(payload, createStoreVue.$root.appId, createStoreVue.$root.appSecret, createStoreVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					val.loading = false
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					createStoreVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
					createStoreVue.updateHolidayHoursError = reason
					window.scrollTo(0, 0)
				}
				throw reason
			})
		},
		/**
		 * To alert the user that the store has been successfully created and provide them an option for creating another one.
		 * @function
		 * @returns {undefined}
		 */
		showAlert () {
			this.$swal({
				title: 'Success!',
				text: 'Holiday hours successfully added.',
				type: 'success',
				confirmButtonText: 'OK'
			}).then(() => {
				window.scrollTo(0, 0)
			})
		},
		/**
		 * To add location holiday hours.
		 * @function
		 * @returns {undefined}
		 */
		displayHolidayHoursModal () {
			this.showHolidayHoursModal = true
		},
		/**
		 * To update the value of the 'is_corporate' field.
		 * @function
		 * @returns {undefined}
		 */
		updateStoreIsCorporate () {
			this.isCorporateUpdated = true
		},
		/**
		 * To capitalize a value (note that this is currently only functional for words with 1 space)
		 * @function
		 * @param {string} val - The value to be capitalized.
		 * @returns {undefined}
		 */
		capitalize (val) {
			var output

			val = val.replace(/_/g, ' ')
			var index = val.indexOf(' ')

			if (index !== -1) {
				output = val.substring(0, 1).toUpperCase() + val.substring(1, index + 1) + val.substring(index + 1, index + 2).toUpperCase() + val.substring(index + 2)
			} else {
				output = val.substring(0, 1).toUpperCase() + val.substring(1)
			}
			return output
		},
		/**
		 * To clear the passed in error.
		 * @function
		 * @param {string} val - The error/message to be cleared
		 * @returns {undefined}
		 */
		clearError (val) {
			if (val === 'storeInformationError') {
				this.storeInformationError = ''
			} else if (val === 'storeHourError') {
				this.storeHourError = ''
			} else if (val === 'storePOSsettingsError') {
				this.storePOSsettingsError = ''
			} else if (val === 'updateHolidayHoursError') {
				this.updateHolidayHoursError = ''
			} else if (val === 'storeMetaError') {
				this.storeMetaError = ''
			}
		},
		/**
		 * To update the value of the timezone.
		 * @function
		 * @param {string} val - The selected timezone
		 * @returns {undefined}
		 */
		updateTimezone (val) {
			this.storeToBeEdited.timezone = val
			if (val === 'America/New_York') {
				this.selectedTimezone = 'Eastern Time'
			} else if (val === 'America/Chicago') {
				this.selectedTimezone = 'Central Time'
			} else if (val === 'America/Denver') {
				this.selectedTimezone = 'Mountain Time'
			} else if (val === 'America/Los_Angeles') {
				this.selectedTimezone = 'Pacific Time'
			} else if (val === 'America/Anchorage') {
				this.selectedTimezone = 'Alaska Time'
			} else if (val === 'America/Adak') {
				this.selectedTimezone = 'Hawaii-Aleutian'
			}
		},
		/**
		 * To update the value of the store 'currency' field.
		 * @function
		 * @param {integer} value - The new value.
		 * @returns {undefined}
		 */
		updateStoreCurrency (value) {
			this.storeToBeEdited.currency = value
		},
		/**
		 * To update the value of the 'delivery_radius' field.
		 * @function
		 * @param {integer} val - The new value.
		 * @returns {undefined}
		 */
		updateDeliveryRadius (val) {
			this.metaToBeEdited.delivery_radius = val
		},
		/**
		 * To sync the menu.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		syncMenu () {
			var editStoreVue = this
			return StoresFunctions.syncMenu(editStoreVue.$root.appId, editStoreVue.$root.appSecret, editStoreVue.$root.userToken, editStoreVue.storeToBeEdited.id).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					editStoreVue.showSyncSuccessful()
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					editStoreVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
				}
				throw reason
			})
		},
		/**
		 * To alert the user that the menu has been synced.
		 * @function
		 * @returns {undefined}
		 */
		showSyncSuccessful () {
			this.$swal({
				title: 'Success!',
				text: 'Menu synced',
				type: 'success',
				confirmButtonText: 'OK'
			})
		},
		/**
		 * To get the details of a specific store.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getStoreDetails () {
			var editStoreVue = this
			StoresFunctions.getStoreDetails(editStoreVue.$route.params.store_id, editStoreVue.$root.appId, editStoreVue.$root.appSecret).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					editStoreVue.storeToBeEdited = response.payload
					let timezones = {
						'America/New_York': 'Eastern Time',
						'America/Chicago': 'Central Time',
						'America/Denver': 'Mountain Time',
						'America/Los_Angeles': 'Pacific Time',
						'America/Anchorage': 'Alaska Time',
						'America/Adak': 'Hawaii-Aleutian'
					}
					editStoreVue.selectedTimezone = timezones[editStoreVue.storeToBeEdited.timezone]
					editStoreVue.getStoreMeta()
				}
				editStoreVue.getStoreGroups()
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					editStoreVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {}
				throw reason
			})
		},
		/**
		 * To get the meta/profile of the current store.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getStoreMeta () {
			var editStoreVue = this
			StoresFunctions.getStoreMeta(editStoreVue.$route.params.store_id, editStoreVue.$root.appId, editStoreVue.$root.appSecret, editStoreVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					if (response.message === 'No profile to display') {
						editStoreVue.noProfileData = response.message
					} else {
						editStoreVue.metaToBeEdited = response.payload
					}
					editStoreVue.getStoreHours()
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					editStoreVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {}
				throw reason
			})
		},
		/**
		 * To get the hours of the current store.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getStoreHours () {
			var editStoreVue = this
			StoresFunctions.getStoreHours(editStoreVue.$route.params.store_id, editStoreVue.$root.appId, editStoreVue.$root.appSecret, editStoreVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					if (response.message === 'No hours to display') {
						editStoreVue.noHoursData = response.message
					} else {
						editStoreVue.hoursToBeEdited = response.payload
					}
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					editStoreVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {}
				throw reason
			})
		},
		/**
		 * To get the holiday hours of the current store.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getStoreHolidayHours () {
			var editStoreVue = this
			StoresFunctions.getStoreHolidayHours(editStoreVue.$route.params.store_id, editStoreVue.$root.appId, editStoreVue.$root.appSecret, editStoreVue.$root.userToken).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					response.payload.location_holiday_hours.forEach(day => {
						day.open_time = day.open_time.slice(0, -3)
						day.close_time = day.close_time.slice(0, -3)
						day.loading = false
					})
					editStoreVue.holidayHoursToBeEdited = response.payload.location_holiday_hours
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					editStoreVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {}
				throw reason
			})
		},
		/**
		 * To check if the menu data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateStoreInformation () {
			var editStoreVue = this
			return new Promise(function (resolve, reject) {
				if (!editStoreVue.storeToBeEdited.name.length) {
					reject('Store name cannot be blank')
				} else if (!editStoreVue.storeToBeEdited.address_line_1.length) {
					reject('Address line 1 cannot be blank')
				} else if (!editStoreVue.storeToBeEdited.city.length) {
					reject('Store city cannot be blank')
				} else if (!editStoreVue.storeToBeEdited.province.length) {
					reject('Store province cannot be blank')
				} else if (!editStoreVue.storeToBeEdited.country.length) {
					reject('Store country cannot be blank')
				} else if (!editStoreVue.storeToBeEdited.postal_code.length) {
					reject('Store postal code cannot be blank')
				} else if (!$.isNumeric(editStoreVue.storeToBeEdited.phone)) {
					reject('Store phone should be numeric')
				} else if (!$.isNumeric(editStoreVue.storeToBeEdited.fax)) {
					reject('Store fax should be numeric')
				} else if (!editStoreVue.storeToBeEdited.email.length) {
					reject('Store email cannot be blank')
				} else if (!emailPattern.test(editStoreVue.storeToBeEdited.email)) {
					reject('Please enter a valid store email')
				} else if (!editStoreVue.storeToBeEdited.display_name.length) {
					reject('Store display name cannot be blank')
				} else if (!editStoreVue.storeToBeEdited.timezone.length) {
					reject('Store timezone cannot be blank')
				} else if (editStoreVue.storeToBeEdited.internal_id === null) {
					reject('Store internal id cannot be blank')
				} else if (!editStoreVue.storeToBeEdited.currency.length) {
					reject('Store currency cannot be blank')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To update the store information in the backend.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updateStoreInformation () {
			var editStoreVue = this
			editStoreVue.storeInformationError = ''

			return editStoreVue.validateStoreInformation()
			.then(response => {
				editStoreVue.storeToBeEdited.phone = editStoreVue.storeToBeEdited.phone.replace(/[^\d]/g, '')
				editStoreVue.storeToBeEdited.fax = editStoreVue.storeToBeEdited.fax.replace(/[^\d]/g, '')
				StoresFunctions.updateStoreInformation(editStoreVue.storeToBeEdited, editStoreVue.$root.appId, editStoreVue.$root.appSecret, editStoreVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						editStoreVue.showSuccessAlert('Store details')
					} else {
						editStoreVue.storeInformationError = response.message
					}
				}).catch(reason => {
					ajaxErrorHandler({
						reason,
						errorText: 'We could not update the store',
						errorName: 'storeInformationError',
						vue: editStoreVue
					})
				})
			}).catch(reason => {
				// If validation fails then display the error message
				editStoreVue.storeInformationError = reason
				window.scrollTo(0, 0)
				throw reason
			})
		},
		/**
		 * To alert the user that the store information was successfully updated.
		 * @function
		 * @param {string} input - The input string.
		 * @returns {undefined}
		 */
		showSuccessAlert (input) {
			this.$swal({
				title: 'Success!',
				text: input + ' have been successfully updated!',
				type: 'success',
				confirmButtonText: 'OK'
			}).then(() => {
				// Do nothing
			}, dismiss => {
				// Do nothing on dismiss
			})
		},
		/**
		 * To check if the store meta data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateStoreMeta () {
			var editStoreVue = this
			return new Promise(function (resolve, reject) {
				if (editStoreVue.metaToBeEdited.delivery_price === null) {
					reject('Delivery Price cannot be blank')
				} else if (editStoreVue.metaToBeEdited.tax === null) {
					reject('Tax cannot be blank')
				} else if (editStoreVue.metaToBeEdited.gateway_name === null) {
					reject('Gateway Name cannot be blank')
				} else if (editStoreVue.metaToBeEdited.merchant_id === '') {
					reject('Merchant ID cannot be blank')
				} else if (editStoreVue.metaToBeEdited.merchant_key === '') {
					reject('Merchant Key cannot be blank')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To update the store meta in the backend.
		 * @function
		 * @param {object} meta - The meta object to be updated.
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updateStoreMeta () {
			var editStoreVue = this
			editStoreVue.storeMetaError = ''

			editStoreVue.metaToBeEdited.updated_by = editStoreVue.$root.createdBy
			return editStoreVue.validateStoreMeta()
			.then(response => {
				if (typeof editStoreVue.metaToBeEdited.delivery_price === 'undefined') {
					editStoreVue.metaToBeEdited.delivery_price = 0
				}
				if (typeof editStoreVue.metaToBeEdited.delivery_radius === 'undefined') {
					editStoreVue.metaToBeEdited.delivery_radius = 0
				}
				StoresFunctions.updateStoreMeta(editStoreVue.metaToBeEdited, editStoreVue.$route.params.store_id, editStoreVue.$root.appId, editStoreVue.$root.appSecret, editStoreVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						editStoreVue.showSuccessAlert('Store metas')
					} else {
						editStoreVue.storeMetaError = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						editStoreVue.$router.push('/login/expired')
						return
					}
					if (reason.responseJSON) {
						editStoreVue.storeMetaError = reason
						window.scrollTo(0, 0)
					}
					throw reason
				})
			}).catch(reason => {
				// If validation fails then display the error message
				editStoreVue.storeInformationError = reason
				window.scrollTo(0, 0)
				throw reason
			})
		},
		/**
		 * To check if the store data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validateStoreHours () {
			var editStoreVue = this
			return new Promise(function (resolve, reject) {
				let hoursMissing = false
				let regex = new RegExp('[0-2][0-9]:[0-5][0-9]')
				editStoreVue.hoursToBeEdited.forEach((day) => {
					if (!regex.test(day.open_time) || !regex.test(day.close_time)) {
						hoursMissing = true
						return
					}
				})
				if (hoursMissing) {
					reject('Opening and Closing Times cannot be empty. Enter 00:00 for days when the Store is closed.')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To update the hours of operation for a store.
		 * @function
		 * @param {string} day - The day of the week to be updated
		 * @param {object} hours - The details of the day to be updated
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		updateStoreHours (day, hours) {
			var editStoreVue = this

			return editStoreVue.validateStoreHours().then(response => {
				StoresFunctions.updateStoreHours(editStoreVue.$route.params.store_id, editStoreVue.hoursToBeEdited, editStoreVue.$root.appId, editStoreVue.$root.appSecret, editStoreVue.$root.userToken).then(response => {
					if (response.code === 200 && response.status === 'ok') {
						editStoreVue.showSuccessAlert('Store hours')
					} else {
						editStoreVue.storeHourError = response.message
					}
				}).catch(reason => {
					if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
						editStoreVue.$router.push('/login/expired')
						return
					}
					if (reason.responseJSON) {}
					throw reason
				})
			}).catch(reason => {
				editStoreVue.storeHourError = reason
				window.scrollTo(0, 0)
			})
		},
		/**
		 * To check if the POS settings are valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
		validatePOSsettings () {
			var editStoreVue = this
			return new Promise(function (resolve, reject) {
				if (!editStoreVue.storeToBeEdited.pos_partner.pos_provider) {
					reject('Selct a POS provider.')
				} else if (!editStoreVue.storeToBeEdited.pos_partner.domain) {
					reject('Domain cannot be blank.')
				} else if (!editStoreVue.storeToBeEdited.pos_partner.user) {
					reject('User cannot be blank.')
				} else if (!editStoreVue.storeToBeEdited.pos_partner.key) {
					reject('Key cannot be blank.')
				}
				resolve('Hurray')
			})
		},
		/**
		 * To set hours of operation for the newly created store.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		createOrUpdatePOSsettings () {
			this.clearError('storePOSsettingsError')
			var editStoreVue = this

			return editStoreVue.validatePOSsettings()
			.then(response => {
				if (this.nullPOSsettingsReceived) {
					StoresFunctions.createPOSsettings(editStoreVue.storeToBeEdited.id, editStoreVue.storeToBeEdited.pos_partner, editStoreVue.$root.appId, editStoreVue.$root.appSecret, editStoreVue.$root.userToken).then(response => {
						if (response.code === 200 && response.status === 'ok') {
							editStoreVue.showPOSsettingsAlert()
						} else {
							editStoreVue.storePOSsettingsError = response.message
						}
					}).catch(reason => {
						if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
							editStoreVue.$router.push('/login/expired')
							return
						}
						editStoreVue.storePOSsettingsError = reason
						window.scrollTo(0, 0)
						throw reason
					})
				} else {
					StoresFunctions.updatePOSsettings(editStoreVue.storeToBeEdited.id, editStoreVue.storeToBeEdited.pos_partner, editStoreVue.$root.appId, editStoreVue.$root.appSecret, editStoreVue.$root.userToken).then(response => {
						if (response.code === 200 && response.status === 'ok') {
							editStoreVue.showPOSsettingsAlert()
						} else {
							editStoreVue.storePOSsettingsError = response.message
						}
					}).catch(reason => {
						if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
							editStoreVue.$router.push('/login/expired')
							return
						}
						// editStoreVue.storePOSsettingsError = reason
						window.scrollTo(0, 0)
						throw reason
					})
				}
			}).catch(reason => {
				// If validation fails then display the error message
				editStoreVue.storePOSsettingsError = reason
				window.scrollTo(0, 0)
				throw reason
			})
		},
		/**
		 * To ask the user if they want to set up store holiday hours next or exit the setup.
		 * @function
		 * @returns {undefined}
		 */
		showPOSsettingsAlert () {
			this.$swal({
				title: 'Success!',
				html: 'POS settings saved',
				type: 'success',
				showCancelButton: false,
				confirmButtonText: 'OK'
			}).then(() => {
				// do nothing
			}, dismiss => {
				// do nothing
			})
		},
		/**
		 * To set the selected location and get its details.
		 * @function
		 * @param {object} location - The selected location object.
		 * @returns {undefined}
		 */
		selectLocation (location) {
			if (this.displayLocationsDropdown) {
				this.displayLocationsDropdown = false
			}
			var commaIndex = location.description.indexOf(',')
			var locationSubString = location.description.substring(0, commaIndex)
			this.storeToBeEdited.address_line_1 = locationSubString
			this.getGoogleLocationDetails(location.place_id)
		},
		/**
		 * To show/hide the location suggestions dropdown.
		 * @function
		 * @param {boolean} focus - To determine whether to show/hide the dropdown.
		 * @returns {undefined}
		 */
		locationFocus (focus) {
			this.displayLocationsDropdown = focus
		},
		/**
		 * To get complete details of a particular location using the google places API.
		 * @function
		 * @param {string} placeId - To google placeId of the selected location.
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getGoogleLocationDetails (placeId) {
			var editStoreVue = this
			AppFunctions.getGoogleLocationDetails(placeId, editStoreVue.$root.appId, editStoreVue.$root.appSecret).then(response => {
				editStoreVue.locationDetails = response
				editStoreVue.storeToBeEdited.latitude = editStoreVue.locationDetails.geometry.location.lat
				editStoreVue.storeToBeEdited.longitude = editStoreVue.locationDetails.geometry.location.lng

				// empty all fields initially
				editStoreVue.storeToBeEdited.country = ''
				editStoreVue.storeToBeEdited.province = ''
				editStoreVue.storeToBeEdited.city = ''

				// save new search location details
				for (var i = 0; i < editStoreVue.locationDetails.address_components.length; i++) {
					var item = editStoreVue.locationDetails.address_components[i]
					for (var j = 0; j < item.types.length; j++) {
						var subItem = item.types[j]
						if (subItem === 'postal_code' || subItem === 'postal_code_prefix') {
							editStoreVue.storeToBeEdited.postal = item.long_name
						} else if (subItem === 'country') {
							editStoreVue.storeToBeEdited.country = item.long_name
						} else if (subItem === 'administrative_area_level_1') {
							editStoreVue.storeToBeEdited.province = item.long_name
						} else if (subItem === 'locality') {
							editStoreVue.storeToBeEdited.city = item.long_name
						}
					}
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					editStoreVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {}
				throw reason
			})
		},
		/**
		 * To clear the location details set using google search.
		 * @function
		 * @returns {undefined}
		 */
		clearGoogleLocationDetails () {
			this.storeToBeEdited.address_line_2 = ''
			this.storeToBeEdited.latitude = ''
			this.storeToBeEdited.longitude = ''
			this.storeToBeEdited.country = ''
			this.storeToBeEdited.province = ''
			this.storeToBeEdited.city = ''
			this.storeToBeEdited.postal = ''
		},
		/**
		 * To get results based off google's places search API.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
		getGooglePlaces: debounce(function () {
			var editStoreVue = this
			if (editStoreVue.storeToBeEdited.address_line_1.length >= 3) {
				AppFunctions.getGoogleLocationSearchResults(editStoreVue.storeToBeEdited.address_line_1, editStoreVue.$root.appId, editStoreVue.$root.appSecret).then(response => {
					editStoreVue.googleSearchResults = response
				}).catch(reason => {
					if (reason.responseJSON) {}
					throw reason
				})
			} else {
				editStoreVue.googleSearchResults = []
			}
		}, 500)
	},
	watch: {
		'storeToBeEdited.address_line_1' (val) {
			if (val.length) {
				this.getGooglePlaces()
			} else {
				this.googleSearchResults = []
				this.clearGoogleLocationDetails()
			}
		}
	},
	components: {
		Breadcrumb,
		Tab,
		Tabset,
		Dropdown,
		NoResults,
		AddHolidayHours
	}
}
</script>
<style scoped>
.dropdown-menu {
	max-height: 145px;
	overflow: auto;
}
.el-date-editor.narrow-date-picker.el-input.el-input--small.el-input--prefix.el-input--suffix.el-date-editor--date {	
	width: 130px;
}
.el-date-editor.narrow-time-picker.el-input.el-input--small.el-input--prefix.el-input--suffix.el-date-editor--time-select {
	width: 95px;
}
.align-middle {
	vertical-align: middle;
}
</style>
