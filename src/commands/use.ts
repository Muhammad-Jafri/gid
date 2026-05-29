import { homedir } from "os";
import { readProfile, setActiveProfile } from "../profile";
import { CRED_HELPER } from "../paths";

export function use(name: string): void {
  if (!name) {
    console.error("Usage: gid use <profile-name>");
    process.exit(1);
  }

  const profile = readProfile(name);
  if (!profile) {
    console.error(`Profile "${name}" not found. Run: gid add ${name}`);
    process.exit(1);
  }

  const lines: string[] = [
    `export GIT_AUTHOR_NAME=${q(profile.gitName)}`,
    `export GIT_AUTHOR_EMAIL=${q(profile.gitEmail)}`,
    `export GIT_COMMITTER_NAME=${q(profile.gitName)}`,
    `export GIT_COMMITTER_EMAIL=${q(profile.gitEmail)}`,
    `export GID_GITHUB_USERNAME=${q(profile.githubUsername)}`,
    `export GID_GITHUB_TOKEN=${q(profile.githubToken)}`,
    // Clear any existing credential helper chain, then set ours.
    // Two entries with same key: first empty string resets the chain.
    `export GIT_CONFIG_COUNT=2`,
    `export GIT_CONFIG_KEY_0="credential.helper"`,
    `export GIT_CONFIG_VALUE_0=""`,
    `export GIT_CONFIG_KEY_1="credential.helper"`,
    `export GIT_CONFIG_VALUE_1=${q(CRED_HELPER)}`,
    `export GID_CURRENT_PROFILE=${q(name)}`,
  ];

  if (profile.sshKey) {
    const expanded = profile.sshKey.replace(/^~/, homedir());
    lines.push(`export GIT_SSH_COMMAND=${q(`ssh -i ${expanded} -o IdentitiesOnly=yes`)}`);
  }

  setActiveProfile(name);

  // Write to stdout — the pisw shell function evals this
  process.stdout.write(lines.join("\n") + "\n");
}

// Shell-safe quoting: wrap in single quotes, escape any single quotes inside
function q(value: string): string {
  return `'${value.replace(/'/g, "'\\''")}'`;
}
