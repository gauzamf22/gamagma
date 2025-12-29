import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, Trophy, BookOpen, MessageSquare, GraduationCap, Target } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-[#B17D1D] to-[#8D5B1A] text-primary-foreground py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-accent text-accent-foreground">Gamagma.com - Gadjah Mada x MAN 2 Kota Malang</Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
                Wujudkan Mimpi Kuliah Bersama di UGM
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/90 text-pretty leading-relaxed">
                Dapatkan informasi lengkap mengenai jalur masuk , fakultas, prodi, cerita alumni, lokasi, track record alumni, dan keperluan
                lainnya untuk menjadi bagian dari Universitas Gadjah Mada
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/tentang">
                    Selengkapnya
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                >
                  <Link href="/track-record">Lihat Track Record</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <Image
                  src="/images/maskot-simaster.png"
                  alt="SIMASTER Mascot"
                  width={400}
                  height={400}
                  className="w-full max-w-md h-auto drop-shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-accent text-accent-foreground p-4 rounded-lg shadow-lg">
                  <p className="text-sm font-semibold">Halo! Saya SIMASTER</p>
                  <p className="text-xs">Pemandu Website GAMAGMA UGM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <Users className="h-10 w-10 mx-auto mb-3 text-primary" />
                <p className="text-3xl font-bold text-primary">100+</p>
                <p className="text-sm text-muted-foreground">Alumni MAN 2 di UGM</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Trophy className="h-10 w-10 mx-auto mb-3 text-accent" />
                <p className="text-3xl font-bold text-primary">18+</p>
                <p className="text-sm text-muted-foreground">Fakultas dan Sekolah Vokasi</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <BookOpen className="h-10 w-10 mx-auto mb-3 text-primary" />
                <p className="text-3xl font-bold text-primary">100+</p>
                <p className="text-sm text-muted-foreground">Program Studi</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Target className="h-10 w-10 mx-auto mb-3 text-accent" />
                <p className="text-3xl font-bold text-primary">2025</p>
                <p className="text-sm text-muted-foreground">Tahun Berdiri Gamagma</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">Tentang Gamagma.com</h2>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              Gamagma.com (Gadjah Mada-MAN 2 Kota Malang) adalah platform informasi yang menyediakan transparansi
              informasi mengenai UGM untuk siswa MAN 2 Kota Malang yang ingin melanjutkan pendidikan di Universitas
              Gadjah Mada
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Informasi Lengkap</CardTitle>
                <CardDescription>
                  Akses informasi terkini tentang jalur masuk, fakultas, jurusan, dan kehidupan kampus di UGM
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Kontak Person</CardTitle>
                <CardDescription>Akses langsung ke Kakak-Kakak Alumni MAN 2 Kota Malang di UGM</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Track Record Alumni</CardTitle>
                <CardDescription>
                  Lihat pencapaian alumni MAN 2 yang berhasil diterima di berbagai fakultas UGM
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">Siap Bergabung dengan Keluarga Besar UGM?</h2>
            <p className="text-lg text-foreground text-pretty leading-relaxed">
              Mulai perjalananmu sekarang dengan mengecek informasi lengkap tentang UGM dan bergabung dengan keluarga
              besar Gamagma 2026
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/auth/sign-up">
                  Daftar Sekarang
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-foreground text-foreground hover:bg-foreground hover:text-background"
              >
                <Link href="/fakultas">Jelajahi Fakultas</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
