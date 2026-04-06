export function canCreateResource(role) {
    
    return role === "professor" || role === "admin" || role === "moderator" || role === "student";
}
export function canApprove(role) {
    return role === "moderator" || role === "admin";
}
export function canInvite(role) {
    return role === "professor" || role === "admin" || role === "moderator";
}
