// app/blog/edit/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "react-oidc-context";
import axios from "axios";

import '@/components/quill.snow.css';
import { BlogPost } from "../../../../types/BlogPost";

const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false,
  loading: ()=><p>Loading Quill ...</p>
 });

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [altered, setAlter] = useState<number>(0);
  const setAltered = () =>{
    if (altered > 1) return;
    setAlter(altered + 1);
  };

  const auth = useAuth();
  const token = auth.user?.access_token || "";
  useEffect(()=>{
    if(!auth.isLoading && !auth.isAuthenticated){
      alert("You don't have permission to edit posts.");
      router.replace(`/blog/${id}`);
    }
  }, [auth, router]);

  if (!auth.isAuthenticated) return null;
  // The rest part is still present in js file transfered to client,
  // no matter the user is authenticated or not.

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_GATEWAY_URI}/api/blogs/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error("Error fetching blog post:", err);
      }
    };
    fetchData();
  }, [id]);

  const handleUpdate = async () => {
    if (!post) return;
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_GATEWAY_URI}/api/blogs/${post.id}`, post, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Blog post updated successfully!");
      router.push(`/blog/${post.id}`);
    } catch (err) {
      console.error("Error updating post:", err);
      alert("Update failed.");
    }
  };

  const handleCancel = () => {
    if (!post ) return;
    if (altered > 1) {
      if (!confirm("Are you sure to discard all changes?")) return;
    }
    router.push(`/blog/${post.id}`);
  };

  if (!post) {
    return <div>Loading post...</div>;
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h1>Edit Blog Post</h1>
      <label>Title:</label>
      <input
        value={post.title}
        onChange={(e) => {setAltered(); setPost({ ...post, title: e.target.value });}}
        style={{ width: "100%", marginBottom: 12 }}
      />

      <label>Cover Image URL:</label>
      <input
        value={post.coverImageUrl || ""}
        onChange={(e) => {setAltered(); setPost({ ...post, coverImageUrl: e.target.value });}}
        style={{ width: "100%", marginBottom: 12 }}
      />

      <div>
        <label>Published:</label>{" "}
        <input
          type="checkbox"
          checked={post.published}
          onChange={(e) => {setAltered(); setPost({ ...post, published: e.target.checked });}}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Content:</label>
        <ReactQuill
          theme="snow"
          value={post.contentMarkdown}
          onChange={(val) => {setAltered(); setPost({ ...post, contentMarkdown: val });}}
          modules={{
            toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                ['image', 'code-block'],
              ]
          }}
          // formats={[
          //   "headers",
          //   "font",
          //   "size",
          //   "bold",
          //   "italic",
          //   "underline",
          //   "strike",
          //   "blockquote",
          //   "list",
          //   "bullet",
          //   "indent",
          //   "link",
          //   "image",
          // ]}
          placeholder="Start to type your blog"
        />
      </div>

      <button onClick={handleUpdate} style={{ marginTop: 16 }}>
        Save
      </button>
      <button onClick={handleCancel} style={{ marginTop: 16 }}>
        Cancel
      </button>
    </div>
  );
}
