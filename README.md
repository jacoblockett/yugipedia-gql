# Yugipedia GQL Wrapper

A GraphQL wrapper around the [MediaWiki API](https://en.wikipedia.org/wiki/MediaWiki) for [Yugipedia](https://yugipedia.com/wiki/Yugipedia:API). Designed to make the queries and results more intuitive and simple.

> ⚠️ This wrapper is in its early stages. As new requirements are set and the full design/structure is realized, be prepared for drastic, breaking changes on a regular basis. See the [change log](https://github.com/jacoblockett/yugipedia-gql/blob/main/CHANGELOG.md) for info on recent updates.

> ⚠️ This codebase isn't always synced up with the version hosted on [NPM](https://www.npmjs.com/package/yugipedia-gql). It is likely this version of the code is ahead in features and bug fixes, but might also be less stable. Clone with optimistic caution.

## Installation

You'll need to have [NodeJS](https://nodejs.org/en/download) installed on your computer. It's best to have the most up-to-date LTS version installed. Installing NodeJS should also install NPM as a command line interface by default.

You can verify both NodeJS and NPM are installed properly by running the following command in your terminal/emulator of choice:

```shell
node -v
npm -v
```

Finally, cd into (open) your directory of choice through your terminal/emulator and create a new npm project:

```shell
cd "REPLACE\\WITH\\YOUR\\PATH"
touch index.js
npm init -y
npm pkg set type="module"
npm i yugipedia-gql
```

## API

### class _Yugipedia_

Creates a Yugipedia API entity capable of performing basic operations.

```ts
new Yugipedia(options: {
    userAgent: {
        name: string,
        contact: string,
        reason?: string
    },
    hydratePrototype?: boolean,
    cache?: {
        path?: string,
        ttl?: {
            years?: number,
            months?: number,
            days?: number,
            hours?: number,
            minutes?: number,
            seconds?: number,
        }
    }
}): Yugipedia
```

|Argument Name|Type|Optional|Default Value|Description|
|-|-|-|-|-|
|`options.userAgent.name`|string|no||The best thing to refer to you as|
|`options.userAgent.contact`|string|no||The contact details to get a hold of you in case the devs have a question or need to reach out|
|`[options.userAgent.reason]`|string|yes|`"Data Collection for Personal Use [Yugipedia-GQL]"`|The reason you're using the API|
|`[options.hydratePrototype]`|boolean|yes|`true`|The returned data's prototype is rehydrated as the GraphQL library nullifies it. This is mostly aesthetic, so if it causes issues, set this to false|
|`[options.cache]`|object|yes|See below|The cache settings object. Set to false (_not recommended_) if you don't want caching|
|`[options.cache.path]`|string|yes|`"{cwd}/yugipedia-gql-cache"`|The path to the cache file
|`[options.cache.ttl]`|object|yes|`{ days: 30 }`|The amount of time after data has been retrieved before it should expire

### _Yugipedia.prototype.query_

```ts
Yugipedia.prototype.query(
    gqlQueryString: string,
    variables?: {[key]: unknown}
): {
    data: {[key]: unknown},
    errors: null | [{
        culprit: string,
        code: number,
        log: {
            message: string,
            payload: unknown
        }
    }],
    warnings: null | [{
        culprit: string,
        code: number,
        log: {
            message: string,
            payload: unknown
        }
    }]
}
```

|Argument Name|Type|Optional|Default Value|Description|
|-|-|-|-|-|
|`gqlQueryString`|string|no||The GraphQL query string|
|`variables`|object|yes|`{}`|The variables to use with the query|

## Usage

A general understanding of the [GraphQL language](https://graphql.org/learn) is highly recommended before attempting to use this API wrapper.

> 💡 There is no need to roll your own rate limiter as all queries are rate limited to one page per second maximum to align with [the wishes of the API devs. (See: Request limit)](https://yugipedia.com/wiki/Yugipedia:API).

### Example:

```js
import Yugipedia from "yugipedia-gql"

const api = new Yugipedia({
    userAgent: {
        name: "John Smith", // replace with your name
        contact: "jsmith@example.com", // replace with your contact method
        reason: "Testing the GraphQL wrapper for Yugipedia (https://www.npmjs.com/package/yugipedia-gql)"
    }
})

const queryString = `#graphql
    query {
        card(searchTerm: "Dark Magician") {
            name {
                english
                korean {
                    html
                }
            }
            stats {
                attribute
                attack
                defense
            }
            types
        }
    }
`
const result = await api.query(queryString)

console.dir(result, { depth: null })
```

The above result should be:

```shell
{
	data: {
		query: {
			card: {
				name: { english: 'Dark Magician', korean: { html: '블랙 매지션' } },
				stats: { attribute: 'Dark', attack: '2500', defense: '2100' },
				types: ['Spellcaster', 'Normal'],
			},
		},
	},
	errors: null,
	warnings: null,
}
```

### Explanation

Currently, there are only two root queries

```gql
card(searchTerm: String!): Card
set(searchTerm: String!): Set
```

The `searchTerm` for each root query can be anything you think will match a page of that type on Yugipedia. So, that means if Yugipedia recognizes it and can redirect to it, you're probably in business. For example, let's say we wanted info on the [_Legend of Blue Eyes White Dragon_](https://yugipedia.com/wiki/Legend_of_Blue_Eyes_White_Dragon) set. We could use the `set` root query with any of the following `searchTerm`'s:

- `"LOB"`
- `"LDD"`
- `"LOB-EN"`
- `"Legend of Blue Eyes White Dragon"`

All of these should end up querying the correct set we were looking for. And for the [_Blue-Eyes White Dragon_](https://yugipedia.com/wiki/Blue-Eyes_White_Dragon) card, for example, we could query the `card` root query with the following `searchTerm`'s and we could expect accurate results:

- `"BEWD"`
- `"Blue-Eyes White Dragon"`
- `"Blue Eyes White Dragon"`
- `"LOB-EN001"`
- `"89631139"` (the card's password)
- `"...etc."`

The wrapper will do its best to take the `searchTerm` you provide and resolve it to the page it thinks you want, but be assured it will not make any assumptions should it find ambiguous results. It strictly relies on the underlying API's ability to resolve page name redirects, but will make some case and symbol adjustments to help find things should there be a slight discrepancy. More on how redirects are handled can be found in [this section](#redirects).

___

The basic structure of a query result will have the following shape:

```ts
{
    data: {
        [key: queryTitle]: {
            [key: rootQueryName]: {
                ...unknown // whatever your requested data shape looks like
            }
        }
    },
    errors: null | [{
        culprit: string,
        code: number,
        log: {
            message: string,
            payload?: unknown
        }
    }],
    warnings: null | [{
        culprit: string,
        code: number,
        log: {
            message: string,
            payload?: unknown
        }
    }], // same signature as the errors key
}
```
___

_Stay tuned, more details and explanations to come..._

## Redirects

This wrapper will make an attempt to resolve redirects as best as possible. It does so by coercing lowercase, uppercase, propercase, titlecase, and sentencecase variations of your provided `searchTerms`s and querying them all against the API efficiently. To test this, you can try a `set` query with each of the following set names for the [_Legend of Blue Eyes White Dragon_](https://yugipedia.com/wiki/Legend_of_Blue_Eyes_White_Dragon) set; they should all succeed.

* `"lob"`
* `"Lob"`
* `"LOB"`
* `"Legend of Blue Eyes White Dragon"`
* `"legend of blue eyes white dragon"`
* `"legend_of_blue_eyes_white_dragon"`
* `"leGEND Of Blue eyeS whitE DRaGON"`

It's not infallible, unfortunately. Currently it can't handle spelling mistakes. Perhaps I add some AI to it in the future 😁🤖

## Caching

Data caching is handled for you. Every individual property you look up will be saved, and subsequent queries asking for that data will search the cache first before querying the API. There is a very important caveat with the way caching is handled that you should take into account. The code controlling the API requests is designed to batch all requests. As such, all of the data of the request must exist in the cache already if the cache is to be used at all, otherwise it will be ignored and refreshed. Let's visualize this:

### Example:

```gql
query {
    card(searchTerm: "Dark Magician") {
        name {
            english
        }
        stats {
            attack
        }
    }
}
```

Given the query above, I'd be getting the English name and attack properties. Now, let's say I realize I also want to get the defense stat:

```gql
query {
    card(searchTerm: "Dark Magician") {
        name {
            english
        }
        stats {
            attack
            defense
        }
    }
}
```

Because the defense stat doesn't exist in the cache based on our previous request the code will discard the cached data and request all of the properties from scratch.

The reasoning behind this behavior lies in the program trying to be as efficient as possible. While it may sound counter-intuitive to discard pre-existing data in the name of efficiency, not doing so would actually trigger a potential cascade of granular requests trying to account for different combinations of missing data, thus increasing the number of requests to the API _and_ your wait time. By instead performing a fresh request, we're able to batch everything into a single request (sorta, this API gets weird).

So, why is this useful to you? For two reasons. The first being that if you understand how the caching works, you'll be more likely to understand why sometimes your queries seem near-instantaneous and why sometimes they'll be delayed by a couple seconds. The other is if you want to tinker with the code yourself. This isn't thoroughly documented in the codebase, and I don't plan to either, so laying it out here gives you what you need.

## Errors/Warnings

The errors and warnings keys you'll receive are nullable, meaning they will be `null` if nothing populated them. If something exists, they will be an array of errors or warnings respectively.

#### Basic Categories:

* __`3xx`__ - These are reserved for warnings
* __`4xx`__ - These are reserved for errors originating from data collection, such as scraping and/or API errors
* __`5xx`__ - These are reserved for internal errors, specifically GQL query syntax errors

#### Breakdown - 3xx:

* __`300 <Missing Data>`__ - Describes data that is missing when it was expected by a parser or formatter.
* __`301 <Missing/Corrupted Data>`__ - Describes data that is missing or corrupted as a resource on the fetched endpoint. (to be clear, it's data that _should_ exist, but for some reason doesn't)

#### Breakdown - 4xx:

* __`400 <Bad Request>`__ - The data that was requested doesn't match the data that was found. For instance, if a name you provided for the `card` query matches a set instead, etc.
* __`402 <Scrape Failed>`__ - A scraping request failed. Most likely this will be caused by Yugipedia not being in good health for one reason or another.
* __`403 <API Error>`__ - The underlying SMW/MW API produced an error.
* __`404 <Data Not Found>`__ - The data you requested doesn't exist as a resource on the providing server. This will most likely occur due to spelling errors.

#### Breakdown - 5xx:
* __`500 <Internal Error>`__ - These errors are produced by the underlying GraphQL interpreter, usually denoting syntax errors or issues. If you find this error causes consistent, repeatable issues for you, please create an issue and I'll take a look at it.
* __`501 <Unknown Error>`__ - The error that was raised is hasn't been classified or foreseen. These will be random, uncaught and untested errors that are thrown by anyone from anywhere down the chain. These shouldn't be common, but still might occur.

#### FatalError:

You may sometimes be presented with a FatalError. These errors are internal to the scraping and data collection code and are 9.9x out of 10 caused by my missing a bug, or even potentially a breaking change to a website or API the code is using. If you see this kind of error, please create an issue immediately as it's likely not a fluke.

## Schema

Below are some helpful descriptions of various fields found on root types. The entire schema definition can be found [here](https://github.com/jacoblockett/yugipedia-gql/blob/main/gql/SCHEMA.gql).

### ___`card(searchTerm: String!): Card <RootQuery>`___

* __`Card.actions <Actions>`__ - specific actions this card takes
* __`Card.anti <AntiOrPro>`__ - cards that are targeted by this card
* __`Card.appearsIn <[String!]>`__ - titles of media in which this card has appeared
* __`Card.cardType <String>`__ - this card's type (monster, spell, trap, etc.)
* __`Card.charactersDepicted <[String!]>`__ - what characters are seen in the art of this card
* __`Card.debutDate <DebutDate>`__ - the dates this card debuted for specific formats
* __`Card.deckType <String>`__ - which deck type this card belongs to (main, side, etc.)
* __`Card.description <CardText>`__ - 'lore' or description box text of this card
* __`Card.effectTypes <[String!]>`__ - what types of effects this card performs
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
* __`Card.print <PrintDetails>`__ - print details on the card, such as notes and type (new, reprint, etc.) (only available when queried through a set)
* __`Card.pro <AntiOrPro>`__ - cards that are supported by this card
* __`Card.rarity <String>`__ - the rarity of this card (only available when queried through a set)
* __`Card.related <Related>`__ - page names representing pages that are related to this card
* __`Card.releases <[String!]>`__ - the specific release titles this card is associated with (different with mediums in that this is more specific)
* __`Card.setCategory <String>`__ - the category of this card in relation to its set (Variant card, Booster pack, etc.) (only available when queried through a set)
* __`Card.setCode <String>`__ - the set code of this card (only available when queried through a set)
* __`Card.stats <Stats>`__ - stats on this card, such as attack, defense, level, etc.
* __`Card.status <Status>`__ - the status given a card in official formats (limited, forbidden, etc.)
* __`Card.summonedBy <[Card!]>`__ - the cards that summon this card, typically used on token cards
* __`Card.types <[String!]>`__ - the types (warrior/effect/etc.) or spell/trap properties (continuous/equip/etc.) this card has
* __`Card.usedBy <[String!]>`__ - characters and their decks in which this card were used

> 💡 The `card` API is mainly focused on physical cards. It shouldn't throw an error (untested) when retrieving non-physical cards, such as video game cards, anime cards, etc., but the properties specific to those pages have been neglected for now. There is currently no plan to implement these properties as it would require many, many hours to scrape the `"All cards"` category members' properties to compile a complete and accurate list.

___

### ___`set(searchTerm: String!): Set <RootQuery>`___

* __`Set.cards <CardList>`__ - the cards that are part of this set's setlist (previous versions of this field were quite slow but have now been heavily optimized. what took 2.5 minutes before for a query to LOB now takes less than 20 seconds. have fun!)
* __`Set.code <ProductCode>`__ - the product codes for this set (ISBN, etc.)
* __`Set.coverCards <[Card!]>`__ - the cards that appear on the packaging for this set
* __`Set.format <String>`__ - the format in regards to forbidden and limited lists (not common on sets, but does exist here and there)
* __`Set.image <String>`__ - the main image used in the wiki for this set
* __`Set.konamiID <SetKonamiDatabaseID>`__ - the database ID used by Konami for this set
* __`Set.mediums <[String!]>`__ - the formats in which this set exists (ogc, tcg, games, etc.)
* __`Set.name <LocaleText>`__ - the name of this set
* __`Set.page <WikiPage>`__ - meta details on the wiki page for this set
* __`Set.parent <Set>`__ - the parent set to this set
* __`Set.prefix <Prefix>`__ - the prefixes for this set
* __`Set.promotionalSeries <String>`__ - the promotional series this set belongs to (core boosters, etc.)
* __`Set.regionalPrefix <Prefix>`__ - the region-specific prefixes for this set
* __`Set.releaseDate <SetReleaseDate>`__ - this set's release date
* __`Set.type <String>`__ - the type of set this set is (booster, tin, etc.)