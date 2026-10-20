import path from "node:path";
import sharp from "sharp";

const DIRECTORIO = path.resolve("public/images/novios");
const CALIDAD_WEBP = 78;
const ESFUERZO_WEBP = 6;

const ANCHOS_POR_FOTO = {
  "novios-1.jpg": [640, 960, 1280],
  "novios-2.jpg": [640, 960, 1280, 1920],
  "novios-3.jpg": [640, 960, 1280],
};

for (const [archivo, anchos] of Object.entries(ANCHOS_POR_FOTO)) {
  const origen = path.join(DIRECTORIO, archivo);
  const { width: anchoOriginal } = await sharp(origen).metadata();
  const base = path.basename(archivo, path.extname(archivo));

  for (const ancho of anchos) {
    if (anchoOriginal && ancho > anchoOriginal) {
      console.warn(`${archivo}: se omite ${ancho}px (el original mide ${anchoOriginal}px)`);
      continue;
    }

    const destino = path.join(DIRECTORIO, `${base}-${ancho}.webp`);
    const { size } = await sharp(origen)
      .resize({ width: ancho, withoutEnlargement: true })
      .webp({ quality: CALIDAD_WEBP, effort: ESFUERZO_WEBP })
      .toFile(destino);

    console.log(`${path.relative(process.cwd(), destino)} (${Math.round(size / 1024)} KB)`);
  }
}
