/* Amplify Params - DO NOT EDIT
	API_PAGINATION_GRAPHQLAPIENDPOINTOUTPUT
	API_PAGINATION_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk')
const https = require('https')
const URL = require('url').URL
const mutation = require('./mutations').createTodo

const apiRegion = process.env.REGION
const apiEndpoint = process.env.API_PAGINATION_GRAPHQLAPIENDPOINTOUTPUT
const endpoint = new URL(apiEndpoint).hostname.toString()

const Chance = require('chance')
const chance = new Chance()

const names = ['admin', 'axel', 'bernice']

const NUMBER = 5

async function query({ queryDef }) {
  const req = new AWS.HttpRequest(apiEndpoint, apiRegion)
  req.method = 'POST'
  req.headers.host = endpoint
  req.headers['Content-Type'] = 'application/json'
  req.body = JSON.stringify(queryDef)
  const signer = new AWS.Signers.V4(req, 'appsync', true)
  signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate())

  //   console.log('req -->', JSON.stringify(req, null, 2))

  return await new Promise((resolve, reject) => {
    const httpRequest = https.request({ ...req, host: endpoint }, (res) => {
      res.on('data', (data) => {
        //   console.log('appsync > ', data)
        resolve(JSON.parse(data.toString()))
      })
    })
    httpRequest.write(req.body)
    httpRequest.end()
  })
}

exports.handler = async (event) => {
  const exec = []
  for (let i = 0; i < NUMBER; i++) {
    const variables = {
      input: {
        name: chance.sentence({ words: 5 }),
        description: chance.sentence(),
        owner: names[chance.integer({ min: 0, max: 2 })],
        dueOn: chance.date({ year: 2020 }).toISOString(),
      },
    }
    const queryDef = {
      query: mutation,
      operationName: 'CreateTodo',
      variables,
      authMode: 'AWS_IAM',
    }
    exec.push((async () => await query({ queryDef }))())
  }
  try {
    await Promise.all(exec)
  } catch (err) {
    console.log(err)
  }
}
