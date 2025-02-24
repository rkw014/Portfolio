// app/blog/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";


import 'react-quill-new/dist/quill.snow.css';
import { useAuth } from "react-oidc-context";
import Link from "next/link";
import Image from "next/image";

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
      if(auth.isLoading){return;}
      try {
        let res = null;
        if (auth.isAuthenticated){
          res = await axios.get(`${process.env.NEXT_PUBLIC_GATEWAY_URI}/api/blogs/${id}`,{
            headers: {
              Authorization: `Bearer ${auth.user?.access_token}`
            }
          });
        }else{
          res = await axios.get(`${process.env.NEXT_PUBLIC_GATEWAY_URI}/api/blogs/${id}`);
        }
        setPost(res.data);

      } catch (err: unknown) {
        console.error("Error fetching post:", err);
        alert("This blog post does not exist.");
        router.push("/blog");
      }
    };
    fetchData();
  }, [auth.isAuthenticated, auth.isLoading, auth.user?.access_token, id, router]);

  if (!post || auth.isLoading) {
    return <div>Loading...</div>;
  }

  const handleEdit = async () => {
    router.push(`/blog/edit/${id}`);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <Link href={"/blog"} className="">Blogs</Link>
      <h3 className="text-3xl font-bold mb-4">{post.title}</h3>
      <div className="relative h-48 w-full mb-4">
        {post.coverImageUrl && (
          <Image
            src={post.coverImageUrl}
            alt="cover"
            style={{ maxWidth: "100%", margin: "16px 0" }}
            layout="fill"
            objectFit="contain"
          />
        )}
      </div>

      {/* If contentMarkdown is HTML, we can render with dangerouslySetInnerHTML */}
      <div className="ql-container ql-snow">
        <div
          style={{ border: "1px solid #ddd", padding: 12 }}
          dangerouslySetInnerHTML={{ __html: post.contentMarkdown }}
          className="ql-editor"
        />
      </div>
      
      {auth.isAuthenticated ? <div style={{ marginTop: 12 }}>
        Published: {post.published ? "Yes" : "No"}
      </div> : null}

      {auth.isAuthenticated ? (
        <button onClick={handleEdit}>Edit</button>
      ) : null}
    </div>
  );
}
