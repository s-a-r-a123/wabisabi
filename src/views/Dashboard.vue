<script setup>
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { auth } from "@/firebase"
import { signOut } from "firebase/auth"

const router = useRouter()
const user = computed(() => auth.currentUser)

// 🔁 Optional dynamic server data
const serverTime = ref("—")

onMounted(async () => {
  try {
    const res = await fetch("/api/status")
    if (!res.ok) throw new Error("API unavailable")
    const data = await res.json()
    serverTime.value = data.time
  } catch {
    // Local dev or server not connected
    serverTime.value = "Local dev"
  }
})

const logout = async () => {
  await signOut(auth)
  router.replace("/auth")
}
</script>

<template>
  <div class="page">
    <div class="container">
      <h1 class="title">Dashboard</h1>
      <p class="subtitle">You’re signed in to Wabisabi</p>

      <div class="card">
        <div class="row">
          <span class="label">Email</span>
          <span class="value">{{ user?.email }}</span>
        </div>

        <div class="row">
          <span class="label">Status</span>
          <span
            class="badge"
            :class="user?.emailVerified ? 'verified' : 'pending'"
          >
            {{ user?.emailVerified ? "Verified" : "Unverified" }}
          </span>
        </div>

        <div class="row">
          <span class="label">Server</span>
          <span class="value">{{ serverTime }}</span>
        </div>
      </div>

      <div class="actions">
        <router-link to="/profile" class="secondary">
          Go to Profile
        </router-link>

        <button class="danger" @click="logout">
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: calc(100vh - 64px);
  padding: 3rem 2.5rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.subtitle {
  color: var(--muted);
  margin-bottom: 2.5rem;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1.8rem;
  margin-bottom: 2rem;
}

.row {
  display: flex;
  justify-content: space-between;
  padding: 0.6rem 0;
  font-size: 0.95rem;
}

.label {
  color: var(--muted);
}

.value {
  color: var(--accent);
  font-weight: 500;
}

.badge {
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge.verified {
  background: color-mix(in srgb, var(--accent) 15%, transparent);
  color: var(--accent);
}

.badge.pending {
  background: rgba(248, 113, 113, 0.15);
  color: #f87171;
}

.actions {
  display: flex;
  gap: 1rem;
}

button,
a {
  padding: 0.7rem 1.2rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: none;
  border: none;
}

.secondary {
  background: transparent;
  border: 1px solid var(--accent);
  color: var(--accent);
}

.secondary:hover {
  background: color-mix(in srgb, var(--accent) 10%, transparent);
}

.danger {
  background: #dc2626;
  color: white;
}

.danger:hover {
  background: #b91c1c;
}
</style>
