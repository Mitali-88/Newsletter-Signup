const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { response } = require("express");

const app = express();
app.use(express.static("public")); //for the static file all the static files are in the public folder to access them.
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;
  //console.log(firstName,lastName,email);
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us18.api.mailchimp.com/3.0/lists/dac11f6ce1";
  const options = {
    method: "POST",
    auth: "Mitali:6606c369f8c1a9bc0df16683c7025385-us18",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});
app.post("/failure",function(req,res){
res.redirect("/");
})



app.listen(process.env.PORT || 3000, function () {
  console.log("server is running on port 3000");
});
// 6606c369f8c1a9bc0df16683c7025385-us18 api key
// list id or audience id dac11f6ce1
