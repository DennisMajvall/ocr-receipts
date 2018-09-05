const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const readDir = util.promisify(fs.readdir);
const rename = util.promisify(fs.rename);

const path = require('path');
const checksumOriginal = require('checksum');

const TO_SCAN = './images/to-scan/';
const SCANNED = './images/scanned/';
const DUPLICATES = './images/duplicates/';
const OCR = './ocr/';

module.exports = scanPhotos;


async function scanPhotos(){
  const images = await readDir(TO_SCAN);
  const alreadyScanned = await readDir(SCANNED);

  // console.log('images to scan:', images);
  // console.log('already scanned images:', alreadyScanned);

  for (let img of images) {
    const filepath = path.join(TO_SCAN, img);
    const cs = await checksum(filepath);
    const csFilename = cs + path.extname(img);
    // console.log('img:', img, 'cs:', cs);

    if (alreadyScanned.includes(csFilename)) {
      await rename(filepath, path.join(DUPLICATES, csFilename));
    } else {
      const ocrText = await detectFulltext(filepath);
      await writeFile(path.join(OCR, cs + '.json'), ocrText, 'utf8');
      await rename(filepath, path.join(SCANNED, csFilename));
    }
  }
}

async function detectFulltext(filename) {
  let result = await client.documentTextDetection(filename).catch(console.error);

  result = result[0].fullTextAnnotation.text;

  return result;
}

async function checksum(filename){
  return new Promise((resolve)=> {
    checksumOriginal.file(filename, function (err, sum) {
      resolve(sum);
    })
  });
}
