import React from "react";
import { connect } from "react-redux";

import './style.scss';

import {
    logout,
    getUser,
    getPlaylists,
    setView,
    getPlayer
} from "../../actions";

import View from "../view";
import Login from "../login";
import Menu from "../menu";
import NowPlayingBar from "../nowPlayingBar";

class Main extends React.Component {
    constructor() {
        super();
        /**
         * Aplication Initiated Flag
         * @type {Boolean}
         */
        this.initiated = false;
    }
    /**
     * Initial configuration
     * @function run
     * @return {Void}
     */
    run() {
        this.props.getPlayer();
        this.initiated = true;
    }
    UNSAFE_componentWillUpdate() {
        !this.initiated  && this.props.logged.status === true && this.run();
    }
    componentDidMount() {
        window.onSpotifyWebPlaybackSDKReady = () => {
            const lastPage = window.localStorage.getItem('last_uri');
            // Seta a primeira view
            this.props.setView(lastPage ? { uri : lastPage} : '');
        };
    }
    onSearchChange(ev) {
        console.log(ev);
    }
    render() {
        const {
            logged,
            uri,
            tracks,
            getPlaylists,
            logout,
            setView,
            playlists
        } = this.props;

        if(!logged.status) {
            return <Login />;
        } else {
            return (
                <div className="main">
                    <div className="menu-wrapper">
                        <Menu
                            getPlaylists={getPlaylists}
                            logout={logout}
                            setView={setView}
                            playlists={playlists}
                            uri={uri}
                        />
                    </div>
                    <div className="browser-wrapper">
                        {/* <a class="github" href="https://github.com/kenjikatahira/react-spotify-player" target="_blank" rel="noopener noreferrer" >
                            <img loading="lazy" width="149" height="149" src="https://github.blog/wp-content/uploads/2008/12/forkme_right_white_ffffff.png?resize=149%2C149" class="attachment-full size-full" alt="Fork me on GitHub" data-recalc-dims="1" />
                        </a> */}
                        <div className="browser-inner-wrapper">
                            <View
                                uri={uri}
                                tracks={tracks}
                            />
                        </div>
                    </div>
                    <div className="now-playing-wrapper">
                        <NowPlayingBar />
                    </div>
                </div>
            );
        }

    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        logged: state.logged,
        playlists: state.playlists,
        uri: state.uri
    };
};

export default connect(mapStateToProps, {
    logout,
    getUser,
    getPlaylists,
    setView,
    getPlayer
})(Main);