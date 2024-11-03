import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { formatDate } from '../utils/date';
import { ArrowLeft, Calendar, User } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  author: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export function PostDetail() {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await api.getPost(Number(id));
        setPost(data);
      } catch (error) {
        console.error('Failed to fetch post:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Post not found</h2>
        <Link to="/posts" className="mt-4 text-indigo-600 hover:text-indigo-500">
          Back to posts
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto">
      <Link
        to="/posts"
        className="inline-flex items-center text-indigo-600 hover:text-indigo-500 mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to posts
      </Link>

      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            <span>{post.author.name}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
          </div>
        </div>
      </header>

      {post.imageUrl && (
        <div className="mb-8">
          <img
            src={`http://localhost:5000${post.imageUrl}`}
            alt={post.title}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      )}

      <div className="prose prose-indigo max-w-none">
        {post.content.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}