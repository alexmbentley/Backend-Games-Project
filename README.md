# How to create environemnt variables to run this project

To create environment variables in order for this project to run locally, you must create two new files.  
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
