"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Heart,
  ChatCircle,
  Trash,
  Image as ImageIcon,
  X,
  PaperPlaneTilt,
  UserCircle,
} from '@phosphor-icons/react';
import Button from "@/components/Button";
import customToast from "@/lib/toast";
import { CommunityService } from "@/services/community";
import { CommunityPost, CommunityPostComment, CommunityRole } from "@/types/community";
import { useUserStore } from "@/store/useUserStore";

interface CommunityDiscussionsProps {
  communityId: string;
  canParticipate: boolean;
  myRole: CommunityRole | null;
  onRequestFollow: () => void;
  followLoading?: boolean;
}

const uploadImage = async (file: File): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body: formData });
    if (!response.ok) throw new Error("Failed to upload image");
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("Image upload failed:", error);
    return null;
  }
};

const formatTimestamp = (dateStr: string) => {
  const date = new Date(dateStr);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const Avatar: React.FC<{ src?: string | null; name: string; size?: number }> = ({ src, name, size = 40 }) => (
  <div
    className="rounded-full bg-foreground/5 flex items-center justify-center overflow-hidden shrink-0"
    style={{ width: size, height: size }}
  >
    {src ? (
      <Image src={src} alt={name} width={size} height={size} className="w-full h-full object-cover" />
    ) : (
      <UserCircle size={size} color="currentColor" weight="fill" className="text-foreground/30" />
    )}
  </div>
);

const CommunityDiscussions: React.FC<CommunityDiscussionsProps> = ({
  communityId,
  canParticipate,
  myRole,
  onRequestFollow,
  followLoading,
}) => {
  const { user } = useUserStore();

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [posting, setPosting] = useState(false);

  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, CommunityPostComment[]>>({});
  const [commentsLoading, setCommentsLoading] = useState<string | null>(null);
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({});
  const [commentSubmitting, setCommentSubmitting] = useState<string | null>(null);

  const isModerator = myRole === "OWNER" || myRole === "ADMIN";

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const result = await CommunityService.listPosts(communityId, { page: 1, limit: 10 });
        setPosts(result.posts);
        setPage(result.page);
        setTotalPages(result.totalPages);
      } catch (err) {
        console.error("Failed to load discussion posts:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, [communityId]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const result = await CommunityService.listPosts(communityId, { page: page + 1, limit: 10 });
      setPosts((prev) => [...prev, ...result.posts]);
      setPage(result.page);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error("Failed to load more posts:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    e.target.value = "";

    setUploading(true);
    try {
      const urls = await Promise.all(files.map((file) => uploadImage(file)));
      const successful = urls.filter((url): url is string => !!url);
      if (successful.length < files.length) {
        customToast.error("Some images failed to upload");
      }
      setImages((prev) => [...prev, ...successful].slice(0, 10));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    setImages((prev) => prev.filter((img) => img !== url));
  };

  const handleSubmitPost = async () => {
    if (!content.trim() || posting) return;

    setPosting(true);
    try {
      const post = await CommunityService.createPost(communityId, { content: content.trim(), images });
      setPosts((prev) => [post, ...prev]);
      setContent("");
      setImages([]);
    } catch (err: any) {
      customToast.error(err.response?.data?.message || "Failed to create post");
    } finally {
      setPosting(false);
    }
  };

  const handleToggleLike = async (post: CommunityPost) => {
    if (!canParticipate) {
      onRequestFollow();
      return;
    }

    const wasLiked = post.isLiked;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? { ...p, isLiked: !wasLiked, likesCount: p.likesCount + (wasLiked ? -1 : 1) }
          : p
      )
    );

    try {
      if (wasLiked) {
        await CommunityService.unlikePost(communityId, post.id);
      } else {
        await CommunityService.likePost(communityId, post.id);
      }
    } catch (err) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? { ...p, isLiked: wasLiked, likesCount: p.likesCount + (wasLiked ? 1 : -1) }
            : p
        )
      );
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Delete this post?")) return;
    try {
      await CommunityService.deletePost(communityId, postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err: any) {
      customToast.error(err.response?.data?.message || "Failed to delete post");
    }
  };

  const toggleComments = async (postId: string) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
      return;
    }
    setExpandedPostId(postId);
    if (!comments[postId]) {
      setCommentsLoading(postId);
      try {
        const result = await CommunityService.listComments(communityId, postId, { page: 1, limit: 50 });
        setComments((prev) => ({ ...prev, [postId]: result.comments }));
      } catch (err) {
        console.error("Failed to load comments:", err);
      } finally {
        setCommentsLoading(null);
      }
    }
  };

  const handleAddComment = async (postId: string) => {
    const draft = (commentDraft[postId] || "").trim();
    if (!draft || commentSubmitting === postId) return;

    setCommentSubmitting(postId);
    try {
      const comment = await CommunityService.addComment(communityId, postId, { content: draft });
      setComments((prev) => ({ ...prev, [postId]: [...(prev[postId] || []), comment] }));
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p)));
      setCommentDraft((prev) => ({ ...prev, [postId]: "" }));
    } catch (err: any) {
      customToast.error(err.response?.data?.message || "Failed to add comment");
    } finally {
      setCommentSubmitting(null);
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      await CommunityService.deleteComment(communityId, postId, commentId);
      setComments((prev) => ({
        ...prev,
        [postId]: (prev[postId] || []).filter((c) => c.id !== commentId),
      }));
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, commentsCount: Math.max(0, p.commentsCount - 1) } : p)));
    } catch (err: any) {
      customToast.error(err.response?.data?.message || "Failed to delete comment");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Composer */}
      {canParticipate ? (
        <div className="bg-background border border-foreground/10 rounded-2xl p-5 mb-6">
          <div className="flex gap-3">
            <Avatar src={user?.avatar} name={user?.displayName || "You"} />
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share an update, photo, or question with the community…"
                rows={3}
                maxLength={3000}
                className="w-full resize-none bg-transparent outline-none text-foreground placeholder:text-foreground/40"
              />
              {images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {images.map((url) => (
                    <div key={url} className="relative w-16 h-16 rounded-xl overflow-hidden group">
                      <Image src={url} alt="" fill className="object-cover" />
                      <button
                        onClick={() => removeImage(url)}
                        className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center"
                      >
                        <X size={12} color="currentColor" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between mt-3">
                <label className="flex items-center gap-2 text-sm text-foreground/60 hover:text-primary cursor-pointer">
                  <ImageIcon size={20} color="currentColor" weight="regular" />
                  <span>{uploading ? "Uploading…" : "Add photos"}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    className="hidden"
                    disabled={uploading}
                    onChange={handleImageSelect}
                  />
                </label>
                <Button
                  variant="primary"
                  size="sm"
                  rightIcon={PaperPlaneTilt}
                  onClick={handleSubmitPost}
                  isLoading={posting}
                  disabled={!content.trim() || uploading}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-foreground/5 border border-dashed border-foreground/10 rounded-2xl p-6 text-center mb-6">
          <p className="text-foreground/70 mb-4">Follow this community to join the discussion.</p>
          <Button variant="primary" size="md" onClick={onRequestFollow} isLoading={followLoading}>
            Follow
          </Button>
        </div>
      )}

      {/* Feed */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : posts.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-foreground/10 rounded-2xl">
          <p className="text-foreground/60">No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const canModifyPost = post.author.id === user?.id || isModerator;
            const postComments = comments[post.id] || [];

            return (
              <div key={post.id} className="bg-background border border-foreground/10 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <Avatar src={post.author.avatar} name={post.author.displayName} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="font-semibold text-foreground">{post.author.displayName}</span>
                        <span className="text-foreground/50 text-sm ml-2">{formatTimestamp(post.createdAt)}</span>
                      </div>
                      {canModifyPost && (
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-foreground/40 hover:text-red-500 transition-colors"
                        >
                          <Trash size={18} color="currentColor" weight="regular" />
                        </button>
                      )}
                    </div>
                    <p className="text-foreground/90 mt-2 whitespace-pre-wrap">{post.content}</p>

                    {post.images.length > 0 && (
                      <div className={`grid gap-2 mt-3 ${post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                        {post.images.slice(0, 4).map((url, idx) => (
                          <div key={url} className="relative aspect-video rounded-xl overflow-hidden bg-foreground/5">
                            <Image src={url} alt="" fill className="object-cover" />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-5 mt-4">
                      <button
                        onClick={() => handleToggleLike(post)}
                        className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                          post.isLiked ? "text-primary" : "text-foreground/60 hover:text-primary"
                        }`}
                      >
                        <Heart size={18} color="currentColor" weight={post.isLiked ? "fill" : "regular"} />
                        <span>{post.likesCount}</span>
                      </button>
                      <button
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center gap-1.5 text-sm font-medium text-foreground/60 hover:text-primary transition-colors"
                      >
                        <ChatCircle size={18} color="currentColor" weight="regular" />
                        <span>{post.commentsCount}</span>
                      </button>
                    </div>

                    {expandedPostId === post.id && (
                      <div className="mt-4 pt-4 border-t border-foreground/10 space-y-3">
                        {commentsLoading === post.id ? (
                          <div className="text-sm text-foreground/50">Loading comments…</div>
                        ) : (
                          postComments.map((comment) => {
                            const canModifyComment = comment.author.id === user?.id || isModerator;
                            return (
                              <div key={comment.id} className="flex items-start gap-2.5">
                                <Avatar src={comment.author.avatar} name={comment.author.displayName} size={28} />
                                <div className="flex-1 min-w-0 bg-foreground/5 rounded-xl px-3 py-2">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-semibold text-sm text-foreground">{comment.author.displayName}</span>
                                    {canModifyComment && (
                                      <button
                                        onClick={() => handleDeleteComment(post.id, comment.id)}
                                        className="text-foreground/30 hover:text-red-500 transition-colors"
                                      >
                                        <Trash size={14} color="currentColor" weight="regular" />
                                      </button>
                                    )}
                                  </div>
                                  <p className="text-sm text-foreground/80">{comment.content}</p>
                                </div>
                              </div>
                            );
                          })
                        )}

                        {canParticipate && (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={commentDraft[post.id] || ""}
                              onChange={(e) => setCommentDraft((prev) => ({ ...prev, [post.id]: e.target.value }))}
                              onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.id)}
                              placeholder="Write a comment…"
                              maxLength={1000}
                              className="flex-1 bg-foreground/5 rounded-full px-4 py-2 text-sm outline-none text-foreground placeholder:text-foreground/40"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAddComment(post.id)}
                              isLoading={commentSubmitting === post.id}
                              disabled={!(commentDraft[post.id] || "").trim()}
                            >
                              Send
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {page < totalPages && (
            <div className="flex justify-center pt-2">
              <Button variant="outline" size="md" onClick={handleLoadMore} isLoading={loadingMore}>
                Load more
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommunityDiscussions;
