"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { useParams } from "next/navigation";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  publishedAt: string;
  coverImage?: {
    formats?: {
      medium?: {
        url: string;
      };
    };
  };
}

export default function SingleBlogPostPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!slug) return;
      try {
        const res = await fetch(`http://localhost:1337/api/blogs?filters[slug][$eq]=${slug}&populate=*`);
        const data = await res.json();
        if (data.data && data.data.length > 0) {
          setBlog(data.data[0]);
        } else {
          setBlog(null);
        }
      } catch (error) {
        console.error("Failed to fetch blog post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [slug]);

  if (loading) return <p className="text-center mt-10 text-text-main">Loading blog post...</p>;
  if (!blog) return <p className="text-center mt-10 text-danger-DEFAULT">Blog post not found.</p>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:px-6 lg:px-8 bg-background-DEFAULT shadow-lg rounded-lg my-8">
      {blog.coverImage && (
        <div className="mb-6">
          <Image
            src={`http://localhost:1337${blog.coverImage.formats?.medium?.url}`}
            alt={blog.title}
            width={1200}
            height={600}
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>
      )}

      <h1 className="text-4xl md:text-5xl font-bold text-primary-dark mb-4 leading-tight">
        {blog.title}
      </h1>

      <p className="text-sm text-text-muted mb-6 border-b border-background-muted pb-4">
        Published: {new Date(blog.publishedAt).toLocaleDateString()}
      </p>

      <div className="prose prose-lg max-w-none text-text-main">
        <ReactMarkdown>{blog.content}</ReactMarkdown>
      </div>
    </div>
  );
}
