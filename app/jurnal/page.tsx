"use client"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Calendar, BookOpen, PlusCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function JurnalPage() {
  const [journals, setJournals] = useState<any[]>([])
  const [filteredJournals, setFilteredJournals] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState("Semua")
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()
  const router = useRouter()

  const categories = ["Semua", "Academic", "Campus Life", "Tips"]

  useEffect(() => {
    async function fetchData() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()

      if (!currentUser) {
        router.push("/auth/login")
        return
      }

      setUser(currentUser)

      const { data } = await supabase
        .from("alumni_journals")
        .select(
          `
          *,
          profiles:author_id (full_name, avatar_url)
        `,
        )
        .order("created_at", { ascending: false })

      if (data) {
        setJournals(data)
        setFilteredJournals(data)
      }
    }
    fetchData()
  }, [supabase, router])

  // Filter journals berdasarkan kategori
  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category)
    if (category === "Semua") {
      setFilteredJournals(journals)
    } else {
      setFilteredJournals(journals.filter((j) => j.category === category))
    }
  }

  const featuredJournal = filteredJournals?.[0]

  // Helper function untuk get display name
  const getDisplayName = (journal: any) => {
    return (
      journal.created_by_name || (journal.profiles as { full_name?: string })?.full_name || "Anonymous"
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12 space-y-4">
        <Badge className="bg-accent text-accent-foreground mb-4">Jurnal Alumni</Badge>
        <h1 className="text-4xl md:text-5xl font-bold text-balance">Cerita dari Alumni MAN 2 Kota Malang di UGM</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
          Baca pengalaman, tips, dan inspirasi dari alumni MAN 2 Kota Malang yang sudah menjadi bagian dari keluarga
          besar UGM
        </p>
        {user && (
          <Button size="lg" asChild className="mt-4">
            <Link href="/jurnal/new">
              <PlusCircle className="h-5 w-5 mr-2" />
              Tulis Jurnal
            </Link>
          </Button>
        )}
      </div>

      {/* Featured Article */}
      {featuredJournal && (
        <Card className="mb-12 overflow-hidden hover:shadow-lg transition-shadow">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative h-64 md:h-full">
              <Image
                src={
                  featuredJournal.cover_image_url ||
                  "/placeholder.svg?height=400&width=600&query=university campus life"
                }
                alt={featuredJournal.title}
                fill
                className="object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">Featured</Badge>
            </div>
            <div className="p-6 flex flex-col justify-center">
              <Badge variant="secondary" className="w-fit mb-3">
                {featuredJournal.category}
              </Badge>
              <h2 className="text-3xl font-bold mb-4 text-balance">{featuredJournal.title}</h2>
              <p className="text-muted-foreground mb-6 line-clamp-3 text-pretty leading-relaxed">
                {featuredJournal.content}
              </p>
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={(featuredJournal.profiles as { avatar_url?: string })?.avatar_url || "/placeholder.svg"}
                  />
                  <AvatarFallback>
                    {getDisplayName(featuredJournal)
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{getDisplayName(featuredJournal)}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(featuredJournal.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {featuredJournal.views} views
                    </span>
                  </div>
                </div>
              </div>
              <Button asChild>
                <Link href={`/jurnal/${featuredJournal.id}`}>Baca Selengkapnya</Link>
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Filter Categories - NOW FUNCTIONAL */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryFilter(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJournals?.slice(1).map((journal) => (
          <Card key={journal.id} className="hover:shadow-lg transition-shadow overflow-hidden group">
            <div className="relative h-48 overflow-hidden">
              <Image
                src={journal.cover_image_url || "/placeholder.svg?height=192&width=400&query=campus life"}
                alt={journal.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground">{journal.category}</Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-lg leading-tight line-clamp-2">{journal.title}</CardTitle>
              <CardDescription className="line-clamp-2 text-pretty">{journal.content}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={(journal.profiles as { avatar_url?: string })?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">
                    {getDisplayName(journal)
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{getDisplayName(journal)}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {journal.views}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                <Link href={`/jurnal/${journal.id}`}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Baca Artikel
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJournals?.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground mb-4">
              {selectedCategory === "Semua"
                ? "Belum ada jurnal yang dipublikasikan"
                : `Belum ada jurnal dengan kategori "${selectedCategory}"`}
            </p>
            {user && selectedCategory === "Semua" && (
              <Button asChild>
                <Link href="/jurnal/new">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Tulis Jurnal Pertama
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* CTA Section */}
      {!user && (
        <div className="mt-16 bg-gradient-to-r from-primary to-blue-900 text-primary-foreground rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4 text-balance">Punya Cerita Menarik?</h2>
          <p className="text-lg text-primary-foreground/90 mb-6 max-w-2xl mx-auto text-pretty leading-relaxed">
            Daftar sekarang dan bagikan pengalamanmu di UGM untuk menginspirasi calon mahasiswa lainnya!
          </p>
          <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/auth/sign-up">Daftar Sekarang</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
