require('dotenv').config();
const fs = require('fs')

const { Client, Collection } = require("discord.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');


const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const montoken = process.env.token;


const client = new Client({ intents: 3276799 });


const commandHandler = new Collection();

const commands = []

//Commande Handler moderation and slashcommands
const rest = new REST({ version: '9' }).setToken(montoken);

const commandEvents = fs.readdirSync("./Events").filter(file => file.endsWith(".js"));
//Commande Handler Evenements and SlashCommand
for (const file of commandEvents) {
  const commandName = file.split(".")[0]
  const command = require(`./Events/${commandName}`)
  commandHandler.set(commandName, command)
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.log(`[WARNING] The command at ${command} is missing a required "data" or "execute" property.`);
  }
}


(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();


client.on('ready', () => {
  console.log('Je suis ready pour les concours !')
})


//giveway images
const { GiveawaysManager } = require('discord-giveaways');

const manager = new GiveawaysManager(client, {
  storage: './giveaways.json',
  default: {
    botsCanWin: false,
    embedColor: '#b7094c',
    embedColorEnd: '#000000',
    reaction: '🎉'

  }
});
client.giveawaysManager = manager;


const giveawayCommands = require('./Events/giveways');
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'giveaway-start') {
    try {
      await giveawayCommands.execute(interaction);
    } catch (error) {
      console.error('Error executing command:', error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

client.login(process.env.token);