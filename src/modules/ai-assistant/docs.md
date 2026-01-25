# Team Manager Application – Source Documentation

App URL: https://teammngr.netlify.app  
App Type: Team collaboration and project management platform  
Frontend: React (React Router)  
Auth: Required (Login / Register)

---

## Application Access Rules

- New users must register or log in to access the application
- Unauthenticated users can access only the auth page
- After login, users are redirected to the home page
- All routes except auth are protected

---

## Route Overview

### Route: /

Purpose: Authentication entry point  
Content:

- Login form
- Register form

Behavior:

- If user is authenticated, redirect to /home
- If not authenticated, show login and register

---

### Route: /home

Purpose: Main dashboard after login

Content:

- List of teams user belongs to
- Option to create a new team
- Option to join an existing team using team ID

Behavior:

- If user has no teams, show empty state
- Empty state allows:
  - Create new team
  - Join a team

---

## Team Routes

### Route: /home/team/:teamId

Purpose: Team dashboard

Content:

- Team overview
- Tabs:
  - Projects
  - Members
  - Settings (admin only)
- Team chat access (chat icon)

Access Rules:

- Only team members can access
- Settings tab visible only to admin

---

## Team Chat

### Route: /home/team/:teamId/chat

Purpose: Real-time team communication

Content:

- Team-wide chat
- Messages visible to all team members

---

## Projects

### Route: /home/team/:teamId

Section: Projects tab

Content:

- List of projects under the team
- Admin and managers can create projects

---

### Route: /home/team/:teamId/project/:projectId

Purpose: Project workspace

Content:

- Task list
- Kanban board
- Grid or list view toggle

---

## Task Management

Task States:

- Todo
- In Progress
- Done

Permissions:

- Members:
  - Move tasks between states
  - Mark tasks as todo, in progress, or done
- Managers and Admins:
  - Create tasks
  - Delete tasks

---

## Members Management

### Route: /home/team/:teamId

Section: Members tab

Content:

- List of team members
- Roles: Admin, Manager, Member

Permissions:

- Admin:
  - Remove members
  - Promote member to manager
  - Demote manager to member
- Managers:
  - Cannot change roles
- Members:
  - View only

---

## Team Settings

### Route: /home/team/:teamId

Section: Settings tab

Access:

- Admin only

Permissions:

- Delete team
- Manage team-level configurations

---

## Roles and Permissions Summary

Admin:

- Full access
- Delete team
- Manage members and roles
- Create and delete tasks

Manager:

- Create and delete tasks
- Cannot delete team
- Cannot manage roles

Member:

- View teams and projects
- Update task status
- Cannot create or delete tasks

---

## Error Handling

### Route: \*

Purpose: Page not found

Content:

- 404 error page
- Displayed for undefined routes

---

## Notes for AI Support

- Frontend routes are client-side only
- Business rules are enforced by backend APIs
- UI visibility depends on user role
- Permissions are role-based and team-scoped
