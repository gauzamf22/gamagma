import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Phone, MessageCircle, MapPin, Users } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function KontakPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const contactPersons = [
    {
      id: 1,
      name: "Kak Livy",
      role: "Contact Person Gamagma",
      location: "Psikologi UGM",
      whatsapp: "+62 852-1643-4959",
      photo_url: "/images/3.jpg",
    },
    {
      id: 2,
      name: "Kak Fatheeya",
      role: "Contact Person Gamagma",
      location: "Sastra Inggris UGM",
      whatsapp: "+62 858-5029-9343",
      photo_url: "/images/fath.jpeg",
    },
    {
      id: 3,
      name: "Kak Gilang",
      role: "Contact Person Gamagma",
      location: "Sekolah Vokasi UGM",
      whatsapp: "+62 822-3346-0383",
      photo_url: "/images/lang - Copy.jpeg",
    },
    {
      id: 4,
      name: "Kak Rasyid",
      role: "Contact Person Gamagma",
      location: "Hukum UGM",
      whatsapp: "+62 821-4299-3647",
      photo_url: "/images/r.jpeg",
    },
    {
      id: 5,
      name: "Kak Fail",
      role: "Contact Person Gamagma",
      location: "TRPL (Sekolah Vokasi) UGM",
      whatsapp: "+62 857-1631-8318",
      photo_url: "/images/fail.jpeg",
    },
    {
      id: 6,
      name: "Kak Aya",
      role: "Contact Person Gamagma",
      location: "Psikologi UGM",
      whatsapp: "+62 857-0466-3106",
      photo_url: "/images/aya.jpeg",
    },
    {
      id: 7,
      name: "Kak Nawang",
      role: "Contact Person Gamagma",
      location: "Sastra Arab UGM",
      whatsapp: "+62 823-3059-9722",
      photo_url: "/images/naw.jpeg",
    },
    {
      id: 8,
      name: "Kak Zizou",
      role: "Contact Person Gamagma",
      location: "Geografi UGM",
      whatsapp: "+62 811-5642-120",
      photo_url: "/images/z.jpeg",
    },
    {
      id: 9,
      name: "Kak Atha'",
      role: "Contact Person Gamagma",
      location: "Kedokteran UGM",
      whatsapp: "+62 813-3606-9554",
      photo_url: "/images/tha.jpeg",
    },
    {
      id: 10,
      name: "Kak Fariz",
      role: "Contact Person Gamagma",
      location: "Matematika UGM x Math USYD",
      whatsapp: "+62 881-0262-33569",
      photo_url: "/images/fariz.jpeg",
    },
    {
      id: 11,
      name: "Kak Iqbal",
      role: "Contact Person Gamagma",
      location: "Computer Science UGM",
      whatsapp: "+62 852-3621-1861",
      photo_url: "/images/iqbal.jpeg",
    },
    {
      id: 12,
      name: "Kak Radit",
      role: "Contact Person Gamagma",
      location: "Aktuaria UGM",
      whatsapp: "+62 821-4415-0437",
      photo_url: "/images/Radit.jpeg",
    },
    {
      id: 13,
      name: "Kak Rofiq",
      role: "Contact Person Gamagma",
      location: "Statistika UGM",
      whatsapp: "+62 857-4858-3728",
      photo_url: "/images/rf.jpeg",
    },
    {
      id: 14,
      name: "Kak Rameyza",
      role: "Contact Person Gamagma",
      location: "Computer Science UGM",
      whatsapp: "+62 812-5204-9835",
      photo_url: "/images/mey.jpeg",
    },
    {
      id: 15,
      name: "Kak Ucup",
      role: "Contact Person Gamagma",
      location: "Akuntansi UGM",
      whatsapp: "+62 878-8219-8175",
      photo_url: "/images/cup.jpeg",
    },
    {
      id: 16,
      name: "Kak Gauza",
      role: "Contact Person Gamagma",
      location: "Computer Science UGM",
      whatsapp: "+62 895-3973-06279",
      photo_url: "/images/gauza.jpeg",
    },
    {
      id: 17,
      name: "Kak Farrel",
      role: "Contact Person Gamagma",
      location: "Teknik Mesin UGM",
      whatsapp: "+62 821-3216-7102",
      photo_url: "/images/farrel.jpeg",
    },
    {
      id: 18,
      name: "Kak Robitho",
      role: "Contact Person Gamagma",
      location: "Teknik Elektro UGM",
      whatsapp: "+62 822-1170-2006",
      photo_url: "/images/robitho.jpeg",
    },

  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12 space-y-4">
        <div className="flex justify-center mb-4">
          <Image
            src="/images/maskot-simaster.png"
            alt="SIMASTER Mascot"
            width={120}
            height={120}
            className="w-32 h-32"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-balance">Contact Person Gamagma</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
          Hubungi kakak-kakak Gamagma (Gadjah Mada-MAN 2 Kota Malang) yang siap membantu perjalananmu menuju UGM
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{contactPersons?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Contact Person</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">24/7</p>
                <p className="text-sm text-muted-foreground">Siap Membantu</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">Yogyakarta</p>
                <p className="text-sm text-muted-foreground">Lokasi Kampus</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Persons Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contactPersons?.map((person) => (
          <Card key={person.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={person.photo_url || undefined} alt={person.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {person.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">{person.name}</CardTitle>
              <CardDescription className="flex justify-center gap-2 mt-2">
                <Badge variant="default">{person.role}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {person.location && (
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>{person.location}</span>
                </div>
              )}
              {person.whatsapp && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <span className="text-muted-foreground">{person.whatsapp}</span>
                </div>
              )}
              {person.whatsapp && (
                <Button asChild className="w-full" variant="default">
                  <a
                    href={`https://wa.me/${person.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Hubungi via WhatsApp
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 bg-gradient-to-r from-primary via-[#B17D1D] to-[#8D5B1A] text-primary-foreground rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold mb-4 text-balance">Butuh Bantuan Lebih Lanjut?</h2>
        <p className="text-lg text-primary-foreground/90 mb-6 max-w-2xl mx-auto text-pretty leading-relaxed">
          Jangan ragu untuk menghubungi kakak-kakak Gamagma kami. Kami siap membantu menjawab semua pertanyaan tentang
          UGM!
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <a href="https://chat.whatsapp.com/GhImnHoDxKEEd3FueCZbcc" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5 mr-2" />
              WhatsApp Grup Calon Gamagma 2026
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
