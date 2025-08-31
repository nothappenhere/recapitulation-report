import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function TransaksiForm() {
  const [formData, setFormData] = useState({
    nomor_reservasi: "",
    nomor_penjualan: "",
    nama_rombongan: "",
    nama_pemesan: "",
    alamat: "",
    provinsi: "",
    kabupaten_kota: "",
    kecamatan: "",
    golongan: "",
    jumlah_personil: "",
    kode_tiket: "",
    total_harga: "",
    status_transaksi: "success",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelect = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    // TODO: panggil API POST ke backend kamu
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Form Transaksi Tiket
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nomor Reservasi & Penjualan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label>Nomor Reservasi</Label>
                <Input
                  type="number"
                  name="nomor_reservasi"
                  value={formData.nomor_reservasi}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label>Nomor Penjualan</Label>
                <Input
                  type="number"
                  name="nomor_penjualan"
                  value={formData.nomor_penjualan}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label>Nama Rombongan</Label>
                <Input
                  type="text"
                  name="nama_rombongan"
                  value={formData.nama_rombongan}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label>Nama Pemesan</Label>
                <Input
                  type="text"
                  name="nama_pemesan"
                  value={formData.nama_pemesan}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label>Tanggal Pemesanan</Label>
                <Input
                  type="text"
                  name="nama_rombongan"
                  value={formData.nama_rombongan}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label>Waktu Kunjungan</Label>
                <Input
                  type="text"
                  name="nama_pemesan"
                  value={formData.nama_pemesan}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Data Pemesan */}

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label>Alamat</Label>
              <Textarea
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Wilayah */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label>Provinsi</Label>
                <Input
                  type="text"
                  name="provinsi"
                  value={formData.provinsi}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label>Kabupaten/Kota</Label>
                <Input
                  type="text"
                  name="kabupaten_kota"
                  value={formData.kabupaten_kota}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label>Kecamatan</Label>
                <Input
                  type="text"
                  name="kecamatan"
                  value={formData.kecamatan}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Golongan */}
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label>Kategori</Label>
              <Select onValueChange={(val) => handleSelect("golongan", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih golongan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pelajar">Pelajar</SelectItem>
                  <SelectItem value="Umum">Umum</SelectItem>
                  <SelectItem value="Asing">Asing</SelectItem>
                  <SelectItem value="Khusus">Khusus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Jumlah, Kode Tiket, Harga */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Jumlah Personil</Label>
              <Input
                type="number"
                name="jumlah_personil"
                value={formData.jumlah_personil}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Kode Tiket (pisahkan dengan koma)</Label>
              <Input
                type="text"
                name="kode_tiket"
                value={formData.kode_tiket}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Total Harga</Label>
              <Input
                type="number"
                name="total_harga"
                value={formData.total_harga}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Status Transaksi */}
          <div>
            <Label>Status Transaksi</Label>
            <Select
              defaultValue="success"
              onValueChange={(val) => handleSelect("status_transaksi", val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tombol Submit */}
          <div className="flex justify-end">
            <Button type="submit">Simpan Transaksi</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
