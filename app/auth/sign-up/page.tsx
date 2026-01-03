"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function SignUpPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Memproses...")

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    setLoadingMessage("Memproses...")

    // Validation
    if (password !== repeatPassword) {
      setError("Password tidak cocok")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter")
      setIsLoading(false)
      return
    }

    try {
      console.log('🔄 Starting sign up...')
      
      // 1. Sign up user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      console.log('✅ Sign up response:', authData)

      if (signUpError) throw signUpError

      if (!authData.user) {
        throw new Error("Registrasi gagal")
      }

      if (authData.session) {
        // Email confirmation is disabled - auto login successful
        console.log('✅ Auto login successful!')
        setSuccess(true)
        
        // 2. Wait for trigger to create profile
        setLoadingMessage("Menyiapkan profil...")
        console.log('⏳ Waiting for profile creation...')
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // 3. Check if profile exists (max 5 attempts, 1 second each)
        let profileExists = false
        let attempts = 0
        const maxAttempts = 5
        
        while (!profileExists && attempts < maxAttempts) {
          setLoadingMessage(`Memeriksa profil... (${attempts + 1}/${maxAttempts})`)
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', authData.user.id)
            .single()
          
          if (profile) {
            console.log('✅ Profile found!')
            profileExists = true
          } else {
            console.log(`⏳ Profile not found yet, attempt ${attempts + 1}/${maxAttempts}`)
            attempts++
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 1000))
            }
          }
        }
        
        // 4. If profile still doesn't exist, create manually
        if (!profileExists) {
          console.log('⚠️ Profile not created by trigger, creating manually...')
          setLoadingMessage("Membuat profil...")
          
          const { error: createError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              email: email,
              full_name: fullName,
              role: 'user',
              avatar_url: null,
            })
          
          if (createError) {
            console.error('❌ Manual profile creation error:', createError)
          } else {
            console.log('✅ Profile created manually!')
          }
        }
        
        // 5. Redirect to homepage
        setLoadingMessage("Mengalihkan ke beranda...")
        console.log('🚀 Redirecting to homepage...')
        
        setTimeout(() => {
          window.location.href = "/"
        }, 1000)
        
      } else {
        // No session means email confirmation is needed (shouldn't happen)
        console.log('⚠️ No session created, redirecting to login...')
        setSuccess(true)
        setLoadingMessage("Mengalihkan ke halaman login...")
        
        setTimeout(() => {
          window.location.href = "/auth/login"
        }, 2000)
      }

    } catch (error: unknown) {
      console.error("❌ Sign up error:", error)
      setError(error instanceof Error ? error.message : "Terjadi kesalahan saat registrasi")
      setIsLoading(false)
      setLoadingMessage("Memproses...")
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-muted">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Gabung dengan Gamagma.com</CardTitle>
            <CardDescription>Buat akun baru untuk mengakses semua fitur</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Nama Lengkap</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Nama lengkap Anda"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={isLoading || success}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading || success}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimal 6 karakter"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading || success}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="repeat-password">Ulangi Password</Label>
                  <Input
                    id="repeat-password"
                    type="password"
                    placeholder="Ulangi password Anda"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    disabled={isLoading || success}
                  />
                </div>
                
                {error && (
                  <Alert variant="destructive" className="animate-in fade-in-0 slide-in-from-top-2 duration-300">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {success && (
                  <Alert className="border-green-500 bg-green-50 text-green-900 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Registrasi berhasil! Mengalihkan ke beranda...
                    </AlertDescription>
                  </Alert>
                )}
                
                <Button type="submit" className="w-full" disabled={isLoading || success}>
                  {isLoading ? loadingMessage : success ? "Berhasil! ✓" : "Daftar"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Sudah punya akun?{" "}
                <Link href="/auth/login" className="underline underline-offset-4 text-primary hover:text-primary/80">
                  Masuk di sini
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
