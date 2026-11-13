import { publicAsset } from "@/lib/public-asset";

/**
 * Partner and supporter logos, stored in `public/images/organisations/`. To replace a logo,
 * swap the file (or update `src`) and set `width`/`height` to the new file's pixel size so
 * its aspect ratio is kept. Served as WebP sized for display; the original PNG/JPEG masters
 * remain in the same folder.
 */
export const organisationLogos = [
  { name: "FITT, IIT Delhi", src: publicAsset("/images/organisations/fitt-iit-delhi.webp"), width: 191, height: 96 },
  { name: "Microsoft", src: publicAsset("/images/organisations/microsoft.webp"), width: 360, height: 77 },
  { name: "IIM Lucknow EIC", src: publicAsset("/images/organisations/iim-lucknow-eic.webp"), width: 360, height: 71 },
  { name: "IIT Ropar", src: publicAsset("/images/organisations/iit-ropar.webp"), width: 213, height: 96 },
  { name: "Kotak BizLab", src: publicAsset("/images/organisations/kotak-bizlab.webp"), width: 360, height: 66 },
  { name: "DST", src: publicAsset("/images/organisations/dst.webp"), width: 349, height: 96 },
  { name: "EXIM Bank", src: publicAsset("/images/organisations/exim-bank.webp"), width: 320, height: 84 },
  { name: "Cyran AI Solutions", src: publicAsset("/images/organisations/cyran-ai-solutions.webp"), width: 243, height: 96 },
  { name: "SIDBI", src: publicAsset("/images/organisations/sidbi.webp"), width: 256, height: 96 },
  { name: "NSDC", src: publicAsset("/images/organisations/nsdc.webp"), width: 288, height: 96 },
  { name: "AICTE", src: publicAsset("/images/organisations/aicte.webp"), width: 96, height: 96 },
  { name: "Startup Punjab", src: publicAsset("/images/organisations/startup-punjab.webp"), width: 96, height: 96 },
] as const;
