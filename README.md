# Random Lunch Bot

## Stack

- Node v16
- TypeScript

## Requirements

### Access Tokens
Generate every necessary token which requires the bot which can be found here [.env.dist](./.env.dist).

To generate them, you can follow the documentation [Access tokens](https://api.slack.com/authentication/token-types).

### Environment variables

Fill the `.env` file or export the required environment variables before running the app.

## Installation

Building the dev environment:

```sh
docker-compose up
```

> `-d` for detach mode

## Running the application


Run the command:

```sh
docker-compose exec app npm start
```
