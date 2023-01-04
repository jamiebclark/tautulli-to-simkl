# Tautulli to Simkl
This is a NodeJS script you can run locally in order to copy your Plex history (via Tautulli) into Simkl

# Installation

## Basic Tools

### NodeJS
 [Install NodeJS](https://nodejs.org/en/download/)

### Yarn
In your terminal, run:
```
npm install --global yarn
```

## Simkl

### Create an account
Setup a Simkl account: https://simkl.com/

### Create an app
Create a Simkl app: https://simkl.com/settings/developer/new/
- The name and description don't matter
- Use `urn:ietf:wg:oauth:2.0:oob` for the Redirect URI

Make note of the `Client ID`

## Tautulli
- Get the `API Key`
- Get the base URL of your Tautulli installation, including the base pathname (example: `http://192.168.0.10:8383/tautulli`)

## Install the code
Run the following command from within the project directory
```
yarn install
```

### Environment variables
Create a `.env` file in the root of your directory. You can use `.env.template` as the basis for your file:

```
# The base path to your Tautulli installation
TAUTILLI_API_BASE=http://192.168.0.10:8383/tautulli

# Tautulli API key
TAUTILLI_API_KEY=XXXXXXXXXXXXXXXXX

# The Plex username to find
PLEX_USER=username_example

# The Simkl App client ID 
SIMKL_CLIENT_ID=XXXXXXXXXXXXXXXXX
```

# Using the the application
Once installed, run the following from your root directory:
```
yarn start
```

The first time you run the app it will prompt you to enter a code to generate an auth token. It will store that file locally after the first time through.