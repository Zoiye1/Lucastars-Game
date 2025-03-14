## Deployen op de HBO-ICT.Cloud

**Stap 7: Omschrijf hoe je het project uitrolt op de HBO-ICT.Cloud en welke methode je gebruikt:**

In het project wordt gebruik gemaakt van handmatige deployment. Hierbij wordt er gebruik gemaakt van FTP (File Transfer Protocol). Dit is eenvoudiger dan een CI/CD systeem omdat er geen geautomatiseerde pipelines hoeven te worden opgezet.

De uitrol gebeurt als volgt:

*   Frontend:
    1. Gebruik `npm run build` in de frontend-map.
    2. Maak verbinding met de HBO-ICT.Cloud via een FTP programma. 
    3. Upload de bestanden naar de aangewezen map op de cloud.
*   Backend:
    1. Zorg ervoor dat alle dependencies in het project zijn geïnstalleerd: `npm install`
    2. Upload de backend-code naar de cloud via de FTP netwerk protocol.
    3. In het .env bestand moeten de juiste environment variables (database-wachtwoorden, API-keys, etc..) staan om te connecten met de database

Nadat de frontend en de backend zijn geupload naar de cloud, worden er tests uitgevoerd op basis van de volgende checks:
    1. De frontend wordt correct geladen in de browser.
    2. De backend reageert correct op API-requests.
    3. Alle CRUD-operaties werken
    
## Beveiligingsmaatregelen

**Stap 8: Omschrijf welke maatregelen je implementeert**

Op de HBO-ICT.Cloud is HTTPS standaard actief, maar we nemen extra maatregelen om de backend en database te beveiligen. Het is de bedoeling om de volgende maatregelen te implementeren:
    1. CORS (Cross-Origin Resource Sharing). Door gebruik te maken van CORS beperken we de toegang tot de API zodat alleen specifieke domeinen er gebruik van kunnnen maken. Configureer met behulp van ExpressJS om alleen verzoeken toe te staan van een lijst met betrouwbare domeinen.
    2. Environment Variabelen: Door gebruik te maken van environment variabelen kunnen gevoelige gegevens zoals databasewachtwoorden of API-keys veilig worden opgeslagen. Het is belangrijk om de .env-bestand **niet** up te loaden naar de remote repository. Er wordt ook ervoor gezorgd dat de cloud dit bestand correct inlaadt en dat deze variabelen ook daadwerkelijk voorkomen in de code.
    3. Monitoring: Het is belangrijk om de status van de applicatie bij te houden om enige verdachte activiteiten zo snel mogelijk te detecteren. Het bijhouden hiervan zal versimpeld worden door belangrijke gebeurtenissen te loggen (nieuwe sessies, game starts ...) en gebruik te maken van try-catch blocks om mogelijke corruptie te identificeren. 
