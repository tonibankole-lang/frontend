<script setup>
import { ref } from 'vue'
import ActivitiesDetail from './ActivitiesDetail.vue'

const activities = ref([])   // All activities from backend
const filteredActivities = ref([])
const cart = ref(JSON.parse(localStorage.getItem('cart')) || [])
const token = ref(localStorage.getItem('token') || null)
const selectedActivity = ref(null)   // For detail view

const categoryFilter = ref('All')
const searchTerm = ref('')

// -------------------
// Load activities
// -------------------
const loadActivities = async () => {
  try {
    const res = await fetch('/api/activities')
    activities.value = await res.json()
    filteredActivities.value = activities.value
  } catch (err) {
    console.error('Failed to load activities:', err)
  }
}

// -------------------
// Filter activities
// -------------------
const filterActivities = () => {
  const cat = categoryFilter.value
  const search = searchTerm.value.toLowerCase().trim()
  filteredActivities.value = activities.value.filter(a => 
    (cat === 'All' || a.category === cat) &&
    a.title.toLowerCase().includes(search)
  )
}

// -------------------
// Cart functions
// -------------------
const addToCart = (activity) => {
  if (!token.value) return alert('Login first!')
  cart.value.push({
    _id: activity._id,
    title: activity.title,
    price: activity.price,
    image: activity.image
  })
  localStorage.setItem('cart', JSON.stringify(cart.value))
  alert(`Added "${activity.title}" to cart`)
}

// -------------------
// View detail
// -------------------
const showDetail = (activity) => {
  selectedActivity.value = activity
}

const closeDetail = () => {
  selectedActivity.value = null
}

// -------------------
// Computed: categories
// -------------------
const categories = computed(() => {
  const cats = ['All', ...new Set(activities.value.map(a => a.category))]
  return cats
})

// -------------------
// On mounted
// -------------------
loadActivities()
</script>

<template>
  <div>
    <!-- Search & filter -->
    <div class="filter-bar">
      <select v-model="categoryFilter" @change="filterActivities">
        <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
      </select>

      <input
        type="text"
        placeholder="Search activities..."
        v-model="searchTerm"
        @input="filterActivities"
      />
    </div>

    <!-- Activities List -->
    <div v-if="!selectedActivity" class="activities-grid">
      <div v-for="activity in filteredActivities" :key="activity._id" class="card">
        <img
          :src="activity.image ? `/images/${activity.image}` : 'https://via.placeholder.com/250'"
          :alt="activity.title"
        />
        <h3>{{ activity.title }}</h3>
        <p class="meta">{{ activity.category }} • {{ activity.ageRange }}</p>
        <p>{{ activity.description }}</p>
        <p>Instructor: {{ activity.instructor }}</p>
        <p class="price">£{{ activity.price }}</p>
        <p>Joined: {{ activity.joined || 0 }} / {{ activity.capacity || 10 }}</p>
        <button @click="showDetail(activity)">View Details</button>
        <button @click="addToCart(activity)" :disabled="activity.joined >= activity.capacity">Add to Cart</button>
      </div>
    </div>

    <!-- Detail View -->
    <ActivitiesDetail
      v-if="selectedActivity"
      :activity="selectedActivity"
      @back="closeDetail"
      @add-to-cart="addToCart"
    />
  </div>
</template>

<style scoped>
.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px,1fr));
  gap: 20px;
  margin: 20px 0;
}
.card {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  background: #fff;
  transition: transform 0.2s;
}
.card:hover {
  transform: scale(1.03);
}
.card img {
  width: 100%;
  border-radius: 8px;
}
.filter-bar {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}
button {
  margin-top: 5px;
  cursor: pointer;
}
</style>
