## Design Database 

#### ERD

![ERD](./assets/ERD.png)

-  Waarom heb je deze gegevens nodig?
    -  De gegevens zijn nodig om de database te kunnen ontwerpen en te kunnen implementeren.


- Privacy by design:

    Hoe past jouw ERD bij Privacy by Design?

    - User-tabel:

        - De tabel bevat minimale gegevens (uuid en name). Voeg een veld toe voor wachtwoorden (password) als je gebruikers laat inloggen. Sla dit gehasht op.

    - SaveGame-tabel:
        - De tabel bevat alleen een datum en FK, wat voldoende is voor het opslaan van voortgang zonder onnodige informatie.

    - Item-, Room-, NPC-, Dialog-, en Endings-tabellen:
        
       - Deze tabellen bevatten alleen functionele gegevens die nodig zijn voor gameplay. Er is geen persoonlijke informatie aanwezig, wat goed aansluit bij privacyprincipes.

## Implementatieplan


