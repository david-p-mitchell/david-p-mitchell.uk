export type NavLink =
  | { label: string; href: string; children?: never }
  | { label: string; href?: string; children: { label: string; href: string }[] };

export const links: NavLink[] = [
  { label: "Tech Tyndale / .Net Devotions", href: "/devDevotions" },
  {
    label: "Recommendations",
    
    children: [
      { label: "Media", href: "/recommendations/media" },
      // { label: "Apps", href: "/recommendations/apps" },
      // { label: "Books", href: "/recommendations/books" },
      
      // { label: "Websites", href: "/recommendations/websites" },
    ],
  },
  // { label: "Testimony", href: "/testimony" },Con
  // { label: "Blog", href: "/blog" },
  // { label: "Books", href: "/books" },
  
  {
    label: "Tools",
    href: "/tools/",
    children: [
      { label: "Bible Book Progress", href: "/tools/bibleBookProgress" },
      // { label: "Mortifying Sin", href: "/tools/mortifyingSin" },
    ],
  },
];