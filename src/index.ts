// tslint:disable-next-line:no-var-requires
const commander = require("commander");
import { executeCommands } from "./commandExecutor";
import { CommandSections } from "./commandSections";
import { StringCompiledHTML } from "./stringCompiledHTML";

// interface of command-line arguments
interface IArgv {
  file: string;
}

function main(): void {
  const args: IArgv = configureCommander();

  const html = StringCompiledHTML.generateFromMarkdownFile(args.file);
  const commands = CommandSections.generateFromHTML(html);
  executeCommands(commands);
}

function configureCommander(): IArgv {
  const packagejson: any = require("../package.json");

  commander.option("--file <filename>", "Specify the file name", "README.md");
  commander.version(packagejson.version);
  commander.parse(process.argv);

  return { file: commander.file };
}

main();
