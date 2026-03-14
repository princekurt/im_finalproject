import React, { useState } from 'react'
import { Lock, User, Loader2 } from 'lucide-react'
import { BackgroundFX } from '../components/BackgroundFX.jsx'
import { Button } from '../components/Button.jsx'
import { FieldLabel, TextField } from '../components/Field.jsx'
import { ThemeToggle } from '../components/ThemeToggle.jsx'
import { supabase } from '../lib/supabase'

export function LoginPage({ onLoginSuccess, theme, onToggleTheme }) {
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
        <div className="absolute right-4 top-4 z-20 md:right-6 md:top-6">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
        <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
          <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
            
            <div className="mx-auto hidden w-full max-w-md md:block">
              <h1 className="font-black tracking-tight uppercase leading-[0.95]">
                <span className="block text-5xl text-[#CCFF00] lg:text-6xl">LVLUP FITNESS GYM</span>
                <span className="mt-2 block text-3xl text-zinc-100 lg:text-4xl">MANAGEMENT SYSTEM</span>
              </h1>
            </div>

            <div className="mx-auto w-full max-w-md">
              <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl ring-1 ring-white/15 shadow-2xl">
                <div className="relative p-7">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <div className="mt-1 text-2xl font-black tracking-tight uppercase italic">Staff Login</div>
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
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        {loading ? 'Verifying...' : 'Log-in'}
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
