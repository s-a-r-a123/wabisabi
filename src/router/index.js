import { createRouter, createWebHistory } from "vue-router"
import { getAuth } from "firebase/auth"

// Views
import Auth from "@/views/Auth.vue"
import Verify from "@/views/Verify.vue"
import Dashboard from "@/views/Dashboard.vue"
import Profile from "@/views/Profile.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/auth",
    },

    {
      path: "/auth",
      component: Auth,
    },

    {
      path: "/verify",
      component: Verify,
      meta: { requiresAuth: true },
    },

    {
      path: "/dashboard",
      component: Dashboard,
      meta: { requiresAuth: true, requiresVerified: true },
    },

    {
      path: "/profile",
      component: Profile,
      meta: { requiresAuth: true },
    },
  ],
})

/* 🔒 GLOBAL AUTH GUARD */
router.beforeEach(async (to, from, next) => {
  const auth = getAuth()
  const user = auth.currentUser

  // 🔐 Route requires authentication
  if (to.meta.requiresAuth && !user) {
    return next("/auth")
  }

  // 🚫 Logged-in users should not see auth page
  if (to.path === "/auth" && user) {
    await user.reload()
    return next(user.emailVerified ? "/dashboard" : "/verify")
  }

  // 📧 Route requires verified email
  if (to.meta.requiresVerified && user) {
    await user.reload()
    if (!user.emailVerified) {
      return next("/verify")
    }
  }

  next()
})

export default router
