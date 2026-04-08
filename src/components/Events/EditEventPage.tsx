"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EventService } from "@/services/events";
import {
  EventPrivacy,
  TicketType as ApiTicketType,
  CreateEventPayload,
} from "@/types/event";
import { EVENT_CATEGORIES, getApiCategoryFromLabel } from "@/utils/event-categories";
import Button from "@/components/Button";
import customToast from "@/lib/toast";
import {
  CalendarAdd,
  DocumentText,
  Location,
  Image as ImageIcon,
  Setting2,
  ArrowLeft2,
  ArrowRight2,
  Add,
  Clock,
  Trash,
  CloseCircle,
} from "iconsax-react";

interface TicketType {
  id: string;
  name: string;
  price: string;
  quantity: number;
  description: string;
}

interface AgendaItem {
  id: string;
  time: string;
  activity: string;
  description: string;
}

interface EditEventPageProps {
  eventId: string;
}

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Map API enum back to the display label used in the card grid
const getCategoryLabel = (apiCategory: string): string => {
  return EVENT_CATEGORIES.find(c => c.apiValue === apiCategory)?.label ?? "Other";
};

const EditEventPage: React.FC<EditEventPageProps> = ({ eventId }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
    venue: "",
    capacity: "",
    isOnline: false,
    onlineLink: "",
    image: null as string | null,
    visibility: "public" as "public" | "private",
    lat: null as number | null,
    lng: null as number | null,
  });
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    { id: "1", name: "", price: "", quantity: 0, description: "" },
  ]);

  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);

  const [activeSection, setActiveSection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const geocodeAddress = async (address: string, venue: string) => {
    const query = [venue, address].filter(Boolean).join(', ');
    if (!query.trim()) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const results = await res.json();
      if (results.length > 0) {
        setFormData(prev => ({
          ...prev,
          lat: parseFloat(results[0].lat),
          lng: parseFloat(results[0].lon),
        }));
      }
    } catch {
      // silently fail — coordinates stay null, map falls back to geocoding on detail page
    }
  };

  const sections = [
    { id: "details", label: "Event Details", icon: DocumentText },
    { id: "logistics", label: "Tickets & Location", icon: Location },
    { id: "settings", label: "Settings", icon: Setting2 },
  ];

  // Load existing event data from API
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        setFetchError(null);
        const event = await EventService.getEventById(eventId);

        // Extract date portions from ISO strings
        const startDate = event.startDate ? event.startDate.split("T")[0] : "";
        const endDate = event.endDate ? event.endDate.split("T")[0] : "";

        setFormData({
          title: event.title || "",
          slug: event.slug || "",
          description: event.description || "",
          category: getCategoryLabel(event.category),
          startDate,
          startTime: event.startTime || "",
          endDate,
          endTime: event.endTime || "",
          location: event.address || "",
          venue: event.venueName || "",
          capacity: "",
          isOnline: event.locationType === "ONLINE",
          onlineLink: event.onlineUrl || "",
          image: event.coverImage || null,
          visibility: event.privacy === "PRIVATE" ? "private" : "public",
          lat: event.lat || null,
          lng: event.lng || null,
        });
        if (event.tags && Array.isArray(event.tags)) {
          setTags(event.tags);
        }

        if (event.tickets && event.tickets.length > 0) {
          setTicketTypes(
            event.tickets.map((t: any, i: number) => ({
              id: t.id || String(i + 1),
              name: t.name || "",
              price: String(t.price || 0),
              quantity: t.quantity || 0,
              description: t.description || "",
            }))
          );
        }

        if (event.scheduleItems && event.scheduleItems.length > 0) {
          setAgendaItems(
            event.scheduleItems.map((s: any, i: number) => ({
              id: s.id || String(i + 1),
              time: s.time || "",
              activity: s.activity || "",
              description: s.description || "",
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch event:", error);
        setFetchError("Failed to load event data. Please try again.");
        customToast.error("Failed to load event data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      };
      // Auto-fill slug from title only if slug hasn't been manually customized
      if (name === 'title') {
        const autoSlug = prev.title.replace(/[^a-zA-Z0-9]/g, '-').toUpperCase();
        if (!prev.slug || prev.slug === autoSlug) {
          (updated as any).slug = value.replace(/[^a-zA-Z0-9]/g, '-').toUpperCase();
        }
      }
      return updated;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary right away
    setUploading(true);
    const uploadedUrl = await uploadImage(file);
    setUploading(false);

    if (uploadedUrl) {
      setFormData((prev) => ({ ...prev, image: uploadedUrl }));
      setImageFile(null);
      customToast.success("Image uploaded successfully");
    } else {
      setFormData((prev) => ({ ...prev, image: null }));
      customToast.error("Failed to upload image. Please try again.");
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const data = new FormData();
      data.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const result = await response.json();
      return result.url;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  const handleTicketTypeChange = (id: string, field: keyof TicketType, value: string | number) => {
    setTicketTypes((prev) =>
      prev.map((ticket) => (ticket.id === id ? { ...ticket, [field]: value } : ticket))
    );
  };

  const addTicketType = () => {
    setTicketTypes((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: "",
        price: "",
        quantity: 0,
        description: "",
      },
    ]);
  };

  const removeTicketType = (id: string) => {
    if (ticketTypes.length > 1) {
      setTicketTypes((prev) => prev.filter((ticket) => ticket.id !== id));
    }
  };

  const addAgendaItem = () => {
    setAgendaItems((prev) => [...prev, { id: Date.now().toString(), time: '', activity: '', description: '' }]);
  };

  const removeAgendaItem = (id: string) => {
    setAgendaItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAgendaChange = (id: string, field: keyof AgendaItem, value: string) => {
    setAgendaItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      customToast.error("Event title is required");
      setActiveSection(0);
      return false;
    }
    if (!formData.category) {
      customToast.error("Please select a category");
      setActiveSection(0);
      return false;
    }
    if (!formData.description.trim()) {
      customToast.error("Description is required");
      setActiveSection(0);
      return false;
    }
    if (!formData.startDate) {
      customToast.error("Start date is required");
      setActiveSection(0);
      return false;
    }
    if (!formData.startTime) {
      customToast.error("Start time is required");
      setActiveSection(0);
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (new Date(formData.startDate) < today) {
      customToast.error("Start date cannot be in the past");
      setActiveSection(0);
      return false;
    }

    if (formData.endDate) {
      if (new Date(formData.endDate) < today) {
        customToast.error("End date cannot be in the past");
        setActiveSection(0);
        return false;
      }
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime || "23:59"}`);
      if (endDateTime <= startDateTime) {
        customToast.error("End time must be after start time");
        setActiveSection(0);
        return false;
      }
    }

    if (formData.isOnline) {
      if (!formData.onlineLink.trim()) {
        customToast.error("Online event link is required");
        setActiveSection(1);
        return false;
      }
    } else {
      if (!formData.venue.trim()) {
        customToast.error("Venue name is required");
        setActiveSection(1);
        return false;
      }
      if (!formData.location.trim()) {
        customToast.error("Address is required");
        setActiveSection(1);
        return false;
      }
    }

    for (const ticket of ticketTypes) {
      if (!ticket.name.trim()) {
        customToast.error("All ticket types must have a name");
        setActiveSection(1);
        return false;
      }
      if (ticket.price === "" || isNaN(parseFloat(ticket.price)) || parseFloat(ticket.price) < 0) {
        customToast.error("Please enter a valid price for all tickets (0 for free)");
        setActiveSection(1);
        return false;
      }
    }

    return true;
  };

  const handleSaveDraft = () => {
    customToast.success("Draft saved locally! (Implementation pending)");
  };

  const handleUpdate = async () => {
    if (isUpdating || uploading) return;
    if (!validateForm()) return;

    setIsUpdating(true);

    try {
      // Image is already uploaded to Cloudinary via handleImageUpload
      const coverImageUrl = formData.image;

      const startDateTime = new Date(`${formData.startDate}T${formData.startTime || "00:00"}`);
      const endDateTime = formData.endDate
        ? new Date(`${formData.endDate}T${formData.endTime || "23:59"}`)
        : new Date(startDateTime.getTime() + 3600000);

      const payload: Partial<CreateEventPayload> = {
        title: formData.title,
        ...(formData.slug && { slug: formData.slug.replace(/[^a-zA-Z0-9-_]/g, "").toUpperCase() }),
        description: formData.description,
        category: getApiCategoryFromLabel(formData.category),
        location: {
          type: formData.isOnline ? "ONLINE" : "PHYSICAL",
          city: formData.location.split(",")[0].trim() || "Unknown",
          country: "Nigeria",
          address: formData.location,
          venueName: formData.venue,
          coordinates: { lat: formData.lat ?? 0, lng: formData.lng ?? 0 },
        },
        schedule: {
          startDate: startDateTime.toISOString(),
          endDate: endDateTime.toISOString(),
          startTime: formData.startTime || "00:00",
          endTime: formData.endTime || "23:59",
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        tickets: ticketTypes.map((t) => ({
          id: t.id,
          name: t.name,
          type: parseFloat(t.price) > 0 ? ApiTicketType.PAID : ApiTicketType.FREE,
          price: parseFloat(t.price) || 0,
          currency: "NGN",
          quantity: t.quantity > 0 ? t.quantity : 1000,
          description: t.description,
        })),
        media: {
          coverImage: coverImageUrl || "",
          gallery: [],
        },
        privacy: formData.visibility === "public" ? EventPrivacy.PUBLIC : EventPrivacy.PRIVATE,
        tags: tags.length > 0 ? tags : [formData.category],
        scheduleItems: agendaItems
          .filter(item => item.time && item.activity)
          .map((item, index) => ({
            time: item.time,
            activity: item.activity,
            description: item.description || undefined,
            order: index,
          })),
      };

      const updatedEvent = await EventService.updateEvent(eventId, payload);

      // Sync ticketTypes with the real DB IDs returned by the server so that
      // a subsequent edit doesn't treat existing tickets as new ones.
      if (updatedEvent?.tickets && updatedEvent.tickets.length > 0) {
        setTicketTypes(
          updatedEvent.tickets.map((t: any) => ({
            id: t.id,
            name: t.name || "",
            price: String(t.price ?? 0),
            quantity: t.quantity ?? 0,
            description: t.description || "",
          }))
        );
      }

      customToast.success("Event updated successfully!");
      router.push(`/events/${eventId}/manage`);
    } catch (error) {
      console.error("Failed to update event:", error);
      customToast.error("Failed to update event. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 0: // Event Details (Basic Info + Date & Time + Media)
        return (
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Event Title <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Tech Meetup Lagos - January Edition"
                className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Custom URL Slug <span className="text-foreground/40 font-normal">(optional)</span>
              </label>
              <div className="flex items-center">
                <span className="px-4 py-3 bg-foreground/5 border border-r-0 border-foreground/20 rounded-l-xl text-foreground/50 text-sm whitespace-nowrap select-none">
                  eventfi.live/
                </span>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="MY-EVENT"
                  className="flex-1 px-4 py-3 bg-background border border-foreground/20 rounded-r-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 uppercase"
                />
              </div>
              <p className="text-xs text-foreground/50 mt-1.5">Only letters, numbers, hyphens and underscores. Leave blank to keep current.</p>
            </div>

            {/* Category picker */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Category <span className="text-primary">*</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {EVENT_CATEGORIES.map((cat) => {
                  const active = formData.category === cat.label;
                  return (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, category: cat.label }));
                        setTags([]);
                      }}
                      className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border-2 text-xs font-medium transition-all ${
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-foreground/15 hover:border-primary/40 text-foreground/70"
                      }`}
                    >
                      <span className="text-xl">{cat.emoji}</span>
                      <span className="leading-tight text-center">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
              {formData.category && (() => {
                const hint = EVENT_CATEGORIES.find(c => c.label === formData.category)?.hint;
                return hint ? (
                  <p className="mt-2 text-xs text-foreground/50 italic">{hint}</p>
                ) : null;
              })()}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Tags <span className="text-foreground/40 font-normal">(optional)</span>
              </label>
              {formData.category && (() => {
                const suggested = EVENT_CATEGORIES.find(c => c.label === formData.category)?.suggestedTags ?? [];
                const available = suggested.filter(t => !tags.includes(t));
                return available.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {available.map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTags(prev => [...prev, t])}
                        className="text-xs px-3 py-1 rounded-full border border-foreground/20 text-foreground/60 hover:border-primary hover:text-primary transition-colors"
                      >
                        + {t}
                      </button>
                    ))}
                  </div>
                ) : null;
              })()}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map(t => (
                    <span
                      key={t}
                      className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary font-medium"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => setTags(prev => prev.filter(x => x !== t))}
                        className="ml-0.5 hover:text-primary/60"
                      >
                        <CloseCircle size={13} variant="Bold" color="currentColor" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => {
                    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
                      e.preventDefault();
                      const val = tagInput.trim().replace(/,+$/, "");
                      if (val && !tags.includes(val)) setTags(prev => [...prev, val]);
                      setTagInput("");
                    }
                  }}
                  placeholder="Add a custom tag, press Enter"
                  className="flex-1 px-4 py-2.5 bg-background border border-foreground/20 rounded-xl text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    const val = tagInput.trim().replace(/,+$/, "");
                    if (val && !tags.includes(val)) setTags(prev => [...prev, val]);
                    setTagInput("");
                  }}
                  className="px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Description <span className="text-primary">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your event in detail..."
                rows={6}
                className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none"
                required
              />
            </div>

            {/* Date & Time */}
            <div className="pt-6 border-t border-foreground/10">
              <h3 className="text-lg font-semibold text-foreground mb-4">Date & Time</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Start Date <span className="text-primary">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    min={getTodayDate()}
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Start Time <span className="text-primary">*</span>
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    min={formData.startDate || getTodayDate()}
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="pt-6 border-t border-foreground/10">
              <h3 className="text-lg font-semibold text-foreground mb-4">Cover Image</h3>
              {formData.image ? (
                <div className="relative">
                  <img
                    src={formData.image}
                    alt="Event cover"
                    className={`w-full h-64 object-cover rounded-xl border border-foreground/10 ${uploading ? 'opacity-50' : ''}`}
                  />
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary" />
                        <span className="text-sm font-medium text-foreground">Uploading...</span>
                      </div>
                    </div>
                  )}
                  {!uploading && (
                    <button
                      onClick={() => setFormData((prev) => ({ ...prev, image: null }))}
                      className="absolute top-4 right-4 p-2 bg-background/90 backdrop-blur-sm rounded-full text-foreground/60 hover:text-primary transition-colors"
                    >
                      <Trash size={20} color="currentColor" variant="Outline" />
                    </button>
                  )}
                </div>
              ) : (
                <label className="block">
                  <div className="w-full h-64 border-2 border-dashed border-foreground/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all duration-200">
                    <ImageIcon
                      size={48}
                      color="currentColor"
                      variant="Outline"
                      className="text-foreground/40 mb-3"
                    />
                    <span className="text-foreground/60 font-medium">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-sm text-foreground/40 mt-1">
                      PNG, JPG up to 10MB
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Agenda / Schedule */}
            <div className="pt-6 border-t border-foreground/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Event Agenda</h3>
                  <p className="text-sm text-foreground/50 mt-1">Add the schedule of activities for your event</p>
                </div>
              </div>
              <div className="space-y-4">
                {agendaItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-4 bg-foreground/5 border border-foreground/10 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Clock size={16} color="currentColor" variant="Outline" className="text-primary" />
                        <span className="text-sm font-medium text-foreground/60">Item {index + 1}</span>
                      </div>
                      <button
                        onClick={() => removeAgendaItem(item.id)}
                        className="p-1.5 text-foreground/40 hover:text-primary transition-colors"
                      >
                        <Trash size={16} color="currentColor" variant="Outline" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-3">
                      <div>
                        <input
                          type="time"
                          value={item.time}
                          onChange={(e) => handleAgendaChange(item.id, 'time', e.target.value)}
                          className="w-full px-3 py-2.5 bg-background border border-foreground/20 rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                          placeholder="Time"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={item.activity}
                          onChange={(e) => handleAgendaChange(item.id, 'activity', e.target.value)}
                          placeholder="e.g., Registration & Networking"
                          className="w-full px-3 py-2.5 bg-background border border-foreground/20 rounded-lg text-foreground text-sm placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleAgendaChange(item.id, 'description', e.target.value)}
                        placeholder="Brief description (optional)"
                        className="w-full px-3 py-2.5 bg-background border border-foreground/20 rounded-lg text-foreground text-sm placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={addAgendaItem}
                  className="w-full py-3 border-2 border-dashed border-foreground/20 rounded-xl text-foreground/60 hover:text-primary hover:border-primary transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Add size={20} color="currentColor" variant="Outline" />
                  <span className="font-medium">Add Agenda Item</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 1: // Tickets & Location
        return (
          <div className="space-y-8">
            {/* Location Section */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Location</h3>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      name="isOnline"
                      checked={formData.isOnline}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-foreground/20 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-semibold text-foreground">This is an online event</span>
                  </label>
                </div>

                {formData.isOnline ? (
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Online Event Link <span className="text-primary">*</span>
                    </label>
                    <input
                      type="url"
                      name="onlineLink"
                      value={formData.onlineLink}
                      onChange={handleInputChange}
                      placeholder="https://zoom.us/j/..."
                      className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      required={formData.isOnline}
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Venue Name <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        name="venue"
                        value={formData.venue}
                        onChange={handleInputChange}
                        placeholder="e.g., Lagos Tech Hub"
                        className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                        required={!formData.isOnline}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Address <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={(e) => {
                          handleInputChange(e);
                          setFormData(prev => ({ ...prev, lat: null, lng: null }));
                        }}
                        onBlur={() => geocodeAddress(formData.location, formData.venue)}
                        placeholder="e.g., 123 Main Street, Lagos, Nigeria"
                        className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                        required={!formData.isOnline}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Capacity (optional)
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder="Maximum number of attendees"
                    min="1"
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Tickets Section */}
            <div className="pt-6 border-t border-foreground/10">
              <h3 className="text-lg font-semibold text-foreground mb-4">Ticket Types</h3>
              <div className="space-y-6">
                {ticketTypes.map((ticket, index) => (
                  <div
                    key={ticket.id}
                    className="p-6 bg-foreground/5 border border-foreground/10 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-foreground">
                        Ticket Type {index + 1}
                      </h4>
                      {ticketTypes.length > 1 && (
                        <button
                          onClick={() => removeTicketType(ticket.id)}
                          className="p-2 text-foreground/60 hover:text-primary transition-colors"
                        >
                          <Trash size={20} color="currentColor" variant="Outline" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Ticket Name <span className="text-primary">*</span>
                        </label>
                        <input
                          type="text"
                          value={ticket.name}
                          onChange={(e) =>
                            handleTicketTypeChange(ticket.id, "name", e.target.value)
                          }
                          placeholder="e.g., General Admission, VIP, Early Bird"
                          className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            Price <span className="text-primary">*</span>
                          </label>
                          <input
                            type="text"
                            value={ticket.price}
                            onChange={(e) =>
                              handleTicketTypeChange(ticket.id, "price", e.target.value)
                            }
                            placeholder="₦0 or Free"
                            className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            Quantity
                          </label>
                          <input
                            type="number"
                            value={ticket.quantity}
                            onChange={(e) =>
                              handleTicketTypeChange(
                                ticket.id,
                                "quantity",
                                parseInt(e.target.value) || 0
                              )
                            }
                            placeholder="Unlimited if empty"
                            min="0"
                            className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Description (optional)
                        </label>
                        <input
                          type="text"
                          value={ticket.description}
                          onChange={(e) =>
                            handleTicketTypeChange(ticket.id, "description", e.target.value)
                          }
                          placeholder="What's included in this ticket?"
                          className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addTicketType}
                  className="w-full py-3 border-2 border-dashed border-foreground/20 rounded-xl text-foreground/60 hover:text-primary hover:border-primary transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Add size={20} color="currentColor" variant="Outline" />
                  <span className="font-medium">Add Another Ticket Type</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 2: // Settings
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Visibility
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-foreground/20 rounded-xl cursor-pointer hover:border-primary transition-all duration-200">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={formData.visibility === "public"}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-primary focus:ring-primary"
                  />
                  <div>
                    <div className="font-semibold text-foreground">Public</div>
                    <div className="text-sm text-foreground/60">
                      Anyone can discover and view this event
                    </div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 border border-foreground/20 rounded-xl cursor-pointer hover:border-primary transition-all duration-200">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={formData.visibility === "private"}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-primary focus:ring-primary"
                  />
                  <div>
                    <div className="font-semibold text-foreground">Private</div>
                    <div className="text-sm text-foreground/60">
                      Only people with the link can view this event
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-foreground/60">Loading event data...</div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">{fetchError}</div>
          <Button variant="primary" size="md" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-foreground/60 hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft2 size={20} color="currentColor" variant="Outline" />
              <span>Back</span>
            </button>
            <h1 className="text-sm lg:text-[16px] xl:text-[20px] font-bold font-[family-name:var(--font-clash-display)] text-foreground mb-2">
              Edit Event
            </h1>
            <p className="text-foreground/60">
              Update your event details below
            </p>
          </div>

          {/* Minimal Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2">
              {sections.map((section, index) => {
                const isActive = activeSection === index;
                const isCompleted = activeSection > index;

                return (
                  <React.Fragment key={section.id}>
                    <button
                      onClick={() => setActiveSection(index)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                        ${
                          isActive
                            ? "bg-primary text-white"
                            : isCompleted
                            ? "bg-foreground/10 text-foreground/70 hover:bg-foreground/20"
                            : "bg-foreground/5 text-foreground/40 hover:bg-foreground/10"
                        }
                      `}
                    >
                      {section.label}
                    </button>
                    {index < sections.length - 1 && (
                      <div
                        className={`h-1 w-12 rounded-full ${
                          isCompleted ? "bg-primary" : "bg-foreground/10"
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-background border border-foreground/10 rounded-2xl p-6 lg:p-8 mb-6">
            {renderSection()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              size="md"
              leftIcon={ArrowLeft2}
              onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
              disabled={activeSection === 0}
            >
              Previous
            </Button>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={handleSaveDraft}
              >
                Save Draft
              </Button>
              {activeSection === sections.length - 1 ? (
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={CalendarAdd}
                  onClick={handleUpdate}
                  isLoading={isUpdating}
                >
                  Update Event
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={ArrowRight2}
                  onClick={() =>
                    setActiveSection(Math.min(sections.length - 1, activeSection + 1))
                  }
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEventPage;

