const { GiveawaysManager } = require('discord-giveaways');
const { Client } = require('discord-rpc');
const { SlashCommandBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giveaway-start')
    .setDescription('Start a giveaway')
    .addIntegerOption(option =>
      option
        .setName('winners')
        .setDescription('Nombre de gagnants pour le concours')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('duration')
        .setDescription('Duration of the giveaway (1m, 1h, 1d, 1w)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('prize')
        .setDescription('Prix ​​pour le cadeau')
        .setRequired(true),
    ),
  async execute(interaction) {
    const duration = interaction.options.getString('duration');
    const winnerCount = interaction.options.getInteger('winners');
    const prize = interaction.options.getString('prize');

    const winnerMessage = 'Félicitations! {winners} ! tu as win : **{this.prize}**! 🎉 contacte <@970034664238628895> pour recevoir ton cadeau 🥰 ';

    if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
      await interaction.reply("Tu n'as pas les permissions nécessaires mon fraté !");
      return;
    }

    // Démarre le giveaway avec le message personnalisé
    interaction.client.giveawaysManager
      .start(interaction.channel, {
        duration: ms(duration),
        winnerCount,
        prize,
        messages: {
          giveaway: '🎉🎉 **GIVEAWAY** 🎉🎉',
          giveawayEnded: '🎉🎉 **GIVEAWAY TERMINÉ** 🎉🎉',
          timeRemaining: 'Temps restant: **{duration}**!',
          inviteToParticipate: 'Réagissez avec 🎉 pour participer!',
          winMessage: winnerMessage,
          embedFooter: 'Giveaway',
          noWinner: 'Pas de gagnant(s) sélectionné(s)!',
          winners: 'Le gagnant(s) est',
          endedAt: 'Terminé à',
          hostedBy: 'Hébergé par : {user}',
          units: {
            seconds: 'secondes',
            minutes: 'minutes',
            hours: 'heures',
            days: 'jours',
            pluralS: false
          }
        }
      })
      .then((data) => {
        console.log(data);
        interaction.reply('Giveaway Démarré !');
        setTimeout(() => {
          interaction.deleteReply();
          interaction.channel.send('<#1232738068360855733> <#1232738068360855733> Petit cadeau pour vous, mes petits noobs 😘 Veuillez interagir avec "🎉" ci-dessus pour y participer ! Bonne chance');
        }, 100);
      })
      .catch((error) => {
        console.error(error);
        interaction.reply('Failed to start giveaway.');
      });
  }
};
