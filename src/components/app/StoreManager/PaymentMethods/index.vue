<template>
  <div>
    <template
      v-if="$root.activeLocation.id === undefined"
    >
      <div
        class="row"
      >
        <div class="col-md-12">
          <div class="alert alert-info center margin-top-20">
            <h4>No Store Selected</h4>
            <p>Please select a store from the stores panel on the right to view its data</p>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <payment-methods />
      <non-integrated-payment-methods />
    </template>
  </div>
</template>

<script>
import PaymentMethods from '@/components/app/StoreManager/PaymentMethods/PaymentMethods.vue'
import NonIntegratedPaymentMethods from '@/components/app/StoreManager/PaymentMethods/NonIntegratedPaymentMethods.vue'

export default {
  components: {
    PaymentMethods,
    NonIntegratedPaymentMethods
  }
}
</script>
