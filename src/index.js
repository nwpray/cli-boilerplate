#!/usr/bin/env node

const globby = require("globby");
const path = require("path");
const { program } = require("commander");

(async () => {
  const filePaths = await globby(path.join(__dirname, "**/commands/**"));

  program.action(() => program.help());

  for (let filePointer = 0; filePointer < filePaths.length; filePointer += 1) {
    const { [filePointer]: filePath } = filePaths;

    const { default: fn } = await import(filePath);

    await fn(program);
  }
  program.parse(process.argv);
})();
