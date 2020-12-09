import { combineReducers } from 'redux';

const GET_USER = 'GET_USER';
const GET_PLAYLISTS = 'GET_PLAYLISTS';
const SET_VIEW = 'SET_VIEW';
const GET_VIEW = 'GET_VIEW';
const CLEAR_VIEW = 'CLEAR_VIEW';
const GET_PLAYER = 'GET_PLAYER';
const SET_CURRENT_STATE = 'SET_CURRENT_STATE';
const GET_RECENTLY_TRACKS = 'GET_RECENTLY_TRACKS';
const GET_FEATURED_PLAYLISTS = 'GET_FEATURED_PLAYLISTS';
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const ISLOGGED = 'ISLOGGED';

const userReducer = (state={},action) => {
    if(action.type === GET_USER) {
        return { ...state , ...action.payload };
    }
    if(action.type === LOGOUT) {
        return {};
    }
    return state;
}

const featuredPaylistReducer = (state={},action) => {
    if(action.type === GET_FEATURED_PLAYLISTS) {
        return { ...state , ...action.payload };
    }
    return state;
}

const playlistsReducer = (state={},action) => {
    if(action.type === GET_PLAYLISTS) {
        return { ...state , ...action.payload };
    }
    if(action.type === LOGOUT) {
        return {};
    }
    return state;
}

const loginReducer = (state={},action) => {
    if(action.type === ISLOGGED) {
        return action.payload;
    }
    if(action.type === LOGIN) {
        return action.payload;
    }
    if(action.type === LOGOUT) {
        return action.payload;
    }
    return state;
}

const uriReducer = (state='home',action) => {
    if(action.type === SET_VIEW) {
        return action.payload;
    }
    return state;
}

const viewReducer = (state=[],action) => {
    if(action.type === GET_VIEW) {
        return action.payload || null;
    }
    if(action.type === CLEAR_VIEW ) {
        return null;
    }
    return state;
}

const playerReducer = (state={},action) => {
    if(action.type === GET_PLAYER) {
        return action.payload;
    }
    return state;
}

const currentStateReducer = (state={},action) => {
    if(action.type === SET_CURRENT_STATE) {
        return action.payload;
    }
    if(action.type === GET_RECENTLY_TRACKS) {
        return {
            current_track : action.payload
        };
    }
    return state;
}

export default combineReducers({
    user : userReducer,
    logged : loginReducer,
    playlists : playlistsReducer,
    uri : uriReducer,
    view : viewReducer,
    player : playerReducer,
    featured_paylists : featuredPaylistReducer,
    current_state : currentStateReducer
});
