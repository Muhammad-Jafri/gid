import { prompt } from "../prompt";
import { readProfile, deleteProfile, getActiveProfile, clearActiveProfile } from "../profile";

export async function remove(name: string): Promise<void> {
  if (!name) {
    console.error("Usage: gid remove <profile-name>");
    process.exit(1);
  }

  if (!readProfile(name)) {
    console.error(`Profile "${name}" not found.`);
    process.exit(1);
  }

  const confirm = await prompt(`Remove profile "${name}"? [y/N] `);
  if (confirm.toLowerCase() !== "y") {
    console.log("Cancelled.");
    process.exit(0);
  }

  deleteProfile(name);
  if (getActiveProfile() === name) clearActiveProfile();
  console.log(`Profile "${name}" removed.`);
}
