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
