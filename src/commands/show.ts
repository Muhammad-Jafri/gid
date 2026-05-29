import { readProfile } from "../profile";

export function show(name: string): void {
  if (!name) {
    console.error("Usage: gid show <profile-name>");
    process.exit(1);
  }

  const profile = readProfile(name);
  if (!profile) {
    console.error(`Profile "${name}" not found.`);
    process.exit(1);
  }

  const maskedToken =
    profile.githubToken.length > 8
      ? `${profile.githubToken.slice(0, 8)}...`
      : "***";

  console.log(`Profile:          ${name}`);
  console.log(`Git name:         ${profile.gitName}`);
  console.log(`Git email:        ${profile.gitEmail}`);
  console.log(`GitHub username:  ${profile.githubUsername}`);
  console.log(`GitHub token:     ${maskedToken}`);
  if (profile.sshKey) {
    console.log(`SSH key:          ${profile.sshKey}`);
  }
}
