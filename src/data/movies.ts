export type Cost = "Free" | "Partial Free" | "Paid";
export type BaseItem = {
  name: string;
  description: string;
  tags: string[];
  cost: Cost
  director?: string[]; // Optional field for docuseries
};

export type Movie = BaseItem & {
  type: "movie";
  url: string;
  duration: string;
};

export type Docuseries = BaseItem & {
  type: "docuseries";
  episodes: {
    title: string;
    url: string;
    tags?: string[];
    duration: string;
    cost?: Cost; // Optional field for episodes, default to true if not provided
  }[]
};

export type ContentItem = Movie | Docuseries;

export const links: ContentItem[] = [
  {
    type: "movie",
    name: "Through the Eyes of Spurgeon",
    url: "https://youtu.be/4a6R96XhPaA?si=kENu0mqQ9PiyqDdy",
    cost: "Free",
    tags: ["Spurgeon", "Church History", "Biography"], 
    description:
      "A documentary-style look at the life, ministry, and enduring impact of Charles Spurgeon.",
      duration: "1:57:40"
  },
  {
    type: "movie",
    name: "Revival: The Work of God",
    url: "https://youtu.be/QfpdKnJicZo?si=zdcBeEhZ7qKOcG-w",
    cost: "Free",
    tags: ["Revival", "Theology", "Church History"],
    description:
      "Explores the biblical and historical understanding of revival as a sovereign work of God.",
      duration: "1:55:43"
  },
  {
    type: "movie",
    name: "Matthew Henry: The Life and Times of the Bible Commentator",
    url: "https://youtu.be/yPX9ARk-JkU?si=AHEXGyOBxCfQtXjK",
    cost: "Free",
    tags: ["Matthew Henry", "Biography", "Church History", "Bible Commentary", "Biography"],
    description:
      "Covers the life and influence of Matthew Henry, known for his widely used Bible commentary.",
      duration: "2:05:01"
  },
  {
    type: "movie",
    name: "Welsh Awakenings: The Story of God's Work in Wales",
    url: "https://youtu.be/2ZwmXRgIO_Y?si=wexOH5B-DLL0o1O1",
    cost: "Free",
    tags: ["Revival", "Wales", "Church History"],
    description:
      "Documents key revival movements in Wales and their spiritual and cultural impact.",
      duration: "2:12:20"
  },
  {
    type: "movie",
    name: "Luther: The Life and Legacy of the German Reformer",
    url: "https://youtu.be/6VK0p-tuuao?si=QrpvsfC6wWMEXKEy",
    cost: "Free",
    tags: ["Reformation", "Martin Luther", "Biography", "Church History"],
    description:
      "An overview of Martin Luther's life and his role in the Protestant Reformation.",
      duration: "1:21:16"
  },
  {
    type: "movie",
    name: "American Gospel: Christ Alone",
    url: "https://youtu.be/bUOLt99JnAk?si=VQN5qar2hfSqti33",
    cost: "Free",
    tags: ["Gospel", "Apologetics", "Theology"],
    description:
      "Contrasts the biblical gospel with modern distortions, focusing on justification by faith alone.",
      duration: "2:27:34"
  },
  {
    type: "movie",
    name: "Pilgrim's Progress",
    url: "https://youtu.be/ksu-zTG9HHg?si=5ppYQ-8gf2ME33Tx",
    cost: "Free",
    tags: ["Allegory", "John Bunyan", "Classic", "Christian Journey", "Kids", "Children"],
    description:
      "A visual retelling of John Bunyan's classic allegory of the Christian journey.",
      duration: "1:53:13"
  },
  {
    type: "movie",
    name: "Knox: The Life and Legacy of Scotland's Controversial Reformer",
    url: "https://youtu.be/Bw3mzvtuO7A?si=7VtXiseSh6m-wgmT",
    cost: "Free",
    tags: ["Reformation", "John Knox", "Scotland", "Church History", "Biography"],
    description:
      "Examines the life and influence of John Knox in shaping the Scottish Reformation.",
      duration: "1:17:39"
  },
  {
    type: "movie",
    name: "John Wycliffe: Morningstar",
    url: "https://youtu.be/CXY4lV0brds?si=plWNsHvkuCCrkdW3",
    cost: "Free",
    tags: ["Pre-Reformation", "Wycliffe", "Bible Translation", "Church History", "Biography"],
    description:
      "Tells the story of John Wycliffe, an early reformer who championed Scripture in the common language.",
      duration: "1:18:32"
  },
  {
    type: "movie",
    name: "Amazing Love: The Story of Hosea",
    url: "https://youtu.be/A7wHoafxLUY?si=9oaKUz9b8s67rOqz",
    cost: "Free",
    tags: ["Bible Story", "Hosea", "Old Testament", "Teens"],
    description:
      "A dramatized account of the prophet Hosea, illustrating God's covenant love for His people.",
    duration: "1:20:17"
  },

  {
  type: "docuseries",
  name: "EPIC (by Tim Challies)",
  director: ["Tim Challies", "Stephen McCaskell"],
  cost: "Free",
  tags: ["Overview", "Bible Story", "Theology", "Church History"],
  description:
    "A visual journey through the storyline of Scripture from creation to new creation.",
  episodes: [
    {
      title: "Episode 1: Israel & Italy",
      url: "https://www.youtube.com/watch?v=DHxDjexosvU",
      duration: "25:00",
      tags: ["Early Church", "Rome", "Israel", "Church History", "Italy", "Catholicism"],
      cost: "Free" 
    },
    {
      title: "Episode 2: England",
      url: "https://www.youtube.com/watch?v=BxJP4rKVY8M",
      duration: "24:54",
      tags: ["Reformation", "Church History", "England"],
      cost: "Free" 
    },
    {
      title: "Episode 3: Ireland & Scotland",
      url: "https://youtu.be/s16cuOPa0xQ?si=R1wxf1PkjSSAu5FE",
      duration: "25:03",
      tags: ["Celtic Church", "Reformation", "Ireland", "Scotland"],
      cost: "Free" 
    },
    {
      title: "Episode 4: France & Switzerland",
      url: "https://youtu.be/ywyxRw-_8dE?si=E0rG2QCNoVKop1r_",
      duration: "21:40",
      tags: ["Reformers", "Reformation", "France", "Switzerland"],
      cost: "Free"
    },
    {
      title: "Episode 5: Germany & Ecuador",
      url: "https://youtu.be/H55P2zOt3gg?si=bkWYxvfyOgMyQ1xK",
      duration: "20:52",
      tags: ["Luther", "Reformation", "Mission", "Ecuador"],
      cost: "Free"
    },
    {
      title: "Episode 6: Australia & New Zealand",
      url: "https://youtu.be/hdAk7QHW-d0?si=93eKEL4vvME3LRxC",
      duration: "23:18",
      tags: ["Mission", "Modern Church", "Australia", "New Zealand"],
      cost: "Free" 
    },
    {
      title: "Episode 7: Zambia & Zimbabwe",
      url: "https://youtu.be/Oi2BcTeuyoA?si=8XqjrIG-cxZFtiqE",
      duration: "24:04",
      tags: ["Mission", "Africa", "David Livingstone", "Zambia", "Zimbabwe"],
      cost: "Free" 
    },
    {
      title: "Episode 8: India",
      url: "https://youtu.be/XMCZ-mHb3II?si=RDe6l8P2yuzdOpxp",
      duration: "26:14",
      tags: ["Mission", "Church History", "India", "Amy Carmichael"],
      cost: "Free" 
    },
    {
      title: "Episode 9: Asia (China, Philippines & South Korea)",
      url: "https://youtu.be/kBkZrCpl4AI?si=iOJGykwZS0APefkv",
      duration: "20:21",
      tags: ["Asia", "Mission", "China", "Philippines", "South Korea"],
      cost: "Free" 
    },
    {
      title: "Episode 10: USA",
      url: "https://youtu.be/8t7mlf71s98?si=HT2L2mY5E4dUAk-g",
      duration: "25:48",
      tags: ["Modern Church", "Church History", "USA"],
      cost: "Free" 
    }
  ]
},
  {
  type: "docuseries",
  name: "Missionary: Obeying the Great Commission",
  director: ["Brooks Buser", "Stephen McCaskell"],
  cost: "Partial Free",
  tags: ["Overview", "Mission", "Church History"],
  description:
    "Experience the stories of the men and women who followed the Great Commission. The six-part docuseries tells the stories of William Tyndale, Hudson Taylor, Amy Carmichael, William Carey, David Livingstone, and John Paton",
  episodes: [
    {
      title: "Episode 1: William Tyndale: The Necessity of the Word",
      url: "https://youtu.be/CRAbG_u-nKo?si=u_w08MwnMkxnI_Wq",
      duration: "43:45",
      tags: ["Church History", "William Tyndale"],
      cost: "Free"
    }
  ]
}
];