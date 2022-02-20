const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({ region: "ap-south-1" });
var otpno = Math.floor(Math.random() * 899999) + 100000;

exports.handler = function (event, context, callback) {
  const { Mail } = event;
  // it checks whether input email address is valid or not if it is invalid it will send response as invalid email
  const validator = require("email-validator");
  if (!validator.validate(Mail)) {
    console.log("invalid email");
    const response = {
      statusCode: 420,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
      },
      body: "invalid email",
      isBase64Encoded: false,
    };
    //Response to be sent to the user
    callback(null, response);
  }

  const scan = {
    TableName: "AnandTable",
    Key: {
      Email_ID: Mail,
    },
  };

  // function to write mail and generated otp to the database
  function writedata(Mail) {
    var params = {
      Item: {
        Email_ID: Mail,
        OTP: otpno,
        tries: 0,
        Verification_Status: "not verified",
        Expiry_Time: Date.now(),
      },
      TableName: "AnandTable",
    };
    docClient.put(params, function (err, data) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, data);
      }
    });
  }

  //function to send generated otp to user email address
  function sendMail(Mail) {
    const sgmail = require("@sendgrid/mail");

    const APi_key =
      "avvsajsjadsrandom key";
    sgmail.setApiKey(APi_key);
    var id = Mail;
    const message = {
      to: `${id}`,
      from: "tyrinlannister2001@gmail.com",
      subject: "otp",
      Text: `your otp for verification is  ${otpno}`,
      // html: '<h1>hi</h1>'
    };

    sgmail
      .send(message)
      .then((response) => console.log("email sent"))
      .catch((error) => console.log(error));
  }

  //function to update the otp and time  when  new otp send to user
  function updateotp(Mail) {
    var updatedata = {
      TableName: "AnandTable",
      Key: {
        Email_ID: Mail,
      },
      //Defining the paramters to be updated in DynamoDB if otp was resend
      UpdateExpression: "set OTP = :r, Expiry_Time=:q",
      ExpressionAttributeValues: {
        ":r": otpno,
        ":q": Date.now(),
      },
      ReturnValues: "UPDATED_NEW",
    };
    docClient.update(updatedata, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log("successfully updated");
      }
    });
  }

  //main code of lambda function
  docClient.get(scan, function (err, data) {
    if (err) {
      const response = {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
        },
        body: "error",
        isBase64Encoded: false,
      };
      callback(null, response);
    } else {
      if (data.Item) {
        // checking whether entered email already there in the database or not
        console.log("mail found");

        if (data.Item.Verification_Status === "verified") {
          const response = {
            statusCode: 403,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "POST",
            },
            body: "already verified",
            isBase64Encoded: false,
          };
          //Response to be sent to the user
          callback(null, response);
          // checking whether the email is already verified or not
          console.log("your email id is verified");
        } else {
          console.log(data.Item);
          // whether user has chances left then it will resend the otp
          if (data.Item.tries < 3) {
            console.log("send another otp");
            sendMail(Mail);
            updateotp(Mail);

            const response = {
              statusCode: 200,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST",
              },
              body: "resend  otp",
              isBase64Encoded: false,
            };
            //Response to be sent to the user
            callback(null, response);
          } else {
            // if user had used all 3 tries
            console.log("no of attempts has been exceeded");
            const response = {
              statusCode: 403,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST",
              },
              body: "no of attempts has been exceeded",
              isBase64Encoded: false,
            };
            callback(null, response);
          }
          console.log("Not verified");
          const response = {
            statusCode: 200,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "POST",
            },
            body: "Mail sent",
            isBase64Encoded: false,
          };
          callback(null, response);
        }
      } else {
        // if entered mail not in data base then it will send a otp
        writedata(Mail);
        sendMail(Mail);
        console.log("mail not found");
        const response = {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
          },
          body: "Mail sent",
          isBase64Encoded: false,
        };
        callback(null, response);
      }
    }
  });
};