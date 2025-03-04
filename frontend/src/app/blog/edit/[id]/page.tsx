// app/blog/edit/[id]/page.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "react-oidc-context";
import axios from "axios";

import 'react-quill-new/dist/quill.snow.css';
import { BlogPost } from "../../../../types/BlogPost";
import { editorProps } from "@/types/EditorProps";
import ReactQuill from "react-quill-new";


// Dynamically import react-quill to avoid SSR issues
// https://stackoverflow.com/questions/60458247/how-to-access-reactquill-ref-when-using-dynamic-import-in-nextjs
const Editor = dynamic(async () => {
  const { default: RQ } = await import("react-quill-new");
  const comp = (
    { ref, ...props }: editorProps
  ) => <RQ ref={ref} {...props} />;
  return comp;

}, { ssr: false, loading: ()=><div>Loading...</div>});

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;


  const [post, setPost] = useState<BlogPost | null>(null);
  const [altered, setAlter] = useState<number>(0);
  const setAltered = () => {
    if (altered > 1) return;
    setAlter(altered + 1);
  };


  const quillRef = useRef<ReactQuill>(null);

  // Get token from OIDC context
  const auth = useAuth();
  const [token, setToken] = useState("");
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.replace(`/`);
    }
    if (auth.isAuthenticated) {
      setToken(auth.user?.access_token || "");
    }
  }, [auth, router]);

  const handleImage = useCallback(async () => {
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

          if (res.status === 200) {
            const { presignedUrl, publicUrl } = res.data;

            // 使用预签名 URL 上传图片
            const uploadResponse = await axios.put(
              presignedUrl,
              file,
              {
                headers: {
                  "Content-Type": file.type,
                }
              }
            );

            if (uploadResponse.status === 200) {
              // 插入图片到编辑器
              if (!quillRef.current) { return; }
              const editor = quillRef.current.getEditor();
              const range = editor.getSelection();
              if (!range) return;
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
  }, [token, quillRef]);

  const mod = useMemo(() => {
    return {
      "toolbar": {
        "container": [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ 'font': [] }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike', 'code'],
          ['code-block', 'blockquote', 'link', 'image'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
          [{ 'script': 'sub' }, { 'script': 'super' }],
          [{ 'indent': '-1' }, { 'indent': '+1' }],
          [{ 'align': [] }],
          [{ 'color': [] }, { 'background': [] }],
          ['clean']
        ],
        "handlers": {
          image: handleImage,
        }
      },
    }
  }
    , [handleImage]);


  useEffect(() => {
    if (!id) return;
    if (auth.isLoading) { return; }
    if (!auth.user?.access_token) { return; }
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_GATEWAY_URI}/api/blogs/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.user?.access_token}`
          }
        });
        setPost(res.data);
      } catch (err) {
        console.error("Error fetching blog post:", err);
      }
    };
    fetchData();
  }, [auth.isLoading, auth.user?.access_token, id]);

  const handleUpdate = async () => {
    if (!post) return;
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_GATEWAY_URI}/api/blogs/${post.id}`, post, {
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
    if (!post) return;
    if (altered > 1) {
      if (!confirm("Are you sure to discard all changes?")) return;
    }
    router.push(`/blog/${post.id}`);
  };

  return !post ? <div>Loading post...</div> :
    !auth.isAuthenticated ? <div>Not Authorized!</div> :
      (
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h1>Edit Blog Post</h1>
          <label>Title:</label>
          <input
            value={post.title}
            onChange={(e) => { setAltered(); setPost({ ...post, title: e.target.value }); }}
            style={{ width: "100%", marginBottom: 12 }}
          />

          <label>Cover Image URL:</label>
          <input
            value={typeof post.coverImageUrl === "string"
              ? post.coverImageUrl
              : post.coverImageUrl?.src || ""}
            onChange={(e) => { setAltered(); setPost({ ...post, coverImageUrl: e.target.value }); }}
            style={{ width: "100%", marginBottom: 12 }}
          />

          <div>
            <label>Published:</label>{" "}
            <input
              type="checkbox"
              checked={post.published}
              onChange={(e) => { setAltered(); setPost({ ...post, published: e.target.checked }); }}
            />
          </div>

          <div style={{ marginTop: 12 }}>
            <label>Content:</label>
            <Editor
              key={"quill-editor"}
              theme="snow"
              ref={quillRef}
              defaultValue={post.contentMarkdown}
              onChange={(val: string) => { setAltered(); setPost({ ...post, contentMarkdown: val }); }}
              modules={mod}
              placeholder="Start to type your blog"
            />
          </div>

          <button onClick={handleUpdate} style={{ marginTop: 16, marginRight: 8 }}>
            Save
          </button>
          <button onClick={handleCancel} style={{ marginTop: 16 }}>
            Cancel
          </button>
        </div>
      );
}
