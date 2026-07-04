# IT Asset Management System (ITAMS)

## Project Overview

The IT Asset Management System (ITAMS) is a web-based application developed to manage and track IT assets within an organization. The system provides a centralized platform for registering, assigning, monitoring, maintaining, and retiring IT assets such as laptops, desktops, printers, servers, routers, and software licenses.

The project also incorporates DevOps practices including Continuous Integration, Continuous Deployment (CI/CD), containerization, orchestration, and monitoring to ensure efficient software delivery and system reliability.

---

## Objectives

* Track and manage IT assets efficiently.
* Maintain asset assignment records.
* Monitor asset maintenance activities.
* Generate inventory and utilization reports.
* Automate deployment using DevOps tools.
* Improve operational efficiency and asset visibility.

---

## Features

### Asset Management

* Add new assets
* Update asset information
* View asset inventory
* Retire outdated assets
* Search assets

### Asset Assignment

* Assign assets to employees
* Reassign returned assets
* Track asset ownership history

### Maintenance Management

* Report asset issues
* Create maintenance requests
* Track repair status
* Maintain repair history

### User Management

* Admin management
* Employee management
* Technician management
* Role-Based Access Control (RBAC)

### Reporting

* Asset Inventory Report
* Assigned Assets Report
* Maintenance Report
* Retired Assets Report

---

## User Roles

### Admin

* Manage users
* Manage assets
* Generate reports
* Monitor system activities

### Asset Manager

* Register assets
* Assign assets
* Update asset details
* Track inventory

### Employee

* View assigned assets
* Report issues
* Request asset return

### Technician

* View maintenance requests
* Update repair status
* Close maintenance tasks

---

## System Workflow

Login
→ Dashboard
→ Add Asset
→ Asset Inventory
→ Assign Asset
→ Employee Uses Asset
→ Issue Reporting
→ Maintenance
→ Return Asset
→ Available for Reassignment
→ Retire Asset
→ Generate Reports

---

## Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* React.js (Optional)

### Backend

* Spring Boot (Java)
* REST APIs

### Database

* MySQL

### DevOps Tools

* Git
* GitHub
* Jenkins
* Docker
* Kubernetes
* Prometheus
* Grafana

---

## DevOps Pipeline

Developer
→ GitHub Repository
→ Jenkins Build
→ Automated Testing
→ Docker Image Creation
→ Docker Hub
→ Kubernetes Deployment
→ Application Running
→ Prometheus Monitoring
→ Grafana Dashboard

---

## Project Structure

```text
IT-Asset-Management-System/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   └── pom.xml
│
├── database/
│   ├── schema.sql
│   └── sample-data.sql
│
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── kubernetes/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── ingress.yaml
│
├── jenkins/
│   └── Jenkinsfile
│
├── docs/
│   ├── SRS.pdf
│   ├── Design.pdf
│   └── Reports.pdf
│
├── README.md
└── LICENSE
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/IT-Asset-Management-System.git
cd IT-Asset-Management-System
```

### Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### Database Setup

```sql
CREATE DATABASE it_asset_management;
```

Import schema.sql and sample-data.sql into MySQL.

---

## Docker Deployment

Build Docker Image:

```bash
docker build -t itams .
```

Run Container:

```bash
docker run -p 8080:8080 itams
```

---

## Kubernetes Deployment

```bash
kubectl apply -f kubernetes/
```

Check deployment status:

```bash
kubectl get pods
kubectl get services
```

---

## Monitoring

### Prometheus

* Collect application metrics
* Monitor resource utilization

### Grafana

* Visualize performance metrics
* Create dashboards and alerts

---

## Reports Generated

* Asset Inventory Report
* Asset Assignment Report
* Maintenance Report
* Retired Assets Report
* User Activity Report

---

## Future Enhancements

* QR Code Asset Tracking
* Email Notifications
* Mobile Application Support
* Asset Location Tracking
* AI-Based Maintenance Prediction
* Barcode Scanning Integration

---

## Benefits

* Centralized asset management
* Improved asset tracking
* Reduced operational costs
* Better maintenance management
* Automated deployment process
* Real-time monitoring and reporting

---

## Conclusion

The IT Asset Management System (ITAMS) provides a comprehensive solution for managing organizational IT assets throughout their lifecycle. By integrating modern DevOps practices such as CI/CD, containerization, orchestration, and monitoring, the system ensures scalability, reliability, security, and efficient software delivery.

---

## Authors

Team gama

Department of Computer Science and Engineering (Data Science)

Devops Project

2026
