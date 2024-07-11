const { DynamoDB } = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const { S3 } = require("aws-sdk");
const AWS = require("aws-sdk");
const dynamodb = new DynamoDB();
const s3 = new S3();

const secretsManager = new AWS.SecretsManager();

exports.handler = async (event) => {
  try {
    const { title, email, description, image } = event;

    const secretData = await secretsManager
      .getSecretValue({ SecretId: "Secrets" })
      .promise();
    const secret = JSON.parse(secretData.SecretString);

    const base64Data = image.split(",")[1];
    const decodedImage = Buffer.from(base64Data, "base64");
    const imageKey = `${uuidv4()}.png`;

    const uploadParams = {
      Bucket: secret.BUCKET,
      Key: imageKey,
      Body: decodedImage,
      ContentType: "image/*",
    };
    await s3.upload(uploadParams).promise();

    const imageUrl = `https://${uploadParams.Bucket}.s3.amazonaws.com/${uploadParams.Key}`;
    const putParams = {
      TableName: secret.TableForReport,
      Item: {
        id: { S: uuidv4() },
        title: { S: title },
        email: { S: email },
        description: { S: description },
        imageUrl: { S: imageUrl },
      },
    };
    await dynamodb.putItem(putParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Report submitted successfully" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error submitting report" }),
    };
  }
};
