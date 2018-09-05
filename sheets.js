const {google} = require('googleapis');
const spreadsheetId = '1egNbYbJtbnRXmDL_7m24DHXTUiJnjEuzl3JdwB08tE4'

module.exports = {
  getRows,
  appendToRows,
  updateRows
}

const sheet = google.sheets({version: 'v4'}).spreadsheets;

/* EXAMPLES

  let rows = await getRows('Class Data!A2:F6');
  console.log('rows:', rows);

  let appendData = [
    ["Void2", "Canvas2", "Website2"],
    ["Paul2", "Shan2", "Human2"]
  ];
  await appendToRows('Class Data!G28:I29', appendData);

  let updateData = [
    ["Void3", "Canvas3", "Website3"],
    ["Paul3", "Shan3", "Human3"]
  ];
  await updateRows('Class Data!A33:C34', updateData);

*/

async function getRows(range){
  const options = {
    range,
    spreadsheetId
  };

  return new Promise((resolve)=> {
    sheet.values.get(options, (err, response) => {
      err && console.error('The API returned an error, getRows:', err);
      resolve(response.data.values);
    });
  });
}

async function appendToRows(range, values){
  const options = {
    range,
    spreadsheetId,
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
  const options = {
    range,
    spreadsheetId,
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
