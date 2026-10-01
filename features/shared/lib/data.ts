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
  { label: "Facebook", href: "https://www.facebook.com/BYouphotog/" },
  { label: "Instagram", href: "https://www.instagram.com/hexhealinghubpokhara/" },
  { label: "TikTok", href: "https://www.tiktok.com/@hex.healinghub.pokhara" },
] as const;

/** Where a session can happen: one of the centres, or online. */
export const BOOKING_PLACES = [...LOCATIONS.map((l) => l.city), "Online"] as const;

export const POKHARA_HOURS = "Lakeside Rd, Pokhara · Open daily 11am–5pm";

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
