# 🎓 College Project Hub

> **A centralized platform to collect, manage, evaluate, and showcase all college projects in one application.**

College Project Hub is a web-based project management and showcase platform designed for colleges. It brings student projects, academic organization, project submissions, teacher evaluation, and project previews together into a single application.

## 📌 Project Theme

In a college environment, projects are often scattered across different repositories, drives, documents, and individual systems.

This project aims to create **one centralized application where every college project can be stored and accessed**.

The platform allows:

- Teachers to manage academic structures.
- Teachers to create years, sections, teams, and team leads.
- Team leads to securely upload their project.
- Teachers to review and rate submitted projects.
- Students to browse all available projects.
- Teachers to preview submitted projects directly from the platform.
- Team leads to receive their project evaluation through their registered college email.

---

# 🚀 Core Features

## 1. 📊 Dashboard

The main dashboard provides access to the major features of the platform.

### Main sections

- Dashboard
- Upload Project
- All Projects
- Teacher Portal
- Authentication

The dashboard acts as the central navigation point for the application.

---

# 👨‍🏫 2. Teacher Portal

The **Teacher Portal** is a protected section of the application.

Only authorized teachers can access it using teacher authentication.

### Teacher Portal Sections

```text
Teacher Portal
│
├── All Projects
├── Rated Projects
├── Unrated Projects
└── Academic Management
```

## 2.1 📁 All Projects

This page displays every project uploaded by students/team leads.

Each project contains information such as:

- Project name
- Team members
- Team lead
- Year
- Section
- Project URL
- Project preview
- Rating status

Teachers can open the submitted project directly from the platform.

### Project Preview

The submitted project URL is used to display a preview of the project inside the teacher portal.

This allows teachers to inspect the project before evaluating it.

---

## 2.2 ⭐ Rated Projects

This section contains projects that have already been evaluated by a teacher.

The teacher can view:

- Project name
- Team
- Team members
- Team lead
- Rating
- Evaluation criteria
- Evaluation details
- Project preview

This provides teachers with a centralized history of evaluated projects.

---

## 2.3 ⏳ Unrated Projects

This section contains projects that have not yet been evaluated.

The teacher can select an unrated project and evaluate it.

### Evaluation Criteria

The rating system can include criteria such as:

- Technical Approach
- UI/UX Design
- Design Thinking
- Functionality
- Innovation
- Project Quality
- Problem Solving
- Overall Performance

The exact evaluation criteria can be configured according to the college requirements.

### 📧 Automatic Rating Notification

After the teacher submits a project rating:

```text
Teacher
   │
   ▼
Evaluate Project
   │
   ▼
Submit Rating
   │
   ▼
Save Rating
   │
   ▼
Find Team Lead Email
   │
   ▼
Send Evaluation Email
```

The rating is automatically sent to the **verified team lead email address** associated with the project.

The email can contain:

- Project name
- Team details
- Rating
- Evaluation criteria
- Teacher feedback
- Overall score

---

# 🏫 2.4 Academic Management

Academic Management is one of the most important features of the Teacher Portal.

Teachers can create and manage the complete academic hierarchy.

```text
Year
  │
  └── Section
        │
        └── Team
              │
              └── Team Lead
```

## Academic Structure

### Year

Teachers can create academic years.

Example:

```text
2026
2027
2028
```

### Section

Each year can contain multiple sections.

Example:

```text
2026
│
├── CSE-A
├── CSE-B
├── CSE-C
└── CSE-D
```

### Team

Each section can contain multiple teams.

Example:

```text
2026
└── CSE-B
    ├── Team 01
    ├── Team 02
    ├── Team 03
    └── Team 04
```

Each team contains its members.

### Team Lead

Every team must have exactly one designated team lead.

When creating a team, the teacher must provide:

- Team name
- Team members
- Team lead name
- Team lead email

The **team lead email is mandatory**.

---

# 🔐 Team Lead Credentials

When a teacher creates a team, the system generates credentials for the team lead.

The credentials include:

```text
Team Lead Email
Password
```

The generated password is sent to the team lead's registered college email.

Example:

```text
Team Lead: Rahul Kumar
Email: rahul@rguktsklm.ac.in

Generated Password:
************
```

The team lead uses these credentials to access the project-upload system.

---

# 🗑️ Academic Data Deletion

Teachers can delete individual academic entities.

Supported deletion:

- Delete Year
- Delete Section
- Delete Team
- Delete Team Lead

## Cascading Deletion

If a teacher deletes a year:

```text
Delete Year
     │
     ├── Delete Sections
     │       │
     │       └── Delete Teams
     │               │
     │               └── Delete Team Members / Team Lead
     │
     └── Delete Related Data
```

All related sections and teams associated with that year are automatically deleted.

Because these operations can remove significant amounts of data, the system should display a **confirmation dialog before deletion**.

The same confirmation mechanism should be used when deleting:

- Sections
- Teams
- Team Leads

---

# 📤 3. Upload Project

The Upload Project section is specifically designed for **team leads**.

A team lead must authenticate before uploading a project.

## Upload Authentication Flow

```text
Upload Project
      │
      ▼
Enter College Email
      │
      ▼
Check Team Lead Database
      │
      ├── Email Not Found
      │       │
      │       └── Access Denied
      │
      └── Email Found
              │
              ▼
        Enter Password
              │
              ▼
        Verify Password
              │
        ├── Incorrect
        │      │
        │      └── Access Denied
        │
        └── Correct
               │
               ▼
         Project Upload
```

## 🏷️ Automatic Team Information

The team lead should **not manually enter information that already exists in the academic database**.

After successful authentication, the system automatically retrieves:

- Year
- Section
- Team
- Team members
- Team lead
- Team lead email

For example:

```text
Year       : 2026
Section    : CSE-B
Team       : Team 05

Team Lead  : Rahul Kumar
Email      : rahul@rguktsklm.ac.in

Members:
- Rahul Kumar
- Akash
- Sai
- Kiran
```

The team lead only needs to provide the project-specific information.

---

# 🌐 Project URL

During project submission, the team lead provides the **project URL**.

This URL is important because teachers should be able to preview the submitted project directly from the platform.

Example:

```text
Project Name:
College Management System

Project URL:
https://example-project.vercel.app
```

---

# 🚫 One-Time Project Submission

Each team can upload **only one project**.

Once a team has successfully submitted a project:

```text
Team
 │
 ▼
Project Uploaded
 │
 ▼
Upload Again?
 │
 └── ❌ Not Allowed
```

If the team lead tries to upload another project, the system should display:

> You have already uploaded your project.

The application should also show the previously submitted project.

---

# 👨‍🎓 4. All Projects

The **All Projects** page is publicly accessible to students and other authorized users.

It acts as the central project showcase.

Users can browse projects submitted by different teams.

## Project Information

Each project can display:

- Project name
- Project description
- Year
- Section
- Team
- Team members
- Team lead
- Project preview
- Project URL
- Rating status

Depending on privacy requirements, some information such as team lead email can remain hidden from public users.

---

# 📧 College Email Restriction

One of the major system constraints is that authentication must use the official college email domain.

### Allowed domain

```text
@rguktsklm.ac.in
```

For example:

```text
student@rguktsklm.ac.in
teacher@rguktsklm.ac.in
```

## Email Validation

The system must reject emails that do not belong to the college domain.

### Valid

```text
rahul@rguktsklm.ac.in
teacher@rguktsklm.ac.in
student123@rguktsklm.ac.in
```

### Invalid

```text
rahul@gmail.com
student@yahoo.com
teacher@outlook.com
```

This validation should be performed **on the backend**, not only on the frontend.

---

# 🔐 Authentication Architecture

There are two different authentication systems.

## Teacher Authentication

Teachers use:

```text
College Email
+
Teacher Password
```

Teacher accounts have access to:

- Teacher Dashboard
- All Projects
- Rated Projects
- Unrated Projects
- Academic Management
- Project Evaluation

## Team Lead Authentication

Team leads use:

```text
College Email
+
Generated Password
```

Team leads have access to:

- Project Upload
- Previously Submitted Project
- Submission Status

Team leads **must not** have access to:

- Teacher Portal
- Academic Management
- Project Ratings
- Other teams' project management

---

# 🔒 Authorization

Authentication and authorization should be separated.

Example roles:

```text
TEACHER
TEAM_LEAD
PUBLIC
```

### Permission Matrix

| Feature | Public | Team Lead | Teacher |
|---|:---:|:---:|:---:|
| View Projects | ✅ | ✅ | ✅ |
| Upload Project | ❌ | ✅ | ❌ |
| View Own Submission | ❌ | ✅ | ✅ |
| View All Projects | ✅ | ✅ | ✅ |
| Rate Projects | ❌ | ❌ | ✅ |
| View Rated Projects | ❌ | ❌ | ✅ |
| View Unrated Projects | ❌ | ❌ | ✅ |
| Academic Management | ❌ | ❌ | ✅ |
| Create Year | ❌ | ❌ | ✅ |
| Create Section | ❌ | ❌ | ✅ |
| Create Team | ❌ | ❌ | ✅ |
| Delete Academic Data | ❌ | ❌ | ✅ |

---

# 🗄️ Suggested Database Structure

A possible database design is:

```text
Users
│
├── Teachers
│
└── Team Leads

Academic Years
│
└── Sections
      │
      └── Teams
            │
            ├── Team Members
            │
            └── Team Lead

Projects
│
├── Project Information
├── Team Reference
├── Project URL
├── Submission Status
└── Rating

Ratings
│
├── Project Reference
├── Teacher Reference
├── Technical Approach
├── UI/UX
├── Design Thinking
├── Other Criteria
├── Overall Rating
└── Feedback
```

## Suggested Entities

```text
Teacher
TeamLead
Year
Section
Team
TeamMember
Project
Rating
```

---

# 🔄 Complete System Flow

```text
                         COLLEGE PROJECT HUB
                                  │
                ┌─────────────────┼─────────────────┐
                │                 │                 │
                ▼                 ▼                 ▼
           PUBLIC USERS       TEAM LEADS        TEACHERS
                │                 │                 │
                ▼                 ▼                 ▼
          All Projects       Login              Teacher Login
                                  │                 │
                                  ▼                 ▼
                         Upload Project       Teacher Portal
                                  │                 │
                                  │        ┌────────┼─────────┐
                                  │        │        │         │
                                  │        ▼        ▼         ▼
                                  │      All     Rated    Unrated
                                  │    Projects  Projects  Projects
                                  │                          │
                                  │                          ▼
                                  │                       Rating
                                  │                          │
                                  │                          ▼
                                  │                    Email Team Lead
                                  │
                                  ▼
                           Project Database
```

---

# 🏗️ Recommended Technology Stack

## Frontend

```text
React
Vite
TypeScript
Tailwind CSS
React Router
Axios
Lucide React
```

## Backend

```text
Node.js
Express.js
TypeScript
JWT Authentication
```

## Database

```text
MongoDB
```

## Email

```text
Nodemailer
SMTP
```

## Project Preview

```text
iframe
```

can be used where permitted by the deployed project's security headers.

---

# 📁 Suggested Project Structure

```text
college-project-hub/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── routes/
│   │   └── App.tsx
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── config/
│   │   └── server.ts
│   │
│   └── package.json
│
├── README.md
└── .gitignore
```

---

# 🛡️ Security Requirements

Security is especially important because the application contains teacher credentials, team lead credentials, academic data, and project evaluations.

### Password Security

Passwords must never be stored as plain text.

Use a password hashing algorithm such as:

```text
bcrypt
```

### Authentication

Use secure authentication such as:

```text
JWT
```

with appropriate expiration and refresh/session handling.

### Backend Authorization

Do not rely on frontend route protection alone.

Every protected API endpoint must verify the user's role.

Example:

```text
POST /api/projects
        │
        ▼
Authenticate User
        │
        ▼
Check Role
        │
        ├── TEAM_LEAD → Continue
        │
        └── Other → Reject
```

### Email Validation

The backend should enforce the college domain along with proper email-format validation.

---

# 📬 Email Notifications

The application should automatically send emails for important events.

## Team Creation

```text
Team Created
     │
     ▼
Generate Password
     │
     ▼
Save Hashed Password
     │
     ▼
Send Credentials
     │
     ▼
Team Lead Email
```

## Project Rating

```text
Project Rated
     │
     ▼
Save Rating
     │
     ▼
Get Team Lead Email
     │
     ▼
Send Evaluation Email
```

---

# 📊 Example Project Status

Every project can have a status:

```text
SUBMITTED
UNDER_REVIEW
RATED
```

Example:

```text
Project: Smart Campus

Status: RATED
Rating: 87/100
```

---

# 🎯 Main Objectives

The project aims to:

1. Centralize all college projects.
2. Provide a searchable project repository.
3. Simplify project submission.
4. Prevent duplicate submissions.
5. Provide teachers with a dedicated evaluation portal.
6. Digitize project evaluation.
7. Automatically notify team leads about evaluations.
8. Organize students according to year, section, and team.
9. Provide secure role-based authentication.
10. Create a long-term repository of college projects.

---

# 🔮 Future Enhancements

Possible future features include:

- 🔍 Project search
- 🏷️ Project categories
- 🔖 Project tags
- ⭐ Public project ratings
- 📈 Teacher analytics dashboard
- 📊 Department-wise statistics
- 📥 Project report/PDF upload
- 💻 GitHub repository integration
- 🔗 Live deployment detection
- 🖼️ Automatic project thumbnails
- 🔎 Advanced filtering
- 🏆 Best project leaderboard
- 📜 Project certificates
- 📱 Mobile responsive interface
- 🔔 Notification system
- 📧 Email reminders for pending evaluations
- 🗃️ Project archive by academic year
- 📤 Export academic/project data
- 🔐 Two-factor authentication for teachers

---

# ⚙️ Important Business Rules

1. Only `@rguktsklm.ac.in` email addresses can be used for authentication.
2. Only teachers can access the Teacher Portal.
3. Every team must have exactly one team lead.
4. Team lead email is mandatory when creating a team.
5. Team lead credentials are generated by the teacher.
6. Team lead credentials are sent through the registered college email.
7. Passwords must be stored securely using hashing.
8. A team can submit only one project.
9. A team lead cannot submit another project after successful submission.
10. Project information related to the team should be automatically populated.
11. Teachers can rate submitted projects.
12. Rated projects move to the Rated Projects section.
13. Unrated projects remain in the Unrated Projects section.
14. Rating results are automatically emailed to the team lead.
15. Deleting a year deletes its dependent academic data after confirmation.
16. Deleting sections, teams, or team leads requires confirmation.
17. Teachers can manage the complete academic hierarchy.
18. Team leads cannot access teacher functionality.

---

# 🧑‍💻 Development Roadmap

## Phase 1 — Foundation

- [ ] Initialize frontend
- [ ] Initialize backend
- [ ] Configure database
- [ ] Configure environment variables
- [ ] Create basic UI
- [ ] Configure routing

## Phase 2 — Authentication

- [ ] Teacher authentication
- [ ] Team lead authentication
- [ ] Email-domain validation
- [ ] Password hashing
- [ ] Role-based authorization
- [ ] Protected routes

## Phase 3 — Academic Management

- [ ] Year management
- [ ] Section management
- [ ] Team management
- [ ] Team member management
- [ ] Team lead management
- [ ] Credential generation
- [ ] Credential email

## Phase 4 — Project Submission

- [ ] Team lead login
- [ ] Project upload
- [ ] Automatic team information
- [ ] Project URL
- [ ] One-time submission restriction
- [ ] Submission status

## Phase 5 — Teacher Portal

- [ ] All projects
- [ ] Unrated projects
- [ ] Project evaluation
- [ ] Rated projects
- [ ] Teacher dashboard
- [ ] Project preview

## Phase 6 — Notifications

- [ ] Team creation email
- [ ] Credential email
- [ ] Rating notification
- [ ] Teacher feedback email

## Phase 7 — Public Project Showcase

- [ ] All projects page
- [ ] Project cards
- [ ] Project details
- [ ] Search
- [ ] Filtering
- [ ] Project preview

## Phase 8 — Security & Deployment

- [ ] API security
- [ ] Role authorization
- [ ] Input validation
- [ ] Rate limiting
- [ ] Error handling
- [ ] Production configuration
- [ ] Deployment
- [ ] Database backup

---

# 📄 License

This project is developed as a college project for academic and educational purposes.

---

# 👥 Contributors

```text
Project Team
Rajiv Gandhi University of Knowledge Technologies, Srikakulam
Department of Computer Science and Engineering
```

---

# ⭐ Project Vision

> **One College. One Platform. Every Project.**

College Project Hub is intended to become a centralized digital repository where student projects can be **submitted, evaluated, organized, discovered, and preserved** throughout the academic lifecycle.
