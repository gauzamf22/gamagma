'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, X, Link as LinkIcon, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  onImageChange: (url: string) => void
  currentImage?: string
}

export function ImageUpload({ onImageChange, currentImage }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string>(currentImage || '')
  const [urlInput, setUrlInput] = useState('')
  const [error, setError] = useState('')
  const supabase = createClient()

  // Upload file ke Supabase Storage
  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      setError('')
      
      if (!e.target.files || e.target.files.length === 0) {
        return
      }

      const file = e.target.files[0]
      
      // Validasi file type
      if (!file.type.startsWith('image/')) {
        setError('File harus berupa gambar!')
        return
      }

      // Validasi file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran file maksimal 5MB!')
        return
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = fileName

      // Upload ke Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('journal-covers')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('journal-covers')
        .getPublicUrl(filePath)

      setPreview(publicUrl)
      onImageChange(publicUrl)

    } catch (error: any) {
      console.error('Error uploading image:', error)
      setError(error.message || 'Gagal upload gambar!')
    } finally {
      setUploading(false)
    }
  }

  // Pakai URL dari input
  const handleUrlSubmit = () => {
    setError('')
    
    if (!urlInput.trim()) {
      setError('URL tidak boleh kosong!')
      return
    }

    // Validasi URL format
    try {
      new URL(urlInput)
    } catch {
      setError('URL tidak valid!')
      return
    }

    // Cek apakah URL adalah gambar (opsional)
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
    const hasImageExt = imageExtensions.some(ext => 
      urlInput.toLowerCase().includes(ext)
    )
    
    if (!hasImageExt && !urlInput.includes('placeholder')) {
      setError('⚠️ URL mungkin bukan gambar, tapi akan tetap disimpan')
    }

    setPreview(urlInput)
    onImageChange(urlInput)
  }

  // Clear image
  const clearImage = () => {
    setPreview('')
    setUrlInput('')
    onImageChange('')
    setError('')
  }

  return (
    <div className="space-y-4">
      <Label>Cover Image</Label>

      {/* Preview Image */}
      {preview && (
        <div className="relative w-full h-64 rounded-lg overflow-hidden border">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
            onError={() => setError('Gagal memuat gambar. Periksa URL-nya.')}
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

      {/* Upload Options */}
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

          {/* Upload File Tab */}
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
                onClick={() => document.getElementById('file-upload')?.click()}
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

          {/* Paste URL Tab */}
          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
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

      {/* Error Message */}
      {error && (
        <div className={`text-sm p-3 rounded ${
          error.includes('⚠️') 
            ? 'bg-yellow-50 text-yellow-800' 
            : 'bg-red-50 text-red-800'
        }`}>
          {error}
        </div>
      )}
    </div>
  )
}