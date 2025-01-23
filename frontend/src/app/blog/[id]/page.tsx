// app/blog/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";


import '@/components/quill.snow.css';
import { useAuth } from "react-oidc-context";
import Link from "next/link";

type BlogPost = {
  id: number;
  title: string;
  coverImageUrl?: string;
  contentMarkdown: string;
  published: boolean;
};

export default function BlogDetailPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [post, setPost] = useState<BlogPost | null>(null);

  const auth = useAuth();
  
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_GATEWAY_URI}/api/blogs/${id}`);
        if (res.status === 200) {
          setPost(res.data);
        }
      } catch (err: any) {
        console.error("Error fetching post:", err);
        // If the post doesn't exist, you might redirect or show a 404 message
        if (err?.response?.status === 404) {
          alert("This blog post does not exist.");
          router.push("/blog");
        }
      }
    };
    fetchData();
  }, [id, router]);

  if (!post) {
    return <div>Loading...</div>;
  }

  const handleEdit = async () => {
    router.push(`/blog/edit/${id}`);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <Link href={"/blog"}>Blogs</Link>
      <h1>{post.title}</h1>
      {post.coverImageUrl && (
        <img
          src={post.coverImageUrl}
          alt="cover"
          style={{ maxWidth: "100%", margin: "16px 0" }}
        />
      )}

      {/* If contentMarkdown is HTML, we can render with dangerouslySetInnerHTML */}
      <div className="ql-container ql-snow">
        <div
          style={{ border: "1px solid #ddd", padding: 12 }}
          dangerouslySetInnerHTML={{ __html: post.contentMarkdown }}
          className="ql-editor"
        />
      </div>
      <div style={{ marginTop: 12 }}>
        Published: {post.published ? "Yes" : "No"}
      </div>
      {auth.user ? (
        <button onClick={handleEdit}>Edit</button>
      ) : null }
    </div>
  );
}
