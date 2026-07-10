
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
        progress: 2,
        lastRead: "2026-07-09"
    }

]

export default readings
