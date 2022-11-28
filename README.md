# Project Information

This is an API that will return data on fictional board game reviews. This data is used in my front end project nc-games.

Link to my hosted version of the site: https://alexs-backend-project.herokuapp.com/api

Link to my frontend project in react using the backend: https://prismatic-hummingbird-1be272.netlify.app/

# Requirements

This was developed using Node.js 18.7.0 and PSQL 14.5. Please update to these versions to avoid any errors.

# Instructions for setup

1. Either [clone](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) or [fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo) this repo to use. 

2. Once in the repo directory on your local machine, input the command 'npm i' into the terminal.

3. To create environment variables in order for this project to run locally, you must create two new files.  
Both files created need to be at the top level inside the main folder.  
The first of these files will be named `.env.test.` Inside this file paste in the below code in order to link the database.

```
PGDATABASE=nc_games_test
```

After this create a file called `.env.development` Inside this file paste the code below.

```
PGDATABASE=nc_games
```

Remember to save both files before running any tests.

3. Seed the databases by running 'npm run setup-dbs' and then 'npm run seed'

4. Input 'npm start' in order to host the API locally.


