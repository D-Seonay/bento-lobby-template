'use server'
import fs from 'fs/promises';
import path from 'path';
import { LobbyConfig } from '@/types/lobby';
import { Project } from '@/types/project';

export async function saveStudioConfig(config: Partial<LobbyConfig>) {
  const configPath = path.join(process.cwd(), 'content', 'lobby.json');
  const currentConfig = JSON.parse(await fs.readFile(configPath, 'utf-8'));
  
  const updatedConfig = {
    ...currentConfig,
    ...config
  };

  await fs.writeFile(configPath, JSON.stringify(updatedConfig, null, 2));
  return { success: true };
}

export async function addNewProject(project: Project) {
  const projectsPath = path.join(process.cwd(), 'content', 'projects.json');
  const projects = JSON.parse(await fs.readFile(projectsPath, 'utf-8'));
  
  projects.push(project);

  await fs.writeFile(projectsPath, JSON.stringify(projects, null, 2));
  return { success: true };
}
