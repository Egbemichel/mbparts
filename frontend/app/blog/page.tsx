"use client"
import React, { useState } from 'react';
import { Calendar, User, Tag, ArrowRight, Search, Facebook, Twitter, Linkedin, Share2 } from 'lucide-react';
import ArrowLeftIcon from "@/public/icons/ArrowLeftIcon";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Types
interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    author: string;
    date: string;
    category: string;
    tags: string[];
    readTime: string;
}

interface Category {
    name: string;
    count: number;
}

// Sample Data
const blogPosts: BlogPost[] = [
    {
        id: 1,
        title: "Durable Auto Parts: Challenges for Manufacturers and Users",
        excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        content: `
      <p>The automotive industry is facing unprecedented challenges in manufacturing durable auto parts that meet the evolving needs of modern vehicles. As technology advances and consumer expectations rise, manufacturers must balance durability, cost-effectiveness, and environmental sustainability.</p>
      
      <h2>Manufacturing Challenges</h2>
      <p>One of the primary challenges manufacturers face is the constant evolution of automotive technology. Electric vehicles, hybrid systems, and advanced driver assistance systems require specialized components that must withstand unique operational stresses.</p>
      
      <blockquote>"Vehicles often reflects harmony with material which is reflected in the design and built quality of the spare parts."</blockquote>
      
      <p>Quality control remains paramount in auto parts manufacturing. Each component must undergo rigorous testing to ensure it meets industry standards and can perform reliably under various conditions.</p>
      
      <h2>User Expectations</h2>
      <p>Modern consumers expect auto parts to last longer while maintaining optimal performance. This expectation drives manufacturers to invest in advanced materials and manufacturing processes.</p>
    `,
        image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop",
        author: "John Smith",
        date: "December 15, 2023",
        category: "Manufacturing",
        tags: ["Auto Parts", "Manufacturing", "Quality"],
        readTime: "5 min read"
    },
    {
        id: 2,
        title: "Using Technology Apps for Convenient Auto Parts Shopping",
        excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        content: `
      <p>The digital transformation of the automotive industry has revolutionized how consumers shop for auto parts. Mobile applications and online platforms have made it easier than ever to find, compare, and purchase the right components for any vehicle.</p>
      
      <h2>Digital Shopping Revolution</h2>
      <p>Modern technology apps offer features like VIN scanning, part compatibility checking, and real-time inventory updates, making the shopping experience more efficient and accurate.</p>
    `,
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
        author: "Sarah Johnson",
        date: "December 12, 2023",
        category: "Technology",
        tags: ["Technology", "Shopping", "Apps"],
        readTime: "4 min read"
    },
    {
        id: 3,
        title: "The Future of Auto Parts: Automotive Vehicles and Electronic Components",
        excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        content: `
      <p>As the automotive industry moves toward electrification and autonomous driving, the landscape of auto parts is rapidly evolving. Electronic components are becoming increasingly important in modern vehicles.</p>
    `,
        image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
        author: "Mike Wilson",
        date: "December 10, 2023",
        category: "Innovation",
        tags: ["Future", "Electronics", "Innovation"],
        readTime: "6 min read"
    },
    {
        id: 4,
        title: "Restoring Classic Cars: The Growing Era of Replacement Auto Parts",
        excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        content: `
      <p>The classic car restoration market is experiencing a renaissance, with enthusiasts seeking high-quality replacement parts to bring vintage vehicles back to their former glory.</p>
    `,
        image: "https://images.unsplash.com/photo-1609721751653-44e3b8b4cc71?w=600&h=400&fit=crop",
        author: "David Brown",
        date: "December 8, 2023",
        category: "Restoration",
        tags: ["Classic Cars", "Restoration", "Vintage"],
        readTime: "7 min read"
    }
];

const categories: Category[] = [
    { name: "How To", count: 12 },
    { name: "Lifestyle", count: 8 },
    { name: "Technology", count: 15 },
    { name: "Truck Trends", count: 6 }
];

const popularPosts = [
    {
        title: "Durable Auto Parts: Challenges for Manufacturers",
        image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=100&h=80&fit=crop",
        date: "Dec 15, 2023"
    },
    {
        title: "Using Technology Apps for Convenient Auto Parts",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=80&fit=crop",
        date: "Dec 12, 2023"
    },
    {
        title: "The Future of Auto Parts: Automotive Vehicles and...",
        image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100&h=80&fit=crop",
        date: "Dec 10, 2023"
    },
    {
        title: "Restoring Classic Cars: The Growing Era of...",
        image: "https://images.unsplash.com/photo-1609721751653-44e3b8b4cc71?w=100&h=80&fit=crop",
        date: "Dec 8, 2023"
    }
];

const tags = [
    "Auto Parts", "Brakes", "Engine", "Maintenance", "Repair", "Technology",
    "Electric", "Hybrid", "Classic", "Restoration"
];

// Blog Card Component
const BlogCard: React.FC<{
    post: BlogPost;
    onClick: (post: BlogPost) => void;
}> = ({ post, onClick }) => {
    return (
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                 onClick={() => onClick(post)}>
            <div className="md:flex">
                <div className="md:w-1/3">
                    <Image
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 md:h-full object-cover"
                        width={300}
                        height={48}
                    />
                </div>
                <div className="md:w-2/3 p-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
                {post.date}
            </span>
                        <span className="flex items-center">
              <User className="w-4 h-4 mr-1" />
                            {post.author}
            </span>
                        <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs">
              {post.category}
            </span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {post.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                    </p>
                    <button className="text-orange-500 font-medium flex items-center hover:text-orange-600">
                        Read More <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                </div>
            </div>
        </article>
    );
};

// Sidebar Component
const BlogSidebar: React.FC = () => {
    return (
        <aside className="space-y-8">
            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Search</h3>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search posts..."
                        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <ul className="space-y-2">
                    {categories.map((category, index) => (
                        <li key={index}>
                            <a href="#" className="flex justify-between items-center py-2 text-gray-600 hover:text-orange-500 transition-colors">
                                <span>{category.name}</span>
                                <span className="text-sm text-gray-400">({category.count})</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Popular Posts */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Post</h3>
                <div className="space-y-4">
                    {popularPosts.map((post, index) => (
                        <div key={index} className="flex space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                            <Image
                                src={post.image}
                                alt={post.title}
                                className="w-16 h-12 object-cover rounded flex-shrink-0"
                                width={16}
                                height={12}
                            />
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                                    {post.title}
                                </h4>
                                <p className="text-xs text-gray-500">{post.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-orange-100 hover:text-orange-600 cursor-pointer transition-colors"
                        >
              {tag}
            </span>
                    ))}
                </div>
            </div>
        </aside>
    );
};

// Single Blog Post Component
const SingleBlogPost: React.FC<{
    post: BlogPost;
    onBack: () => void;
}> = ({ post, onBack }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gray-800 text-white py-16 text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
                    <div className="flex items-center justify-center space-x-2 text-sm">
                        <button onClick={onBack} className="hover:text-orange-500">Home</button>
                        <span>/</span>
                        <button onClick={onBack} className="hover:text-orange-500">Blog</button>
                        <span>/</span>
                        <span className="text-orange-500">Article</span>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Article Meta */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                  {post.date}
              </span>
                            <span className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                                {post.author}
              </span>
                            <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded">
                {post.category}
              </span>
                            <span>{post.readTime}</span>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="w-full">
                        <Image
                            src={post.image}
                            alt={post.title}
                            className="w-full h-64 md:h-96 object-cover"
                            width={300}
                            height={64}
                        />
                    </div>

                    {/* Article Content */}
                    <div className="p-6 md:p-8">
                        <div
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Quote Section */}
                        <div className="bg-gray-800 text-white p-6 rounded-lg my-8">
                            <blockquote className="text-lg italic text-center">
                                &quot;Vehicles often reflects harmony with material which is reflected in the design and built quality of the spare parts.&quot;
                            </blockquote>
                        </div>

                        {/* Additional Images */}
                        <div className="grid md:grid-cols-2 gap-6 my-8">
                            <Image
                                src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop"
                                alt="Auto parts manufacturing"
                                className="w-full h-48 object-cover rounded-lg"
                                width={300}
                                height={48}
                            />
                            <Image
                                src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop"
                                alt="Car maintenance"
                                className="w-full h-48 object-cover rounded-lg"
                                width={300}
                                height={48}
                            />
                        </div>

                        {/* Tags */}
                        <div className="border-t border-gray-200 pt-6 mt-8">
                            <div className="flex flex-wrap items-center gap-2 mb-6">
                                <Tag className="w-4 h-4 text-gray-500" />
                                {post.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-orange-100 hover:text-orange-600 cursor-pointer transition-colors"
                                    >
                    {tag}
                  </span>
                                ))}
                            </div>

                            {/* Share Buttons */}
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-600 font-medium">Share:</span>
                                <button className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                                    <Facebook className="w-4 h-4" />
                                </button>
                                <button className="flex items-center justify-center w-10 h-10 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors">
                                    <Twitter className="w-4 h-4" />
                                </button>
                                <button className="flex items-center justify-center w-10 h-10 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors">
                                    <Linkedin className="w-4 h-4" />
                                </button>
                                <button className="flex items-center justify-center w-10 h-10 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </article>

                {/* Navigation */}
                <div className="mt-8 text-center">
                    <button
                        onClick={onBack}
                        className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors"
                    >
                        ← Back to Blog
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main Blog Component
const BlogPage: React.FC = () => {
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const router = useRouter();

    const handlePostClick = (post: BlogPost) => {
        setSelectedPost(post);
    };

    const handleBackToBlog = () => {
        setSelectedPost(null);
    };

    if (selectedPost) {
        return <SingleBlogPost post={selectedPost} onBack={handleBackToBlog} />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Go Back Button */}
            <button
                className="absolute top-4 left-4 z-20 bg-white rounded-full shadow p-2 hover:bg-gray-100 transition-colors"
                onClick={() => router.back()}
                aria-label="Go back"
            >
                <ArrowLeftIcon className="w-6 h-6 text-gray-700"/>
            </button>
            {/* Header */}
            <div className="bg-gray-800 text-white py-16 text-center">
                <h1 className="text-4xl font-bold mb-2">Blog</h1>
                <div className="flex items-center justify-center space-x-2 text-sm">
                    <span>Home</span>
                    <span>/</span>
                    <span className="text-orange-500">Blog</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <main className="lg:w-2/3">
                        <div className="space-y-8">
                            {blogPosts.map((post) => (
                                <BlogCard
                                    key={post.id}
                                    post={post}
                                    onClick={handlePostClick}
                                />
                            ))}
                        </div>
                    </main>

                    {/* Sidebar - Hidden on mobile, shown on desktop */}
                    <div className="hidden lg:block lg:w-1/3">
                        <BlogSidebar />
                    </div>
                </div>

                {/* Mobile Sidebar - Shown only on mobile */}
                <div className="lg:hidden mt-12">
                    <BlogSidebar />
                </div>
            </div>
        </div>
    );
};

export default BlogPage;