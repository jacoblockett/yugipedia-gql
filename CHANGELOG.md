## 2/16/2024 (v0.4.0 -> v0.4.1 -> v0.4.2)

### Bug fixes

There was a bug after the v0.4.0 update that caused cards queried through set.cards to not populate their data properly.

### Schema Updates

```gql
type Set {
    ...
    printType: String
    printNotes: String
    ...
}
```

is now 

```gql
type Set {
    print: PrintDetails
}

type PrintDetails {
    type: String
    notes: String
}
```

## 2/15/2024 (v0.3.4 -> v0.4.0)

### Return Structure Overhaul

The returned structure of the main query function has been overhauled. Let's take a look at an example to see how this changes things.

```gql
query EX_QUERY($name: String!) {
    card(name: $name) {
        error {
            code
            message
        }
        name {
            english
            korean {
                html
            }
        }
    }
}
```

```js
// ... setup

const query = " ... " // the above query
const variables = { name: "Dark Magician" }
const result = await api.query(query, variables)

console.dir(result, { depth: null })
```

This would give you the following result:

```shell
{
    data: {
        EX_QUERY: {
            card: {
                error: {
                    code: 200,
                    message: 'OK'
                }
                name: {
                    english: 'Dark Magician',
                    korean: {
                        html: '블랙 매지션'
                    }
                }
            }
        }
    }
}
```

With the new changes, the error object has been unbound from the schema's root query api in favor of two nullable arrays - "errors" and "warnings". This retains the flexible nature of not throwing an error for bad data, and adds to it the even-more-flexible nature of not throwing random errors for every minute issue that may or may not arise. It even gives more readable and obvious logging messages. Let's take a look at a new query and response.

```gql
query EX_QUERY($name: String!) {
    card(name: $name) {
        name {
            english
            korean {
                html
            }
        }
    }
}
```

```shell
{
    data: {
        EX_QUERY: {
            card: {
                name: {
                    english: 'Dark Magician',
                    korean: {
                        html: '블랙 매지션'
                    }
                }
            }
        }
    },
    errors: [],
    warnings: []
}
```

Errors and warnings will assume the following shape:

```ts
{
    culprit: string, // this is the name of the query that produced the error/warning
    code: number, // a very descriptive code number denoting what type of error/warning it is
    log: {
        message: string, // the main message of the error/warning
        payload: unknown, // any data that is pertinent to understanding the error/warning
    }
}
```

Here's an example of the errors and warnings in action:

```gql
query  {              
    card(name: "Dark Mgician") { 
#                    ^^^^^^^ Notice the typo here        
        name {
            english
            korean {
                html
            }
        }
    }
}
```

```shell
{
    data: { query: { card: {} } },
    errors: [
        {
            culprit: 'card',
            code: 404,
            log: { message: 'No data could be found for the page "Dark Mgician"' }
        }
    ],
    warnings: [
        {
            culprit: 'card',
            code: 300,
            log: {
                message: '[getOneCardByNameResolver] Data missing. There is likely an error log explaining this.'
            }
        }
    ]
}
```

As you can see, it's quite easy to lead yourself to the solution given this new structure and information.

### Error/Warning Overhaul

With the return structure overhaul there comes also an error and warning overhaul inherent to it. Codes have been standardized, defined, and strictly enforced, and messages are deliberate and informative. The codes and their meanings are as follows:

#### Basic Categories:

* __`3xx`__ - These are reserved for warnings
* __`4xx`__ - These are reserved for errors originating from data collection, such as scraping and/or api errors
* __`5xx`__ - These are reserved for internal errors, such as GQL query syntax errors or fatal errors (usually my fault; sorry in advance!)

#### Breakdown - 3xx:

* __`300 <Missing Data>`__ - Describes data that is missing when it was expected by a parser or formatter.
* __`301 <Missing/Corrupted Data>`__ - Describes data that is missing or corrupted as a resource on the fetched endpoint. (to be clear, it's data that _should_ exist, but for some reason doesn't)

#### Breakdown - 4xx:

* __`400 <Bad Request>`__ - The data that was requested doesn't match the data that was found. For instance, if a name you provided for the `card` query matches a set instead, etc.
* __`402 <Scrape Failed>`__ - A scraping request failed. Most likely this will be caused by Yugipedia not being in good health for one reason or another.
* __`403 <API Error>`__ - The underlying SMW/MW API produced an error.
* __`404 <Data Not Found>`__ - The data you requested doesn't exist as a resource on the providing server. This will most likely occur due to spelling errors.

#### Breakdown - 5xx:
* __`500 <GQL Error>`__ - These errors are produced by the underlying GraphQL interpreter, usually denoting syntax errors or issues.
* __`501 <Unknown Error>`__ - The errors that was raised is known to be unknown. These will be random, uncaught and untested errors that are thrown by anyone from anywhere down the chain. These shouldn't be common, but still might occur.