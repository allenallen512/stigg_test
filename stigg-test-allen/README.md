

## Running the project

Go into "stigg-test-allen" folder

Prerequisites:
- Node.js (I use 24.1.0 but any current one should work)
- npm ( I use version 11.3)

Ports used by default:
- Server: 4000
- Vite dev server (client): 5173

## What I made 
I made a project manager which allows users to create projects, create tasks for a project, download a project and its tasks as a
PDF, as well as create AI summaries of projects. Here are the tier options below. 

# Free
- 200 AI summary credits
- 3 Projects max
- 60 tasks created a week.

# Advanced (10 dollars a month of 100 dollars a year)
- 1000 AI summary credits
- 10 Projects
- Download project as PDF feature enabled
- 200 tasks a week.


### 1) Server (backend)

1. Open a terminal and go to the server folder:
   cd server

2. npm install

3. Create .env file with stigg server key

4. Start the server: npm start

5.  http://localhost:4000/api/entitlements/<customer id> to check if the server is running

### 2) Web app (client)

1. From the project root: npm install

2. create .env file with stigg client id,

3. npm run dev to run the web app locally

4. Open the app with the URL printed


### If I had more time:
- Allow users to view usage, analytics, and view insights on their project
- Allow users to "self-serve" themselves with projects, summaries, etc.
- Alert users when their limits have reached certain thresholds.
- Time-based deals. First x users get this, second n users get this...