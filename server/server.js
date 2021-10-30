//---IMPORT DEPEMNDANCIES---//
const fs = require('fs');
PDFParser = require("pdf2json");

const files = fs.readdirSync('testPdf');

let allPdfData = [];

const parserFunction = async () => {
  /*await Promise.all(files.map(async (eachFile) => {
    const pdfParser = new PDFParser();

    pdfParser.loadPDF(`testPdf/${eachFile}`)

    /*let outputData = await new Promise (async (res, rej) => {
      pdfParser.on("pdfParser_dataReady", pdfData => {
        //res(pdfData)
        //allPdfData.push(page);
        pdfData.Pages ? fs.writeFile("./testPdf/test.json", JSON.stringify(pdfData.Pages[2]), ()=>{console.log("Done.");}) : "All pages parsed";
        //console.log(pdfData.Pages[0]);
        //fs.writeFile("./testPdf/F1040EZ.content.txt", parserPdf.getRawTextContent(), ()=>{console.log("Done.");});
        //fs.writeFile("./testPdf/test.json", JSON.stringify(pdfData), ()=>{console.log("Done.");});
      });
    });*/
    
    //allPdfData.push(outputData)
    /*pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
    pdfParser.on("pdfParser_dataReady", pdfData => {
        fs.writeFile("./testPdf/test.json", JSON.stringify(pdfParser.getAllFieldsTypes()), ()=>{console.log("Done.");});
    }); 
  }))*/ 
  //WORKING
  const pdfParser = new PDFParser();
  pdfParser.loadPDF("./testPdf/CINV01489411.pdf");
  //pdfParser.on("pdfParser_dataReady", pdfData => pdfData.Pages ? fs.writeFile("./testPdf/test.json", JSON.stringify(pdfData.Pages[6]), ()=>{console.log("Done.");}) : "All pages parsed");
  pdfParser.on("pdfParser_dataReady", pdfData => {
    if (pdfData.Pages) {
      //fs.writeFile("./testPdf/test.json", JSON.stringify(pdfData))
      pdfData.Pages.forEach(page => {
        //fs.appendFileSync("./testPdf/test.json", JSON.stringify(page));
        page.Texts.forEach(text => {
          text ? fs.appendFileSync("./testPdf/test.json", JSON.stringify(text), ()=>{console.log("Done.");}) : ()=>{console.log("All pages parsed")};
        })
      });
    }
    //fs.writeFile("./testPdf/test.json", JSON.stringify(pdfData.Pages[6]), ()=>{console.log("Done.");})
  });

}

console.log(allPdfData);

parserFunction().then(() => {
  console.log("zzzzzzzzzzzzzzz")
})