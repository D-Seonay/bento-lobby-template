'use client';

import { WIDGET_REGISTRY } from '@/components/registry';
import { CommandPalette } from '@/components/CommandPalette';
import { SpotlightGrid } from '@/components/SpotlightGrid';
import { BentoGrid } from '@/components/BentoGrid';
import { ProjectSkeleton } from '@/components/ProjectSkeleton';
import lobbyConfig from '@/content/lobby.json';
import { LobbyConfig } from '@/types/lobby';
import { Project } from '@/types/project';
import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function Home() {
  const config = lobbyConfig as LobbyConfig;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": config.profile.name,
    "jobTitle": config.profile.jobTitle,
    "url": config.profile.url,
    "sameAs": Object.values(config.profile.socials || {}).filter(Boolean),
    "worksFor": {
      "@type": "Organization",
      "name": config.profile.company
    },
    "description": config.profile.bio
  };

  return (
    <main className="min-h-screen">
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CommandPalette />
      {/* Bento Section */}
      <section id="work" className="px-6 sm:px-12 lg:px-24 py-32">
        <h2 className="sr-only">Selected Projects</h2>
        <SpotlightGrid>
          <BentoGrid>
            {loading ? (
              <>
                <ProjectSkeleton size="xl" />
                <ProjectSkeleton size="small" />
                <ProjectSkeleton size="small" />
                <ProjectSkeleton size="small" />
                <ProjectSkeleton size="small" />
                <ProjectSkeleton size="wide" />
                <ProjectSkeleton size="wide" />
                <ProjectSkeleton size="wide" />
                <ProjectSkeleton size="big" />
                <ProjectSkeleton size="big" />
                <ProjectSkeleton size="small" />
                <ProjectSkeleton size="small" />
                <ProjectSkeleton size="wide" />
                <ProjectSkeleton size="wide" />
                <ProjectSkeleton size="wide" />
                <ProjectSkeleton size="wide" />
                <ProjectSkeleton size="small" />
                <ProjectSkeleton size="small" />
              </>
            ) : config.grid.length > 0 ? (
              config.grid.map((item) => {
                const Widget = WIDGET_REGISTRY[item.type];
                if (!Widget) return null;
                
                return (
                  <Widget 
                    key={item.id} 
                    size={item.size}
                    projectId={item.projectId}
                    platform={item.platform}
                  />
                );
              })
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-[var(--card-border)] rounded-3xl group hover:border-[var(--accent)] transition-colors">
                <div className="text-center space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase">Your Lobby is Empty<span className="text-[var(--accent)]">_</span></h2>
                    <p className="text-[10px] font-mono text-[var(--meta)] uppercase tracking-[0.2em]">Start building your professional command center</p>
                  </div>
                  <a 
                    href="/studio"
                    className="inline-block px-8 py-4 bg-[var(--fg)] text-[var(--bg)] text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                  >
                    Open Bento Studio
                  </a>
                </div>
              </div>
            )}
          </BentoGrid>
        </SpotlightGrid>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 sm:px-12 lg:px-24 border-t border-[var(--card-border)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-mono uppercase tracking-[0.3em] text-[var(--meta)]">
          <div className="flex items-center gap-4">
            <div className="font-black text-xl tracking-tighter italic uppercase text-[var(--fg)]">
              {config.profile.company || config.profile.name}<span className="text-[var(--meta)] opacity-40">_</span>
            </div>
            <span>// Terminal_Out</span>
          </div>
          <div>© {new Date().getFullYear()} {config.profile.name} // All Rights Reserved</div>
        </div>
      </footer>
    </main>
  );
}
