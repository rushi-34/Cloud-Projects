const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const sns = new AWS.SNS();

const secretsManager = new AWS.SecretsManager();

const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  try {
    const { firstname, lastname, email, password } = event;
    const secretData = await secretsManager
      .getSecretValue({ SecretId: "Secrets" })
      .promise();
    const secret = JSON.parse(secretData.SecretString);
    const topicArn = secret.TOPIC_ARN;

    const existingUserParams = {
      TableName: secret.TABLENAME,
    };

    const existingUserData = await dynamoDB.scan(existingUserParams).promise();

    if (existingUserData.Items.some((item) => item.email === email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Email already exists" }),
      };
    }

    const params = {
      TableName: secret.TABLENAME,
      Item: {
        id: uuidv4(),
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
      },
    };

    await dynamoDB.put(params).promise();

    console.log(event);

    if (event.subscribe === "Yes") {
      const message = `New user subscribed: ${email}`;
      const snsParams = {
        Protocol: "email",
        TopicArn: topicArn,
        Endpoint: event.email,
      };
      console.log(event);
      await sns.subscribe(snsParams).promise();
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User signed up successfully" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
