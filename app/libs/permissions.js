export const permissions = {
    ADMIN: ['view', 'edit_users', 'remove_users', 'promote_users', 'remove_tasks', 'remove_teams'],
    LEADER: ['create_team', 'add_member', 'remove_member', 'promote_members', 'view_progress', 'view_main_timeline', 'add_task', 'remove_task', 'edit_task', 'approve_task', 'reject_task', 'add_remark_to_task'],
    MEMBER: ['modify_task_content', 'view_progress', 'view_main_timeline', 'view_tasks', 'edit_profile', 'leave_team']
}