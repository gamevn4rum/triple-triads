import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Injects $basePath into every SCSS file at build time.
// Inserted after any @use/@forward rules so Sass ordering rules are respected.
const injectBasePath = (content: string): string => {
  const variable = `$basePath: "${basePath}";\n`;
  const lines = content.split("\n");
  let lastUseIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith("@use") || trimmed.startsWith("@forward")) {
      lastUseIdx = i;
    } else if (lastUseIdx >= 0 && trimmed !== "") {
      break;
    }
  }
  const insertAt = lastUseIdx >= 0 ? lastUseIdx + 1 : 0;
  lines.splice(insertAt, 0, variable);
  return lines.join("\n");
};

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
  sassOptions: {
    additionalData: injectBasePath,
  },
};

export default nextConfig;
