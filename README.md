# Marist-Syllabus-Evaluator-Cap2020

## View Working Application on Cloud
https://syllabus-eval.us-south.cf.appdomain.cloud/

## Run Code Locally With Docker

### Getting Started
1. Install Docker on Machine https://docs.docker.com/get-docker/
2. Once Docker is installed and running, in terminal, clone repository `git clone https://github.com/cc12698/Marist-Syllabus-Evaluator-Cap2020`
3. Using the `cd` command, change the directory to the Marist-Syllabus-Evaluator-Cap2020 folder (you can copy the folder path by opening it and clicking the address bar at the top).
4. Create a file in the general Marist-Syllabus-Evaluator-Cap2020 folder named `.env` (with no file extension)
5. Copy and paste content from `env.txt` to `.env` file
6. Type `docker build -t syl .`

### Running Code
1. Type `docker run -p 8080:8080 syl`
2. Open browser and visit http://localhost:8080/

<<<<<<< HEAD
=======
Note: Once these commands are run once, you can use the site without command prompt by opening Docker Desktop and starting the "syl" container you just created.

>>>>>>> 6d3f70fb1e7a9fdbfc32856c2e9bf97e506bea0b
## Run Code Locally Without Docker

### Getting Started
1. Install Node.js from https://nodejs.org/en/download/ (version 8.0 - 14.0)
2. Install Python 3.7.8 from https://www.python.org/downloads/release/python-378/
3. Windows Users Only: Install Visual Studio on machine, including the "Desktop Development with C++" workload from https://visualstudio.microsoft.com/downloads/
4. Open the Command Prompt
5. Using the `cd` command, change the directory to the Marist-Syllabus-Evaluator-Cap2020 folder (you can copy the folder path by opening it and clicking the address bar at the top).
6. Create a file in the general Marist-Syllabus-Evaluator-Cap2020 folder named `.env` (with no file extension)
7. Copy and paste content from `env.txt` to `.env` file
8. Type `npm install`
9. Type `pip install ibm_db`
10. Type `pip install python-dotenv`


### Running Code
1. Type `npm run dev` into the Command Prompt
2. Open browser and visit http://localhost:8080/
