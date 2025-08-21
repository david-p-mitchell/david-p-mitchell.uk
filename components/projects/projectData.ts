import { Project } from '~/types/Project';
const halliburtonIconSize = 70;
const vlDevOpsIcons = 50;
const vlToolsIcons = 45;
const apolloInsightsIcons = 30;
const enonIcons = 40;
export const projects: Project[] = [
    new Project({ 
    name: 'Enon Website', 
    tech: ['Nuxt', 'Css', 'HtmlFive', 'Markdown', 'Typescript', 'Vue', 'Git'], 
    heading:"Enon Baptist Church",
    subheading:'New Website',
    summary:'Initiated and developed a new website for Enon Baptist Church, focusing on modern and responsive design, continuous development and improving user experience.',
    dates:'September 2024 - Present',
    iconSize: enonIcons,
    toShow: false
  }),
  new Project({ 
    name: 'VL Tools', 
    company:'VL', 
    tech: ['Aws', 'Markdown', 'Css', 'CSharp', 'Git', 'HtmlFive', 'Javascript', 'Json', 'Typescript', 'NextJs', 'Nuxt', 'React'], 
    heading:"VL Tools",
    subheading:'Standalone Tools',
    summary:'Developed endpoints and refactored code to improve performance and reliability. Updated packages for tools.',
    dates:'June 2023 - June 2025',
    iconSize: vlToolsIcons,
    toShow: true
  }),
  new Project({ 
    name: 'VL DevOps', 
    company:'VL', 
    tech: ['Aws', 'Bash', 'Docker', 'Git', 'Markdown', 'YAML' ], 
    heading:"VL Dev Ops",
    subheading:'Infrastructure and DevOps',
    summary:'Created and oversaw infrastructure for the new tools platforms, including CI/CD pipelines, monitoring, and deployment strategies.',
    dates:'June 2023 - June 2025',
    iconSize: vlDevOpsIcons,
    toShow: true
  }),
  new Project({ 
    name: 'Apollo Insights', 
    company:'VL', 
    tech: ['Aws', 'CSharp', 'Css','Git', 'HtmlFive', 'Javascript', 'JQuery', 'Json', 'Bash', 'RequireJs', 'SQL', 'NodeJs', 'Vue', 'DotNet', 'DotNetCore', 'Docker', 'XML'], 
    heading:"Apollo Insights",
    subheading:'A search marketing platform',
    summary:'Maintaining and building a comprehensive platform with data and analytics dashboards for digital search data and providing actionable insights.',
    dates:'January 2017 - June 2023',
    iconSize: apolloInsightsIcons,
    toShow: true
  }),
  new Project({ 
    name: 'Halliburton', 
    company:'Halliburton', 
    tech: ['DotNet', 'SQL', 'CSharp'], 
    heading:"Sperry Drilling (Halliburton)",
    subheading:'MWD Tool Software Development',
    summary:'Contributed to the development and testing of high-performance Measurement While Drilling (MWD) tools for extreme downhole environments.',
    dates:'September 2014 - August 2015',
    iconSize: halliburtonIconSize,
    toShow: true
  })
  
];