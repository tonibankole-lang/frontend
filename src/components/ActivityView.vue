<script setup>
const props = defineProps({
  activities: { type: Array, required: true }
});
const emit = defineEmits(['add-to-cart']);

const handleJoin = (activity) => emit('add-to-cart', activity);
</script>

<template>
  <div class="activities-grid">
    <div v-for="act in activities" :key="act._id" class="card">
      <img :src="act.image" :alt="act.title" />
      <h3>{{ act.title }}</h3>
      <p class="meta">{{ act.category }} • {{ act.ageRange }}</p>
      <p>{{ act.description }}</p>
      <p>Instructor: {{ act.instructor }}</p>
      <p class="price">£{{ act.price }}</p>
      <p>Joined: {{ act.joined }} / {{ act.capacity }}</p>
      <button @click="handleJoin(act)" :disabled="act.joined >= act.capacity">
        {{ act.joined >= act.capacity ? 'Full' : 'Add to Cart' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}
.card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 3px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}
.card:hover { transform: translateY(-5px); }
.card img { width: 100%; height: 180px; object-fit: cover; }
.card h3 { margin: 10px; }
.card .meta, .card .price { margin: 0 10px; font-size: 14px; }
.card p { margin: 5px 10px; }
.card button {
  margin: 10px;
  padding: 8px 12px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.card button:hover { background-color: #357ab8; }
.card button:disabled { background-color: #aaa; cursor: not-allowed; }
</style>
