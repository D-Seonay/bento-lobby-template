# Project Lobby Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the project into a reusable, configuration-driven template for individual developers.

**Architecture:** Use a central `lobby.json` for all identity, style, and layout data. A `WIDGET_REGISTRY` maps JSON keys to React components for extensibility.

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion.

---

### Task 1: Define Configuration Types & Initial Data

**Files:**
- Create: `types/lobby.ts`
- Create: `content/lobby.json`

- [ ] **Step 1: Create the lobby configuration types**

```typescript
// types/lobby.ts
export interface Profile {
  name: string;
  jobTitle: string;
  url: string;
  company?: string;
  bio?: string;
  socials?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    mail?: string;
  };
}

export interface Theme {
  primary: string;
  radius: string;
  font?: string;
}

export interface GridItem {
  id: string;
  type: string;
  size: 'small' | 'wide' | 'big' | 'xl';
  projectId?: string; // For type="bento"
  platform?: string;  // For type="social"
  component?: string; // For type="custom"
}

export interface LobbyConfig {
  profile: Profile;
  theme: Theme;
  grid: GridItem[];
}
```

- [ ] **Step 2: Create initial lobby.json with example data**

```json
{
  "profile": {
    "name": "Mathéo Delaunay",
    "jobTitle": "Next.js Developer & Digital Designer",
    "url": "https://lobby.seonay.com",
    "company": "Seonay Studio",
    "bio": "Expert Next.js developer specializing in high-performance architectural frameworks.",
    "socials": {
      "github": "https://github.com/D-Seonay",
      "linkedin": "https://www.linkedin.com/in/matheo-delaunay/",
      "twitter": "https://twitter.com/matheodelaunay",
      "mail": "mailto:contact@seonay.studio"
    }
  },
  "theme": {
    "primary": "#3b82f6",
    "radius": "1.5rem",
    "font": "var(--font-geist-sans)"
  },
  "grid": [
    { "id": "main-project", "type": "bento", "projectId": "seonay-portfolio", "size": "xl" },
    { "id": "control-center", "type": "control-center", "size": "small" },
    { "id": "github-social", "type": "social", "platform": "github", "size": "small" },
    { "id": "quick-access", "type": "quick-access", "size": "small" },
    { "id": "linkedin-social", "type": "social", "platform": "linkedin", "size": "small" },
    { "id": "all-socials", "type": "socials-wide", "size": "wide" },
    { "id": "project-1", "type": "bento", "projectId": "stat-stats", "size": "wide" },
    { "id": "project-2", "type": "bento", "projectId": "mindful-metrics", "size": "wide" },
    { "id": "social-big", "type": "socials-big", "size": "big" },
    { "id": "project-3", "type": "bento", "projectId": "devdash", "size": "big" },
    { "id": "project-4", "type": "bento", "projectId": "green-event", "size": "small" },
    { "id": "project-5", "type": "bento", "projectId": "github-readme-gen", "size": "small" },
    { "id": "project-6", "type": "bento", "projectId": "smart-budget", "size": "wide" },
    { "id": "github-graph", "type": "github-graph", "size": "wide" },
    { "id": "moon-phase", "type": "moon-phase", "size": "wide" },
    { "id": "tech-radar", "type": "tech-radar", "size": "wide" },
    { "id": "wall-of-love", "type": "wall-of-love", "size": "small" },
    { "id": "build-stats", "type": "build-stats", "size": "small" }
  ]
}
```

- [ ] **Step 3: Commit task**

```bash
git add types/lobby.ts content/lobby.json
git commit -m "feat: define lobby config types and initial data"
```

### Task 2: Implement Widget Registry

**Files:**
- Create: `components/registry.tsx`

- [ ] **Step 1: Create the registry mapping components to keys**

```tsx
import { GitHubGraph } from './GitHubGraph';
import { SocialMediaWidget } from './SocialMediaWidget';
import { ControlCenterWidget } from './ControlCenterWidget';
import { QuickAccessWidget } from './QuickAccessWidget';
import { MoonPhaseWidget } from './MoonPhaseWidget';
import { WallOfLoveWidget } from './WallOfLoveWidget';
import { TechRadarWidget } from './TechRadarWidget';
import { BuildStatsWidget } from './BuildStatsWidget';
import { BentoCard } from './BentoCard';

export const WIDGET_REGISTRY: Record<string, React.ComponentType<any>> = {
  'bento': BentoCard,
  'github-graph': GitHubGraph,
  'social': SocialMediaWidget,
  'socials-wide': SocialMediaWidget, // Generic social list
  'socials-big': SocialMediaWidget,  // Generic social list
  'control-center': ControlCenterWidget,
  'quick-access': QuickAccessWidget,
  'moon-phase': MoonPhaseWidget,
  'wall-of-love': WallOfLoveWidget,
  'tech-radar': TechRadarWidget,
  'build-stats': BuildStatsWidget,
};
```

- [ ] **Step 2: Commit task**

```bash
git add components/registry.tsx
git commit -m "feat: implement widget registry"
```

### Task 3: Dynamic Theme Injection

**Files:**
- Create: `components/ThemeConfiguration.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create ThemeConfiguration component**

```tsx
'use client';

import { Theme } from '@/types/lobby';

export function ThemeConfiguration({ theme }: { theme: Theme }) {
  return (
    <style jsx global>{`
      :root {
        --accent: ${theme.primary};
        --radius-3xl: ${theme.radius};
        ${theme.font ? `--font-sans: ${theme.font};` : ''}
      }
    `}</style>
  );
}
```

- [ ] **Step 2: Update layout.tsx to use ThemeConfiguration and dynamic metadata**

```tsx
// app/layout.tsx (partial)
import lobbyConfig from '@/content/lobby.json';
import { ThemeConfiguration } from '@/components/ThemeConfiguration';
import { LobbyConfig } from '@/types/lobby';

const config = lobbyConfig as LobbyConfig;

export const metadata: Metadata = {
  title: `${config.profile.name} | ${config.profile.jobTitle}`,
  description: config.profile.bio,
  // ... other fields using config.profile
};

// Inside RootLayout
return (
  <html lang="en" ...>
    <head>
      <ThemeConfiguration theme={config.theme} />
      {/* ... existing scripts */}
    </head>
    {/* ... existing body content */}
  </html>
);
```

- [ ] **Step 3: Commit task**

```bash
git add components/ThemeConfiguration.tsx app/layout.tsx
git commit -m "feat: implement dynamic theme and metadata injection"
```

### Task 4: Generalize Page Rendering

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/BentoCard.tsx`

- [ ] **Step 1: Update BentoCard to handle project search by ID**

```tsx
// components/BentoCard.tsx (partial)
import projectsData from '@/content/projects.json';
// ...
export function BentoCard({ project, projectId, size }: BentoCardProps) {
  const displayProject = project || projectsData.find(p => p.id === projectId);
  if (!displayProject) return null;
  // ... rendering logic
}
```

- [ ] **Step 2: Update page.tsx to render from lobby.json grid**

```tsx
// app/page.tsx (partial)
import { WIDGET_REGISTRY } from '@/components/registry';
import lobbyConfig from '@/content/lobby.json';
import { LobbyConfig } from '@/types/lobby';

export default function Home() {
  const config = lobbyConfig as LobbyConfig;

  return (
    <main ...>
      {/* ... jsonLd generation using config.profile */}
      <section id="work" ...>
        <SpotlightGrid>
          <BentoGrid>
            {config.grid.map((item) => {
              const Widget = WIDGET_REGISTRY[item.type];
              if (!Widget) return null;
              
              return (
                <Widget 
                  key={item.id} 
                  size={item.size}
                  projectId={item.projectId}
                  platform={item.platform}
                  // ... spread other item props
                />
              );
            })}
          </BentoGrid>
        </SpotlightGrid>
      </section>
      {/* ... footer updates with config.profile.company */}
    </main>
  );
}
```

- [ ] **Step 3: Commit task**

```bash
git add app/page.tsx components/BentoCard.tsx
git commit -m "feat: generalize page rendering from lobby.json"
```

### Task 5: Setup Wizard CLI

**Files:**
- Create: `scripts/setup.mjs`
- Modify: `package.json`

- [ ] **Step 1: Implement the setup wizard**

```javascript
// scripts/setup.mjs
import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setup() {
  console.log('🚀 Project Lobby Template Setup\n');
  
  const name = await ask('Your name: ');
  const title = await ask('Job title: ');
  const color = await ask('Primary accent color (hex, e.g. #3b82f6): ');

  const config = JSON.parse(fs.readFileSync('./content/lobby.json', 'utf8'));
  config.profile.name = name;
  config.profile.jobTitle = title;
  config.theme.primary = color;

  fs.writeFileSync('./content/lobby.json', JSON.stringify(config, null, 2));
  
  console.log('\n✅ lobby.json updated! Run npm run dev to see changes.');
  rl.close();
}

setup();
```

- [ ] **Step 2: Add setup script to package.json**

```json
"scripts": {
  "setup": "node scripts/setup.mjs",
  // ...
}
```

- [ ] **Step 3: Commit task**

```bash
git add scripts/setup.mjs package.json
git commit -m "feat: add setup wizard CLI"
```
