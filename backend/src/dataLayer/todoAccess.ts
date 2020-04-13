import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import * as uuid from 'uuid'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { UpdateItemOutput, DeleteItemOutput } from 'aws-sdk/clients/dynamodb';

const s3 = new AWS.S3({
    signatureVersion: 'v4'
  })
const imagesTable = process.env.IMAGES_TABLE
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration  = parseInt(process.env.SIGNED_URL_EXPIRATION,10)
const docClient: DocumentClient = createDynamoDBClient()

export class TodoAccess {

  constructor(
    private readonly todosTable = process.env.TODOS_TABLE) {
  }


  async createTodo(todo: TodoItem): Promise<TodoItem> {
    await docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise()

    return todo
  }
  async todoExists(groupId: string) {
    const result = await docClient
      .get({
        TableName: this.todosTable,
        Key: {
          todoId: groupId
        }
      })
      .promise()
  
    console.log('Get group: ', result)
    return !!result.Item
  }
  async getAllTodos(userId:string): Promise<TodoItem[]> {
    console.log('Getting all todos')

    const result = await docClient.query({
      TableName: this.todosTable,
      IndexName: "userId",
      KeyConditionExpression:"userId= :val",
      ExpressionAttributeValues: {
        ":val": userId
        },
        ScanIndexForward: false

    }).promise()

    const items = result.Items
    return items as TodoItem[]
  }
  async deleteTodo(todosId:string):Promise<string>{
    await docClient.delete({
      TableName: this.todosTable,
      Key:{
        "todoId": todosId
    },
      ConditionExpression:"todoId= :val",
      ExpressionAttributeValues: {
          ":val": todosId
    }
    }).promise()
    return "deleted"
    }
    async updateTodo(todoId, updatedTodo:UpdateTodoRequest): Promise<UpdateItemOutput[]>{
        const result = await docClient.update({
            TableName: this.todosTable,
            Key: {
                "todoId": todoId
            },
            UpdateExpression: "set #name=:name, #dueDate=:dueDate, #done=:done",
            ExpressionAttributeNames:{
              "#name": "name",
              "#dueDate": "dueDate",
              "#done": "done"
            },
            ExpressionAttributeValues:{
                ":name": updatedTodo.name,
                ":dueDate": updatedTodo.dueDate,
                ":done": updatedTodo.done
            },
            ReturnValues:"UPDATED_NEW"
          }).promise()

        return result as unknown as UpdateItemOutput[]
    }
     async generateUrl(todoId:string,event:any,userId:string){
        const uploadUrl= s3.getSignedUrl('putObject', {
            Bucket:bucketName,
            Key: todoId,
            Expires: urlExpiration
          })
          const imageId = uuid.v4()
          const newItem = await createImage(todoId, imageId, event)

           await docClient.update({
                TableName: this.todosTable,
                Key: { todoId },
                UpdateExpression: 'set attachmentUrl = :attachmentUrl',
                ExpressionAttributeValues: {
                  ":attachmentUrl":`https://serverless-todo-waahm9-dev.s3.amazonaws.com/${todoId}`
                },
              }).promise();
        
           return uploadUrl;
          }
}

async function createImage(todoId: string, imageId: string, event: any) {
    const timestamp = new Date().toISOString()
    const newImage = JSON.parse(event.body)
  
    const newItem = {
      todoId,
      timestamp,
      imageId,
      ...newImage,
      imageUrl: `https://${bucketName}.s3.amazonaws.com/${imageId}`
    }
    console.log('Storing new item: ', newItem)
  
    await docClient
      .put({
        TableName: imagesTable,
        Item: newItem
      })
      .promise()
  
    return newItem
  }
  function getUploadUrl(imageId: string) {
    console.log("expires"+urlExpiration)
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: imageId,
      Expires: urlExpiration
    })
    
  }
  

function createDynamoDBClient() {
  return new AWS.DynamoDB.DocumentClient()
}
