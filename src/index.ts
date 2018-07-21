import * as cheerio from "cheerio";
import * as child_process from "child_process";
import * as fs from "fs";
import * as inquirer from "inquirer";
import * as marked from "marked";

const filePath = "README.md";

fs.readFile(filePath, "utf8", (err, file) => {
  if (err) {
    console.error(err);
  }
  const html = marked(file);

  const $ = cheerio.load(html);

  const commands = {};
  let key;
  $("*")
    .toArray()
    .map(e => {
      const $e = cheerio(e);
      if ($e.is("h1,h2,h3,h4,h5,h6")) {
        key = $e.text();
      }
      if (key && $e.is("code")) {
        $e.text()
          .split(/\r\n|\r|\n/)
          .map(command => {
            if (!commands[key]) {
              commands[key] = [];
            }
            commands[key].push(command.replace(/^[#>\s\$]+/, ""));
          });
      }
    });

  const section = "section";
  const questionSection = {
    type: "list",
    name: section,
    message: "choice section",
    choices: Object.keys(commands)
  };
  inquirer.prompt([questionSection]).then(answerSections => {
    const command = "command";
    const questionCommand = {
      type: "list",
      name: command,
      message: "choice command",
      choices: commands[answerSections[section]]
    };
    inquirer.prompt([questionCommand]).then(answerCommands => {
      child_process.exec(answerCommands[command], (error, stdout, stderr) => {
        console.log(stdout);
        if (error) {
          console.error(error);
        }
        if (stderr) {
          console.error(stderr);
        }
      });
    });
  });
});
