import { listProfiles } from "../profile";

export function list(): void {
  const profiles = listProfiles();
  if (profiles.length === 0) {
    console.log("No profiles found. Run: gid add <name>");
    return;
  }
  const current = process.env.GID_CURRENT_PROFILE;
  for (const p of profiles) {
    console.log(current === p ? `* ${p}` : `  ${p}`);
  }
}
