<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  userType: { type: String, default: 'student' }
})

const emit = defineEmits(['close', 'login'])

const isSignupMode = ref(false)
const showPassword = ref(false)

const loginData = ref({ email: '', password: '' })
const signupData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  userType: props.userType
})

watch(() => props.userType, (newType) => {
  signupData.value.userType = newType
})

const toggleMode = () => isSignupMode.value = !isSignupMode.value

const handleLogin = () => {
  if (!loginData.value.email || !loginData.value.password) {
    alert('Please fill in all fields')
    return
  }
  emit('login', { email: loginData.value.email })
}

const handleSignup = () => {
  if (!signupData.value.name || !signupData.value.email || !signupData.value.password) {
    alert('Please fill in all fields')
    return
  }
  if (signupData.value.password !== signupData.value.confirmPassword) {
    alert('Passwords do not match')
    return
  }
  emit('login', { email: signupData.value.email })
}

const close = () => emit('close')
const togglePasswordVisibility = () => showPassword.value = !showPassword.value
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click="close">
    <div class="modal-container" @click.stop>
      <button class="close-button" @click="close">✕</button>

      <!-- Login -->
      <div v-if="!isSignupMode">
        <h2>Welcome Back!</h2>
        <input v-model="loginData.email" type="email" placeholder="Email" />
        <input :type="showPassword ? 'text' : 'password'" v-model="loginData.password" placeholder="Password" />
        <button @click="togglePasswordVisibility">{{ showPassword ? 'Hide' : 'Show' }}</button>
        <button @click="handleLogin">Sign In</button>
        <p @click="toggleMode">Don't have an account? Sign Up</p>
      </div>

      <!-- Signup -->
      <div v-else>
        <h2>Create Account</h2>
        <input v-model="signupData.name" placeholder="Full Name" />
        <input v-model="signupData.email" placeholder="Email" />
        <input v-model="signupData.password" :type="showPassword ? 'text' : 'password'" placeholder="Password" />
        <input v-model="signupData.confirmPassword" :type="showPassword ? 'text' : 'password'" placeholder="Confirm Password" />
        <button @click="togglePasswordVisibility">{{ showPassword ? 'Hide' : 'Show' }}</button>
        <button @click="handleSignup">Sign Up</button>
        <p @click="toggleMode">Already have an account? Sign In</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center;
}
.modal-container {
  background: white; padding: 2rem; border-radius: 12px; width: 400px; max-width: 90%;
}
.close-button { position: absolute; top: 10px; right: 10px; }
input { display: block; margin-bottom: 1rem; width: 100%; padding: 0.5rem; }
button { margin-bottom: 0.5rem; width: 100%; padding: 0.5rem; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; }
p { text-align: center; cursor: pointer; color: #667eea; }
</style>
