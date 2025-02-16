// app/blog/create/page.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";
import axios from "axios";

import '@/components/quill.snow.css';

// Dynamically import react-quill to avoid SSR issues
// https://stackoverflow.com/questions/60458247/how-to-access-reactquill-ref-when-using-dynamic-import-in-nextjs
const ReactQuill = dynamic(async () => {
  const {default: RQ} =  await import("react-quill-new");
  // eslint-disable-next-line react/display-name
  return ({ forwardedRef, ...props}) => <RQ ref={forwardedRef} {...props} />;
}, { ssr: false });

export default function CreateBlogPage() {
  const [title, setTitle] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [content, setContent] = useState("");
  const router = useRouter();

  const quillRef = useRef(null);
  
  const [altered, setAlter] = useState<number>(0);
  const setAltered = () =>{
    if (altered > 1) return;
    setAlter(altered + 1);
  };

  const handleImage = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      if (!input.files) { return; }

      const file = input.files[0];
      if (file) {
        try {
          // 请求后端获取预签名 URL
          
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_GATEWAY_URI}/api/blogs/presign`, 
            {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              filename: file.name,
            }
          });

          if (res.statusText === "OK") {
            const { presignedUrl, publicUrl } = res.data;

            // 使用预签名 URL 上传图片
            const uploadResponse = await axios.put(
              presignedUrl, 
              file,
              {
                headers:{
                  "Content-Type": file.type,
                }
              }
            );

            if (uploadResponse.statusText === "OK") {
              // 插入图片到编辑器
              if (!quillRef.current) {return;}
              const editor = quillRef.current.getEditor();
              const range = editor.getSelection();
              editor.insertEmbed(range.index, 'image', publicUrl);
            } else {
              alert('Failed to upload image');
            }
          } else {
            alert('Failed to fetch Presigned Url');
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Error uploading image');
        }
      }
    };
  }

  const RQmodule = useMemo( () => 
    { return {
        "toolbar": {
          "container": [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['image', 'code-block'],
          ],
          "handlers": {
            image: handleImage,
          }
        }
      }
    }
    , []);

  // Get token from OIDC context
  const auth = useAuth();
  const token = auth.user?.access_token || "";
  useEffect(()=>{
    if(!auth.isLoading && !auth.isAuthenticated){
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

  return !auth.isAuthenticated ? <div>Not Authorized!</div> : (
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
            forwardedRef={quillRef}
            theme="snow" 
            value={content} 
            onChange={(v)=>{setAltered(); setContent(v)}} 
            modules={RQmodule}
          />

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
