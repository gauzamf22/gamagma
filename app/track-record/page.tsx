import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, GraduationCap, TrendingUp, Users } from "lucide-react"


export default async function TrackRecordPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: trackRecords } = await supabase.from("track_records").select("*").order("year", { ascending: false })

  // Group by year
  const recordsByYear = trackRecords?.reduce(
    (acc, record) => {
      if (!acc[record.year]) {
        acc[record.year] = []
      }
      acc[record.year].push(record)
      return acc
    },
    {} as Record<string, typeof trackRecords>,
  )

  const years = Object.keys(recordsByYear || {}).sort((a, b) => Number.parseInt(b) - Number.parseInt(a))

  // Stats
  const totalAlumni = trackRecords?.length || 0
  const snbpCount = trackRecords?.filter((r) => r.program === "SNBP").length || 0
  const snbtCount = trackRecords?.filter((r) => r.program === "SNBT").length || 0
  const mandiriCount = trackRecords?.filter((r) => r.program === "Mandiri").length || 0

  const photoMap: Record<string, string> = {
  "Muhammad Gauza Faliha": "/images/gauza.jpeg",
  "Muhammad Athaullah Syarofi": "/images/tha.jpeg",
  "Muhammad Iqbal Hilmi": "/images/iqbal.jpeg",
  "Azizah Qiera Khairinniswah Setyawan": "/images/z.jpeg",
  "Muhammad Nufail Arinda Fattahillah": "/images/fail.jpeg",
  "Muhammad Rofiq Miqdam": "/images/rf.jpeg",
  "Rameyza Charisa Putri Primantoko": "/images/mey.jpeg",
  "Raditya Ilham Dwi Sutrisno": "/images/Radit.jpeg",
  "Alivy Huriyah Rizkha Ramadhani": "/images/3.jpg",
  "Ayuning Jayawardhana": "/images/aya.jpeg",
  "Apta Yusuf Maulana": "/images/cup.jpeg",
  "Raasyid Fikriy Wicaksana": "/images/r.jpeg",
  "Rahadyan Herjuno Gilang Pratista": "/images/lang - Copy.jpeg",
  "Sahasika Aswangga Lituhayu": "/images/naw.jpeg",
  "Fatheeya Safa Tasneema": "/images/fath.jpeg"
}

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12 space-y-4">
        <Badge className="bg-accent text-accent-foreground mb-4">Track Record Alumni</Badge>
        <h1 className="text-4xl md:text-5xl font-bold text-balance">Prestasi Alumni MAN 2 Kota Malang</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
          Lihat pencapaian gemilang alumni kami yang berhasil diterima di berbagai fakultas dan program studi unggulan
          di Universitas Gadjah Mada
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{totalAlumni}</p>
                <p className="text-sm text-muted-foreground">Total Alumni</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{snbpCount}</p>
                <p className="text-sm text-muted-foreground">Jalur SNBP</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{snbtCount}</p>
                <p className="text-sm text-muted-foreground">Jalur SNBT</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{mandiriCount}</p>
                <p className="text-sm text-muted-foreground">Jalur Mandiri/IUP</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Track Records by Year */}
      <Tabs defaultValue={years[0]} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto flex-nowrap mb-8">
          {years.map((year) => (
            <TabsTrigger key={year} value={year}>
              Tahun {year}
            </TabsTrigger>
          ))}
        </TabsList>

        {years.map((year) => (
          <TabsContent key={year} value={year}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recordsByYear?.[year]?.map((record) => (
                <Card key={record.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage 
                          src={
                             photoMap[record.student_name] || 
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(record.student_name)}`
                          }
                          alt={record.student_name}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {record.student_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight">{record.student_name}</CardTitle>
                        <CardDescription className="mt-1">
                          <Badge
                            variant={
                              record.program === "SNBP"
                                ? "default"
                                : record.program === "SNBT"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {record.program}
                          </Badge>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-primary">{record.faculty}</p>
                      <p className="text-sm text-muted-foreground">{record.major}</p>
                    </div>

                    {record.achievements && record.achievements.length > 0 && (
                      <div className="pt-3 border-t">
                        <p className="text-xs font-semibold text-muted-foreground mb-2">Prestasi:</p>
                        <ul className="space-y-1">
                          {record.achievements.map((achievement, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className="text-accent mt-0.5">•</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Motivational Section */}
      <div className="mt-16 bg-gradient-to-r from-primary to-blue-900 text-primary-foreground rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold mb-4 text-balance">Kamu Bisa Menjadi Bagian dari Mereka!</h2>
        <p className="text-lg text-primary-foreground/90 mb-6 max-w-2xl mx-auto text-pretty leading-relaxed">
          Alumni-alumni ini membuktikan bahwa dengan kerja keras dan dedikasi, impian kuliah di UGM bisa tercapai.
          Bergabunglah dengan Gamagma dan wujudkan mimpimu!
        </p>
      </div>
    </div>
  )
}
