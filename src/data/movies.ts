export type BaseItem = {
  name: string;
  description: string;
  tags: string[];
  publiclyFree: boolean;
};

export type Movie = BaseItem & {
  type: "movie";
  url: string;
};

export type Docuseries = BaseItem & {
  type: "docuseries";
  episodes: {
    title: string;
    url: string;
    tags?: string[];
    duration: string;
  }[];
};

export type ContentItem = Movie | Docuseries;

export const links: ContentItem[] = [
  {
    type: "movie",
    name: "Through the Eyes of Spurgeon",
    url: "https://youtu.be/4a6R96XhPaA?si=kENu0mqQ9PiyqDdy",
    publiclyFree: true,
    tags: ["Spurgeon", "Church History", "Biography"],
    description:
      "A documentary-style look at the life, ministry, and enduring impact of Charles Spurgeon."
  },
  {
    type: "movie",
    name: "Revival: The Work of God",
    url: "https://youtu.be/QfpdKnJicZo?si=zdcBeEhZ7qKOcG-w",
    publiclyFree: true,
    tags: ["Revival", "Theology", "Church History"],
    description:
      "Explores the biblical and historical understanding of revival as a sovereign work of God."
  },
  {
    type: "movie",
    name: "Matthew Henry: The Life and Times of the Bible Commentator",
    url: "https://youtu.be/yPX9ARk-JkU?si=AHEXGyOBxCfQtXjK",
    publiclyFree: true,
    tags: ["Matthew Henry", "Biography", "Church History", "Bible Commentary"],
    description:
      "Covers the life and influence of Matthew Henry, known for his widely used Bible commentary."
  },
  {
    type: "movie",
    name: "Welsh Awakenings: The Story of God's Work in Wales",
    url: "https://youtu.be/2ZwmXRgIO_Y?si=wexOH5B-DLL0o1O1",
    publiclyFree: true,
    tags: ["Revival", "Wales", "Church History"],
    description:
      "Documents key revival movements in Wales and their spiritual and cultural impact."
  },
  {
    type: "movie",
    name: "Luther: The Life and Legacy of the German Reformer",
    url: "https://youtu.be/6VK0p-tuuao?si=QrpvsfC6wWMEXKEy",
    publiclyFree: true,
    tags: ["Reformation", "Martin Luther", "Biography", "Church History"],
    description:
      "An overview of Martin Luther's life and his role in the Protestant Reformation."
  },
  {
    type: "movie",
    name: "American Gospel: Christ Alone",
    url: "https://youtu.be/bUOLt99JnAk?si=VQN5qar2hfSqti33",
    publiclyFree: true,
    tags: ["Gospel", "Apologetics", "Theology"],
    description:
      "Contrasts the biblical gospel with modern distortions, focusing on justification by faith alone."
  },
  {
    type: "movie",
    name: "Pilgrim's Progress",
    url: "https://youtu.be/ksu-zTG9HHg?si=5ppYQ-8gf2ME33Tx",
    publiclyFree: true,
    tags: ["Allegory", "John Bunyan", "Classic"],
    description:
      "A visual retelling of John Bunyan's classic allegory of the Christian journey."
  },
  {
    type: "movie",
    name: "Knox: The Life and Legacy of Scotland's Controversial Reformer",
    url: "https://youtu.be/Bw3mzvtuO7A?si=7VtXiseSh6m-wgmT",
    publiclyFree: true,
    tags: ["Reformation", "John Knox", "Scotland", "Church History"],
    description:
      "Examines the life and influence of John Knox in shaping the Scottish Reformation."
  },
  {
    type: "movie",
    name: "John Wycliffe: Morningstar",
    url: "https://youtu.be/CXY4lV0brds?si=plWNsHvkuCCrkdW3",
    publiclyFree: true,
    tags: ["Pre-Reformation", "Wycliffe", "Bible Translation", "Church History"],
    description:
      "Tells the story of John Wycliffe, an early reformer who championed Scripture in the common language."
  },
  {
    type: "movie",
    name: "Amazing Love: The Story of Hosea",
    url: "https://youtu.be/A7wHoafxLUY?si=9oaKUz9b8s67rOqz",
    publiclyFree: true,
    tags: ["Bible Story", "Hosea", "Old Testament"],
    description:
      "A dramatized account of the prophet Hosea, illustrating God's covenant love for His people."
  },

  {
  type: "docuseries",
  name: "EPIC (by Tim Challies)",
  publiclyFree: true,
  tags: ["Overview", "Bible Story", "Theology", "Church History"],
  description:
    "A visual journey through the storyline of Scripture from creation to new creation.",
  episodes: [
    {
      title: "Episode 1: Israel & Italy",
      url: "https://www.youtube.com/watch?v=DHxDjexosvU",
      duration: "25:00",
      tags: ["Creation", "Early Church", "Rome"]
    },
    {
      title: "Episode 2: England",
      url: "https://www.youtube.com/watch?v=BxJP4rKVY8M",
      duration: "25:00",
      tags: ["Reformation", "Church History"]
    },
    {
      title: "Episode 3: Ireland & Scotland",
      url: "https://www.youtube.com/watch?v=UNKNOWN",
      duration: "25:00",
      tags: ["Celtic Church", "Reformation"]
    },
    {
      title: "Episode 4: France & Switzerland",
      url: "https://www.youtube.com/watch?v=ywyxRw-_8dE",
      duration: "22:00",
      tags: ["Reformers", "Reformation"]
    },
    {
      title: "Episode 5: Germany & Ecuador",
      url: "https://www.youtube.com/watch?v=H55P2zOt3gg",
      duration: "21:00",
      tags: ["Luther", "Reformation", "Mission"]
    },
    {
      title: "Episode 6: Australia & New Zealand",
      url: "https://www.youtube.com/watch?v=UNKNOWN",
      duration: "23:00",
      tags: ["Mission", "Modern Church"]
    },
    {
      title: "Episode 7: Zambia & Zimbabwe",
      url: "https://www.youtube.com/watch?v=Oi2BcTeuyoA",
      duration: "24:00",
      tags: ["Mission", "Africa"]
    },
    {
      title: "Episode 8: India",
      url: "https://www.youtube.com/watch?v=UNKNOWN",
      duration: "26:00",
      tags: ["Mission", "Church History"]
    },
    {
      title: "Episode 9: Asia (China, Philippines & South Korea)",
      url: "https://www.youtube.com/watch?v=UNKNOWN",
      duration: "20:00",
      tags: ["Asia", "Mission"]
    },
    {
      title: "Episode 10: USA",
      url: "https://www.youtube.com/watch?v=UNKNOWN",
      duration: "25:00",
      tags: ["Modern Church", "Church History"]
    }
  ]
}
];