## Deployen op de HBO-ICT.Cloud

**Stap 7: Omschrijf hoe je het project uitrolt op de HBO-ICT.Cloud en welke methode je gebruikt:**

In het project wordt gebruik gemaakt van automatisch deployment. Dit wordt gedaan met behulp van CI/CD. **CI/CD** staat voor Continuous Integration / Continuous Deployment. Dat wilt zeggen dat programmeurs met behulp van het CI/CD systeem continu kunnen bouwen, testen en deployen. Het bestaat uit een iteratieve proces dat de kans op bugs verkleint door het vroegtijdig op te sporen. De belangrijkste componenten van CI/CD zijn: **.gitlab-ci.yml**, **GitLab Runner**, **Pipelines (de proces)** en **environments (fase: development, staging, production)**. Daarnaast wordt er ook gebruik gemaakt van SFTP (Secure File Transfer Protocol). Met behulp van de **WinSCP** client wordt SFTP toegepast om de project bestanden naar de betreffende server te sturen.

**.gitlab-ci.yml**:
Dit is een belangrijke file die een centrale rol speelt in het deployment proces. Het definieert de stages en jobs die Gitlab moet uitvoeren zodra er een wijziging wordt gepusht naar de repo. 

```
    .gitlab-ci.yml

    variables:
        DEPLOY_HIC: "false"
        DEPLOY_PAGES: "true"

    workflow:
        auto_cancel:
            on_new_commit: interruptible

    stages:
        - build
        - deploy

    include:
        - ".gitlab-ci.build.yml"
        - ".gitlab-ci.deploy-hic.yml"
        - ".gitlab-ci.deploy-pages.yml"
```

In de stages wordt aangegeven dat er twee fasen zijn: build en deploy. 

In plaats van één grote pipeline, worden de configuratie opgesplitst in meerdere .yml bestanden.

* **.gitlab-ci.build.yml** bevat de jobs die het project builden.
* **.gitlab-ci.deploy-hic.yml** bevat de instructies voor het deployen naar de HIC-server.
* **.gitlab-ci.deploy-pages.yml** bevat de instructies voor het deployen naar GitLab Pages.

* **.gitlab-ci.build.yml**
    - Installeert dependencies met `npm install`.
    - Genereert documentatie met `npm run typedoc`.
    - Bouwt zowel de frontend als de backend (naar de correcte folder gaan met `cd <folder>` en `npm run build` uitvoeren).
    - Slaat de build files op in een **dist/** map. Deze wordt later gebruikt in deploy jobs.
    - node_modules/ wordt **gecached** omdat het een grote file is, dus de volgende builds worden daardoor sneller.

* **.gitlab-ci.deploy-hic.yml**
    - Verbindt met de HIC-server via SFTP met de gegeven variabelen in Gitlab.
    - Upload de bestanden naar HIC, backend in /app/ en frontend naar /wwwroot/ 
    - Refresht de server met `wget`.
    - DEPLOY_HIC bepaalt of deze job uitgevoerd zal worden.

* **.gitlab-ci.deploy-pages.yml**
    - Verplaatst documentatie van dist/docs/ naar public/
    - DEPLOY_Pages bepaalt of deze job uitgevoerd zal worden.

De uitrol gebeurt als volgt:

1. Configureer de CI/CD variabelen in de project settings van GitLab.
2. Zorg ervoor dat alle .yml files correct zijn geconfigureerd.
3. Maak verbinding met de HBO-ICT.Cloud via WinSCP. Gebruik hiervoor de gevoelige keys die zijn meegegeven. 
4. Maak in de /live/wwwroot map een bestand met de naam: .hic en zet het volgende er in:
    ```
    {
        "AccessType": "Public"
    }    
    ```
    Dit geeft aan dat de geleverde bestanden openbaar toegankelijk moet zijn.
4. Upload de bestanden naar de cloud met behulp van de client.
    
## Beveiligingsmaatregelen

**Stap 8: Omschrijf welke maatregelen je implementeert**

Op de HBO-ICT.Cloud is HTTPS standaard actief, maar we nemen extra maatregelen om de backend en database te beveiligen. Het is de bedoeling om de volgende maatregelen te implementeren:

1. CORS (Cross-Origin Resource Sharing). Door gebruik te maken van CORS beperken we de toegang tot de API zodat alleen specifieke domeinen er gebruik van kunnnen maken. Configureer met behulp van ExpressJS om alleen verzoeken toe te staan van een lijst met betrouwbare domeinen. CORS vertelt de browser: "Ja, dit domein mag met mij praten."

Voorbeeld gebruik van CORS in ExpressJS:

```
    routes.ts

    import express from "express";
    import cors from "cors";

    const app = express();

    const allowedOrigins = ["https://zuudiihoovee60-pb3sed2425.hbo-ict.cloud/", "http://localhost:3000", "https://lucastars.hbo-ict.cloud/games/zuudiihoovee60/"];

    app.use(
    cors({
        origin: function (origin, callback) {
        if (!allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
        },
    })
    );

    app.use("/game", gameRouter);

```
Om CORS toe te passen, moet dus de cors package wordne geïnstalleerd: `npm install cors`.

Het object in cors({...}) is een configuratie object die bepaalt:

- Wie mag verbinding maken? `origin: ["http://localhost:3000", "https://zuudiihoovee60-pb3sed2425.hbo-ict.cloud/"]`
- Welke headers (metadata/extra informatie) mogen mee? `allowedHeaders: ["Content-Type", "Accept", "X-Playersessionid"],`
- Welke HTTP-methoden worden toegestaan? `methods: ["GET", "POST", "PUT", "DELETE"]`
- Mogen cookies of credentials mee? `credentials: true`

2. Environment Variabelen: Door gebruik te maken van environment variabelen kunnen gevoelige gegevens zoals databasewachtwoorden of API-keys veilig worden opgeslagen. Het is belangrijk om de .env-bestand **niet** up te loaden naar de remote repository. Er wordt ook ervoor gezorgd dat de cloud dit bestand correct inlaadt en dat deze variabelen ook daadwerkelijk voorkomen in de code.
3. Monitoring: Het is belangrijk om de status van de applicatie bij te houden om enige verdachte activiteiten zo snel mogelijk te detecteren. Het bijhouden hiervan zal versimpeld worden door belangrijke gebeurtenissen te loggen (nieuwe sessies, game starts ...) en gebruik te maken van try-catch blocks om mogelijke corruptie te identificeren.
