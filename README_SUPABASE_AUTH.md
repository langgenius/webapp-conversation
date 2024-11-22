# Conversation Web App with Supabase Auth Setup Guide

This README will guide you through the necessary steps to create and configure a project using Supabase, then set up those configurations for your Next.js application.

## Step 1: Config App
Create a file named `.env.local` in the current directory and copy the contents from `.env.example`. Setting the following content:
```
# APP ID
NEXT_PUBLIC_APP_ID=
# APP API key
NEXT_PUBLIC_APP_KEY=
# APP URL
NEXT_PUBLIC_API_URL=
```

[`Developing with APIs guide`](https://docs.dify.ai/user-guide/launching-dify-apps/developing-with-apis) will walk you through how to retrieve the API URL, App ID, and App Key.

## Step 2: Register and Create Supabase Project
- Visit [Supabase](https://supabase.com/dashboard/sign-in)
- Register and create an account, if you haven't already.
- Once you've signed in, click on '+ New Project'.
- Fill in the details such as project name and password under the "Project details" section.
- Click 'Create new project'.

## Step 3: Create User in Supabase
- Go to the Authentication section in the left side panel on your Supabase project dashboard.
- Navigate to the 'Authentication' tab.
- Click the 'Add user' button and fill in the required user information.
- Click 'Create user' to create the user.

## Step 4: Get Supabase URL and Anon Key
- On your project dashboard, click 'Connect'.
- Under the 'App Frameworks' tab, you'll find the URL and anon key listed.
- Take a note of the project URL and anon key, these will be used later.

## Step 5: Copy the URL and Anon Key as ENV Variables
- Create a `.env.local` file in the root directory of your Next.js project.
- Paste the following environment variables in the `.env.local` file:

  ```
  # Enable Supabase auth
  NEXT_PUBLIC_ENABLE_SUPABASE_AUTH=true
  # Supabase url
  NEXT_PUBLIC_SUPABASE_URL=<SUPABASE_URL>
  # Supabase anon key
  NEXT_PUBLIC_SUPABASE_ANON_KEY=<ANON_KEY>
  ```
  
- Replace `<SUPABASE_URL>` with your Supabase project URL.
- Replace `<ANON_KEY>` with your Supabase anon key.

## Step 6: Build and Start the Next App
- Open your terminal.
- Navigate to your project directory.
- Run `npm install` or `yarn install` to install all dependencies.
- To build the app, run `npm run build` or `yarn build`.
- To start the app, run `npm start` or `yarn start`.
- Your app should now be running on `http://localhost:3000`.

You have completed the basic setup and configuration needed for connecting and running your Next.js application with Supabase. 