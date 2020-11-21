# Marist-Syllabus-Evaluator-Cap2020

## Run Code Locally With Docker
1. Install Docker on Machine https://docs.docker.com/get-docker/
2. In terminal, clone repository `git clone https://github.com/cc12698/Marist-Syllabus-Evaluator-Cap2020`
3. Using the `cd` command, change the directory to the Marist-Syllabus-Evaluator-Cap2020 folder (you can copy the folder path by opening it and clicking the address bar at the top).
4. Type `docker build -t syl .`
5. Type `docker run -p 8080:8080 syl`
6. Open browser and visit http://localhost:8080/

## Run Code Locally Without Docker

### Getting Started
1. Install Node.js from https://nodejs.org/en/download/ (version 8.0 - 14.0)
2. Install Python 3.7.8 from https://www.python.org/downloads/release/python-378/
3. Windows Users Only: Install Visual Studio on machine, including the "Desktop Development with C++" workload from https://visualstudio.microsoft.com/downloads/
4. Open the Command Prompt
5. Using the `cd` command, change the directory to the Marist-Syllabus-Evaluator-Cap2020 folder (you can copy the folder path by opening it and clicking the address bar at the top).
6. Type `npm install`
7. Type `pip install ibm_db`
8. Type `pip install python-dotenv`


### Running Code
1. Type `npm run dev` into the Command Prompt
2. Open browser and visit http://localhost:8080/
