# Marist-Syllabus-Evaluator-Cap2020

## View Working Application on Cloud
https://syllabus-eval.us-south.cf.appdomain.cloud/

## Run Code Locally With Docker

### Getting Started
1. Install Docker on Machine https://docs.docker.com/get-docker/
2. Download the Marist-Syllabus-Evaluator-Cap2020 folder directly OR clone the repository (requires GitBash) with `git clone https://github.com/cc12698/Marist-Syllabus-Evaluator-Cap2020`
3. In the command prompt, change the directory to the Marist-Syllabus-Evaluator-Cap2020 folder using the `cd` command (you can copy the folder path by opening it and clicking the address bar at the top).
4. Create a file in the general Marist-Syllabus-Evaluator-Cap2020 folder named `.env` (with no file extension)
5. Copy and paste content from `env.txt` to `.env` file
6. Type `docker build -t syl .`

### Running Code
1. Type `docker run -p 8080:8080 syl`
2. Open browser and visit http://localhost:8080/

Note: Once these commands are run successfully, you can open the application by launching it through Docker Desktop and you do not need to use any terminal commands.

## Run Code Locally Without Docker

### Getting Started
1. Install Node.js from https://nodejs.org/en/download/ (version 8.0 - 14.0)
2. Install Python 3.7.8 from https://www.python.org/downloads/release/python-378/
3. Windows Users Only: Install Visual Studio on machine, including the "Desktop Development with C++" workload from https://visualstudio.microsoft.com/downloads/
4. Download the Marist-Syllabus-Evaluator-Cap2020 folder directly OR clone the repository (requires GitBash) with `git clone https://github.com/cc12698/Marist-Syllabus-Evaluator-Cap2020`
5. In the command prompt, change the directory to the Marist-Syllabus-Evaluator-Cap2020 folder using the `cd` command (you can copy the folder path by opening it and clicking the address bar at the top).
6. Create a file in the general Marist-Syllabus-Evaluator-Cap2020 folder named `.env` (with no file extension)
7. Copy and paste content from `env.txt` to `.env` file
8. Type `npm install`
9. Type `pip install ibm_db`
10. Type `pip install python-dotenv`


### Running Code
1. Type `npm run dev` into the Command Prompt
2. Open browser and visit http://localhost:8080/
