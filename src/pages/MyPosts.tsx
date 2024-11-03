import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/date';
import { PenSquare, Trash2, Edit, ChevronRight } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  author: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export function MyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      if (!token) return;
      try {
        const data = await api.getMyPosts(token);
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [token]);

  const handleDelete = async (postId: number) => {
    if (!token || !window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.deletePost(postId, token);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <PenSquare className="h-6 w-6 text-indigo-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-900">My Posts</h1>
        </div>
        <Link
          to="/new-post"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PenSquare className="h-4 w-4 mr-2" />
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">You haven't created any posts yet.</p>
          <Link
            to="/new-post"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PenSquare className="h-4 w-4 mr-2" />
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {posts.map((post) => (
              <li key={post.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <Link to={`/posts/${post.id}`} className="flex-1">
                      <h2 className="text-xl font-semibold text-indigo-600 truncate flex items-center">
                        {post.title}
                        <ChevronRight className="h-5 w-5 text-gray-400 ml-2" />
                      </h2>
                    </Link>
                    <div className="ml-4 flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/edit-post/${post.id}`)}
                        className="p-2 text-gray-400 hover:text-indigo-600"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-gray-600 line-clamp-2">{post.content}</p>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <time dateTime={post.createdAt}>
                        {formatDate(post.createdAt)}
                      </time>
                    </div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      post.published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}