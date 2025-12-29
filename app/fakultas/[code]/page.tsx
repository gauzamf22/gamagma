import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Briefcase, Award, GraduationCap, Users } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function FacultyDetailPage({ params }: { params: { code: string } }) {
  const supabase = await createClient()
  const facultyCode = (await params).code.toUpperCase()

  const { data: faculty } = await supabase.from("faculties").select("*").eq("code", facultyCode).single()

  if (!faculty) {
    notFound()
  }

  const { data: majors } = await supabase
    .from("majors")
    .select("*")
    .eq("faculty_id", faculty.id)
    .order("name", { ascending: true })

  // Group majors by degree
  const majorsByDegree = majors?.reduce(
    (acc, major) => {
      if (!acc[major.degree]) {
        acc[major.degree] = []
      }
      acc[major.degree].push(major)
      return acc
    },
    {} as Record<string, typeof majors>,
  )

  const degrees = Object.keys(majorsByDegree || {}).sort()

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/fakultas">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Daftar Fakultas
        </Link>
      </Button>

      {/* Faculty Header */}
      <div className="mb-12">
        <Badge className="bg-primary text-primary-foreground mb-4">{faculty.code}</Badge>
        <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4">{faculty.name}</h1>
        {faculty.description && (
          <p className="text-lg text-muted-foreground max-w-3xl text-pretty leading-relaxed">{faculty.description}</p>
        )}
        {faculty.website_url && (
          <Button asChild className="mt-6">
            <a href={faculty.website_url} target="_blank" rel="noopener noreferrer">
              Kunjungi Website Fakultas
            </a>
          </Button>
        )}
      </div>

      {/* Stats Section */}
      {majors && majors.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{majors.length}</p>
                  <p className="text-sm text-muted-foreground">Program Studi</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{degrees.length}</p>
                  <p className="text-sm text-muted-foreground">Jenjang Pendidikan</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <Award className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {majors.filter(m => m.accreditation).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Terakreditasi</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Majors by Degree */}
      {degrees.length > 0 ? (
        <div className="space-y-12">
          {degrees.map((degree) => (
            <div key={degree}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Program {degree}</h2>
                <Badge variant="outline" className="ml-2">
                  {majorsByDegree?.[degree]?.length} Prodi
                </Badge>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {majorsByDegree?.[degree]?.map((major) => (
                  <Card key={major.id} className="hover:shadow-lg transition-all hover:scale-[1.02] duration-300 flex flex-col">
                    <CardHeader className="flex-shrink-0">
                      <div className="flex items-start justify-between gap-1 mb-3">
                        <div className="p-2 bg-primary/10 rounded-lg flex-shrink">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        {major.accreditation && (
                          <Badge variant="secondary" className="font-semibold flex-shrink-0">
                            <Award className="h-3 w-3 mr-1" />
                            {major.accreditation}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg leading-tight text-left">{major.name}</CardTitle>
                      <CardDescription className="text-left">
                        <Badge variant="outline" className="mt-2">{major.degree}</Badge>
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4 flex-grow text-left">
                      {/* Description Section */}
                      {major.description && (
                        <div>
                          <p className="text-sm text-muted-foreground leading-relaxed text-left">
                            {major.description}
                          </p>
                        </div>
                      )}

                      {/* Career Prospects Section */}
                      {major.career_prospects && Array.isArray(major.career_prospects) && major.career_prospects.length > 0 && (
                        <div className={major.description ? "pt-4 border-t" : ""}>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="p-1.5 bg-blue-500/10 rounded flex-shrink-0">
                              <Briefcase className="h-4 w-4 text-blue-600" />
                            </div>
                            <p className="text-sm font-semibold text-foreground">Prospek Karir</p>
                          </div>
                          <div className="space-y-2">
                            {major.career_prospects.map((career: string, idx: number) => (
                              <div key={idx} className="flex items-start gap-2">
                                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                                <span className="text-sm text-muted-foreground leading-relaxed text-left">
                                  {career}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Empty State for individual card if no description and career */}
                      {!major.description && (!major.career_prospects || !Array.isArray(major.career_prospects) || major.career_prospects.length === 0) && (
                        <div className="text-center py-6">
                          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                            <BookOpen className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Informasi detail sedang diperbarui
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Card className="max-w-2xl mx-auto border-dashed">
            <CardContent className="py-12">
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Program Studi Belum Tersedia
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Informasi program studi untuk fakultas ini sedang dalam proses penambahan. 
                  Silakan hubungi kontak person untuk informasi lebih lanjut.
                </p>
              </div>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/kontak">
                  <Users className="h-4 w-4 mr-2" />
                  Hubungi Contact Person
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-16 bg-gradient-to-br from-primary via-primary to-blue-900 text-primary-foreground rounded-2xl p-8 md:p-12 text-center shadow-xl">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-6">
            <Users className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-balance">
            Tertarik dengan {faculty.name}?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">
            Hubungi kakak-kakak Gamagama untuk mendapatkan informasi lebih detail tentang jalur masuk, 
            tips persiapan, dan cerita pengalaman kuliah di fakultas ini!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90 font-semibold">
              <Link href="/kontak">
                <Users className="h-5 w-5 mr-2" />
                Hubungi Contact Person
              </Link>
            </Button>
            <Button size="lg" asChild variant="outline" className="border-white/20 text-primary hover:bg-white/10">
              <Link href="/jurnal">
                <BookOpen className="h-5 w-5 mr-2" />
                Baca Jurnal Alumni
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}