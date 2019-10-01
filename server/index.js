const functions = require('firebase-functions');
// https://firebase.google.com/docs/functions/write-firebase-functions
var algorithmia = require("algorithmia");
var express = require("express");
var app = express();
var upload = require('express-fileupload');
var bodyParser = require('body-parser');

var client = algorithmia.client("xxxxxxxxxxxxxxxxxxxxxxxxx");

app.listen(9211, function() {
    console.log('server running on localhost:9211');
})
app.use(bodyParser());

app.use(upload());

app.use(express.static('../public')); 

app.post("/", function(req, res) {       //file upload
    if(req.files) {                      //if request has files
        var ufile = req.files.file,
        filename = ufile.name;
        console.log(ufile);
        ufile.mv("./uploads/" + filename, function(err) {
            if(err) {
                console.log("Error: "+ err);
                res.send("error in uploading file to node server");
            } else {
                uploadToDB(filename).then( function(inputURL) {
                    //CALLING ALGORITHMIA MODEL
                    console.log(inputURL);
                    var input = {
                        "image": inputURL
                    };
                    console.log("sending request to model with data url: "+ input);

                    algorithmia.client("xxxxxxxxxxxxxxxxxxxx")
                    .algo("deeplearning/ColorfulImageColorization/1.1.13")
                    .pipe(input)
                    .then(function(response) {
                        console.log(response.get());
                        // var colored_image = client.dir("data://.algo/deeplearning/ColorfulImageColorization/temp");  
                        // console.log("Getting the file first: "+ colored_image+ " with filename: "+filename);
                        // colored_image.file(filename).get(function(err, data) {
                        //     if(err) console.error(err) ;
                        //     console.log("Read " + data.length + " bytes");
                        //     fs.writeFileSync("/uploads/colored/"+filename, data);
                            
                        // });
                        res.end(JSON.stringify(response.get()));
                    }); 
                }) 
            }
        });

    } else {
        console.log("no files")
    }   
});

function uploadToDB(filename) {
    return new Promise( (resolve, reject)=> {
        var inputURL = 'data://himanshu_negi/gray_scale/'+filename;
        console.log("uploading "+ inputURL+" to algorithmia Data Source");
        var robots = client.dir("data://.my/gray_scale");
        filename = 'uploads/'+filename;
        // Upload a file from a local path to algorthmia Data Source
        robots.putFile(filename, function(response) {
            if(response.error) {
                console.log("Error: " + response.error.message);
                reject('error in uploading file to algorithmia Data Source');
            } else {
                console.log("Successfully uploaded file to algorthmia Data Source");
                resolve(inputURL);
            }
        });
    });
}

exports.app = functions.https.onRequest(app);

