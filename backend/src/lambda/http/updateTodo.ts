import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import{updateTodo} from '../../businessLogic/Todo'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('before: ', event)
  const todoId = event.pathParameters.todoId
  const updateT: UpdateTodoRequest = JSON.parse(event.body)
  console.log('Processing event: ', event)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  const updatedTodo=await updateTodo(todoId,updateT)
  console.log('Processing before result: ', {updatedTodo})

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
      //'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,UPDATE',
      //'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
    },
    body: JSON.stringify({
      updatedTodo
    })
  }
}
