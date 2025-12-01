<template>
  <div class="container">
    <h1>Activities</h1>

    <!-- Add new activity -->
    <input v-model="newActivity" placeholder="New activity" />
    <button @click="addActivity">Add Activity</button>

    <!-- List of activities -->
    <ul>
      <li v-for="activity in activities" :key="activity._id">
        {{ activity.name }}
        <button @click="deleteActivity(activity._id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activities: [],
      newActivity: ''
    };
  },
  async created() {
    await this.fetchActivities();
  },
  methods: {
    // Fetch all activities
    async fetchActivities() {
      try {
        const res = await fetch('/api/activities'); // uses proxy
        if (!res.ok) throw new Error('Failed to fetch');
        this.activities = await res.json();
      } catch (err) {
        console.error('Error fetching activities:', err);
      }
    },

    // Add new activity
    async addActivity() {
      if (!this.newActivity) return;
      try {
        const res = await fetch('/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: this.newActivity })
        });
        if (!res.ok) throw new Error('Failed to add');
        const data = await res.json();
        this.activities.push(data);
        this.newActivity = '';
      } catch (err) {
        console.error('Error adding activity:', err);
      }
    },

    // Delete activity
    async deleteActivity(id) {
      try {
        const res = await fetch(`/api/activities/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete');
        this.activities = this.activities.filter(act => act._id !== id);
      } catch (err) {
        console.error('Error deleting activity:', err);
      }
    }
  }
};
</script>

<style>
.container {
  max-width: 600px;
  margin: 50px auto;
  font-family: Arial, sans-serif;
}
input {
  padding: 8px;
  margin-right: 8px;
}
button {
  padding: 6px 12px;
  cursor: pointer;
}
ul {
  margin-top: 20px;
  padding-left: 0;
  list-style: none;
}
li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
</style>
