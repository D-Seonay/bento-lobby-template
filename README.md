# Project Lobby Template // V2.1.0

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-black?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-black?style=for-the-badge&logo=framer)

A premium, high-performance **Bento Grid Portfolio Template** designed for individual developers. Launch a radical, data-driven landing page by simply editing JSON files.

## ⚡ Core Features

- **Configuration-Driven:** Control your entire identity, theme, and Bento grid layout from a single `lobby.json`.
- **Customizable Bento Grid:** Reorder and resize cards dynamically without touching the code.
- **Dynamic Theming:** Inject your primary brand color and border radii via configuration.
- **Extensible Widget Registry:** Easily add your own custom React components to the grid.
- **Automated SEO:** Dynamic OpenGraph metadata and JSON-LD structured data generated from your profile.
- **Radical Motion Design:** High-end orchestration using Framer Motion with "Stealth" transition aesthetics.

## 🛠 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Deployment:** Vercel

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the Setup Wizard:**
   ```bash
   npm run setup
   ```
   Follow the prompts to configure your name, title, and brand color.

4. **Customize your Grid:**
   Edit `content/lobby.json` to arrange your projects and widgets.

5. **Update your Projects:**
   Add your work to `content/projects.json`.

6. **Development:**
   ```bash
   npm run dev
   ```

## 📂 Configuration

### `content/lobby.json`
The brain of your lobby.
- `profile`: Your identity and social links.
- `theme`: Primary color and UI tokens.
- `grid`: The ordered layout of your Bento cards.

### `components/registry.tsx`
The bridge for custom components. Register any new widget here to use it in your JSON config.

## ⚖️ License

MIT License - Feel free to use and modify for your personal portfolio.
Designed with surgical precision for the modern developer.
