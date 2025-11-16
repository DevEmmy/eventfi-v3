"use client";

import React, { useState } from "react";
import Button from "@/components/Button";
import {
  Shop,
  DocumentText,
  Location,
  Image as ImageIcon,
  ArrowLeft2,
  ArrowRight2,
  Add,
  Trash,
  Call,
  Sms,
} from "iconsax-react";

const CreateVendorPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    location: "",
    address: "",
    phone: "",
    email: "",
    priceRangeMin: "",
    priceRangeMax: "",
    logo: null as string | null,
    coverImage: null as string | null,
    specialties: [] as string[],
    portfolio: [] as string[],
    website: "",
    yearsOfExperience: "",
    availability: "available" as "available" | "limited" | "unavailable",
  });

  const [currentSpecialty, setCurrentSpecialty] = useState("");
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    { id: "basic", label: "Basic Info", icon: DocumentText },
    { id: "services", label: "Services & Pricing", icon: Shop },
    { id: "contact", label: "Contact & Location", icon: Location },
    { id: "portfolio", label: "Portfolio & Settings", icon: ImageIcon },
  ];

  const categories = [
    "Photography",
    "Videography",
    "DJ & Music",
    "Catering",
    "Venues",
    "Decorations",
    "Security",
    "Lighting",
    "Sound System",
  ];

  const locations = [
    "Lagos, Nigeria",
    "Abuja, Nigeria",
    "Port Harcourt, Nigeria",
    "Ibadan, Nigeria",
    "Kano, Nigeria",
    "Other",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "coverImage" | "portfolio"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "portfolio") {
          setFormData((prev) => ({
            ...prev,
            portfolio: [...prev.portfolio, reader.result as string],
          }));
        } else {
          setFormData((prev) => ({ ...prev, [type]: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSpecialty = () => {
    if (currentSpecialty.trim() && !formData.specialties.includes(currentSpecialty.trim())) {
      setFormData((prev) => ({
        ...prev,
        specialties: [...prev.specialties, currentSpecialty.trim()],
      }));
      setCurrentSpecialty("");
    }
  };

  const handleRemoveSpecialty = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((s) => s !== specialty),
    }));
  };

  const handleRemovePortfolioImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      portfolio: prev.portfolio.filter((_, i) => i !== index),
    }));
  };

  const handleSaveDraft = () => {
    console.log("Saving draft:", formData);
    alert("Vendor profile saved as draft!");
  };

  const handlePublish = () => {
    // Validate required fields
    if (
      !formData.name ||
      !formData.category ||
      !formData.description ||
      !formData.location ||
      !formData.phone ||
      !formData.email
    ) {
      alert("Please fill in all required fields");
      return;
    }
    console.log("Publishing vendor profile:", formData);
    alert("Vendor profile created successfully!");
    // Redirect to vendor profile or marketplace
    window.location.href = "/marketplace";
  };

  const renderSection = () => {
    switch (activeSection) {
      case 0: // Basic Info
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Vendor Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Elite Photography Studio"
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
                placeholder="Describe your services, experience, and what makes you unique..."
                rows={6}
                className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                placeholder="e.g., 5"
                min="0"
                className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
              />
            </div>

            {/* Logo Upload */}
            <div className="pt-6 border-t border-foreground/10">
              <h3 className="text-lg font-semibold text-foreground mb-4">Logo</h3>
              {formData.logo ? (
                <div className="relative w-32 h-32">
                  <img
                    src={formData.logo}
                    alt="Vendor logo"
                    className="w-full h-full object-cover rounded-xl border border-foreground/10"
                  />
                  <button
                    onClick={() => setFormData((prev) => ({ ...prev, logo: null }))}
                    className="absolute -top-2 -right-2 p-2 bg-background/90 backdrop-blur-sm rounded-full text-foreground/60 hover:text-primary transition-colors shadow-lg"
                  >
                    <Trash size={16} color="currentColor" variant="Outline" />
                  </button>
                </div>
              ) : (
                <label className="block">
                  <div className="w-32 h-32 border-2 border-dashed border-foreground/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all duration-200">
                    <ImageIcon
                      size={32}
                      color="currentColor"
                      variant="Outline"
                      className="text-foreground/40 mb-2"
                    />
                    <span className="text-xs text-foreground/60 text-center px-2">
                      Upload Logo
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "logo")}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        );

      case 1: // Services & Pricing
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Specialties
              </label>
              <p className="text-sm text-foreground/60 mb-3">
                Add the types of services or events you specialize in
              </p>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={currentSpecialty}
                  onChange={(e) => setCurrentSpecialty(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSpecialty();
                    }
                  }}
                  placeholder="e.g., Wedding Photography, Corporate Events"
                  className="flex-1 px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                />
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={Add}
                  onClick={handleAddSpecialty}
                >
                  Add
                </Button>
              </div>
              {formData.specialties.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-foreground/5 border border-foreground/10 rounded-full text-sm text-foreground"
                    >
                      {specialty}
                      <button
                        onClick={() => handleRemoveSpecialty(specialty)}
                        className="text-foreground/60 hover:text-primary transition-colors"
                      >
                        <Trash size={14} color="currentColor" variant="Outline" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-foreground/10">
              <h3 className="text-lg font-semibold text-foreground mb-4">Pricing Range</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Minimum Price (₦)
                  </label>
                  <input
                    type="number"
                    name="priceRangeMin"
                    value={formData.priceRangeMin}
                    onChange={handleInputChange}
                    placeholder="e.g., 50000"
                    min="0"
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Maximum Price (₦)
                  </label>
                  <input
                    type="number"
                    name="priceRangeMax"
                    value={formData.priceRangeMax}
                    onChange={handleInputChange}
                    placeholder="e.g., 200000"
                    min="0"
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                  />
                </div>
              </div>
              <p className="text-sm text-foreground/60 mt-2">
                This will be displayed as a price range on your vendor profile
              </p>
            </div>
          </div>
        );

      case 2: // Contact & Location
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Phone Number <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <Call
                      size={20}
                      color="currentColor"
                      variant="Outline"
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+234 800 123 4567"
                      className="w-full pl-12 pr-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Email Address <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <Sms
                      size={20}
                      color="currentColor"
                      variant="Outline"
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="contact@vendor.com"
                      className="w-full pl-12 pr-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Website (optional)
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://www.vendor.com"
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-foreground/10">
              <h3 className="text-lg font-semibold text-foreground mb-4">Location</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    City/State <span className="text-primary">*</span>
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    required
                  >
                    <option value="">Select location</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Full Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="e.g., 123 Victoria Island, Lagos"
                    className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Portfolio & Settings
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Cover Image</h3>
              <p className="text-sm text-foreground/60 mb-4">
                Upload a high-quality cover image that represents your business
              </p>
              {formData.coverImage ? (
                <div className="relative">
                  <img
                    src={formData.coverImage}
                    alt="Cover"
                    className="w-full h-64 object-cover rounded-xl border border-foreground/10"
                  />
                  <button
                    onClick={() => setFormData((prev) => ({ ...prev, coverImage: null }))}
                    className="absolute top-4 right-4 p-2 bg-background/90 backdrop-blur-sm rounded-full text-foreground/60 hover:text-primary transition-colors"
                  >
                    <Trash size={20} color="currentColor" variant="Outline" />
                  </button>
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
                    onChange={(e) => handleImageUpload(e, "coverImage")}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="pt-6 border-t border-foreground/10">
              <h3 className="text-lg font-semibold text-foreground mb-2">Portfolio Images</h3>
              <p className="text-sm text-foreground/60 mb-4">
                Showcase your best work with portfolio images
              </p>
              {formData.portfolio.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {formData.portfolio.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-32 object-cover rounded-xl border border-foreground/10"
                      />
                      <button
                        onClick={() => handleRemovePortfolioImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-background/90 backdrop-blur-sm rounded-full text-foreground/60 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash size={16} color="currentColor" variant="Outline" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label className="block">
                <div className="w-full py-8 border-2 border-dashed border-foreground/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all duration-200">
                  <ImageIcon
                    size={32}
                    color="currentColor"
                    variant="Outline"
                    className="text-foreground/40 mb-2"
                  />
                  <span className="text-foreground/60 font-medium text-sm">
                    Add Portfolio Image
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "portfolio")}
                  className="hidden"
                  multiple
                />
              </label>
            </div>

            <div className="pt-6 border-t border-foreground/10">
              <h3 className="text-lg font-semibold text-foreground mb-4">Availability Status</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-foreground/20 rounded-xl cursor-pointer hover:border-primary transition-all duration-200">
                  <input
                    type="radio"
                    name="availability"
                    value="available"
                    checked={formData.availability === "available"}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-primary focus:ring-primary"
                  />
                  <div>
                    <div className="font-semibold text-foreground">Available</div>
                    <div className="text-sm text-foreground/60">
                      Accepting new bookings and inquiries
                    </div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 border border-foreground/20 rounded-xl cursor-pointer hover:border-primary transition-all duration-200">
                  <input
                    type="radio"
                    name="availability"
                    value="limited"
                    checked={formData.availability === "limited"}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-primary focus:ring-primary"
                  />
                  <div>
                    <div className="font-semibold text-foreground">Limited Availability</div>
                    <div className="text-sm text-foreground/60">
                      Limited bookings, contact for availability
                    </div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 border border-foreground/20 rounded-xl cursor-pointer hover:border-primary transition-all duration-200">
                  <input
                    type="radio"
                    name="availability"
                    value="unavailable"
                    checked={formData.availability === "unavailable"}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-primary focus:ring-primary"
                  />
                  <div>
                    <div className="font-semibold text-foreground">Unavailable</div>
                    <div className="text-sm text-foreground/60">
                      Not accepting new bookings at this time
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
              Set Up Your Vendor Profile
            </h1>
            <p className="text-foreground/60">
              Create your vendor profile and start getting discovered by event organizers
            </p>
          </div>

          {/* Progress Indicator */}
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
                  rightIcon={Shop}
                  onClick={handlePublish}
                >
                  Create Vendor Profile
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

export default CreateVendorPage;

