import jwt from 'jsonwebtoken'

// Fungsi middleware untuk otentikasi pengguna
export const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '') // Mengambil token dari header

  if (!token) {
    return res.status(401).json({ error: 'Token autentikasi tidak ada' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) // Verifikasi token
    req.user = decoded // Menyimpan data pengguna pada objek request
    next() // Melanjutkan ke middleware atau route handler berikutnya
  } catch (error) {
    return res.status(403).json({ error: 'Token tidak valid atau sudah kedaluwarsa' })
  }
}

// Fungsi middleware untuk otorisasi berdasarkan role
export const authorizeRole = (roles) => (req, res, next) => {
  // `roles` adalah array yang berisi role yang diizinkan untuk mengakses route ini
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Akses ditolak. Anda tidak memiliki izin' })
  }
  next()
}
