[X] Set up
    [X] cd Documents/CodingProjects
    [X] npm create vite@latest mom-interruption-sim and select react and typescript
    [X] cd mom-interruption-sim
    [X] npm install
    [X] code .
    [X] Delete everything from src > App.css and src > index.css
    [X] In src > App.tsx, remove everything inside fragments, remove state and remove all imports
[X] Set up page routing
    [X] npm i react-router-dom 
    [X] In src > App.tsx, add import BrowserRouter, Routes and Route from react-router-dom
    [X] In src folder, create page folder with Timer.tsx file
        [X] Create react function component export
    [X] In src > pages, create Auth.tsx file
        [X] Create react function component export
    [X] In src > pages, create TimerResult.tsx file
        [X] Create react function component export
    [X] In src > App.tsx, replace fragments with BrowserRouter
        [X] Inside BrowserRouter, add Routes
            [X] Inside Routes, add Route with element as Timer and path as "/"
            [X] Add anohter Route with element as Auth and path as "/login"
            [X] Add Route with element as TimerResult.tsx file and path as "/result"
        [X] Import Timer.tsx and Auth.tsx
 [X] Set up AppWrite
    [X] Go to Appwrite.io and go to console
        [X] Create a new project
        [X] Select Web as SDK
        [X] Set hostname to localhost
    [X] npm i appwrite
    [X] In src folder, create appwrite/config.ts file
    [X] In appwrite/config.ts, add import { Client } from "appwrite"
    [X] On appwrite console, hit Next and 
[X] Set up Database
    [X] Create new database
    [X] Create collection for interruptions
        [X] Add attributes for title (default MOM ALERT), message, 
    [X] In permissions on appwrite console, for now, set anyone to be able to CRUD
    [X] Paste in Databases quickstart code from appwrite docs into appwrite/config.ts, replacing <PROJECT_ID>, <DATABASE_ID> and <COLLECTION_ID>
    [X] Create .env file in root of project
        [X] Add VITE_ENDPOINT=https://cloud.appwrite.io/v1
        [X] Add VITE_PROJECT_ID=<PROJECT_ID>
        [X] Add VITE_DATABASE_ID=<DATABASE_ID>
        [X] Add VITE_COLLECTION_ID_INTERRUPTIONS=<COLLECTION_ID>
    [X] Update config.ts to .env variables with import.meta.env.<VARIABLE_NAME>
        [X] Replace <DATABASE_ID> with import.meta.env.VITE_DATABASE_ID
    

[ ] In Timer.tsx,