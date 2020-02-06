'use strict';
 
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

admin.initializeApp({
	credential: admin.credential.applicationDefault(),
  	databaseURL: 'https://pizzachatbot-3f2b8.firebaseio.com/'
});
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function addorder(agent){
    const type = agent.parameters.type;
    const size = agent.parameters.size;
    const count = agent.parameters.amount;
    const name = agent.parameters.user;
    const phone = agent.parameters.phone;
    const city = agent.parameters.city;
    const state = agent.parameters.state;
    const country = agent.parameters.country;
    
    return admin.database().ref('data').set({
    	type: type,
      	size: size,
      	count: count,
      name: name,
      phone: phone,
      city: city,
      country: country,
      state: state
    });
  }
  // Run the proper function handler based on the matched Dialogflow intent name
  let itemstartgeneric = new Map();
  itemstartgeneric.set('Default Fallback Intent', fallback);
  itemstartgeneric.set('item.exitchatbot', addorder);
  agent.handleRequest(itemstartgeneric);
});
