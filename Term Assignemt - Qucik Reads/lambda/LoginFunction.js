const AWS = require("aws-sdk");

const secretsManager = new AWS.SecretsManager();

const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  try {
    const { email, password } = event;

    const secretData = await secretsManager
      .getSecretValue({ SecretId: "Secrets" })
      .promise();
    const secret = JSON.parse(secretData.SecretString);

    const params = {
      TableName: secret.TABLENAME,
      FilterExpression: "#email = :email",
      ExpressionAttributeNames: {
        "#email": "email",
      },
      ExpressionAttributeValues: {
        ":email": email,
      },
    };

    const data = await dynamoDB.scan(params).promise();

    if (data.Items.length > 0) {
      const user = data.Items[0];
      if (user.password === password) {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: "Login successful" }),
        };
      } else {
        return {
          statusCode: 401,
          body: JSON.stringify({ message: "Invalid email or password" }),
        };
      }
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "User not found" }),
      };
    }
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
