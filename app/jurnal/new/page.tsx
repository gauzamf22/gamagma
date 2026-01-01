"use client"

export const dynamic = 'force-dynamic'


import type React from "react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, Upload, Link as LinkIcon, X, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default function NewJournalPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [coverImageUrl, setCoverImageUrl] = useState("")
  const [urlInput, setUrlInput] = useState("")
  const [preview, setPreview] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [createdByName, setCreatedByName] = useState<string>("")
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/auth/login")
      } else {
        setUserId(user.id)
        
        // Set default dari user metadata, tapi bisa diedit
        const displayName = user.user_metadata?.full_name || 
                           user.user_metadata?.name || 
                           user.email?.split('@')[0] || 
                           ''
        
        setCreatedByName(displayName)
      }
    }
    checkAuth()
  }, [router, supabase])

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      setUploadError("")
      
      if (!e.target.files || e.target.files.length === 0) {
        return
      }

      const file = e.target.files[0]
      
      if (!file.type.startsWith("image/")) {
        setUploadError("File harus berupa gambar!")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Ukuran file maksimal 5MB!")
        return
      }

      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = fileName

      const { error: uploadError } = await supabase.storage
        .from("journal-covers")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false
        })

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from("journal-covers")
        .getPublicUrl(filePath)

      setPreview(publicUrl)
      setCoverImageUrl(publicUrl)

    } catch (error: any) {
      console.error("Error uploading image:", error)
      setUploadError(error.message || "Gagal upload gambar!")
    } finally {
      setUploading(false)
    }
  }

  const handleUrlSubmit = () => {
    setUploadError("")
    
    if (!urlInput.trim()) {
      setUploadError("URL tidak boleh kosong!")
      return
    }

    try {
      new URL(urlInput)
    } catch {
      setUploadError("URL tidak valid!")
      return
    }

    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]
    const hasImageExt = imageExtensions.some(ext => 
      urlInput.toLowerCase().includes(ext)
    )
    
    if (!hasImageExt && !urlInput.includes("placeholder")) {
      setUploadError("⚠️ URL mungkin bukan gambar, tapi akan tetap disimpan")
    }

    setPreview(urlInput)
    setCoverImageUrl(urlInput)
  }

  const clearImage = () => {
    setPreview("")
    setUrlInput("")
    setCoverImageUrl("")
    setUploadError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!userId) {
      setError("Anda harus login terlebih dahulu")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.from("alumni_journals").insert({
        author_id: userId,
        title,
        content,
        category,
        cover_image_url: coverImageUrl || null,
        created_by_name: createdByName || null,
      })

      if (error) throw error

      router.push("/jurnal")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Terjadi kesalahan saat mempublikasikan jurnal")
    } finally {
      setIsLoading(false)
    }
  }

  if (!userId) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/jurnal">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Link>
      </Button>

      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Tulis Jurnal Baru</CardTitle>
            <CardDescription>Bagikan pengalaman dan ceritamu di UGM</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                
                <div className="grid gap-2">
                  <Label htmlFor="title">Judul Artikel</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Masukkan judul artikel"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* FIELD CREATED BY - BISA DIEDIT */}
                <div className="grid gap-2">
                  <Label htmlFor="createdBy">Dibuat oleh (Opsional)</Label>
                  <Input
                    id="createdBy"
                    type="text"
                    placeholder="Nama penulis atau biarkan kosong"
                    value={createdByName}
                    onChange={(e) => setCreatedByName(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    💡 Bisa pakai nama lengkap, nama panggilan, atau biarkan kosong
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Academic">Academic</SelectItem>
                      <SelectItem value="Campus Life">Campus Life</SelectItem>
                      <SelectItem value="Tips">Tips</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Cover Image (Opsional)</Label>

                  {preview && (
                    <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                      <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-cover"
                        onError={() => setUploadError("Gagal memuat gambar. Periksa URL-nya.")}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={clearImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {!preview && (
                    <Tabs defaultValue="upload" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload File
                        </TabsTrigger>
                        <TabsTrigger value="url">
                          <LinkIcon className="h-4 w-4 mr-2" />
                          Paste URL
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="upload" className="space-y-4">
                        <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-4">
                            Klik tombol di bawah untuk upload gambar
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            disabled={uploading}
                            onClick={() => document.getElementById("file-upload")?.click()}
                          >
                            {uploading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                Pilih File
                              </>
                            )}
                          </Button>
                          <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={uploadFile}
                            className="hidden"
                            disabled={uploading}
                          />
                          <p className="text-xs text-muted-foreground mt-2">
                            Max 5MB • JPG, PNG, GIF, WebP
                          </p>
                        </div>
                      </TabsContent>

                      <TabsContent value="url" className="space-y-4">
                        <div className="space-y-2">
                          <Input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleUrlSubmit())}
                          />
                          <Button
                            type="button"
                            onClick={handleUrlSubmit}
                            className="w-full"
                          >
                            <LinkIcon className="h-4 w-4 mr-2" />
                            Gunakan URL Ini
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>✅ Bisa pakai URL dari:</p>
                          <ul className="list-disc list-inside ml-2 space-y-1">
                            <li>Google Drive (direct link)</li>
                            <li>Imgur, Cloudinary, imgbb</li>
                            <li>Website lain yang public</li>
                          </ul>
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}

                  {uploadError && (
                    <div className={`text-sm p-3 rounded ${
                      uploadError.includes("⚠️") 
                        ? "bg-yellow-50 text-yellow-800" 
                        : "bg-red-50 text-red-800"
                    }`}>
                      {uploadError}
                    </div>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="content">Konten Artikel</Label>
                  <Textarea
                    id="content"
                    placeholder="Tulis konten artikel di sini..."
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={15}
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Mempublikasikan..." : "Publikasikan Jurnal"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
