(async function start(){
  let scanPhotos = await require('./ocr');
  scanPhotos();

  await require('./auth');
  let sheets = require('./sheets'); // depends on auth

  let categories = await sheets.getRows('Categories!1:1');
  console.log('categories:', categories);

  // let appendData = [
  //   ["Void2", "Canvas2", "Website2"],
  //   ["Paul2", "Shan2", "Human2"]
  // ];
  // await sheets.appendToRows('Receipts!A2:E2', appendData);

})();
