import { add } from "./commands/add";
import { list } from "./commands/list";
import { use } from "./commands/use";
import { remove } from "./commands/remove";
import { show } from "./commands/show";
import { current } from "./commands/current";

const [, , command, ...args] = process.argv;

switch (command) {
  case "add":
    await add(args[0]);
    break;
  case "list":
  case "ls":
    list();
    break;
  case "use":
    use(args[0]);
    break;
  case "remove":
  case "rm":
    await remove(args[0]);
    break;
  case "show":
    show(args[0]);
    break;
  case "current":
    current();
    break;
  default:
    console.log(`Usage: gid <command> [profile]

Commands:
  add <name>     Create or update a profile
  list           List all profiles (* marks active)
  use <name>     Switch to a profile in this shell session
  show <name>    Show profile details (token masked)
  remove <name>  Delete a profile
  current        Print the active profile name`);
}
