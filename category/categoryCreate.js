const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");

const CATEGORY_TABLE = process.env.CATEGORY_TABLE;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateId() {
  return `ab-${randomInteger(10, 90)}-ef`;
}

exports.createCategory = async (event) => {
  const { title } = JSON.parse(event.body);

  const categoryId = generateId();

  const params = {
    TableName: CATEGORY_TABLE,
    Item: { categoryId, title },
  };

  try {
    // const queryCommand = new QueryCommand({
    //   TableName: CATEGORY_TABLE,
    //   KeyConditionExpression: "title = :categoryName",
    //   ExpressionAttributeValues: {
    //     ":categoryName": name,
    //   },
    //   ConsistentRead: true,
    // });

    // const { Items } = await docClient.send(queryCommand);

    // if (Items.length > 0) {
    //   return {
    //     statusCode: 400,
    //     body: JSON.stringify({
    //       message: "Category already exists",
    //     }),
    //   };
    // }
    const command = new PutCommand(params);
    await docClient.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Category Created successfully!",
        data: {
          categoryId,
          title,
        },
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error creating category",
      }),
    };
  }
};
