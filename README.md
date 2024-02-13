# Yugipedia GQL Wrapper

A GraphQL wrapper around the [MediaWiki API](https://en.wikipedia.org/wiki/MediaWiki) for [Yugipedia](https://yugipedia.com/wiki/Yugipedia:API). Designed to make the queries and results more intuitive and simple.

## Installation

You'll need to have [NodeJS](https://nodejs.org/en/download) installed on your computer. It's best to have the most up-to-date LTS version installed. I typically test with the current version, but there's nothing fancy in here that shouldn't work for LTS. For reference, the Node version I used during testing was 21.2.0.

Once you have that installed, it should install NPM as a command line interface by default.

You can verify both NodeJS and NPM are installed properly by running the following command in your terminal/emulator of choice:

```shell
node -v
npm -v

# => v##.##.##
# => ##.##.##
```

Finally, cd into your directory of choice and create a new npm project:

```shell
cd "YOUR\\PREFERED\\DIRECTORY"

touch index.js

npm init -y

npm pkg set type="module"

npm i yugipedia-gql
```

## Usage

General understanding of the [GraphQL language](https://graphql.org/learn) is highly recommended before attempting to use this API wrapper.

> ___Note___ - There is no need to roll your own rate limiter - all queries are rate limited to one page per second maximum to align with [the wishes of the API devs. (See: Request limit)](https://yugipedia.com/wiki/Yugipedia:API).

### Signature

```ts
class Yugipedia {
    constructor(
        userAgent: {
            name: string;
            email: string;
            reason?: string;
        }
    )

    query(
        gqlQueryString: string,
        variables?: {
            [key: string]: unknown
        }
    ): Promise<{
        [key: string]: unknown
    }>
}



```

### Basic Usage

```js
import Yugipedia from "yugipedia-gql"

const api = new Yugipedia({
    name: "YOUR_NAME",
    email: "YOUR_EMAIL@provider.com",
    reason: "Testing the GraphQL wrapper for Yugipedia"
})

// It's highly recommended to include the error object within your query
const queryString = `#graphql
    query data($name: String!) {
        card(name: $name) {
            error {
                code
                message
            }
            name {
                english
                japanese {
                    base
                    annotation
                }
            }
        }
    }
`
const variables = { name: "Dark Magician" }
const result = await api.query(queryString, variables)

console.dir(result, { depth: null }) // In case you didn't know, this allows you to recursively see an object's entire structure in the terminal. Not important for this API's usage, but useful nonetheless!
```

The result of the above should look a little something like this:

```json
{
    "data": {
        "card": {
            "error": { 
                "code": 200, 
                "message": "OK"
            },
            "name": {
                "english": "Dark Magician",
                "japanese": {
                    "base": "ブラック・マジシャン",
                    "annotation": null
                }
            }
        }
    }
}
```

___

You can also use aliases and make multiple requests. For instance:

```gql
query data($name1: String!, $name2: String!, $name3: String!) {
    DarkMagician: card(name: $name1) {
        types
    }
    DarkMagicAttack: card(name: $name2) {
        properties: types
    }
    LegendOfBlueEyes: set(name: $name3) {
        releaseDate
    }
}
```

will give you:

```json
{
    "data": {
        "DarkMagician": {
            "types": [ "Spellcaster", "Normal" ]
        },
        "DarkMagicAttack": {
            "properties": [ "Normal" ]
        },
        "LegendOfBlueEyes": {
            "releaseDate": {
                "english": {
                    "earliest": "2002-03-08T00:00:00.000Z"
                }
            }
        }
  }
}
```

___

## Redirects

This wrapper will make an attempt to resolve redirects as best as possible. That means querying the set for [`"LOB"`](https://yugipedia.com/wiki/LOB) and [`"Legend of Blue Eyes White Dragon"`](https://yugipedia.com/wiki/Legend_of_Blue_Eyes_White_Dragon) should yield the same page. It's not perfect, though, and relies on the API's internal ability to resolve redirects so it's best to try to make sure names you provide lead to an active page before querying for it if you're able to beforehand.

## Errors

Errors come in two varieties - Those produced by the Yugipedia API and those produced by malformed GraphQL query syntax. Both will populate the error object on the type it was called on in the `{ error: { code: number, message: string } }` format. It is highly recommended to include the error object in every query you make - results may be confusing otherwise. Codes to be aware of:

__`200`__ : OK - The request produced no errors and the results shouldn't be malformed.

__`400`__ : Bad Request - The request you made doesn't match the type of data you asked for. This might happen if the page name you provided for a card query matches an archetype page, for example.

__`404`__ : Not Found - The request you made doesn't actually exist. This might be a spelling error or a lack of resources on the Yugipedia server matching your request.

__`500`__ : Server Error - This is expected to only be GraphQL syntax errors. Expect the message on this to be a JSON string representing an array of errors found.

> ⚠️ If you happen upon an error code or weird message that doesn't really fit these descriptions, please create an issue about it. In the issue, make sure to provide your relevant code that caused the error so I can reproduce it, and a screenshot or copy/pasta of what I should expect to see.

## Schema

Below are some helpful descriptions of various fields found on root types. The entire schema definition can be found [here](https://github.com/jacoblockett/yugipedia-gql/blob/main/gql/SCHEMA.md).

### ___`card(name: String!): Card <RootQuery>`___

* __`Card.actions <Actions>`__ - specific actions this card takes
* __`Card.anti <AntiOrPro>`__ - cards that are targeted by this card
* __`Card.appearsIn <[String!]>`__ - titles of media in which this card has appeared
* __`Card.cardType <String>`__ - this card's type (monster, spell, trap, etc.)
* __`Card.charactersDepicted <[String!]>`__ - what characters are seen in the art of this card
* __`Card.debutDate <DebutDate>`__ - the dates this card debuted for specific formats
* __`Card.deckType <String>`__ - which deck type this card belongs to (main, side, etc.)
* __`Card.description <CardText>`__ - 'lore' or description box text of this card
* __`Card.effectTypes <[String!]>`__ - what types of effects this card performs
* __`Card.error <Error>`__ - a generic error object recommended to tag along with every query
* __`Card.image <CardImage>`__ - details on images, including names and links
* __`Card.isReal <Boolean>`__ - denotes if the card exists in the physical ocg/tcg
* __`Card.konamiID <String>`__ - the database ID Konami uses for this card
* __`Card.limitation <String>`__ - limitation text provided by this card
* __`Card.materials <Materials>`__ - materials required or used for this card in its lifetime
* __`Card.mediums <[String!]>`__ - the formats in which this card exists (ogc, tcg, games, etc.) (different with releases in that this is more general)
* __`Card.mentions <[Card!]>`__ - the cards mentioned by this card
* __`Card.miscTags <[String!]>`__ - tags/search properties that don't have their own specific category
* __`Card.name <CardText>`__ - the name of this card
* __`Card.page <WikiPage>`__ - meta details on the wiki page for this card
* __`Card.password <String>`__ - the password of this card
* __`Card.pendulum <Pendulum>`__ - pendulum details on this card
* __`Card.printNotes <String>`__ - any notes about the print of this card (like alt art, etc. - only available when queried through a set)
* __`Card.printType <String>`__ - the print type of this card (new, reprint, etc. - only available when queried through a set)
* __`Card.pro <AntiOrPro>`__ - cards that are supported by this card
* __`Card.rarity <String>`__ - the rarity of this card (only available when queried through a set)
* __`Card.related <Related>`__ - page names representing pages that are related to this card
* __`Card.releases <[String!]>`__ - the specific release titles this card is associated with (different with mediums in that this is more specific)
* __`Card.setCode <String>`__ - the set code of this card (only available when queried through a set)
* __`Card.stats <Stats>`__ - stats on this card, such as attack, defense, level, etc.
* __`Card.status <Status>`__ - the status given a card in official formats (limited, forbidden, etc.)
* __`Card.summonedBy <[Card!]>`__ - the cards that summon this card, typically used on token cards
* __`Card.types <[String!]>`__ - the types (warrior/effect/etc.) or spell/trap properties (continuous/equip/etc.) this card has
* __`Card.usedBy <[String!]>`__ - characters and their decks in which this card were used

> ___Note___ - The `card` API is mainly focused on physical cards. It shouldn't throw an error (untested) when retrieving non-physical cards, such as video game cards, anime cards, etc., but the properties specific to those pages have been neglected for now. There is currently no plan to implement these properties as it would require many, many hours to scrape the `"All cards"` category members' properties to compile a complete and accurate list.

___

### ___`set(name: String!): YGOSet <RootQuery>`___

* __`YGOSet.cards <CardList>`__ - the cards that are part of this set's setlist (previous versions of this field were quite slow but have now been heavily optimized. what took 2.5 minutes before for a query to LOB now takes about 15-20 seconds. have fun!)
* __`YGOSet.code <ProductCode>`__ - the product codes for this set (ISBN, etc.)
* __`YGOSet.coverCards <[Card!]>`__ - the cards that appear on the packaging for this set
* __`YGOSet.error <Error>`__ - a generic error object recommended to tag along with every query
* __`YGOSet.format <String>`__ - the format in regards to forbidden and limited lists (not common on sets, but does exist here and there)
* __`YGOSet.image <String>`__ - the main image used in the wiki for this set
* __`YGOSet.konamiID <SetKonamiDatabaseID>`__ - the database ID used by Konami for this set
* __`YGOSet.mediums <[String!]>`__ - the formats in which this set exists (ogc, tcg, games, etc.)
* __`YGOSet.name <LocaleText>`__ - the name of this set
* __`YGOSet.page <WikiPage>`__ - meta details on the wiki page for this set
* __`YGOSet.parent <Set>`__ - the parent set to this set
* __`YGOSet.prefix <Prefix>`__ - the prefixes for this set
* __`YGOSet.promotionalSeries <String>`__ - the promotional series this set belongs to (core boosters, etc.)
* __`YGOSet.regionalPrefix <Prefix>`__ - the region-specific prefixes for this set
* __`YGOSet.releaseDate <SetReleaseDate>`__ - this set's release date
* __`YGOSet.type <String>`__ - the type of set this set is (booster, tin, etc.)