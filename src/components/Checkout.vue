<script setup>
import { ref, computed } from 'vue'
import { createOrder } from '../api.js'

const props = defineProps({
  cart: { type: Array, required: true },
  user: { type: Object, required: true }
})

const emit = defineEmits(['cart-updated', 'back'])

const isProcessing = ref(false)
const joinedActivities = ref([])
const failedActivities = ref([])
const message = ref('')

const total = computed(() => props.cart.reduce((sum, i) => sum + i.price * i.quantity, 0))

const handleCheckout = async () => {
  if (!props.cart.length) return alert('Your cart is empty!')
  isProcessing.value = true
  message.value = ''

  try {
    const result = await createOrder({
      items: props.cart.map(i => ({ _id: i._id, title: i.title, quantity: i.quantity })),
      total: total.value,
      customer: { name: props.user.name, email: props.user.email }
    })

    joinedActivities.value = result.joinedActivities
    failedActivities.value = result.failedActivities
    message.value = 'Checkout completed!'

    // Reset cart
    emit('cart-updated', [])

  } catch (err) {
    console.error(err)
    message.value = err.message || 'Checkout failed'
  } finally {
    isProcessing.value = false
  }
}
</script>

<template>
  <div>
    <h1>Checkout</h1>
    <div v-if="!props.cart.length">
      <p>Cart is empty.</p>
      <button @click="emit('back')">Back</button>
    </div>

    <div v-else>
      <ul>
        <li v-for="item in props.cart" :key="item._id">
          {{ item.title }} × {{ item.quantity }}
        </li>
      </ul>
      <p>Total: ${{ total.toFixed(2) }}</p>
      <button @click="handleCheckout" :disabled="isProcessing">
        {{ isProcessing ? 'Processing...' : 'Complete Checkout' }}
      </button>
      <p v-if="message">{{ message }}</p>

      <div v-if="joinedActivities.length">
        <h2>✅ Successfully Joined:</h2>
        <ul>
          <li v-for="a in joinedActivities" :key="a._id">{{ a.title }}</li>
        </ul>
      </div>

      <div v-if="failedActivities.length">
        <h2>❌ Full / Could not join:</h2>
        <ul>
          <li v-for="a in failedActivities" :key="a.title">{{ a.title }}</li>
        </ul>
      </div>

      <button @click="emit('back')">Back to Activities</button>
    </div>
  </div>
</template>
