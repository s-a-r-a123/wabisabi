import { auth } from "@/firebase"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth"

// Register user
export async function register(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
}

// Login user
export async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}
