#!/usr/bin/env node

const fsPromises = require("fs/promises");
const globby = require("globby");
const path = require("path");
const { program } = require("commander");

(async () => {
  const filePaths = await globby(path.join(__dirname, "**/commands/**/*.js"));

  const packageJson = JSON.parse(
    await fsPromises.readFile(path.resolve(__dirname, "../package.json"))
  );

  program
    .description(`${packageJson.description}\nVersion:${packageJson.version}`)
    .action(() => program.help());

  for (let filePointer = 0; filePointer < filePaths.length; filePointer += 1) {
    const { [filePointer]: filePath } = filePaths;

    const { default: fn } = await import(filePath);

    await fn(program.command.bind(program));
  }
  program.parse(process.argv);
})();
