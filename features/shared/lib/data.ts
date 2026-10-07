export type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  image: string;
  /** Sanitised HTML from the admin rich-text editor. */
  content: string;
  publishedAt: string | null;
};

export type Service = {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
};

export type ServiceDetail = Service & { content: string };

export type GalleryItem = {
  id: string;
  image: string;
  title: string;
  category: string;
  alt: string;
};

export type Location = {
  city: string;
  phone: string;
};


export const LOCATIONS: Location[] = [
  { city: "Butwal", phone: "9705223335" },
  { city: "Pokhara", phone: "9867187726" },
  { city: "Kapilvastu", phone: "9700063356" },
];

export const CONTACT_EMAIL = "Hexhealinghub@gmail.com";

export const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://www.facebook.com/HexHealing" },
  { label: "Instagram", href: "https://www.instagram.com/hexhealinghub/" },
  { label: "TikTok", href: "https://www.tiktok.com/@hexhealinghub" },
  { label: "YouTube", href: "https://youtube.com/@hexhealinghub" },
] as const;

/** Where a session can happen: one of the centres, or online. */
export const BOOKING_PLACES = [...LOCATIONS.map((l) => l.city), "Online"] as const;

export const CENTRE_ADDRESS = "Butwal, Lumbini Province 32907 · Open Sun–Fri 11am–5pm";

/** The Butwal centre on Google Maps: reviews, directions and the map pin. */
export const CENTRE_MAP_URL =
  "https://www.google.com/maps/place/Hex+Healing+Hub+Private+Limited/@27.6906764,83.463639,17z/data=!3m1!4b1!4m6!3m5!1s0x3996875cc0697625:0x4fd8f408d3044fda!8m2!3d27.6906764!4d83.4662139!16s%2Fg%2F11yhg_vtk2";

export const TIMES_OF_DAY = ["Morning", "Afternoon", "Evening"] as const;

export type Testimonial = {
  id: string;
  name: string;
  quote: string;
  photo: string | null;
  service: string | null;
  centre: string | null;
  rating: number;
};


/** A healer as shown on cards (Our Healers page, homepage, service pages). */
export type HealerCard = {
  id: string;
  name: string;
  slug: string;
  title: string;
  photo: string | null;
  experienceYears: number;
  places: string[];
  /** Lowest price among their services, in rupees (null if none listed). */
  fromPrice: number | null;
  /** Average of their published reviews (null until they have one). */
  rating: number | null;
  reviewCount: number;
  services: string[];
};

export type HealerOffering = { serviceId: string; title: string; slug: string; price: number; durationMinutes: number };

export type HealerProfile = HealerCard & {
  bio: string;
  qualifications: string[];
  languages: string[];
  offerings: HealerOffering[];
  /** Weekly hours, minutes from midnight (Nepal time); weekday 0 = Sunday. */
  hours: { weekday: number; startMinute: number; endMinute: number }[];
  reviews: Testimonial[];
  /** Bookings with this healer marked Completed. */
  sessionsCompleted: number;
};
