const AWS = require("aws-sdk");
const sns = new AWS.SNS();

const secretsManager = new AWS.SecretsManager();

exports.handler = async (event, context) => {
  try {
    const secretData = await secretsManager
      .getSecretValue({ SecretId: "Secrets" })
      .promise();
    const secret = JSON.parse(secretData.SecretString);

    for (const record of event.Records) {
      if (record.eventName === "INSERT") {
        const { title, email, description, imageUrl } =
          record.dynamodb.NewImage;
        const message = `New report "${title.S}" has been added. Description: ${description.S}`;
        const snsParams = {
          Message: message,
          TopicArn: "arn:aws:sns:us-east-1:851725522045:ReportNotifications",
        };
        await sns.publish(snsParams).promise();
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Report added successfully" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
