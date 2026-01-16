import { defineStore } from "pinia"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/firebase"
import { getAuthErrorMessage } from "@/utils/authErrors"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    ready: false,
  }),

  actions: {
    init() {
      onAuthStateChanged(auth, (user) => {
        this.user = user
        this.ready = true
      })
    },

    logout() {
      this.user = null
    },
  },
})
