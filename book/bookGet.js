const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");

const BOOK_TABLE = process.env.BOOK_TABLE;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

exports.getBookDetail = async (event) => {
  const { id } = JSON.parse(event.params);

  try {
    const command = new QueryCommand({
      TableName: BOOK_TABLE,
      KeyConditionExpression: "bookId = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
      ConsistentRead: true,
    });
    const { Items } = await docClient.send(command);

    if (Items.length == 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "Not found",
        }),
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Book list retrieved successfully!",
          data: Items[0],
        }),
      };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error retrieving books.",
      }),
    };
  }
};
