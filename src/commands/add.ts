import { prompt } from "../prompt";
import { readProfile, writeProfile } from "../profile";

export async function add(name: string): Promise<void> {
  if (!name) {
    console.error("Usage: gid add <profile-name>");
    process.exit(1);
  }

  if (readProfile(name)) {
    const confirm = await prompt(`Profile "${name}" already exists. Overwrite? [y/N] `);
    if (confirm.toLowerCase() !== "y") {
      console.log("Cancelled.");
      process.exit(0);
    }
  }

  const gitName = await prompt("Git user.name: ");
  const gitEmail = await prompt("Git user.email: ");
  const githubUsername = await prompt("GitHub username: ");
  const githubToken = await prompt("GitHub PAT: ");
  const sshKeyInput = await prompt("SSH key path (optional, Enter to skip): ");

  writeProfile(name, {
    gitName,
    gitEmail,
    githubUsername,
    githubToken,
    ...(sshKeyInput ? { sshKey: sshKeyInput } : {}),
  });

  console.log(`Profile "${name}" saved.`);
}
