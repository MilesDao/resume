/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  tags: string[];
  link?: string;
  image?: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Blog {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  content: string;
  tags: string[];
  image?: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  size: string;
  type: string;
  uploadedAt: string;
}
