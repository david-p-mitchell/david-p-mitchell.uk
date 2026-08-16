export type NodeId =
  | "directWorshipTest"
  | "neighborRestraintTest"
  | "neighborLaborCategory"
  | "restAndRenewalTest"
  | "soulGoodTest"
  | "conscienceLibertyTest"
  | "reflect_prioritizeWorship"
  | "reflect_neighborRest"
  | "reflect_evaluateRest"
  | "reflect_soulGood" 
  | "reflect_conscienceFaith"
  | "allDayTest"
  | "permittedActivity"
  | "activityNotRecommended"; // Added terminal node for clarity

export interface QuestionNode {
  type: "question";
  id: NodeId;
  text: string;
  yes: NodeId;
  no: NodeId;
}

export interface ReflectionNode {
  type: "reflection";
  id: NodeId;
  text: string;
  next: NodeId;
  scriptureReferences?: string[];
  recommendations?: string[];
}

export type EndNode = (QuestionNode | ReflectionNode) & {
  isEnd:boolean,
}

export type FlowNode = EndNode;

export const START_NODE: NodeId = "directWorshipTest";

export const flow: Record<NodeId, FlowNode> = {
  directWorshipTest: {
    type: "question",
    id: "directWorshipTest",
    text: "Does this activity prevent you or your household from gathering with your local church for corporate worship?",
    yes: "reflect_prioritizeWorship",
    no: "neighborRestraintTest",
    isEnd:false
  },

  reflect_prioritizeWorship: {
    type: "reflection",
    id: "reflect_prioritizeWorship",
    text: "Corporate worship is the central anchor of the Lord's Day. Re-evaluate your schedule or defer this activity to Saturday or Monday to safeguard gathering with the saints.",
    next: "directWorshipTest", 
    scriptureReferences: ["Hebrews 10:24-25", "Psalm 122:1"],
    isEnd:true
  },

  neighborRestraintTest: {
    type: "question",
    id: "neighborRestraintTest",
    text: "Does this activity require, force, or incentivize someone else to perform non-essential/unnecessary work on the Lord's Day?",
    yes: "neighborLaborCategory",
    no: "restAndRenewalTest",
    isEnd:false
  },

  neighborLaborCategory: {
    type: "question",
    id: "neighborLaborCategory",
    text: "Is the worker's labor a genuine work of necessity (e.g., emergency medical, public safety, utilities) or mercy (e.g., caregiving)?",
    yes: "restAndRenewalTest",
    no: "reflect_neighborRest",
    isEnd:false
  },

  reflect_neighborRest: {
    type: "reflection",
    id: "reflect_neighborRest",
    text: "The Fourth Commandment instructs us to protect the rest of servants, strangers, and neighbors. Avoid engaging in non-essential commercial transactions that deprive others of Lord's Day rest.",
    next: "activityNotRecommended",
    scriptureReferences: ["Exodus 20:10", "Nehemiah 13:15-18", "Matthew 12:11-12"],
    isEnd:false
  },

  restAndRenewalTest: {
    type: "question",
    id: "restAndRenewalTest",
    text: "Does this activity import weekday stress, commercial anxiety, or heavy secular distraction into your soul or home?",
    yes: "reflect_evaluateRest",
    no: "soulGoodTest", // Proceeds to the positive check
    isEnd:false
  },

  soulGoodTest: {
    type: "question",
    id: "soulGoodTest",
    text: "Does this activity actively do your soul good—either by cultivating holy delight, physical refreshment, family connection, or works of mercy?",
    yes: "conscienceLibertyTest",
    no: "reflect_soulGood",
    isEnd:false
  },

  reflect_soulGood: {
    type: "reflection",
    id: "reflect_soulGood",
    text: "The Lord's Day is intended as a 'delight' (Isaiah 58:13). While an activity may not be strictly sinful, aimless or empty distractions can rob your soul of true Sabbath rest. Consider replacing this with an activity that actively restores your body or draws your heart toward God.",
    next: "conscienceLibertyTest", // Or "conscienceLibertyTest" depending on how strict/advisory you want this node to be
    scriptureReferences: ["Isaiah 58:13-14", "Psalm 92:1-4", "1 Timothy 6:17"],
    isEnd:false
  },

  reflect_evaluateRest: {
    type: "reflection",
    id: "reflect_evaluateRest",
    text: "The Lord's Day is designed for physical refreshment and spiritual delight. Consider replacing high-stress tasks with activities that cultivate peace and family connection.",
    next: "directWorshipTest",
    scriptureReferences: ["Genesis 2:2-3", "Isaiah 58:13-14"],
    isEnd:true,
    recommendations: ["Creation Rest: Quiet park visits, nature walks, or backyard play that don't involve paid admission or commercial staff, and don't make the activity the main part of the day.",
      "Soul Rest: Why not read a some good Christian material to refresh your soul and your delight in the Lord who saved you.",
      "Works of Mercy: Bringing baked goods to an elderly neighbor, visiting family or other Christians, or let the kids making cards for sick church members.",
      "Special Sunday-Only Privileges: Reserving special treats, games, or audio dramas (e.g., historical missionary stories or Christian allegories) exclusively for Sunday afternoons."
    ]
  },

  conscienceLibertyTest: {
    type: "question",
    id: "conscienceLibertyTest",
    text: "Can you engage in this activity in faith, thanking God for it, without violating your conscience or causing a weaker brother to stumble?",
    yes: "allDayTest",
    no: "reflect_conscienceFaith",
    isEnd:false
  },

  allDayTest: {
    type: "question",
    id: "allDayTest",
    text: "Can you engage in this activity, without it negatively affecting the rest of the Lord's Day and if the church meets in the evening make you stumble in being properly engaged and attentive for the meeting?",
    yes: "permittedActivity",
    no: "reflect_conscienceFaith",
    isEnd:false
  },

  reflect_conscienceFaith: {
    type: "reflection",
    id: "reflect_conscienceFaith",
    text: "Whatever does not proceed from faith is sin. If you feel unresolved guilt or know it will cause unnecessary offense to others, step back out of love.",
    next: "directWorshipTest",
    scriptureReferences: ["Romans 14:5-6", "Romans 14:22-23", "1 Corinthians 10:23-24"],
    isEnd:true
  },

  permittedActivity: {
    type: "reflection",
    id: "permittedActivity",
    text: "This activity aligns with the principles of Lord's Day stewardship. Enjoy it in Christian liberty, giving thanks to God!",
    next: "directWorshipTest", // Terminal state
    scriptureReferences: ["Colossians 3:17", "1 Timothy 4:4-5"],
    isEnd:true
  },

  activityNotRecommended: {
    type: "reflection",
    id: "activityNotRecommended",
    text: "This activity may conflict with Lord's Day rest, worship, or Christian charity. Consider rescheduling or setting it aside.",
    next: "directWorshipTest", // Terminal state
    isEnd: true
  },
};