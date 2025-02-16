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
 [ ] Set up AppWrite
    [ ] Go to Appwrite.io and go to console
        [ ] Create a new project
        [ ] Select Web as SDK
        [ ] Set hostname to localhost
    [ ] npm i appwrite
    [ ] In src folder, create appwrite/config.ts file
    [ ] In appwrite/config.ts, add import { Client } from "appwrite"
    [ ] On appwrite console, hit Next and 
[ ] Set up Database
    [ ] Create new database
    [ ] Create collection for interruptions
        [ ] Add attributes for title (default MOM ALERT), message, 
    [ ] In permissions on appwrite console, for now, set anyone to be able to CRUD
    [ ] Paste in Databases quickstart code from appwrite docs into appwrite/config.ts, replacing <PROJECT_ID>, <DATABASE_ID> and <COLLECTION_ID>
    [ ] Create .env file in root of project
        [ ] Add VITE_ENDPOINT=https://cloud.appwrite.io/v1
        [ ] Add VITE_PROJECT_ID=<PROJECT_ID>
        [ ] Add VITE_DATABASE_ID=<DATABASE_ID>
        [ ] Add VITE_COLLECTION_ID_INTERRUPTIONS=<COLLECTION_ID>
    [ ] Update config.ts to .env variables with import.meta.env.<VARIABLE_NAME>
        [ ] Replace <DATABASE_ID> with import.meta.env.VITE_DATABASE_ID
    

[ ] In Timer.tsx,