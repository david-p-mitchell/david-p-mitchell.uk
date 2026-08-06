export type NodeId =
  | "identifiedSin"
  | "confidenceSaved"
  | "sinSeriousDeepRooted"
  | "easierToSinThanRight"
  | "willfulRebellion"
  | "godlySorrow"
  | "desperatelyWantStop"
  | "desireGodGlorified"
  | "natureAmplifies"
  | "knowOccasions"
  | "canIdentifyPatterns"
  | "battleImmediately"
  | "meditatedScripture"
  | "expectGodVictory"
  | "reflect_identifyEnemy"
  | "reflect_considerSalvation"
  | "reflect_beVigilant"
  | "reflect_lookToCross"
  | "reflect_onlyAshamed"
  | "reflect_longForIt"
  | "reflect_notAnExcuse"
  | "reflect_watchSoberly"
  | "reflect_greatPatterns"
  | "reflect_battleModeNow"
  | "reflect_searchGlory"
  | "reflect_trustGodFaithful";

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
}

export type FlowNode = QuestionNode | ReflectionNode;

export const START_NODE: NodeId = "identifiedSin";

export const flow: Record<NodeId, FlowNode> = {
  identifiedSin: {
    type: "question",
    id: "identifiedSin",
    text: "Have I identified the sin I want to put to death?",
    yes: "confidenceSaved",
    no: "reflect_identifyEnemy",
  },

  reflect_identifyEnemy: {
    type: "reflection",
    id: "reflect_identifyEnemy",
    text: "In order to defeat sin, I need to understand who my enemy is. What am I doing that is in rebellion against God?",
    next: "identifiedSin",
  },

  confidenceSaved: {
    type: "question",
    id: "confidenceSaved",
    text: "Do I have confidence that I have been saved?",
    yes: "sinSeriousDeepRooted",
    no: "reflect_considerSalvation",
  },

  reflect_considerSalvation: {
    type: "reflection",
    id: "reflect_considerSalvation",
    text: "I need to seriously consider my salvation. Am I trusting in the finished work of Christ to forgive me, or am I putting more stock in the things I do? There should be evidence of fruit in my life. If I am truly saved, I will not be habitually sinning. I will have had some victory.",
    next: "confidenceSaved",
    scriptureReferences: ["Romans 10:9", "Ephesians 2:8-9"]
  },

  sinSeriousDeepRooted: {
    type: "question",
    id: "sinSeriousDeepRooted",
    text: "Is my sin serious or deep rooted?",
    yes: "easierToSinThanRight",
    no: "willfulRebellion",
  },

  easierToSinThanRight: {
    type: "question",
    id: "easierToSinThanRight",
    text: "Is it consistently easier to sin than do what's right?",
    yes: "willfulRebellion",
    no: "reflect_beVigilant",
  },

  reflect_beVigilant: {
    type: "reflection",
    id: "reflect_beVigilant",
    text: "I will need to be especially vigilant and cry out to God with an extra measure of desperate faith.",
    next: "willfulRebellion",
  },

  willfulRebellion: {
    type: "question",
    id: "willfulRebellion",
    text: "Do I see my sin as a willful act of rebellion against God?",
    yes: "godlySorrow",
    no: "reflect_lookToCross",
  },

  reflect_lookToCross: {
    type: "reflection",
    id: "reflect_lookToCross",
    text: "I need to look to the cross and see what my sin has actually cost. I need to be heartbroken that the relationship between God and me has been severed. I need to stop minimizing and excusing my sin and be grieved that God has been offended by sin.",
    next: "willfulRebellion",
  },

  godlySorrow: {
    type: "question",
    id: "godlySorrow",
    text: "Have I felt the weight of my sin against God? Do I have a godly sorrow?",
    yes: "desperatelyWantStop",
    no: "reflect_onlyAshamed",
  },

  reflect_onlyAshamed: {
    type: "reflection",
    id: "reflect_onlyAshamed",
    text: "I need to consider that I am only concerned about my sin because of the shame it causes me and the consequences that come from my actions.",
    next: "godlySorrow",
  },

  desperatelyWantStop: {
    type: "question",
    id: "desperatelyWantStop",
    text: "Do I desperately want to stop sinning?",
    yes: "desireGodGlorified",
    no: "reflect_longForIt",
  },

  desireGodGlorified: {
    type: "question",
    id: "desireGodGlorified",
    text: "Do I desire God to be glorified in me?",
    yes: "natureAmplifies",
    no: "reflect_longForIt",
  },

  reflect_longForIt: {
    type: "reflection",
    id: "reflect_longForIt",
    text: "I need to long for it. Pant for it. Cry out for it. Desire it. What am I putting in the place of God that I want to glorify instead? I need to find out what I am allowing to take God's place and steal his glory.",
    next: "desperatelyWantStop",
  },

  natureAmplifies: {
    type: "question",
    id: "natureAmplifies",
    text: "Is there anything in my nature that amplifies or drives me to this sin?",
    yes: "reflect_notAnExcuse",
    no: "knowOccasions",
  },

  reflect_notAnExcuse: {
    type: "reflection",
    id: "reflect_notAnExcuse",
    text: "I need to understand that submitting to sin I am prone to is never an excuse. This should be further proof I can't depend on myself and need to rely fully on God. If I am more apt to sin in a specific area, I need to be all the more vigilant in that area.",
    next: "knowOccasions",
  },

  knowOccasions: {
    type: "question",
    id: "knowOccasions",
    text: "Do I know the occasions and situations when I am most tempted by this sin?",
    yes: "battleImmediately",
    no: "canIdentifyPatterns",
  },
    canIdentifyPatterns: {
    type: "question",
    id: "canIdentifyPatterns",
    text: "Can I identify patterns that lead me to this sin?",
    yes: "reflect_greatPatterns",
    no: "reflect_watchSoberly",
  },

  reflect_greatPatterns: {
    type: "reflection",
    id: "reflect_greatPatterns",
    text: "Great! Identifying patterns that precede sin is a way to avoid certain places, practices, and people so I will not be as apt to commit sin.",
    next: "battleImmediately",
  },

  reflect_watchSoberly: {
    type: "reflection",
    id: "reflect_watchSoberly",
    text: "I need to be watching soberly for behaviors, moods, places, and people that lead me to sin. I need the help of friends and pastors to identify these patterns.",
    next: "knowOccasions",
  },

  battleImmediately: {
    type: "question",
    id: "battleImmediately",
    text: "Do I battle my sin immediately?",
    yes: "meditatedScripture",
    no: "reflect_battleModeNow",
  },

  reflect_battleModeNow: {
    type: "reflection",
    id: "reflect_battleModeNow",
    text: "The very second I sense being tempted by sin, I need to enter into battle mode. I cannot allow myself to toy with or revel in sin. Not even a little.",
    next: "knowOccasions",
  },

  meditatedScripture: {
    type: "question",
    id: "meditatedScripture",
    text: "Have I meditated on Scripture?",
    yes: "expectGodVictory",
    no: "reflect_searchGlory",
  },

  reflect_searchGlory: {
    type: "reflection",
    id: "reflect_searchGlory",
    text: "I need to search out the glory of God and humble myself before him. I cannot think high thoughts of God and not be humbled about my sin.",
    next: "meditatedScripture",
  },

  expectGodVictory: {
    type: "question",
    id: "expectGodVictory",
    text: "Do I expect God to give me victory?",
    yes: "identifiedSin",
    no: "reflect_trustGodFaithful",
  },

  reflect_trustGodFaithful: {
    type: "reflection",
    id: "reflect_trustGodFaithful",
    text: "God has promised us victory over sin. He has provided every necessary resource to give me peace. I need to trust that God will be faithful.",
    next: "expectGodVictory",
  },
};

export const shortLabels: Partial<Record<NodeId, string>> = {
  identifiedSin: "Identify the sin",
  confidenceSaved: "Confidence of salvation",
  sinSeriousDeepRooted: "Serious / deep rooted?",
  easierToSinThanRight: "Easier to sin?",
  willfulRebellion: "Willful rebellion?",
  godlySorrow: "Godly sorrow?",
  desperatelyWantStop: "Desperate to stop?",
  desireGodGlorified: "Desire God glorified?",
  natureAmplifies: "Nature amplifies it?",
  knowOccasions: "Know the occasions?",
  canIdentifyPatterns: "Identify patterns?",
  battleImmediately: "Battle immediately?",
  meditatedScripture: "Meditated on Scripture?",
  expectGodVictory: "Expect God's victory?",
};