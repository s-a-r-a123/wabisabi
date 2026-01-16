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
const error = ref("")
const message = ref("")
const canResend = ref(true)

let intervalId = null

onMounted(() => {
  user.value = auth.currentUser

  if (!user.value) {
    router.replace("/auth")
    return
  }

  // 🔁 AUTO-REFRESH VERIFICATION STATUS
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

// 🔁 Resend verification
const resendVerification = async () => {
  if (!user.value || !canResend.value) return

  loading.value = true
  error.value = ""
  message.value = ""

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

// 🔐 Change email & resend verification
const changeEmailAndResend = async () => {
  if (!user.value || !newEmail.value) return

  loading.value = true
  error.value = ""
  message.value = ""

  try {
    await verifyBeforeUpdateEmail(user.value, newEmail.value)
    message.value =
      "Verification link sent to the new email."

    canResend.value = false
    setTimeout(() => (canResend.value = true), 60000)
  } catch (err) {
    if (err.code === "auth/too-many-requests") {
      error.value = "Too many requests. Please wait a minute."
    } else if (err.code === "auth/requires-recent-login") {
      error.value = "Please log in again to change your email."
    } else {
      error.value = err.message
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="page">
    <div class="card">
      <h1 class="brand">Wabisabi</h1>

      <p class="subtitle">
        Verify your email to continue
      </p>

      <p class="email">
        {{ user?.email }}
      </p>

      <input
        v-model="newEmail"
        type="email"
        placeholder="Change email (optional)"
      />

      <button
        @click="changeEmailAndResend"
        :disabled="loading"
      >
        Change email & resend
      </button>

      <hr />

      <button
        class="secondary"
        @click="resendVerification"
        :disabled="loading || !canResend"
      >
        Resend verification email
      </button>

      <p v-if="message" class="success">{{ message }}</p>
      <p v-if="error" class="error">{{ error }}</p>

      <p class="hint">
        You’ll be redirected automatically once verified.
      </p>
    </div>
  </div>
</template>

.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #00e2ad, #000);
  font-family: system-ui, -apple-system, BlinkMacSystemFont;
}

.card {
  width: 100%;
  max-width: 440px;
  background: #0b0f14;
  padding: 2.5rem;
  border-radius: 18px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
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
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.email {
  font-size: 0.9rem;
  color: #00e2ad;
  margin-bottom: 1.5rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 10px;
  border: 1px solid #1f2933;
  background: #020617;
  color: white;
}

input:focus {
  outline: none;
  border-color: #00e2ad;
  box-shadow: 0 0 0 3px rgba(0, 226, 173, 0.25);
}

button {
  width: 100%;
  padding: 0.75rem;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  background: #00e2ad;
  color: #020617;
  cursor: pointer;
}

button.secondary {
  background: transparent;
  color: #00e2ad;
  border: 1px solid #00e2ad;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

hr {
  margin: 1.8rem 0;
  border-color: #1f2933;
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
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: #9ca3af;
}
