
# Serverless OTP-System

Serverless OTP-System is a web application which is used to verify your 
email by entering OTP.

- First you have to enter your email in a signup page.
- Then you will get 6 digit OTP to your email.
- By entering the correct OTP you can navigate to next page.
## screen shots
![Sign Up Page](https://i.imgur.com/lcqMSqB.png)
![verify page](https://i.imgur.com/oYmlV0G.png)
![userdashboard page](https://i.imgur.com/yu9Jngk.png)

## Hosted URL
 can access the [website](https://serverlessless-otpsystem.netlify.app/) .
 ## packages/libraries used in project.

we have developed our project by using aws cloud sevice as a backend 
and React.js as front-end.
## services used in aws

 ### API Gateway
 An API gateway is an API management tool that sits between
a client and a collection of backend services.

 ### Dyanomo db
 DynamoDB is an Amazon Web Services database system that
supports data structures and key-valued cloud services. It
 allows users the benefit of auto-scaling, in-memory caching, backup 
and restore options for all their internet-scale applications using DynamoDB.

### Lambda function
AWS Lambda is a serverless compute service that runs your code in
 response to events and automatically manages the underlying compute resources for you.

 ## Tools/packages used in  Front-End 
 ### React.js
 React is a JavaScript library for building user interfaces. React is 
 used to build single-page applications.

 ### Material-UI 
 Material-UI is simply a library that allows us to import and use different
  components to create a user interface in our React applications.

  ## Local Setup
  ### Front-End 
-   Clone this repository to your computer
 -  Go to the Frontend folder and install all the dependencies using npm install.
 -  Start the application using npm run.

 ### Back-End

-  Make an AWS account.
- Create a new lambda function for node.js and paste the [generateotp.js](src/Backend/generateotp.js) code into it.
- Make another lambda function and paste the [verify.js](src/Backend/verify.js) code into it.
- Make a DynamoDB table with Email as partition key. Add this DynamoDB as trigger to both the lambda functions after assigning them the DynamoDBFullAccess role.
- Create a new AWS API gateway and integrate the methods with the respective lambda functions to get the desired endpoint URL.
## Team members

### Team-17

- 2020BCS072 THOTA SHANMAI
- 2020IMT008 BATCHALA ANAND
- 2020BCS045 KAMMARI ANOOP
