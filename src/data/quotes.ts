export type Quote = {
    id: number;
  text: string;
  author: string;
  imgAuthor ?: string;
    source?: string;
    years?: string;
    tags?: string[];
};
export const quotes: Quote[] = [
    {
        id: 1,
        text: "Jesus Christ went more willingly to the cross, than we do to the throne of grace.",
        author: "Jonathan Watson",
        source: "Heaven Taken By Storm",
        years: "1620-1686",
        tags: ["grace", "cross", "salvation", "prayer"]
    },
    {
        id: 2,
        text: "God is too good to be unkind and He is too wise to be mistaken. And when we cannot trace His hand, we must trust His heart.",
        author: "Charles Spurgeon",
        imgAuthor: "https://images.gr-assets.com/authors/1283124007p8/2876959.jpg",
        years: "1834–1892",
        tags: ["God", "wisdom", "trust"]
    },
    {
        id: 3,
        text: "God comes down to us by his Spirit, and we go up to him by prayer.",
        author: "Thomas Watson",
        source: "The Ten Commandments",
        years: "1620-1686",
        tags: ["God", "spirit", "prayer"]
    },
    {
        id: 4,
        text: "If you set your love on worldly things, they will not satisfy.",
        author: "Thomas Watson",
        source: "All Things for Good",
        years: "1620-1686",
        tags: ["God", "love", "worldly"]
    },
    {
        id: 5,
        text: "Every time we draw our breath—we suck in mercy!",
        author: "Thomas Watson",
        source: "The Ten Commandments",
        years: "1620-1686",
        tags: ["God", "mercy", "grace"]
    },
    {
        id: 6,
        text: "What is it to glorify God? Glorifying God consists in four things:  1. Appreciation.\t 2. Adoration.\t 3. Affection.\t 4. Subjection.\t   This is the yearly rent we pay to the crown of heaven.",
        author: "Thomas Watson",
        source: "A Body of Divinity: Contained in Sermons upon the Westminster Assembly's Catechism",
        years: "1620-1686",
        tags: ["God", "glorify", "worship"]
    },
    {
        id: 7,
        text: "Obedience without fervency, is like a sacrifice without fire. Why should not our obedience be lively and fervent? God deserves the flower and strength of our affections.",
        author: "Thomas Watson",
        source: "The Ten Commandments",
        years: "1620-1686",
        tags: ["God", "mercy", "grace"]
    },
    { 
        id:8,
        text: " The goal of theology is the worship of God. The posture of theology is on one’s knees. The mode of theology is repentance.",
        author: "Sinclair Ferguson",
        tags: ["Theology"]
    
];