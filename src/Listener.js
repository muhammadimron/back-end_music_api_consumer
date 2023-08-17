/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
class Listener {
  constructor(playlistsService, mailSender) {
    this._playlistsService = playlistsService;
    this._mailSender = mailSender;

    this.eventListener = this.eventListener.bind(this);
  }

  async eventListener(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString());
      const songs = await this._playlistsService.getSongsFromPlaylistId(playlistId);
      const playlist = await this._playlistsService.getPlaylistById(playlistId);
      const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify({
        playlist: {
          ...playlist,
          songs,
        },
      }));
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
