const fs = require("fs");
const fsPromises = require("fs/promises");
const readline = require("readline");
const path = require("path");
const globby = require("globby");

module.exports = async (command) =>
  command("init")
    .description("initializes a cli project")
    .action(async () => {
      const { PWD: currentPath } = process.env;

      const rl = readline.createInterface(process.stdin, process.stdout);

      const name = await new Promise((resolve) =>
        rl.question("Project name: ", resolve)
      );

      const author = await new Promise((resolve) =>
        rl.question("Author: ", resolve)
      );

      rl.close();

      const destPath = path.join(currentPath, name);

      if (fs.existsSync(destPath)) {
        console.log(
          `'${name}' cannot be used as Project Name because '${destPath}' already exists`
        );
        return;
      }

      const srcPath = path.resolve(__dirname, "../..");
      const filePathsToMove = await globby(
        [
          "**",
          "!**/node_modules/**",
          "!**/.git/**",
          "!**/package-lock.json",
          "!**/commands/init.js",
        ],
        {
          cwd: srcPath,
        }
      );

      for await (let filePath of filePathsToMove) {
        await fsPromises.cp(
          path.join(srcPath, filePath),
          path.join(destPath, filePath),
          {
            recursive: true,
          }
        );
      }

      const packageJsonPath = path.resolve(destPath, "package.json");
      const currentPackageJson = JSON.parse(
        await fsPromises.readFile(packageJsonPath, "utf-8")
      );

      await fsPromises.mkdir(path.join(destPath, "src/commands"), {
        recursive: true,
      });

      await fsPromises.writeFile(
        packageJsonPath,
        JSON.stringify(
          {
            ...currentPackageJson,
            name,
            description: `${name} cli`,
            author,
          },
          null,
          2
        )
      );
    });
