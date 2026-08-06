export interface Tool {
  title: string;
  description: string;
  href: string;
  icon: string;
}

export const tools: Tool[] = [
  {
    title: "Bible Reading Progress Calculator",
    description:
      "Track how far you have read through the Bible and see your progress book by book.",
    href: "/tools/bibleBookProgress",
    icon: "📖",
  },
  {
    title: "Putting Sin to Death Questionnaire",
    description:    
      "Identify and mortify sin in your life.",
    href: "/tools/mortifyingSin",
    icon: "⚔️",
  },
];