export type NavLink =
  | { label: string; href: string; children?: never }
  | { label: string; href?: never; children: { label: string; href: string }[] };

export const links: NavLink[] = [
  { label: "Media", href: "/media" },
  // { label: "Testimony", href: "/testimony" },
  // { label: "Blog", href: "/blog" },
  { label: "Tech Tyndale / .Net Devotions", href: "/devDevotions" },
  {
    label: "Tools",
    children: [
      { label: "Bible Book Progress", href: "/tools/bibleBookProgress" },
    ],
  },
];