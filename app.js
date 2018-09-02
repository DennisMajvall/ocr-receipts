const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

detectFulltext('./images/d.jpg');

function detectFulltext(fileName) {
  let result;
  client
    .documentTextDetection(fileName)
    .then(results => {
      result = results[0].fullTextAnnotation;
      console.log(`Full text:`, result);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });

  return result;
}