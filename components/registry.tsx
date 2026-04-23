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
