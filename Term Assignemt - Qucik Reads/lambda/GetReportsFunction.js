const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB();

const secretsManager = new AWS.SecretsManager();

exports.handler = async (event) => {
  try {
    const secretData = await secretsManager
      .getSecretValue({ SecretId: "Secrets" })
      .promise();
    const secret = JSON.parse(secretData.SecretString);

    const params = {
      TableName: secret.TableForReport,
      ProjectionExpression: "title, description, imageUrl",
    };

    const data = await dynamodb.scan(params).promise();

    console.log("Retrieved reports:", data.Items);

    return {
      statusCode: 200,
      body: JSON.stringify({ reports: data.Items }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error fetching reports" }),
    };
  }
};
