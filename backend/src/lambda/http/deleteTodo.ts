import 'source-map-support/register'
import{deleteTodo} from '../../businessLogic/Todo'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    console.log('Processing event: ', event)
    console.log('Processing event: ', event)

    // TODO: Remove a TODO item by id
    const deletedTodo=await deleteTodo(todoId)
    console.log('Processing before result: ', {deletedTodo})

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        deletedTodo
      })
    }
  

  }
