// components/BlogCard.tsx
import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "../types/BlogPost";

import questionmarkPic from '../../public/question_mark.png';

interface BlogCardProps {
  blog: BlogPost;
}

const BlogCard: FC<BlogCardProps> = ({ blog }) => {

  // const excerpt =
  //   blog.contentMarkdown.length > 150
  //     ? blog.contentMarkdown.slice(0, 150) + "..."
  //     : blog.contentMarkdown;

  return (
    <Link href={blog.id !== "#" ? `/blog/${blog.id}` : blog.id} className="block p-6 bg-white rounded-lg shadow-md transition transform hover:scale-105 hover:shadow-lg">
      <div className="relative h-48 w-full mb-4">
        <Image
          src={blog.coverImageUrl && blog.coverImageUrl !== "" ? blog.coverImageUrl : questionmarkPic }
          alt={blog.title!}
          layout="fill"
          objectFit="cover"
          className="rounded-md"
        />
      </div>
      <h3 className="text-2xl font-bold mb-2 text-gray-800">{blog.title}</h3>
      {/* <p className="text-gray-600">{excerpt}</p> */}
    </Link>
  );
};

export default BlogCard;
