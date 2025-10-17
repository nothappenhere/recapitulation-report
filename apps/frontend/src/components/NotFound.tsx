"use client";

import { Link, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";

export default function NotFound() {
  const { pathname } = useLocation();

  return (
    <section className="h-screen w-full grid place-items-center text-center px-8">
      <div>
        <Flag className="w-20 h-20 mx-auto text-gray-800" />

        <h1 className="mt-5 text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
          Error 404 <br /> Halaman tidak ditemukan
        </h1>
        <p className="mt-8 mb-10 text-[18px] font-normal text-gray-500 mx-auto md:max-w-sm">
          Tenang, tim kami sedang menanganinya. Silakan muat ulang halaman atau
          kembali ke beranda.
        </p>

        <Button asChild className="w-full py-6 text-base">
          <Link to={pathname.startsWith("dashboard") ? "/dashboard" : "/"}>
            Kembali
          </Link>
        </Button>
      </div>
    </section>
  );
}
