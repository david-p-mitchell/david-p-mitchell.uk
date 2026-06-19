
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
     }

]

export default readings
