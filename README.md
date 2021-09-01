# Task App

## This is NodeJS based service for creating Tasks, It features:
- User creation and Authentication
- Task creation and Update

## How to run the app

`yarn install` to install the necessary packages

`yarn dev` to start the server

`yarn test` to run the app test

You also need to generate a sendGrid API Key from there developer account and add it to the `.env` file of this project as `SENDGRID_API_KEY` before users can receive email on signup

You can navigate to `http://localhost:3000/api-docs` to check the swagger documentation.
