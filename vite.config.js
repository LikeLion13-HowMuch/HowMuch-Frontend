import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // 외부(Nginx)에서 접속할 수 있도록 허용
    port: 5173, // 현재 사용 중인 포트
    allowedHosts: ['howmuchapple.store'] // 도메인 차단 해제
  }
});