/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Skill {
  name: string;
  category: "language" | "framework" | "database" | "tool" | "other";
  level: number; // proficiency out of 100
  iconClass?: string; // custom representation or emoji symbol
  description: string;
  alienForm: string; // The Ben 10 Alien represented by this skill
  alienPowerDesc: string; // Funny lore aligning the skill to the alien's powers
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  techStack: string[];
  duration: string;
  description: string[];
  achievements: string[];
  link?: string; // Action URL
  codeName: string; // Ben 10 style codename/alien unlocking it
}

export interface Experience {
  id: string;
  title: string;
  institution: string;
  period: string;
  description: string;
  details?: string[];
  type: "education" | "experience" | "certifications";
}

export interface Certification {
  name: string;
  issuer: string;
  focus: string;
}
