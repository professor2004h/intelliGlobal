"use client";

import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

interface PortableTextRendererProps {
  value: PortableTextBlock[];
}

export default function PortableTextRenderer({ value }: PortableTextRendererProps) {
  return <PortableText value={value} />;
}
