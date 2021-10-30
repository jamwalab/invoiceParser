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
  let partNumber = -99;
  let yAxis = -999;
  let description = -111;
  let shade = -112;
  let hsCode = -115;
  let batch = -117;
  let quantity = -119;
  let netWeight = -122;
  let totWeight = -125;
  let unitPrice = -128;
  let vcc = -133;
  
  //WORKING
  const pdfParser = new PDFParser();
  pdfParser.loadPDF("./testPdf/CINV01489411.pdf");
  //pdfParser.on("pdfParser_dataReady", pdfData => pdfData.Pages ? fs.writeFile("./testPdf/test.json", JSON.stringify(pdfData.Pages[6]), ()=>{console.log("Done.");}) : "All pages parsed");
  pdfParser.on("pdfParser_dataReady", pdfData => {
    if (pdfData.Pages) {
      //fs.writeFileSync("./testPdf/test.json", JSON.stringify(pdfData))
      pdfData.Pages.forEach(page => {
        //fs.appendFileSync("./testPdf/test.json", JSON.stringify(page));
        let eachLine = {};
        let columnCounter = 0;

        page.Texts.forEach(text => {
          //console.log(text)
          switch (text.R[0].T) {
            case "Item%20%23":
              partNumber = text.x;
              break;
            case "Name%20Tag":
              description = text.x;
              break;
            case "Shade":
              shade = text.x;
              break;
            case "HS%20Code":
              hsCode = text.x;
              break;
            case "Batch":
              batch = text.x;
              break;
            case "Shipped":
              quantity = text.x;
              break;
            case "Unit%20Price":
              unitPrice = text.x;
              break;
            case "Net%20WT%20":
              netWeight = text.x;
              break;
            case "Total%20WT":
              totWeight = text.x;
              break;
            case "Amount":
              vcc = text.x;
              break;
          }
          //text ? fs.appendFileSync("./testPdf/test.json", JSON.stringify(text), ()=>{console.log("Done.");}) : ()=>{console.log("All pages parsed")};
          let str = "";
          let strArr = [];
          let index = -1;
          
          if (text.x >= partNumber-0.3 && text.x < description) {
            //--PART NUMBER COLUMN SECTION--//
            //!eachLine["PartNumber"]
            if (text.R[0].T.trim().match(/^\d+.+/)) {
              //If no Part number
              if (!eachLine["PartNumber"]) {
                eachLine["PartNumber"] = text.R[0].T.trim();
              }
              else {
                eachLine["COO"] = "USA";
                if (eachLine["Description"]) {
                  eachLine["Description"] = eachLine["Description"].replace(/\s\s+/g, ' ').trim();
                }
                console.log(eachLine);
                eachLine = {};
                eachLine["PartNumber"] = text.R[0].T.trim();
              }
            }
            else if (eachLine["PartNumber"] && !eachLine["COO"]) {
              //COUNTRY OF ORIGIN
              str = text.R[0].T.trim().replace(/%20/g, " ");
              strArr = str.split(" ");
              //CHECK IF COO AVAILABLE
              if (strArr[0] === "Item" && strArr[1] === "Number") {
                index = strArr.findIndex(ele => ele === "manufactured");
                str = "";
                for (let i = index+2; i <strArr.length; i++) {
                  str = str + strArr[i] + " ";
                }
                eachLine["COO"] = str.trim();
                if (eachLine["Description"]) {
                  eachLine["Description"] = eachLine["Description"].replace(/\s\s+/g, ' ').trim();
                }
                console.log(eachLine);
                eachLine = {};
              }  
            }
          } 
          else {
            if (eachLine["PartNumber"] && !eachLine["COO"]) {
              str = decodeURI(text.R[0].T).replace(/%2C/g, "").replace(/%20/g, " ").replace(/%2F/g, "/").trim();
              //str = text.R[0].T.trim().replace(/%2C/g, "").replace(/%20/g, " ");
              
              //--PART NUMBER COLUMN SECTION--//
              if (text.x >= description - 0.1 && text.x < shade) {
                if (!eachLine["Description"]) {
                  eachLine["Description"] = str;
                }
                else {
                  eachLine["Description"] += str;
                }
              }
              //--HS CODE COLUMN SECTION--//
              if (text.x >= hsCode - 0.1 && text.x < batch) {
                eachLine["HSCode"] = str;
              }
              //--SHIPPED COLUMN SECTION--//
              if (text.x >= quantity - 0.1 && text.x < unitPrice) {
                eachLine["shipped"] = str;
              }
              //--TOTAL WEIGHT COLUMN SECTION--//
              if (text.x >= totWeight - 0.1 && text.x < vcc) {
                eachLine["totWeight"] = str;
              }
              //--AMOUNT COLUMN SECTION--//
              else if (text.x >= vcc - 0.4) {
                eachLine["Amount"] = str;
              }
            }

            //fs.appendFileSync("./testPdf/test.json", eachLine + ", ");

          }
        })
        
      });
    }

    console.log(partNumber, description, hsCode, quantity, unitPrice, totWeight, vcc)
    //fs.writeFile("./testPdf/test.json", JSON.stringify(pdfData.Pages[6]), ()=>{console.log("Done.");})

  });
}

console.log(allPdfData);

parserFunction().then(() => {
  console.log("zzzzzzzzzzzzzzz")
})