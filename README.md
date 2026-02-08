# NightClub – Copenhagen Night Life Entertainment

Dette projekt er lavet som en del af eksamen på multimediedesignuddannelsen.  
Opgaven har været at kode og programmere et website for Copenhagen Night Life Entertainment og deres klub “NightClub”, ud fra et fastlagt design på Figma og en række tekniske krav.

Fokus har været på at omsætte design til funktionel kode, arbejde med data fra API og sikre en god og forståelig brugeroplevelse.

---

## Projektet i korte træk

Websitet er bygget som en single-page application i React og indeholder både statisk indhold og dynamisk data hentet fra et lokalt API.

Jeg har arbejdet med:
- opsætning af sider og komponenter
- responsivt design
- formularer med validering
- hentning og posting af data til API
- simple animationer og interaktioner

---

## Teknologier

Projektet er udviklet med:

- HTML
- CSS
- JavaScript
- React (Vite)
- React Router
- Fetch API
- Lokalt API (JSON Server)

---

## Funktionalitet

Websitet indeholder følgende sider og funktioner:

- Forside med hero, animation og tilfældigt baggrundsbillede på load
- Event-slideshow med data fra API
- Galleri med billeder og lightbox
- Musikafspiller med forskellige tracks
- Testimonials-slideshow (API-data)
- Blog:
  - Oversigt med pagination (maks. 3 indlæg pr. side)
  - Enkelt blogindlæg
  - Kommentarfunktion med validering og POST til API
- Book Table:
  - Valg af bord
  - Formular med validering
  - Tjek af om bordet allerede er reserveret via API
- Contact-side med kontaktformular
- Newsletter-tilmelding med email-validering

Alle formularer giver feedback til brugeren, hvis noget er udfyldt forkert eller mangler, og viser beskeder ved succes eller fejl.

---

## Arbejde med API

Projektet bruger et lokalt API, hvor der både hentes og gemmes data.

API’et bruges blandt andet til:
- events
- blogindlæg
- kommentarer
- testimonials
- bordreservationer
- kontaktbeskeder
- newsletter-tilmeldinger

API’et køres lokalt og dokumentationen findes på:
http://localhost:4000

---

## Fejlhåndtering og brugerfeedback

Der er arbejdet med:
- loading-states, mens data hentes
- fejlbeskeder, der er forståelige for brugeren
- validering af inputfelter i formularer

Brugeren får ikke tekniske fejl, men beskeder der forklarer, hvad der skal rettes.

---

## Git og workflow

Projektet er udviklet individuelt.

Under udviklingen har mit primære fokus været på at få funktionalitet, layout og API-integration til at spille sammen og fungere stabilt. Derfor er størstedelen af arbejdet lavet i én branch, så jeg kunne arbejde hurtigt og bevare overblikket, mens projektet tog form.

I den sidste del af processen har jeg samlet projektet i main-branchen og lavet commits med fokus på oprydning, struktur og et færdigt, sammenhængende resultat.

Jeg er bevidst om brugen af branches og fordelene ved fx feature-branches, hvor man normalt udvikler nye funktioner eller ændringer separat og først merger dem, når de er klar. I et større projekt eller i gruppearbejde ville det helt klart være den tilgang, jeg ville vælge for at sikre bedre overblik og versionsstyring.

Selvom jeg ikke har arbejdet konsekvent med feature-branches fra start i dette projekt, afspejler commits og projektets struktur stadig en iterativ arbejdsproces, hvor funktioner og design er blevet justeret og forbedret løbende.

---

### API og data

Projektet anvender et lokalt API til håndtering af dynamisk indhold som events, blogindlæg, reservationer, testimonials og kontaktbeskeder.

Databasefilen ligger her i projektet:
client/api/db.json

---

### How to run the project

Projektet består af to dele: et lokalt API og en client (frontend).

#### 1. Start API’et
API’et findes i mappen `client/api`.

I terminal:

cd client/api
npm install
npm start

API’et kører herefter på:
http://localhost:4000

#### 2. Start client (frontend)
Åben en ny terminal i projektets rodmappe:

cd client
npm install
npm run dev

Herefter kan projektet ses i browseren via den lokale Vite-adresse.
Kort sagt, skal vi starte API’et i én terminal, og derefter åbne en ny terminal til at starte frontend.
