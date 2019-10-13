//Firebase configuration
var firebaseConfig = {
    apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    authDomain: "colorization-deeplearning.firebaseapp.com",
    databaseURL: "https://colorization-deeplearning.firebaseio.com",
    projectId: "colorization-deeplearning",
    storageBucket: "colorization-deeplearning.appspot.com",
    messagingSenderId: "xxxxxxxxxxxxxxxx",
    appId: "xxxxxxxxxxxxxxxxxxxxxxxxx"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var progressBar = document.getElementById('uploader');
var btn = document.getElementById('fileButton');

btn.addEventListener('change', function(e) {   //listen for file selection 
  //QUERY THE DOM
  var res = document.getElementById('result');
  var fileInput = document.getElementById('fileButton');
  var img = document.getElementById('output_image2');
  res.innerHTML = "uploading to file storage....";

  //STORE IMAGE IN FIREBASE STORAGE
  var file = e.target.files[0];  //get file
  var storageRef = firebase.storage().ref('gray_scale/'+file.name);  //create a storage reference 
  var task = storageRef.put(file);  //upload file   
  task.on('state_changed', function progress(snapshot) {  //update progress bar
    var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
    progressBar.value = percentage;
  }, function error(err) {
      res.innerHTML = err; 
  }, function complete(){
      getUrl(storageRef);
      res.innerHTML = "uploaded to storage!";
  });

  //UPLOAD FILE IN NODE SERVER AND RUN COLORIZATION MODEL
  img.src = "images/loadgif1.gif";
  var data = new FormData()
  data.append('file', fileInput.files[0])
  console.log("sending fetch request");
  fetch('http://localhost:9211', {
    method: 'POST',
    body: data
  }).then( function(res) {
    return res.json();
  }).then( function(myjson) {
      console.log(myjson);
      res.innerHTML = "Result Fetched!";
      var final = myjson.output;
      final = 'https://algorithmia.com/v1/data/' + final.slice(7, final.length);
      img.src= final;
  });

});
var d_btn = document.getElementsByClassName('download-btn')[0];
var d_link = document.getElementById('d-link');
d_btn.style.display = "block";
d_link.setAttribute('href', final);


function getUrl(storageRef) {
  var img = document.getElementById('output_image1');
  img.src = "images/loadgif1.gif";
  storageRef.getDownloadURL().then( function(url) {
      img.src = url;
      return url;
  })
}
