const fs = require('fs');
const {google} = require('googleapis');

let auth;
let sheet;

run();

async function run(){
  // 1 authenticate
  await authenticate();

  // 2 get sheet
  sheet = google.sheets({version: 'v4', auth}).spreadsheets;

  // 3 test
  let rows = await getRows('Class Data!A2:F6');
  console.log('rows:', rows);

  // let appendData = [
  //   ["Void2", "Canvas2", "Website2"],
  //   ["Paul2", "Shan2", "Human2"]
  // ];
  // await appendToRows('Class Data!G28:I29', appendData);

  // let updateData = [
  //   ["Void3", "Canvas3", "Website3"],
  //   ["Paul3", "Shan3", "Human3"]
  // ];
  // await updateRows('Class Data!A33:C34', updateData);
}

async function getRows(range){
  const options = { auth, range,
    spreadsheetId: '1egNbYbJtbnRXmDL_7m24DHXTUiJnjEuzl3JdwB08tE4',
  };

  return new Promise((resolve)=> {
    sheet.values.get(options, (err, response) => {
      err && console.error('The API returned an error, getRows:', err);
      resolve(response.data.values);
    });
  });
}

async function appendToRows(range, values){
  const options = { auth, range,
    spreadsheetId: '1egNbYbJtbnRXmDL_7m24DHXTUiJnjEuzl3JdwB08tE4',
    valueInputOption: "USER_ENTERED",
    resource: { values }
  };

  return new Promise((resolve)=> {
    sheet.values.append(options, (err, response) => {
      err && console.error('The API returned an error, appendToRows:', err);
      resolve();
    });
  });
}

async function updateRows(range, values){
  const options = { auth, range,
    spreadsheetId: '1egNbYbJtbnRXmDL_7m24DHXTUiJnjEuzl3JdwB08tE4',
    valueInputOption: "USER_ENTERED",
    resource: { values }
  };

  return new Promise((resolve)=> {
    sheet.values.update(options, (err, response) => {
      err && console.error('The API returned an error, updateRows:', err);
      resolve();
    });
  });
}

const readline = require('readline');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'token.json';

async function authenticate(){
  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), ()=>{});
  });

  await asleep(1000);
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    auth = oAuth2Client;
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function asleep(sleepMs){
  var res;
  setTimeout(function(){ res(); }, sleepMs);
  return new Promise(function(a){ res = a; });
};