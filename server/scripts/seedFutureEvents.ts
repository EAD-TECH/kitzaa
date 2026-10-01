import "dotenv/config";
import dayjs from "dayjs";
import { dbConnection, mongoose } from "../src/configs/dbConnection.js";
import Event from "../src/models/eventModel.js";
import EventCategory from "../src/models/eventCategoryModel.js";
import User from "../src/models/userModel.js";
import type { AgeRange, EventLocationType } from "../src/types/event.types.js";

// ~1 yıl sonrasına (Eyl–Kas 2027) tarihli, 30 farklı Alman şehrinde, tamamen Almanca mock event'ler:
// 20 tanesi organizer'lar, 10 tanesi normal kullanıcılar (ebeveynler) tarafından oluşturulmuş.
// Her event client'taki createEventSchema'nın istediği tüm alanları içerir.
// Görseller Unsplash'tan (Unsplash License, ticari kullanım serbest) — tek tek içeriğe uygunluğu kontrol edildi.
//
// Çalıştırma (server/ içinden):  npx tsx scripts/seedFutureEvents.ts
// Önkoşul: seedCategories.ts çalışmış olmalı. Seed kullanıcıları yoksa bu script oluşturur.
// Idempotent: aynı başlıklı event'leri silip yeniden oluşturur, kullanıcıları ise tekrar oluşturmaz.

const SEED_PASSWORD = "Kitzaa2026!";

type SeedUser = {
  firstName: string;
  lastName: string;
  location: { state: string; city: string; zipCode: string };
};

const ORGANIZERS: SeedUser[] = [
  { firstName: "Katharina", lastName: "Vogel", location: { state: "Hamburg", city: "Hamburg", zipCode: "20095" } },
  { firstName: "Stefan", lastName: "Hartmann", location: { state: "Bayern", city: "München", zipCode: "80331" } },
  { firstName: "Julia", lastName: "Baumann", location: { state: "Nordrhein-Westfalen", city: "Köln", zipCode: "50667" } },
  { firstName: "Matthias", lastName: "Keller", location: { state: "Sachsen", city: "Leipzig", zipCode: "04109" } },
  { firstName: "Sabine", lastName: "Lorenz", location: { state: "Baden-Württemberg", city: "Freiburg im Breisgau", zipCode: "79098" } },
];

// Normal (role: "user") ebeveynler — kendi mahallelerinde küçük, topluluk tarzı event'ler açıyorlar.
const PARENT_USERS: SeedUser[] = [
  { firstName: "Anna", lastName: "Wendt", location: { state: "Rheinland-Pfalz", city: "Mainz", zipCode: "55118" } },
  { firstName: "Tobias", lastName: "Krämer", location: { state: "Baden-Württemberg", city: "Mannheim", zipCode: "68163" } },
  { firstName: "Laura", lastName: "Engel", location: { state: "Bayern", city: "Regensburg", zipCode: "93059" } },
  { firstName: "Daniel", lastName: "Brandt", location: { state: "Thüringen", city: "Erfurt", zipCode: "99096" } },
  { firstName: "Miriam", lastName: "Seidel", location: { state: "Schleswig-Holstein", city: "Lübeck", zipCode: "23570" } },
];

const unsplash = (photo: string) => `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=1600&q=80`;

type FutureEventSeed = {
  title: string;
  description: string;
  category: string;
  locationType: EventLocationType;
  ageRange: AgeRange;
  isFree: boolean;
  price?: number;
  startDate: string; // YYYY-MM-DD
  endDate?: string;
  startTime: string;
  endTime: string;
  recurrenceRule?: "weekly" | "monthly";
  capacity: number;
  location: {
    venueName: string;
    addressLine: string;
    city: string;
    state: string;
    zipCode: string;
    lat: number;
    lng: number;
  };
  coverImage: string;
  images: string[];
  // Oluşturan kullanıcının username'i. Verilmezse event kendi grubunda sırayla bir kullanıcıya atanır.
  creator?: string;
};

// "Krämer" → "kraemer": username/e-posta ASCII kalsın (login'de yazması kolay, mail sunucularıyla uyumlu).
const toUsername = (u: SeedUser) =>
  `${u.firstName}.${u.lastName}`
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss");

const EVENTS: FutureEventSeed[] = [
  {
    title: "Sternenabend: Astronomie für kleine Entdecker",
    description:
      "Wie weit ist der Mond entfernt? Warum funkeln Sterne? An diesem Abend gehen junge Himmelsforscher gemeinsam mit erfahrenen Astronominnen und Astronomen auf eine Reise durch unser Sonnensystem.\nNach einer kindgerechten Einführung im Vortragssaal geht es auf die Beobachtungsterrasse: Bei klarem Himmel schauen wir durch große Teleskope auf Mondkrater, Saturnringe und ferne Sternhaufen. Bei Bewölkung zeigen wir die Highlights in einer spannenden Live-Show.\nBitte warme Kleidung mitbringen. Jedes Kind erhält eine drehbare Sternkarte zum Mitnehmen.",
    category: "Bildung",
    locationType: "indoor",
    ageRange: "7-10",
    isFree: false,
    price: 9,
    startDate: "2027-10-08",
    startTime: "18:30",
    endTime: "20:30",
    capacity: 40,
    location: { venueName: "Archenhold-Sternwarte", addressLine: "Alt-Treptow 1", city: "Berlin", state: "Berlin", zipCode: "12435", lat: 52.4857, lng: 13.4757 },
    coverImage: unsplash("photo-1582594657903-96b4ba495d4d"),
    images: [unsplash("photo-1758624723522-7e9f9313386e"), unsplash("photo-1750622003734-22f4be859201")],
  },
  {
    title: "Hafenrallye für junge Entdecker",
    description:
      "Ahoi! Bei dieser Rallye rund um die Landungsbrücken erkunden Familien den Hamburger Hafen auf eigene Faust. Mit einer Schatzkarte in der Hand lösen die Teams knifflige Rätsel über Containerschiffe, Leuchttürme und die Geschichte der Speicherstadt.\nAn sechs Stationen warten kleine Aufgaben: Seemannsknoten binden, Flaggensignale entschlüsseln und Schiffe im Hafenbecken zählen. Zum Abschluss gibt es für alle Teilnehmenden eine Urkunde als „Kleine Hafenkapitänin“ oder „Kleiner Hafenkapitän“.\nDie Strecke ist kinderwagentauglich und etwa drei Kilometer lang.",
    category: "Familie",
    locationType: "outdoor",
    ageRange: "all-ages",
    isFree: true,
    startDate: "2027-09-25",
    startTime: "11:00",
    endTime: "14:00",
    capacity: 80,
    location: { venueName: "St. Pauli Landungsbrücken", addressLine: "St. Pauli-Landungsbrücken 1", city: "Hamburg", state: "Hamburg", zipCode: "20359", lat: 53.5456, lng: 9.969 },
    coverImage: unsplash("photo-1671190363850-6c0d53346d3d"),
    images: [unsplash("photo-1698381920406-4ebfce42a37d")],
  },
  {
    title: "Kürbisschnitzen im Englischen Garten",
    description:
      "Der Herbst ist da – und mit ihm die schönste Kürbiszeit! Gemeinsam schnitzen wir unter freiem Himmel fröhliche, gruselige und kreative Kürbisgesichter.\nKürbisse, kindersichere Schnitzwerkzeuge und Vorlagen stellen wir bereit. Die Kleinen malen ihre Motive vor, die Großen helfen beim Aushöhlen. Aus dem Fruchtfleisch kochen wir anschließend gemeinsam eine wärmende Kürbissuppe.\nZum Abschluss stellen wir alle Kürbisse mit Teelichtern auf – ein wunderschönes Fotomotiv in der Abenddämmerung. Die fertigen Kunstwerke dürfen natürlich mit nach Hause.",
    category: "Feste & Feiern",
    locationType: "outdoor",
    ageRange: "4-6",
    isFree: false,
    price: 7,
    startDate: "2027-10-30",
    startTime: "14:00",
    endTime: "17:30",
    capacity: 35,
    location: { venueName: "Englischer Garten – Chinesischer Turm", addressLine: "Englischer Garten 3", city: "München", state: "Bayern", zipCode: "80538", lat: 48.1535, lng: 11.5919 },
    coverImage: unsplash("photo-1703237390683-64e277f44fbd"),
    images: [unsplash("photo-1635632919713-2a17877a7c8d"), unsplash("photo-1698583269740-966a35796db7")],
  },
  {
    title: "Töpferwerkstatt: Mein erstes Tongefäß",
    description:
      "Matschige Hände ausdrücklich erwünscht! In unserer Werkstatt in Ehrenfeld lernen Kinder, wie aus einem Klumpen Ton eine eigene Schale, Tasse oder ein kleines Tier entsteht.\nUnsere Keramikerin zeigt Schritt für Schritt die wichtigsten Techniken: Daumenschale, Wulsttechnik und – für die Mutigen – die ersten Versuche an der Töpferscheibe. Anschließend werden die Werke mit bunten Glasuren bemalt.\nDie Stücke werden bei uns gebrannt und können nach etwa zwei Wochen abgeholt werden. Material, Brand und Schürzen sind im Preis enthalten.",
    category: "Kreativität",
    locationType: "indoor",
    ageRange: "7-10",
    isFree: false,
    price: 16,
    startDate: "2027-10-16",
    startTime: "10:00",
    endTime: "12:30",
    capacity: 12,
    location: { venueName: "Tonwerk Ehrenfeld", addressLine: "Venloer Straße 405", city: "Köln", state: "Nordrhein-Westfalen", zipCode: "50825", lat: 50.9489, lng: 6.9161 },
    coverImage: unsplash("photo-1470487274665-5c67dce2beca"),
    images: [unsplash("photo-1637548580984-10c48d61b168"), unsplash("photo-1753164725860-ffcd260b7b32")],
  },
  {
    title: "Experimentierlabor: Kleine Chemiker",
    description:
      "Es blubbert, zischt und leuchtet! Im Experimentierlabor schlüpfen Kinder in Laborkittel und Schutzbrille und führen unter Anleitung echte Experimente durch.\nWir bauen einen Vulkan aus Backpulver, lassen Rotkohlsaft seine Farbe wechseln und stellen Schleim nach eigenem Rezept her. Dabei lernen die Kinder spielerisch, was Säuren, Basen und chemische Reaktionen sind.\nAlle Versuche sind ungefährlich und werden von Naturwissenschaftlerinnen betreut. Zum Schluss nimmt jedes Kind ein kleines Forscherheft mit Experimenten für zu Hause mit.",
    category: "Bildung",
    locationType: "indoor",
    ageRange: "10-14",
    isFree: false,
    price: 12,
    startDate: "2027-10-23",
    startTime: "13:00",
    endTime: "16:00",
    capacity: 20,
    location: { venueName: "Experiminta ScienceCenter", addressLine: "Hamburger Allee 22-24", city: "Frankfurt am Main", state: "Hessen", zipCode: "60486", lat: 50.1163, lng: 8.648 },
    coverImage: unsplash("photo-1633828763399-e29f1cd3f4c1"),
    images: [unsplash("photo-1758685734153-132c8620c1bd"), unsplash("photo-1778513599495-6bba02a83e39")],
  },
  {
    title: "Zoo-Safari: Tiere im Herbst",
    description:
      "Was machen Seelöwen, Erdmännchen und Elefanten, wenn es draußen kühler wird? Bei unserer geführten Familien-Safari durch die Wilhelma erfahren kleine Tierfreunde spannende Geschichten aus dem Zooalltag.\nEine Zoopädagogin führt die Gruppe zu ausgewählten Gehegen, erklärt, wie sich Tiere auf den Winter vorbereiten, und beantwortet alle Fragen. Bei der Seelöwen-Fütterung sind wir hautnah dabei.\nDer Rundgang dauert etwa zwei Stunden. Der Eintritt in den Zoo ist im Preis enthalten.",
    category: "Natur",
    locationType: "outdoor",
    ageRange: "4-6",
    isFree: false,
    price: 8,
    startDate: "2027-10-09",
    startTime: "10:30",
    endTime: "12:30",
    capacity: 25,
    location: { venueName: "Wilhelma – Zoologisch-Botanischer Garten", addressLine: "Wilhelma 13", city: "Stuttgart", state: "Baden-Württemberg", zipCode: "70376", lat: 48.8047, lng: 9.2069 },
    coverImage: unsplash("photo-1645543336753-55609372c25e"),
    images: [unsplash("photo-1681327503759-c0b64aa039ad"), unsplash("photo-1640831981953-ad9a6c06fcac")],
  },
  {
    title: "Familienkonzert: Peter und der Wolf",
    description:
      "Sergei Prokofjews musikalisches Märchen ist der perfekte Einstieg in die Welt der klassischen Musik. Jedes Tier hat sein eigenes Instrument: die Flöte ist der Vogel, die Oboe die Ente und die Hörner sind der Wolf.\nEine Erzählerin führt lebendig durch die Geschichte, während das Orchester spielt. Vor dem Konzert können Kinder im Foyer die Instrumente aus der Nähe ansehen und sogar selbst ausprobieren.\nDas Konzert dauert etwa 60 Minuten ohne Pause und ist für Kinder ab 4 Jahren sowie ihre Familien geeignet.",
    category: "Musik & Kultur",
    locationType: "indoor",
    ageRange: "all-ages",
    isFree: false,
    price: 10,
    startDate: "2027-11-07",
    startTime: "11:00",
    endTime: "12:00",
    capacity: 300,
    location: { venueName: "Tonhalle Düsseldorf", addressLine: "Ehrenhof 1", city: "Düsseldorf", state: "Nordrhein-Westfalen", zipCode: "40479", lat: 51.232, lng: 6.776 },
    coverImage: unsplash("photo-1519682718457-c82ce8296645"),
    images: [unsplash("photo-1719753458800-c09cfb167ac5"), unsplash("photo-1745328599617-5c9796ca4d71")],
  },
  {
    title: "Backstube: Herbstlicher Apfelkuchen",
    description:
      "Wenn es draußen nach Herbst duftet, ist Zeit für Apfelkuchen! In unserer Kinder-Backstube backen kleine Bäckerinnen und Bäcker ihren eigenen Apfelkuchen – vom Teig bis zur Streuselkrone.\nWir waschen und schneiden regionale Äpfel, kneten Mürbeteig, wiegen Zutaten ab und lernen dabei ganz nebenbei ein bisschen Mathe. Während die Kuchen im Ofen sind, basteln wir Rezeptkarten zum Mitnehmen.\nJedes Kind nimmt einen kleinen Kuchen mit nach Hause. Bitte informiert uns vorab über Allergien – eine glutenfreie Variante ist möglich.",
    category: "Essen & Trinken",
    locationType: "indoor",
    ageRange: "7-10",
    isFree: false,
    price: 14,
    startDate: "2027-10-02",
    startTime: "14:00",
    endTime: "16:30",
    capacity: 14,
    location: { venueName: "Kinderbackstube Südvorstadt", addressLine: "Karl-Liebknecht-Straße 55", city: "Leipzig", state: "Sachsen", zipCode: "04275", lat: 51.3237, lng: 12.3746 },
    coverImage: unsplash("photo-1630464061996-f09350430e86"),
    images: [unsplash("photo-1570299882315-c4c41c78292c"), unsplash("photo-1631224096135-cf6d76693bf9")],
  },
  {
    title: "Laternenumzug durch den Großen Garten",
    description:
      "Ich geh mit meiner Laterne … Zum Martinsfest ziehen wir gemeinsam mit leuchtenden Laternen durch den Großen Garten. Eine kleine Blaskapelle begleitet den Umzug mit den bekannten Laternenliedern.\nTreffpunkt ist am Palais im Großen Garten. Wer noch keine Laterne hat, kann ab 16 Uhr an unserem Bastelstand eine eigene gestalten. Nach dem Umzug gibt es am Lagerfeuer Kinderpunsch und frisch gebackene Martinshörnchen.\nDie Veranstaltung ist kostenlos, eine Anmeldung hilft uns bei der Planung. Bitte an wetterfeste Kleidung denken.",
    category: "Feste & Feiern",
    locationType: "outdoor",
    ageRange: "all-ages",
    isFree: true,
    startDate: "2027-11-11",
    startTime: "17:00",
    endTime: "19:00",
    capacity: 250,
    location: { venueName: "Palais im Großen Garten", addressLine: "Hauptallee 22", city: "Dresden", state: "Sachsen", zipCode: "01219", lat: 51.0381, lng: 13.7627 },
    coverImage: unsplash("photo-1742295301787-a248a1b2e5ce"),
    images: [unsplash("photo-1742295301784-eb8a71c25c2d"), unsplash("photo-1765290299563-e74ac6d7a85c")],
  },
  {
    title: "Spielzeug von früher: Museumsführung",
    description:
      "Womit haben eigentlich Oma und Uroma gespielt? Im Spielzeugmuseum entdecken Kinder Holzeisenbahnen, Blechfiguren, Puppenstuben und Baukästen aus über 200 Jahren Nürnberger Spielzeuggeschichte.\nDie Führung ist interaktiv: Die Kinder dürfen Repliken historischer Spielzeuge anfassen und ausprobieren. Im Anschluss bauen wir im Museumsatelier ein eigenes kleines Holzspielzeug, das mit nach Hause genommen werden darf.\nEltern begleiten ihre Kinder während der gesamten Führung.",
    category: "Musik & Kultur",
    locationType: "indoor",
    ageRange: "4-6",
    isFree: false,
    price: 5,
    startDate: "2027-11-13",
    startTime: "10:00",
    endTime: "12:00",
    capacity: 18,
    location: { venueName: "Spielzeugmuseum Nürnberg", addressLine: "Karlstraße 13-15", city: "Nürnberg", state: "Bayern", zipCode: "90403", lat: 49.4546, lng: 11.0752 },
    coverImage: unsplash("photo-1505003098838-83ce5356c228"),
    images: [unsplash("photo-1714618888538-8d15a9228236"), unsplash("photo-1568828668638-b1b4014d91a2")],
  },
  {
    title: "Musikgarten für die Allerkleinsten",
    description:
      "Singen, klatschen, rasseln: Im Musikgarten erleben Babys und Kleinkinder gemeinsam mit einem Elternteil die Welt der Klänge. Mit einfachen Liedern, Fingerspielen und Bewegungsreimen fördern wir Sprache, Rhythmusgefühl und Bindung.\nWir nutzen kindgerechte Instrumente wie Glockenspiele, Trommeln und Rasseln, die die Kleinen frei erkunden dürfen. Jede Stunde endet mit einem ruhigen Schlaflied zum Entspannen.\nDer Kurs findet wöchentlich statt, ein Einstieg ist jederzeit möglich. Bitte rutschfeste Socken und eine Decke mitbringen.",
    category: "Musik & Kultur",
    locationType: "indoor",
    ageRange: "0-3",
    isFree: false,
    price: 7,
    startDate: "2027-09-29",
    endDate: "2027-11-17",
    startTime: "09:30",
    endTime: "10:15",
    recurrenceRule: "weekly",
    capacity: 10,
    location: { venueName: "Familienzentrum List", addressLine: "Podbielskistraße 30", city: "Hannover", state: "Niedersachsen", zipCode: "30163", lat: 52.3869, lng: 9.7545 },
    coverImage: unsplash("photo-1504484656217-38f8ffc617f9"),
    images: [unsplash("photo-1509781827353-fb95c262fc40")],
  },
  {
    title: "Drachenfest auf dem Stadtwerder",
    description:
      "Der Herbstwind ist perfekt – lasst die Drachen steigen! Auf den weiten Wiesen des Stadtwerders feiern wir zwei Tage lang das große Bremer Drachenfest.\nIn der Drachenwerkstatt bauen Kinder mit Unterstützung ihren eigenen Drachen aus Stäben, Papier und Schnur. Profi-Drachenflieger zeigen spektakuläre Lenkdrachen und riesige Figuren am Himmel. Für Hunger und Durst sorgen Stände mit Waffeln und heißem Kakao.\nDie Teilnahme ist kostenlos, Material für die Drachenwerkstatt ist vorhanden. Eigene Drachen dürfen gerne mitgebracht werden.",
    category: "Familie",
    locationType: "outdoor",
    ageRange: "all-ages",
    isFree: true,
    startDate: "2027-10-02",
    endDate: "2027-10-03",
    startTime: "11:00",
    endTime: "17:00",
    capacity: 400,
    location: { venueName: "Stadtwerder Wiesen", addressLine: "Werderstraße 1", city: "Bremen", state: "Bremen", zipCode: "28199", lat: 53.068, lng: 8.813 },
    coverImage: unsplash("photo-1650790587165-7a92b02b4eaa"),
    images: [unsplash("photo-1554234742-92481f1e2e9a"), unsplash("photo-1759846865683-b66e59f48a9c")],
  },
  {
    title: "Waldabenteuer im Schwarzwald",
    description:
      "Raus aus dem Alltag, rein in den Wald! Mit einer Waldpädagogin erkunden Kinder den herbstlichen Schwarzwald rund um das Waldhaus Freiburg.\nWir bauen gemeinsam ein Waldsofa, lernen Tierspuren zu lesen, suchen Käfer mit der Becherlupe und erfahren, warum Blätter im Herbst ihre Farbe wechseln. Beim Waldspiel „Fuchs und Hase“ ist Bewegung garantiert.\nBitte festes Schuhwerk, wetterfeste Kleidung und ein kleines Vesper mitbringen. Die Veranstaltung findet bei jedem Wetter statt.",
    category: "Natur",
    locationType: "outdoor",
    ageRange: "7-10",
    isFree: true,
    startDate: "2027-10-17",
    startTime: "10:00",
    endTime: "13:00",
    capacity: 20,
    location: { venueName: "Waldhaus Freiburg", addressLine: "Wonnhaldestraße 6", city: "Freiburg im Breisgau", state: "Baden-Württemberg", zipCode: "79100", lat: 47.9785, lng: 7.8667 },
    coverImage: unsplash("photo-1638202951770-2240942c7d1c"),
    images: [unsplash("photo-1752862099580-ce0365ebbb14")],
  },
  {
    title: "Elternabend: Gelassen durch die Trotzphase",
    description:
      "Wutanfälle im Supermarkt, Tränen beim Zähneputzen, ein lautes „Nein!“ zu allem: Die Autonomiephase gehört zur gesunden Entwicklung – und bringt Eltern trotzdem oft an ihre Grenzen.\nIn diesem Workshop erklärt eine erfahrene Familienberaterin, was im Kopf eines Kleinkindes passiert, und zeigt alltagstaugliche Strategien für mehr Gelassenheit. Anhand von Beispielen aus dem Familienalltag üben wir, Grenzen liebevoll und klar zu setzen.\nDer Abend richtet sich an Eltern von Kindern zwischen 1,5 und 5 Jahren. Es gibt genug Raum für eigene Fragen und den Austausch mit anderen Eltern.",
    category: "Bildung",
    locationType: "indoor",
    ageRange: "parents",
    isFree: false,
    price: 20,
    startDate: "2027-10-14",
    startTime: "19:00",
    endTime: "21:00",
    capacity: 30,
    location: { venueName: "Familienbildungsstätte Altstadt", addressLine: "Plöck 32", city: "Heidelberg", state: "Baden-Württemberg", zipCode: "69117", lat: 49.4088, lng: 8.696 },
    coverImage: unsplash("photo-1655337690446-e10ecbe6541c"),
    images: [unsplash("photo-1772419186959-fdb8cc37e149")],
  },
  {
    title: "Familien-Radtour rund um den Aasee",
    description:
      "Münster ist die Fahrradhauptstadt Deutschlands – und was passt besser als eine gemeinsame Familien-Radtour? Die gemütliche Runde führt uns einmal um den Aasee und durch die angrenzenden Parkanlagen.\nUnterwegs machen wir Halt an den Riesenkugeln, am Allwetterzoo und an einem Spielplatz. Ein Verkehrstrainer gibt zu Beginn Tipps zur Fahrradsicherheit und prüft Bremsen und Licht.\nDie Strecke ist ca. 12 km lang, flach und auch für Kinder mit eigenem Rad ab etwa 6 Jahren geeignet. Kindersitze und Anhänger sind natürlich willkommen. Helmpflicht für alle Kinder.",
    category: "Sport",
    locationType: "outdoor",
    ageRange: "all-ages",
    isFree: true,
    startDate: "2027-09-26",
    startTime: "10:00",
    endTime: "13:00",
    capacity: 50,
    location: { venueName: "Aasee – Treffpunkt Goldene Brücke", addressLine: "Annette-Allee 1", city: "Münster", state: "Nordrhein-Westfalen", zipCode: "48149", lat: 51.9557, lng: 7.6117 },
    coverImage: unsplash("photo-1717753045265-fa6ab160384a"),
    images: [unsplash("photo-1779990904164-91251947b8d0"), unsplash("photo-1763219805067-6b24e701acb9")],
  },
  {
    title: "Schlossgeschichten in Sanssouci",
    description:
      "Wer war eigentlich Friedrich der Große, und warum liebte er Kartoffeln und Windhunde? Bei dieser Kinderführung durch den Park Sanssouci werden Geschichten aus dem Leben am preußischen Königshof lebendig.\nVerkleidet mit Dreispitz und Umhang wandeln die Kinder über die berühmten Weinbergterrassen, entdecken versteckte Statuen und lösen am Ende ein Schlossrätsel. Natürlich legen wir – wie es Tradition ist – eine Kartoffel auf das Grab des Königs.\nDie Führung findet komplett im Freien statt und dauert etwa 90 Minuten.",
    category: "Musik & Kultur",
    locationType: "outdoor",
    ageRange: "7-10",
    isFree: false,
    price: 6,
    startDate: "2027-10-10",
    startTime: "14:00",
    endTime: "15:30",
    capacity: 25,
    location: { venueName: "Park Sanssouci – Besucherzentrum Historische Mühle", addressLine: "Maulbeerallee 1", city: "Potsdam", state: "Brandenburg", zipCode: "14469", lat: 52.4043, lng: 13.0384 },
    coverImage: unsplash("photo-1664019323636-a9fa354d011c"),
    images: [unsplash("photo-1715711445589-7b83acc7281c"), unsplash("photo-1747119361510-5c9bcf4137bf")],
  },
  {
    title: "Strandsport-Tag in Warnemünde",
    description:
      "Sand unter den Füßen, Ostseewind in den Haaren: Beim Strandsport-Tag in Warnemünde messen sich Jugendliche in Beachvolleyball, Strandfußball und Frisbee.\nTrainerinnen und Trainer des örtlichen Sportvereins zeigen Techniken und Spielzüge, danach werden gemischte Teams für ein kleines Turnier gebildet. Es geht nicht ums Gewinnen, sondern um Teamgeist und Spaß an der Bewegung.\nWasser und Obst werden gestellt. Bitte Sonnenschutz, Sportkleidung und ein Handtuch mitbringen. Bei Sturm weichen wir in die Sporthalle aus.",
    category: "Sport",
    locationType: "outdoor",
    ageRange: "10-14",
    isFree: true,
    startDate: "2027-09-25",
    startTime: "10:00",
    endTime: "15:00",
    capacity: 60,
    location: { venueName: "Strand Warnemünde – Aufgang 5", addressLine: "Seepromenade 1", city: "Rostock", state: "Mecklenburg-Vorpommern", zipCode: "18119", lat: 54.1797, lng: 12.0816 },
    coverImage: unsplash("photo-1639903293252-be7649fab563"),
    images: [unsplash("photo-1673058577973-68b6b6d53ccd"), unsplash("photo-1645398709708-eca899c71a11")],
  },
  {
    title: "Schnuppersegeln auf der Kieler Förde",
    description:
      "Einmal selbst an der Pinne sitzen! Beim Schnuppersegeln lernen Jugendliche in kleinen Jollen die Grundlagen des Segelns – begleitet von erfahrenen Segellehrerinnen im Motorboot.\nNach einer kurzen Theorie an Land (Wind, Kurse, Knoten) geht es aufs Wasser. Jedes Boot wird von zwei Kindern gesegelt, sodass sich alle abwechseln können. Rettungswesten und Neoprenanzüge werden gestellt.\nVoraussetzung: Die Teilnehmenden müssen sicher schwimmen können (mind. Bronze-Abzeichen). Bei zu starkem Wind findet ein Ersatzprogramm im Vereinsheim statt.",
    category: "Sport",
    locationType: "outdoor",
    ageRange: "10-14",
    isFree: false,
    price: 35,
    startDate: "2027-09-30",
    startTime: "14:00",
    endTime: "17:30",
    capacity: 12,
    location: { venueName: "Segelzentrum Kiellinie", addressLine: "Kiellinie 70", city: "Kiel", state: "Schleswig-Holstein", zipCode: "24105", lat: 54.3368, lng: 10.159 },
    coverImage: unsplash("photo-1601860750456-2a7fd1384772"),
    images: [unsplash("photo-1722108926463-143cc95275ee"), unsplash("photo-1689085383467-9c38681126d2")],
  },
  {
    title: "Kinderkochkurs: Gemüse-Pizza selbst gemacht",
    description:
      "Pizza mag jedes Kind – und selbst gemacht schmeckt sie am besten! In unserer Kinderküche kneten wir den Hefeteig, kochen eine fruchtige Tomatensoße und belegen die Pizza mit buntem Gemüse vom Markt.\nDabei lernen die Kinder, wie man sicher mit Messer und Reibe umgeht, welches Gemüse gerade Saison hat und warum Hefe den Teig aufgehen lässt. Während die Pizzen backen, decken wir gemeinsam einen schönen Tisch.\nAm Ende essen wir alle zusammen. Schürzen und Kochmützen werden gestellt, Allergien bitte vorab angeben.",
    category: "Essen & Trinken",
    locationType: "indoor",
    ageRange: "7-10",
    isFree: false,
    price: 12,
    startDate: "2027-11-06",
    startTime: "11:00",
    endTime: "13:30",
    capacity: 12,
    location: { venueName: "Kochschule Bonner Altstadt", addressLine: "Friedrichstraße 25", city: "Bonn", state: "Nordrhein-Westfalen", zipCode: "53111", lat: 50.7355, lng: 7.101 },
    coverImage: unsplash("photo-1698939169618-a1dd754a06db"),
    images: [unsplash("photo-1752434348269-253b3455ee64")],
  },
  {
    title: "Marionettentheater: Der kleine Drache Funkel",
    description:
      "Funkel ist ein kleiner Drache, der kein Feuer spucken kann – nur bunte Funken. Als das Drachenfest vor der Tür steht, macht er sich auf eine abenteuerliche Reise, um das Feuerspucken zu lernen.\nUnsere liebevoll handgefertigten Marionetten erwecken die Geschichte zum Leben. Das Stück erzählt von Freundschaft, Mut und davon, dass jeder auf seine Weise besonders ist.\nNach der Vorstellung dürfen die Kinder einen Blick hinter die Bühne werfen und sehen, wie die Puppenspieler die Marionetten führen. Dauer: ca. 50 Minuten.",
    category: "Musik & Kultur",
    locationType: "indoor",
    ageRange: "4-6",
    isFree: false,
    price: 9,
    startDate: "2027-11-20",
    startTime: "15:00",
    endTime: "16:00",
    capacity: 120,
    location: { venueName: "Marionettenbühne am Roten Tor", addressLine: "Spitalgasse 15", city: "Augsburg", state: "Bayern", zipCode: "86150", lat: 48.3625, lng: 10.9003 },
    coverImage: unsplash("photo-1779723971986-92a06b397963"),
    images: [unsplash("photo-1789871749228-aea137d15477"), unsplash("photo-1771363340736-e3cc8d30cb11")],
  },
];

// Normal kullanıcıların oluşturduğu event'ler — organizer event'lerinden farklı olarak daha küçük,
// çoğunlukla ücretsiz, mahalle/topluluk tarzı buluşmalar. Açıklamalar da ebeveyn ağzından yazıldı.
const USER_EVENTS: FutureEventSeed[] = [
  {
    title: "Kinderflohmarkt im Hinterhof",
    creator: "anna.wendt",
    description:
      "Unsere Kinderzimmer platzen aus allen Nähten – eure bestimmt auch! Deshalb veranstalten wir in unserem begrünten Hinterhof in der Neustadt einen kleinen Flohmarkt von Familien für Familien.\nVerkauft werden Kinderkleidung, Spielzeug, Bücher, Puzzles und Babyausstattung. Besonders schön: Die Kinder dürfen selbst einen Stand betreiben und ihre alten Schätze verkaufen oder tauschen.\nEs gibt Kaffee und selbst gebackenen Kuchen gegen Spende. Wer einen Stand möchte, meldet sich bitte über die Teilnahme an – Tische bringt jede Familie selbst mit.",
    category: "Familie",
    locationType: "outdoor",
    ageRange: "all-ages",
    isFree: true,
    startDate: "2027-09-26",
    startTime: "10:00",
    endTime: "14:00",
    capacity: 60,
    location: { venueName: "Hinterhof Neustadt", addressLine: "Frauenlobstraße 40", city: "Mainz", state: "Rheinland-Pfalz", zipCode: "55118", lat: 50.0072, lng: 8.2593 },
    coverImage: unsplash("photo-1789932837225-d3960f350314"),
    images: [unsplash("photo-1764510187484-384da0e87a8d"), unsplash("photo-1569164942237-00385e8fd71e")],
  },
  {
    title: "Krabbelgruppe: Spielen & Kennenlernen",
    creator: "anna.wendt",
    description:
      "Seit meine Tochter auf der Welt ist, habe ich mir einen Ort gewünscht, an dem sich Eltern mit Babys ganz entspannt austauschen können. Deshalb starte ich diese offene Krabbelgruppe im Nachbarschaftshaus Westend.\nWährend die Kleinen auf Matten krabbeln, Bauklötze stapeln und erste Freundschaften schließen, trinken wir Großen einen Tee und reden über alles, was uns gerade beschäftigt – vom Zahnen bis zum Kita-Start.\nDie Gruppe trifft sich jeden Dienstag. Bitte eine Decke und einen kleinen Snack für euer Kind mitbringen. Geschwisterkinder sind herzlich willkommen.",
    category: "Familie",
    locationType: "indoor",
    ageRange: "0-3",
    isFree: true,
    startDate: "2027-09-28",
    endDate: "2027-11-16",
    startTime: "10:00",
    endTime: "11:30",
    recurrenceRule: "weekly",
    capacity: 12,
    location: { venueName: "Nachbarschaftshaus Westend", addressLine: "Blücherstraße 17", city: "Wiesbaden", state: "Hessen", zipCode: "65195", lat: 50.0822, lng: 8.2276 },
    coverImage: unsplash("photo-1774641374314-6aaaf7d45d90"),
    images: [unsplash("photo-1759678444821-565ff103465c"), unsplash("photo-1780975873513-541cde82e7b3")],
  },
  {
    title: "Herbstbasteln mit Naturmaterialien",
    creator: "tobias.kraemer",
    description:
      "Kastanien, bunte Blätter, Eicheln und Tannenzapfen – der Herbst schenkt uns das schönste Bastelmaterial! Bei diesem gemütlichen Nachmittag gestalten wir gemeinsam Kastanienmännchen, Blätterbilder und kleine Herbstkränze.\nIch bin selbst Vater von zwei Kindern und bastle leidenschaftlich gern. Kleber, Scheren, Farben und Draht bringe ich mit, die Naturmaterialien sammeln wir vorher kurz im Park nebenan.\nDer kleine Unkostenbeitrag deckt das Material. Bitte Kleidung anziehen, die schmutzig werden darf. Eltern sind herzlich eingeladen mitzubasteln.",
    category: "Kreativität",
    locationType: "indoor",
    ageRange: "4-6",
    isFree: false,
    price: 3,
    startDate: "2027-10-20",
    startTime: "15:00",
    endTime: "17:00",
    capacity: 15,
    location: { venueName: "Kinder- und Jugendhaus Südweststadt", addressLine: "Karlstraße 97", city: "Karlsruhe", state: "Baden-Württemberg", zipCode: "76137", lat: 49.0036, lng: 8.3955 },
    coverImage: unsplash("photo-1766932901295-d4185660341b"),
    images: [unsplash("photo-1714646793449-6967987cfcae"), unsplash("photo-1613950190144-4f2a84c75e8c")],
  },
  {
    title: "Kinderwagen-Walking am Rheinufer",
    creator: "tobias.kraemer",
    description:
      "Nach der Geburt unseres Sohnes wollte ich wieder mehr Bewegung in meinen Alltag bringen – aber allein ist es oft schwer, sich zu motivieren. Also los: Gemeinsam walken wir mit Kinderwagen entlang der Rheinpromenade!\nWir starten mit einem kurzen Aufwärmen, gehen dann in zügigem Tempo etwa fünf Kilometer und machen zwischendurch einfache Kräftigungsübungen, bei denen der Kinderwagen als Stütze dient. Das Tempo richtet sich nach der Gruppe, niemand bleibt zurück.\nWir treffen uns jeden Donnerstag. Geeignet für Mamas und Papas mit Babys oder Kleinkindern im Wagen. Bitte an Wasser und bequeme Schuhe denken.",
    category: "Sport",
    locationType: "outdoor",
    ageRange: "parents",
    isFree: true,
    startDate: "2027-09-30",
    endDate: "2027-11-18",
    startTime: "09:30",
    endTime: "10:30",
    recurrenceRule: "weekly",
    capacity: 15,
    location: { venueName: "Rheinpromenade – Treffpunkt Stephanienufer", addressLine: "Stephanienufer 1", city: "Mannheim", state: "Baden-Württemberg", zipCode: "68163", lat: 49.4745, lng: 8.458 },
    coverImage: unsplash("photo-1741990811736-81fd08f449e5"),
    images: [unsplash("photo-1548289129-7445e236428d"), unsplash("photo-1744215221659-193172389d74")],
  },
  {
    title: "Herbstpicknick an der Donau",
    creator: "laura.engel",
    description:
      "Bevor es richtig kalt wird, wollen wir die letzten sonnigen Herbsttage noch einmal draußen genießen! Ich lade alle Familien aus Regensburg und Umgebung zu einem großen Mitbring-Picknick am Grieser Spitz ein.\nJede Familie bringt eine Kleinigkeit fürs gemeinsame Buffet mit – Obst, Brezen, Kuchen oder Salat. Für die Kinder gibt es Seifenblasen, Sackhüpfen und eine kleine Schatzsuche am Ufer.\nBitte Picknickdecke und eigenes Geschirr mitbringen, damit wir möglichst wenig Müll produzieren. Bei Regen verschieben wir auf den folgenden Sonntag.",
    category: "Essen & Trinken",
    locationType: "outdoor",
    ageRange: "all-ages",
    isFree: true,
    startDate: "2027-10-03",
    startTime: "12:00",
    endTime: "16:00",
    capacity: 40,
    location: { venueName: "Grieser Spitz", addressLine: "Am Gries 1", city: "Regensburg", state: "Bayern", zipCode: "93059", lat: 49.0233, lng: 12.0953 },
    coverImage: unsplash("photo-1719759336550-4fecc23ab176"),
    images: [unsplash("photo-1681311311317-a0561a8eef74"), unsplash("photo-1688127346194-30b3c4bdb710")],
  },
  {
    title: "Vorlesestunde im Stadtteilcafé",
    creator: "laura.engel",
    description:
      "Ich bin Grundschullehrerin in Elternzeit und vermisse das Vorlesen vor einer Gruppe gespannter Kinderaugen. Deshalb lese ich einmal im Monat im gemütlichen Stadtteilcafé Sanderau Geschichten für die Kleinen vor.\nDiesmal stehen herbstliche Bilderbücher auf dem Programm: von kleinen Igeln, fliegenden Drachen und einem Eichhörnchen, das seinen Wintervorrat vergessen hat. Nach dem Vorlesen malen wir gemeinsam ein Bild zur Geschichte.\nDie Eltern können in der Zwischenzeit in Ruhe einen Kaffee trinken. Die Teilnahme ist kostenlos, eine Anmeldung hilft bei der Platzplanung.",
    category: "Bildung",
    locationType: "indoor",
    ageRange: "4-6",
    isFree: true,
    startDate: "2027-10-13",
    startTime: "16:00",
    endTime: "17:00",
    capacity: 20,
    location: { venueName: "Stadtteilcafé Sanderau", addressLine: "Sanderstraße 20", city: "Würzburg", state: "Bayern", zipCode: "97070", lat: 49.7856, lng: 9.935 },
    coverImage: unsplash("photo-1532789339108-2ebc484efbf1"),
    images: [unsplash("photo-1583468982228-19f19164aee2")],
  },
  {
    title: "Pilze entdecken im Steigerwald",
    creator: "daniel.brandt",
    description:
      "Der Herbstwald steckt voller Pilze – aber welche sind giftig und welche nicht? Gemeinsam mit einem befreundeten, geprüften Pilzsachverständigen gehen wir mit unseren Kindern auf Entdeckungstour durch den Steigerwald.\nWir lernen, woran man Fliegenpilz, Steinpilz und Co. erkennt, warum Pilze für den Wald so wichtig sind und wie man sie richtig anschaut, ohne sie zu beschädigen. Wichtig: Wir sammeln nur zum Bestimmen, nichts wird gegessen!\nFestes Schuhwerk, eine Lupe (falls vorhanden) und ein kleiner Korb sind hilfreich. Der Unkostenbeitrag geht an den Pilzexperten.",
    category: "Natur",
    locationType: "outdoor",
    ageRange: "7-10",
    isFree: false,
    price: 4,
    startDate: "2027-10-09",
    startTime: "10:00",
    endTime: "13:00",
    capacity: 20,
    location: { venueName: "Steigerwald – Parkplatz Waldhaus", addressLine: "Steigerwaldstraße 1", city: "Erfurt", state: "Thüringen", zipCode: "99096", lat: 50.953, lng: 11.032 },
    coverImage: unsplash("photo-1604238017318-427fd23dc7de"),
    images: [unsplash("photo-1665138322353-10027b2190fa")],
  },
  {
    title: "Offene Gitarren- und Singrunde für Kinder",
    creator: "daniel.brandt",
    description:
      "Musik verbindet! Einmal im Monat treffen wir uns im Gemeinschaftshaus Stadtfeld, um gemeinsam zu singen und erste Akkorde auf der Gitarre oder Ukulele auszuprobieren.\nIch spiele seit über zwanzig Jahren Gitarre und bringe einfache Kinderlieder mit, die man schon mit zwei, drei Griffen begleiten kann. Wer kein eigenes Instrument hat, kann eines von mir ausleihen – ich habe mehrere Ukulelen dabei.\nVorkenntnisse sind nicht nötig, Spaß am Singen reicht völlig. Eltern dürfen gerne mitsingen!",
    category: "Musik & Kultur",
    locationType: "indoor",
    ageRange: "7-10",
    isFree: true,
    startDate: "2027-10-06",
    endDate: "2027-12-01",
    startTime: "16:30",
    endTime: "17:30",
    recurrenceRule: "monthly",
    capacity: 15,
    location: { venueName: "Gemeinschaftshaus Stadtfeld", addressLine: "Olvenstedter Straße 45", city: "Magdeburg", state: "Sachsen-Anhalt", zipCode: "39108", lat: 52.13, lng: 11.612 },
    coverImage: unsplash("photo-1788882680471-86ba7f651dac"),
    images: [unsplash("photo-1502781252888-9143ba7f074e"), unsplash("photo-1758687126741-86737c57c210")],
  },
  {
    title: "Strandputz-Aktion in Travemünde",
    creator: "miriam.seidel",
    description:
      "Nach jedem Sommer finden wir am Strand Flaschendeckel, Plastiktüten und Zigarettenstummel. Das wollen wir ändern! Gemeinsam mit anderen Familien befreien wir einen Abschnitt des Travemünder Strandes vom Müll.\nHandschuhe, Greifzangen und Müllsäcke stelle ich zur Verfügung. Die Kinder bekommen eine Sammelkarte, auf der sie eintragen, was sie gefunden haben – so lernen sie ganz nebenbei, wie lange Plastik im Meer bleibt.\nZum Abschluss gibt es eine kleine Stärkung mit Fischbrötchen und Apfelschorle. Bitte wetterfeste Kleidung und Gummistiefel mitbringen.",
    category: "Natur",
    locationType: "outdoor",
    ageRange: "all-ages",
    isFree: true,
    startDate: "2027-10-16",
    startTime: "10:00",
    endTime: "13:00",
    capacity: 50,
    location: { venueName: "Strand Travemünde – Brüggmanngarten", addressLine: "Kaiserallee 1", city: "Lübeck", state: "Schleswig-Holstein", zipCode: "23570", lat: 53.9636, lng: 10.8818 },
    coverImage: unsplash("photo-1565803974275-dccd2f933cbb"),
    images: [unsplash("photo-1617953141905-b27fb1f17d88")],
  },
  {
    title: "Halloween-Kostümparty im Nachbarschaftstreff",
    creator: "miriam.seidel",
    description:
      "Hexen, Gespenster und kleine Vampire aufgepasst! Für alle Kinder aus der Nachbarschaft organisieren wir eine gruselig-gemütliche Halloween-Party im Nachbarschaftstreff.\nEs gibt einen Kostümwettbewerb, Kinderschminken, eine Geister-Schatzsuche durch den dunklen Keller (keine Sorge, mit Taschenlampe!) und natürlich jede Menge Kürbismuffins und „Monsterpunsch“.\nDer kleine Beitrag deckt Deko und Snacks. Eltern sind willkommen, gerne auch verkleidet. Bitte gebt bei der Anmeldung Allergien eurer Kinder an.",
    category: "Feste & Feiern",
    locationType: "indoor",
    ageRange: "7-10",
    isFree: false,
    price: 2,
    startDate: "2027-10-31",
    startTime: "15:00",
    endTime: "18:00",
    capacity: 40,
    location: { venueName: "Nachbarschaftstreff Wüste", addressLine: "Brinkstraße 10", city: "Osnabrück", state: "Niedersachsen", zipCode: "49080", lat: 52.264, lng: 8.035 },
    coverImage: unsplash("photo-1509163245925-f4255dea7727"),
    images: [unsplash("photo-1667517169579-d8f18dcd6adf")],
  },
];

// Kullanıcıları e-posta ile arar, yoksa oluşturur. Mevcut kullanıcıları silmiyoruz —
// başka seed'lerin/manuel testlerin event'leri bu kullanıcılara bağlı olabilir.
async function ensureUsers(users: SeedUser[], role: "user" | "organizer") {
  const result = [];
  for (const u of users) {
    const username = toUsername(u);
    const email = `${username}@example.com`;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        username,
        firstName: u.firstName,
        lastName: u.lastName,
        email,
        password: SEED_PASSWORD,
        role,
        isEmailVerified: true,
        location: { ...u.location, country: "DE" },
      });
      console.log(`${role} oluşturuldu: ${email}`);
    }
    result.push(user);
  }
  return result;
}

async function run() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Seed script'i production ortamında çalıştırılamaz.");
  }

  await dbConnection();

  const categories = await EventCategory.find({});
  if (categories.length === 0) {
    throw new Error("Hiç kategori bulunamadı. Önce `npx tsx scripts/seedCategories.ts` çalıştır.");
  }
  const categoryIdByName = new Map(categories.map((c) => [c.name, c._id]));

  const organizers = await ensureUsers(ORGANIZERS, "organizer");
  const parents = await ensureUsers(PARENT_USERS, "user");

  // Event'te `creator` varsa o kullanıcıya, yoksa kendi grubunda sırayla birine ata.
  const assign = (e: FutureEventSeed, i: number, group: typeof organizers) => {
    if (!e.creator) return group[i % group.length]!;
    const found = group.find((u) => u.username === e.creator);
    if (!found) throw new Error(`Seed kullanıcısı bulunamadı: "${e.creator}" ("${e.title}")`);
    return found;
  };
  const seeds = [
    ...EVENTS.map((e, i) => ({ e, creator: assign(e, i, organizers) })),
    ...USER_EVENTS.map((e, i) => ({ e, creator: assign(e, i, parents) })),
  ];

  const { deletedCount } = await Event.deleteMany({ title: { $in: seeds.map(({ e }) => e.title) } });
  console.log(`${deletedCount} mevcut future-seed event silindi.`);

  let created = 0;
  for (const { e, creator } of seeds) {
    const categoryId = categoryIdByName.get(e.category);
    if (!categoryId) {
      console.warn(`Kategori bulunamadı, atlanıyor: "${e.category}"`);
      continue;
    }

    await Event.create({
      title: e.title,
      description: e.description,
      coverImage: e.coverImage,
      images: e.images,
      categoryId,
      locationType: e.locationType,
      ageRange: e.ageRange,
      createdBy: creator._id,
      status: "approved",
      isFree: e.isFree,
      price: e.isFree ? null : { amount: e.price!, currency: "EUR" },
      schedule: {
        startDate: dayjs(e.startDate).toDate(),
        endDate: e.endDate ? dayjs(e.endDate).toDate() : null,
        startTime: e.startTime,
        endTime: e.endTime,
        isRecurring: !!e.recurrenceRule,
        recurrenceRule: e.recurrenceRule ?? null,
      },
      location: {
        venueName: e.location.venueName,
        addressLine: e.location.addressLine,
        city: e.location.city,
        state: e.location.state,
        zipCode: e.location.zipCode,
        country: "DE",
        // GeoJSON sırası: [lng, lat]
        coordinates: { type: "Point", coordinates: [e.location.lng, e.location.lat] },
      },
      capacity: { max: e.capacity, current: 0 },
    });
    created++;
    console.log(`"${e.title}" (${e.location.city}, ${e.startDate}, ${creator.role}: ${creator.username}) oluşturuldu.`);
  }

  console.log(`\nToplam: ${created}/${seeds.length} event.`);
  console.log(`Seed kullanıcı şifresi: ${SEED_PASSWORD}`);

  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
