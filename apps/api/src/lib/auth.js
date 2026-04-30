const ACCESS_TOKEN_KEY = "access_token";

function canUseStorage() {
    return typeof window !== "undefined" && !!window.localStorage;
}

export function saveAccessToken(token) {
    if (!canUseStorage() || !token) {
        return;
    }
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getAccessToken() {
    if (!canUseStorage()) {
        return null;
    }
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function removeAccessToken() {
    if (!canUseStorage()) {
        return;
    }
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}
