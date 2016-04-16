export const AUTH_HEADER = 'X-AUTH-TOKEN';
const AUTH_TOKEN_KEY = 'authToken';

class AuthStore {
    constructor() {
        this.token = localStorage.getItem(AUTH_TOKEN_KEY);
    }

    setToken = (tok) => {
        this.token = tok;
        if (tok) {
            localStorage.setItem(AUTH_TOKEN_KEY, tok);
        } else {
            localStorage.removeItem(AUTH_TOKEN_KEY);
        }
    };

    getToken = () => {
        return this.token;
    };
}

export const Auth = new AuthStore();