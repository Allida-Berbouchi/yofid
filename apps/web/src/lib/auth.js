export function saveAccessToken(token) {
    localStorage.setItem("access_token", token);
}
export function getAccessToken() {
    return localStorage.getItem("access_token");
}
