export class Project {
  name!: string;
  company?: "VerticalLeap" | "Halliburton" | "VerticalLeap / Gain" | "GoalsFootball" | null | undefined;
  volunteerCompany?: string;
  tech!: string[];
  heading!: string;
  subheading!: string;
  summary!: string;
  dates!: string;
  iconSize!: number;
  toShow!: boolean;
  url?: string;

  constructor(data: Omit<Project, "employed">) {
    Object.assign(this, data);
  }

  get employed(): boolean {
    return this.company != null;
  }
}

// 👇 Extract the type of company for Vue props
export type ProjectCompany = Project["company"];