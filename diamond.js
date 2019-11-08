const PDFDocument = require('pdfkit');
const readline = require('readline');
var fs = require('fs');
var doc = new PDFDocument({
    size: [mmToPt(210), mmToPt(297)] // a smaller document for small badge printers
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Width of diamond? (mm): ', (answer) => {
    console.log(`Generating diamond.pdf with diamond width ${answer}mm`);
    doc.pipe(fs.createWriteStream('diamond.pdf')); // write to PDF

    var x = parseInt(answer);
    var w = Math.sqrt(x*x/2);

    var docw = 210;
    var doch = 297

    doc.lineWidth(mmToPt(.1));
    for( var i = -parseInt((docw/4)/w)-1; i < parseInt((docw/4)/w)+1; ++i )
    {
        for( j = 0; j < (doch/2)/w+1; ++j )
        {
            doc.polygon([mmToPt(docw/2+i*w*2), mmToPt(w*2*j)],
                    [mmToPt(docw/2+w+i*w*2), mmToPt(w+w*2*j)],
                    [mmToPt(docw/2+i*w*2), mmToPt(w*2+w*2*j)],
                    [mmToPt(docw/2-w+i*w*2), mmToPt(w+w*2*j)]);
            doc.stroke();
            doc.polygon([mmToPt(docw/2+w + i*w*2), mmToPt(w+w*2*j)],
                        [mmToPt(docw/2+w*2+i*w*2), mmToPt(w*2+w*2*j)],
                        [mmToPt(docw/2+w+i*w*2), mmToPt(w*3+w*2*j)],
                        [mmToPt(docw/2+i*w*2), mmToPt(w*2+w*2*j)]);
            doc.stroke();
        }
    }

    doc.polygon([mmToPt(docw/2),0],[mmToPt(docw/2),mmToPt(doch)]);
    doc.stroke();


    doc.end();
    rl.close();

    
    var filePath = 'diamond.pdf';
    function getCommandLine() {
        switch (process.platform) { 
            case 'darwin' : return 'open';
            case 'win32' : return 'start';
            case 'win64' : return 'start';
            default : return 'xdg-open';
        }
    }

    var exec = require('child_process').exec;

    var child = exec(getCommandLine() + ' ' + filePath, function (error, stdout, stderr) {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    } 
    });
});


function mmToPt (mm) {
    return mm * 2.83465;
  }
