# Agile Board

This repository contains only the time tracker codebase for PC (linux/os/windows)
Please see other repositories to find all system apps (see tech stack section)

## About AgileBoard
AgileBoard is an innovative, open-source project management web application designed to streamline the complexities of <b>project and task management</b> for teams of any size. At its core, AgileBoard offers a dynamic platform for creating, organizing, and tracking tickets across various milestones or sprints, enabling teams to focus on what matters most - delivering value.

With the Agile board, teams can visualize their active sprints in a fully customizable interface, adapting the board to fit the unique workflow and processes of each project. This visual representation not only simplifies project oversight but also enhances team collaboration and productivity by providing a clear overview of task progress and dependencies.

AgileBoard goes beyond traditional project management tools by incorporating a Knowledge Base module. This feature allows teams to curate and access vital project-related articles, documents, and information, ensuring that valuable insights and resources are always within reach.

Understanding the importance of efficient resource management, AgileBoard includes a comprehensive calendar module. This tool assists in scheduling, planning, and managing team members, facilitating optimal allocation of human resources across tasks and projects.

The latest addition to AgileBoard's suite of features is the <b>time tracking</b> capability. Users can now effortlessly record their work hours manually or utilize the convenience of our computer and mobile applications for automatic time logging. This feature not only enhances project billing and accounting practices but also provides invaluable data for analyzing productivity and optimizing workflows.

AgileBoard is more than a project management tool; it's a companion in your journey towards agile excellence. By embracing AgileBoard, teams can harness the power of agility, collaboration, and information to drive project success and achieve their goals.

#### AgileBoard tech stack:
backend is based on Laravel framwework [backend repository](https://github.com/fenzelek/agileboard_backend.git)
frontend: AngularJS  [frontend repository](https://github.com/fenzelek/agileboard_frontend.git)
time tracking app: Angular electron [timetracker PC repository](https://github.com/fenzelek/agileboard_timetracker_pc.git)
time tracking mobile app : Xamarin

### SPONSORS
### **[Denkkraft](https://denkkraft.eu/)**

### Security Vulnerabilities
If you discover a security vulnerability within Laravel, please send an e-mail to [opensource@denkkraft.eu](mailto:opensource@denkkraft.eu) . All security vulnerabilities will be promptly addressed.

# License
The Agile Board is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT)

# HOW TO RUN

Versions:
node => v14.17.0


First, install all dependencies:
```
npm start
```  

To run app in Cordova:  
```
npm run cordova
```  

To run app in Electron:  
```
npm run electron
```

To build electron app:  
```
npm run build:{build name}
```  

(builds listed below; build names between "")  

List of currently available desktop builds:  
- "linux" (deb)  
- "windows"

## Linux/deb build  
To build application on linux/deb you need to install the following deps:  
```
sudo apt install dpkg
sudo apt install fakeroot
```

Then run:
```
npm run build:linux
```  

## Android build
see /cordova/readme.md

##run Fake Api
npm run mock:server
