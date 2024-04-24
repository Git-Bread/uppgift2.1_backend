# Uppgift 2.1
En enkel webbserver som är kopplad till en mysql databas i syftet att lagra och hantera data, webbservern har ett antal olika kommandon för att utföra olika enkla operationer relaterat till datan, dessa finns listad nedan:
### /data returnerar allt inehåll ifrån databasen (GET)
### /data/specific låter dig skicka ett fullt mysql anrop, används inte i uppgiften efter men den finns (GET)
### /remove tar bort ett inlägg som delar numret som skickas med ett object som inehåller remove: NUMBER (DELETE)
### /update Updaterar inehållet inom en rad i databasen baserat på ett nytt object skickat som följer formfaktorn {id: num, companyname: name, jobtitle: name, startdate: date, enddate: date}, måste överstemma med existerande id (PUT)
### /add lägger till ett nytt inlägg i databasen såvida den följer samma formfaktor som ovan (POST)
webbservern försöker även skapa en ny databas ifall den inte finns och populerar denna med tre inlägg för att ha något att jobba med, connection informationen är baserat på en env fil. Webbservern har även en öppen CORS och relativ extensiv validering i både
form och längd på inehållet med ett system som går ut på att samla ihop alla fel och skicka dom ihop för att enkelt felsöka.

Största problemet under utväckling var när jag glömde bort att lägga till () efter require(express.json()) vilket tog pinsamt nog 2 timmar att diagnosera.

-Utväcklat utav Max Gagner i studie syften
