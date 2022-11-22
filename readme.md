# Cli Builder

This is a shell project for setting up cli applications

## Getting started

Install the cli

`npm i -g .`

Create a cli

`cli-boilerplate`

## Adding commands

Under the hood this library uses [commander](https://www.npmjs.com/package/commander)

Create a new file in `./src/commands` and add the following

```js
module.exports = async (command) => {};
```

The `command` argument passed is a the command function from the root program it is equivelant to `program.command` in the `commander` library.s

The cli will automatically import any `.js` files in `./src/commands` and call them with a new command
s

## Name Collisions

This framework does not handle command name collision, so don't give two commands the same name when you define them.

## Changing root command description

The root command description is pulled from the `package.json` so if you modify that description, that is what will show as your command description when you run your cli.
