# Hamster CDK

This package provisions Hamster's AWS infrastructure and uploads associated code that belongs on the infrastructure.

## Useful commands

* `npm run deploy`  deploy to prod

## Developer Guide

This guide will walk you through the following common usage scenario:

1. Create a new API endpoint in API Gateway (api proxy).
1. Attach endpoint to an integration (the code invoked by the proxy).
1. Handle proxy request from the integration (lambda only for this guide).
1. Execute a CRUD operation on a database.
1. Return a response to the proxy.
1. Call the API from a client.

### Create a new API endpoint with Lambda integration

In AWS, API Gateway is the service most commonly used to handle API requests to resources within AWS. To create a new API endpoint, you need to create an HTTP resource under the API Gateway. To create a new resource, follow these steps:

1. Go to cdk/lib. Pick the stack your API belongs in, and open the corresponding file.
1. Find the function that creates the API Gateway. There are a few functions below that create resources and nested resources that can be copy-pasted to create new resources.
1. Create an HTTP method using resource.addMethod('HTTP_VERB') in your new function so the endpoint can be called.
1. There is already a default integration, but if needed, it can be overriden in the addMethod function.

### Handle the HTTP request in Lambda

When Lambda is used as an API Gateway integration, a Lambda instance invoked for every request. The handler function in handler.ts under entries-api-lambda is the code that is triggered upon invocation. To handle 
