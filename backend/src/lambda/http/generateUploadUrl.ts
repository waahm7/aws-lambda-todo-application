import 'source-map-support/register'
import{generateURL} from '../../businessLogic/Todo'
import{todoExist} from '../../businessLogic/Todo'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  console.log('Processing event: ', event)

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const validGroupId = await todoExist(todoId)

  if (!validGroupId) {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true 
      },
      body: JSON.stringify({
        error: 'Group does not exist'
      })
    }
  }else{
    const uploadUrl= await generateURL(todoId,event)
    console.log('Processing before result: ', {uploadUrl})

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
        //'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT',
        //'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
      },
      body: JSON.stringify({
        uploadUrl
      })
    }
  }
}
