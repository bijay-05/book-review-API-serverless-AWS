const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const CATEGORY_TABLE = process.env.CATEGORY_TABLE;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

exports.getCategoryList = async () => {
  const params = {
    TableName: CATEGORY_TABLE,
  };

  try {
    const command = new ScanCommand(params);
    const { Items } = await docClient.send(command);

    if (Items.length == 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "Not found",
          data: [],
        }),
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Category list retrieved successfully!",
          data: Items,
        }),
      };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error retrieving categories.",
      }),
    };
  }
};
