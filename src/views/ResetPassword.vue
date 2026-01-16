<script setup>
import { ref } from "vue"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/firebase"

const email = ref("")
const message = ref("")
const error = ref("")
const loading = ref(false)

const resetPassword = async () => {
  error.value = ""
  message.value = ""
  loading.value = true

  try {
    await sendPasswordResetEmail(auth, email.value)
    message.value = "Password reset email sent. Check your inbox."
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth">
    <h1>Reset Password</h1>

    <form @submit.prevent="resetPassword">
      <input
        v-model="email"
        type="email"
        placeholder="Enter your email"
        required
      />

      <button :disabled="loading">
        {{ loading ? "Sending..." : "Send Reset Email" }}
      </button>

      <p v-if="message" class="success">{{ message }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<style scoped>
.auth {
  max-width: 400px;
  margin: 3rem auto;
  font-family: system-ui, sans-serif;
}
input {
  display: block;
  width: 100%;
  padding: 0.7rem;
  margin-bottom: 1rem;
}
button {
  width: 100%;
  padding: 0.7rem;
}
.success {
  color: green;
}
.error {
  color: red;
}
</style>
