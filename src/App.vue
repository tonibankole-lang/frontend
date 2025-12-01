<template>
  <div id="app">
    <h1>Activities</h1>

    <p>Number of activities: {{ activities.length }}</p>

    <ul>
      <li v-for="activity in activities" :key="activity._id">
        {{ activity.name }} - {{ activity.duration }}h
        <button @click="deleteActivity(activity._id)">Delete</button>
      </li>
    </ul>

    <form @submit.prevent="addActivity">
      <input v-model="newActivity.name" placeholder="Activity Name" required />
      <input v-model.number="newActivity.duration" type="number" placeholder="Duration" required />
      <button type="submit">Add Activity</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      activities: [],
      newActivity: { name: '', duration: 0 }
    };
  },
  mounted() {
    this.fetchActivities();
  },
  methods: {
    fetchActivities() {
      fetch('http://localhost:4000/api/activities')
        .then(res => res.json())
        .then(data => {
          console.log('Fetched activities:', data);
          this.activities = data;
        })
        .catch(err => console.error('Error fetching activities:', err));
    },
    addActivity() {
      fetch('http://localhost:4000/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.newActivity)
      })
        .then(res => res.json())
        .then(data => {
          this.activities.push(data);
          this.newActivity = { name: '', duration: 0 };
        })
        .catch(err => console.error('Error adding activity:', err));
    },
    deleteActivity(id) {
      fetch(`http://localhost:4000/api/activities/${id}`, { method: 'DELETE' })
        .then(() => this.activities = this.activities.filter(a => a._id !== id))
        .catch(err => console.error('Error deleting activity:', err));
    }
  }
};
</script>

<style scoped>
#app {
  max-width: 600px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  padding: 20px;
}

h1 { text-align: center; }
ul { list-style: none; padding: 0; }
li { margin-bottom: 8px; }
button { margin-left: 10px; }
form { margin-top: 20px; display: flex; gap: 10px; }
</style>
