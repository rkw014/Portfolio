
"use client";
export type BlogPost = {
  id: number;
  title: string;
  coverImageUrl?: string;
  contentMarkdown: string;
  published: boolean;
};
