import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBm_ysQBFMrIqP-hh9ZMtg8kzbuTHYjBOU",
  authDomain: "wabisabi-143.firebaseapp.com",
  projectId: "wabisabi-143",
  storageBucket: "wabisabi-143.firebasestorage.app",
  messagingSenderId: "367895846289",
  appId: "1:367895846289:web:0796845b63fe37a42b0e30"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
