"user strict";

import path = require("path");
import process = require("process");
import { google } from "googleapis";
import { promises as fsPromises } from "fs";
import { authenticate } from "@google-cloud/local-auth";
import { OAuth2Client } from "google-auth-library";

// Inspired by https://developers.google.com/sheets/api/quickstart/nodejs
// Doc : https://developers.google.com/sheets/api/reference/rest

// If modifying these scopes, delete file which is in GOOGLE_TOKEN_FILE_PATH.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
// The file which is in GOOGLE_TOKEN_FILE_PATH, stores the user"s access and refresh tokens
// and is created automatically when the authorization flow completes for the first time.
const TOKEN_PATH = path.join(process.cwd(), process.env.GOOGLE_TOKEN_FILE_PATH as string);
const CREDENTIALS_PATH = path.join(process.cwd(), process.env.GOOGLE_CREDENTIALS_PATH as string);

async function loadSavedCredentialsIfExist(): Promise<any|null> {
  try {
    const content = await fsPromises.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content.toString());

    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client: OAuth2Client): Promise<void> {
  const content = await fsPromises.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content.toString());
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fsPromises.writeFile(TOKEN_PATH, payload);
}

async function authorize(): Promise<OAuth2Client> {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

async function listRestaurants(auth: OAuth2Client): Promise<void> {
  const sheets = google.sheets({version: "v4", auth});
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SPREAD_SHEET_ID,
    range: process.env.GOOGLE_SPREAD_SHEET_RANGE,
  });
  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    console.log("No data found.");
    return;
  }
  console.log("Name:");
  rows.forEach((row: Array<number>) => {
    console.log(`${row[0]}`);
  });
}

authorize().then(listRestaurants).catch(console.error);
