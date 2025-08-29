

## Running the project

Go into "stigg-test-allen" folder. 

Prerequisites:
- Node.js (I use 24.1.0 but any current one should work)
- npm ( I use version 11.3)
- Vite needed also


## What I made 
I made a project manager which allows users to create projects, create tasks for a project, download a project and its tasks as a
PDF, as well as create AI summaries of projects. Here are the tier options below. Clicking "go to pricing" will take you to the pricing page.

For now - each "AI use" will just add increment the usage by 10 since I am not tracking tokens, GPU minutes, any computations, etc.

Each event / usage add will result in a small delay in an attempt to prevent users from duplicating.

When the free user cannot access the "export as PDF" action, it will be disabled

# Free
- 600 AI summary credits
- 3 Projects max
- 75 tasks created a week.
- VITE_CUSTOMER_ID=customer-free-test


# Advanced (10 dollars a month of 100 dollars a year)
- 2000 AI summary credits
- 10 Projects
- Download project as PDF feature enabled
- 200 tasks a week.
- VITE_CUSTOMER_ID=customer-paid


### 1) Server (backend)

1. Open a terminal and go to the server folder:
   cd server

2. npm install 

3. Create .env file with stigg server key

4. Start the server: npm start

5.  http://localhost:4000/api/entitlements/<customer id> to check if the server is running

### 2) Web app (client)

1. From the project root: npm install

2. create .env file with VITE_STIGG_CLIENT_KEY and VITE_CUSTOMER_ID

3. npm run dev to run the web app locally

4. Open the app with the URL printed


### If I had more time:
- Allow users to view usage, analytics, and view insights on their project
- Allow users to "self-serve" themselves with projects, summaries, etc.
- Alert users when their limits have reached certain thresholds.
- Time-based deals. First x users get this, second n users get this...
- Add checks to users cannot game the system by adding features quickly back to back.