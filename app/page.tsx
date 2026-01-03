"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, Trophy, BookOpen, MessageSquare, GraduationCap, Target, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

function AnimatedSection({ children, className = "" }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      } ${className}`}
    >
      {children}
    </div>
  )
}

export default function HomePage() {
  const [selectedImage, setSelectedImage] = useState(null)

  const galleryImages = [
    { src: "/images/pionir.jpeg", alt: "Foto alumni UGM", title: "Foto Alumni MAN 2 Kota Malang di UGM" },
    { src: "/images/pembukaan.jpg", alt: "Pembukaan Pionir Gadjah Mada", title: "Pembukaan Pionir Gadjah Mada Tahun 2025" },
    { src: "/images/tawabahagiamaba.jpg", alt: "Serunya Pionir", title: "Bahagianya Maba UGM Tahun Ini !" },
    { src: "/images/sesikelas.jpg", alt: "Pionir Univ", title: "Pionir Universitas (Sesi Kelas)" },
    { src: "/images/suporteran.jpg", alt: "Kegiatan Supporteran Pada Saat Pionir Fakultas", title: "Kegiatan Supporteran Pada Saat Pionir Fakultas" },
    { src: "/images/pionirfakultas.JPG", alt: "Pionir fakultas", title: "Serunya Pionir Fakultas" },
    { src: "/images/Wow, kamu yang mana yaa.jpg", alt: "kamuuu", title: "Wow, kamu yang mana yaaa ???" },
    { src: "/images/selebrasi.jpg", alt: "selebrasi pionir", title: "Selebrasi Pionir Gadjah Mada Tahun 2025" },
    { src: "/images/penutupanpionir.jpg", alt: "siap menuju realita", title: "Penutupan Pionir UGM 2025" },
  ]

  return (
    <div className="flex flex-col scroll-smooth">
      {/* Hero Section */}
      <AnimatedSection>
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
      </AnimatedSection>

      {/* Stats Section */}
      <AnimatedSection>
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
      </AnimatedSection>

      {/* About Section */}
      <AnimatedSection>
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
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection>
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
      </AnimatedSection>

      {/* Gallery Section */}
      <AnimatedSection>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-balance">Galeri Pionir Gadjah Mada</h2>
              <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
                Keseruan kegiatan Pionir Gadjah Mada Tahun 2025 di UGM, hayoooo, kamu pengen ikut yaaa !!!, kami tunggu di Pionir UGM tahun ini yaaaa, semangat !!! 😊🔥
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="relative group overflow-hidden rounded-lg aspect-[4/3] bg-gradient-to-br from-[#8D5B1A] via-[#B17D1D] to-[#D4A574] cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#8D5B1A]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <p className="text-white p-4 font-semibold">{image.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-[#D4A574] transition-colors z-10 bg-[#8D5B1A]/50 hover:bg-[#8D5B1A] rounded-full p-2"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-8 w-8" />
          </button>
          <div 
            className="relative max-w-5xl max-h-[90vh] w-full h-full animate-in zoom-in-95 duration-300" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#8D5B1A]/90 via-[#8D5B1A]/50 to-transparent p-6">
              <h3 className="text-white text-xl font-semibold">{selectedImage.title}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
