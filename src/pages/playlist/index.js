import React from "react";
import { connect } from "react-redux";

import './style.scss';

import { getView, setView } from "../../actions";

import TracklistHeader from "../../components/tracklist-header";
import Tracklist from "../../components/tracklist";
import Loading from "../../components/loading";

class Playlist extends React.Component {

    componentWillMount() {
        this.props.getView({
            uri: this.props.uri
        });
    }

    UNSAFE_componentWillUpdate(nextProps) {
        if (
            ((nextProps.view || {}).tracks || []).length &&
            ((this.props.view || {}).tracks || []).length &&
            this.props.uri !== nextProps.uri
        ) {
            this.props.getView({ uri: nextProps.uri });
        }
    }

    render() {
        const { tracks } = this.props.view;
        const {
            view,
            device_id,
            player
        } = this.props;

        if (tracks) {
            return (
                <div className="playlist">
                    <TracklistHeader
                        props={view}
                        player={player}
                        device_id={device_id}
                    />
                    <Tracklist
                        view={view}
                        device_id={device_id}
                    />
                </div>
            );
        } else {
            return (
                <Loading />
            );
        }
    }
}

const mapStateToProps = (state) => {
    return {
        uri: state.uri,
        view: state.view,
        player: state.player,
        device_id: state.device_id
    };
};

export default connect(mapStateToProps, {
    getView,
    setView,
})(Playlist);