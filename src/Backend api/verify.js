const aws = require("aws-sdk");
const docClient = new aws.DynamoDB.DocumentClient({ region: "ap-south-1" });
exports.handler = (event, context, callback) => {
  //  function to update the tries of the user
  function updatetries(email) {
    var updateParams = {
      TableName: "AnandTable",
      Key: {
        Email_ID: email,
      },
      UpdateExpression: "set tries=tries + :r",
      ExpressionAttributeValues: {
        ":r": 1,
      },
      ReturnValues: "UPDATED_NEW",
    };
    docClient.update(updateParams, function (err, data) {
      if (err) {
        const response = {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
          },
          responseBody: "unable to update tries",
          isBase64Encoded: false,
        };
        callback(null, response);
      } else {
        console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
      }
    });
  }

  // function to update the status in dynamo db
  function updateStatus(email) {
    var updatestatus = {
      TableName: "AnandTable",
      Key: {
        Email_ID: email,
      },
      UpdateExpression: "set Verification_Status= :r",
      ExpressionAttributeValues: {
        ":r": "verified",
      },
      ReturnValues: "UPDATED_NEW",
    };

    docClient.update(updatestatus, function (err, data) {
      if (err) {
        const response = {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
          },
          responseBody: "Unable to update",
          isBase64Encoded: false,
        };
        callback(null, response);
      } else {
        console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
      }
    });
  }

  // main code of lambda function

  // function to get the maximum limit for expiry time
  function getTime() {
    return Date.now() - 180000;
  }

  const { Otp, email } = event;
  const scan = {
    TableName: "AnandTable",
    Key: {
      Email_ID: email,
    },
  };

  docClient.get(scan, function (err, data) {
    if (err) {
      const response = {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
        },
        responseBody: "error",
        isBase64Encoded: false,
      };
      callback(null, response);
    } else {
      // checking whether the mail is present at database or not
      if (data.Item) {
        console.log("data found");
        // checking whether the input otp is correct or not

        if (data.Item.OTP == Otp) {
          //checking whether the otp entered intime or not (maximum limit for expiry is 3mins)

          if (data.Item.Expiry_Time >= getTime()) {
            console.log("verified successfull");
            // updating the status
            updateStatus(email);
            //Response to the user
            const response = {
              statusCode: 200,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST",
              },
              responseBody: "verified successfull",
              isBase64Encoded: false,
            };
            callback(null, response);
          } else {
            console.log("otp expired");
            // since user  didnt entered otp within the limit.  it updates the tries of user(maximum tries for single user is 5)
            updatetries(email);
            //Response to the user
            const response = {
              statusCode: 201,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST",
              },
              responseBody: "otp expired",
              isBase64Encoded: false,
            };
            callback(null, response);
          }
        } else {
          console.log("incorrect otp verification failed");
          // if entered otp is incorrect it updates the tries of user(maximum tries for single user is 3)
          updatetries(email);

          //Response to the user
          const response = {
            statusCode: 400,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "POST",
            },
            responseBody: "incorrect otp",
            isBase64Encoded: false,
          };
          callback(null, response);
        }
      } else {
        console.log("data not found");
        //Response to the user
        const response = {
          statusCode: 401,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
          },
          responseBody: "data not found",
          isBase64Encoded: false,
        };
        callback(null, response);
      }
    }
  });
};