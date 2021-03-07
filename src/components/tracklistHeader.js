import React from 'react';
import Styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledHeader = Styled.div`
        padding: 15px 32px;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        .artwork-wrapper {
            overflow: auto;
            width: 260px;
            .artwork {
                width: 100%;
                padding-bottom: 100%;
            }
        }

        .info {
            align-self: flex-end;
            padding: 0 25px;
            p { margin: 0; }
            .info-type {
                position: relative;
                top: 5px;
                text-transform: uppercase;
                font-weight: 500;
                font-size: 15px;
            }
            .info-name {
                font-size: 48px;
                line-height: 60px;
                padding: 0.1em 0px;
                font-weight: 600;
                margin-bottom: 0;
            }
            .info-description {
                max-width: 500px;
            }
            .info-details {
                padding: 1px 0px 13px;
                color:#aaa;
            }
            .info-tracks {
                margin-right: 4px;
            }
            .info-owner {
                font-size: 14px;
                strong { color:#fff; }
                &:after {
                    content: "•";
                    margin: 0px 4px;
                }
            }
            .info-release-date {
                &:after {
                    content: "•";
                    margin: 0px 4px;
                }
            }
            .info-artist {
                display: block;
                strong { color:#fff; }
                &:after {
                    padding: 0 6px;
                }
            }
        }

        .info-interactive {
            .play {
                cursor: pointer;
                background: #1DB954;
                border-radius: 15px;
                font-size: 11px;
                letter-spacing: 2px;
                font-weight: bold;
                width: 106px;
                padding: 4px;
                text-align: center;
            }
        }
`

const TracklistHeader = ({player,header}) => {
    const getDescription = (description) => {
        return (
            <>
                <div dangerouslySetInnerHTML={{__html: description }} />
            </>
        )
    }

    const tracksDuration = (total_duration) => {
        return (
            <span className="info-duration">
                {`- ${total_duration} hrs`}
            </span>
        )
    }

    const getSongsLenght = (tracks) => {
        return (
            <span className="info-tracks">
                {`${(tracks || []).length} songs`}
            </span>
        )
    }

    const releaseDate = (releaseDate) => <span className="info-release-date">{releaseDate}</span>

    const {
        tracks,
        image,
        name,
        description,
        owner,
        total_duration,
        type
    } = header;

    return (
        <StyledHeader className="tracklist-header">
            {(image && image.url &&
                <div className="artwork-wrapper">
                    <div className="artwork" style={
                        { backgroundImage: `url(${image.url})`, backgroundSize :'cover', backgroundPosition:'center center' }
                    }></div>
                </div>
            )}
            <div className="col info d-flex flex-column">
                <strong className="info-type">{type}</strong>
                <h3 className="info-name">{name}</h3>
                    {getDescription(description)}
                <div className="info-details">
                    {
                        (owner || {}).display_name && (
                            <span className="info-owner">
                                Created by <strong>{(owner || {}).display_name}</strong>
                            </span>
                        )
                    }
                    {
                        (type === 'album' && header.artists.length) && (
                            <span className="info-artist">
                                By <strong>{(header.artists || [])[0].name}</strong>
                            </span>
                        )
                    }
                    { type === 'album' && releaseDate((header || {}).releaseDate)}
                    { type !== 'artist' && getSongsLenght(tracks) }
                    { type !== 'artist' && total_duration && tracksDuration(total_duration) }
                </div>
                <div className="info-interactive">
                    <div className="play" onClick={ () => { player.play({uris : (tracks || []) })}}> PLAY </div>
                </div>
            </div>
        </StyledHeader>
    )
}

TracklistHeader.propTypes = {
    player : PropTypes.object,
    header : PropTypes.object
}

export default TracklistHeader
