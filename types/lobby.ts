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
