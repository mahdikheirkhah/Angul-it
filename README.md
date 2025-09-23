# Angul-It: A Dynamic Captcha Application 🛡️

A multi-stage, dynamic captcha application built with the latest version of Angular. This project demonstrates a complete, modern web application from development to containerization, featuring animations, responsive design, and a full suite of unit tests.



## 🎯 Purpose

The primary purpose of this project is to create a user-friendly yet bot-resistant verification system. It serves as a comprehensive example of building a full-featured Angular application, including:
-   Component-based architecture
-   Service-based state management
-   Advanced animations
-   Responsive design principles
-   Unit testing with Karma and Jasmine
-   Production deployment with Docker and Nginx

## ✨ Features

* **Dynamic Challenges**: Each session generates a random number of challenges (from 3 to 6) with randomized types.
* **Multiple Challenge Types**: Includes math problems (addition and subtraction) and text recognition.
* **Bot-Resistant SVGs**: Challenges are rendered as SVG images with visual noise, making them difficult for simple bots to scan.
* **Session Persistence**: Your progress is saved in `localStorage`, so you can refresh the page and continue where you left off.
* **Fluid Animations**: Smooth transitions between pages and individual challenges.
* **Responsive Design**: A clean and functional UI that works on desktops, tablets, and mobile devices.
* **Tested Codebase**: Includes a suite of unit tests to ensure the application's logic is reliable.
* **Dockerized for Production**: Comes with a multi-stage `Dockerfile` for building a small, efficient, and production-ready Nginx container.

## 🛠️ Technologies Used

* **Angular**
* **TypeScript**
* **Nginx**
* **Docker**

## 🚀 Getting Started

You can run this project in two ways: locally for development or as a Docker container for a production-like environment.

### Prerequisites

**For Development (Without Docker):**
* [Node.js](https://nodejs.org/) (LTS version recommended)
* [Angular CLI](https://angular.dev/cli) (`npm install -g @angular/cli`)

**For Production (With Docker):**
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---
### Running the Application


#### 1. Clone the repository
```bash
git clone <your-repository-url>
```
#### 2. Navigate to the project directory
```bash
cd Angul-It
```

### Without Docker (Development Mode):
This method is best for making code changes.

#### 3. Install the dependencies
```bash
npm install
```

#### 4. Run the development server
```bash
ng serve
```

### With Docker (Production Mode):

#### 3. Build the Docker image
##### This may take a few minutes the first time.
```bash
docker build -t angul-it .
```

#### 4. Run the container from the image
```bash
docker run -p 8080:80 angul-it
```

### Unit test:

#### 3. Install the dependencies
```bash
npm install
```

#### 4. Run the unit tests
```bash
ng test
```

