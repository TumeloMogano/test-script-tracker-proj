# Test Script Tracker

## 📌 Project Overview
Test Script Tracker is a tracking and process management system designed to transition manual test script management processes to a semi-automated system. It enables the standardization of test script creation and management through centralized access and team collaboration, allowing users to efficiently manage projects and test scripts related to different clients.

## 🚀 Features
- 📂 **Project & Test Script Management** – Create, update, and track test scripts within projects.
- 🔑 **Role-Based Access** – Different roles such as Testers, Team Leads, and Managers with specific dynamic permissions.
- 📝 **Test Execution Tracking** – Monitor test script progress and execution status.
- 📊 **Analytics & Reports** – View test execution reports and project statistics.
- 🔄 **Collaboration** – Team members can collaborate on test scripts and make monitored updates in real-time.
- 📱 **Mobile Accessibility** – Available as a mobile app for easy tracking on the go (Ionic).

## 🏗️ Tech Stack
### **Frontend (Angular)**
- Angular
- TypeScript
- RxJS
- PrimeNG & Angular Material

### **Backend (ASP.NET Core Web API)**
- ASP.NET Core
- Entity Framework Core (ORM)
- MS SQL Server (Database)
- Identity & JWT Authentication

### **Other Technologies & Tools**
- Git & GitHub
- Azure (Deployment)
- Swagger (API Documentation)

## 📸 Screenshots
> *(Click the link below to view all project screenshots)*
📄 [View Screenshots (PDF)](docs/images/Project-Screenshots.pdf) 

## ⚙️ Installation & Setup
### **1. Clone the Repository**
```sh
 git clone https://github.com/tumelomogano/test-script-tracker-proj.git
 cd test-script-tracker-proj
```

### **2. Backend Setup (ASP.NET Core API)**
```sh
 cd backend
 dotnet restore
 dotnet build
 dotnet run
```
- Ensure **MS SQL Server** is running and configured in `appsettings.json`.
- The API should now be running on `http://localhost:7089` (or as configured).

### **3. Frontend Setup (Angular)**
```sh
 cd frontend
 npm install
 ng serve
```
- The Angular app should now be running on `http://localhost:4200`.

## 🔗 API Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | /api/projects/GetAllProjects | Get all projects |
| POST | /api/projects/CreateProject | Create a new project |
| PUT | /api/projects/UpdateProject/{id} | Update a project |
| DELETE | /api/projects/RemoveProject/{id} | Delete a project |

*(More detailed API documentation available via Swagger at `http://localhost:7089/swagger`)*

## 🔄 Deployment
- **Frontend**: Deployed via Azure Static Web App.
- **Backend**: API hosted on Azure App Service instance.
- **Database**: SQL Server managed via Azure Database for MS SQL Server.
- **Hosted instance taken down after project completion and marking completion.**

## 📧 Contact
- **Developer:** [Collaborately developed school project. I was responsible for the backend architecture, full stack authentication and authorization policies using Identity and JWT Auth. I also took full responsibility for setting up the deployment environment for both the frontend and backend utilising Github Actions CI/CD pipeline. ]
- **Email:** [ramalau.mogano1@gmail.com]
- **LinkedIn:** [linkedin.com/in/rtmogano]

---


