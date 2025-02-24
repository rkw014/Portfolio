import { StaticImageData } from "next/image";

export type Project = {
  id: string;
  title: string;
  year: string;
  imgUrl: string|StaticImageData;
  link: string;
  description: string;
  content: string;
  category: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}