export function current(): void {
  const profile = process.env.GID_CURRENT_PROFILE;
  if (!profile) {
    console.log("No active profile.");
  } else {
    console.log(profile);
  }
}
