import {
    get_album,
    get_playlist_items,
    get_artist,
    get_playlist_cover_image,
    get_artist_top_tracks,
    get_a_playlist
} from "./index";

import { orderList,getSession } from "../utils";

class Player {
    async setAlbum() {
        const { data: album } = await get_album(this.context || this.album);
        this.album = album;
        this.tracks = album.tracks.items.filter((i) => i);
        this.images.album = album.images;
        this.view.type = "album";
    }
    setView() {
        const type = (this.context || {}).type || 'album';
        const { name, images, followers, id, owner,total_tracks,release_date,tracks } = this[type];
        this.view = {
            type,
            name,
            images,
            followers,
            id,
            owner,
            total_tracks,
            release_date,
            tracks
        };
    }
    // getUris() {
    //     return orderList(
    //         this.uri,
    //         this.tracks.map((i) => i.uri)
    //     );
    // }
    setTrackDuration(duration) {
        var day, hour, minute, seconds;
        seconds = Math.floor(duration / 1000);
        minute = Math.floor(seconds / 60);
        seconds = seconds % 60;
        hour = Math.floor(minute / 60);
        minute = minute % 60;
        day = Math.floor(hour / 24);
        hour = hour % 24;
        return hour ? `${hour} hr ${minute} min`:`${minute}:${seconds}`;
    }
    previous() {
        fetch('https://api.spotify.com/v1/me/player/previous',{
            method : 'POST',
            headers : {
                'content-type' : 'application/json',
                'authorization' : `${getSession().token_type} ${getSession().access_token}`
            }
        });
    }

    next() {
        fetch('https://api.spotify.com/v1/me/player/next',{
            method : 'POST',
            headers : {
                'content-type' : 'application/json',
                'authorization' : `${getSession().token_type} ${getSession().access_token}`
            }
        });
    }

    pause() {
        fetch('https://api.spotify.com/v1/me/player/pause',{
            method : 'PUT',
            headers : {
                'content-type' : 'application/json',
                'authorization' : `${getSession().token_type} ${getSession().access_token}`
            }
        });
    }

    async play({uri,uris,device_id}) {
        console.log(`playyyyy`,{
            uri,uris,device_id
        })

        let queue = orderList(uri,uris.map(({uri}) => uri));

        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
            method: 'PUT',
            body: JSON.stringify({ uris : queue || [uri] }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getSession().access_token}`
            }
        });
    }

    totalDuration() {
        if(!this.tracks) return false;
        let initialValue = 0;
        const duration = this.tracks.reduce((total,{duration_ms}) => total + duration_ms,initialValue);

        return duration;
    }

    async fetchPlaylist(uri) {
        const promises = {
            playlist : get_playlist_items({uri}),
            playlistInfo : get_a_playlist({uri}),
            playlistCover : get_playlist_cover_image({uri}),
        }

        const [ playlist, playlistInfo, playlistCover ] = await Promise.all(Object.values(promises));

        this.type = 'playlist';
        this.images = playlistCover.data;
        this.id = playlist.data.id;
        this.tracks = playlist.data.items.map((i) => i.track).filter((i) => i);

        this.total_duration = this.totalDuration();
        this.owner = playlistInfo.data.owner;
        this.followers = playlistInfo.data.followers.total;
        this.name = playlistInfo.data.name;
        this.description = playlistInfo.data.description;
        this.public = playlistInfo.data.public;
    }

    async fetchAlbum(uri) {
        const {data} = await get_album({uri});

        this.type = 'album';
        this.tracks = data.tracks.items.filter((i) => i);
    }

    async fetchArtist(uri) {
        const { data } = await get_artist({uri});
        const { data : topTracks } = await get_artist_top_tracks({uri});

        this.type = 'artist';
        this.name = data.name;
        this.images = data.images;

        if(!this.tracks) {
            this.tracks = topTracks.tracks;
            this.total_duration = this.totalDuration();
        }
    }

    static async getContext({uri}) {
        const instance = new this();
        if(uri.split(':').indexOf('album') >= 0) {
            await instance.fetchAlbum(uri);
        } else if(uri.split(':').indexOf('playlist') >= 0) {

            await instance.fetchPlaylist(uri);

        } else if(uri.split(':').indexOf('artist') >= 0) {
            await instance.fetchArtist(uri);
        }
        return instance;
    }

    static init({setDeviceId}) {
        console.log('____init___');

        const player = new window.Spotify.Player({
            playerInstance: new window.Spotify.Player({ name: 'Kenjicas Player_' }),
            name: 'Kenjicas Player',
            getOAuthToken: callback => callback(getSession().access_token)
        });

        console.log('instance -',player)

        player.addListener('ready', ({device_id}) => {
            setDeviceId(device_id);
            console.log('Ready - Device ID', device_id);
        });

        player.on('authentication_error', ({ message }) => {
            console.error('Failed to authenticate', message);
        });

        player.on('initialization_error', ({ message }) => {
            console.error('Failed to initialize', message);
        });

        // update status - action
        player.addListener('player_state_changed', ({ position,duration,track_window: { current_track } }) => {
            console.log({ position,duration,current_track })
        });

        player.connect();
    }
}

export default Player;
