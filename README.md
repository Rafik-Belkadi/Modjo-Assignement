# Modjo take-home assignments for backend engineers

Thanks for applying!

For the integrity of the process, please do not distribute or make public the assignment. Thank you!

## Context

At Modjo, we collect phone calls and online meetings recordings (both will be designed as "calls" in the following explanation) made by our customers on their phone ([Aircall](https://aircall.io/), [Ringover](https://www.ringover.fr/)...) or online meeting plaforms (Zoom, Google Meet, Microsoft Teams...), and we make them accessible on [our platform](https://app.modjo.ai). In this assignment, we will not care about the recordings themselves, we will focus on call data that is saved in our database (name of the call, date, duration...).

Generally, our customer also uses a [CRM](https://www.salesforce.com/fr/learning-centre/crm/what-is-crm/). If you're not clear with what a CRM is, you can go read about it. All you need to know is that it's a software which is used as a database with all contacts, prospects, and customers of a company. Most famous CRMs in our space are [Salesforce](https://www.salesforce.com/), [Hubspot](https://www.hubspot.fr/products/crm), and [Pipedrive](https://www.pipedrive.com/).
As the CRM of a sales organization is its central source of data, Modjo tries to feed the CRM with the most relavant data possible.

To do this, we make sure (whenever possible), that calls we have on Modjo are also registered in the CRMs of our customer. That means, a call we have in our database also contains an id that refers to the id of the corresponding call in the CRM of our customer.

This assignment will focus on a functionality of Modjo: `As a user, I can comment a call and I can push my comment in my CRM`.

## Your task

Your task will be to implement the feature of adding comments to Modjo calls, and pushing these comments into the CRM.

1. **You will define a Comment entity**. A user can comment a call. A comment is timestamped to a specific moment in the call, and contains a the message written by the user.

2. You will **expose and implement an endpoint to add a comment** to a Modjo call. A comment should be created in the database.

3. You will **expose and implement an endpoint to push an existing comment to Pipedrive**. For this, we will consider that Pipedrive is the only possible CRM, so the `crmActivityId` in calls must relate to a Pipedrive activity.
   The logic of this endpoint will be:

- if the call related to this comment does not have a `crmActivityId`, then return an error. If you want to return a specific error type and think it's worth it, you can look at https://docs.nestjs.com/exception-filters#built-in-http-exceptions for ideas.
- otherwise you will update the Pipedrive activity note in order to add the comment message in the description. Your function will follow this principle:
  - if it's the first comment to be pushed on Pipedrive for this call, it will add a line `Comment on Modjo`, and then add the actual comment on the next line
  - if a comment was already pushed on Pipedrive for this call, then the actual comment will be just appended after a new line.
    Below is an example of how a note can in the CRM can look like and how your function should behave when pushing comments to it:

```ts
// Example what an activity note could look like in a CRM before pushing a comment to it:

This call on Modjo 🥝:
https://app.modjo.ai/call-details/1?utm_source=crm
Made with Aircall



// After pushing the first comment "The propsect thinks our product is awesome", the note should be like:

This call on Modjo 🥝:
https://app.modjo.ai/call-details/1?utm_source=crm
Made with Aircall

Comment on Modjo:
The propsect thinks our product is awesome



// After pushing a second comment "He also thinks it's not expensive compared to the value it provides!", the note should be like:

This call on Modjo 🥝:
https://app.modjo.ai/call-details/1?utm_source=crm
Made with Aircall

Comment on Modjo:
The propsect thinks our product is awesome

He also thinks it's not expensive compared to the value it provides!
```

_Understand that this is just an example of an initial note that ends with `Made with Aircall`, but the content of the note might be anything else !_

4. You will **unit test** what you think deserves it.

   _If you think it's worth it to Mock a database or use a test database to unit tests some parts of the code, you can do it with the [NestJS testing module](https://docs.nestjs.com/fundamentals/testing). But you don't have to. We generally focus on unit testing code which executes logic that deserves testing_

## Code provided

We've provided you with a working project that contains:

- A working [NestJS web server](https://docs.nestjs.com/)
- A SQLite database (in the test.db file)

### Server

The server exposes 3 endpoints:

- `GET /` is the default hello world endpoint
- `POST /calls` allows to create calls in the database
- `GET /calls` returns all calls

### Database

The database provided is contained in the `test.db` file.
The current sql database contains 2 tables: `call` and `comment`. You can use sqlite commands to explore what's inside the database.

### Principles

_Note: this part may be particularly useful to help you understand the code, after you took a first look at the different files there are_

The project follows principles and patterns proposed by NestJS, that we use as Modjo.
More specifically, it uses:

- entities for defining our database objects and tables (using [Typeorm](https://typeorm.io/#/))
- controllers for referencing endpoints and validating user input thanks to Data Transfer Objects (dto) and `class-validator` package
- jest for testing
- repositories to make requests at the database level (using [Typeorm](https://typeorm.io/#/))
- services to hold the "business logic"
- modules for segragating code and structuring the project. Modules can be useful for importing other modules your module services depend on, and also to export those services if they need to be used somewhere else, without having to manage the dependencies of the imported Service. Ex: If I want to use the `CallService` in the `CommentService`, I will import the `CallModule` (that exports `CallService`), in order to have the `CallService` + its dependencies, instead of directly declaring the `CallService` as a provider of the `CommentModule`.

If you want more details about patterns used in this project, you will probably find answers on NestJS documentation.

## Pipedrive

You will use the [Pipedrive API documentation on activities](https://developers.pipedrive.com/docs/api/v1/Activities) to make sure you are able to get and update activities notes.

For API requests, there's nothing is specific about Nest. You can use any Node library of your choice that is able to send http requests..

For authenticating your requests to Pipedrive server, you can use the API token provided in the `PipedriveService`.

To see the result of your API calls, you can also login into our Pipedrive sandbox account with the follwoing credentials:

- Username: matthieu@modjo.ai
- Password: PipedriveLovesModjo2020

To get an example of a call activity that you should update the activity note for, you can use Postman to create activities using the Pipedrive API ([using this endpoint](https://developers.pipedrive.com/docs/api/v1/Activities#addActivity)) and using the payload:

```json
{
  "subject": "Example call for developer assignment",
  "note": "This call on Modjo:<br><a href=\"https://app.modjo.ai/call-details/1?utm_source=crm\" rel=\"noopener noreferrer\" target=\"_blank\">https://app.modjo.ai/call-details/1?utm_source=crm</a><br>Made with Aircall",
  "due_date": "2022-01-01",
  "person_id": 1
}
```

It could help you visualizing the Activities your are modifiying in Pipedrive's UI.

## Start

What you need to do to start the project:

Make sure you have NodeJS v12 installed (see https://docs.nestjs.com/first-steps#prerequisites) with `yarn` (or `npm`).

Then, all you have to do is:

```sh
yarn install

yarn start
```

And start coding !

## BONUS

If that was too easy, you want to go further, or you want to prove us you're the best in town, here is a list on bonuses you can do to impress us:

- Deploy the server and give us a URL so that we can test it remotely
- Create the OpenAPI Swagger documentation for your server with https://docs.nestjs.com/openapi/introduction
- Anyhting else that you find useful or relevant

To submit your solution, you can either create a GitHub repo and give us access to it, or send us the code as a zip file.

## What we'll evaluate

Beyond correctness, we expect your code to be production-ready and unit tested.
You should feel good enough about your code to present it to your teammates in a pull-request.

You should generally keep the coding style and conventions that are already used in this project. Unless you think it deserves changes.

In particular, we'll pay attention to:

- Readability (naming, comments, complexity management)
- Maintainability (modularity, avoiding repetitions)
- Pragmatism (not reinventing the wheel, conciseness)
- Management of edge cases in the API
- Relevance and coverage of unit tests

Please limit your effort to 6 hours and provide a README with next steps and improvement ideas. We'll take those into account in our evaluation!

Also, although this project uses NestJS and Typeorm, you don't have to understand everything about them to complete the assignment. Please make sure that you understand the minimum about it and how pieces work together, but try not to spend all your time on it, the goal is not to become a Nest expert.

# Below is a the original README.md or NestJS bootstrapped projects

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
