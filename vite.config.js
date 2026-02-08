import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {/*
    host: '0.0.0.0', // 모든 IP로부터의 접속을 허용
    port: 5173,      // 포트 번호 확인
    https: {
      // key: fs.readFileSync('../certs/key.pem'),
      // cert: fs.readFileSync('../certs/cert.pem'),
    },
    proxy: {
      '/login': {
        target: 'https://127.0.0.1:8000',
        changeOrigin: true,
        secure: false, // Self-signed cert support
      },
      '/casualties': {
        target: 'https://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      '/insa': {
        target: 'https://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      '/generate-report': {
        target: 'https://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    }*/
  }
})
