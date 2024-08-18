# Card Printouts and GQL Keys

|GQL Key|Printout|Type|Description|
|-|-|-|-|
|`actions.attack`|[Attack](https://yugipedia.com/wiki/Property:Attack)|`string[]`|[Attack](https://yugipedia.com/wiki/Attack) actions, e.g. disallowing [attacks](https://yugipedia.com/wiki/Attack), preventing [destruction](https://yugipedia.com/wiki/Destroy) during [battle](https://yugipedia.com/wiki/Battle), etc.
|`actions.banish`|[Banishing](https://yugipedia.com/wiki/Property:Banishing)|`string[]`|[Banishment](https://yugipedia.com/wiki/Banish) actions, e.g. [banishing](https://yugipedia.com/wiki/Banish) cards from the [graveyard](https://yugipedia.com/wiki/Graveyard), etc.
|`actions.card`|[MonsterSpellTrap](https://yugipedia.com/wiki/Property:MonsterSpellTrap)|`string[]`|Actions that directly affect [monster](https://yugipedia.com/wiki/Monster_Card), [spell](https://yugipedia.com/wiki/Spell_Card), or [trap](https://yugipedia.com/wiki/Trap_Card) cards and/or their properties, e.g. [negating](https://yugipedia.com/wiki/Negate) and [destroying](https://yugipedia.com/wiki/Destroy) a [spell](https://yugipedia.com/wiki/Spell_Card) card, being treated as an [equip card](https://yugipedia.com/wiki/Equip_Card), etc.
|`actions.counter`|[Counters](https://yugipedia.com/wiki/Property:Counters)|`string[]`|[Counter](https://yugipedia.com/wiki/Counter) actions and types, e.g. placing a [counter](https://yugipedia.com/wiki/Counter), specific [counters](https://yugipedia.com/wiki/Counter) such as [_A-Counter_](https://yugipedia.com/wiki/A-Counter), [_Ice Counter_](https://yugipedia.com/wiki/Ice_Counter), etc.
|`actions.lifepoint`|[LP](https://yugipedia.com/wiki/Property:LP)|`string[]`|[Life point](https://yugipedia.com/wiki/LP) affecting actions, e.g. [life point](https://yugipedia.com/wiki/LP) gain/loss, [battle damage](https://yugipedia.com/wiki/Battle_damage) prevention, etc.
|`actions.stat`|[Stats](https://yugipedia.com/wiki/Property:Stats)|`string[]`|Actions that affect a [monster's](https://yugipedia.com/wiki/Monster_Card) stats, e.g. [attack](https://yugipedia.com/wiki/ATK)/[defense](https://yugipedia.com/wiki/DEF) gain/loss, being treated as multiple different [names](https://yugipedia.com/wiki/Card_name), etc.
|`actions.summoning`|[Summoning](https://yugipedia.com/wiki/Property:Summoning)|`string[]`|[Summoning](https://yugipedia.com/wiki/Summon) actions, requirements, etc., e.g. [special summons](https://yugipedia.com/wiki/Special_Summon) from [hand](https://yugipedia.com/wiki/Hand), [graveyard](https://yugipedia.com/wiki/Graveyard), [deck](https://yugipedia.com/wiki/Main_Deck), etc.
|`anti.archetype`|[Archetype anti-support](https://yugipedia.com/wiki/Property:Archetype_anti-support)|`string[]`|[Archetypes](https://yugipedia.com/wiki/Archetype) that are subjectively affected _negatively_ by this card
|`anti.support`|[Anti-support](https://yugipedia.com/wiki/Property:Anti-support)|`string[]`|Cards that are subjectively affected _negatively_ by this card
|`appearsIn`|[Appears in](https://yugipedia.com/wiki/Property:Appears_in)|`string[]`|Series ([manga](https://yugipedia.com/wiki/Manga), [anime](https://yugipedia.com/wiki/Anime)) appearances
|`cardType`|[Card type (short)](https://yugipedia.com/wiki/Property:Card_type_(short))|`string`|A meta type description, e.g. [monster](https://yugipedia.com/wiki/Monster_Card), [spell](https://yugipedia.com/wiki/Spell_Card), [trap](https://yugipedia.com/wiki/Trap_Card), [tip](https://yugipedia.com/wiki/Tip_Card), etc.
|`charactersDepicted`|[Character](https://yugipedia.com/wiki/Property:Character)|`string[]`|The character depicted in the artwork<br/>(⚠️This data doesn't have official documentation and seems to mainly depict character skill cards alongside some straggling video game character cameos. _[Unity](https://yugipedia.com/wiki/Unity)_, for instance, doesn't have any data on this property despite have four characters depicted in its artwork)
|`debutDate.main`|[Debut date](https://yugipedia.com/wiki/Property:Debut_date)|`string`|The first public release date
|`debutDate.ocg`|[OCG debut date](https://yugipedia.com/wiki/Property:OCG_debut_date)|`string`|The official release date in the [Yu-Gi-Oh! Official Card Game](https://yugipedia.com/wiki/Yu-Gi-Oh!_Official_Card_Game)
|`debutDate.tcg`|[TCG debut date](https://yugipedia.com/wiki/Property:TCG_debut_date)|`string`|The official release date in the [Yu-Gi-Oh! Trading Card Game](https://yugipedia.com/wiki/Yu-Gi-Oh!_Trading_Card_Game)
|`debutDate.tcgSpeedDuel`|[TCG Speed Duel debut date](https://yugipedia.com/wiki/Property:TCG_Speed_Duel_debut_date)|`string`|The official release date for [Speed Duels](https://yugipedia.com/wiki/Speed_Duel) in the [Yu-Gi-Oh! Trading Card Game](https://yugipedia.com/wiki/Yu-Gi-Oh!_Trading_Card_Game)
|`deckType`|[Belongs to](https://yugipedia.com/wiki/Property:Belongs_to)|`string`|A meta deck description, e.g. [main deck](https://yugipedia.com/wiki/Main_Deck) or [extra deck](https://yugipedia.com/wiki/Extra_Deck)
|`description.chinese.simplified.hanzi`|[Simplified Chinese lore](https://yugipedia.com/wiki/Property:Simplified_Chinese_lore)|`string`|The simplified Chinese description/lore
|`description.chinese.traditional.hanzi`|[Traditional Chinese lore](https://yugipedia.com/wiki/Property:Traditional_Chinese_lore)|`string`|The traditional Chinese description/lore
|`description.english`|[Lore](https://yugipedia.com/wiki/Property:Lore)|`string`|The English description/lore
|`description.french`|[French lore](https://yugipedia.com/wiki/Property:French_lore)|`string`|The French description/lore
|`description.german`|[German lore](https://yugipedia.com/wiki/Property:German_lore)|`string`|The German description/lore
|`description.italian`|[Italian lore](https://yugipedia.com/wiki/Property:Italian_lore)|`string`|The Italian description/lore
|`description.japanese.html` <sup>[[note](#name-and-descriptionlore-for-japanese-and-korean)]</sup><br/>`description.japanese.base` <sup>[[note](#name-and-descriptionlore-for-japanese-and-korean)]</sup><br/>`description.japanese.annotation` <sup>[[note](#name-and-descriptionlore-for-japanese-and-korean)]</sup><br/>`description.japanese.transposed` <sup>[[note](#name-and-descriptionlore-for-japanese-and-korean)]</sup><br/>`description.japanese.adjacent` <sup>[[note](#name-and-descriptionlore-for-japanese-and-korean)]</sup>|[Japanese lore](https://yugipedia.com/wiki/Property:Japanese_lore)|`string`|The Japanese description/lore
|`description.japanese.translated`|[Translated Japanese lore](https://yugipedia.com/wiki/Property:Translated_Japanese_lore)|`string`|The translated Japanese description/lore
|`description.korean.html` <sup>[[note](#name-and-descriptionlore-for-japanese-and-korean)]</sup><br/>`description.korean.base` <sup>[[note](#name-and-descriptionlore-for-japanese-and-korean)]</sup><br/>`description.korean.annotation` <sup>[[note](#name-and-descriptionlore-for-japanese-and-korean)]</sup><br/>`description.korean.transposed` <sup>[[note](#name-and-descriptionlore-for-japanese-and-korean)]</sup><br/>`description.korean.adjacent` <sup>[[note](#name-and-descriptionlore-for-japanese-and-korean)]</sup>|[Korean lore](https://yugipedia.com/wiki/Property:Korean_lore)|`string`|The Korean description/lore
|`description.portuguese`|[Portuguese lore](https://yugipedia.com/wiki/Property:Portuguese_lore)|`string`|The Portuguese description/lore
|`description.spanish`|[Spanish lore](https://yugipedia.com/wiki/Property:Spanish_lore)|`string`|The Spanish description/lore
|`effectTypes`|[Effect type](https://yugipedia.com/wiki/Property:Effect_type)|`string`|Effect types, e.g. trigger, continuous, etc.
|`image.artwork`|[Card artwork](https://yugipedia.com/wiki/Property:Card_artwork)|`string`|___Placeholder - this value will be updated at a future date___
|`image.back`|[Card backing image](https://yugipedia.com/wiki/Property:Card_backing_image)|`string`|___Placeholder - this value will be updated at a future date___
|`image.front`|[Card image](https://yugipedia.com/wiki/Property:Card_image)|`string`|___Placeholder - this value will be updated at a future date___
|`image.name`|[Card image name](https://yugipedia.com/wiki/Property:Card_image_name)|`string`|___Placeholder - this value will be updated at a future date___
|`isReal`|[Non-physical card](https://yugipedia.com/wiki/Property:Non-physical_card)|`boolean`|Whether there's been a physical release, rather than only appearing in [manga](https://yugipedia.com/wiki/Manga)/[anime](https://yugipedia.com/wiki/Anime)
|`konamiID`|[Database ID](https://yugipedia.com/wiki/Property:Database_ID)|`string`|The [index ID](https://yugipedia.com/wiki/Lists_of_cards_by_Konami_index_number) Konami uses in [their database](https://www.db.yugioh-card.com/) to track cards
|`limitation`|[Limitation text](https://yugipedia.com/wiki/Property:Limitation_text)|`string`|The [limitation text](https://yugipedia.com/wiki/Limitation_text) assigned instead of a [password](https://yugipedia.com/wiki/Password), or denoted through other documentation, e.g. "This card cannot be used in a Duel.", etc.
|`materials.required`|[Fusion Material](https://yugipedia.com/wiki/Property:Fusion_Material)<br/>[Synchro Material](https://yugipedia.com/wiki/Property:Synchro_Material)<br/>[Ritual Spell Card required](https://yugipedia.com/wiki/Property:Ritual_Spell_Card_required)|`string[]`|The cards required to perform a successful [summoning](https://yugipedia.com/wiki/Summon)
|`materials.usedFor`|[Fusion Material for](https://yugipedia.com/wiki/Property:Fusion_Material_for)<br/>[Synchro Material for](https://yugipedia.com/wiki/Property:Synchro_Material_for)<br/>[Ritual Monster required](https://yugipedia.com/wiki/Property:Ritual_Monster_required)|`string[]`|The cards that rely on this card to perform a successful [summoning](https://yugipedia.com/wiki/Summon)
|`mediums`|[Medium](https://yugipedia.com/wiki/Property:Medium)|`string[]`|Media medium appearances, e.g. TCG, [anime](https://yugipedia.com/wiki/Anime), [manga](https://yugipedia.com/wiki/Manga), etc.
|`mentions`|[Mentions](https://yugipedia.com/wiki/Property:Mentions)|`string[]`|Cards that are mentioned in the text of this card<br/>📝 Archetypes are not considered mentions and are listed under the `pro.archetype` and `anti.archetype` keys
|`miscTags`|[Misc](https://yugipedia.com/wiki/Property:Misc)|`string[]`|Miscellaneous properties that don't have a more specific category
|`name.arabic`|[Arabic name](https://yugipedia.com/wiki/Property:Arabic_name)|`string`|The Arabic [name](https://yugipedia.com/wiki/Card_name)
|`name.chinese.primary.hanzi`|[Chinese name](https://yugipedia.com/wiki/Property:Chinese_name)|`string`|The standardized Chinese [name](https://yugipedia.com/wiki/Card_name)
|`name.chinese.primary.jyutping`|[Chinese Jyutping name](https://yugipedia.com/wiki/Property:Chinese_Jyutping_name)|`string`|The standardized Chinese [name](https://yugipedia.com/wiki/Card_name) written in [Jyutping](https://en.wikipedia.org/wiki/Jyutping) (Cantonese romanization)
|`name.chinese.primary.pinyin`|[Chinese Pinyin name](https://yugipedia.com/wiki/Property:Chinese_Pinyin_name)|`string`|The standardized Chinese [name](https://yugipedia.com/wiki/Card_name) written in [Pinyin](https://en.wikipedia.org/wiki/Pinyin) (Latin romanization)
|`name.chinese.primary.translated`|[Translated Chinese name](https://yugipedia.com/wiki/Property:Translated_Chinese_name)|`string`|The standardized Chinese [name](https://yugipedia.com/wiki/Card_name) translated into English
|`name.chinese.simplified.hanzi`|[Simplified Chinese name](https://yugipedia.com/wiki/Property:Simplified_Chinese_name)|`string`|The simplified Chinese [name](https://yugipedia.com/wiki/Card_name)
|`name.chinese.simplified.pinyin`|[Simplified Chinese pinyin name](https://yugipedia.com/wiki/Property:Simplified_Chinese_pinyin_name)|`string`|The simplified Chinese [name](https://yugipedia.com/wiki/Card_name) written in [Pinyin](https://en.wikipedia.org/wiki/Pinyin) (Latin romanization)
|`name.chinese.simplified.translated`|[Translated Simplified Chinese name](https://yugipedia.com/wiki/Property:Translated_Simplified_Chinese_name)|`string`|The simplified Chinese [name](https://yugipedia.com/wiki/Card_name) translated into English
|`name.chinese.traditional.hanzi`|[Traditional Chinese name](https://yugipedia.com/wiki/Property:Traditional_Chinese_name)|`string`|The traditional Chinese [name](https://yugipedia.com/wiki/Card_name)
|`name.chinese.traditional.pinyin`|[Traditional Chinese pinyin name](https://yugipedia.com/wiki/Property:Traditional_Chinese_pinyin_name)|`string`|The traditional Chinese [name](https://yugipedia.com/wiki/Card_name) written in [Pinyin](https://en.wikipedia.org/wiki/Pinyin) (Latin romanization)
|`name.croatian`|[Croatian name](https://yugipedia.com/wiki/Property:Croatian_name)|`string`|The Croatian [name](https://yugipedia.com/wiki/Card_name)
|`name.english`|[English name](https://yugipedia.com/wiki/Property:English_name)|`string`|The English [name](https://yugipedia.com/wiki/Card_name)
|`name.french`|[French name](https://yugipedia.com/wiki/Property:French_name)|`string`|The French [name](https://yugipedia.com/wiki/Card_name)
|`name.german`|[German name](https://yugipedia.com/wiki/Property:German_name)|`string`|The German [name](https://yugipedia.com/wiki/Card_name)
|`name.greek`|[Greek name](https://yugipedia.com/wiki/Property:Greek_name)|`string`|The Greek [name](https://yugipedia.com/wiki/Card_name)
|`name.italian`|[Italian name](https://yugipedia.com/wiki/Property:Italian_name)|`string`|The Italian [name](https://yugipedia.com/wiki/Card_name)
|`name.japanese.html` <sup>[[note](#name-and-descriptionlore-for-japanese-and-korean)]</sup><br/>`name.japanese.base` <sup>[[note](#name-and-descriptionlore-for-japanese-and-korean)]</sup><br/>`name.japanese.annotation` <sup>[[note](#name-and-descriptionlore-for-japanese-and-korean)]</sup><br/>`name.japanese.transposed` <sup>[[note](#name-and-descriptionlore-for-japanese-and-korean)]</sup><br/>`name.japanese.adjacent` <sup>[[note](#name-and-descriptionlore-for-japanese-and-korean)]</sup>|[Japanese name](https://yugipedia.com/wiki/Property:Japanese_name)|`string`|The Japanese [name](https://yugipedia.com/wiki/Card_name)
|`name.japanese.romaji.annotation`|[Romaji name](https://yugipedia.com/wiki/Property:Romaji_name)|`string`|The Japanese [name](https://yugipedia.com/wiki/Card_name) text written above the primary base text ([ruby text](https://en.wikipedia.org/wiki/Ruby_character)), using [Romaji](https://en.wikipedia.org/wiki/Romanization_of_Japanese) (Latin romanization)
|`name.japanese.romaji.base`|[Base romaji name](https://yugipedia.com/wiki/Property:Base_romaji_name)|`string`|The primary Japanese base [name](https://yugipedia.com/wiki/Card_name) text, using [Romaji](https://en.wikipedia.org/wiki/Romanization_of_Japanese) (Latin romanization)
|`name.japanese.translated.annotation`|[Translated Japanese name](https://yugipedia.com/wiki/Property:Translated_Japanese_name)|`string`|The Japanese [name](https://yugipedia.com/wiki/Card_name) text written above the primary base text ([ruby text](https://en.wikipedia.org/wiki/Ruby_character)), translated into English
|`name.japanese.translated.base`|[Translated Japanese base name](https://yugipedia.com/wiki/Property:Translated_Japanese_base_name)|`string`|The primary Japanese base [name](https://yugipedia.com/wiki/Card_name) text, translated into English
|`name.korean.html` <sup>[[note](#name-and-descriptionlore-for-japanese-and-korean)]</sup><br/>`name.korean.base` <sup>[[note](#name-and-descriptionlore-for-japanese-and-korean)]</sup><br/>`name.korean.annotation` <sup>[[note](#name-and-descriptionlore-for-japanese-and-korean)]</sup><br/>`name.korean.transposed` <sup>[[note](#name-and-descriptionlore-for-japanese-and-korean)]</sup><br/>`name.korean.adjacent` <sup>[[note](#name-and-descriptionlore-for-japanese-and-korean)]</sup>|[Korean name](https://yugipedia.com/wiki/Property:Korean_name)|`string`|The Korean [name](https://yugipedia.com/wiki/Card_name)
|`name.korean.romanized`|[Korean Revised Romanization name](https://yugipedia.com/wiki/Property:Korean_Revised_Romanization_name)|`string`|The Korean [name](https://yugipedia.com/wiki/Card_name), using [Romaja](https://en.wikipedia.org/wiki/Romanization_of_Korean) (Latin romanization)
|`name.portuguese`|[Portuguese name](https://yugipedia.com/wiki/Property:Portuguese_name)|`string`|The Portuguese [name](https://yugipedia.com/wiki/Card_name)
|`name.spanish`|[Spanish name](https://yugipedia.com/wiki/Property:Spanish_name)|`string`|The Spanish [name](https://yugipedia.com/wiki/Card_name)
|`password`|[Password](https://yugipedia.com/wiki/Property:Password)|`string`|The [password](https://yugipedia.com/wiki/Password) of the card, typically found on the bottom-left corner
|`pendulum.effect.chinese.simplified`|[Simplified Chinese Pendulum Effect](https://yugipedia.com/wiki/Property:Simplified_Chinese_Pendulum_Effect)|`string`|The simplified Chinese [pendulum effect](https://yugipedia.com/wiki/Pendulum_Effect)
|`pendulum.effect.chinese.traditional`|[Traditional Chinese Pendulum Effect](https://yugipedia.com/wiki/Property:Traditional_Chinese_Pendulum_Effect)|`string`|The traditional Chinese [pendulum effect](https://yugipedia.com/wiki/Pendulum_Effect)
|`pendulum.effect.english`|[Pendulum Effect](https://yugipedia.com/wiki/Property:Pendulum_Effect)|`string`|The English [pendulum effect](https://yugipedia.com/wiki/Pendulum_Effect)
|`pendulum.effect.french`|[French Pendulum Effect](https://yugipedia.com/wiki/Property:French_Pendulum_Effect)|`string`|The French [pendulum effect](https://yugipedia.com/wiki/Pendulum_Effect)
|`pendulum.effect.german`|[German Pendulum Effect](https://yugipedia.com/wiki/Property:German_Pendulum_Effect)|`string`|The German [pendulum effect](https://yugipedia.com/wiki/Pendulum_Effect)
|`pendulum.effect.italian`|[Italian Pendulum Effect](https://yugipedia.com/wiki/Property:Italian_Pendulum_Effect)|`string`|The Italian [pendulum effect](https://yugipedia.com/wiki/Pendulum_Effect)
|`pendulum.effect.japanese`|[Japanese Pendulum Effect](https://yugipedia.com/wiki/Property:Japanese_Pendulum_Effect)|`string`|The Japanese [pendulum effect](https://yugipedia.com/wiki/Pendulum_Effect)
|`pendulum.effect.japanese.translated`|[Translated Japanese Pendulum Effect](https://yugipedia.com/wiki/Property:Translated_Japanese_Pendulum_Effect)|`string`|The Japanese [pendulum effect](https://yugipedia.com/wiki/Pendulum_Effect), translated into English
|`pendulum.effect.korean`|[Korean Pendulum Effect](https://yugipedia.com/wiki/Property:Korean_Pendulum_Effect)|`string`|The Korean [pendulum effect](https://yugipedia.com/wiki/Pendulum_Effect)
|`pendulum.effect.portuguese`|[Portuguese Pendulum Effect](https://yugipedia.com/wiki/Property:Portuguese_Pendulum_Effect)|`string`|The Portuguese [pendulum effect](https://yugipedia.com/wiki/Pendulum_Effect)
|`pendulum.effect.spanish`|[Spanish Pendulum Effect](https://yugipedia.com/wiki/Property:Spanish_Pendulum_Effect)|`string`|The Spanish [pendulum effect](https://yugipedia.com/wiki/Pendulum_Effect)
|`pendulum.scale`|[Pendulum Scale string](https://yugipedia.com/wiki/Property:Pendulum_Scale_string)|`string`|The card's [pendulum scale](https://yugipedia.com/wiki/Pendulum_Scale)
|`pro.archetype`|[Archetype support](https://yugipedia.com/wiki/Property:Archetype_support)|`string[]`|[Archetypes](https://yugipedia.com/wiki/Archetype) that are subjectively affected _positively_ by this card
|`pro.support`|[Support](https://yugipedia.com/wiki/Property:Support)|`string[]`|Cards that are subjectively affected _positively_ by this card
|`related.direct`|[Archseries](https://yugipedia.com/wiki/Property:Archseries)|`string[]`|Cards that are directly related to this card, sharing some sort of meta-theme, e.g. [A.I.](https://yugipedia.com/wiki/A.I.), [@Ignister](https://yugipedia.com/wiki/@Ignister), etc.
|`related.indirect`|[Archseries related](https://yugipedia.com/wiki/Property:Archseries_related)|`string[]`|Cards that are indirectly related to this card, sharing some occupation within the same universe or universal theme, e.g. [Hero Kid](https://yugipedia.com/wiki/Hero_Kid) -> [Elemental HERO universe](https://yugipedia.com/wiki/Elemental_HERO), etc.
|`releases`|[Release](https://yugipedia.com/wiki/Property:Release)|`string[]`|The specific titled media in which there was an official release of this card, e.g. [Dark Magician](https://yugipedia.com/wiki/Dark_Magician) -> [Yu-Gi-Oh! Trading Card Game](https://yugipedia.com/wiki/Yu-Gi-Oh!_Trading_Card_Game), etc.<br/>📝 It's very common for cards that have specific media releases to have their own page, especially due to discrepancies in name, description/lore, etc., and as the card often has a specific tie-in to the lore and meta-gameplay of that media release. For example, [Dark Magician Girl](https://yugipedia.com/wiki/Dark_Magician_Girl) is listed as having a release in only the [TCG](https://yugipedia.com/wiki/Yu-Gi-Oh!_Trading_Card_Game) and [OCG](https://yugipedia.com/wiki/Yu-Gi-Oh!_Official_Card_Game), but another page, [Dark Magician Girl (DOR)](https://yugipedia.com/wiki/Dark_Magician_Girl_(DOR)), directly associating that card with [Yu-Gi-Oh! The Duelists of the Roses](https://yugipedia.com/wiki/Yu-Gi-Oh!_The_Duelists_of_the_Roses), will specifically call out that version of the card and its in-media meta-attributes.
|`stats.attack`|[ATK string](https://yugipedia.com/wiki/Property:ATK_string)|`string`|The [attack power](https://yugipedia.com/wiki/ATK)
|`stats.attribute`|[Attribute](https://yugipedia.com/wiki/Property:Attribute)|`string`|The [attribute](https://yugipedia.com/wiki/Attribute), e.g. [DARK](https://yugipedia.com/wiki/DARK), [LIGHT](https://yugipedia.com/wiki/LIGHT), etc.
|`stats.defense`|[DEF string](https://yugipedia.com/wiki/Property:DEF_string)|`string`|The [defense power](https://yugipedia.com/wiki/DEF)
|`stats.level`|[Level string](https://yugipedia.com/wiki/Property:Level_string)|`string`|The level, be it stars or rank
|`stats.link.arrows`|[Link Arrows](https://yugipedia.com/wiki/Property:Link_Arrows)|`string[]`|The [link arrow](https://yugipedia.com/wiki/Link_Arrow) directions, e.g. Top-Left, Top-Right, etc.
|`stats.link.rating`|[Link Rating](https://yugipedia.com/wiki/Property:Link_Rating)|`string`|The number of [link arrows](https://yugipedia.com/wiki/Link_Arrow)
|`stats.rank`|[Rank string](https://yugipedia.com/wiki/Property:Rank_string)|`string`|The [rank level](https://yugipedia.com/wiki/Rank)
|`stats.stars`|[Stars string](https://yugipedia.com/wiki/Property:Stars_string)|`string`|The [star level](https://yugipedia.com/wiki/Level)
|`status.ocg`|[OCG status](https://yugipedia.com/wiki/Property:OCG_status)|`string`|The [status](https://yugipedia.com/wiki/Status) of the card in the [OCG](https://yugipedia.com/wiki/Yu-Gi-Oh!_Official_Card_Game)
|`status.rushDuel`|[Rush Duel status](https://yugipedia.com/wiki/Property:Rush_Duel_status)|`string`|The [status](https://yugipedia.com/wiki/Status) of the card in [Rush Duel](https://yugipedia.com/wiki/Yu-Gi-Oh!_Rush_Duel)
|`status.tcg`|[TCG status](https://yugipedia.com/wiki/Property:TCG_status)|`string`|The [status](https://yugipedia.com/wiki/Status) of the card in the [TCG](https://yugipedia.com/wiki/Yu-Gi-Oh!_Trading_Card_Game)
|`status.tcgSpeedDuel`|[TCG Speed Duel status](https://yugipedia.com/wiki/Property:TCG_Speed_Duel_status)|`string`|The [status](https://yugipedia.com/wiki/Status) of the card in the [TCG Speed Duel](https://yugipedia.com/wiki/Speed_Duel)
|`status.tcgTraditionalFormat`|[TCG Traditional Format status](https://yugipedia.com/wiki/Property:TCG_Traditional_Format_status)|`string`|The [status](https://yugipedia.com/wiki/Status) of the card in the [Traditional TCG Format](https://yugipedia.com/wiki/Traditional_Format)
|`summonedBy`|[Summoned by](https://yugipedia.com/wiki/Property:Summoned_by)|`string[]`|Cards that specifically summon this card<br/>📝 This property is not officially documented, but appears to be specific to [Tokens](https://yugipedia.com/wiki/Monster_Token)
|`types`|[Types](https://yugipedia.com/wiki/Property:Types)<br/>[Property (short)](https://yugipedia.com/wiki/Property:Property_(short))|`string[]`|The types found in the [Monster Card](https://yugipedia.com/wiki/Monster_Card) description/lore, or the type of non-[Monster Cards](https://yugipedia.com/wiki/Monster_Card), e.g. Spells, Traps, etc.
|`usedBy`|[In Deck](https://yugipedia.com/wiki/Property:In_Deck)|`string[]`|The character who uses this card

# Special Properties

## Name and Description/Lore for Japanese and Korean

The name and description/lore properties for these two langauges are organized in such a way that it should be relatively easy to represent the language's formatting originally found on the card. Let's look at the Japanese name for [Blue-Eyes White Dragon](https://yugipedia.com/wiki/Blue-Eyes_White_Dragon), for example:

```shell
{
  data: {
    query: {
      card: {
        name: {
          japanese: {
            html: '<ruby lang="ja"><rb>青眼の白龍</rb><rp>（</rp><rt>ブルーアイズ・ホワイト・ドラゴン</rt><rp>）</rp></ruby>',
            base: '青眼の白龍',
            annotation: 'ブルーアイズ・ホワイト・ドラゴン',
            transposed: 'ブルーアイズ・ホワイト・ドラゴン',
            adjacent: '青眼の白龍(ブルーアイズ・ホワイト・ドラゴン)'
          }
        }
      }
    }
  },
  errors: null,
  warnings: null
}
```

The html value above is fancy computer-speak for displaying the following:

<ruby lang="ja"><rb>青眼の白龍</rb><rp>（</rp><rt>ブルーアイズ・ホワイト・ドラゴン</rt><rp>）</rp></ruby>

Notice this [_"ruby"_](https://en.wikipedia.org/wiki/Ruby_character#HTML_markup) language feature of HTML placed the [ruby text](https://en.wikipedia.org/wiki/Ruby_character) above the [kanji](https://en.wikipedia.org/wiki/Kanji) and [hiragana](https://en.wikipedia.org/wiki/Hiragana). Often, Japanese and Korean cards will take this form for one of two reasons: 1. Making the pronunciation of the complex characters simpler, or 2. Showing the pronunciation of the card using its alternate name, often times a westernized version of the original name.

For your convenience, the properties of this ruby text are deconstructed into:

|Key|Description|
|-|-|
`base`|The lower characters
`annotation`|The higher characters
`transposed`|The complex lower characters swapped with the pronunication guide from the higher characters
`adjacent`|The higher and lower characters decoupled from each other and placed side-by-side

> 📝 The `transposed` swap doesn't always make sense. In Blue-Eyes White Dragon's case, the furigana isn't a pronunciation guide, but rather its alternate westernized name. In such cases, this key is often just the `annotation` text.