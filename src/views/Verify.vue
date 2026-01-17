<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import {
  sendEmailVerification,
  verifyBeforeUpdateEmail,
} from "firebase/auth"
import { auth } from "@/firebase"

const router = useRouter()

const user = ref(null)
const newEmail = ref("")
const loading = ref(false)
const message = ref("")
const error = ref("")
const canResend = ref(true)

let intervalId = null

onMounted(() => {
  user.value = auth.currentUser

  if (!user.value) {
    router.replace("/auth")
    return
  }

  // Auto-check verification status
  intervalId = setInterval(async () => {
    await user.value.reload()
    if (user.value.emailVerified) {
      clearInterval(intervalId)
      router.replace("/dashboard")
    }
  }, 4000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})

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
  } catch {
    error.value = "Please wait before requesting again."
  } finally {
    loading.value = false
  }
}

const changeEmailAndResend = async () => {
  if (!newEmail.value || !user.value) return

  loading.value = true
  message.value = ""
  error.value = ""

  try {
    await verifyBeforeUpdateEmail(user.value, newEmail.value)
    message.value = "Verification sent to the new email."
    canResend.value = false
    setTimeout(() => (canResend.value = true), 60000)
  } catch {
    error.value = "Please log in again to change your email."
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="page">
    <div class="card">
      <h1 class="brand">Wabisabi</h1>
      <p class="subtitle">Verify your email to continue</p>

      <p class="email">{{ user?.email }}</p>

      <input
        v-model="newEmail"
        type="email"
        placeholder="Change email (optional)"
      />

      <button
        class="primary"
        :disabled="loading"
        @click="changeEmailAndResend"
      >
        Change email & resend
      </button>

      <button
        class="secondary"
        :disabled="loading || !canResend"
        @click="resendVerification"
      >
        Resend verification email
      </button>

      <p v-if="message" class="success">{{ message }}</p>
      <p v-if="error" class="error">{{ error }}</p>

      <p class="hint">
        We’ll redirect you automatically once verified.
      </p>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(
      circle at top,
      #34d399 0%,
      transparent 55%
    ),
    linear-gradient(180deg, #020617, #000);
  font-family: system-ui, -apple-system, BlinkMacSystemFont;
}

.card {
  width: 100%;
  max-width: 420px;
  background: #0b0f14;
  padding: 2.6rem;
  border-radius: 22px;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.6);
  color: white;
  text-align: center;
}

.brand {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.subtitle {
  color: #9ca3af;
  margin-bottom: 1.6rem;
  font-size: 0.95rem;
}

.email {
  font-size: 0.9rem;
  color: #34d399;
  margin-bottom: 1.4rem;
  word-break: break-all;
}

input {
  width: 100%;
  padding: 0.75rem 0.9rem;
  margin-bottom: 1rem;
  border-radius: 12px;
  border: 1px solid #1f2933;
  background: #020617;
  color: white;
}

input:focus {
  outline: none;
  border-color: #34d399;
  box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.25);
}

button {
  width: 100%;
  padding: 0.8rem;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.primary {
  background: #34d399;
  color: #020617;
  margin-bottom: 0.75rem;
}

.secondary {
  background: transparent;
  border: 1px solid #34d399;
  color: #34d399;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success {
  color: #34d399;
  margin-top: 1rem;
}

.error {
  color: #f87171;
  margin-top: 1rem;
}

.hint {
  margin-top: 1.4rem;
  font-size: 0.85rem;
  color: #9ca3af;
}
</style>
