import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync, chmodSync } from "fs";
import { join } from "path";
import { PROFILES_DIR, ACTIVE_FILE, CONFIG_DIR } from "./paths";

export interface Profile {
  gitName: string;
  gitEmail: string;
  githubUsername: string;
  githubToken: string;
  sshKey?: string;
}

export function profilePath(name: string): string {
  return join(PROFILES_DIR, `${name}.json`);
}

export function readProfile(name: string): Profile | null {
  const p = profilePath(name);
  if (!existsSync(p)) return null;
  return JSON.parse(readFileSync(p, "utf-8"));
}

export function writeProfile(name: string, profile: Profile): void {
  mkdirSync(PROFILES_DIR, { recursive: true });
  const p = profilePath(name);
  writeFileSync(p, JSON.stringify(profile, null, 2), "utf-8");
  chmodSync(p, 0o600); // token is sensitive
}

export function listProfiles(): string[] {
  if (!existsSync(PROFILES_DIR)) return [];
  return readdirSync(PROFILES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.slice(0, -5))
    .sort();
}

export function deleteProfile(name: string): boolean {
  const p = profilePath(name);
  if (!existsSync(p)) return false;
  unlinkSync(p);
  return true;
}

export function setActiveProfile(name: string): void {
  mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(ACTIVE_FILE, name, "utf-8");
}

export function clearActiveProfile(): void {
  if (existsSync(ACTIVE_FILE)) unlinkSync(ACTIVE_FILE);
}

export function getActiveProfile(): string | null {
  if (!existsSync(ACTIVE_FILE)) return null;
  const name = readFileSync(ACTIVE_FILE, "utf-8").trim();
  return name || null;
}
