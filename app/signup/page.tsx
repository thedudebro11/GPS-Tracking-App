"use client"

import { useState } from "react"
import { signUp } from "@/lib/auth"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSignUp = async () => {
    const { error } = await signUp(email, password)
    if (error) setError(error.message)
    else window.location.href = "/login"
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-sm space-y-4 bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold text-center">Sign Up</h1>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <input className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full border p-2 rounded" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={handleSignUp} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Sign Up</button>
      </div>
    </div>
  )
}
