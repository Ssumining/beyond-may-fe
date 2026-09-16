import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Windows 경로(한글·공백·백슬래시) 문제 방지: 슬래시로 정규화
const rootDir = dirname(fileURLToPath(import.meta.url)).replace(/\\/g, "/");

export default defineConfig({
  plugins: [react()],
  resolve: {
    // @/... → 프로젝트 루트. 정규식으로 "@/" 접두사만 매칭 (scoped 패키지 영향 없음)
    alias: [{ find: /^@\//, replacement: `${rootDir}/` }],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
});