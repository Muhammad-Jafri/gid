import { homedir } from "os";
import { join } from "path";

export const CONFIG_DIR = join(homedir(), ".config", "gid");
export const PROFILES_DIR = join(CONFIG_DIR, "profiles");
export const ACTIVE_FILE = join(CONFIG_DIR, "active");
export const CRED_HELPER = join(homedir(), ".local", "bin", "gid-cred-helper");
