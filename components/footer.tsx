import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Youtube, Mail, Phone } from "lucide-react"
import { MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground ">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/halo.jpeg"
                alt="Gamagma Logo"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full"
              />
              <div>
                <h3 className="font-bold text-lg">Gamagma.com</h3>
                <p className="text-sm opacity-90">Gadjah Mada 2026</p>
              </div>
            </div>
            <p className="text-sm opacity-90">
              Platform informasi resmi untuk calon mahasiswa UGM dari MAN 2 Kota Malang
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Tautan Cepat</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tentang" className="opacity-90 hover:opacity-100 transition-opacity">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="opacity-90 hover:opacity-100 transition-opacity">
                  Kontak Person
                </Link>
              </li>
              <li>
                <Link href="/track-record" className="opacity-90 hover:opacity-100 transition-opacity">
                  Track Record
                </Link>
              </li>
              <li>
                <Link href="/fakultas" className="opacity-90 hover:opacity-100 transition-opacity">
                  Fakultas UGM
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Sumber Daya</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/jurnal" className="opacity-90 hover:opacity-100 transition-opacity">
                  Jurnal Alumni
                </Link>
              </li>
              <li>
                <Link href="/kuis" className="opacity-90 hover:opacity-100 transition-opacity">
                  Kuis UGM
                </Link>
              </li>
              <li>
                <a
                  href="https://um.ugm.ac.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-90 hover:opacity-100 transition-opacity"
                >
                  Website UGM
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Kontak</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="opacity-90">gamagmaugm@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="opacity-90">+62 895-3973-06279</span>
              </li>

            </ul>
            <div className="flex gap-3 mt-4">
              <a
                href="https://www.instagram.com/officialgamagma?igsh=dmc2bWh2a2dieXdh"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-90 hover:opacity-100 transition-opacity"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://chat.whatsapp.com/GhImnHoDxKEEd3FueCZbcc"
target="_blank"
rel="noopener noreferrer"
className="opacity-90 hover:opacity-100 transition-opacity"
>
  <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-90">
          <p>&copy; {new Date().getFullYear()} Gamagma.com - MAN 2 Kota Malang. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
