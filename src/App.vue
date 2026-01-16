<script setup>
import { ref, computed, onMounted } from "vue"
import { useRoute } from "vue-router"
import { useAuthStore } from "@/stores/authStore"

const route = useRoute()
const authStore = useAuthStore()

// Show nav only on authenticated pages
const showNav = computed(() =>
  ["/dashboard", "/profile"].includes(route.path)
)

// 🍔 Mobile menu
const menuOpen = ref(false)

// 🌗 Theme state
const theme = ref(localStorage.getItem("theme") || "dark")

const toggleTheme = () => {
  theme.value = theme.value === "dark" ? "light" : "dark"
  localStorage.setItem("theme", theme.value)
  document.documentElement.setAttribute("data-theme", theme.value)
}

// Init auth + theme once
onMounted(() => {
  authStore.init()
  document.documentElement.setAttribute("data-theme", theme.value)
})
</script>

<template>
  <!-- NAVBAR -->
  <nav v-if="showNav" class="nav">
    <span class="brand">Wabisabi</span>

    <!-- Desktop navigation -->
    <div class="links desktop">
      <router-link to="/dashboard">Dashboard</router-link>
      <router-link to="/profile">Profile</router-link>

      <!-- Theme toggle -->
      <button
        class="icon theme-btn"
        :class="theme"
        @click="toggleTheme"
        aria-label="Toggle theme"
      >
        {{ theme === "dark" ? "🌙" : "☀️" }}
      </button>
    </div>

    <!-- Mobile hamburger -->
    <button
      class="icon mobile"
      @click="menuOpen = !menuOpen"
      aria-label="Menu"
    >
      ☰
    </button>
  </nav>

  <!-- MOBILE DRAWER -->
  <div v-if="menuOpen" class="drawer">
    <router-link @click="menuOpen = false" to="/dashboard">
      Dashboard
    </router-link>
    <router-link @click="menuOpen = false" to="/profile">
      Profile
    </router-link>

    <button
      class="drawer-btn theme-btn"
      :class="theme"
      @click="toggleTheme"
    >
      {{ theme === "dark" ? "Switch to Light" : "Switch to Dark" }}
    </button>
  </div>

  <!-- ROUTES -->
  <router-view />
</template>

<style scoped>
/* ===== NAVBAR ===== */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2.5rem;
  background: #00e2ad;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.brand {
  font-size: 1.6rem;
  font-weight: 800;
  color: #020617;
}

/* ===== LINKS ===== */
.links {
  display: flex;
  align-items: center;
}

.links a {
  margin-left: 1.5rem;
  color: #020617;
  text-decoration: none;
  font-weight: 500;
}

.links a.router-link-active {
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* ===== ICON BUTTONS ===== */
.icon {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: 1.2rem;
}

/* ===== THEME BUTTON STATES ===== */
.theme-btn.dark {
  background: #020617;
  color: #00e2ad;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.theme-btn.light {
  background: #ffffff;
  color: #020617;
  border: 1px solid rgba(0, 0, 0, 0.15);
}

.icon.theme-btn {
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
}

.theme-btn:hover {
  opacity: 0.85;
}

/* ===== MOBILE ===== */
.mobile {
  display: none;
}

/* ===== DRAWER ===== */
.drawer {
  background: var(--surface, #0b0f14);
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.drawer a {
  color: var(--text, #ffffff);
  text-decoration: none;
  font-weight: 500;
}

.drawer-btn {
  background: transparent;
  border: 1px solid #00e2ad;
  color: #00e2ad;
  padding: 0.6rem;
  border-radius: 8px;
  cursor: pointer;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .desktop {
    display: none;
  }

  .mobile {
    display: block;
  }
}
</style>
