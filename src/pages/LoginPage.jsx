import React, { useState } from 'react'
import { Lock, Shield, User, Loader2 } from 'lucide-react'
import { BackgroundFX } from '../components/BackgroundFX.jsx'
import { Button } from '../components/Button.jsx'
import { FieldLabel, TextField } from '../components/Field.jsx'
import { supabase } from '../lib/supabase'

export function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Fetch user data including account_status
      const { data: staff, error } = await supabase
        .from('tbl_receptionist')
        .select('receptionist_id, receptionist_name, is_admin, account_status')
        .eq('username', username)
        .eq('password', password)
        .single()

      // 1. Check if user exists/credentials are right
      if (error || !staff) {
        throw new Error("Access Denied: Invalid username or password.")
      }

      // 2. STATUS GATE: Block anyone not 'Active'
      if (staff.account_status !== 'Active') {
        throw new Error(`Access Denied: Your account is currently ${staff.account_status}. Please contact the Owner.`)
      }

      // 3. Save session if everything is good
      localStorage.setItem('staff_id', staff.receptionist_id)
      localStorage.setItem('staff_name', staff.receptionist_name)
      localStorage.setItem('is_admin', staff.is_admin)

      onLoginSuccess()

    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100">
      <div className="relative min-h-screen">
        <BackgroundFX intensity="login" />
        <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
          <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
            
            <div className="hidden md:block">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-widest text-zinc-400 ring-1 ring-white/10">
                <span className="h-1.5 w-1.5 rounded-full bg-[#CCFF00] shadow-[0_0_25px_rgba(204,255,0,0.35)]" />
                STAFF ACCESS
              </div>
              <h1 className="mt-5 text-5xl font-black tracking-tight uppercase">
                LVLUP <span className="text-[#CCFF00]">Fitness</span>
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-zinc-400 font-medium">
                Authorized Personnel Only. Please log in with your credentials to manage transactions and member data.
              </p>
            </div>

            <div className="mx-auto w-full max-w-md">
              <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl ring-1 ring-white/15 shadow-2xl">
                <div className="relative p-7">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-black/25 px-3 py-1 text-[11px] font-semibold tracking-widest text-zinc-400 ring-1 ring-white/10">
                        <Shield className="h-3.5 w-3.5 text-[#CCFF00]" />
                        SECURE CONSOLE
                      </div>
                      <div className="mt-4 text-2xl font-black tracking-tight uppercase italic">Staff Login</div>
                    </div>
                  </div>

                  <form className="space-y-4" onSubmit={handleLogin}>
                    <div className="space-y-2">
                      <FieldLabel htmlFor="username">USERNAME</FieldLabel>
                      <TextField
                        id="username"
                        value={username}                                              
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter Username"
                        leading={<User className="h-4 w-4" />}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <FieldLabel htmlFor="password">PASSWORD</FieldLabel>
                      <TextField
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••"
                        leading={<Lock className="h-4 w-4" />}
                        required
                      />
                    </div>

                    <div className="pt-2">
                      <Button className="w-full" variant="primary" type="submit" disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Shield className="h-4 w-4 mr-2" />}
                        {loading ? 'Verifying...' : 'Enter Console'}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}