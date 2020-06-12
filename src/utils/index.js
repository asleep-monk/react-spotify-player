export class Storage {
    setSession({access_token,token_type,expires_in}){
        const expires_at = new Date().valueOf() + 3600000;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('token_type', token_type);
        localStorage.setItem('expires_in', expires_in);
        localStorage.setItem('expires_at', expires_at);
        console.log('setsession')
    }

    removeSession(){
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_type');
        localStorage.removeItem('expires_in');
        localStorage.removeItem('expires_at');
        console.log('removesession')
    }

    isAuthenticated(){
        let expires_at = JSON.parse(localStorage.getItem('expires_at'));
        return expires_at && new Date().valueOf() < expires_at;
    }
}