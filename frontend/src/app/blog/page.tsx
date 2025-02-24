"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { BlogPost } from '@/types/BlogPost';
import { useAuth } from 'react-oidc-context';
import BlogCard from '@/components/BlogCard';
import questionmarkPic from '../../../public/question_mark.png';

export default function BlogList() {
  const [posts, setPosts] = useState<Array<BlogPost> | null>(null);
  const [drafts, setDrafts] = useState<Array<BlogPost> | null>(null);

  const auth = useAuth();

  useEffect(() => {
    if(auth.isLoading){return;}
    const fetchData = async () => {
      try {
        let res = null;
        if (auth.isAuthenticated){
          res = await axios.get(`${process.env.NEXT_PUBLIC_GATEWAY_URI}/api/blogs/all`,{
            headers: {
              Authorization: `Bearer ${auth.user?.access_token}`
            }
          });
        }else{
          res = await axios.get(`${process.env.NEXT_PUBLIC_GATEWAY_URI}/api/blogs/all`);
        }
        const publishedBlogs = res.data.filter((blog: BlogPost) => blog.published);
        const draftBlogs = res.data.filter((blog: BlogPost) => !blog.published);
        setPosts(publishedBlogs);
        setDrafts(draftBlogs);
      } catch (err) {
        console.error("Error fetching blog posts:", err);
      }
    };
    fetchData();
  }, [auth.isLoading, auth.isAuthenticated, auth.user?.access_token]);


  const placeholderBlog: BlogPost = {
    id: "#",
    title: "Awesom Post",
    coverImageUrl: questionmarkPic,
    contentMarkdown: "",
    published: true,
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div className='flex flex-row justify-between items-center'>
        <h2 className="text-3xl font-bold mb-4">Blogs</h2>
        {auth.isAuthenticated &&
          <Link href={"/blog/create"} className="text-3xl font-bold mb-4">+</Link>}
      </div>

      <div className="space-y-6">
        {posts && posts.length !== 0 ? posts.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        )) : <BlogCard key={placeholderBlog.id!} blog={placeholderBlog} />}
      </div>

      {auth.isAuthenticated &&
        <div className="mt-2">
          <h2 className="text-3xl font-bold mb-4">Drafts</h2>
          <div className="space-y-6">
            {drafts && drafts.length !== 0 ? drafts.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            )) : <BlogCard key={placeholderBlog.id!} blog={placeholderBlog} />}
          </div>
        </div>}
    </div>
  );
};
