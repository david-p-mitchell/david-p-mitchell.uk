
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
     }
]

export default readings
