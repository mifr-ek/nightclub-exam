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

Under selve udviklingen blev arbejdet primært udført i én branch, da fokus var på at få funktionalitet og layout til at fungere korrekt.

I den afsluttende fase er projektet samlet i `main`-branchen, og commits er lavet med fokus på at samle funktionalitet og struktur.

Selvom der ikke er arbejdet konsekvent med feature-branches fra starten, er projektets udvikling dokumenteret via commits og struktur i repositoryet.

---

## API data

Projektet anvender et lokalt API.  
En kopi af `db.json` er inkluderet i repositoryet.
