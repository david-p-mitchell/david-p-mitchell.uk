
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
        progress: 1,
        lastRead: "2026-06-22"
    }

]

export default readings
