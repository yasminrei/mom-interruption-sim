[ ] Set up
    [ ] cd Documents/CodingProjects
    [ ] npm create vite@latest mom-interruption-sim and select react and typescript
    [ ] cd mom-interruption-sim
    [ ] npm install
    [ ] code .
    [ ] Delete everything from src > App.css and src > index.css
    [ ] In src > App.tsx, remove everything inside fragments, remove state and remove all imports
[ ] Set up page routing
    [ ] npm i react-router-dom 
    [ ] In src > App.tsx, add import BrowserRouter, Routes and Route from react-router-dom
    [ ] In src folder, create page folder with Timer.tsx file
        [ ] Create react function component export
    [ ] In src > pages, create Auth.tsx file
        [ ] Create react function component export
    [ ] In src > App.tsx, replace fragments with BrowserRouter
        [ ] Inside BrowserRouter, add Routes
            [ ] Inside Routes, add Route with element as Timer and path as "/"
            [ ] Add anohter Route with element as Auth and path as "/login"
        [ ] Import Timer.tsx and Auth.tsx
 