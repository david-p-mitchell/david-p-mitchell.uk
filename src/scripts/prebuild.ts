import fs from "node:fs/promises";
import path from "node:path";
import { getMonthlyCommitBreakdown } from "../../src/lib/github";

async function buildCommitData() {
  
  const token = 
  (typeof import.meta !== "undefined" && import.meta.env?.GITHUB_TOKEN) || 
  process.env.GITHUB_TOKEN;
  const data = await getMonthlyCommitBreakdown();
  
  const outputPath = path.resolve(process.cwd(), "src/data/commits.json");
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(data, null, 2));
}

buildCommitData();