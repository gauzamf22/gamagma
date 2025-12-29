import { createClient } from "@/lib/supabase/server"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Calendar, Eye, Edit } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import Image from "next/image"

// PENTING: Type params sebagai Promise
type Props = {
  params: Promise<{ id: string }>
}

export default async function JournalDetailPage({ params }: Props) {
  const supabase = await createClient()
  
  // AWAIT params sebelum mengakses id
  const { id: journalId } = await params

  // Cek user yang sedang login
  const { data: { user } } = await supabase.auth.getUser()

  const { data: journal } = await supabase
    .from("alumni_journals")
    .select(
      `
      *,
      profiles:author_id (full_name, avatar_url, email)
    `,
    )
    .eq("id", journalId)
    .single()

  if (!journal) {
    notFound()
  }

  // Cek apakah jurnal ini milik user yang sedang login
  const isOwner = user?.id === journal.author_id

  // Increment view count
  await supabase
    .from("alumni_journals")
    .update({ views: journal.views + 1 })
    .eq("id", journalId)

  // Get related articles
  const { data: relatedJournals } = await supabase
    .from("alumni_journals")
    .select(
      `
      *,
      profiles:author_id (full_name)
    `,
    )
    .eq("category", journal.category)
    .neq("id", journalId)
    .limit(3)

  // Tentukan nama yang akan ditampilkan
  const displayName = journal.created_by_name || 
                      (journal.profiles as any)?.full_name || 
                      "Anonymous"

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Back Button & Edit Button */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" asChild>
          <Link href="/jurnal">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Jurnal Alumni
          </Link>
        </Button>
        
        {/* Tombol Edit - hanya muncul jika milik user */}
        {isOwner && (
          <Button asChild>
            <Link href={`/jurnal/edit/${journalId}`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Jurnal
            </Link>
          </Button>
        )}
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto">
        <Badge variant="secondary" className="mb-4">
          {journal.category}
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">{journal.title}</h1>

        {/* Author Info - UPDATED: Pakai created_by_name */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b">
          <Avatar className="h-12 w-12">
            <AvatarImage src={(journal.profiles as any)?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback>
              {displayName
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">{displayName}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(journal.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {journal.views + 1} views
              </span>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {journal.cover_image_url && (
          <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={journal.cover_image_url || "/placeholder.svg"}
              alt={journal.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="whitespace-pre-wrap text-pretty leading-relaxed">{journal.content}</div>
        </div>

        {/* Owner Badge - tampilkan jika milik user */}
        {isOwner && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-800 font-medium">
              📝 Ini adalah jurnal Anda. Anda dapat mengeditnya kapan saja.
            </p>
          </div>
        )}
      </article>

      {/* Related Articles */}
      {relatedJournals && relatedJournals.length > 0 && (
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold mb-6">Artikel Terkait</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedJournals.map((related) => (
              <Card key={related.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Badge variant="secondary" className="mb-3">
                    {related.category}
                  </Badge>
                  <h3 className="font-semibold mb-2 line-clamp-2">{related.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{related.content}</p>
                  <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                    <Link href={`/jurnal/${related.id}`}>Baca Artikel</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}