<template>
  <div :class="`badge text-${textColor}`">
    <div class="caption-bold uppercase">{{ label }}</div>
    <div class="h4">
      {{ quantityFormatted }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Badge',
    props: {
      label: { type: String, default: '' },
      quantity: { type: [Number, String], required: true },
      textColor: { type: String, default: 'black' },
      currency: { type: Boolean, default: false }
    },
    data() {
      return {
        currencyFormat: {
          style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2,
        }
      }
    },
    computed: {
      quantityFormatted() {
        return this.currency
          ? this.quantity.toLocaleString('en-US', this.currencyFormat)
          : this.quantity;
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>