export type Cost = "Free" | "Partial Free" | "Paid";
export type BaseItem = {
  name: string;
  description: string;
  tags: string[];
  cost: Cost
  director?: string[]; // Optional field for docuseries
  show?: boolean; // Optional field to control visibility of the item, default to true if not provided
  platform?: Platform[];
  hint?: string;
  disclaimer?: string; // Optional field for disclaimers or additional notes
  briefDescription?: string; // Optional field for a brief description of the item

};

export type Episode = {
    title: string;
    url: string;
    tags?: string[];
    duration: string;
    cost?: Cost; // Optional field for episodes, default to true if not provided
    description?: string; // Optional field for episode description
    briefDescription?: string; // Optional field for brief episode description
}

type PlatformType = "YouTube" | "Vimeo" | "Netflix" | "Amazon Prime" | "Disney+" | "Other";
export type Platform = {
  name: PlatformType;
  url: string;
};

export type Documentary = BaseItem & {
  type: "documentary";
  url: string;
  duration: string;
};

export type Movie = BaseItem & {
  type: "movie";
  url: string;
  duration: string;
};

export type Docuseries = BaseItem & {
  type: "docuseries";
  url?: string; // Optional field for docuseries, as it may have a main page instead of individual URLs
  episodes: Episode[];
};

export type ContentItem = Movie | Docuseries | Documentary;

export const links: ContentItem[] = [
  {
    type: "documentary",
    name: "Through the Eyes of Spurgeon",
    url: "https://youtu.be/4a6R96XhPaA?si=kENu0mqQ9PiyqDdy",
    cost: "Free",
    tags: ["Spurgeon", "Church History", "Biography"], 
    briefDescription: "A feature documentary detailing the life and enduring legacy of Charles Spurgeon.",
    description:
      "A documentary-style look at the life, ministry, and enduring impact of Charles Spurgeon.",
    duration: "1:57:40"
  },
  {
    type: "documentary",
    name: "Revival: The Work of God",
    url: "https://youtu.be/QfpdKnJicZo?si=zdcBeEhZ7qKOcG-w",
    cost: "Free",
    tags: ["Revival", "Theology", "Church History"],
    briefDescription: "An exploration of historical Christian revivals as sovereign works of God.",
    description:
      "Explores the biblical and historical understanding of revival as a sovereign work of God.",
    duration: "1:55:43"
  },
  {
    type: "documentary",
    name: "Matthew Henry: The Life and Times of the Bible Commentator",
    url: "https://youtu.be/yPX9ARk-JkU?si=AHEXGyOBxCfQtXjK",
    cost: "Free",
    tags: ["Matthew Henry", "Biography", "Church History", "Bible Commentary", "Biography"],
    briefDescription: "Biographical documentary on the renowned 17th-century Bible commentator Matthew Henry.",
    description:
      "Covers the life and influence of Matthew Henry, known for his widely used Bible commentary.",
    duration: "2:05:01"
  },
  {
    type: "documentary",
    name: "Welsh Awakenings: The Story of God's Work in Wales",
    url: "https://youtu.be/2ZwmXRgIO_Y?si=wexOH5B-DLL0o1O1",
    cost: "Free",
    tags: ["Revival", "Wales", "Church History"],
    briefDescription: "A historical look at the major spiritual awakenings across Wales.",
    description:
      "Documents key revival movements in Wales and their spiritual and cultural impact.",
    duration: "2:12:20"
  },
  {
    type: "documentary",
    name: "Luther: The Life and Legacy of the German Reformer",
    url: "https://youtu.be/6VK0p-tuuao?si=QrpvsfC6wWMEXKEy",
    cost: "Free",
    tags: ["Reformation", "Martin Luther", "Biography", "Church History"],
    briefDescription: "An overview of Martin Luther's role in sparking the Protestant Reformation.",
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
    briefDescription: "Examines the true gospel against modern teachings like the Word of Faith movement.",
    description:
      "Contrasts the biblical gospel with modern distortions, focusing on justification by faith alone.",
    duration: "2:27:34"
  },
  {
    type: "movie",
    name: "Cross and the Switchblade (1970)",
    url: "https://www.youtube.com/watch?v=7ulhRFArGrM",
    cost: "Free",
    tags: ["Gospel", "Conversion", "Evangelism"],
    briefDescription: "Classic film based on David Wilkerson's ministry among NYC gang members.",
    description:
      "The change in the life of notorious gang leader Nicky Cruz, as shown in the film, proved to be wonderfully lasting and real. Although the original events depicted in this classic from the drug infested, gang dominated streets happened over thirty years ago, the life-changing solution that David Wilkerson brought to desperate lives was just beginning. The beat goes on. The change in the life of notorious gang leader Nicky Cruz, as shown in the film, proved to be wonderfully lasting and real. Nicky continues today to reach young people around the world with the same life-changing message of the gospel of Jesus Christ that delivered him from violence and despair. And what about the skinny preacher, David Wilkerson, who braved the meanest streets of New York to tell desperate and drug crazed youth that there was a better way? Now, three decades later, his ministry based in Times Square that is still changing lives and offering genuine hope to countless souls who had given up on life. Now in over 25 languages, The Cross and the Switchblade, starring Pat Boone and Eric Estrada, is one of those rare films that has shown its unique power to connect with the deepest hopes and fears of youth around the world. It remains today one of the most compelling stories of love, grace and the truth that no one is ever so far gone that they cannot find the way out.",
    duration: "1:36:37",
    show: false
  },
  {
    type: "documentary",
    name: "Knox: The Life and Legacy of Scotland's Controversial Reformer",
    url: "https://youtu.be/Bw3mzvtuO7A?si=7VtXiseSh6m-wgmT",
    cost: "Free",
    tags: ["Reformation", "John Knox", "Scotland", "Church History", "Biography"],
    briefDescription: "Chronicles John Knox's leadership in the Scottish Reformation.",
    description:
      "Examines the life and influence of John Knox in shaping the Scottish Reformation.",
    duration: "1:17:39"
  },
  {
    type: "documentary",
    name: "John Wycliffe: Morningstar",
    url: "https://youtu.be/CXY4lV0brds?si=plWNsHvkuCCrkdW3",
    cost: "Free",
    tags: ["Pre-Reformation", "Wycliffe", "Bible Translation", "Church History", "Biography"],
    briefDescription: "The story of John Wycliffe's mission to translate the Bible into English.",
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
    briefDescription: "A film retelling the Old Testament story of Hosea and God's faithful love.",
    description:
      "A dramatized account of the prophet Hosea, illustrating God's covenant love for His people.",
    duration: "1:20:17"
  },
  {
    type: "documentary",
    name: "Yembiyembi: Unto the Nations",
    url: "https://www.youtube.com/watch?v=ExXTXfCaNok",
    cost: "Free",
    tags: ["Mission", "PNG", "World", "Missionary Biography"],
    briefDescription: "Short documentary following the Buser family's tribal mission work in PNG.",
    description:
      "Though Brooks Buser's old home and mission field looks quite different from how it once did, what remains is everlasting. Learn about the Busers' labors with the Yembiyembi for the sake of the good news made known.",
    duration: "30:37"
  },
  {
    type: "documentary",
    name: "The Essential Church",
    url: "https://gracemedia.app/video-detail/the-essential-church-1",
    cost: "Free",
    tags: ["Church", "Covid", "Persecution", "Church History"],
    briefDescription: "Feature documentary on pastors standing for corporate worship during pandemic restrictions.",
    description:
      "When governments use Covid edicts to restrict the gathering and worship of the Church, three pastors facing the risk of imprisonment re-open their churches in the face of a world that has chosen to comply.",
    duration: "2:05:18",
    disclaimer: "In order to watch this documentary, you will need to create a free account/ sign in on the Grace Media App website."
  },
  {
    type: "movie",
    name: "FILM: The Story of SermonAudio",
    url: "https://www.youtube.com/watch?v=Wx0Fq1-Dcio",
    cost: "Free",
    tags: ["Sermons","Media"],
    briefDescription: "The providential origins and growth of the global SermonAudio platform.",
    description:
      "Discover the remarkable journey of how SermonAudio began with a young boy in the 1980s who fell asleep each night listening to cassette tapes of preaching—a simple beginning that would, by God's providence, grow into a global platform reaching millions. This film captures the vision, challenges, and moments of faith that shaped the mission: the preservation and propagation of preaching. Along the way came many trials and turning points, closed doors that became new directions, cyberattacks that threatened to undo the work, and seasons of deep discouragement met by unmistakable provision. From unexpected gifts that made The Vault possible to the surprising arrival of advanced hardware and expertise at just the right time, the story is filled with evidence of divine help at every step. This is not the story of a website but of a work far greater. The story is a testimony to the faithfulness of God who has ensured that the voice of preaching will not be silenced, and that its witness will reach the nations until the end of the age.",
    duration: "22:21"
  },
  {
    type: "documentary",
    name: "Puritan: All of Life to the Glory of God",
    url: "https://youtu.be/3VeYO6hmKGs?is=GD2n9iFnbcvg23Eo",
    cost: "Free",
    tags: ["Puritan", "Biography", "Church History"],
    briefDescription: "Explores the history, theology, and ongoing legacy of the Puritans.",
    description:
      "\"Haunted by the fear that someone, somewhere, may be happy.\" That's the Puritan reputation. But to what extent is that reputation deserved? Drawing on the latest research and featuring interviews with some of the most celebrated scholars in the field, this beautiful and atmospheric new documentary takes us from the birth of Puritanism to its influence in the present day.",
    duration: "2:03:16"
  },
  {
    type: "documentary",
    name: "The Making of Missionary: John Paton (Vanuatu)",
    url: "https://www.youtube.com/watch?v=cEsUoazIYz8",
    cost: "Free",
    tags: ["Missionary", "Biography", "Church History", "New Zealand"],
    briefDescription: "Behind-the-scenes travelogue tracking missionary John G. Paton's footsteps in Vanuatu.",
    description:
      "A behind-the-scenes look at the filming team's journey through Vanuatu to explore historic locations and document the life, sacrifice, and lasting legacy of missionary John G. Paton.",
    duration: "15:50"
  },
  {
    type: "docuseries",
    name: "EPIC (by Tim Challies)",
    director: ["Tim Challies", "Stephen McCaskell"],
    cost: "Free",
    tags: ["Overview", "Bible Story", "Theology", "Church History", "Global", "Mission", "Missions", "World Missions", "World Mission", "World", "Nations"],
    briefDescription: "A global travelogue telling church history through 33 historical artifacts.",
    description: 
      "Tim Challies travels to twenty-four countries, directed by Stephen McCaskell, offers an immersive travelogue introducing you to thirty-three key objects that help tell the history of Christianity.",
    episodes: [
      {
        title: "Episode 1: Israel & Italy",
        url: "https://www.youtube.com/watch?v=DHxDjexosvU",
        duration: "25:00",
        tags: ["Early Church", "Rome", "Israel", "Church History", "Italy", "Catholicism"],
        cost: "Free",
        briefDescription: "Tracing Christian origins from ancient Israel to the heart of Rome."
      },
      {
        title: "Episode 2: England",
        url: "https://www.youtube.com/watch?v=BxJP4rKVY8M",
        duration: "24:54",
        tags: ["Reformation", "Church History", "England"],
        cost: "Free",
        briefDescription: "Exploring artifacts of the English Reformation and early English Bibles."
      },
      {
        title: "Episode 3: Ireland & Scotland",
        url: "https://youtu.be/s16cuOPa0xQ?si=R1wxf1PkjSSAu5FE",
        duration: "25:03",
        tags: ["Celtic Church", "Reformation", "Ireland", "Scotland"],
        cost: "Free",
        briefDescription: "Discovering Celtic church roots and Scottish Covenanter history."
      },
      {
        title: "Episode 4: France & Switzerland",
        url: "https://youtu.be/ywyxRw-_8dE?si=E0rG2QCNoVKop1r_",
        duration: "21:40",
        tags: ["Reformers", "Reformation", "France", "Switzerland"],
        cost: "Free",
        briefDescription: "Uncovering Continental Reformation history in Geneva and France."
      },
      {
        title: "Episode 5: Germany & Ecuador",
        url: "https://youtu.be/H55P2zOt3gg?si=bkWYxvfyOgMyQ1xK",
        duration: "20:52",
        tags: ["Luther", "Reformation", "Mission", "Ecuador"],
        cost: "Free",
        briefDescription: "Connecting Luther's Wittenberg legacy with 20th-century missions in Ecuador."
      },
      {
        title: "Episode 6: Australia & New Zealand",
        url: "https://youtu.be/hdAk7QHW-d0?si=93eKEL4vvME3LRxC",
        duration: "23:18",
        tags: ["Mission", "Modern Church", "Australia", "New Zealand"],
        cost: "Free",
        briefDescription: "Investigating gospel advancement and pioneer missions down under."
      },
      {
        title: "Episode 7: Zambia & Zimbabwe",
        url: "https://youtu.be/Oi2BcTeuyoA?si=8XqjrIG-cxZFtiqE",
        duration: "24:04",
        tags: ["Mission", "Africa", "David Livingstone", "Zambia", "Zimbabwe"],
        cost: "Free",
        briefDescription: "Following David Livingstone's footprint and missionary expansion in Africa."
      },
      {
        title: "Episode 8: India",
        url: "https://youtu.be/XMCZ-mHb3II?si=RDe6l8P2yuzdOpxp",
        duration: "26:14",
        tags: ["Mission", "Church History", "India", "Amy Carmichael"],
        cost: "Free",
        briefDescription: "Examining Amy Carmichael and William Carey's legacies in India."
      },
      {
        title: "Episode 9: Asia (China, Philippines & South Korea)",
        url: "https://youtu.be/kBkZrCpl4AI?si=iOJGykwZS0APefkv",
        duration: "20:21",
        tags: ["Asia", "Mission", "China", "Philippines", "South Korea"],
        cost: "Free",
        briefDescription: "Witnessing rapid church growth and missionary endurance across Asia."
      },
      {
        title: "Episode 10: USA",
        url: "https://youtu.be/8t7mlf71s98?si=HT2L2mY5E4dUAk-g",
        duration: "25:48",
        tags: ["Modern Church", "Church History", "USA"],
        cost: "Free",
        briefDescription: "Looking at pivotal objects that defined American church history."
      }
    ]
  },
  {
    type: "docuseries",
    name: "From the Rising of the Sun",
    director: ["Tim Challies", "Stephen McCaskell", "Tim Keesee"],
    cost: "Partial Free",
    tags: ["Overview", "Global", "Worship", "Mission", "Missions", "World Missions", "World Mission", "World", "Nations"],
    hint: "Buy the book \"From the rising of the Sun\", by Tim Keesee and Tim Challies, and get a free code to watch the series.",
    briefDescription: "A worldwide journey highlighting biblical Christian worship across diverse cultures.",
    description:
      "In From the Rising of the Sun, Tim Challies and Tim Keesee take you on a journey to eleven locations spanning the globe, witnessing different expressions of Christian worship that are consistent with Scripture but faithful to the local language, customs, and culture. Each video session begins with a travelogue narrative that unfolds the experience of worship in a country or region and concludes with a biblical study on a particular aspect of worship or cross-cultural engagement, showing how each worship services is unique yet distinctly biblical.\"Follow the sun\" through a day of worship, beginning in Fiji and ending in the Aleutian Islands. Join in worship in the remote jungles of Cambodia, the bustling metropolises of Korea and Australia, the plains of Zambia, the Andean heights of Chile, and many other places. Meet fellow brothers and sisters in Christ and experience how they worship and serve God in the places he has ordained for them. This is a taste of Revelation 5:9 as we, along with our brothers and sisters worldwide, worship the One who by his blood has \"ransomed people for God from every tribe and language and people and nation.\"",
    disclaimer: "In order to watch this docu-series, you will need to create an account/ sign in on the Study Gateway platform. I do not promote all that is on this platorm, but it happens to be where the docu-series is available for watching.",
    episodes: [
      {
        title: "Episode 0: Intro",
        url: "https://watch.studygateway.com/from-the-rising-of-the-sun-tim-challies-and-tim-keesee/videos/ftrots-intro-master-v1",
        duration: "8:00",
        cost: "Free",
        briefDescription: "An introduction to tracking global worship around the world."
      },
      {
        title: "Episode 1: Lautoka, Fiji (From the Rising of the Sun)",
        url: "https://watch.studygateway.com/from-the-rising-of-the-sun-tim-challies-and-tim-keesee/videos/ftrots-episode1-fiji-master-v1",
        duration: "23:04",
        tags: ["Fiji", "Tonga"],
        cost: "Paid",
        briefDescription: "Observing faithful worship in Fiji and the Pacific islands."
      },
      {
        title: "S2: Sydney, Australia (From the Rising of the Sun)",
        url: "https://watch.studygateway.com/from-the-rising-of-the-sun-tim-challies-and-tim-keesee/videos/ftrots-episode2-australia-master-v1",
        duration: "22:46",
        cost: "Paid",
        tags: ["Sydney", "Australia"],
        briefDescription: "Experiencing church life and ministry in urban Australia."
      },
      {
        title: "S3: Seoul, South Korea (From the Rising of the Sun)",
        url: "https://watch.studygateway.com/from-the-rising-of-the-sun-tim-challies-and-tim-keesee/videos/ftrots-episode3-korea-master-v1",
        duration: "17:37",
        cost: "Paid",
        tags: ["Seoul", "South Korea"],
        briefDescription: "Worship with believers in the bustling metropolis of Seoul."
      },
      {
        title: "S4: Sakrieng Village, Cambodia (From the Rising of the Sun)",
        url: "https://watch.studygateway.com/from-the-rising-of-the-sun-tim-challies-and-tim-keesee/videos/ftrots-episode4-cambodia-master-v1-1",
        duration: "19:31",
        tags: ["Cambodia"],
        cost: "Paid",
        briefDescription: "A look at remote village worship in the jungles of Cambodia."
      },
      {
        title: "S5: Kakolo, Zambia (From the Rising of the Sun)",
        url: "https://watch.studygateway.com/from-the-rising-of-the-sun-tim-challies-and-tim-keesee/videos/ftrots-episode5-zambia-master-v1",
        duration: "22:55",
        tags: ["Zambia"],
        cost: "Paid",
        briefDescription: "Joining African believers in corporate worship in Zambia."
      },
      {
        title: "S6: Rybnik, Poland (From the Rising of the Sun)",
        url: "https://watch.studygateway.com/from-the-rising-of-the-sun-tim-challies-and-tim-keesee/videos/ftrots-episode6-poland-master-v1",
        duration: "18:43",
        tags: ["Poland"],
        cost: "Paid",
        briefDescription: "Fellowship and local church worship in Rybnik, Poland."
      },
      {
        title: "S7: Casablanca, Morocco (From the Rising of the Sun)",
        url: "https://watch.studygateway.com/from-the-rising-of-the-sun-tim-challies-and-tim-keesee/videos/ftrots-episode7-morocco-master-v1-2",
        duration: "22:34",
        tags: ["Morocco"],
        cost: "Paid",
        briefDescription: "Christian worship and witness in North Africa."
      },
      {
        title: "S8: Recife, Brazil (From the Rising of the Sun)",
        url: "https://watch.studygateway.com/from-the-rising-of-the-sun-tim-challies-and-tim-keesee/videos/ftrots-episode8-brazil-master-v1-1-1",
        duration: "19:28",
        tags: ["Brazil"],
        cost: "Paid",
        briefDescription: "Gospel gathering and vibrant worship in Recife, Brazil."
      },
      {
        title: "S9: Villarrica, Chile (From the Rising of the Sun)",
        url: "https://watch.studygateway.com/from-the-rising-of-the-sun-tim-challies-and-tim-keesee/videos/ftrots-episode9-chile-master-v1-1",
        duration: "17:12",
        tags: ["Chile"],
        cost: "Paid",
        briefDescription: "Corporate worship set against the Andean heights of Chile."
      },
      {
        title: "S10: Mexico City, Mexico (From the Rising of the Sun)",
        url: "https://watch.studygateway.com/from-the-rising-of-the-sun-tim-challies-and-tim-keesee/videos/ftrots-episode10-mexico-master-v1-1",
        duration: "16:48",
        tags: ["Mexico"],
        cost: "Paid",
        briefDescription: "A local church gathering in the density of Mexico City."
      },
      {
        title: "S11: Unalaska, Alaska, United States (From the Rising of the Sun)",
        url: "https://watch.studygateway.com/from-the-rising-of-the-sun-tim-challies-and-tim-keesee/videos/ftrots-episode11-alaska-master-v1-1",
        duration: "20:37",
        tags: ["USA"],
        cost: "Paid",
        briefDescription: "Worship at the edge of the world in the Aleutian Islands."
      }
    ]
  },
  {
    type: "docuseries",
    name: "Missionary: Obeying the Great Commission",
    url: "https://www.missionary.com/docuseries",
    director: ["Brooks Buser", "Stephen McCaskell"],
    cost: "Partial Free",
    tags: ["Overview", "Mission", "Church History"],
    briefDescription: "A six-part series documenting key pioneer missionaries throughout church history.",
    description:
      "Experience the stories of the men and women who followed the Great Commission. The six-part docuseries tells the stories of William Tyndale, Hudson Taylor, Amy Carmichael, William Carey, David Livingstone, and John Paton",
    episodes: [
      {
        title: "Episode 1: William Tyndale: The Necessity of the Word",
        url: "https://youtu.be/CRAbG_u-nKo?si=u_w08MwnMkxnI_Wq",
        duration: "43:45",
        tags: ["Church History", "William Tyndale"],
        cost: "Free",
        briefDescription: "Tyndale's costly mission to translate and publish the English Bible.",
        description: "A continental manhunt, a shipwreck, and prison could not stop William Tyndale from giving the English speaking church its first English language Bible. 75 years before the authorization of the King James Version of the Bible, William Tyndale gave his life as a martyr so that Christians could read and understand God's word themselves."
      }
    ]
  },
  {
    type: "docuseries",
    name: "The Covenanter Story: A Banner Mini-series",
    url: "https://www.youtube.com/playlist?list=PLUNl3x537t5LS3jQ2bqaXuKYGt9P4VO6w",
    director: ["Banner of Truth"],
    cost: "Free",
    tags: ["Convenanters", "Church History", "Scotland", "Martyr", "Persecution"],
    briefDescription: "A four-part overview of the Scottish Covenanters told through four martyrs.",
    description: "A four-part introduction to the Scottish Covenanters, brought to life through the stories of four martyrs: James Guthrie, Hugh M'Kail, John Brown of Priesthill, and James Renwick.",
    episodes: [
      {
        title: "The Sure-footed Guthrie | The Covenanter Story, Part 1",
        url: "https://www.youtube.com/watch?v=V9HsIMGycyw&list=PLUNl3x537t5LS3jQ2bqaXuKYGt9P4VO6w&index=1",
        duration: "13:12",
        tags: ["Covenanters", "Church History", "James Guthrie"],
        cost: "Free",
        briefDescription: "The life and stand of Covenanter martyr James Guthrie.",
        description: "James Guthrie's life and witness would shape the Covenanter movement from that moment on, with great consequences for the Kirk and nation of Scotland…"
      },
      {
        title: "The Pentland Resistance | The Covenanter Story, Part 2",
        url: "https://www.youtube.com/watch?v=VUapiGHk3IM&list=PLUNl3x537t5LS3jQ2bqaXuKYGt9P4VO6w&index=2",
        duration: "15:09",
        tags: ["Covenanters", "Church History", "Civil Disobedience", "Pentland Rising", "Rullion Green", "Hugh M'Kail"],
        cost: "Free",
        briefDescription: "Persecution following the Pentland Rising and the witness of Hugh M'Kail.",
        description: "James Guthrie was dead—executed for his refusal to acknowledge the king's authority over the Kirk. Others like him were now in the government’s crosshairs. The king’s dragoons ranged across Scotland's Southwest, letting loose a campaign of terror which would have devastating consequences for the Covenanters…"
      },
      {
        title: "The John Brown of Priesthill | The Covenanter Story, Part 3",
        url: "https://www.youtube.com/watch?v=XapTHW4segA&list=PLUNl3x537t5LS3jQ2bqaXuKYGt9P4VO6w&index=3",
        duration: "10:22",
        tags: ["Covenanters", "Church & State", "Martyr","Persecution", "Persecuted Church", "Church History", "John Brown"],
        cost: "Free",
        briefDescription: "The tragic martyrdom of lay Covenanter John Brown during the Killing Time.",
        description: "The 1680s are known as \"the Killing Time\" in Scotland. The Crown, turning its full fury against the Covenanters, terrorised all who refused to fall into line, whether they were ordained ministers, or just ordinary lay-people. In this third instalment of The Covenanter Story we meet a Covenanting family from Ayrshire whose domestic joy and peace was brought to an abrupt end by the violence of James VII/II and his ambitious servants."
      },
      {
        title: "James Renwick | The Covenanter Story, Part 4",
        url: "https://www.youtube.com/watch?v=zKU3yC_8IaI&list=PLUNl3x537t5LS3jQ2bqaXuKYGt9P4VO6w&index=4",
        duration: "17:26",
        tags: ["Covenanters", "Church History", "Martyr", "Persecution", "James Renwick"],
        cost: "Free",
        briefDescription: "The ministry and execution of James Renwick, the last prominent Covenanter martyr.",
        description: "Facing relentless and bloody persecution, the Scottish Covenanters of the 1680s continued to entrust themselves to their faithful Saviour and King, the Lord Jesus Christ. Despite the risks, brave pastors continued to minister to Christ's 'scattered flock,' holding meetings in the moors at which believers were encouraged to stand fast under trial. In the final episode of our mini-series on the Covenanters, we meet one such pastor, whose courageous ministry was signally blessed by the Lord. James Renwick would lift high the Covenanting flag in desperate times, becoming the final prominent martyr to give his life for the cause of Christ's kingship in the Scottish Kirk"
      }
    ]
  }
];