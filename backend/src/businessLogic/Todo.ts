import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { parseUserId } from '../../src/auth/utils'

const groupAccess = new TodoAccess()

export async function getAllTodos(): Promise<TodoItem[]> {
  return groupAccess.getAllTodos()
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
    attachmentUrl: createTodoRequest.attachmentUrl,
    done: createTodoRequest.done
  })
}
