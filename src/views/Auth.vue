<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth"
import { auth } from "@/firebase"

const router = useRouter()

const mode = ref("login") // 'login' | 'signup'
const email = ref("")
const password = ref("")
const loading = ref(false)
const error = ref("")

// 🔁 Redirect if already logged in
onMounted(async () => {
  if (auth.currentUser) {
    await auth.currentUser.reload()
    router.replace(
      auth.currentUser.emailVerified
        ? "/dashboard"
        : "/verify"
    )
  }
})

const submit = async () => {
  error.value = ""
  loading.value = true

  try {
    if (mode.value === "login") {
      const cred = await signInWithEmailAndPassword(
        auth,
        email.value,
        password.value
      )

      router.replace(
        cred.user.emailVerified
          ? "/dashboard"
          : "/verify"
      )
    } else {
      const cred = await createUserWithEmailAndPassword(
        auth,
        email.value,
        password.value
      )

      await sendEmailVerification(cred.user)
      router.replace("/verify")
    }
  } catch (err) {
    error.value =
      err.code === "auth/invalid-credential"
        ? "Invalid email or password."
        : getAuthErrorMessage(err)
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
        {{ mode === "login"
          ? "Sign in to continue"
          : "Create your account" }}
      </p>

      <form @submit.prevent="submit">
        <label>Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="you@example.com"
          required
        />

        <label>Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="••••••••"
          required
        />

        <button :disabled="loading">
          {{ loading
            ? "Please wait…"
            : mode === "login"
              ? "Login"
              : "Sign up" }}
        </button>

        <p v-if="error" class="error">{{ error }}</p>
      </form>

      <button
        class="toggle"
        @click="mode = mode === 'login' ? 'signup' : 'login'"
        :disabled="loading"
      >
        {{ mode === "login"
          ? "Don’t have an account? Sign up"
          : "Already have an account? Login" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
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
  max-width: 420px;
  background: #0b0f14;
  padding: 2.5rem;
  border-radius: 18px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
  color: white;
}

.brand {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  letter-spacing: 0.5px;
}

.subtitle {
  text-align: center;
  color: #9ca3af;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

label {
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.85rem;
  color: #cbd5e1;
}

input {
  width: 100%;
  padding: 0.75rem 0.85rem;
  margin-bottom: 1.2rem;
  border-radius: 10px;
  border: 1px solid #1f2933;
  font-size: 0.95rem;
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
  padding: 0.8rem;
  border-radius: 10px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  background: #00e2ad;
  color: #020617;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px rgba(0, 226, 173, 0.35);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  margin-top: 1rem;
  color: #f87171;
  font-size: 0.9rem;
  text-align: center;
}

.toggle {
  margin-top: 1.8rem;
  background: transparent;
  color: #00e2ad;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
}

.toggle:hover {
  text-decoration: underline;
}
</style>
