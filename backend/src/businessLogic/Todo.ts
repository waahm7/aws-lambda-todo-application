import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { parseUserId } from '../../src/auth/utils'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { getUserId } from '../lambda/utils'
import { UpdateItemOutput, DeleteItemOutput } from 'aws-sdk/clients/dynamodb';

const groupAccess = new TodoAccess()

export async function getAllTodos(event:APIGatewayProxyEvent): Promise<TodoItem[]> {
    const userId=await getUserId(event)
   return await groupAccess.getAllTodos(userId)
}
export async function generateURL(todoId:string,event:APIGatewayProxyEvent):Promise<any>{
    const userId=await getUserId(event)
    return await groupAccess.generateUrl(todoId,event,userId)
}

export async function updateTodo(todoId, updatedTodo:UpdateTodoRequest): Promise<UpdateItemOutput[]>{
    return groupAccess.updateTodo(todoId, updatedTodo); 
}
export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {

  const todoId = uuid.v4()
  const userId = parseUserId(jwtToken)

  return await groupAccess.createTodo({
    todoId: todoId,
    userId: userId,
    name: createTodoRequest.name,
    createdAt: new Date().toISOString(),
    dueDate: createTodoRequest.dueDate,
    done: false
  })
}
export async function deleteTodo(ID:string){
    return await groupAccess.deleteTodo(ID)
}



export async function todoExist(todoId:string):Promise<boolean>{
    const result=await groupAccess.todoExists(todoId)
    return result
}
