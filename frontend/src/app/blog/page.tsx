// pages/blog/index.js
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { BlogPost } from '@/types/BlogPost';
import { useAuth } from 'react-oidc-context';

export default function BlogList() {
  const [posts, setPosts] = useState<Array<BlogPost> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_GATEWAY_URI}/api/blogs/all`);
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching blog posts:", err);
      }
    };
    fetchData();
  }, []);

  const auth = useAuth();
  const token = auth.user?.access_token || "";

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {token ? 
        <Link href={"/blog/create"}>New Post</Link> : null}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts && posts.map((post) => {
          if (!post.published) return;
          return (
          <li key={post.id} style={{ marginBottom: '40px' }}>
            <Link href={`/blog/${post.id}`}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {post.coverImageUrl && 
                    <Image
                      src={post.coverImageUrl}
                      alt={post.title}
                      width={150}
                      height={100}
                      objectFit="cover"
                      style={{ borderRadius: '8px', marginRight: '20px' }}
                    />
                  }
                  <div>
                    <h2>{post.title}</h2>
                  </div>
                </div>
            </Link>
          </li>
        )}
        )
        }
      </ul>
    </div>
  );
};
