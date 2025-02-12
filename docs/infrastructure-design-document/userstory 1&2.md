# Infrastructure Design Document
**Opleiding:** Software Engineering
**Blok:** 3
**Opdracht:** The Game

**Klas:** D103
**Teamnummer**: 4

**Teamleden:**
Mustafa Jeylani


## Userstory 1

## 1. Stakeholders & Gebruikers<br>
### Wie zijn de gebruikers van de infrastructuur?<br>
De belangrijkste gebruikers van de infrastructuur zijn:

- Spelers: Zij spelen de game, verkennen de kamers, maken keuzes,  verzamelen items en proberen te ontsnappen.
- Ontwikkelteam: Zij ontwikkelen de game, implementeren nieuwe functionaliteiten (zoals de leaderboard, timer, inventory, etc.), testen de game en beheren de code.
- Docenten/Begeleiders: Zij beoordelen de voortgang van het project, geven feedback op zowel de technische aspecten als de gameplay.

### Welke acties voeren zij uit? Hoe vaak?<br>

| **Gebruiker**        | **Acties**                                      | **Frequentie** |
|----------------------|---------------------------------------------|--------------|
| **Spelers**         | Spelen, voortgang opslaan, scores bekijken | Dagelijks  |
| **Ontwikkelteam**   | Code ontwikkelen, API’s testen, database beheren | Daglijks/Wekelijks   |
| **Docenten**        | Game testen, code/documentatie beoordelen | Wekelijks/maandelijks |

## 2. Bedrijfsdoelen & Infrastructuur<br>

### Welke bedrijfsdoelen ondersteunt de infrastructuur?<br>

- Bevorderen van spelerservaring: De infrastructuur ondersteunt een soepele game-ervaring door te zorgen dat de game stabiel draait, het leaderboard up-to-date blijft en het savesysteem werkt.
- Efficiëntie in ontwikkeling: De infrastructuur biedt een flexibele basis voor het ontwikkelteam om snel nieuwe features en updates door te voeren (zoals het dialoogssysteem of de map).
- Data-analyse voor verbetering: Door analytics te verzamelen, kunnen de prestaties van de game worden geoptimaliseerd, bijvoorbeeld door te kijken naar welke kamers vaak moeilijk zijn voor spelers of hoe snel ze ontsnappen.
- Beveiliging en privacy: Er moet gezorgd worden voor een veilige opslag van gegevens van spelers, zoals voortgangsgegevens en eventuele scoretellingen.
- Ondersteuning voor educatieve doeleinden: De infrastructuur biedt docenten de mogelijkheid om te evalueren, feedback te geven, en ervoor te zorgen dat het project voldoet aan de eisen van het programma.

### Welke interacties vinden plaats tussen gebruikers en de infrastructuur?<br>
- Spelers communiceren met de backend via API’s om hun voortgang op te slaan, inventory-items toe te voegen of hun speeltijd te registreren.
- Het ontwikkelteam implementeert nieuwe features (zoals de leaderboard, timer en dialoog), voert systeemtests uit en zorgt ervoor dat de game goed draait voor alle spelers.
- Docenten/Begeleiders kunnen het leaderboard bekijken, met spelersprestaties en tijden, en feedback geven over technische of spelinhoudelijke aspecten van de game.

## 3. Beveiliging & Gegevensbeheer<br>

### Hoe worden gegevens verwerkt, opgeslagen en beveiligd binnen de infrastructuur?<br>

#### Verwerking
- Spelersvoortgang, scores, en items worden in de backend verwerkt via API-aanroepen en opgeslagen in de database.
ijd en prestaties, zoals de tijden die spelers neerzetten in de leaderboard, worden geanalyseerd om het spel te verbeteren en de uitdagingen beter af te stemmen.

#### Opslag
- Alle gegevens zoals spelersvoortgang, inventory-items, en scores worden opgeslagen in een relationele database (bijv. MySQL) met duidelijke tabellen voor de voortgang, gebruikersinformatie (zonder persoonlijke data), en event-logboeken.
  - Voorbeeld: Tabel voor spelers en hun voortgang.
  - Voorbeeld: Tabel voor scores en inventory-items.
  
- Spelersvoortgang en savesystemen kunnen worden opgeslagen op een server of lokaal voor het opslaan van de voortgang tijdens een speelsessie.
  - Optie: Opslag op server voor cloud-backups.

#### Beveiliging
- Gegevens worden versleuteld (bijv. via HTTPS en encryptie van gevoelige gegevens).
  - Encryptie: Beveiliging van opgeslagen gegevens.
  - HTTPS: Beveiligde communicatie tussen frontend en backend.

- Er wordt geen persoonlijke informatie opgeslagen, alleen voortgangsgegevens van de game.
  - Alleen geanonimiseerde gegevens zoals scores en items.
  - Geen opslag van persoonlijke gegevens zoals namen of e-mailadressen.

- Authenticatie en autorisatie van API-verzoeken kunnen worden geregeld via simpele token-gebaseerde systemen (zoals JWT) indien noodzakelijk voor data-integriteit (voor bijvoorbeeld leaderboard-functionaliteit).
  - JWT-token: Beveiligde sessie bij toegang tot de API.
  - Autorisatie: Beperk toegang tot bepaalde API-endpoints.

- Beveiliging van de server (bijv. via firewalls) om ongeoorloofde toegang tot de infrastructuur te voorkomen.
  - Firewall-configuratie: Beveiliging tegen ongeautoriseerde toegang.
  - Serverbeveiliging: Monitoring en bescherming tegen aanvallen.


### Welke eisen of verwachtingen stellen stakeholders aan de infrastructuur?<br>

- Stabiliteit: De game moet altijd toegankelijk zijn zonder technische problemen. Spelers mogen geen onderbrekingen ervaren tijdens het spelen van de game.
- Prestaties: De game moet snel reageren op interacties, zoals het bijwerken van de map of het tonen van de inventory.
Schaalbaarheid: De infrastructuur moet de mogelijkheid hebben om meer spelers aan te kunnen, vooral als de game populair wordt.
- Beveiliging: De gegevens van de speler (voortgang, scores) moeten veilig worden bewaard zonder risico op verlies of misbruik.
- Gebruiksvriendelijkheid: De infrastructuur moet eenvoudig te gebruiken zijn voor zowel spelers (bijvoorbeeld een intuïtieve interface) als voor ontwikkelaars (gemakkelijk onderhoud en updates doorvoeren).
- Documentatie: Alles moet goed gedocumenteerd zijn voor het ontwikkelteam en voor docenten/begeleiders die de voortgang van het project evalueren.


## Userstory 2<br>

## 1. Kerncomponenten van de infrastructuur<br>

### Centrale Data-Opslag

#### Databasekeuze
We gebruiken MySQL voor de centrale data-opslag. Dit is een relationele database die goed past bij het opslaan van gestructureerde gegevens zoals spelersvoortgang, scores en iteminventaris.

#### Belangrijke tabellen:
- players (id, naam, voortgang, score, etc.)
- rooms (room_id, room_name, description, toegankelijk)
- items (item_id, item_name, beschrijving, status)
- game_sessions (session_id, player_id, start_time, end_time, score)

### API-Communicatie

#### Gebruikte Technologieën
De communicatie tussen de frontend en de backend wordt verzorgd door Express.js, een webapplicatieframework voor Node.js, die draait op de HBO-ICT Cloud infrastructuur. De backend maakt verbinding met een SQL-database voor het opslaan en ophalen van gegevens.

#### Endpoints:
- GET /progress: Haalt de voortgang van de speler op uit de SQL-database.
- POST /save: Slaat de voortgang van de speler op in de SQL-database.
- GET /leaderboard: Haalt de top scores op uit de SQL-database voor het leaderboard.

#### Dataoverdracht
We gebruiken JSON voor het versturen van gegevens tussen frontend en backend.

#### HTTP-methoden:
- Voor leesbewerkingen gebruiken we GET.
- Voor schrijf- en updatebewerkingen gebruiken we POST en PUT.

### Frontend-Componenten

#### Technologieën
De frontend maakt gebruik van Web Components, die herbruikbare en modulaire elementen van de gebruikersinterface vertegenwoordigen.

#### Belangrijke componenten:
- game-map: toont de kamers van het ziekenhuis en de voortgang van de speler.
- inventory: toont de items die de speler heeft verzameld.
- dialog-box: toont de dialoog tussen personages en de speler.
- leaderboard: toont de scores van spelers in realtime.


## 2. Authenticatie en Beveiliging<br>

### Authenticatie Mechanismen<br>
- Omdat we geen inlogmechanisme hebben, wordt er geen gebruik gemaakt van traditionele authenticatie zoals JWT of OAuth voor toegang.
- Spelers kunnen hun voortgang opslaan door middel van een anonieme sessie-ID die wordt gegenereerd wanneer ze de game starten.
- Leaderboards kunnen door alle spelers worden ingezien, maar scores worden alleen opgeslagen wanneer de sessie is beëindigd. Er is dus geen permanente speleridentiteit, maar wel een tijdelijke sessie.

### Beveiliging<br>

#### Encryptie:
- Alle communicatie tussen frontend en backend wordt versleuteld met HTTPS om de gegevens te beschermen tegen afluisteren en manipulatie.
- Gevoelige gegevens zoals voortgang en scores worden niet opgeslagen zonder encryptie in de database.

#### Toegangsbeheer:
- Er is geen uitgebreid toegangsbeheer nodig omdat de game geen persoonlijke gebruikersaccounts heeft. De toegang tot gamegegevens is echter strikt beperkt tot de serverapplicatie.

#### Beveiligingsmaatregelen:
- Beveiliging van de backend gebeurt met firewalls en inputvalidatie om SQL-injectie en andere aanvallen te voorkomen.
We zorgen ervoor dat de server goed wordt onderhouden en beveiligingspatches regelmatig worden toegepast.





















|Versie|Datum|Wijzigingen|
|1|12-12-2024|nog niks|
|v0.0|03-02-2024|Aangeleverde template|
