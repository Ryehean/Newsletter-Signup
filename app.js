const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  }
  const jsonData = JSON.stringify(data);

  let myURL = "https://us20.api.mailchimp.com/3.0/lists/46cee7932c";
  let options = {
    method: "POST",
    auth: "ryehean1:A3dc02233b55367161ce03022d418fc92-us20"
  }

  const request = https.request(myURL, options, function(response) {

    if (response.statusCode === 200){
      res.sendFile(__dirname +"/success.html");
    }else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

  app.post("/failure", function(req, res){
    res.redirect("/");
  })

});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is up and running on port 3000");
});


// api
// 3dc02233b55367161ce03022d418fc92-us20
// 1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW357bf20169460aa0fa920d13d4ecd0935-us20
// list id
// 46cee7932c
