// lib/getAboutUs.js

// src/app/sanity/getAboutUs.js
// ✅ RIGHT: named import
import { client } from './sanity/client';



export async function getAboutUsContent() {
  const query = `*[_type == "about"][0]{
    title,
    description,
    "imageUrl": image.asset->url
  }`;
  const about = await client.fetch(query);
  return about;
}
