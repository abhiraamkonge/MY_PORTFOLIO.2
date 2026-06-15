/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Skill, Project, Experience } from "./types";

export const DEV_INFO = {
  name: "ABHIRAM KONGE",
  title: "Full Stack Developer",
  tagline: "Unlocking logical architectures & cyber frontiers through the power of full-stack engineering.",
  email: "abhiraamkonge005@gmail.com",
  phone: "+91 6304686550",
  location: "Kurnool, Andhra Pradesh, India",
  linkedin: "linkedin.com/in/abhiram-konge",
  github: "github.com/abhiram-konge",
  summary: "Full Stack Developer with a B.Tech in Computer Science Engineering and hands-on experience building end-to-end web applications using Python, Django, Flask, HTML5, CSS3, and JavaScript. Adept at designing optimized databases, building responsive client dashboards, and implementing secure zero-trust network protocols.",
};

export const SKILLS_LIST: Skill[] = [
  {
    name: "Python & Django",
    category: "framework",
    level: 90,
    iconClass: "🧠",
    description: "Architecting backend models, role-based authentication layers, and secure RESTful routing structures.",
    alienForm: "Brainstorm",
    alienPowerDesc: "Fires massive synapses of hyper-intelligent logic, designing high-voltage web frameworks that compute databases instantly."
  },
  {
    name: "Flask & APIs",
    category: "framework",
    level: 80,
    iconClass: "🧪",
    description: "Developing clean microservices, custom routing schemas, and dynamic JSON response pipelines.",
    alienForm: "Grey Matter",
    alienPowerDesc: "Tiny but incredibly precise. Calculates clean architectures, maps complex routes, and resolves edge cases seamlessly."
  },
  {
    name: "HTML5 & CSS3",
    category: "language",
    level: 95,
    iconClass: "🎨",
    description: "Drafting visually gorgeous, desktop-first, mobile-responsive fluid interfaces using customized layouts.",
    alienForm: "Heatblast",
    alienPowerDesc: "Controls the visual fire. Moulds molten styles and blazing colors into a responsive, high-contrast, eye-catching HUD layouts."
  },
  {
    name: "JavaScript",
    category: "language",
    level: 85,
    iconClass: "⚡",
    description: "Integrating reactive DOM mechanics, scroll-triggered animations, interactive HUD engines, and Web Audio synths.",
    alienForm: "XLR8",
    alienPowerDesc: "Lightning-fast computational speed. Animates transitions, loops scripts, and re-renders components in the blink of an eye."
  },
  {
    name: "MySQL & SQLite",
    category: "database",
    level: 85,
    iconClass: "💎",
    description: "Designing normalized relational schemas, custom join queries, and indices optimized for lightning sub-200ms retrievals.",
    alienForm: "Diamondhead",
    alienPowerDesc: "Impenetrable structural integrity. Crystallizes highly organized datasets into rigid, secure structures that never crack."
  },
  {
    name: "C & C++",
    category: "language",
    level: 75,
    iconClass: "⚙️",
    description: "Writing compiled foundational algorithms, memory-conscious data structures, and optimal logical queries.",
    alienForm: "Four Arms",
    alienPowerDesc: "Direct raw mathematical power. Pounds complex algorithms into direct machine representation with brute-force processing speed."
  },
  {
    name: "Git & Version Control",
    category: "tool",
    level: 85,
    iconClass: "🔧",
    description: "Managing feature branches, merge pipelines, conflict resolution, and deployment tracking matrices.",
    alienForm: "Upgrade",
    alienPowerDesc: "Merges with technological layers. Infuses repositories, refactors commits, and automates CI/CD deployment channels with cyber-tech precision."
  },
  {
    name: "Cyber & Cloud Security",
    category: "other",
    level: 80,
    iconClass: "🛡️",
    description: "Establishing Zero-Trust Cloud frameworks, secure sessions, password salting/hashing, and authorization shields.",
    alienForm: "Ghostfreak",
    alienPowerDesc: "Intangible defense mechanisms. Shrouds routes from malicious invaders, making system logins completely secure and invisible to exploiters."
  }
];

export const PROJECTS_LIST: Project[] = [
  {
    id: "proj-1",
    title: "Smart Campus Placement System",
    slug: "smart-campus-placement",
    subtitle: "Enterprise Recruitment Lifecycle Platform",
    techStack: ["Django", "Python", "MySQL", "HTML5", "CSS3", "JavaScript", "Git"],
    duration: "2024",
    description: [
      "Digitized the entire campus recruitment lifecycle, eliminating 100% of manual paper-based coordination across 3 distinct roles (Students, Placement Officers, Recruiters).",
      "Engineered secure role-based access controls and custom session management shielding potential applicant pipelines."
    ],
    achievements: [
      "Designed and optimized a relational MySQL database schema with 8+ tables containing resume storage, candidate lists, and schedules.",
      "Reduced placement coordinator workload by an estimated 60% through custom matching algorithms filtering eligibility criteria.",
      "Delivered a beautifully fluid, fully responsive dashboard system tested with over 200 users."
    ],
    codeName: "COMPILER_UPGRADE"
  },
  {
    id: "proj-2",
    title: "Personal Expense Tracker Web App",
    slug: "expense-tracker",
    subtitle: "Analytical Financial Management Dashboard",
    techStack: ["Flask", "Python", "SQLite", "HTML5", "CSS3", "JavaScript", "Chart.js"],
    duration: "2024",
    description: [
      "Built a secure full-stack spending analyzer allowing users to securely track, log, and categorize expenditures across ten categories.",
      "Programmed instant summary computations and optimized SQL indexing routines delivering analytics reports in under 200ms."
    ],
    achievements: [
      "Integrated Chart.js plotting dynamic responsive visual charts directly from background database queries without manual reload.",
      "Enforced complete workspace isolation by hashing user credentials with secure Werkzeug protocols.",
      "Developed a dark dashboard UI completely from scratch using CSS Flexbox with raw page speeds under 2 seconds."
    ],
    codeName: "FISCAL_DIAMOND"
  }
];

export const TIMELINE_LIST: Experience[] = [
  {
    id: "exp-1",
    title: "Bachelor of Technology (B.Tech) – Computer Science Engineering",
    institution: "Dr. KV Subba Reddy Institute of Technology, JNTU",
    period: "2021 – Present",
    description: "Pursuing core computer science fields. Maintained academic discipline and learned full-stack architectural concepts with practical hands-on projects.",
    details: ["CGPA: 6.9", "Kurnool, Andhra Pradesh"],
    type: "education"
  },
  {
    id: "exp-2",
    title: "Class XII – Intermediate (MPC)",
    institution: "Akshara Sree Junior College",
    period: "2020 – 2022",
    description: "Successfully masterminded logic foundations in Mathematics, Physics, and Chemistry.",
    details: ["CGPA: 5.5", "Adoni, Andhra Pradesh"],
    type: "education"
  },
  {
    id: "exp-3",
    title: "Class X – Secondary School Certificate (SSC)",
    institution: "Narayana Group of Schools",
    period: "2020",
    description: "Completed secondary education with an absolute perfection scoring matric.",
    details: ["CGPA: 10.0 / 10.0 Perfect Score", "Adoni, Andhra Pradesh"],
    type: "education"
  },
  {
    id: "exp-cert-1",
    title: "Front-End Development Certification (HTML, CSS, JS)",
    institution: "Ed Vedha Training",
    period: "Credentials Certified",
    description: "Immersive development drill building interactive static layouts and native JS controllers.",
    type: "certifications"
  },
  {
    id: "exp-cert-2",
    title: "Back-End Web Development (Python & Django)",
    institution: "ExcelR Academy",
    period: "Credentials Certified",
    description: "Advanced enterprise training focused on routing matrices, models relations, and database migration safety.",
    type: "certifications"
  },
  {
    id: "exp-cert-3",
    title: "Cybersecurity Fundamentals & Zero Trust",
    institution: "Zscaler Cloud Security Academy",
    period: "Credentials Certified",
    description: "Virtual Internship focused on cloud perimeter protection, multi-tenant separation, and zero-trust verification gateways.",
    type: "certifications"
  },
  {
    id: "exp-cert-4",
    title: "IR4.0 Industrial Foundation (Microsoft & SAP)",
    institution: "EDUNET Foundation Academic Course",
    period: "Credentials Certified",
    description: "Exposure to Industry 4.0 pillars including Artificial Intelligence elements, Internet of Things (IoT) networking, and Cloud architecture.",
    type: "certifications"
  }
];
