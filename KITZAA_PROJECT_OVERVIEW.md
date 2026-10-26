# Kitzaa – Projektübersicht

Abschlusspräsentation, Full-Stack-Softwareentwicklung.  
Alle Angaben stammen aus dem Repository (Code, Konfiguration, Übersetzungen und dokumentierte Arbeitsnotizen). Geplante, aber nicht umgesetzte Ideen sind ausdrücklich als solche gekennzeichnet.

## 1. Projektzweck und Zielgruppe

Kitzaa ist eine Plattform zum Entdecken und Organisieren familienfreundlicher Veranstaltungen. Die öffentliche Startseite formuliert das so: „Entdecke familienfreundliche Events in deiner Nähe“ – von Ausflügen bis zu Workshops in der Nachbarschaft. Die Metadaten beschreiben Kitzaa als „Veranstaltungs-Entdeckungs- und Organisationsplattform“.

Zwei Zielgruppen sind in der Oberfläche und im Datenmodell getrennt:

- **Familien und Teilnehmende** suchen Events nach Alter, Ort, Datum, Preis und Kategorie, melden sich an und tauschen sich im Social-Bereich aus.
- **Veranstalter** bringen Workshops, Ausflüge oder Treffpunkte auf die Plattform. Dafür bewerben sie sich; nach Freigabe entsteht ein Institutionsprofil und die Rolle `organizer`.

Die Standardsprache der Nutzeroberfläche ist Deutsch (`de`). Englisch (`en`) ist ebenfalls vorhanden. Das Admin-Panel ist eine eigene Anwendung für die Moderation von Events, Veranstalterbewerbungen, Nutzern und Kategorien.

Das Repository ist ein npm-Workspace mit drei Paketen: `client` (öffentliche Anwendung), `admin` (Administrationsoberfläche) und `server` (API). Gemeinsam gestartet werden sie mit `npm run dev` über `concurrently`.

## 2. Hauptfunktionen und Benutzerrollen

### Rollen

Das Benutzermodell kennt genau drei Rollen: `user`, `organizer` und `admin`. Neue Konten starten als `user`. Die Rolle `organizer` entsteht erst durch eine genehmigte Bewerbung. `admin` wird nicht über die öffentliche Registrierung vergeben; Admins können Nutzer über die Admin-API einladen.

| Rolle | Was der Code erlaubt |
| --- | --- |
| Nicht angemeldet | Freigegebene Events lesen und filtern, Kategorien lesen, öffentliche Beiträge lesen, KI-Eventsuche |
| `user` | Profil, E-Mail-Verifizierung, Passwort, Events erstellen (kostenpflichtige Events nur als Organisator), teilnehmen, verlassen, liken, speichern, Beiträge und Kommentare, Veranstalterbewerbung |
| `organizer` | Eigenes Institutionsprofil lesen und aktualisieren; zusätzlich die Rechte eines angemeldeten Nutzers. Kostenpflichtige Events sind an diese Rolle gebunden |
| `admin` | Eigenes Panel: Dashboard, Event-Moderation, Bewerbungen, Nutzer, Kategorien, Benachrichtigungswarteschlange, Live-Aktivität und Support-Chat |

### Öffentliche Anwendung (`client`, Port 3000)

- Startseite mit Hero, KI-Suche, kommenden Events und einem Bereich „Für Veranstalter“.
- Eventliste mit Filtern (Kategorie, Altersgruppe, Ortstyp, Zeitraum, Organisator, Umkreissuche) und Eventdetailseiten über den Slug.
- Teilnahme, Abmeldung, Likes und gespeicherte Events.
- Mehrstufiges Formular zum Erstellen und Bearbeiten von Events, inklusive Bild-Upload.
- Social-Feed: Beiträge erstellen, lesen, liken und kommentieren. Kommentare können Antworten und erwähnte Nutzer enthalten.
- Profilbereich: persönliche Daten, Sicherheit, eigene Events, registrierte Events, gespeicherte Events, eigene Beiträge.
- Veranstalterbewerbung und Institutionsformular.
- Benachrichtigungen mit Glocke, Ungelesen-Zähler und Deep Links.
- Authentifizierung: Registrierung, Login, Logout, E-Mail-Bestätigung, Passwort vergessen, Passwort zurücksetzen, Konto-Einrichtung über Token.
- Support-Chat über Socket.IO.
- Hell-/Dunkelmodus und Sprachumschaltung Deutsch/Englisch.

Wichtige Routen der Nutzeroberfläche:

- `/`, `/events`, `/events/[slug]`
- `/social`, `/posts/[postId]`
- `/login`, `/register`, `/forgot-password`, `/reset-password/[token]`, `/verify-email`, `/verify-email/[token]`, `/setup-account/[token]`
- `/profile`, `/profile/meine-events`, `/profile/events-erstellen`, `/profile/events-bearbeiten/[id]`
- `/profile/registrierte-events`, `/profile/gespeicherte-events`, `/profile/meine-beitraege`, `/profile/sicherheit`
- `/notifications`

### Admin-Anwendung (`admin`, Port 3001)

Das gesamte Panel ist mit `RequireAuth` auf die Rolle `admin` beschränkt. Die Navigation enthält:

- Übersicht (`/`) mit Kennzahlen, Monatsverlauf und Live-Widget
- Events (`/events`, `/events/[id]`)
- Bewerbungen (`/organizer-applications`)
- Nutzer (`/users`)
- Kategorien (`/categories`)

Events und Bewerbungen werden als Kanban dargestellt. Nutzer und Kategorien nutzen Tabellen mit mobiler Kartenansicht. Detailaktionen öffnen sich in einer seitlichen Schublade, deren Zustand in der URL liegt.

### Was im frühen Backend-README steht, aber kein eigenes Modell ist

`server/README.md` beschreibt ein Forum und Activities als geplante Bereiche. Im aktuellen Code gibt es dafür keine Modelle, Controller oder Routen. Stattdessen existiert der Social-Bereich mit `Post` und `PostComment`. Das User-Schema enthält noch das Feld `savedActivities` mit einer Referenz auf `Activity`; ein Activity-Modell ist im Repository nicht vorhanden.

Die Login- und Registrierungsformulare zeigen einen Google-Button. Der Button hat keinen Klick-Handler, und im Server gibt es keinen OAuth-Flow. Google-Anmeldung ist deshalb keine umgesetzte Funktion.

## 3. Frontend- und Backend-Technologien

### Workspace

- Node-Workspaces: `client`, `server`, `admin`
- TypeScript in allen drei Paketen
- Validierung mit Zod auf Client und Server

### Öffentliche Oberfläche

- Next.js 16.3.1 (App Router) und React 19
- Tailwind CSS 4, shadcn/ui, Base UI, Radix Slot, Lucide
- next-intl (Locales `de` und `en`, Standard `de`, Präfix nur wenn nötig)
- next-themes
- TanStack Query für Client-Daten und Infinite Scroll
- Zustand für Sitzung, gespeicherte Events und Socket-Status
- React Hook Form
- Axios
- Tiptap für Rich Text, `sanitize-html` vor der Ausgabe
- UploadThing-Client
- Socket.IO-Client
- date-fns, Sonner für Toasts

Die erste Eventseite wird serverseitig geladen und 60 Sekunden per ISR zwischengespeichert (`revalidate: 60`). Weitere Seiten lädt `useInfiniteQuery` im Browser. Kategorien werden serverseitig mit `revalidate: 3600` geladen.

### Admin-Oberfläche

- Dieselbe Next.js-/React-/Tailwind-/shadcn-Basis
- TanStack Query und TanStack Table
- Recharts für den Dashboard-Verlauf
- Zustand, React Hook Form, Zod
- Jest und Testing Library; vorhanden ist ein Test für `RequireAuth`

### Backend

- Express 5 und TypeScript, Einstieg über `index.ts` und `server.ts`
- MongoDB über Mongoose 9
- Redis für den Gesprächszustand der KI-Suche
- JWT (`jsonwebtoken`) und bcrypt (Kostenfaktor 12)
- Cookie-Parser für das Refresh-Token
- Helmet, CORS mit Credentials, Compression, Morgan, Rate Limiting
- Zod-Validierung als Middleware
- Nodemailer für transaktionale E-Mails
- node-cron für zeitgesteuerte Jobs
- Socket.IO auf demselben HTTP-Server wie Express
- UploadThing für Profil-, Event- und Beitragsbilder (`/api/uploadthing`, außerhalb von `/api/v1`)
- Swagger UI unter `/api-docs`
- Health-Check: `GET` und andere Methoden auf `/health`
- Vercel AI SDK: Google Gemini für die Eventsuche, Groq für Risikoberichte und den Support-Agenten
- Laminar (`@lmnr-ai/lmnr`) für Agent-Evaluations; Skripte `npm run eval` und `npm run eval:file-tools`
- Jest-Tests für Slugify, User-Schema und zwei KI-Helfer

## 4. Architektur

```text
Browser (client :3000, Deutsch/Englisch)
        │  REST + Cookie + Socket.IO
        ▼
Express 5  ── /api/v1 ── Routen ── Controller ── Services / Jobs
        │                 │
        │                 ├── Zod
        │                 ├── Auth- und Rollen-Middleware
        │                 └── DTO-Helfer
        ├── /api/uploadthing
        ├── /api-docs
        └── Socket.IO (JWT im Handshake, Räume)
                │
                ├── MongoDB (Mongoose)
                ├── Redis (KI-Gesprächszustand, 30 Minuten)
                ├── SMTP (Nodemailer)
                ├── UploadThing
                ├── Nominatim über Next.js-Proxy
                └── Gemini / Groq
Admin (:3001) nutzt dieselbe API und dieselbe Socket-Verbindung.
```

Der Request-Pfad ist: `index.ts` lädt die Umgebung, verbindet MongoDB und Redis, startet Cronjobs und Socket.IO. `server.ts` baut die Express-App. Alle Fachrouten hängen unter `/api/v1`.

User- und Admin-API sind getrennte Router und Controller. Admin-Routen liegen unter `/api/v1/admin` und verlangen zusätzlich `isAdmin`. Antworten geben keine rohen Mongoose-Dokumente zurück; jede Domäne hat einen `toXDTO`-Helfer. Öffentliche Event-DTOs und Admin-Event-DTOs unterscheiden sich: die Admin-Variante enthält zusätzlich Ablehnungs- und Stornogründe, Freigabezeitpunkt und eine ausführlichere Erstellerangabe.

Listen nutzen die globale `queryHandler`-Middleware. Sie liest `filter`, `search`, `sort`, `page`, `limit` und `skip` und hängt `res.getModelList` sowie `res.getModelListDetails` an die Response. Die Standardseite ist 1, das Standardlimit ist 6. Suche wird als Groß-/Kleinschreibung-ignorierender regulärer Ausdruck übersetzt.

Fehler werden als `CustomError(message, statusCode)` geworfen. Express 5 leitet async-Fehler an `errorHandler` weiter. Die Antwortform ist `{ error: true, message, cause }`. Erfolgreiche Antworten verwenden in der Regel `{ error: false, ... }`.

UploadThing prüft das Bearer-Token selbst und schreibt nach dem Upload in die Datenbank: Profilbild ersetzt das alte, Eventbilder werden angehängt, Beitragsbilder ersetzen das vorherige Bild. Ohne Ressourcen-ID (noch nicht gespeichertes Event oder Beitrag) genügt ein gültiger, aktiver Nutzer; mit ID wird Eigentum oder Admin-Rolle geprüft.

## 5. Datenbankmodelle

MongoDB, Sammlungnamen wie im Schema angegeben.

### User (`users`)

Pflichtfelder: `username` (eindeutig), `firstName`, `lastName`, `email` (eindeutig, kleingeschrieben), `password` (`select: false`), `location`. Der Standort verlangt Bundesland, Stadt und eine fünfstellige deutsche Postleitzahl; Land ist standardmäßig `DE`.

Weitere Felder: Telefon, Avatar, `role`, `isActive`, `isEmailVerified`, Sprache `de` oder `en`, `institutionId`, gespeicherte Events, Benachrichtigungseinstellungen (E-Mail und Push-Token), Refresh-Token sowie gehashte Tokens für E-Mail-Bestätigung und Passwort-Reset. Passwort und Tokens sind von normalen Abfragen ausgeschlossen.

Vor dem Speichern wird ein geändertes Passwort mit bcrypt gehasht. Eine Rollenänderung setzt das Refresh-Token auf `null`, damit alte Sitzungen die neue Rolle nicht behalten.

### EventCategory (`event_categories`)

`name` (eindeutig), automatisch erzeugter `slug`, optionale Beschreibung, Icon, `isActive`.

### Event (`events`)

Titel, eindeutiger Slug, Beschreibung, Titelbild, weitere Bilder, Kategorie, `locationType` (`indoor`, `outdoor`, `online`), Altersgruppen (`0-3`, `4-6`, `7-10`, `10-14`, `parents`, `all-ages`). `all-ages` darf nicht mit anderen Gruppen kombiniert werden.

Statusmaschine: `pending`, `approved`, `rejected`, `cancelled`, `completed`. Dazu Gründe, `approvedAt`, Preis (`isFree`, Betrag in EUR), Zeitplan, Ort mit GeoJSON-`Point`, Kapazität, Teilnehmer (`confirmed` oder `cancelled`, Personenanzahl), Likes, Aufrufe und `systemNotificationSent` als Anti-Spam-Markierungen.

Ein `2dsphere`-Index liegt auf `location.coordinates`. Die Umkreissuche filtert mit `$geoWithin` und `$centerSphere`.

`aiAnalysis` speichert Status, Zusammenfassung, Empfehlung und Analysezeitpunkt.

### OrganizerApplication (`organizerApplications`)

Bewerbung eines Users mit eingebetteten Institutionsdaten (Name, Beschreibung, Adresse, Telefon, Website, Kategorie), Nachricht und Status `pending`, `under_review`, `approved`, `rejected` oder `needs_more_info`.

Prüfer, Prüfertyp (`admin`, `ai`, `system`), Ablehnungsgrund, Prüfzeitpunkt und `statusHistory` als Audit-Spur. `aiAnalysis` enthält `riskLevel` (`LOW`, `MEDIUM`, `HIGH`), Zusammenfassung und Empfehlung.

### Institution (`institutions`)

Entsteht bei der Genehmigung. Genau eine Institution pro `ownerId`, verknüpft mit der Bewerbung. Name, eindeutiger Slug, Kontaktdaten, Logo, Status `active` oder `suspended`.

### Notification

Empfänger, Typ, Titel, Nachricht, `isRead`, optionaler Absender, `relatedId` mit `relatedModel` (`Event`, `OrganizerApplication`, `Post`, `PostComment`) und `linkNotification` für die Navigation. Index auf `{ recipientId: 1, createdAt: -1 }`.

Umgesetzte Typen unter anderem: `post_like`, `post_comment`, `post_reply`, `post_mention`, `new_event`, `nearby_event`, `event_reminder`, `event_approved`, `event_rejected`, `event_cancelled`, `event_review`, `organizer_application`, `organizer_approved`, `organizer_rejected`, `organizer_prep_summary`, `low_capacity_3day`, `post_event_summary`, `system`.

### Post (`posts`) und PostComment (`postComments`)

Beiträge: Autor, Text, optionales Bild, Likes, denormalisierte `commentsCount`, optionale Event-Verknüpfung, Ortsname, Stadt, Koordinaten, `isDeleted`, Aufrufe.

Kommentare: Beitrag, Autor, Text, Likes, `parentCommentId` für eine Antwort-Ebene, `mentionedUserIds`, `isDeleted`. Indizes unterstützen Feed und Threads.

### Conversation und Message

Gespräche haben Teilnehmer, Status `pending`, `active` oder `closed`, Raumtyp `direct` oder `support` und `isAgentActive`. Nachrichten speichern Gespräch, Absendertyp `user` oder `admin`, Absender, Inhalt und Lesestatus.

## 6. Authentifizierung und Autorisierung

Authentifizierung und Autorisierung sind getrennt.

### Wer ist der Nutzer?

- Registrierung legt einen User an, erzeugt ein 24 Stunden gültiges E-Mail-Token und sendet „Willkommen bei Kitzaa“. Schlägt der Mailversand fehl, bleibt das Konto bestehen; der Fehler wird nur geloggt.
- `GET /api/v1/auth/verify-email/:token` setzt `isEmailVerified`.
- Login akzeptiert E-Mail oder Benutzername. Das Passwort wird mit bcrypt verglichen. Inaktive Konten werden abgelehnt. Die Prüfung `isEmailVerified` im Login ist im Controller auskommentiert; unbestätigte Konten können sich derzeit anmelden. Die Veranstalterbewerbung verlangt die Bestätigung weiterhin.
- Das Access-Token (JWT, 1 Tag) enthält `_id`, `username`, `isActive`, `role` und `institutionId`. Es wird im JSON-Body zurückgegeben und im Frontend im Speicher gehalten.
- Das Refresh-Token (JWT, 7 Tage) liegt in einem `httpOnly`-Cookie `refreshToken` und zusätzlich gehasht-vergleichbar am User. `POST /api/v1/auth/refresh` prüft Cookie und gespeicherten Wert und rotiert das Token. Logout löscht Cookie und Datenbankwert.
- `authentication` liest `Authorization: Bearer`, verifiziert `ACCESS_KEY`, lädt den User neu und lehnt fehlende, abgelaufene oder inaktive Konten ab. Die Rolle kommt damit aus der Datenbank, nicht allein aus einem alten Token.
- Socket.IO authentifiziert über `socket.handshake.auth.token`, nicht über Express-Header. Danach tritt der Socket dem Raum `user:<userId>` bei. Admins treten zusätzlich `admins_room` bei.
- UploadThing wiederholt dieselbe Bearer-Prüfung.

Nach einer Genehmigung wird `user.role` auf `organizer` gesetzt und das Refresh-Token gelöscht. Die neue Rolle gilt erst nach erneutem Login.

### Darf diese Person das tun?

- `isAdmin` für das gesamte Admin-API.
- `isOrganizer` für `/api/v1/institutions`.
- `isOwnerOrAdmin(Model, ownerField)` lädt die Ressource, vergleicht das Eigentümerfeld per `ObjectId.equals` und legt das Dokument auf `req.resource`. Events nutzen `createdBy`, Beiträge und Kommentare `authorId`.
- Kostenpflichtige Events: Erstellen und Aktualisieren lehnen `isFree: false` ab, wenn die Rolle `user` ist.
- Bewerbung: nur Rolle `user`, nur mit bestätigter E-Mail, keine zweite Bewerbung in `pending`, `under_review` oder `needs_more_info`.
- Teilnahme: nur Events mit Status `approved`. Ein atomares `findOneAndUpdate` verlangt gleichzeitig, dass die User-ID noch nicht in `participants` steht und `capacity.current + participantCount` das Maximum nicht überschreitet.
- Die Admin-Oberfläche prüft die Rolle zusätzlich im Layout. Das ist eine UX-Sperre; die maßgebliche Prüfung bleibt `isAdmin` auf dem Server.

Öffentliche Lesezugriffe auf Events liefern nur `status: "approved"`. Bearbeiten, Löschen und Stornieren eigener Events bleiben eigentumsgeschützt.

## 7. API-Struktur

Basispfad: `/api/v1`. Geschützte Routen erwarten `Authorization: Bearer <accessToken>`.

### Auth – `/auth`

| Methode | Pfad | Zugriff |
| --- | --- | --- |
| POST | `/login` | öffentlich |
| POST | `/register` | öffentlich |
| POST | `/logout` | angemeldet |
| POST | `/refresh` | Refresh-Cookie |
| POST | `/forgot-password` | öffentlich |
| POST | `/reset-password/:token` | öffentlich |
| GET | `/verify-email/:token` | öffentlich |
| POST | `/setup-account/:token` | öffentlich, für eingeladene Konten |

### Nutzer, Events, Social

| Präfix | Inhalt |
| --- | --- |
| `/users` | Liste, Lesen, Aktualisieren, Löschen, Passwort. Gesamter Router ist angemeldet |
| `/category` | Öffentliche Kategorieliste und Einzellesen |
| `/events` | Öffentlich: Liste, Umkreissuche, Detail per Slug. Angemeldet: eigene Events, Teilnahmen, gespeicherte Events, Erstellen, Bearbeiten, Aktualisieren, Löschen/Stornieren, Teilnehmer, Beitreten, Verlassen, Like, Speichern |
| `/posts` | Öffentlich: Liste und Detail. Angemeldet: eigene Beiträge, Erstellen, Aktualisieren, Löschen, Like |
| `/comments` | Gesamter Router angemeldet: Liste, Erstellen, Aktualisieren, Löschen, Like |
| `/organizer-applications` | `POST /` bewirbt, `GET /me` listet eigene Bewerbungen |
| `/institutions` | `GET /me` und `PUT /me`, nur `organizer` |
| `/notifications` | Ungelesen-Zähler, alle gelesen, Liste, einzelne Benachrichtigung als gelesen |
| `/ai/event-search` | Öffentliche KI-Suche, eigenes Limit von 20 Anfragen je 15 Minuten |

`POST /events/:id/Save` verwendet ein großgeschriebenes `Save`. Das ist der tatsächliche Pfad.

`GET /notifications/test-post-event-summary` liegt vor der Auth-Middleware und startet den Job `sendPostEventSummaries` ohne Anmeldung. Das ist ein im Code verbliebener Testendpunkt.

### Admin – `/admin`

Jeder der folgenden Router verlangt Authentifizierung und `isAdmin`.

| Präfix | Inhalt |
| --- | --- |
| `/admin/dashboard` | `GET /` Zusammenfassung |
| `/admin/events` | Liste, Detail, Löschen, Freigeben, Ablehnen, Stornieren |
| `/admin/organizer-applications` | Liste, Detail, Genehmigen, Ablehnen |
| `/admin/users` | Liste, Einladen, Detail, Aktualisieren, Löschen, Passwort |
| `/admin/categories` | Vollständiges CRUD |
| `/admin/notifications` | Warteschlange für prüfpflichtige Benachrichtigungen |

### Weitere Endpunkte

- `/api/uploadthing` – `profileImage` (1 Bild, 4 MB), `eventImage` (5 Bilder, 8 MB), `socialImage` (1 Bild, 8 MB)
- `/api/v1/uploads` und `/images` – statische Dateien, unter anderem Mail-Assets
- Next.js-Routen im Client: `/api/geocode` und `/api/places` als Proxy zu OpenStreetMap Nominatim

Die KI-Suche antwortet mit `type: "question"`, solange Pflichtangaben fehlen, und mit `type: "ready"` plus Event-DTOs, sobald die Filter vollständig sind. Der Zwischenstand liegt 30 Minuten in Redis unter `conversation:<id>`.

### Echtzeit

Socket-Ereignisse im Server:

- `update_path`, `user_action` – Aktivität für das Admin-Live-Widget, Puffer von 50 Einträgen
- `online_users_update`, `activity_snapshot`, `new_activity` – an `admins_room`
- `request_chat_session`, `request_support`, `send_message` – Support- und Direktchat
- `notification:new` – an den Raum der Empfängerin oder des Empfängers, nachdem die Benachrichtigung in MongoDB steht

### Zeitjobs

| Job | Zeitplan | Wirkung |
| --- | --- | --- |
| Eventstatus | täglich 00:00 | Vergangene `approved`-Events werden `completed` |
| Teilnehmer-Erinnerung | täglich 00:05 | Benachrichtigung `event_reminder` an bestätigte Teilnehmer von morgen |
| Organisator-Vorbereitung | täglich 00:00 | Zusammenfassung für Events von morgen |
| Niedrige Kapazität | täglich 10:00 | Hinweis, wenn die Kapazität nicht gefüllt ist; Markierung `low_capacity_3day` verhindert Wiederholungen |
| Event-Nachbereitung | jede volle Stunde | `post_event_summary` |

## 8. Zentrale Entwicklungsaufgaben und Lösungen

Die folgenden Punkte sind im Code und in den Arbeitsnotizen nachvollziehbar.

### Teilnahme ohne Überbuchung

Ein vorheriges Lesen und anschließendes Schreiben würde bei zwei gleichzeitigen Beitritten die Kapazität überschreiten können. Der Beitritt prüft Status, Duplikat und Restplätze im Filter von `findOneAndUpdate` und erhöht `capacity.current` mit `$inc`. Dieselbe Atomarität gilt für das Verlassen.

### Freigaben und Rollenwechsel

Eine Bewerbung ist eine Zustandsmaschine mit `statusHistory`. Die Genehmigung legt eine Institution mit eindeutigem Slug an, setzt die Rolle auf `organizer`, verknüpft `institutionId` und löscht das Refresh-Token. Ablehnung und Storno von Events verlangen einen Grund und lösen E-Mail plus In-App-Benachrichtigung aus. Mailfehler dürfen die Statusänderung nicht zurückrollen; sie werden abgefangen.

### Benachrichtigungen ohne den Hauptvorgang zu blockieren

Kommentare, Erwähnungen, neue Events in der Nähe und Absagen erzeugen Benachrichtigungen nach dem erfolgreichen Speichern. Einzelversand und `insertMany` sind von den Fachcontrollern getrennt. Socket-Versand darf die REST-Antwort nicht scheitern lassen: zuerst Datenbank, danach Emit. Fällt die Verbindung aus, bleibt die Benachrichtigung über `GET /notifications` lesbar.

Das Frontend schreibt eingehende Socket-Nachrichten mit `setQueryData` in den TanStack-Cache, statt alle Clients neu laden zu lassen. Ist der Socket getrennt, pollt der Ungelesen-Zähler alle 30 Sekunden. Bei HTTP 401 und 403 wird nicht erneut versucht.

### Idempotenz der Cronjobs

Erinnerungen mit einem exakten Kalendertag würden nach einem Serverausfall verloren gehen oder am nächsten Tag doppelt versendet. `systemNotificationSent` am Event speichert bereits gesendete Typen. Abfragen nutzen `$nin`, Markierungen `$addToSet`. Die Niedrig-Kapazität-Prüfung vergleicht zwei Dokumentfelder mit `$expr`.

### Öffentliche Eventliste und Filter

Die Liste soll suchmaschinenlesbar bleiben und trotzdem beim Scrollen nachladen. Die erste Seite kommt vom Server mit Cache-Tag `events`; `useInfiniteEvents` hängt weitere Seiten an. Filter stehen in der URL (`router.replace`, damit die Zurück-Taste nicht jeden Klick speichert). Kategorie, Organisatorrolle, Altersgruppe und Koordinaten werden im Event-Controller in denselben `customFilter` übersetzt.

Ortsnamen laufen nicht direkt vom Browser zu Nominatim. Next.js stellt `/api/geocode` und `/api/places` dazwischen. Die Umkreissuche schreibt `lat`, `lng` und `radius` gemeinsam in die URL und nutzt den vorhandenen `2dsphere`-Index.

### Sitzung über den Seitenwechsel

Das Access-Token liegt nicht im Cookie. Nach einem Reload kennt das Frontend den Nutzer erst nach `POST /auth/refresh`. `isReady` bleibt so lange falsch, und `RequireAuth` leitet nicht voreilig auf die Anmeldung um. Dieselbe Mechanik schützt das Admin-Panel; der Test mockt Zustand und die Weiterleitung.

### Uploads und Eigentum

Event- und Beitragsbilder werden vor dem Speichern des Formulars hochgeladen. Der Client kann den Server-Typ von UploadThing nicht importieren, weil `client` und `server` getrennte TypeScript-Projekte sind. Der Client beschreibt die Route deshalb lokal und sendet das Bearer-Token außerhalb des normalen API-Wrappers. Serverseitig bleiben Dateigröße, Anzahl und Eigentumsprüfung verbindlich.

### KI an drei Stellen

1. **Eventsuche:** Gemini extrahiert Alter, Datum, Stadt, Preis und Umgebung. Fehlende Pflichtfelder führen zu einer Rückfrage. Redis hält den Stand. Die eigentliche Suche bleibt eine MongoDB-Abfrage über `buildAiEventSearchFilter`, keine freie Textantwort über Events.
2. **Risikoberichte:** Groq bewertet neue Veranstalterbewerbungen (`LOW`/`MEDIUM`/`HIGH`) und neue Events. Das Ergebnis wird in `aiAnalysis` gespeichert und ersetzt die Admin-Entscheidung nicht.
3. **Support-Agent:** Groq beantwortet Kitzaa-Fragen auf Deutsch. Bei Freigabe, Beschwerde, Ablehnung oder dem Wunsch nach einer Person ruft das Tool `transferToAdmin` auf. Gespräch und Nachrichten liegen in `Conversation` und `Message`.

### Admin-Kanban

Ein einzelner Infinite-Query mit mehreren Statuswerten im selben Filter lieferte durch sich überschneidende MongoDB-Bedingungen leere Spalten. Jede Kanban-Spalte lädt ihren Status eigenen Query. Die Popover-Auswahl schaltet Spalten über `enabled` ab, statt denselben Status doppelt an die API zu senden. Suche ist entprellt und wird als `search[...]` an den Query-Handler gegeben.

### Weitere im Code sichtbare Schutzmaßnahmen

- Passwortrichtlinie: 8 bis 64 Zeichen, Groß- und Kleinbuchstabe, Zahl, Sonderzeichen.
- Rate Limit auf `/api/v1` (5000 Anfragen je 15 Minuten und IP) und ein strengeres Limit auf der KI-Suche.
- CORS nur für `CLIENT_URL`, `ADMIN_URL`, `localhost:3000` und `localhost:3001`.
- Rich Text wird vor der Anzeige sanitized.
- Postleitzahlen im Registrierungs- und Einrichtungsformular werden über `api.zippopotam.us/de/{plz}` in Stadt und Bundesland aufgelöst. Stadt, PLZ und Bundesland bleiben Pflicht.

## 9. Teambeiträge

Es gibt keine einzelne Teamdatei mit einer Aufgabenverteilung. Belegt sind die Git-Autoren und die persönlichen Notizen `server/Duygu.md`, `client/Duygu-frontend.md`, `client/Ayla-frontend.md`, `server/Elif.md`, `client/Elif.client.md` und `admin/adminnotlari.md`. Commit-Zahlen sind `git shortlog -sn --all`. Dieselben Personen erscheinen unter mehreren Schreibweisen.

| Git-Autor | Commits |
| --- | ---: |
| Elif Yuzer | 207 |
| ELİF YÜZER | 44 |
| Aylaataydir | 150 |
| cankurtduygu | 124 |
| Duygu cankurt | 103 |

Zusammengefasst nach Namensvarianten: Elif 251 Commits, Duygu 227 Commits, Ayla 150 Commits.

### Duygu

`server/Duygu.md` dokumentiert den Entwurf der Veranstalterbewerbung: getrennte Modelle `OrganizerApplication` und `Institution`, Standardrolle bei der Registrierung, spätere Rollenanhebung erst nach Admin-Freigabe. Dieser Ablauf ist in Modell, Controller und Admin-Genehmigung umgesetzt.

`client/Duygu-frontend.md` dokumentiert die Refresh-Architektur (`isReady`, kein vorzeitiger Redirect), den Passwort-vergessen-Ablauf und die Korrektur einer React-Hooks-Reihenfolge auf der Social-Seite.

### Ayla

`client/Ayla-frontend.md` dokumentiert die Nutzeroberfläche der Events: Theme über `next-themes` ohne das Layout zu einem Client Component zu machen, Registrierung mit Zippopotam und Stepper, URL-basierte Filter, Nominatim-Proxy, Umkreissuche, hybrides SSR plus Infinite Scroll, optimistisches Speichern über Zustand und das Erstellen von Events inklusive UploadThing.

### Elif

`server/Elif.md` dokumentiert das Benachrichtigungssystem, die Cronjobs, DTO-Trennung für Admin und Nutzer, Bulk-Inserts, die Service-Schicht und Socket.IO (HTTP-Server-Wrapping, Handshake-Auth, Räume `user:<id>`, Singleton `socketManager`, Emit erst nach dem Datenbankschreiben).

`client/Elif.client.md` dokumentiert die Benachrichtigungsglocke, Deep Links auf Event-Slugs und Beiträge, den Socket-Provider und den Polling-Fallback.

`admin/adminnotlari.md` dokumentiert das Admin-Panel: Route-Guard, Kanban, wiederverwendbare Schublade, Suche, Filter, spaltenweises Infinite Scroll, Nutzer- und Kategorietabellen sowie das Live-Dashboard über Socket und Zustand.

## 10. Abgrenzung für die Präsentation

Diese Punkte sind im Repository sichtbar und sollten nicht als fertige Produktfunktionen vorgestellt werden:

- Google-Anmeldung ist nur ein Button ohne Handler.
- Die E-Mail-Pflicht beim Login ist auskommentiert. Sie gilt für die Veranstalterbewerbung.
- Forum und Activities aus dem frühen Backend-README haben keine Implementierung. `savedActivities` verweist auf ein nicht vorhandenes Modell.
- `GET /api/v1/notifications/test-post-event-summary` ist ein ungeschützter Testaufruf eines Cronjobs.
- Die Statuswerte `under_review` und `needs_more_info` existieren im Bewerbungsmodell. Die Admin-Oberfläche genehmigt und lehnt ab; ein eigener Übergang in diese Zwischenstatus ist in den Admin-Routen nicht als eigene Aktion angelegt.
- Die Automatischen Tests decken Slugify, das User-Schema, zwei KI-Helfer und den Admin-Route-Guard ab. Fachliche Flows wie Beitritt, Bewerbung und Autorisierung haben keine vergleichbare Testdatei.

Damit beschreibt diese Übersicht den Stand, den das Repository tatsächlich enthält: eine deutschsprachige Familien-Eventplattform mit getrennten Oberflächen für Teilnehmende und Administration, rollenbasierter API, Moderationsworkflow und ergänzender KI-Suche.
