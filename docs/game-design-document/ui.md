---
title: UI
---
# UI
**TODO:** Beschrijf hier welke toon het spel moet zetten qua visuele style, of er eventueel geluidseffecten nodig zijn of dat er specifieke UI elementen ontwikkeld moeten worden. Toon deze onderdelen duidelijk in éém of meerdere wireframes, bijvoorbeeld in [Figma](https://www.figma.com/).

Hier is een schets van hoe de game er uit kan zien:
![ui](/docs/game-design-document/game-objects/img/Uiexample.png)

## gameplay screen
Op het scherm worden afbeeldingen in pixelstijl weergegeven.
Hier kan de speler een afbeelding van de wereld zien, items bekijken, menu's gebruiken en het personage zien.
Ook worden er iconen weergegeven, zoals het inventory-icoon, het map-icoon en de navigatiepijlen.

## navigeren 
Op het scherm, waar de speler een afbeelding van de wereld kan zien, staan rode pijlen. Als de speler hier overheen hovert, verschijnt de naam van de locatie waar de pijl naartoe wijst. Als de speler op een rode pijl klikt, wordt hij naar een andere kamer gebracht.
Ook is er linksboven een icoon met een afbeelding van een kaart. Wanneer de speler hierop klikt, opent de map van de game met alle kamers. Als de speler al in een kamer is geweest, kan hij via de kaart direct naar deze kamer navigeren.

## actions
In het midden van het scherm, onder de afbeelding van de wereld, staan de acties. Dit zijn vier knoppen die de speler kan indrukken om bepaalde acties uit te voeren: Examine, Use, Combine en Talk to.

Examine: 
De speler kan een object selecteren om een uitgebreide beschrijving te krijgen.

Use:
De speler kan met een object interacteren om iets in het spel te laten gebeuren.

Combine: 
De speler kan twee elementen combineren om te kijken of dit een effect heeft (bijvoorbeeld een sleutel met een deur).

Talk to: 
De speler kan met een NPC praten.

Als een speler op een van de knoppen drukt, opent een menu waarin gerelateerde items worden weergegeven. Bijvoorbeeld, bij de Talk to-actie ziet de speler alle beschikbare NPC’s.

Hier is een voorbeeld van hoe de user kan interacteren met items
![uiUse](/docs/game-design-document/game-objects/img/inventoryuiExample.png)

## Text Box
Onderaan het scherm bevindt zich de tekstbox. Hier wordt de wereld in tekst beschreven.
Objecten waarmee de speler kan interacteren worden groen weergegeven, locaties rood en NPC’s blauw.
