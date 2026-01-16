<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import {
  sendEmailVerification,
  verifyBeforeUpdateEmail,
  signOut,
} from "firebase/auth"
import { auth } from "@/firebase"

const router = useRouter()

const user = computed(() => auth.currentUser)

const newEmail = ref("")
const loading = ref(false)
const message = ref("")
const error = ref("")
const canResend = ref(true)

// 🔁 Resend verification email
const resendVerification = async () => {
  if (!user.value || !canResend.value) return

  loading.value = true
  message.value = ""
  error.value = ""

  try {
    await sendEmailVerification(user.value)
    message.value = "Verification email sent."
    canResend.value = false
    setTimeout(() => (canResend.value = true), 60000)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// 🔐 Change email safely
const changeEmail = async () => {
  if (!newEmail.value || !user.value) return

  loading.value = true
  message.value = ""
  error.value = ""

  try {
    await verifyBeforeUpdateEmail(user.value, newEmail.value)
    message.value = "Verification link sent to your new email."
    newEmail.value = ""
    canResend.value = false
    setTimeout(() => (canResend.value = true), 60000)
  } catch (err) {
    if (err.code === "auth/requires-recent-login") {
      error.value = "Please log in again to change your email."
    } else {
      error.value = err.message
    }
  } finally {
    loading.value = false
  }
}

// 🚪 Logout
const logout = async () => {
  await signOut(auth)
  router.replace("/auth")
}
</script>

<template>
  <div class="page">
    <div class="container">
      <h1 class="title">Profile</h1>
      <p class="subtitle">Manage your account</p>

      <!-- Account info -->
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
            {{ user?.emailVerified ? "Verified" : "Not verified" }}
          </span>
        </div>
      </div>

      <!-- Email actions -->
      <div class="card">
        <h2 class="section">Change email</h2>

        <input
          v-model="newEmail"
          type="email"
          placeholder="New email address"
        />

        <button
          class="primary"
          @click="changeEmail"
          :disabled="loading"
        >
          Change email
        </button>

        <button
          class="secondary"
          @click="resendVerification"
          :disabled="loading || !canResend"
        >
          Resend verification email
        </button>

        <p v-if="message" class="success">{{ message }}</p>
        <p v-if="error" class="error">{{ error }}</p>
      </div>

      <!-- Logout -->
      <button class="danger logout" @click="logout">
        Logout
      </button>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: calc(100vh - 64px);
  background: var(--bg);
  color: var(--text);
  padding: 3rem 2.5rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont;
}

.container {
  max-width: 800px;
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

.section {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
}

.label {
  color: var(--muted);
}

.value {
  color: var(--accent);
  font-weight: 500;
}

.badge {
  padding: 0.25rem 0.6rem;
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

input {
  width: 100%;
  padding: 0.75rem;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  margin-bottom: 1rem;
}

input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--accent) 25%, transparent);
}

button {
  width: 100%;
  padding: 0.75rem;
  border-radius: 10px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  margin-top: 0.5rem;
}

.primary {
  background: var(--accent);
  color: #020617;
}

.secondary {
  background: transparent;
  border: 1px solid var(--accent);
  color: var(--accent);
}

.danger {
  background: #dc2626;
  color: white;
}

.logout {
  margin-top: 1rem;
}

.success {
  color: #34d399;
  margin-top: 1rem;
}

.error {
  color: #f87171;
  margin-top: 1rem;
}
</style>
