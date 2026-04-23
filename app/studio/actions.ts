'use server'
import fs from 'fs/promises';
import path from 'path';
import { GridItem } from '@/types/lobby';

export async function saveStudioConfig(newGrid: GridItem[]) {
  const configPath = path.join(process.cwd(), 'content', 'lobby.json');
  const currentConfig = JSON.parse(await fs.readFile(configPath, 'utf-8'));
  currentConfig.grid = newGrid;
  await fs.writeFile(configPath, JSON.stringify(currentConfig, null, 2));
  return { success: true };
}
