
export type Reading = {
  book: string;
  progress: number;
  lastRead: Date | string;
};
const readings : Reading[] = [
     {
         book: "Philemon",
         progress: 100,
         lastRead: "2026-06-18"
     },
     {
         book: "Jude",
         progress: 100,
         lastRead: "2026-06-19"
     },
     {
        book: "Exodus",
        progress: 3,
        lastRead: "2026-06-25"
    },
    {
        book: "Genesis",
        progress: 9,
        lastRead: "2026-07-28"
    },
    {
        book: "2 John",
        progress: 100,
        lastRead: "2026-07-31"
    },
    {
        book: "3 John",
        progress: 100,
        lastRead: "2026-07-31"
    },
    {
        book: "Psalms",
        progress: 0.5,
        lastRead: "2026-08-10"
    }
]

export default readings
