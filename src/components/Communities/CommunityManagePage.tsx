"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CaretLeft,
  ChartBar,
  Buildings,
  UsersThree,
  CalendarBlank,
  Gear,
  Plus,
  Trash,
  PencilSimple,
  X,
  UploadSimple,
  CaretRight,
} from '@phosphor-icons/react';
import Button from "@/components/Button";
import EventCard from "@/components/Homepage/EventCard";
import customToast from "@/lib/toast";
import { CommunityService } from "@/services/community";
import { getTicketPriceInfo } from "@/utils/ticket-pricing";
import {
  CommunityChapter,
  CommunityDetail,
  CommunityMember,
  CommunityOverview,
  CommunityRole,
} from "@/types/community";
import { Event } from "@/types/event";

interface CommunityManagePageProps {
  communityId: string;
}

const ROLE_LABELS: Record<string, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  CHAPTER_LEAD: "Chapter Lead",
};

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

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="p-4 rounded-2xl border border-foreground/10 bg-background">
    <div className="text-2xl font-bold text-foreground">{value}</div>
    <div className="text-sm text-foreground/60 mt-1">{label}</div>
  </div>
);

const Spinner: React.FC = () => (
  <div className="flex items-center justify-center py-16">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
  </div>
);

const mapEventToCard = (event: any) => {
  const { label, count } = getTicketPriceInfo(event.tickets || []);
  return {
    id: event.id,
    title: event.title,
    slug: event.slug || undefined,
    date: new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: `${event.startTime} - ${event.endTime}`,
    location: event.venueName || event.city || "Online",
    price: label,
    ticketCount: count,
    category: event.category,
    attendees: event.attendeesCount || 0,
    image: event.coverImage,
    locationType: event.locationType,
  };
};

const CommunityManagePage: React.FC<CommunityManagePageProps> = ({ communityId }) => {
  const router = useRouter();

  const [community, setCommunity] = useState<CommunityDetail | null>(null);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [myChapters, setMyChapters] = useState<CommunityChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");

  // Overview
  const [overview, setOverview] = useState<CommunityOverview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(false);

  // Chapters
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [editingChapter, setEditingChapter] = useState<CommunityChapter | null>(null);
  const [chapterNameInput, setChapterNameInput] = useState("");
  const [savingChapter, setSavingChapter] = useState(false);
  const [deletingChapterId, setDeletingChapterId] = useState<string | null>(null);

  // Members
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState<{ emailOrUserId: string; role: CommunityRole; chapterId: string }>({
    emailOrUserId: "",
    role: CommunityRole.CHAPTER_LEAD,
    chapterId: "",
  });
  const [invitingMember, setInvitingMember] = useState(false);
  const [editingMember, setEditingMember] = useState<CommunityMember | null>(null);
  const [editMemberForm, setEditMemberForm] = useState<{ role: CommunityRole; chapterId: string }>({
    role: CommunityRole.CHAPTER_LEAD,
    chapterId: "",
  });
  const [savingMember, setSavingMember] = useState(false);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);

  // Events
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");
  const [chapterEvents, setChapterEvents] = useState<Event[]>([]);
  const [chapterEventsLoading, setChapterEventsLoading] = useState(false);
  const [chapterEventsPage, setChapterEventsPage] = useState(1);
  const [chapterEventsTotalPages, setChapterEventsTotalPages] = useState(1);

  // Settings
  const [settingsForm, setSettingsForm] = useState({
    name: "",
    description: "",
    logo: null as string | null,
    bannerImage: null as string | null,
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCommunity, setDeletingCommunity] = useState(false);

  const isAdmin = community?.myRole === 'OWNER' || community?.myRole === 'ADMIN';
  const isOwner = community?.myRole === 'OWNER';

  // Fetch community detail + my memberships
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [detail, mine] = await Promise.all([
          CommunityService.getOne(communityId),
          CommunityService.listMine(),
        ]);
        setCommunity(detail);
        setMembers(detail.members || []);
        setSettingsForm({
          name: detail.name,
          description: detail.description || "",
          logo: detail.logo || null,
          bannerImage: detail.bannerImage || null,
        });

        const mineEntry = mine.find((c) => c.id === communityId);
        const leadChapters = (mineEntry?.roles || [])
          .filter((r) => r.role === 'CHAPTER_LEAD' && r.chapter)
          .map((r) => r.chapter as CommunityChapter);
        setMyChapters(leadChapters);

        const admin = detail.myRole === 'OWNER' || detail.myRole === 'ADMIN';
        setActiveTab(admin ? 'overview' : detail.myRole === 'CHAPTER_LEAD' ? 'events' : '');
      } catch (err: any) {
        console.error("Failed to fetch community:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [communityId]);

  // Fetch overview lazily for Overview/Chapters tabs (admin only)
  useEffect(() => {
    if (!community || !isAdmin) return;
    if (activeTab !== 'overview' && activeTab !== 'chapters') return;
    if (overview) return;

    const fetchOverview = async () => {
      try {
        setOverviewLoading(true);
        const data = await CommunityService.getOverview(communityId);
        setOverview(data);
      } catch (err) {
        console.error("Failed to fetch overview:", err);
      } finally {
        setOverviewLoading(false);
      }
    };

    fetchOverview();
  }, [activeTab, community, isAdmin, overview, communityId]);

  const eventsChapters = isAdmin ? (community?.chapters || []) : myChapters;

  // Default chapter selection for Events tab
  useEffect(() => {
    if (activeTab !== 'events') return;
    if (selectedChapterId) return;
    if (eventsChapters.length > 0) setSelectedChapterId(eventsChapters[0].id);
  }, [activeTab, eventsChapters, selectedChapterId]);

  // Reset page when chapter changes
  useEffect(() => {
    setChapterEventsPage(1);
  }, [selectedChapterId]);

  // Fetch chapter events
  useEffect(() => {
    if (activeTab !== 'events' || !selectedChapterId) return;

    const fetchEvents = async () => {
      try {
        setChapterEventsLoading(true);
        const result = await CommunityService.getChapterEvents(communityId, selectedChapterId, { page: chapterEventsPage });
        setChapterEvents(result.events);
        setChapterEventsTotalPages(result.totalPages);
      } catch (err: any) {
        customToast.error(err.response?.data?.message || "Failed to load events");
      } finally {
        setChapterEventsLoading(false);
      }
    };

    fetchEvents();
  }, [activeTab, selectedChapterId, chapterEventsPage, communityId]);

  // ==================== CHAPTERS ====================

  const openCreateChapterModal = () => {
    setEditingChapter(null);
    setChapterNameInput("");
    setShowChapterModal(true);
  };

  const openEditChapterModal = (chapter: CommunityChapter) => {
    setEditingChapter(chapter);
    setChapterNameInput(chapter.name);
    setShowChapterModal(true);
  };

  const handleSaveChapter = async () => {
    if (!chapterNameInput.trim()) {
      customToast.error("Chapter name is required");
      return;
    }

    setSavingChapter(true);
    try {
      if (editingChapter) {
        const updated = await CommunityService.updateChapter(communityId, editingChapter.id, { name: chapterNameInput.trim() });
        setCommunity((prev) => (prev ? { ...prev, chapters: prev.chapters.map((c) => (c.id === updated.id ? updated : c)) } : prev));
        customToast.success("Chapter updated");
      } else {
        const created = await CommunityService.createChapter(communityId, { name: chapterNameInput.trim() });
        setCommunity((prev) => (prev ? { ...prev, chapters: [...prev.chapters, created] } : prev));
        customToast.success("Chapter created");
      }
      setOverview(null);
      setShowChapterModal(false);
    } catch (err: any) {
      customToast.error(err.response?.data?.message || "Failed to save chapter");
    } finally {
      setSavingChapter(false);
    }
  };

  const handleDeleteChapter = async (chapter: CommunityChapter) => {
    if (!confirm(`Delete chapter "${chapter.name}"? This cannot be undone.`)) return;

    setDeletingChapterId(chapter.id);
    try {
      await CommunityService.deleteChapter(communityId, chapter.id);
      setCommunity((prev) => (prev ? { ...prev, chapters: prev.chapters.filter((c) => c.id !== chapter.id) } : prev));
      setOverview(null);
      customToast.success("Chapter deleted");
    } catch (err: any) {
      customToast.error(err.response?.data?.message || "Failed to delete chapter");
    } finally {
      setDeletingChapterId(null);
    }
  };

  // ==================== MEMBERS ====================

  const openInviteModal = () => {
    setInviteForm({ emailOrUserId: "", role: CommunityRole.CHAPTER_LEAD, chapterId: community?.chapters[0]?.id || "" });
    setShowInviteModal(true);
  };

  const handleInvite = async () => {
    if (!inviteForm.emailOrUserId.trim()) {
      customToast.error("Email or user ID is required");
      return;
    }
    if (inviteForm.role === 'CHAPTER_LEAD' && !inviteForm.chapterId) {
      customToast.error("Select a chapter for the Chapter Lead role");
      return;
    }

    setInvitingMember(true);
    try {
      const member = await CommunityService.inviteMember(communityId, {
        emailOrUserId: inviteForm.emailOrUserId.trim(),
        role: inviteForm.role,
        chapterId: inviteForm.role === 'CHAPTER_LEAD' ? inviteForm.chapterId : undefined,
      });
      setMembers((prev) => [...prev, member]);
      customToast.success("Invitation sent");
      setShowInviteModal(false);
    } catch (err: any) {
      customToast.error(err.response?.data?.message || "Failed to invite member");
    } finally {
      setInvitingMember(false);
    }
  };

  const openEditMemberModal = (member: CommunityMember) => {
    setEditingMember(member);
    setEditMemberForm({ role: member.role, chapterId: member.chapter?.id || community?.chapters[0]?.id || "" });
  };

  const handleUpdateMember = async () => {
    if (!editingMember) return;
    if (editMemberForm.role === 'CHAPTER_LEAD' && !editMemberForm.chapterId) {
      customToast.error("Select a chapter for the Chapter Lead role");
      return;
    }

    setSavingMember(true);
    try {
      const updated = await CommunityService.updateMember(communityId, editingMember.id, {
        role: editMemberForm.role,
        chapterId: editMemberForm.role === 'CHAPTER_LEAD' ? editMemberForm.chapterId : undefined,
      });
      setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      customToast.success("Member updated");
      setEditingMember(null);
    } catch (err: any) {
      customToast.error(err.response?.data?.message || "Failed to update member");
    } finally {
      setSavingMember(false);
    }
  };

  const handleRemoveMember = async (member: CommunityMember) => {
    if (!confirm(`Remove ${member.user?.displayName || member.email} from this community?`)) return;

    setRemovingMemberId(member.id);
    try {
      await CommunityService.removeMember(communityId, member.id);
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
      customToast.success("Member removed");
    } catch (err: any) {
      customToast.error(err.response?.data?.message || "Failed to remove member");
    } finally {
      setRemovingMemberId(null);
    }
  };

  // ==================== SETTINGS ====================

  const handleSettingsImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "logo" | "bannerImage") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSettingsForm((prev) => ({ ...prev, [field]: reader.result as string }));
    };
    reader.readAsDataURL(file);

    const setUploading = field === "logo" ? setUploadingLogo : setUploadingBanner;
    setUploading(true);
    const uploadedUrl = await uploadImage(file);
    setUploading(false);

    if (uploadedUrl) {
      setSettingsForm((prev) => ({ ...prev, [field]: uploadedUrl }));
    } else {
      customToast.error("Failed to upload image. Please try again.");
    }
  };

  const handleSaveSettings = async () => {
    if (!settingsForm.name.trim()) {
      customToast.error("Community name is required");
      return;
    }

    setSavingSettings(true);
    try {
      const updated = await CommunityService.update(communityId, {
        name: settingsForm.name.trim(),
        description: settingsForm.description.trim() || undefined,
        logo: settingsForm.logo || undefined,
        bannerImage: settingsForm.bannerImage || undefined,
      });
      setCommunity((prev) => (prev ? { ...prev, ...updated } : prev));
      customToast.success("Community updated");
    } catch (err: any) {
      customToast.error(err.response?.data?.message || "Failed to update community");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDeleteCommunity = async () => {
    setDeletingCommunity(true);
    try {
      await CommunityService.remove(communityId);
      customToast.success("Community deleted");
      router.push("/profile?tab=communities");
    } catch (err: any) {
      customToast.error(err.response?.data?.message || "Failed to delete community");
      setDeletingCommunity(false);
    }
  };

  // ==================== RENDER ====================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (notFound || !community) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-2xl font-bold text-foreground mb-2">Community not found</h1>
        <p className="text-foreground/60">This community may have been removed or never existed.</p>
      </div>
    );
  }

  if (!community.myRole) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-2xl font-bold text-foreground mb-2">Not authorized</h1>
        <p className="text-foreground/60 mb-6">You don&apos;t have access to manage this community.</p>
        <Link href={`/c/${community.slug}`}>
          <Button variant="primary">View Community Page</Button>
        </Link>
      </div>
    );
  }

  const tabs = isAdmin
    ? [
        { id: 'overview', label: 'Overview', icon: ChartBar },
        { id: 'chapters', label: 'Chapters', icon: Buildings },
        { id: 'members', label: 'Members', icon: UsersThree },
        { id: 'events', label: 'Events', icon: CalendarBlank },
        { id: 'settings', label: 'Settings', icon: Gear },
      ]
    : [{ id: 'events', label: 'Events', icon: CalendarBlank }];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-foreground/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors shrink-0"
            >
              <CaretLeft size={20} color="currentColor" weight="regular" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-foreground/5 overflow-hidden flex items-center justify-center flex-shrink-0">
                {community.logo ? (
                  <Image src={community.logo} alt={community.name} width={36} height={36} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-foreground/30">{community.name.charAt(0)}</span>
                )}
              </div>
              <h1 className="font-bold text-foreground truncate">{community.name}</h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary flex-shrink-0">
                {ROLE_LABELS[community.myRole] || community.myRole}
              </span>
            </div>

            <Link href={`/c/${community.slug}`} className="text-sm text-primary hover:underline shrink-0">
              View Page
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-foreground/60 hover:text-foreground hover:border-foreground/20"
                  }`}
                >
                  <Icon size={18} color="currentColor" weight="regular" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {overviewLoading && !overview ? (
                <Spinner />
              ) : overview ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    <StatCard label="Total Events" value={overview.totals.eventCount} />
                    <StatCard label="Upcoming" value={overview.totals.upcomingCount} />
                    <StatCard label="Past" value={overview.totals.pastCount} />
                    <StatCard label="Attendees" value={overview.totals.totalAttendees.toLocaleString()} />
                    <StatCard label="Revenue" value={`₦${overview.totals.totalRevenue.toLocaleString()}`} />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-3">By Chapter</h3>
                    <div className="overflow-x-auto rounded-2xl border border-foreground/10">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-foreground/10 text-left text-foreground/60">
                            <th className="px-4 py-3 font-medium">Chapter</th>
                            <th className="px-4 py-3 font-medium">Events</th>
                            <th className="px-4 py-3 font-medium">Upcoming</th>
                            <th className="px-4 py-3 font-medium">Past</th>
                            <th className="px-4 py-3 font-medium">Attendees</th>
                            <th className="px-4 py-3 font-medium">Revenue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {overview.chapters.map((chapter) => (
                            <tr key={chapter.id} className="border-b border-foreground/5 last:border-0">
                              <td className="px-4 py-3 font-medium text-foreground">{chapter.name}</td>
                              <td className="px-4 py-3">{chapter.eventCount}</td>
                              <td className="px-4 py-3">{chapter.upcomingCount}</td>
                              <td className="px-4 py-3">{chapter.pastCount}</td>
                              <td className="px-4 py-3">{chapter.totalAttendees.toLocaleString()}</td>
                              <td className="px-4 py-3">₦{chapter.totalRevenue.toLocaleString()}</td>
                            </tr>
                          ))}
                          {overview.unassigned.eventCount > 0 && (
                            <tr className="border-b border-foreground/5 last:border-0">
                              <td className="px-4 py-3 font-medium text-foreground/60">Unassigned</td>
                              <td className="px-4 py-3">{overview.unassigned.eventCount}</td>
                              <td className="px-4 py-3">{overview.unassigned.upcomingCount}</td>
                              <td className="px-4 py-3">{overview.unassigned.pastCount}</td>
                              <td className="px-4 py-3">{overview.unassigned.totalAttendees.toLocaleString()}</td>
                              <td className="px-4 py-3">₦{overview.unassigned.totalRevenue.toLocaleString()}</td>
                            </tr>
                          )}
                          {overview.chapters.length === 0 && overview.unassigned.eventCount === 0 && (
                            <tr>
                              <td colSpan={6} className="px-4 py-8 text-center text-foreground/60">
                                No events yet.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-16 text-foreground/60">Failed to load overview.</div>
              )}
            </div>
          )}

          {/* Chapters */}
          {activeTab === 'chapters' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Chapters</h3>
                <Button variant="primary" size="sm" leftIcon={Plus} onClick={openCreateChapterModal}>
                  New Chapter
                </Button>
              </div>

              {community.chapters.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-foreground/10 rounded-2xl">
                  <Buildings size={40} color="currentColor" weight="regular" className="text-foreground/20 mx-auto mb-3" />
                  <p className="text-foreground/60">No chapters yet. Create your first chapter to organize events.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {community.chapters.map((chapter) => {
                    const stats = overview?.chapters.find((c) => c.id === chapter.id);
                    return (
                      <div key={chapter.id} className="flex items-center justify-between p-4 rounded-2xl border border-foreground/10">
                        <div>
                          <p className="font-semibold text-foreground">{chapter.name}</p>
                          {stats && (
                            <p className="text-sm text-foreground/60 mt-0.5">
                              {stats.eventCount} {stats.eventCount === 1 ? "event" : "events"} · {stats.totalAttendees.toLocaleString()} attendees
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditChapterModal(chapter)}
                            className="p-2 rounded-lg hover:bg-foreground/5 transition-colors text-foreground/60 hover:text-foreground"
                            title="Rename chapter"
                          >
                            <PencilSimple size={18} color="currentColor" weight="regular" />
                          </button>
                          <button
                            onClick={() => handleDeleteChapter(chapter)}
                            disabled={deletingChapterId === chapter.id}
                            className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-foreground/60 hover:text-red-500 disabled:opacity-50"
                            title="Delete chapter"
                          >
                            <Trash size={18} color="currentColor" weight="regular" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Members */}
          {activeTab === 'members' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Members</h3>
                <Button variant="primary" size="sm" leftIcon={Plus} onClick={openInviteModal}>
                  Invite Member
                </Button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-foreground/10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-foreground/10 text-left text-foreground/60">
                      <th className="px-4 py-3 font-medium">Member</th>
                      <th className="px-4 py-3 font-medium">Role</th>
                      <th className="px-4 py-3 font-medium">Chapter</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member) => (
                      <tr key={member.id} className="border-b border-foreground/5 last:border-0">
                        <td className="px-4 py-3">
                          <div className="font-medium text-foreground">{member.user?.displayName || member.email}</div>
                          {member.user && <div className="text-xs text-foreground/50">{member.email}</div>}
                        </td>
                        <td className="px-4 py-3">{ROLE_LABELS[member.role] || member.role}</td>
                        <td className="px-4 py-3">{member.chapter?.name || "—"}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              member.status === 'ACTIVE'
                                ? "bg-green-500/10 text-green-600"
                                : "bg-yellow-500/10 text-yellow-600"
                            }`}
                          >
                            {member.status === 'ACTIVE' ? "Active" : "Pending"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditMemberModal(member)}
                              className="p-2 rounded-lg hover:bg-foreground/5 transition-colors text-foreground/60 hover:text-foreground"
                              title="Edit role"
                            >
                              <PencilSimple size={18} color="currentColor" weight="regular" />
                            </button>
                            <button
                              onClick={() => handleRemoveMember(member)}
                              disabled={removingMemberId === member.id}
                              className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-foreground/60 hover:text-red-500 disabled:opacity-50"
                              title="Remove member"
                            >
                              <Trash size={18} color="currentColor" weight="regular" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {members.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-foreground/60">
                          No members yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Events */}
          {activeTab === 'events' && (
            <div>
              {eventsChapters.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-foreground/10 rounded-2xl">
                  <CalendarBlank size={40} color="currentColor" weight="regular" className="text-foreground/20 mx-auto mb-3" />
                  <p className="text-foreground/60">
                    {isAdmin ? "Create a chapter to organize events." : "You don't lead any chapters yet."}
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <select
                      value={selectedChapterId}
                      onChange={(e) => setSelectedChapterId(e.target.value)}
                      className="px-4 py-2.5 bg-background border border-foreground/20 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    >
                      {eventsChapters.map((chapter) => (
                        <option key={chapter.id} value={chapter.id}>
                          {chapter.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {chapterEventsLoading ? (
                    <Spinner />
                  ) : chapterEvents.length === 0 ? (
                    <div className="py-12 text-center border border-dashed border-foreground/10 rounded-2xl">
                      <CalendarBlank size={40} color="currentColor" weight="regular" className="text-foreground/20 mx-auto mb-3" />
                      <p className="text-foreground/60">No events in this chapter yet.</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {chapterEvents.map((event) => (
                          <Link key={event.id} href={`/events/${event.id}/manage`}>
                            <EventCard {...mapEventToCard(event)} />
                          </Link>
                        ))}
                      </div>

                      {chapterEventsTotalPages > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-6">
                          <button
                            onClick={() => setChapterEventsPage((p) => Math.max(1, p - 1))}
                            disabled={chapterEventsPage <= 1}
                            className="p-2 rounded-lg border border-foreground/10 hover:bg-foreground/5 disabled:opacity-40 transition-colors"
                          >
                            <CaretLeft size={18} color="currentColor" weight="regular" />
                          </button>
                          <span className="text-sm text-foreground/60">
                            Page {chapterEventsPage} of {chapterEventsTotalPages}
                          </span>
                          <button
                            onClick={() => setChapterEventsPage((p) => Math.min(chapterEventsTotalPages, p + 1))}
                            disabled={chapterEventsPage >= chapterEventsTotalPages}
                            className="p-2 rounded-lg border border-foreground/10 hover:bg-foreground/5 disabled:opacity-40 transition-colors"
                          >
                            <CaretRight size={18} color="currentColor" weight="regular" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-6">
              {/* Banner upload */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Banner Image</label>
                <div className="relative w-full h-40 rounded-2xl bg-foreground/5 border border-dashed border-foreground/20 overflow-hidden flex items-center justify-center">
                  {settingsForm.bannerImage ? (
                    <>
                      <Image src={settingsForm.bannerImage} alt="Banner preview" fill className="object-cover" />
                      <button
                        onClick={() => setSettingsForm((prev) => ({ ...prev, bannerImage: null }))}
                        className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                      >
                        <X size={16} color="currentColor" weight="bold" />
                      </button>
                    </>
                  ) : (
                    <label className="flex flex-col items-center gap-2 cursor-pointer text-foreground/50 hover:text-foreground/70 transition-colors">
                      <UploadSimple size={28} color="currentColor" weight="regular" />
                      <span className="text-sm">{uploadingBanner ? "Uploading..." : "Upload banner image"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingBanner}
                        onChange={(e) => handleSettingsImageUpload(e, "bannerImage")}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Logo upload */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Logo</label>
                <div className="relative w-24 h-24 rounded-2xl bg-foreground/5 border border-dashed border-foreground/20 overflow-hidden flex items-center justify-center">
                  {settingsForm.logo ? (
                    <>
                      <Image src={settingsForm.logo} alt="Logo preview" fill className="object-cover" />
                      <button
                        onClick={() => setSettingsForm((prev) => ({ ...prev, logo: null }))}
                        className="absolute top-1 right-1 p-1 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                      >
                        <X size={14} color="currentColor" weight="bold" />
                      </button>
                    </>
                  ) : (
                    <label className="flex flex-col items-center gap-1 cursor-pointer text-foreground/50 hover:text-foreground/70 transition-colors">
                      <UploadSimple size={20} color="currentColor" weight="regular" />
                      <span className="text-xs">{uploadingLogo ? "..." : "Upload"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingLogo}
                        onChange={(e) => handleSettingsImageUpload(e, "logo")}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Community Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  value={settingsForm.name}
                  onChange={(e) => setSettingsForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
                <textarea
                  value={settingsForm.description}
                  onChange={(e) => setSettingsForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none"
                />
              </div>

              <div className="flex justify-end">
                <Button variant="primary" onClick={handleSaveSettings} isLoading={savingSettings} disabled={uploadingLogo || uploadingBanner}>
                  Save Changes
                </Button>
              </div>

              {isOwner && (
                <div className="pt-6 border-t border-foreground/10">
                  <h3 className="text-lg font-bold text-red-500 mb-2">Danger Zone</h3>
                  <p className="text-sm text-foreground/60 mb-4">
                    Deleting a community permanently removes its chapters, members, and follower data. Events stay but lose their community link.
                  </p>
                  <Button variant="outline" className="border-red-500/40 text-red-500 hover:border-red-500 hover:text-red-500" onClick={() => setShowDeleteModal(true)}>
                    Delete Community
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Chapter modal */}
      {showChapterModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-background border border-foreground/10 rounded-t-3xl sm:rounded-3xl max-w-md w-full shadow-2xl">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">{editingChapter ? "Rename Chapter" : "New Chapter"}</h3>
                <button onClick={() => setShowChapterModal(false)} className="p-1 rounded-lg hover:bg-foreground/5 transition-colors">
                  <X size={20} color="currentColor" weight="regular" />
                </button>
              </div>

              <label className="block text-sm font-semibold text-foreground mb-2">Chapter Name</label>
              <input
                type="text"
                value={chapterNameInput}
                onChange={(e) => setChapterNameInput(e.target.value)}
                placeholder="e.g., Lagos"
                className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 mb-6"
                autoFocus
              />

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowChapterModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSaveChapter} isLoading={savingChapter}>
                  {editingChapter ? "Save" : "Create"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite member modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-background border border-foreground/10 rounded-t-3xl sm:rounded-3xl max-w-md w-full shadow-2xl">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">Invite Member</h3>
                <button onClick={() => setShowInviteModal(false)} className="p-1 rounded-lg hover:bg-foreground/5 transition-colors">
                  <X size={20} color="currentColor" weight="regular" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Email or User ID</label>
                  <input
                    type="text"
                    value={inviteForm.emailOrUserId}
                    onChange={(e) => setInviteForm((prev) => ({ ...prev, emailOrUserId: e.target.value }))}
                    placeholder="someone@example.com"
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Role</label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm((prev) => ({ ...prev, role: e.target.value as CommunityRole }))}
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                  >
                    <option value="CHAPTER_LEAD">Chapter Lead</option>
                    <option value="ADMIN">Admin</option>
                    <option value="OWNER">Owner</option>
                  </select>
                </div>

                {inviteForm.role === 'CHAPTER_LEAD' && (
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Chapter</label>
                    {community.chapters.length === 0 ? (
                      <p className="text-sm text-foreground/60">Create a chapter first before inviting a Chapter Lead.</p>
                    ) : (
                      <select
                        value={inviteForm.chapterId}
                        onChange={(e) => setInviteForm((prev) => ({ ...prev, chapterId: e.target.value }))}
                        className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      >
                        {community.chapters.map((chapter) => (
                          <option key={chapter.id} value={chapter.id}>
                            {chapter.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setShowInviteModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleInvite} isLoading={invitingMember}>
                  Send Invite
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit member modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-background border border-foreground/10 rounded-t-3xl sm:rounded-3xl max-w-md w-full shadow-2xl">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">Edit Member</h3>
                <button onClick={() => setEditingMember(null)} className="p-1 rounded-lg hover:bg-foreground/5 transition-colors">
                  <X size={20} color="currentColor" weight="regular" />
                </button>
              </div>

              <p className="text-sm text-foreground/60 mb-4">
                {editingMember.user?.displayName || editingMember.email}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Role</label>
                  <select
                    value={editMemberForm.role}
                    onChange={(e) => setEditMemberForm((prev) => ({ ...prev, role: e.target.value as CommunityRole }))}
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                  >
                    <option value="CHAPTER_LEAD">Chapter Lead</option>
                    <option value="ADMIN">Admin</option>
                    <option value="OWNER">Owner</option>
                  </select>
                </div>

                {editMemberForm.role === 'CHAPTER_LEAD' && (
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Chapter</label>
                    <select
                      value={editMemberForm.chapterId}
                      onChange={(e) => setEditMemberForm((prev) => ({ ...prev, chapterId: e.target.value }))}
                      className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    >
                      {community.chapters.map((chapter) => (
                        <option key={chapter.id} value={chapter.id}>
                          {chapter.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setEditingMember(null)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleUpdateMember} isLoading={savingMember}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete community modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-background border border-foreground/10 rounded-t-3xl sm:rounded-3xl max-w-md w-full shadow-2xl">
            <div className="p-6 sm:p-8">
              <h3 className="text-xl font-bold text-foreground mb-2">Delete Community</h3>
              <p className="text-sm text-foreground/60 mb-6">
                Are you sure you want to delete <span className="font-semibold text-foreground">{community.name}</span>? This will remove all chapters, members, and follower data. This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" className="bg-red-500 hover:bg-red-600" onClick={handleDeleteCommunity} isLoading={deletingCommunity}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityManagePage;
