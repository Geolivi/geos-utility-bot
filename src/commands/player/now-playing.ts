import type { Command } from 'src/types';

import { SlashCommandBuilder } from '@discordjs/builders';
import sessions from './sessions';
import { replyWithSessionButtons } from './utils';

const NowPlayingCommand: Command = {
  guildOnly: true,
  slashCommandData: new SlashCommandBuilder()
    .setName('now-playing')
    .setDescription('Display the title of the track that is currently playing.'),

  runCommand: async interaction => {
    await interaction.deferReply({
      ephemeral: true,
    });
    return replyWithSessionButtons({
      interaction,
      session: sessions.get(interaction.guild!),
      run: async session => {
        const currentTrack = session.getCurrentTrack();
        if (!currentTrack) {
          return {
            message: 'Nothing is playing.',
            hideButtons: true,
          };
        }
        const videoDetails = await currentTrack.getVideoDetails();
        return {
          title: '🔊 Now Playing',
          message: videoDetails.title,
        };
      },
    });
  },
};

export default NowPlayingCommand;
