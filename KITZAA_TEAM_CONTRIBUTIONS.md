# Kitzaa – Teambeiträge

Auswertung der Git-Historie des Monorepos (`client`, `server`, `admin`) für die Abschlusspräsentation.  
Stichtag der Historie: 19. Oktober 2026. Es wurde kein Anwendungscode verändert.

## Wie die Zuordnung entstanden ist

Gezählt wurden nur Commits, die keine Merge-Commits sind. Diese Git-Namen gehören jeweils zu einer Person:

| Person | Git-Autorennamen | Hinweis |
| --- | --- | --- |
| Duygu | `Duygu cankurt`, `cankurtduygu` | `cankurtduygu` hat 124 Merge-Commits und keine Dateiänderungen. Features werden daraus nicht abgeleitet. |
| Ayla | `Aylaataydir` | ein Name |
| Elif | `Elif Yuzer`, `ELİF YÜZER` | Der zweite Name hat drei kleine Notification-Commits. |

Ausgeschlossen wurden `package-lock.json`, `.next`, `node_modules` und `dist`. Diese Dateien verfälschen Zeilenzahlen, ohne eine Funktion zu beschreiben.

Eine Datei gehört nicht der Person, die sie zuletzt angefasst hat. Nach dem Commit `feat: folder restructer` (Ayla, 28. Juli 2026) liegen viele Dateien unter `server/src/`. Ein späterer Edit am neuen Pfad ist keine Neuerfindung. Maßgeblich sind die Feature-Commits und, wo sie eindeutig ist, `git log --follow`. Wo `--follow` eine Datei bis zum Server-Grundgerüst vom 9. Juni 2026 zurückverfolgt, ist das als unsichere Herkunft markiert.

Eigene Notizen (`server/Duygu.md`, `client/Duygu-frontend.md`, `client/Ayla-frontend.md`, `server/Elif.md`, `client/Elif.client.md`, `admin/adminnotlari.md`) dienen als Zusatzbeleg, nicht als Ersatz für die Historie.

Zeilenzahlen weiter unten sind nur ein Größenvergleich. Dieselbe Datei wird bei jedem weiteren Commit erneut gezählt.

## Beitragsmatrix

Legende: **eigenständig** = das Feature beginnt in den Commits dieser Person. **gemeinsam** = mehrere Personen haben denselben Ablauf wesentlich verändert. **gering** = nur Übersetzung, Umbenennung oder ein kleiner Fix. **keine** = in der Historie kein eigener Beitrag.

| Bereich | Duygu | Ayla | Elif |
| --- | --- | --- | --- |
| Frontend (`client`) | eigenständig: Social, Profil, Auth-Seiten, KI-Suche | eigenständig: Events, Filter, Registrierung, Navbar | eigenständig: Benachrichtigungsglocke, Support-Chat, Kontoeinrichtung; gemeinsam an Navbar und Eventdetails |
| Backend (`server`) | eigenständig: Posts, Kommentare, Organisator-API, Institution, KI-Suche; Anfang von Express | eigenständig: Events, Kategorien, Upload, Query-Handler, Mails | eigenständig: Benachrichtigungen, Cronjobs, Socket, Dashboard-API, Support |
| Admin-Panel | keine | gering: einzelne Event- und Bewerbungskarten | eigenständig: Panel, Kanban, Nutzer, Kategorien, Dashboard |
| Datenbank | eigenständig: `Post`, `PostComment`, `Institution`, `OrganizerApplication` | eigenständig: `Event`, `EventCategory`; gemeinsam: `User` | eigenständig: `Notification`, `Conversation`, `Message`; gemeinsam: Felder an `Event` und `OrganizerApplication` |
| Authentifizierung | eigenständig: Login, frühes JWT und Middleware; gemeinsam: Refresh-Cookie | eigenständig: Registrierung, Passwort-Reset, Willkommensmail, TypeScript-Umstellung | eigenständig: Admin-Guard, Einladungsflow, Socket-Auth |
| API | eigenständig: `/posts`, `/comments`, `/organizer-applications`, `/institutions`, `/ai/event-search` | eigenständig: `/events`, `/category`, Swagger für Event und Auth | eigenständig: `/notifications`, `/admin/*` außer dem von Ayla begonnenen Event-Controller |
| KI | eigenständig: natürlichsprachige Eventsuche | keine Funktion, nur deutsche Übersetzung an einer KI-Komponente | eigenständig: Support-Agent, Risikoanalyse, Admin-KI-Kasten |

Beteiligung an Nicht-Merge-Commits, die mindestens eine Codedatei des Bereichs ändern (Rauschen ausgeschlossen):

| Bereich | Duygu | Ayla | Elif |
| --- | ---: | ---: | ---: |
| Frontend | 41 | 41 | 36 |
| Backend | 30 | 29 | 110 |
| Admin-Panel | 0 | 2 | 53 |
| Datenbankmodelle | 3 | 7 | 15 |
| Authentifizierung | 18 | 24 | 16 |
| API (Routen, Controller, Validierung, Swagger) | 32 | 25 | 51 |
| KI-Dateien | 3 | 1 | 10 |

Hinzugefügte Codezeilen in denselben Bereichen, ohne Lockfiles und Build-Ordner:

| Bereich | Duygu | Ayla | Elif |
| --- | ---: | ---: | ---: |
| Frontend | 10.340 | 11.036 | 3.093 |
| Backend | 2.532 | 3.416 | 5.168 |
| Admin-Panel | 0 | 356 | 12.470 |
| Datenbankmodelle | 147 | 50 | 405 |
| Authentifizierung | 1.465 | 1.418 | 1.469 |
| API | 1.955 | 1.513 | 1.964 |
| KI | 1.123 | 5 | 677 |

Die Admin-Zeilen von Elif sind hoch, weil das Panel neu ist und dieselben Boards mehrfach umgebaut wurden. Aylas Frontend-Zeilen liegen vor allem in Event-Formular und Filtern. Duygus Frontend-Zeilen liegen vor allem im Social-Bereich.

## Duygu

### Frontend

Eigenständig angelegt und ausgebaut:

- Social-Feed: `SocialFeedHeader`, `FeedList`, `PostCard`, `CreatePostForm`, `CreatePostDialog`, `PostDetailContent`, `SocialFilter`, Seiten `/social` und `/posts/[postId]`, Hooks in `socialHooks.ts`
- Profil: persönliche Daten, Passwort ändern, Profilbild-Upload, Seite Sicherheit, eigene Beiträge
- Auth-Oberfläche: Login-, Passwort-vergessen-, Reset- und Verify-Seiten, `authStore`, `RequireAuth` im Client, Hooks `useLogin`, `useLogout`, `useForgotPassword`, `useResetPassword`, `useVerifyEmail`
- Veranstalterformular und Institutionsformular im Client (`OrganizerApplicationForm`, `InstitutionForm`)
- KI-Suche in der Oberfläche: `AiEventSearch`, `useAiEventSearch`, Fehlergrenze `AiSearchErrorBoundary`
- Internationalisierung: `client/i18n/routing.ts` mit `de` und `en`, spätere Übersetzungsläufe am 13. Oktober 2026
- Ortssuche für Beiträge über `client/app/api/places/route.ts` und `client/lib/geocode/nominatim.ts`

`client/Duygu-frontend.md` beschreibt den Refresh-Ablauf mit `isReady` und einen Hook-Reihenfolge-Fehler auf der Social-Seite. Beides passt zu den Auth- und Social-Commits.

### Backend, API und Datenbank

- 9. Juni 2026: Express-Grundgerüst und Middleware (`add: setup express server and middleware configuration`)
- 11. Juni 2026: `add auth login` – erster Login-Controller und `generateJwt`
- 21. Juli 2026: `Institution` und `OrganizerApplication` inklusive Typen (`BE-017` im Commit)
- 24.–27. Juli 2026: Bewerben, `/me`, E-Mail-Prüfung, Admin-Genehmigung, Ablehnung und Mails
- Institution-Endpunkte `GET/PUT /institutions/me`
- `Post` (28. Juli, KTZ-6) und `PostComment` (30. Juli, KTZ-9)
- Controller und Routen für Beiträge und Kommentare, inklusive `commentsCount` und Likes
- 5. Oktober 2026: `feat(ai): add natural-language event search` – Controller, Route, Redis, `ai.service`, Gesprächszustand, Filter-Helfer und Tests
- 14. Oktober 2026: Refresh-Cookie für produktive Cross-Site-Anfragen
- 19. Oktober 2026 liegt der Like-Benachrichtigungs-Commit bei Elif, nicht bei Duygu

`server/Duygu.md` skizziert dasselbe Bewerbungsmodell. Die Checkliste in der Notiz ist älter als die Commits: Genehmigen, Ablehnen und Rollenwechsel sind in Duygus Commits vom 25. und 27. Juli bereits enthalten.

### Authentifizierung

Duygu hat den Login und die JWT-Helfer begonnen und die Middleware-Datei zuerst angelegt. Registrierung, Reset und Willkommensmail hat danach Ayla übernommen. Duygu hat den Refresh-Cookie später für den Produktionseinsatz nachgezogen.

### KI

Die natürlichsprachige Eventsuche ist Duygus Stück, vom Prompt und Zod-Schema über Redis bis zur Client-Komponente. Die Risikoanalyse und der Support-Agent gehören nicht dazu.

### Admin-Panel

Keine eigenen Admin-Features. Null Commits unter `admin/` mit Produktcode.

## Ayla

### Frontend

Eigenständig, belegt durch Commits und `client/Ayla-frontend.md`:

- Eventliste, Detailseite, Lade- und Fehlerzustände (`/events`, `/events/[slug]`)
- Filter in der URL: Kategorie, Altersgruppe, Organisator, Zeitraum, Umkreis
- Geocode-Proxy `client/app/api/geocode/route.ts` und `LocationFilter`
- Hybrides Laden: Server-Fetch mit `revalidate: 60` plus `useInfiniteEvents`
- Event anlegen und bearbeiten: `CreateEventWizard`, `EventDetailsStep`, `EventScheduleStep`, `EventPricingStep`
- Teilnahme, Verlassen, Speichern, eigene, gespeicherte und registrierte Events im Profil
- Navbar, Theme-Provider, Registrierungsformular mit Stepper und Postleitzahl
- UploadThing-Anbindung für Eventbilder (`eventImageApi.ts`, 8. September 2026)

### Backend, API und Datenbank

- 22. Juli 2026: Eventkategorien, Slug-Helfer, Routen
- 23. Juli 2026: Event-Modell, Typen und Routen
- 27. Juli 2026: `feat(event): implement event controller functions`
- 31. Juli 2026: Statusmaschine, Abschluss-Job, Ablehnungs- und Stornomails
- 3. August 2026: Umkreissuche
- Join, Leave, gespeicherte Events, Bearbeiten und Löschen in weiteren Event-Commits bis September
- `queryHandler`, `toEventDTO`, `toUserDTO`, Swagger für Event, User und Auth
- UploadThing-Grundsetup am 30. Juli 2026 (`create uploadThing file`, `feat(uploadthing)`)
- Seed-Skripte für Kategorien, Events und Nutzer
- Admin-User-Controller am 21. Juli 2026: `feat(admin): add user controller and routes`

Das User-Modell beginnt am 10. Juni bei Elif (`feat(user):add user model`). Ayla hat es bei der TypeScript-Umstellung vom 21. Juli weitergeführt. Alleinige Autorenschaft am User-Modell wäre falsch.

### Authentifizierung

- 15. Juni 2026: `fit auth and users operations`
- 16. Juni und 21. Juli 2026: Passwort vergessen und Reset
- 20. Juli 2026: Willkommensmail bei der Registrierung
- 21. Juli 2026: TypeScript-Migration von Auth, Validierung und `permissions`
- 15. August 2026: `feat(auth): complete registration flow and authentication updates`

### Admin-Panel

Nur vier Dateien beginnen bei Ayla: Event-API, Event-Typ, `EventCard` und `OrganizerApplicationCard`. Das Panel, die Boards und die Schubladen kommen von Elif. Ayla hat `EventDrawer.tsx` später mit etwa 49 hinzugefügten Zeilen mitbearbeitet.

### KI

Ein Commit, `feat: add German translations for all text content` (7. Oktober 2026), berührt eine KI-Datei. Das ist eine Übersetzung, keine KI-Funktion.

## Elif

### Frontend

Eigenständig im Client, nicht das Event-Browsing:

- Benachrichtigungsliste, Glocke, Ungelesen-Zähler, Als-gelesen-markieren, Deep Links auf Event-Slugs (KTZ-138, KTZ-180, KTZ-181, KTZ-198, KTZ-199)
- `AuthSocketProvider`: Socket nur mit gültigem Token, Trennen beim Logout
- Support-Chat als einklappbares Panel, deutsche Texte, Hinweis wenn eine Admin-Antwort kommt
- Kontoeinrichtung nach Einladung: `setup-account-form.tsx` und `useSetupAccount` (KTZ-212)

Event- und Navbar-Dateien hat Elif mitbearbeitet, aber nicht angelegt. Beispiele stehen im Abschnitt Gemeinsame Verantwortung.

`client/Elif.client.md` beschreibt Glocke, Cache-Update per Socket und den Polling-Fallback. Die Commits `feat(socket): implement AuthSocketProvider` und `feat(notifications): implement realtime cache injection` bestätigen das.

### Backend, API und Datenbank

Benachrichtigungen, ab 29. Juli 2026:

- Modell, Typen, `createNotification`, `toNotificationDTO`, Liste, Zähler, Als-gelesen
- Admin-Warteschlange für `organizer_application` und `event_review`
- Erinnerung an morgige Events, Benachrichtigung in der Nähe, Absage, Kommentar, Antwort, Erwähnung
- Jobs `lowCapacityPromptJob`, `organizerPrepJob`, `eventSummaryJob` und Anti-Spam-Feld `systemNotificationSent`
- `sendBulkNotifications` für viele Empfänger in einem Schreibvorgang

Socket und Support:

- 10. August 2026: HTTP-Server-Wrapping, Socket-Middleware, Auslagerung nach `server/src/sockets/`
- `socketManager`, Raum `user:<id>`, Emit nach dem Datenbankschreiben (KTZ-65 bis KTZ-68, KTZ-179)
- `Conversation`, `Message`, `ConversationController`, Support-Raum

Admin-API:

- Dashboard-Zusammenfassung und Monatszählung (12. Oktober 2026, KTZ-243)
- Benachrichtigungen an Admins bei neuen Events und Bewerbungen, an Nutzende bei Genehmigung, Ablehnung und Storno (KTZ-216)
- Einladung und `setup-account` im Auth-Controller (17. September 2026, KTZ-212)

`server/Elif.md` dokumentiert dieselben Entscheidungen: DTO, Cron, Bulk-Insert, Service-Schicht, Socket-Räume.

### Admin-Panel

Das Panel ist Elifs Bereich. `admin/adminnotlari.md` und die Commits ab KTZ-136 und KTZ-144 beschreiben die Abspaltung aus dem Client.

Umgesetzt und in der Historie zuerst von Elif eingebracht:

- Layout, Sidebar, Header, Theme, `RequireAuth` mit Test `RequireAuth.test.tsx`
- Logout zurück zur Client-Anmeldung (KTZ-202)
- Kanban für Events und Bewerbungen, Filter, Suche, Sortierung, spaltenweises Nachladen
- Schubladen für Prüfung, Genehmigung, Ablehnung und Storno
- Nutzer- und Kategorietabellen mit Anlegen, Ändern und Löschen
- Dashboard mit `OverviewChart`, `StatsCard` und Live-Widget
- Admin-Benachrichtigungsglocke und Socket-Provider

Aylas kleine Kartendateien sind die Ausnahme, nicht die Regel.

### Datenbank

Zuerst von Elif: `notificationModel`, `Conversation`, `Message`.  
Später von Elif an bestehenden Modellen: `aiAnalysis` an Event und Bewerbung, `systemNotificationSent` am Event, `senderId` und `relatedModel` an der Benachrichtigung.

`OrganizerApplication` und `Institution` hat Duygu am 21. Juli angelegt. Elifs Commit vom 4. Oktober ergänzt die KI-Felder. Das ist eine Erweiterung, keine Neuanlage.

### Authentifizierung

- Socket-Handshake in `socketAuth.ts`
- Admin-`RequireAuth` und Auth-Store des Panels
- Einladungsflow und Setup-Route
- Drei kleine Commits unter `ELİF YÜZER`: Notification-Controller und Methode `PATCH` für „alle gelesen“

Den Login hat Elif nicht begonnen.

### KI

- Support-Agent: `server/src/agent/run.ts`, Systemprompt, Werkzeuge `dateTime` und `transferToAdmin`, Evaluationsdateien (1. Oktober 2026)
- `aiRiskAnalysisService` für Bewerbungen und `aiRiskAnalysisForEvenrs` für Events, angebunden im Create-Flow (4. Oktober 2026)
- `SectionAIBox` in der Admin-Schublade

Die öffentliche Eventsuche (`/ai/event-search`, Gemini, Redis) ist Duygus Commit vom 5. Oktober.

## Gemeinsame Verantwortung

Diese Abläufe lassen sich keiner Person allein zuschreiben.

| Ablauf | Beginn | Wesentliche Weiterarbeit |
| --- | --- | --- |
| Server-Start und Middleware | Duygu, 9. Juni 2026 | Ayla: TypeScript, Query-Handler, Swagger, Upload. Elif: Socket am selben HTTP-Server |
| Login und JWT | Duygu, 11. Juni 2026 | Ayla: Reset, Registrierung, Mails. Elif: Einladung und Setup. Duygu: Cookie-Fix am 14. Oktober |
| User-Modell | Elif, 10. Juni 2026 | Ayla bei der TypeScript-Migration. Duygu in frühen JavaScript-Ständen (`src/models/userModel.js`, etwa 70 hinzugefügte Zeilen) |
| Events | Ayla, 23.–31. Juli 2026 | Elif: Benachrichtigungen, Admin-Moderation, KI-Feld. Duygu: Übersetzungen und kleine Detailkorrekturen im Oktober |
| Event-Controller | Ayla, `implement event controller functions`, 27. Juli 2026 | Elif etwa +199 Zeilen, Ayla etwa +285. `--follow` hängt die Datei zusätzlich an Duygus Setup vom 9. Juni. Diese frühe Zuordnung ist nicht belastbar |
| Admin-Event-Controller | Ayla, Status und Mails, 31. Juli 2026 | Elif: Genehmigen, Ablehnen, Stornieren aus dem Panel und Benachrichtigungen, September 2026 |
| Veranstalterbewerbung | Duygu, Modell und Endpunkte, 21.–27. Juli 2026 | Elif: Kanban, In-App-Benachrichtigung, Risikoanalyse. Duygu: Formular im Client |
| Navbar | Ayla, 9. August 2026 | Duygu etwa +188 Zeilen, Elif etwa +127 Zeilen (Glocke, Profilbild, Links) |
| Social-Hooks | Duygu, 10. September 2026 | Elif etwa +112 Zeilen, vor allem Benachrichtigungs- und Like-Anbindung |
| Event-Modell | Ayla, 23. Juli 2026 | Elif etwa +184 Zeilen (Benachrichtigungsflags, KI-Analyse), Ayla etwa +48 Zeilen am späteren Pfad |
| Upload | Ayla, 30. Juli 2026 | Duygu: Profilbild (KTZ-234) und Beitragsbild. Ayla: Eventbilder |
| Deutsche Oberfläche | Ayla, Übersetzungslauf 7. Oktober 2026 | Duygu, weiterer Lauf 13. Oktober 2026. Elif: deutsche Support-Texte |

## Nicht belastbar

- **Merge-Autor `cankurtduygu`.** Keine Inhaltsänderung. Nicht als Feature zählen.
- **Ordnerumzug am 28. Juli 2026.** Ayla hat Pfade nach `server/src/` verschoben. Das erzeugt keine neuen Modelle oder Controller.
- **`git log --follow` auf `eventController.ts` und `admin.eventController.ts`.** Beide Historien laufen in Duygus Server-Setup vom 9. Juni. Der erste fachliche Event-Commit ist Aylas Commit vom 23. beziehungsweise 27. Juli. Die Juni-Zuordnung wird nicht verwendet.
- **Umbenennungen in Git** (`{alt => neu}`). Sie zählen als Verschieben, nicht als neues Feature. Betroffen sind unter anderem Auth-Formulare und Admin-Feature-Ordner.
- **Zeilensummen.** Mehrfaches Überarbeiten derselben Datei erhöht die Summe. Ein einzelner Commit mit `.next`-Dateien oder `package-lock.json` sagt nichts über den Funktionsumfang.
- **shadcn- und UI-Rohlinge** unter `components/ui`. Sie werden nicht als einzeln entworfene Fachfunktionen aufgeführt.
- **Letzter Autor einer Datei.** Zum Beispiel ergänzt Elif `aiAnalysis` an Duygus Bewerbungsmodell. Das Modell bleibt Duygus Anlage, das Feld Elifs Erweiterung.
- **Aylas einziger KI-Commit.** Nur Übersetzungstext. Keine Integration.

## Kurzfassung für die Präsentation

Kitzaa ist zu dritt und über alle drei Anwendungen hinweg entstanden.

Duygu hat den Server und den Login angefangen, die Veranstalterbewerbung und die Institution im Backend gebaut, den Social-Bereich und das Profil im Client umgesetzt und die natürlichsprachige Eventsuche von der API bis zur Startseite angebunden.

Ayla hat die öffentlichen Events gebaut: Modell, API, Filter, Umkreissuche, Teilnahme, Erstellen mit Bild-Upload und die Registrierung inklusive Passwort-Reset. Das Admin-Panel hat sie nicht verantwortet.

Elif hat die Querschnittsfunktionen gebaut, die beide Oberflächen brauchen: Benachrichtigungen, Zeitjobs, Socket.IO, das Admin-Panel, den Support-Chat und die KI-Risikoanalyse. Login und Eventliste stammen nicht von ihr.

Auth, Events, Bewerbungen und die Navbar sind bewusst gemeinsame Strecken. Dort ist in der Historie sichtbar, wer den ersten fachlichen Commit gesetzt hat und wer den Ablauf danach erweitert hat.
