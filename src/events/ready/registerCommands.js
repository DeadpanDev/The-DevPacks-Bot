require("colors");
const { testServerId } = require("../../config.json");
const commandComparing = require("../../utils/commandsComparing");
const getApplicationCommands = require("../../utils/getApplicationCommands");
const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = async (client) => {
  try {
    const [localCommands, applicationCommands] = await Promise.all([
      getLocalCommands(),
      getApplicationCommands(client, testServerId),
    ]);

    for (const localCommand of localCommands) {
      const { data, deleted } = localCommand;
      const { name: commandName, description: commandDescription, options: commandOptions } = data;

      const existingCommand = await applicationCommands.cache.find((cmd) => cmd.name === commandName);

      if (deleted) {
        if (existingCommand) {
          await existingCommand.delete(existingCommand.id);
          console.log(`[COMMAND REGISTRY] Application command ${commandName} has been deleted.`.red);
        } else {
          console.log(
            `[COMMAND REGISTRY] Application command ${commandName} has been skipped, since property 'deleted' is set to true.`
              .gray
          );
        }
      } else if (existingCommand) {
        if (commandComparing(existingCommand, localCommand)) {
          await applicationCommands.edit(existingCommand.id, {
            name: commandName,
            description: commandDescription,
            options: commandOptions,
          });
          console.log(`[COMMAND REGISTRY] Application command ${commandName} has been edited.`.yellow);
        }
      } else {
        await applicationCommands.create({
          name: commandName,
          description: commandDescription,
          options: commandOptions,
        });
        console.log(`[COMMAND REGISTRY] Application command ${commandName} has been registered.`.green);
      }
    }
  } catch (error) {
    console.log(`[ERROR] An error occurred inside the command registry:\n${error}`.red);
  }
};
