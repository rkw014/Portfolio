// app/blog/create/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";
import axios from "axios";

import '@/components/quill.snow.css';

// Dynamically import react-quill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function CreateBlogPage() {
  const [title, setTitle] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [content, setContent] = useState("");
  const router = useRouter();

  
  const [altered, setAlter] = useState<number>(0);
  const setAltered = () =>{
    if (altered > 1) return;
    setAlter(altered + 1);
  };

  // Get token from OIDC context
  const auth = useAuth();
  const token = auth.user?.access_token || "";
  useEffect(()=>{
    if(!auth.isLoading && !auth.isAuthenticated){
      alert("You don't have permission to edit posts.");
      router.replace(`/blog`);
    }
  }, [auth, router]);

  if (!auth.isAuthenticated) return null;

  const handleSubmit = async () => {
    if (!title) {
      alert("Title is required.");
      return;
    }
    const requestBody = {
      title,
      coverImageUrl,
      published,
      contentMarkdown: content,
    };

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_GATEWAY_URI}/api/blogs`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Blog post created successfully!");
      router.push(`/blog/${res.data.id}`); // Go to detail page
    } catch (err) {
      console.error("Error creating blog post:", err);
      alert("Failed to create blog post. Check console for details.");
    }
  };

  const handleCancel = () => {
    if (altered > 1) {
      if (!confirm("Are you sure to discard all changes?")) return;
    }
    router.push(`/blog`);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h1>Create a New Blog Post</h1>
      <label>Title:</label>
      <input
        value={title}
        onChange={(e) => {setAltered(); setTitle(e.target.value)}}
        style={{ width: "100%", marginBottom: 12 }}
      />

      <label>Cover Image URL:</label>
      <input
        value={coverImageUrl}
        onChange={(e) => {setAltered(); setCoverImageUrl(e.target.value)}}
        style={{ width: "100%", marginBottom: 12 }}
      />

      <div>
        <label>Published:</label>{" "}
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => {setAltered(); setPublished(e.target.checked)}}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Content:</label>
          <ReactQuill 
            theme="snow" 
            value={content} 
            onChange={(v)=>{setAltered(); setContent(v)}} />

      </div>

      <button onClick={handleSubmit} style={{ marginTop: 16 }}>
        Save
      </button>
      <button onClick={handleCancel} style={{ marginTop: 16 }}>
        Cancel
      </button>
    </div>
  );
}
