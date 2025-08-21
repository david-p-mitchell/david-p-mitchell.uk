export class Project {
  name!: string;
  company?: "VL" | "Halliburton" | "VLGain" | null | undefined;
  tech!: string[];
  heading!: string;
  subheading!: string;
  summary!: string;
  dates!: string;
  iconSize!: number;
  toShow!: boolean;

  constructor(data: Omit<Project, "employed">) {
    Object.assign(this, data);
  }

  get employed(): boolean {
    return this.company != null;
  }
}

// 👇 Extract the type of company for Vue props
export type ProjectCompany = Project["company"];