/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const NotFoundError = require('./error/NotFoundError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistById(playlistId) {
    const query = {
      text: 'SELECT id, name FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Gagal, playlist ID tidak ditemukan!');
    }

    return result.rows[0];
  }

  async getSongsFromPlaylistId(playlistId) {
    const query = {
      text: `
        SELECT songs.id, songs.title, songs.performer FROM songs
        LEFT JOIN playlistsongs ON songs.id = playlistsongs.song_id
        WHERE playlistsongs.playlist_id = $1
      `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = PlaylistsService;
