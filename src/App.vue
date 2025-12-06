<template>
  <div id="app">
    <!-- Header -->
    <header class="header">
      <h1><i class="fas fa-graduation-cap"></i> LearnHub</h1>
      <button class="cart-btn" @click="showCart = !showCart" :disabled="cart.length === 0 && !showCart">
        <i class="fas fa-shopping-cart"></i>
        Cart ({{ cart.length }})
      </button>
    </header>

    <!-- Cart View -->
    <div v-if="showCart" class="cart-view">
      <h2>Your Cart</h2>
      
      <div v-if="cart.length === 0" class="empty-cart">
        <p>Your cart is empty</p>
        <button @click="showCart = false">Continue Shopping</button>
      </div>

      <div v-else>
        <div class="cart-items">
          <div v-for="(item, index) in cart" :key="index" class="cart-item">
            <div class="cart-item-info">
              <i :class="'fas ' + item.icon"></i>
              <div>
                <strong>{{ item.subject }}</strong>
                <p>{{ item.location }} - £{{ item.price }}</p>
              </div>
            </div>
            <button class="remove-btn" @click="removeFromCart(index)">
              <i class="fas fa-trash"></i> Remove
            </button>
          </div>
        </div>

        <div class="cart-total">
          <strong>Total: £{{ cartTotal }}</strong>
        </div>

        <!-- Checkout Form -->
        <div class="checkout-form">
          <h3>Checkout</h3>
          <div class="form-group">
            <label>Name (letters only):</label>
            <input v-model="checkout.name" type="text" placeholder="Your Name" 
                   :class="{ invalid: checkout.name && !isNameValid }">
            <small v-if="checkout.name && !isNameValid" class="error">Letters only</small>
          </div>
          <div class="form-group">
            <label>Phone (numbers only):</label>
            <input v-model="checkout.phone" type="text" placeholder="Your Phone"
                   :class="{ invalid: checkout.phone && !isPhoneValid }">
            <small v-if="checkout.phone && !isPhoneValid" class="error">Numbers only</small>
          </div>
          <button class="checkout-btn" @click="placeOrder" 
                  :disabled="!canCheckout">
            <i class="fas fa-check"></i> Place Order
          </button>
        </div>
      </div>

      <button class="back-btn" @click="showCart = false" v-if="cart.length > 0">
        <i class="fas fa-arrow-left"></i> Continue Shopping
      </button>
    </div>

    <!-- Lessons View -->
    <div v-else>
      <!-- Search -->
      <div class="search-bar">
        <input v-model="searchQuery" @input="searchLessons" placeholder="Search lessons...">
      </div>

      <!-- Sort Controls -->
      <div class="sort-controls">
        <span>Sort by:</span>
        <button v-for="field in sortFields" :key="field" 
                @click="toggleSort(field)"
                :class="{ active: sortBy === field }">
          {{ field }}
          <i v-if="sortBy === field" :class="sortOrder === 'asc' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
        </button>
      </div>

      <!-- Lessons Grid -->
      <div class="lessons-grid">
        <div v-for="lesson in sortedLessons" :key="lesson._id" class="lesson-card">
          <div class="lesson-icon">
            <i :class="'fas ' + lesson.icon"></i>
          </div>
          <h3>{{ lesson.subject }}</h3>
          <p class="location"><i class="fas fa-map-marker-alt"></i> {{ lesson.location }}</p>
          <p class="price">£{{ lesson.price }}</p>
          <p class="spaces" :class="{ 'low-spaces': lesson.spaces <= 2 }">
            <i class="fas fa-users"></i> {{ lesson.spaces }} spaces left
          </p>
          <button class="add-btn" @click="addToCart(lesson)" :disabled="lesson.spaces === 0">
            <i class="fas fa-plus"></i> 
            {{ lesson.spaces === 0 ? 'Fully Booked' : 'Add to Cart' }}
          </button>
        </div>
      </div>

      <!-- Loading spinner -->
      <div v-if="loading" class="loading">
        <i class="fas fa-spinner fa-spin"></i> Loading lessons...
      </div>

      <!-- Error message -->
      <div v-if="error" class="error-message">
        <i class="fas fa-exclamation-circle"></i> {{ error }}
        <button @click="fetchLessons">Retry</button>
      </div>

      <p v-if="!loading && sortedLessons.length === 0" class="no-results">No lessons found</p>
    </div>

    <!-- Order Success Modal -->
    <div v-if="orderSuccess" class="modal-overlay" @click="orderSuccess = false">
      <div class="modal" @click.stop>
        <i class="fas fa-check-circle success-icon"></i>
        <h2>Order Placed!</h2>
        <p>Thank you for your order.</p>
        <button @click="orderSuccess = false">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
// API Base URL - change this for production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default {
  name: 'App',
  data() {
    return {
      lessons: [],
      cart: [],
      showCart: false,
      orderSuccess: false,
      loading: false,
      error: null,
      searchQuery: '',
      sortBy: 'subject',
      sortOrder: 'asc',
      sortFields: ['subject', 'location', 'price', 'spaces'],
      checkout: {
        name: '',
        phone: ''
      }
    };
  },
  computed: {
    sortedLessons() {
      return [...this.lessons].sort((a, b) => {
        let valA = a[this.sortBy];
        let valB = b[this.sortBy];
        
        if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }
        
        if (this.sortOrder === 'asc') {
          return valA > valB ? 1 : -1;
        } else {
          return valA < valB ? 1 : -1;
        }
      });
    },
    cartTotal() {
      return this.cart.reduce((sum, item) => sum + item.price, 0);
    },
    isNameValid() {
      return /^[a-zA-Z\s]+$/.test(this.checkout.name);
    },
    isPhoneValid() {
      return /^[0-9]+$/.test(this.checkout.phone);
    },
    canCheckout() {
      return this.cart.length > 0 && 
             this.checkout.name && this.isNameValid &&
             this.checkout.phone && this.isPhoneValid;
    }
  },
  mounted() {
    this.fetchLessons();
  },
  methods: {
    async fetchLessons() {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch(`${API_URL}/lessons`);
        if (!res.ok) throw new Error('Failed to fetch lessons');
        this.lessons = await res.json();
      } catch (err) {
        this.error = 'Failed to load lessons. Please try again.';
        console.error('Error fetching lessons:', err);
      } finally {
        this.loading = false;
      }
    },
    searchLessons() {
      if (!this.searchQuery.trim()) {
        this.fetchLessons();
        return;
      }
      fetch(`${API_URL}/search?q=${encodeURIComponent(this.searchQuery)}`)
        .then(res => res.json())
        .then(data => {
          this.lessons = data;
        })
        .catch(err => console.error('Error searching:', err));
    },
    toggleSort(field) {
      if (this.sortBy === field) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortBy = field;
        this.sortOrder = 'asc';
      }
    },
    addToCart(lesson) {
      if (lesson.spaces > 0) {
        this.cart.push({ ...lesson });
        lesson.spaces--;
      }
    },
    removeFromCart(index) {
      const item = this.cart[index];
      // Restore spaces to the original lesson
      const lesson = this.lessons.find(l => l._id === item._id);
      if (lesson) {
        lesson.spaces++;
      }
      this.cart.splice(index, 1);
    },
    async placeOrder() {
      // Group cart items by lesson ID
      const lessonMap = {};
      this.cart.forEach(item => {
        if (!lessonMap[item._id]) {
          lessonMap[item._id] = 0;
        }
        lessonMap[item._id]++;
      });

      const lessonIDs = Object.keys(lessonMap);
      const numSpaces = Object.values(lessonMap);

      try {
        // 1. Create order
        const orderRes = await fetch(`${API_URL}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: this.checkout.name,
            phone: this.checkout.phone,
            lessonIDs,
            numSpaces
          })
        });

        if (!orderRes.ok) throw new Error('Failed to create order');

        // 2. Update spaces for each lesson in DB
        for (const lesson of this.lessons) {
          if (lessonMap[lesson._id]) {
            await fetch(`${API_URL}/lessons/${lesson._id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ spaces: lesson.spaces })
            });
          }
        }

        // 3. Clear cart and show success
        this.cart = [];
        this.checkout = { name: '', phone: '' };
        this.showCart = false;
        this.orderSuccess = true;

      } catch (err) {
        console.error('Order error:', err);
        alert('Failed to place order. Please try again.');
      }
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 15px 25px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.header h1 {
  color: #667eea;
  font-size: 1.8rem;
}

.cart-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.cart-btn:hover:not(:disabled) {
  background: #5a67d8;
  transform: translateY(-2px);
}

.cart-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.search-bar {
  margin-bottom: 20px;
}

.search-bar input {
  width: 100%;
  padding: 15px 20px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.sort-controls {
  background: white;
  padding: 15px 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.sort-controls span {
  font-weight: 600;
  color: #333;
}

.sort-controls button {
  background: #f0f0f0;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  text-transform: capitalize;
  transition: all 0.2s;
}

.sort-controls button.active {
  background: #667eea;
  color: white;
}

.sort-controls button:hover:not(.active) {
  background: #e0e0e0;
}

.lessons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.lesson-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.lesson-card:hover {
  transform: translateY(-5px);
}

.lesson-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}

.lesson-icon i {
  font-size: 1.8rem;
  color: white;
}

.lesson-card h3 {
  color: #333;
  margin-bottom: 10px;
}

.lesson-card .location {
  color: #666;
  margin-bottom: 8px;
}

.lesson-card .price {
  font-size: 1.4rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 8px;
}

.lesson-card .spaces {
  color: #28a745;
  margin-bottom: 15px;
}

.lesson-card .spaces.low-spaces {
  color: #dc3545;
}

.add-btn {
  width: 100%;
  background: #28a745;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.add-btn:hover:not(:disabled) {
  background: #218838;
}

.add-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.cart-view {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.cart-view h2 {
  margin-bottom: 20px;
  color: #333;
}

.empty-cart {
  text-align: center;
  padding: 40px;
}

.empty-cart button {
  margin-top: 20px;
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
}

.cart-items {
  margin-bottom: 20px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.cart-item-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.cart-item-info i {
  font-size: 1.5rem;
  color: #667eea;
}

.remove-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.cart-total {
  font-size: 1.4rem;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.checkout-form {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.checkout-form h3 {
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.form-group input.invalid {
  border-color: #dc3545;
}

.form-group .error {
  color: #dc3545;
  font-size: 0.85rem;
}

.checkout-btn {
  width: 100%;
  background: #28a745;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
}

.checkout-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.back-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  max-width: 400px;
}

.success-icon {
  font-size: 4rem;
  color: #28a745;
  margin-bottom: 20px;
}

.modal h2 {
  margin-bottom: 10px;
}

.modal button {
  margin-top: 20px;
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  cursor: pointer;
}

.no-results {
  text-align: center;
  padding: 40px;
  color: white;
  font-size: 1.2rem;
}

.loading {
  text-align: center;
  padding: 60px;
  color: white;
  font-size: 1.5rem;
}

.loading i {
  margin-right: 10px;
}

.error-message {
  text-align: center;
  padding: 30px;
  background: #f8d7da;
  color: #721c24;
  border-radius: 10px;
  margin: 20px 0;
}

.error-message button {
  margin-left: 15px;
  background: #721c24;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
