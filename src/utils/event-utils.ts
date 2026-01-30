import { EventCategory } from "@/types/event";

export const getApiCategory = (uiCategory: string): EventCategory => {
    const map: Record<string, EventCategory> = {
        "Tech": EventCategory.TECH,
        "Music": EventCategory.MUSIC,
        "Design": EventCategory.ARTS, // Approximation
        "Business": EventCategory.BUSINESS,
        "Networking": EventCategory.COMMUNITY,
        "Workshop": EventCategory.EDUCATION,
        "Conference": EventCategory.BUSINESS,
        "Party": EventCategory.ENTERTAINMENT,
        "Sports": EventCategory.SPORTS,
        "Other": EventCategory.OTHER,
    };
    return map[uiCategory] || EventCategory.OTHER;
};
