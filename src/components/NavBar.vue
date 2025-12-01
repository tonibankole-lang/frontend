<script setup>
defineProps({
  cartCount: {
    type: Number,
    default: 0
  },
  isAuthenticated: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['login', 'logout', 'navigate', 'view-cart'])

const showLoginModal = (type) => {
  emit('login', type)
}
</script>

<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-brand" @click="emit('navigate', 'activities')">
        <span class="brand-name">After school activities</span>
      </div>

      <div class="nav-links">
        <button @click="emit('navigate', 'activities')" class="nav-link">
          Activities
        </button>
        
        <button @click="emit('view-cart')" class="nav-link cart-button">
          🛒 Cart
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
        </button>

        <div v-if="isAuthenticated" class="user-section">
          <button @click="emit('navigate', 'dashboard')" class="nav-link">
            👤 {{ user.name }}
          </button>
          <button @click="emit('logout')" class="logout-btn">
            Logout
          </button>
        </div>

        <div v-else class="auth-buttons">
          <button @click="showLoginModal('student')" class="login-btn student-btn">
            Student Login
          </button>
          <button @click="showLoginModal('parent')" class="login-btn parent-btn">
            Parent Login
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background: transparent;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 14px;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.nav-brand:hover {
  transform: scale(1.05);
}

.logo {
  font-size: 2rem;
}

.brand-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-heading);
  font-family: 'Playfair Display', Poppins, Inter, serif;
  letter-spacing: 0.2px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-link {
  background: transparent;
  border: none;
  color: var(--vt-c-black-mute);
  padding: 0.45rem 0.9rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: color 0.18s ease, transform 0.18s ease;
  position: relative;
}

.nav-link:hover { color: var(--accent); transform: translateY(-2px); }

.cart-button {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
  box-shadow: 0 6px 14px rgba(16,24,40,0.08);
}

.user-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logout-btn {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--vt-c-black);
  padding: 0.4rem 0.85rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.18s ease, transform 0.12s ease;
}

.logout-btn:hover { background: linear-gradient(90deg, rgba(0,0,0,0.03), rgba(0,0,0,0.02)); transform: translateY(-2px); }

.auth-buttons {
  display: flex;
  gap: 0.5rem;
}

.login-btn {
  border: none;
  padding: 0.45rem 0.85rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.18s ease;
  font-weight: 600;
}

.student-btn {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--vt-c-black);
}

.student-btn:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-2px); }

.parent-btn {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--vt-c-black);
}

.parent-btn:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-2px); }

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 1rem;
    padding: 0 1rem;
  }

  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
  }

  .brand-name {
    font-size: 1.2rem;
  }

  .nav-link,
  .login-btn,
  .logout-btn {
    font-size: 0.85rem;
    padding: 0.4rem 0.8rem;
  }

  .auth-buttons {
    flex-direction: column;
    width: 100%;
  }

  .auth-buttons .login-btn {
    width: 100%;
  }
}
</style>

