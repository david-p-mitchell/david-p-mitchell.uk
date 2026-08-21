export interface Tool {
  title: string;
  description: string;
  href: string;
  icon: string;
  iconIsSVG?: boolean;
}

export const tools: Tool[] = [
  {
    title: "Bible Reading Progress Calculator",
    description:
      "Track how far you have read through the Bible and see your progress book by book.",
    href: "/tools/bibleBookProgress",
    icon: "📖",
  },
//   {
//     title: "Putting Sin to Death Questionnaire",
//     description:    
//       "Identify and mortify sin in your life.",
//     href: "/tools/mortifyingSin",
//     icon: "⚔️",
//   },
//   {
//     title: "Quote Image Creator",
//     description:    
//       "Create beautiful quote images for social media and other purposes.",
//     href: "/tools/quoteImageCreator",
//     icon: "📸",
//   },
     
  {
    title: "Sanctifying Sundays Tool",
    description:
      "A tool to help guide your thinking biblically about Sundays.",
    href: "/tools/sanctifyingSunday",
    icon: "⛪",
  },
  {
    title: "Wifi QR Code Generator",
    description: "A tool to help share your Wifi with others in your home.",
    href: "/tools/qr-wifi",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4287f5" class="w-7 h-7"><path d="M12 3c-4.97 0-9.47 1.83-12 4.88a.75.75 0 0 0 .1 1.05l1.02.83a.75.75 0 0 0 1.03-.08A15.86 15.86 0 0 1 12 6c3.81 0 7.28 1.34 9.85 3.68a.75.75 0 0 0 1.03.08l1.02-.83a.75.75 0 0 0 .1-1.05A18.86 18.86 0 0 0 12 3zm0 5c-3.6 0-6.86 1.33-8.7 3.53a.75.75 0 0 0 .1 1.05l1.02.83a.75.75 0 0 0 1.03-.08C6.83 11.96 9.27 11 12 11c2.73 0 5.17.96 6.55 2.33a.75.75 0 0 0 1.03.08l1.02-.83a.75.75 0 0 0 .1-1.05C18.86 9.33 15.6 8 12 8zm0 5c-2.22 0-4.23.83-5.38 2.18a.75.75 0 0 0 .1 1.05l1.02.83a.75.75 0 0 0 1.03-.08C9.44 16.3 10.63 15.75 12 15.75s2.56.55 3.23 1.23a.75.75 0 0 0 1.03.08l1.02-.83a.75.75 0 0 0 .1-1.05A7.32 7.32 0 0 0 12 13zm0 5.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>',
    iconIsSVG: true
  },
  {
    title: "Link QR Code Generator",
    description: "A tool to help share sites, that help you share Jesus.",
    href: "/tools/qr-link",
    "icon": "🔗"
  }

];

