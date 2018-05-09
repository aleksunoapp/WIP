<template>
	<modal v-bind:show="viewOrderModalDisplayed" effect="fade" @closeOnEscape="closeModal" okText="Refund">
		<div slot="modal-header" class="modal-header">
			<button type="button" class="close" @click="closeModal()">
				<span>&times;</span>
			</button>
			<h4 class="modal-title center">Order No. {{order.external_id}}</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<div class="portlet-body">
				<div class="row">
					<div class="col-md-12">
						<div class="alert alert-danger" v-if="errorMessage.length">
	                        <button class="close" data-close="alert" @click="clearError()"></button>
	                        <span>{{errorMessage}}</span>
	                    </div>
					</div>
				</div>
				<table class="table table-striped table-bordered table-advance table-hover">
					<tbody>
						<tr>
							<th> Items </th>
							<td>
								<span v-if="order.order_items.length === 0">-</span>
								<ul class="list-unstyled">
									<li v-for="(item, index1) in order.order_items">{{item.name}} x {{item.item_qty}} ({{formatUSD(item.item_price)}})
										<ul>
											<li v-for="(modifier, index2) in item.modifier">
												{{modifier.name}} <span v-if="modifier.mod_qty !== 1"> x {{modifier.mod_qty}} </span><span v-if="modifier.order_modifier_option.length">(</span><span v-for="(option, optionIndex) in modifier.order_modifier_option">{{option.option_name}}<span v-if="optionIndex !== modifier.order_modifier_option.length - 1">, </span></span><span v-if="modifier.order_modifier_portion && modifier.order_modifier_portion.length">; </span><span v-for="(portion, portionIndex) in modifier.order_modifier_portion">{{portion.portion_name}}<span v-if="portionIndex !== modifier.order_modifier_portion.length - 1">, </span></span><span v-if="modifier.order_modifier_option.length">)</span>
											</li>
										</ul>
									</li>
								</ul> 
							</td>
						</tr>
						<tr>
							<th> Store </th>
							<td> {{ order.location_name }} </td>
						</tr>
						<tr>
							<th> Status </th>
							<td> {{ order.status }} </td>
						</tr>
						<tr>
							<th> Type </th>
							<td> {{ order.type }} </td>
						</tr>
						<tr v-if="order.type === 'pickup' && order.pickup_later === 1">
							<th> Pickup time </th>
							<td> {{ order.pickup_time }} </td>
						</tr>
						<tr>
							<th> Tax </th>
							<td> {{ order.tax_percentage }}% </td>
						</tr>
						<tr>
							<th> Tax amount </th>
							<td> {{ formatUSD(order.tax_amount) }} </td>
						</tr>
						<tr>
							<th> Delivery fee </th>
							<td> ${{ order.delivery_fee }} </td>
						</tr>
						<tr>
							<th> Total </th>
							<td> {{ formatUSD(order.total) }} </td>
						</tr>
						<tr>
							<th> Notes </th>
							<td> {{ order.note || '-'}} </td>
						</tr>
						<tr>
							<th> Group order </th>
							<td> <span v-if="order.grouporder_id !== 0"> {{ order.grouporder_id }} </span> <span v-else> no </span> </td>
						</tr>
						<tr>
							<th> Giftcard amount </th>
							<td> {{ formatUSD(order.giftcard_amount) }} </td>
						</tr>
						<tr>
							<th> Points earned </th>
							<td> {{ order.points_earned }} </td>
						</tr>
						<tr>
							<th> Created at </th>
							<td> {{ order.created_at }} </td>
						</tr>
						<tr>
							<th> Updated at </th>
							<td> {{ order.updated_at }} </td>
						</tr>
<!-- 						<tr>
							<th> Response time </th>
							<td> {{ order.response_time }} minute<span v-if="responseTime > 1">s</span></td>
						</tr> -->
					</tbody>
				</table>
			</div>
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button type="button" v-if="order.status !== 'refunded'" class="btn btn-primary pull-left" @click="refund()">Refund</button>
			<button type="button" class="btn btn-default" @click="closeModal()">Close</button>
		</div>
	</modal>
</template>

<script>
import Modal from '../../modules/Modal'
import UsersFunctions from '../../../controllers/Users'

export default {
	data () {
		return {
			viewOrderModalDisplayed: false,
			errorMessage: ''
		}
	},
	props: {
		order: {
			order: Object,
			default: {}
		}
	},
	mounted () {
		this.viewOrderModalDisplayed = true
	},
	methods: {
		/**
		 * To close the modal.
		 * @function
		 * @returns {undefined}
		 */
		closeModal () {
			this.$emit('closeViewOrderModal')
		},
		/**
		 * To clear the error.
		 * @function
		 * @returns {undefined}
		 */
		clearError () {
			this.errorMessage = ''
		},
		/**
		 * To format a number as currency
		 * @function
		 * @param {string} val - The number to format
		 * @returns {string} The formatted currency amount
		 */
		formatUSD (val = '') {
			return val.toLocaleString('en-US', {style: 'currency', currency: 'USD'})
		},
		/**
		 * To refund the order.
		 * @function
		 * @returns {undefined}
		 */
		refund () {
			var viewOrderVue = this

			UsersFunctions.refundOrder(viewOrderVue.$root.appId, viewOrderVue.$root.appSecret, viewOrderVue.$root.userToken, viewOrderVue.order.id).then(response => {
				if (response.code === 200 && response.status === 'ok') {
					viewOrderVue.order.status = 'refunded'
				} else {
					viewOrderVue.errorMessage = 'Could not refund this order'
					window.scrollTo(0, 0)
				}
			}).catch(reason => {
				if (reason.responseJSON.code === 401 && reason.responseJSON.status === 'unauthorized') {
					viewOrderVue.$router.push('/login/expired')
					return
				}
				if (reason.responseJSON) {
					viewOrderVue.errorMessage = reason.responseJSON.message
				}
				throw reason
			})
		}
	},
	components: {
		Modal
	}
}
</script>

<style scoped>
.item-name {
	font-weight: 700;
}
</style>
