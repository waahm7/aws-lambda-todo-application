'use strict';

const Alexa = require('ask-sdk-core');
const https = require('request');

const SKILL_NAME = 'Todo List';

// Handlers
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = `Welcome to ${SKILL_NAME} made by Waqar. You can get all todos events by saying my todos`;
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard(SKILL_NAME, speechText)
            .getResponse();
    }
};

const TodoIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'TodoIntent';
    },
    async handle(handlerInput) {
        let speechText = 'Here is your todo list.1-Test';
        
        var options = { json: true };
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard(SKILL_NAME, speechText)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;            
        console.log(`Request Type: ${request.type}`);
        console.log(`Intent: ${request.intent.name}`);    
        return request.type === 'IntentRequest'
            && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can get all todos by saying my todos';
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard(SKILL_NAME, speechText)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;    
        console.log(`Request Type: ${request.type}`);
        console.log(`Intent: ${request.intent.name}`);
        return request.type === 'IntentRequest'
            && (request.intent.name === 'AMAZON.CancelIntent'
            || request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard(SKILL_NAME, speechText)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;    
        console.log(`Request Type: ${request.type}`);
        console.log(`Intent: ${request.intent.name}`);
        return request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        //any cleanup logic goes here
        return handlerInput.responseBuilder.getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
      return true;
    },
    handle(handlerInput, error) {
      console.log(`Error handled: ${error.message}`);
      return handlerInput.responseBuilder
        .speak('Sorry, I can\'t understand the command. Please say again.')
        .reprompt('Sorry, I can\'t understand the command. Please say again.')
        .getResponse();
    },
};

// helper methods
function httpGet (url, options) {
    return new Promise (function (resolve, reject) {
        let todoEvents = 'Here are the todos.1-Test';
        const space = ' ';
        const comma = ',';
        const period = '.';
        console.log(todoEvents);
        resolve (todoEvents);
    });
} 

// export the handlers
exports.todoHandler = Alexa.SkillBuilders.custom()
     .addRequestHandlers(LaunchRequestHandler,
                         TodoIntentHandler,
                         HelpIntentHandler,
                         CancelAndStopIntentHandler,
                         SessionEndedRequestHandler)
    .addErrorHandlers(ErrorHandler)
    .lambda();