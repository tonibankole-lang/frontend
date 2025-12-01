<script setup>
import { computed } from 'vue'

const props = defineProps({ cart: Array })
const emit = defineEmits(['remove', 'checkout'])

const total = computed(() => props.cart.reduce((sum, item) => sum + item.price, 0))

const removeItem = (id) => emit('remove', id)
const handleCheckout = () => emit('checkout')
</script>

<template>
  <div v-if="cart.length">
    <h2>Your Cart</h2>
    <div v-for="item in cart" :key="item._id">
      <img :src="item.image" :alt="item.title" width="80" />
      <span>{{ item.title }} - ${{ item.price }}</span>
      <button @click="removeItem(item._id)">Remove</button>
    </div>
    <p>Total: ${{ total }}</p>
    <button @click="handleCheckout">Checkout</button>
  </div>
  <div v-else>
    <p>Your cart is empty</p>
  </div>
</template>
