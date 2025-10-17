import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Twitter, Facebook, Instagram, Youtube } from "lucide-react";

const CURRENT_YEAR = new Date().getFullYear();

export default function Index() {
  return (
    <>
      <nav className="block py-4 backdrop-saturate-200 backdrop-blur-2xl bg-opacity-80 border-white/80 w-full max-w-full rounded-none px-7 md:px-14 bg-white border-0 sticky top-0 z-50 font-sans">
        <div className="container mx-auto flex items-center justify-between py-1 px-4">
          {/* Brand */}
          <Link to="/" className="text-2xl font-bold">
            GeoVisit
          </Link>

          {/* Desktop Buttons */}
          <div className="items-center gap-2 lg:flex">
            <Button variant="ghost" className="font-bold" asChild>
              <Link to="/auth/login">Sign In</Link>
            </Button>

            <Button className="font-medium" asChild>
              <Link to="/auth/register">Register</Link>
            </Button>
          </div>
        </div>
      </nav>

      <header className="bg-white p-8 font-sans">
        <div className="w-w-full container mx-auto pt-6 md:pt-12 pb-12 md:pb-24 text-center">
          <p className="mx-auto w-full text-[30px] lg:text-[48px] font-bold leading-[45px] lg:leading-[60px] lg:max-w-2xl">
            Kelola Reservasi dan Tiket dengan Mudah
          </p>
          <p className="mx-auto mt-8 mb-4 w-full px-8 !text-gray-700 lg:w-10/12 lg:px-12 xl:w-8/12 xl:px-20">
            Pesan, atur, dan kelola tiket reservasi dalam satu platform terpadu.
            Nikmati pengalaman reservasi yang cepat, aman, dan efisien.
          </p>
        </div>

        <div className="w-full lg:container lg:mx-auto">
          <img
            width={1024}
            height={400}
            src="/img/bg-education.jpg"
            alt="credit cards"
            className="h-96 w-full rounded-lg object-cover lg:h-[21rem]"
          />
        </div>
      </header>

      <footer className="pb-10 md:p-10 font-sans">
        <div className="container flex flex-col mx-auto">
          {/* Footer Links */}
          <div className="flex flex-col md:flex-row items-center !justify-between px-8 gap-3">
            {/* Social Media Icons */}
            <div className="flex w-fit justify-center gap-3">
              <Link to="https://x.com/museum_geologi" aria-label="Twitter">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Twitter className="h-5 w-5" />
                </Button>
              </Link>

              <Link
                to="https://www.facebook.com/groups/60256428517"
                aria-label="Facebook"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Facebook className="h-5 w-5" />
                </Button>
              </Link>

              <Link
                to="https://www.instagram.com/museum_geologi"
                aria-label="Instagram"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Instagram className="h-5 w-5" />
                </Button>
              </Link>

              <Link
                to="https://www.youtube.com/channel/UCAsCH8dLiXoo3sHXoHQyYEQ"
                aria-label="Youtube"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Youtube className="h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Copyright */}
            <p className="text-center font-normal text-sm text-gray-700">
              &copy; {CURRENT_YEAR} Made with ❤️ by{" "}
              <Link
                to="https://portofolio-ra.netlify.app/"
                target="_blank"
                className="font-medium hover:underline"
              >
                Muhammad Rizky Akbar
              </Link>
              .
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
