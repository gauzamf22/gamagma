import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, ExternalLink, BookOpen } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function FakultasPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: faculties } = await supabase.from("faculties").select("*").order("name", { ascending: true })

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12 space-y-4">
        <Badge className="bg-accent text-accent-foreground mb-4">Fakultas UGM</Badge>
        <h1 className="text-4xl md:text-5xl font-bold text-balance">Jelajahi Fakultas di UGM</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
          Universitas Gadjah Mada memiliki 18 fakultas dan 1 Sekolah Vokasi dengan berbagai program studi unggulan. Temukan fakultas serta program studi yang
          sesuai dengan minat dan passionmu!
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">18+</p>
                <p className="text-sm text-muted-foreground">Fakultas dan Sekolah Vokasi</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">100+</p>
                <p className="text-sm text-muted-foreground">Program Studi</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <ExternalLink className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">Terakreditasi</p>
                <p className="text-sm text-muted-foreground">Unggul</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Faculties Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faculties?.map((faculty) => (
          <Card key={faculty.id} className="hover:shadow-lg transition-shadow overflow-hidden group">
            <div className="relative h-48 overflow-hidden">
              <Image
                src={faculty.image_url || "/placeholder.svg?height=192&width=400"}
                alt={faculty.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3">
                <Badge className="bg-primary text-primary-foreground">{faculty.code}</Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-lg leading-tight">{faculty.name}</CardTitle>
              {faculty.description && (
                <CardDescription className="line-clamp-2 text-pretty">{faculty.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                {faculty.website_url && (
                  <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                    <a href={faculty.website_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Website
                    </a>
                  </Button>
                )}
                <Button size="sm" asChild className="flex-1">
                  <Link href={`/fakultas/${faculty.code.toLowerCase()}`}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Lihat Prodi
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-16 bg-gradient-to-r from-primary to-blue-900 text-primary-foreground rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold mb-4 text-balance">Sudah Menemukan Fakultas Impianmu?</h2>
        <p className="text-lg text-primary-foreground/90 mb-6 max-w-2xl mx-auto text-pretty leading-relaxed">
          Pelajari lebih lanjut tentang program studi yang tersedia dan konsultasi dengan Contact Person untuk
          mendapatkan informasi lebih detail!
        </p>
        <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href="/kontak">Hubungi Contact Person</Link>
        </Button>
      </div>
    </div>
  )
}
