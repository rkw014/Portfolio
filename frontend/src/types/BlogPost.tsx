
"use client";

import { StaticImageData } from "next/image";

export type BlogPost = {
  id?: number | string;
  title?: string;
  coverImageUrl?: string | StaticImageData;
  contentMarkdown?: string;
  published?: boolean;
};
