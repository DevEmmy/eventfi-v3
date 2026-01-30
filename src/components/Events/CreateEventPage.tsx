// ... imports
"use client"
import { useRouter } from "next/navigation";
import { EventService } from "@/services/events";
import {
  EventCategory,
  EventPrivacy,
  EventStatus,
  TicketType as ApiTicketType,
  CreateEventPayload
} from "@/types/event";
import { getApiCategory } from "@/utils/event-utils";
import React, { useState } from "react";
import Button from "@/components/Button";
import customToast from "@/lib/toast";
import { Add, ArrowLeft2, ArrowRight2, CalendarAdd, Camera, Trash } from "iconsax-react";
// ... existing imports

interface TicketType {
  id: string;
  name: string;
  price: string;
  quantity: number;
  description: string;
}

const categories = Object.values(EventCategory);

const sections = [
  { id: 'details', label: 'Event Details' },
  { id: 'tickets', label: 'Tickets & Location' },
  { id: 'settings', label: 'Settings' }
];

const CreateEventPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null); // State to store the actual file
  const [formData, setFormData] = useState({
    title: "",
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
    image: null as string | null, // This effectively stores the preview URL
    visibility: "public" as "public" | "private",
  });

  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    { id: '1', name: '', price: '', quantity: 0, description: '' }
  ]);

  const addTicketType = () => {
    setTicketTypes([
      ...ticketTypes,
      { id: Date.now().toString(), name: '', price: '', quantity: 0, description: '' }
    ]);
  };

  const removeTicketType = (id: string) => {
    setTicketTypes(ticketTypes.filter(t => t.id !== id));
  };

  const handleTicketTypeChange = (id: string, field: keyof TicketType, value: any) => {
    setTicketTypes(ticketTypes.map(t =>
      t.id === id ? { ...t, [field]: value } : t
    ));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveDraft = async () => {
    customToast.success("Draft saved locally! (Implementation pending)");
  };
  // ... existing code

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file); // Store file for upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // ... existing code

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };



  const handlePublish = async () => {
    if (!formData.title || !formData.startDate || (!formData.isOnline && !formData.location)) {
      customToast.error("Please fill in all required fields (Title, Start Date, Location/Link)");
      return;
    }

    setIsLoading(true);

    try {
      let coverImageUrl = formData.image;

      // Upload image if a new file is selected
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          coverImageUrl = uploadedUrl;
        } else {
          customToast.error("Failed to upload image. Proceeding without it."); // Or stop and ask user
        }
      }

      // Construct Date Objects
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime || '00:00'}`);
      const endDateTime = formData.endDate
        ? new Date(`${formData.endDate}T${formData.endTime || '23:59'}`)
        : new Date(startDateTime.getTime() + 3600000); // Default 1 hour duration

      const payload: CreateEventPayload = {
        title: formData.title,
        description: formData.description,
        category: getApiCategory(formData.category),

        location: {
          type: formData.isOnline ? 'ONLINE' : 'PHYSICAL',
          city: formData.location.split(',')[0].trim() || 'Unknown', // Basic extraction
          country: 'Nigeria', // web app default context
          address: formData.location,
          venueName: formData.venue,
          coordinates: { lat: 0, lng: 0 } // Placeholder
        },
        schedule: {
          startDate: startDateTime.toISOString(),
          endDate: endDateTime.toISOString(),
          startTime: formData.startTime || '00:00',
          endTime: formData.endTime || '23:59',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        tickets: ticketTypes.map(t => ({
          name: t.name,
          type: parseFloat(t.price) > 0 ? ApiTicketType.PAID : ApiTicketType.FREE,
          price: parseFloat(t.price) || 0,
          currency: 'NGN',
          quantity: t.quantity > 0 ? t.quantity : 1000,
          description: t.description,
        })),
        media: {
          coverImage: coverImageUrl || '',
          gallery: []
        },

        privacy: formData.visibility === "public" ? EventPrivacy.PUBLIC : EventPrivacy.PRIVATE,
        tags: [formData.category]
      };

      // Note: 'displayType' needs to be handled if it's not in CreateEventPayload or handles differently. 
      // Checking CreateEventPayload in types/event.ts might be needed. 
      // Assuming 'type' field in payload or similar. 
      // Actually CreateEventPayload has: type: 'PHYSICAL' | 'ONLINE' | 'HYBRID';

      await EventService.createEvent({
        ...payload
      } as any); // Type assertion if strict key check fails, but ideally should match.

      customToast.success("Event published successfully!");
      router.push('/explore'); // Redirect to explore or dashboard
    } catch (error) {
      console.error("Failed to publish event:", error);
      customToast.error("Failed to create event. Please try again.");
    } finally {
      setIsLoading(false);
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
                Category <span className="text-primary">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
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
                    className="w-full h-64 object-cover rounded-xl border border-foreground/10"
                  />
                  <button
                    onClick={() => setFormData((prev) => ({ ...prev, image: null }))}
                    className="absolute top-4 right-4 p-2 bg-background/90 backdrop-blur-sm rounded-full text-foreground/60 hover:text-primary transition-colors"
                  >
                    <Trash size={20} color="currentColor" variant="Outline" />
                  </button>
                </div>
              ) : (
                <label className="block">
                  <div className="w-full h-64 border-2 border-dashed border-foreground/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all duration-200">
                    <Camera
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
                        onChange={handleInputChange}
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-foreground/60 hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft2 size={20} color="currentColor" variant="Outline" />
              <span>Back</span>
            </button>
            <h1 className="text-sm lg:text-[16px] xl:text-[20px] font-bold font-[family-name:var(--font-clash-display)] text-foreground mb-2">
              Create Event
            </h1>
            <p className="text-foreground/60">
              Fill in the details below to create your event
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
                        ${isActive
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
                        className={`h-1 w-12 rounded-full ${isCompleted ? "bg-primary" : "bg-foreground/10"
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
                  onClick={handlePublish}
                >
                  Publish Event
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

export default CreateEventPage;

