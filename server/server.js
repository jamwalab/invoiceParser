//---IMPORT DEPEMNDANCIES---//
const fs = require('fs');
const pdfParser = require('pdf2json');

const files = fs.readdirSync('testPdf');

let allPdfData = [];

const parserFunction = async () => {
  await Promise.all(files.map(async (eachFile) => {
    const parserPdf = new pdfParser(this,1);

    parserPdf.loadPDF(`testPdf/${eachFile}`)

    let outputData = await new Promise (async (res, rej) => {
      parserPdf.on("data", page => {
        //res(pdfData)
        console.log(page)
        //console.log(pdfData.Pages[0].Texts[20]);
        //fs.writeFile("./testPdf/F1040EZ.content.txt", parserPdf.getRawTextContent(), ()=>{console.log("Done.");});
      });
    });

    allPdfData.push(outputData)
  }))
}

//console.log(allPdfData);

parserFunction()