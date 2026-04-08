import { EventCategory } from "@/types/event";

export interface CategoryDefinition {
  label: string;
  emoji: string;
  apiValue: EventCategory;
  suggestedTags: string[];
  hint?: string; // context hint shown after selection
}

export const EVENT_CATEGORIES: CategoryDefinition[] = [
  {
    label: "Concert",
    emoji: "🎵",
    apiValue: EventCategory.MUSIC,
    suggestedTags: ["Live Music", "Band", "DJ", "Afrobeats", "Gospel", "Hip-Hop", "Orchestra", "Open Mic"],
    hint: "Great for adding setlists, lineup details, and seating arrangements.",
  },
  {
    label: "Conference",
    emoji: "🎤",
    apiValue: EventCategory.BUSINESS,
    suggestedTags: ["Keynote", "Panel", "Breakout Sessions", "Networking", "Speakers", "B2B", "Summit"],
    hint: "Include your speaker lineup and session schedule for better attendance.",
  },
  {
    label: "Workshop",
    emoji: "🛠️",
    apiValue: EventCategory.EDUCATION,
    suggestedTags: ["Hands-on", "Beginner Friendly", "Certification", "Skill Building", "Training", "Bootcamp"],
    hint: "Workshops work best with clear skill levels and what attendees will leave with.",
  },
  {
    label: "Hackathon",
    emoji: "💻",
    apiValue: EventCategory.TECH,
    suggestedTags: ["Coding", "AI", "Web3", "Teams", "Prizes", "24hr", "48hr", "Open Source"],
    hint: "Mention team sizes, tech stack, and prize pool to attract the right builders.",
  },
  {
    label: "Birthday Party",
    emoji: "🎂",
    apiValue: EventCategory.ENTERTAINMENT,
    suggestedTags: ["Private", "RSVP", "Kids", "Adults", "Themed", "Outdoor", "Indoor"],
    hint: "Keep it private or set an RSVP limit for an intimate feel.",
  },
  {
    label: "Networking",
    emoji: "🤝",
    apiValue: EventCategory.COMMUNITY,
    suggestedTags: ["Founders", "Investors", "Tech", "Creative", "Mixer", "Happy Hour", "Speed Networking"],
    hint: "Short, punchy description of who should attend works best here.",
  },
  {
    label: "Exhibition",
    emoji: "🎨",
    apiValue: EventCategory.ARTS,
    suggestedTags: ["Art", "Gallery", "Photography", "Fashion", "Design", "Installation", "Opening Night"],
    hint: "Add featured artists and a preview image that represents the work.",
  },
  {
    label: "Sports Event",
    emoji: "⚽",
    apiValue: EventCategory.SPORTS,
    suggestedTags: ["Tournament", "League", "Match", "Fan Zone", "Marathon", "Charity Run", "Fitness"],
    hint: "Include teams, venue layout, and whether spectators can attend.",
  },
  {
    label: "Food & Drink",
    emoji: "🍽️",
    apiValue: EventCategory.FOOD_DRINK,
    suggestedTags: ["Tasting", "Wine", "Pop-up", "Street Food", "Chef's Table", "Cocktails", "Vegan"],
    hint: "Mention dietary options and whether it's ticketed per person or table.",
  },
  {
    label: "Wellness",
    emoji: "🧘",
    apiValue: EventCategory.WELLNESS,
    suggestedTags: ["Yoga", "Meditation", "Mental Health", "Retreat", "Fitness", "Self-care", "Spa"],
    hint: "Calming imagery and a clear schedule help attendees plan their day.",
  },
  {
    label: "Other",
    emoji: "✨",
    apiValue: EventCategory.OTHER,
    suggestedTags: ["Community", "Fundraiser", "Launch", "Meetup", "Pop-up"],
  },
];

export const getCategoryByLabel = (label: string): CategoryDefinition | undefined =>
  EVENT_CATEGORIES.find((c) => c.label === label);

export const getApiCategoryFromLabel = (label: string): EventCategory =>
  getCategoryByLabel(label)?.apiValue ?? EventCategory.OTHER;
