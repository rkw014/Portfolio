"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";
import axios from "axios";
import ReactQuill from "react-quill-new";

import 'react-quill-new/dist/quill.snow.css';
import { editorProps } from "@/types/EditorProps";


// Dynamically import react-quill to avoid SSR issues
// https://stackoverflow.com/questions/60458247/how-to-access-reactquill-ref-when-using-dynamic-import-in-nextjs
const Editor = dynamic(async () => {
  const { default: RQ } = await import("react-quill-new");
  // RQ.Quill.debug("info");
  const comp = (
    { ref, ...props }: editorProps
  ) => <RQ ref={ref} {...props} />;
  return comp;

}, { ssr: false });


export default function CreateProjectPage() {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [published, setPublished] = useState(false);
  const router = useRouter();

  const quillRef = useRef<ReactQuill>(null);

  const [altered, setAlter] = useState<number>(0);
  const setAltered = () => {
    if (altered > 1) return;
    setAlter(altered + 1);
  };

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
              if (!quillRef.current) return;
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

  const RQmodule = useMemo(() => {
    return {
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
  }, [handleImage]);



  const handleSubmit = async () => {
    if (!title) {
      alert("Title is required.");
      return;
    }
    const requestBody = {
      title,
      year,
      imgUrl,
      link,
      description,
      content,
      category,
      published,
    };

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_GATEWAY_URI}/api/projects`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Project created successfully!");
      router.push(`/`);
    } catch (err) {
      console.error("Error creating Project:", err);
      alert("Failed to create Project. Check console for details.");
    }
  };

  const handleCancel = () => {
    if (altered > 1) {
      if (!confirm("Are you sure to discard all changes?")) return;
    }
    router.push(`/`);
  };

  

  return !auth.isAuthenticated ? <div>Not Authorized!</div> : (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h1>Create a New Project</h1>
      <label>Title:</label>
      <input
        value={title}
        onChange={(e) => { setAltered(); setTitle(e.target.value) }}
        style={{ width: "100%", marginBottom: 12 }}
      />

      <label>Year:</label>
      <input
        value={year}
        onChange={(e) => { setAltered(); setYear(e.target.value) }}
        style={{ width: "100%", marginBottom: 12 }}
      />

      <label>Cover Image URL:</label>
      <input
        value={imgUrl}
        onChange={(e) => { setAltered(); setImgUrl(e.target.value) }}
        style={{ width: "100%", marginBottom: 12 }}
      />

      <label>Link:</label>
      <input
        value={link}
        onChange={(e) => { setAltered(); setLink(e.target.value) }}
        style={{ width: "100%", marginBottom: 12 }}
      />

      <label>Description:</label>
      <input
        value={description}
        onChange={(e) => { setAltered(); setDescription(e.target.value) }}
        style={{ width: "100%", marginBottom: 12 }}
      />

      <div>
        <label>Published:</label>{" "}
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => { setAltered(); setPublished(e.target.checked) }}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Content:</label>
          <Editor
            key={'quill-editor'}
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={(v: string) => { 
              setAltered(); setContent(v) 
            }}
            modules={RQmodule}
          />

        <label>Category:</label>
        <input
          value={category}
          onChange={(e) => { setAltered(); setCategory(e.target.value) }}
          style={{ width: "100%", marginBottom: 12 }}
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
