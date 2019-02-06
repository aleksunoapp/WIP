<template>
  <div>
    <div class="page-bar">
      <breadcrumb :crumbs="breadcrumbArray" />
    </div>
    <h1 class="page-title">
      Edit {{ storeToBeEdited.display_name || $route.params.store_id }}
    </h1>
    <div class="note note-info">
      <p>Update the general details, customs and hours of operation for a store.</p>
    </div>
    <tabset class="margin-top-20">
      <tab
        v-if="$root.permissions['stores info read']"
        header="Store Information"
      >
        <div class="tab-content">
          <div class="portlet light bordered">
            <div class="portlet-body form">
              <form
                role="form"
                novalidate
                @submit.prevent="updateStoreInformation()"
              >
                <fieldset :disabled="!$root.permissions['stores info update']? true : false">
                  <div class="row">
                    <div
                      v-show="storeInformationError.length"
                      ref="storeInformationError"
                      class="alert alert-danger"
                    >
                      <button
                        class="close"
                        data-close="alert"
                        @click.prevent="clearError('storeInformationError')"
                      />
                      <span>{{ storeInformationError }}</span>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group form-md-line-input form-md-floating-label">
                        <input
                          id="form_control_1"
                          v-model="storeToBeEdited.name"
                          type="text"
                          class="form-control input-sm edited"
                        >
                        <label for="form_control_1">
                          Store Name
                        </label>
                      </div>
                      <div class="form-group form-md-line-input form-md-floating-label">
                        <input
                          id="form_control_2"
                          v-model="storeToBeEdited.address_line_1"
                          type="text"
                          class="form-control input-sm edited"
                          autocomplete="off"
                          @focus="locationFocus(true)"
                          @blur="locationFocus(false)"
                        >
                        <label for="form_control_2">
                          Address Line 1
                        </label>
                      </div>
                      <div
                        v-if="displayLocationsDropdown"
                        class="new-location-search-dropdown"
                      >
                        <div v-if="!googleSearchResults.length">
                          There are no locations that match your search.
                        </div>
                        <div
                          v-for="(location, index) in googleSearchResults"
                          :key="index"
                          :class="{'active': storeToBeEdited.address_line_1 == location.description}"
                          @mousedown.prevent="selectLocation(location)"
                        >
                          {{ location.description }}
                        </div>
                      </div>
                      <div class="form-group form-md-line-input form-md-floating-label">
                        <input
                          id="form_control_3"
                          v-model="storeToBeEdited.address_line_2"
                          type="text"
                          class="form-control input-sm edited"
                        >
                        <label for="form_control_3">
                          Address Line 2
                        </label>
                      </div>
                      <div class="form-group form-md-line-input form-md-floating-label">
                        <input
                          id="form_control_4"
                          v-model="storeToBeEdited.city"
                          type="text"
                          class="form-control input-sm edited"
                        >
                        <label for="form_control_4">
                          Store City
                        </label>
                      </div>
                      <div class="form-group form-md-line-input form-md-floating-label">
                        <input
                          id="form_control_5"
                          v-model="storeToBeEdited.province"
                          type="text"
                          class="form-control input-sm edited"
                        >
                        <label for="form_control_5">
                          Store Province
                        </label>
                      </div>
                      <div class="form-group form-md-line-input form-md-floating-label">
                        <input
                          id="form_control_6"
                          v-model="storeToBeEdited.country"
                          type="text"
                          class="form-control input-sm edited"
                        >
                        <label for="form_control_6">
                          Store Country
                        </label>
                      </div>
                      <div class="form-group form-md-line-input form-md-floating-label">
                        <input
                          id="form_control_country_code"
                          v-model="storeToBeEdited.country_code"
                          type="text"
                          class="form-control input-sm edited"
                        >
                        <label for="form_control_country_code">
                          Country Code
                        </label>
                      </div>
                      <div class="form-group form-md-line-input form-md-floating-label">
                        <input
                          id="form_control_7"
                          v-model="storeToBeEdited.postal_code"
                          type="text"
                          class="form-control input-sm edited"
                        >
                        <label for="form_control_7">
                          Store Postal Code
                        </label>
                      </div>
                      <div class="form-group form-md-line-input form-md-floating-label">
                        <label>Store Group:</label><br>
                        <el-select
                          v-model="storeToBeEdited.locationsgroup_id"
                          filterable
                          placeholder="Select a group"
                          size="mini"
                          :disabled="!$root.permissions['stores info update']"
                        >
                          <el-option
                            v-for="group in storeGroups"
                            :key="group.id"
                            :label="group.name"
                            :value="group.id"
                          />
                        </el-select>
                      </div>
                      <div class="form-group form-md-line-input form-md-floating-label">
                        <label>Store Timezone:</label><br>
                        <el-select
                          v-model="storeToBeEdited.timezone"
                          filterable
                          placeholder="Select a timezone"
                          size="mini"
                          :disabled="!$root.permissions['stores info update']? true : false"
                        >
                          <el-option
                            v-for="(zone, i) in timezones"
                            :key="i"
                            :label="zone.label"
                            :value="zone.value"
                          />
                        </el-select>
                      </div>
                      <div class="form-group form-md-line-input form-md-floating-label">
                        <label>Store Currency:</label><br>
                        <el-select
                          v-model="storeToBeEdited.currency"
                          filterable
                          placeholder="Select a currency"
                          size="mini"
                        >
                          <el-option
                            label="CAD"
                            value="CAD"
                          />
                          <el-option
                            label="USD"
                            value="USD"
                          />
                          <el-option
                            label="NZD"
                            value="NZD"
                          />
                        </el-select>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group form-md-line-input form-md-floating-label">
                        <input
                          id="form_control_8"
                          v-model="storeToBeEdited.display_name"
                          type="text"
                          class="form-control input-sm edited"
                        >
                        <label for="form_control_8">
                          Store Display Name
                        </label>
                      </div>
                      <div class="form-group form-md-line-input form-md-floating-label">
                        <input
                          id="form_control_9"
                          v-model="storeToBeEdited.internal_id"
                          type="text"
                          class="form-control input-sm edited"
                        >
                        <label for="form_control_9">
                          Store Internal ID
                        </label>
                      </div>
                      <div class="form-group form-md-line-input form-md-floating-label">
                        <input
                          id="form_control_10"
                          v-model="storeToBeEdited.api_key"
                          type="text"
                          :readonly="$root.accountType === 'store_admin'"
                          class="form-control input-sm edited"
                        >
                        <label for="form_control_10">
                          External API Key (optional)
                        </label>
                      </div>
                      <div class="form-group form-md-line-input form-md-floating-label">
                        <input
                          id="form_control_11"
                          v-model="storeToBeEdited.phone"
                          type="text"
                          class="form-control input-sm edited"
                        >
                        <label for="form_control_11">
                          Store Phone Number
                        </label>
                      </div>
                      <div class="form-group form-md-line-input form-md-floating-label">
                        <input
                          id="form_control_12"
                          v-model="storeToBeEdited.fax"
                          type="text"
                          class="form-control input-sm"
                          :class="{'edited': storeToBeEdited.fax}"
                        >
                        <label for="form_control_12">
                          Store Fax Number (optional)
                        </label>
                      </div>
                      <div class="form-group form-md-line-input form-md-floating-label">
                        <input
                          id="form_control_13"
                          v-model="storeToBeEdited.email"
                          type="text"
                          class="form-control input-sm edited"
                        >
                        <label for="form_control_13">
                          Store Email
                        </label>
                      </div>
                      <div class="form-group form-md-line-input form-md-floating-label">
                        <input
                          id="form_control_tax"
                          v-model="storeToBeEdited.tax"
                          type="text"
                          class="form-control input-sm edited"
                        >
                        <label for="form_control_tax">
                          Tax
                        </label>
                      </div>
                      <div class="form-group form-md-line-input form-md-floating-label">
                        <label>Price Includes Tax:</label><br>
                        <el-switch
                          v-model="storeToBeEdited.price_includes_tax"
                          :disabled="!$root.permissions['stores info update']? true : false"
                          active-color="#0c6"
                          inactive-color="#ff4949"
                          :active-value="1"
                          :inactive-value="0"
                          active-text="Yes"
                          inactive-text="No"
                        />
                      </div>
                      <div class="form-group form-md-line-input form-md-floating-label">
                        <label>Store Is Corporate:</label><br>
                        <el-switch
                          v-model="storeToBeEdited.is_corporate"
                          :disabled="!$root.permissions['stores info update']? true : false"
                          active-color="#0c6"
                          inactive-color="#ff4949"
                          :active-value="1"
                          :inactive-value="0"
                          active-text="Yes"
                          inactive-text="No"
                          @change="updateStoreIsCorporate"
                        />
                        <p v-if="isCorporateUpdated">
                          Corporate Store updates will take effect next time you log in.
                        </p>
                      </div>
                      <div class="form-group form-md-line-input form-md-floating-label">
                        <label>Status:</label><br>
                        <el-switch
                          v-model="storeToBeEdited.status"
                          :disabled="!$root.permissions['stores info update']? true : false"
                          active-color="#0c6"
                          inactive-color="#ff4949"
                          :active-value="1"
                          :inactive-value="0"
                          active-text="Active"
                          inactive-text="Inactive"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="form-actions noborder clear">
                    <button
                      type="submit"
                      class="btn blue"
                      :disabled="!$root.permissions['stores info update'] || updatingStoreInfo"
                    >
                      Save
                      <i
                        v-show="updatingStoreInfo"
                        class="fa fa-spinner fa-pulse fa-fw"
                      />
                    </button>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </tab>
      <tab
        v-if="$root.permissions['stores profile read']"
        header="Store Profile"
      >
        <div class="tab-content">
          <div class="portlet light bordered">
            <div class="portlet-body form">
              <form
                role="form"
                novalidate
                @submit.prevent="updateStoreMeta()"
              >
                <fieldset :disabled="!$root.permissions['stores profile update']? true : false">
                  <div class="form-body">
                    <div
                      v-show="storeMetaError"
                      ref="storeMetaError"
                      class="alert alert-danger"
                    >
                      <button
                        class="close"
                        @click.prevent="clearError('storeMetaError')"
                      />
                      <span>{{ storeMetaError }}</span>
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
                                :disabled="!$root.permissions['stores profile update']? true : false"
                                active-color="#0c6"
                                inactive-color="#ff4949"
                                :active-value="1"
                                :inactive-value="0"
                                active-text="Yes"
                                inactive-text="No"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              Store Has Online Ordering
                            </td>
                            <td>
                              <el-switch
                                v-model="metaToBeEdited.online_ordering"
                                :disabled="metaToBeEdited.opening_soon === 1 || !$root.permissions['stores profile update']? true : false"
                                active-color="#0c6"
                                inactive-color="#ff4949"
                                :active-value="1"
                                :inactive-value="0"
                                active-text="Yes"
                                inactive-text="No"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              Store Has Online Ordering Enabled
                            </td>
                            <td>
                              <el-switch
                                v-model="metaToBeEdited.current_online_ordering_status"
                                :disabled="metaToBeEdited.online_ordering === 0 || metaToBeEdited.opening_soon === 1 || !$root.permissions['stores profile update']? true : false"
                                active-color="#0c6"
                                inactive-color="#ff4949"
                                :active-value="1"
                                :inactive-value="0"
                                active-text="Yes"
                                inactive-text="No"
                              />
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
                                :disabled="metaToBeEdited.opening_soon === 1 || !$root.permissions['stores profile update']? true : false"
                                active-color="#0c6"
                                inactive-color="#ff4949"
                                :active-value="1"
                                :inactive-value="0"
                                active-text="Yes"
                                inactive-text="No"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              Store Has Delivery Enabled
                            </td>
                            <td>
                              <el-switch
                                v-model="metaToBeEdited.current_delivery_status"
                                :disabled="metaToBeEdited.delivery === 0 || metaToBeEdited.opening_soon === 1 || !$root.permissions['stores profile update']? true : false"
                                active-color="#0c6"
                                inactive-color="#ff4949"
                                :active-value="1"
                                :inactive-value="0"
                                active-text="Yes"
                                inactive-text="No"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              Store Has Immediate Delivery
                            </td>
                            <td>
                              <el-switch
                                v-model="metaToBeEdited.delivery_immediate"
                                :disabled="metaToBeEdited.delivery === 0 || metaToBeEdited.opening_soon === 1 || !$root.permissions['stores profile update']? true : false"
                                active-color="#0c6"
                                inactive-color="#ff4949"
                                :active-value="1"
                                :inactive-value="0"
                                active-text="Yes"
                                inactive-text="No"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              ASAP Ordering
                            </td>
                            <td>
                              <el-switch
                                v-model="metaToBeEdited.pickup_immediate"
                                active-color="#0c6"
                                inactive-color="#ff4949"
                                :disabled="!$root.permissions['stores profile update']? true : false"
                                :active-value="1"
                                :inactive-value="0"
                                active-text="Yes"
                                inactive-text="No"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              Pickup Later
                            </td>
                            <td>
                              <el-switch
                                v-model="metaToBeEdited.enable_receive_later"
                                active-color="#0c6"
                                inactive-color="#ff4949"
                                :disabled="!$root.permissions['stores profile update']? true : false"
                                :active-value="1"
                                :inactive-value="0"
                                active-text="Yes"
                                inactive-text="No"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              Catering
                            </td>
                            <td>
                              <el-switch
                                v-model="metaToBeEdited.catering"
                                :disabled="metaToBeEdited.opening_soon === 1 || !$root.permissions['stores profile update']? true : false"
                                active-color="#0c6"
                                inactive-color="#ff4949"
                                :active-value="1"
                                :inactive-value="0"
                                active-text="Yes"
                                inactive-text="No"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              Catering Enabled
                            </td>
                            <td>
                              <el-switch
                                v-model="metaToBeEdited.current_catering_status"
                                :disabled="metaToBeEdited.catering === 0 || metaToBeEdited.opening_soon === 1 || !$root.permissions['stores profile update']? true : false"
                                active-color="#0c6"
                                inactive-color="#ff4949"
                                :active-value="1"
                                :inactive-value="0"
                                active-text="Yes"
                                inactive-text="No"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              Promo Codes
                            </td>
                            <td>
                              <el-switch
                                v-model="metaToBeEdited.enable_promocode"
                                :disabled="metaToBeEdited.opening_soon === 1 || !$root.permissions['stores profile update']? true : false"
                                active-color="#0c6"
                                inactive-color="#ff4949"
                                :active-value="1"
                                :inactive-value="0"
                                active-text="Yes"
                                inactive-text="No"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              Gift Cards
                            </td>
                            <td>
                              <el-switch
                                v-model="metaToBeEdited.gift_card"
                                :disabled="metaToBeEdited.opening_soon === 1 || !$root.permissions['stores profile update']? true : false"
                                active-color="#0c6"
                                inactive-color="#ff4949"
                                :active-value="1"
                                :inactive-value="0"
                                active-text="Yes"
                                inactive-text="No"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              Digital Rewards
                            </td>
                            <td>
                              <el-switch
                                v-model="metaToBeEdited.digital_reward"
                                :disabled="metaToBeEdited.opening_soon === 1 || !$root.permissions['stores profile update']? true : false"
                                active-color="#0c6"
                                inactive-color="#ff4949"
                                :active-value="1"
                                :inactive-value="0"
                                active-text="Yes"
                                inactive-text="No"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              Tips
                            </td>
                            <td>
                              <el-switch
                                v-model="metaToBeEdited.enable_tip"
                                :disabled="metaToBeEdited.opening_soon === 1 || !$root.permissions['stores profile update']? true : false"
                                active-color="#0c6"
                                inactive-color="#ff4949"
                                :active-value="1"
                                :inactive-value="0"
                                active-text="Yes"
                                inactive-text="No"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              External online ordering enabled
                            </td>
                            <td>
                              <el-switch
                                v-model="metaToBeEdited.external_online_ordering_enabled"
                                :disabled="metaToBeEdited.opening_soon === 1 || !$root.permissions['stores profile update']? true : false"
                                active-color="#0c6"
                                inactive-color="#ff4949"
                                :active-value="1"
                                :inactive-value="0"
                                active-text="Yes"
                                inactive-text="No"
                              />
                            </td>
                          </tr>
                          <tr v-show="metaToBeEdited.external_online_ordering_enabled">
                            <td>
                              External order link
                            </td>
                            <td>
                              <input
                                v-model="metaToBeEdited.external_online_ordering_url"
                                type="text"
                                class="form-control input-sm"
                                :disabled="metaToBeEdited.opening_soon === 1"
                              >
                            </td>
                          </tr>
                          <tr>
                            <td>
                              GST Number
                            </td>
                            <td>
                              <input
                                v-model="metaToBeEdited.gst_number"
                                type="text"
                                class="form-control input-sm"
                                :disabled="metaToBeEdited.opening_soon === 1"
                              >
                            </td>
                          </tr>
                          <tr>
                            <td>
                              Delivery Tax
                            </td>
                            <td>
                              <input
                                v-model="metaToBeEdited.location_delivery_tax"
                                type="text"
                                class="form-control input-sm"
                                :disabled="metaToBeEdited.opening_soon === 1"
                              >
                            </td>
                          </tr>
                          <tr>
                            <td>
                              Payment Processor Merchant ID (MID)
                            </td>
                            <td>
                              <input
                                v-model="metaToBeEdited.merchant_id"
                                type="text"
                                class="form-control input-sm"
                                :disabled="metaToBeEdited.opening_soon === 1"
                              >
                            </td>
                          </tr>
                          <tr>
                            <td>
                              Payment Processor Merchant Key
                            </td>
                            <td>
                              <input
                                v-model="metaToBeEdited.merchant_key"
                                type="text"
                                class="form-control input-sm"
                                :disabled="metaToBeEdited.opening_soon === 1"
                              >
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div class="form-actions noborder clear">
                    <div class="col-md-12">
                      <button
                        type="submit"
                        class="btn blue"
                        :disabled="!$root.permissions['stores profile update'] || updatingStoreMeta"
                      >
                        Save
                        <i
                          v-show="updatingStoreMeta"
                          class="fa fa-spinner fa-pulse fa-fw"
                        />
                      </button>
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </tab>
      <tab
        v-if="$root.permissions['stores hours read']"
        header="Store Hours"
      >
        <div class="tab-content">
          <div class="portlet light bordered">
            <div class="portlet-body form">
              <form
                role="form"
                novalidate
                @submit.prevent="updateStoreHours()"
              >
                <fieldset :disabled="!$root.permissions['stores hours update']? true : false">
                  <div class="form-body">
                    <div
                      v-show="storeHourError"
                      ref="storeHourError"
                      class="alert alert-danger"
                    >
                      <button
                        class="close"
                        @click="clearError('storeHourError')"
                      />
                      <span>{{ storeHourError }}</span>
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
                        <tr
                          v-for="hour in hoursToBeEdited"
                          :key="hour.id"
                        >
                          <td
                            v-if="hour.day === 0"
                            class="align-middle"
                          >
                            Sunday
                          </td>
                          <td
                            v-if="hour.day === 1"
                            class="align-middle"
                          >
                            Monday
                          </td>
                          <td
                            v-if="hour.day === 2"
                            class="align-middle"
                          >
                            Tuesday
                          </td>
                          <td
                            v-if="hour.day === 3"
                            class="align-middle"
                          >
                            Wednesday
                          </td>
                          <td
                            v-if="hour.day === 4"
                            class="align-middle"
                          >
                            Thursday
                          </td>
                          <td
                            v-if="hour.day === 5"
                            class="align-middle"
                          >
                            Friday
                          </td>
                          <td
                            v-if="hour.day === 6"
                            class="align-middle"
                          >
                            Saturday
                          </td>
                          <td class="align-middle">
                            <el-time-select
                              v-model="hour.open_time"
                              :picker-options="{ start: '00:00', step: '00:01', end: '23:59' }"
                              placeholder="Opening time"
                              class="narrow-picker"
                              :disabled="!$root.permissions['stores hours update']? true : false"
                            />
                            <button
                              data-toggle="tooltip"
                              title="Copy to all"
                              class="btn btn-icon-only btn-outline blue"
                              :disabled="!$root.permissions['stores hours update']? true : false"
                              @click="applyOpeningTimeToAll(hour.open_time, $event)"
                            >
                              <i
                                class="fa fa-clone"
                                aria-hidden="true"
                              />
                            </button>
                          </td>
                          <td class="align-middle">
                            <el-time-select
                              v-model="hour.close_time"
                              :picker-options="{ start: '00:00', step: '00:01', end: '23:59' }"
                              placeholder="Closing time"
                              class="narrow-picker"
                              :disabled="!$root.permissions['stores hours update']? true : false"
                            />
                            <button
                              data-toggle="tooltip"
                              title="Copy to all"
                              class="btn btn-icon-only btn-outline blue"
                              @click="applyClosingTimeToAll(hour.close_time, $event)"
                            >
                              <i
                                class="fa fa-clone"
                                aria-hidden="true"
                              />
                            </button>
                          </td>
                          <td class="align-middle">
                            <el-switch
                              v-model="hour.open"
                              active-color="#0c6"
                              inactive-color="#ff4949"
                              :disabled="!$root.permissions['stores hours update']? true : false"
                              :active-value="1"
                              :inactive-value="0"
                              active-text="Open"
                              inactive-text="Closed"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="form-actions noborder clear">
                    <button
                      type="submit"
                      class="btn blue"
                      :disabled="!$root.permissions['stores hours update'] || updatingStoreHours"
                    >
                      Save
                      <i
                        v-show="updatingStoreHours"
                        class="fa fa-spinner fa-pulse fa-fw"
                      />
                    </button>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </tab>
      <tab
        v-if="$root.permissions['stores holiday_hours read']"
        header="Store Holiday Hours"
      >
        <div class="tab-content">
          <div class="portlet light bordered">
            <div class="portlet-body form">
              <div class="margin-bottom-20">
                <button
                  class="btn create-or-edit"
                  :class="{'blue' : addAHoliday, 'blue btn-outline' : !addAHoliday}"
                  :disabled="!$root.permissions['stores holiday_hours update']? true : false"
                  @click="flipAddCreateHoliday"
                >
                  Add a holiday
                </button>
                <button
                  class="btn"
                  :class="{'blue' : !addAHoliday, 'blue btn-outline' : addAHoliday}"
                  :disabled="!$root.permissions['stores holiday_hours update']? true : false"
                  @click="flipAddCreateHoliday"
                >
                  Edit a holiday
                </button>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div
                    v-show="holidayHoursError"
                    ref="holidayHoursError"
                    class="alert alert-danger"
                  >
                    <button
                      class="close"
                      @click="clearError('holidayHoursError')"
                    />
                    <span>{{ holidayHoursError }}</span>
                  </div>
                </div>
              </div>
              <add-holiday-hours
                v-if="addAHoliday"
                :selected-location-id="parseInt($route.params.store_id)"
                @closeHolidayHoursModal="showHolidayHoursModal = false"
                @addHolidayHours="addHolidayHours"
              />
              <div
                v-else
                class="margin-top-20"
              >
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
                        <th />
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="hour in holidayHoursToBeEdited"
                        :key="hour.id"
                      >
                        <td class="align-middle">
                          <input
                            v-model="hour.name"
                            type="text"
                            class="form-control input-sm"
                          >
                        </td>
                        <td
                          v-if="hour.day === 0"
                          class="align-middle"
                        >
                          Sun
                        </td>
                        <td
                          v-if="hour.day === 1"
                          class="align-middle"
                        >
                          Mon
                        </td>
                        <td
                          v-if="hour.day === 2"
                          class="align-middle"
                        >
                          Tue
                        </td>
                        <td
                          v-if="hour.day === 3"
                          class="align-middle"
                        >
                          Wed
                        </td>
                        <td
                          v-if="hour.day === 4"
                          class="align-middle"
                        >
                          Thu
                        </td>
                        <td
                          v-if="hour.day === 5"
                          class="align-middle"
                        >
                          Fri
                        </td>
                        <td
                          v-if="hour.day === 6"
                          class="align-middle"
                        >
                          Sat
                        </td>
                        <td class="align-middle">
                          <el-date-picker
                            v-model="hour.start_date"
                            class="narrow-date-picker"
                            type="date"
                            placeholder="Start date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            :clearable="false"
                            size="small"
                            :disabled="!$root.permissions['stores holiday_hours update']? true : false"
                          />
                        </td>
                        <td class="align-middle">
                          <el-date-picker
                            v-model="hour.end_date"
                            class="narrow-date-picker"
                            type="date"
                            placeholder="End date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            :clearable="false"
                            size="small"
                            :disabled="!$root.permissions['stores holiday_hours update']? true : false"
                          />
                        </td>
                        <td class="align-middle">
                          <el-time-select
                            v-model="hour.open_time"
                            class="narrow-time-picker"
                            :disabled="!$root.permissions['stores holiday_hours update']? true : false"
                            :picker-options="{ start: '00:00', step: '00:01', end: '23:59' }"
                            :clearable="false"
                            placeholder="Set store opening time"
                            size="small"
                          />
                        </td>
                        <td class="align-middle">
                          <el-time-select
                            v-model="hour.close_time"
                            class="narrow-time-picker"
                            :picker-options="{ start: '00:00', step: '00:01', end: '23:59' }"
                            :clearable="false"
                            placeholder="Set store closing time"
                            size="small"
                            :disabled="!$root.permissions['stores holiday_hours update']? true : false"
                          />
                        </td>
                        <td class="align-middle">
                          <el-switch
                            v-model="hour.open"
                            active-color="#0c6"
                            inactive-color="#ff4949"
                            :active-value="1"
                            :inactive-value="0"
                            active-text="Open"
                            inactive-text="Closed"
                            :disabled="!$root.permissions['stores holiday_hours update']? true : false"
                          />
                        </td>
                        <td class="align-middle">
                          <el-button
                            type="primary"
                            :loading="hour.loading"
                            :disabled="hour.loading || hour.deleting || !$root.permissions['stores holiday_hours update']? true : false"
                            size="small"
                            @click="updateHolidayHours(hour, $event)"
                          >
                            <span v-show="!hour.loading">
                              Save
                            </span>
                          </el-button>
                        </td>
                        <td class="align-middle">
                          <el-button
                            type="primary"
                            :loading="hour.deleting"
                            :disabled="hour.loading || hour.deleting || !$root.permissions['stores holiday_hours update']? true : false"
                            size="small"
                            plain
                            @click="openDeleteHolidayHoursModal(hour)"
                          >
                            <span v-show="!hour.deleting">
                              Delete
                            </span>
                          </el-button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div v-else>
                  <no-results
                    :show="!holidayHoursToBeEdited.length"
                    :type="'holiday hours'"
                    :custom="true"
                    :text="customText"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </tab>
      <tab
        v-if="$root.permissions['stores images read']"
        header="Store Images"
      >
        <div class="tab-content">
          <store-images
            v-if="storeToBeEdited.id !== undefined"
            :store-id="storeToBeEdited.id"
          />
        </div>
      </tab>
    </tabset>
    <!-- DELETE HOLIDAY HOURS MODAL START -->
    <modal
      :show="showDeleteHolidayHoursModal"
      effect="fade"
      @closeOnEscape="closeDeleteHolidayHoursModal"
    >
      <div
        slot="modal-header"
        class="modal-header"
      >
        <button
          type="button"
          class="close"
          @click="closeDeleteHolidayHoursModal()"
        >
          <span>&times;</span>
        </button>
        <h4 class="modal-title center">
          Delete Holiday Hours
        </h4>
      </div>
      <div
        slot="modal-body"
        class="modal-body"
      >
        <div
          v-show="deleteHolidayHoursErrorMessage.length"
          ref="deleteHolidayHoursErrorMessage"
          class="alert alert-danger"
        >
          <button
            class="close"
            data-close="alert"
            @click="clearDeleteHolidayHoursError()"
          />
          <span>{{ deleteHolidayHoursErrorMessage }}</span>
        </div>
        <p>Are you sure you want to delete these holiday hours?</p>
      </div>
      <div
        slot="modal-footer"
        class="modal-footer"
      >
        <button
          type="button"
          class="btn btn-primary"
          @click="deleteHolidayHours()"
        >
          Delete
        </button>
      </div>
    </modal>
    <!-- DELETE HOLIDAY HOURS MODAL END -->
  </div>
</template>

<script>
import Breadcrumb from '../../modules/Breadcrumb'
import Tab from '../../modules/Tab'
import Tabset from '../../modules/Tabset'
import Dropdown from '../../modules/Dropdown'
import LoadingScreen from '../../modules/LoadingScreen'
import Modal from '@/components/modules/Modal'
import AppFunctions from '../../../controllers/App'
import StoresFunctions from '../../../controllers/Stores'
import StoreGroupsFunctions from '../../../controllers/StoreGroups'
import NoResults from '../../modules/NoResults'
import AddHolidayHours from './AddHolidayHours'
import ajaxErrorHandler from '../../../controllers/ErrorController'
import { debounce } from 'lodash'
import TimezonesArray from './TimezonesArray'
import StoreImages from '@/components/app/StoreManager/StoreImages'

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
        { name: 'Store Manager', link: false },
        { name: 'Stores', link: '/app/store_manager/stores' },
        { name: 'Edit Store', link: false }
      ],
      storeInformationError: '',
      storeMetaError: '',
      storeHourError: '',
      holidayHoursError: '',
      updatingStoreInfo: false,
      storeToBeEdited: {},
      updatingStoreMeta: false,
      metaToBeEdited: {},
      updatingStoreHours: false,
      hoursToBeEdited: [
        {
          created_by: this.$root.createdBy,
          day: 1,
          open: 1,
          open_time: '00:00',
          close_time: '00:00',
          status: 1
        },
        {
          created_by: this.$root.createdBy,
          day: 2,
          open: 1,
          open_time: '00:00',
          close_time: '00:00',
          status: 1
        },
        {
          created_by: this.$root.createdBy,
          day: 3,
          open: 1,
          open_time: '00:00',
          close_time: '00:00',
          status: 1
        },
        {
          created_by: this.$root.createdBy,
          day: 4,
          open: 1,
          open_time: '00:00',
          close_time: '00:00',
          status: 1
        },
        {
          created_by: this.$root.createdBy,
          day: 5,
          open: 1,
          open_time: '00:00',
          close_time: '00:00',
          status: 1
        },
        {
          created_by: this.$root.createdBy,
          day: 6,
          open: 1,
          open_time: '00:00',
          close_time: '00:00',
          status: 1
        },
        {
          created_by: this.$root.createdBy,
          day: 0,
          open: 1,
          open_time: '00:00',
          close_time: '00:00',
          status: 1
        }
      ],
      holidayHoursToBeEdited: [],
      displayLocationsDropdown: false,
      googleSearchResults: [],
      locationDetails: {},
      customText:
				'Click on the button above to add holiday hours for this location.',
      showHolidayHoursModal: false,
      noProfileData: '',
      noHoursData: '',
      newHolidayHours: [],
      storeGroups: [],
      isCorporateUpdated: false,
      addAHoliday: true,
      mode: 'list',
      loadingImages: false,
      imagesErrorMessage: '',
      images: [],
      imageToPreview: {
        id: null
      },
      imageToCreate: {
        url: '',
        order: '',
        type: 'image',
        default: 0
      },
      imageToEdit: {},
      imageToDelete: {},
      timezones: [],
      holidayHourToDelete: {},
      showDeleteHolidayHoursModal: false,
      deleteHolidayHoursErrorMessage: ''
    }
  },
  created () {
    this.timezones = TimezonesArray
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
        pos_provider: '',
        domain: '',
        user: '',
        key: '',
        company_id: '',
        note: ''
      }
    },
    /**
		 * To get a list of store groups.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getStoreGroups () {
      var storeGroupsVue = this
      storeGroupsVue.storeGroups = []
      return StoreGroupsFunctions.getGroups(
        storeGroupsVue.$root.appId,
        storeGroupsVue.$root.appSecret,
        storeGroupsVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            storeGroupsVue.storeGroups = response.payload
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch store groups',
            errorName: 'storeInformationError',
            vue: storeGroupsVue
          })
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
      var editStoreVue = this

      StoresFunctions.createHolidayHours(
        val,
        editStoreVue.$root.appId,
        editStoreVue.$root.appSecret,
        editStoreVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            if (response.payload && response.payload.pending_approval !== true) {
              const sunday = response.payload.findIndex(day => day.day === 0)
              let weekStartingMonday = response.payload
              weekStartingMonday.push(response.payload[sunday])
              weekStartingMonday.splice(sunday, 1)
              editStoreVue.holidayHoursToBeEdited = weekStartingMonday.map(day => {
                return {
                  ...day,
                  open_time: day.open_time.substr(0, 5),
                  close_time: day.close_time.substr(0, 5)
                }
              })
            }
            editStoreVue.showAlert(response.payload)
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not add the holiday hours',
            errorName: 'holidayHoursError',
            vue: editStoreVue
          })
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
      var editStoreVue = this
      val.loading = true

      let payload = {
        close_time: val.close_time,
        created_at: val.created_at,
        created_by: val.created_by,
        day: val.day,
        end_date: val.end_date,
        id: val.id,
        location_id: val.location_id,
        name: val.name,
        open: val.open,
        open_time: val.open_time,
        start_date: val.start_date,
        status: val.status,
        updated_at: val.updated_at,
        updated_by: val.updated_by
      }

      StoresFunctions.updateHolidayHours(
        payload,
        editStoreVue.$root.appId,
        editStoreVue.$root.appSecret,
        editStoreVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            editStoreVue.showHoursUpdateSuccess(response.payload)
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not update the holiday hours',
            errorName: 'holidayHoursError',
            vue: editStoreVue
          })
        })
        .finally(() => {
          val.loading = false
        })
    },
    /**
		 * To open the delete holiday hours modal
		 * @function
		 * @param {object} hour - The hour to delete
		 * @returns {undefined}
		 */
    openDeleteHolidayHoursModal (hour) {
      this.holidayHourToDelete = hour
      this.showDeleteHolidayHoursModal = true
    },
    /**
		 * To close the delete holiday hours modal
		 * @function
		 * @returns {undefined}
		 */
    closeDeleteHolidayHoursModal () {
      this.showDeleteHolidayHoursModal = false
    },
    /**
		 * To clear the error
		 * @function
		 * @returns {undefined}
		 */
    clearDeleteHolidayHoursError () {
      this.deleteHolidayHoursErrorMessage = ''
    },
    /**
		 * To submit delete the hours from the database
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    deleteHolidayHours () {
      this.holidayHourToDelete.deleting = true
      var editStoreVue = this

      let payload = {
        id: this.holidayHourToDelete.id,
        location_id: this.holidayHourToDelete.location_id
      }

      StoresFunctions.deleteStoreHolidayHours(
        payload,
        editStoreVue.$root.appId,
        editStoreVue.$root.appSecret,
        editStoreVue.$root.userToken
      )
        .then(response => {
          this.getStoreHolidayHours()
          this.closeDeleteHolidayHoursModal()
          this.confirmHolidayHoursDeleted(response.payload)
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not delete the holiday hours',
            errorName: 'deleteHolidayHoursErrorMessage',
            vue: editStoreVue
          })
        })
        .finally(() => {
          editStoreVue.holidayHourToDelete.deleting = false
        })
    },
    /**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    confirmHolidayHoursDeleted (payload = {}) {
      let title = 'Success'
      let text = 'The Holiday Hours have been deleted'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The removal has been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      })
    },
    /**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    showAlert (payload = {}) {
      let title = 'Success'
      let text = 'The Holiday Hours have been created'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The Holiday Hours have been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
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
        output =
					val.substring(0, 1).toUpperCase() +
					val.substring(1, index + 1) +
					val.substring(index + 1, index + 2).toUpperCase() +
					val.substring(index + 2)
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
      this[val] = ''
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
      StoresFunctions.getStoreDetails(
        editStoreVue.$route.params.store_id,
        editStoreVue.$root.appId,
        editStoreVue.$root.appSecret
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            editStoreVue.storeToBeEdited = {
              ...response.payload,
              country_code: response.payload.country_code ? response.payload.country_code : ''
            }
            editStoreVue.getStoreMeta()
            editStoreVue.getStoreGroups()
          } else {
            throw response
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch store information',
            errorName: 'storeInformationError',
            vue: editStoreVue
          })
        })
    },
    /**
		 * To get the meta/profile of the current store.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getStoreMeta () {
      var editStoreVue = this
      StoresFunctions.getStoreMeta(
        editStoreVue.$route.params.store_id,
        editStoreVue.$root.appId,
        editStoreVue.$root.appSecret,
        editStoreVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            if (response.message === 'No profile to display') {
              editStoreVue.noProfileData = response.message
            } else {
              editStoreVue.metaToBeEdited = response.payload
            }
            editStoreVue.getStoreHours()
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch store profile info',
            errorName: 'storeMetaError',
            vue: editStoreVue
          })
        })
    },
    /**
		 * To get the hours of the current store.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getStoreHours () {
      var editStoreVue = this
      StoresFunctions.getStoreHours(
        editStoreVue.$route.params.store_id,
        editStoreVue.$root.appId,
        editStoreVue.$root.appSecret,
        editStoreVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            if (response.message === 'No hours to display') {
              editStoreVue.noHoursData = response.message
            } else {
              const sunday = response.payload.findIndex(day => day.day === 0)
              let weekStartingMonday = response.payload
              weekStartingMonday.push(response.payload[sunday])
              weekStartingMonday.splice(sunday, 1)
              editStoreVue.hoursToBeEdited = weekStartingMonday.map(day => {
                return {
                  ...day,
                  open_time: day.open_time.substr(0, 5),
                  close_time: day.close_time.substr(0, 5)
                }
              })
            }
          }
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch store hours',
            errorName: 'storeHourError',
            vue: editStoreVue
          })
        })
    },
    /**
		 * To get the holiday hours of the current store.
		 * @function
		 * @returns {object} - A promise that will either return an error message or perform an action.
		 */
    getStoreHolidayHours () {
      var editStoreVue = this
      StoresFunctions.getStoreHolidayHours(
        editStoreVue.$route.params.store_id,
        editStoreVue.$root.appId,
        editStoreVue.$root.appSecret,
        editStoreVue.$root.userToken
      )
        .then(response => {
          if (response.code === 200 && response.status === 'ok') {
            response.payload.location_holiday_hours.forEach(day => {
              day.open_time = day.open_time.slice(0, -3)
              day.close_time = day.close_time.slice(0, -3)
              day.loading = false
              day.deleting = false
            })
            const sunday = response.payload.location_holiday_hours.findIndex(
              day => day.day === 0
            )
            let weekStartingMonday = response.payload.location_holiday_hours
            weekStartingMonday.push(
              response.payload.location_holiday_hours[sunday]
            )
            weekStartingMonday.splice(sunday, 1)
            editStoreVue.holidayHoursToBeEdited = weekStartingMonday.map(day => {
              return {
                ...day,
                open_time: day.open_time.substr(0, 5),
                close_time: day.close_time.substr(0, 5)
              }
            })
          } else throw response
        })
        .catch(reason => {
          ajaxErrorHandler({
            reason,
            errorText: 'We could not fetch holiday hours',
            errorName: 'holidayHoursError',
            vue: editStoreVue
          })
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
        } else if (!editStoreVue.storeToBeEdited.country_code.length) {
          reject('Country code cannot be blank')
        } else if (!editStoreVue.storeToBeEdited.postal_code.length) {
          reject('Store postal code cannot be blank')
        } else if (!editStoreVue.storeToBeEdited.phone) {
          reject('Store phone cannot be blank')
        } else if (
          editStoreVue.storeToBeEdited.fax &&
					editStoreVue.storeToBeEdited.fax.length < 10
        ) {
          reject('Store fax number should be at least 10 characters')
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

      return editStoreVue
        .validateStoreInformation()
        .then(response => {
          editStoreVue.updatingStoreInfo = true
          if (!editStoreVue.storeToBeEdited.fax) {
            editStoreVue.storeToBeEdited.fax = '0000000000'
          }
          StoresFunctions.updateStoreInformation(
            editStoreVue.storeToBeEdited,
            editStoreVue.$root.appId,
            editStoreVue.$root.appSecret,
            editStoreVue.$root.userToken
          )
            .then(response => {
              if (response.code === 200 && response.status === 'ok') {
                editStoreVue.showSuccessAlert(response.payload)
              } else {
                editStoreVue.storeInformationError = response.message
              }
            })
            .catch(reason => {
              ajaxErrorHandler({
                reason,
                errorText: 'We could not update the store',
                errorName: 'storeInformationError',
                vue: editStoreVue
              })
            })
            .finally(() => {
              editStoreVue.updatingStoreInfo = false
            })
        })
        .catch(reason => {
          // If validation fails then display the error message
          editStoreVue.storeInformationError = reason
          window.scrollTo(0, 0)
          throw reason
        })
    },
    /**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    showSuccessAlert (payload = {}) {
      let title = 'Success'
      let text = 'The Store Information has been created'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The Store Information has been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      })
    },
    /**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    showMetaUpdateSuccess (payload = {}) {
      let title = 'Success'
      let text = 'The Store Profile has been saved'
      let type = 'success'

      if (payload && payload.pending_approval) {
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
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    showMetaCreateSuccess (payload = {}) {
      let title = 'Success'
      let text = 'The Store Profile has been created'
      let type = 'success'

      if (payload && payload.pending_approval) {
        title = 'Approval Required'
        text = 'The Store Profile has been sent for approval'
        type = 'info'
      }

      this.$swal({
        title,
        text,
        type
      })
    },
    /**
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    showHoursUpdateSuccess (payload = {}) {
      let title = 'Success'
      let text = 'The Store Hours have been saved'
      let type = 'success'

      if (payload && payload.pending_approval) {
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
		 * To notify user of the outcome of the call
		 * @function
		 * @param {object} payload - The payload object from the server response
		 * @returns {undefined}
		 */
    showHoursCreateSuccess (payload = {}) {
      let title = 'Success'
      let text = 'The Store Hours have been created'
      let type = 'success'

      if (payload && payload.pending_approval) {
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
		 * To check if the store meta data is valid before submitting to the backend.
		 * @function
		 * @returns {object} A promise that will validate the input form
		 */
    validateStoreMeta () {
      var editStoreVue = this
      return new Promise(function (resolve, reject) {
        if (editStoreVue.metaToBeEdited.opening_soon === 1) {
          resolve('Hurray')
        } else if (
          editStoreVue.metaToBeEdited.external_online_ordering_enabled &&
					!editStoreVue.metaToBeEdited.external_online_ordering_url
        ) {
          reject('The external online ordering enabled field is required')
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
      return editStoreVue
        .validateStoreMeta()
        .then(response => {
          editStoreVue.updatingStoreMeta = true
          if (editStoreVue.metaToBeEdited.opening_soon === 1) {
            if (!editStoreVue.metaToBeEdited.merchant_id) {
              editStoreVue.metaToBeEdited.merchant_id = 0
            }
            if (!editStoreVue.metaToBeEdited.merchant_key) {
              editStoreVue.metaToBeEdited.merchant_key = 0
            }
          }

          if (editStoreVue.noProfileData === 'No profile to display') {
            editStoreVue.metaToBeEdited.created_by =
							editStoreVue.$root.createdBy
            StoresFunctions.createStoreMeta(
              editStoreVue.storeToBeEdited.id,
              editStoreVue.metaToBeEdited,
              editStoreVue.$root.appId,
              editStoreVue.$root.appSecret,
              editStoreVue.$root.userToken
            )
              .then(response => {
                editStoreVue.noProfileData = ''
                editStoreVue.showMetaCreateSuccess(response.payload)
              })
              .catch(reason => {
                ajaxErrorHandler({
                  reason,
                  errorText: 'We could not update the store profile',
                  errorName: 'storeMetaError',
                  vue: editStoreVue
                })
              })
              .finally(() => {
                editStoreVue.updatingStoreMeta = false
              })
          } else {
            StoresFunctions.updateStoreMeta(
              editStoreVue.metaToBeEdited,
              editStoreVue.$route.params.store_id,
              editStoreVue.$root.appId,
              editStoreVue.$root.appSecret,
              editStoreVue.$root.userToken
            )
              .then(response => {
                if (response.code === 200 && response.status === 'ok') {
                  editStoreVue.showMetaUpdateSuccess(response.payload)
                } else {
                  editStoreVue.storeMetaError = response.message
                }
              })
              .catch(reason => {
                ajaxErrorHandler({
                  reason,
                  errorText: 'We could not update the store profile',
                  errorName: 'storeMetaError',
                  vue: editStoreVue
                })
              })
              .finally(() => {
                editStoreVue.updatingStoreMeta = false
              })
          }
        })
        .catch(reason => {
          // If validation fails then display the error message
          editStoreVue.storeMetaError = reason
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
        editStoreVue.hoursToBeEdited.forEach(day => {
          if (!regex.test(day.open_time) || !regex.test(day.close_time)) {
            hoursMissing = true
          }
        })
        if (hoursMissing) {
          reject(
            'Opening and Closing Times cannot be empty. Enter 00:00 for days when the Store is closed.'
          )
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

      if (editStoreVue.noHoursData === 'No hours to display') {
        return editStoreVue
          .validateStoreHours()
          .then(response => {
            editStoreVue.updatingStoreHours = true
            StoresFunctions.createStoreHours(
              editStoreVue.$route.params.store_id,
              editStoreVue.hoursToBeEdited,
              editStoreVue.$root.appId,
              editStoreVue.$root.appSecret,
              editStoreVue.$root.userToken
            )
              .then(response => {
                if (response.code === 200 && response.status === 'ok') {
                  editStoreVue.getStoreHours()
                  editStoreVue.showHoursCreateSuccess(response.payload)
                } else {
                  editStoreVue.storeHourError = response.message
                }
              })
              .catch(reason => {
                ajaxErrorHandler({
                  reason,
                  errorText: 'We could not add the hours',
                  errorName: 'storeHourError',
                  vue: editStoreVue
                })
              })
              .finally(() => {
                editStoreVue.updatingStoreHours = false
              })
          })
          .catch(reason => {
            editStoreVue.storeHourError = reason
            window.scrollTo(0, 0)
          })
      } else {
        return editStoreVue
          .validateStoreHours()
          .then(response => {
            StoresFunctions.updateStoreHours(
              editStoreVue.$route.params.store_id,
              editStoreVue.hoursToBeEdited,
              editStoreVue.$root.appId,
              editStoreVue.$root.appSecret,
              editStoreVue.$root.userToken
            )
              .then(response => {
                if (response.code === 200 && response.status === 'ok') {
                  editStoreVue.showHoursUpdateSuccess(response.payload)
                } else {
                  editStoreVue.storeHourError = response.message
                }
              })
              .catch(reason => {
                ajaxErrorHandler({
                  reason,
                  errorText: 'We could not update the hours',
                  errorName: 'storeHourError',
                  vue: editStoreVue
                })
              })
          })
          .catch(reason => {
            editStoreVue.storeHourError = reason
            window.scrollTo(0, 0)
          })
      }
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
      AppFunctions.getGoogleLocationDetails(
        placeId,
        editStoreVue.$root.appId,
        editStoreVue.$root.appSecret
      )
        .then(response => {
          editStoreVue.locationDetails = response
          editStoreVue.storeToBeEdited.latitude =
						editStoreVue.locationDetails.geometry.location.lat
          editStoreVue.storeToBeEdited.longitude =
						editStoreVue.locationDetails.geometry.location.lng

          // empty all fields initially
          editStoreVue.storeToBeEdited.country = ''
          editStoreVue.storeToBeEdited.country_code = ''
          editStoreVue.storeToBeEdited.province = ''
          editStoreVue.storeToBeEdited.city = ''

          // save new search location details
          for (
            var i = 0;
            i < editStoreVue.locationDetails.address_components.length;
            i++
          ) {
            var item = editStoreVue.locationDetails.address_components[i]
            for (var j = 0; j < item.types.length; j++) {
              var subItem = item.types[j]
              if (
                subItem === 'postal_code' ||
								subItem === 'postal_code_prefix'
              ) {
                editStoreVue.storeToBeEdited.postal = item.long_name
              } else if (subItem === 'country') {
                editStoreVue.storeToBeEdited.country_code = item.short_name
                editStoreVue.storeToBeEdited.country = item.long_name
              } else if (subItem === 'administrative_area_level_1') {
                editStoreVue.storeToBeEdited.province = item.long_name
              } else if (subItem === 'locality') {
                editStoreVue.storeToBeEdited.city = item.long_name
              }
            }
          }
        })
        .catch(reason => {})
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
      this.storeToBeEdited.country_code = ''
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
        AppFunctions.getGoogleLocationSearchResults(
          editStoreVue.storeToBeEdited.address_line_1,
          editStoreVue.$root.appId,
          editStoreVue.$root.appSecret
        )
          .then(response => {
            editStoreVue.googleSearchResults = response
          })
          .catch(reason => {
            if (reason.responseJSON) {
            }
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
    },
    'metaToBeEdited.opening_soon' (val) {
      if (val === 0) {
      }
    }
  },
  components: {
    Breadcrumb,
    Tab,
    Tabset,
    Dropdown,
    NoResults,
    AddHolidayHours,
    LoadingScreen,
    Modal,
    StoreImages
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
