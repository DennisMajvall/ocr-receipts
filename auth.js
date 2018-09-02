module.exports = new Promise((resolve) => {
  const fs = require('fs');
  const readline = require('readline');
  const {google} = require('googleapis');

  // If modifying these scopes, delete token.json.
  const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
  const TOKEN_PATH = 'token.json';

  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) {
      return console.error('Error loading client secret file: ', err);
    }

    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content));
  });

  // Create an OAuth2 client with the given credentials
  function authorize(credentials) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Global auth reference for all APIs
    google.options({ auth: oAuth2Client });

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) {
        return getNewToken(oAuth2Client);
      }

      oAuth2Client.setCredentials(JSON.parse(token));
      console.log('Using existing token.');
      resolve();
    });
  }

  // Get and store new token after prompting for user authorization
  function getNewToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    console.log('Authorize this app by visiting this url: ', authUrl);

    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();

      oAuth2Client.getToken(code, (err, token) => {
        if (err) {
          console.error(err);
          resolve();
        }

        oAuth2Client.setCredentials(token);

        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) {
            console.error(err);
          }

          console.log('Token stored to: ', TOKEN_PATH);
          resolve();
        });
      });
    });
  }
});