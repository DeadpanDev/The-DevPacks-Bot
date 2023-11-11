const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Test if everything is working correctly")
    .setDMPermission(false)
    .addSubcommandGroup((subcommandgroup) =>
      subcommandgroup
        .setName("user")
        .setDescription("Configure a user.")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("role")
            .setDescription("Configure a users role.")
            .addUserOption((option) => option.setName("user").setDescription("The user to configure."))
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("nickname")
            .setDescription("Configure a users nickname.")
            .addUserOption((option) => option.setName("nickname").setDescription("The nickname the user should have."))
            .addUserOption((option) => option.setName("user").setDescription("The user to configure."))
        )
    )
    .addSubcommand((subcommand) => subcommand.setName("message").setDescription("Configure a message."))
    .toJSON(),
  userPermissions: [PermissionFlagsBits.ManageMessages],
  botPermissions: [PermissionFlagsBits.Connect],

  run: (client, interaction) => {
    const { EmbedBuilder, Colors } = require("discord.js");
    const mConfig = require("../../messageConfig.json");
    const createEmbed = (color, description) => new EmbedBuilder().setColor(color).setDescription(description);
    const rEmbed = createEmbed(mConfig.embedColorSuccess, mConfig.testCommandSuccuss);
    return interaction.reply({ embeds: [rEmbed], ephemeral: true });
  },
};
