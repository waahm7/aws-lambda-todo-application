import 'source-map-support/register'
import{getAllTodos} from '../../businessLogic/Todo'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const TODOSTABLE = process.env.TODOS_TABLE
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  console.log('Processing event: ', event)
  
  const items=await getAllTodos(event)
  return{
      statusCode:200,
      headers:{
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
        //'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT',
        //'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
      },
      body:JSON.stringify({
          items
      })
  
  }

}

