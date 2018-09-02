// const vision = require('@google-cloud/vision');
// const client = new vision.ImageAnnotatorClient();


(async function start(){
  await require('./auth');

  console.log('hi');
})();

// detectFulltext('./images/d.jpg');

// function detectFulltext(fileName) {
//   let result;
//   client
//     .documentTextDetection(fileName)
//     .then(results => {
//       result = results[0].fullTextAnnotation;
//       console.log(`Full text:`, result);
//     })
//     .catch(err => {
//       console.error('ERROR:', err);
//     });

//   return result;
// }