export function canCreateResource(role) {
    // For now, allow authenticated students and professors to create resources
    // Professors, admins, and moderators can always create resources
    // In future, students will need verification
    return role === "professor" || role === "admin" || role === "moderator" || role === "student";
}
export function canApprove(role) {
    return role === "moderator" || role === "admin";
}
export function canInvite(role) {
    return role === "professor" || role === "admin" || role === "moderator";
}
