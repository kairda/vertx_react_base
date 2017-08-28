## Building the simple application structure 

Um die Client-App auszuliefern, wird das bundle.js in 
das <source>Webroot</source> verzeichnis kopiert.
Wenn das webroot-Verzeichnis im /src/main/resources Verezichnis liegt,
dann wird der Content von dort in einem fat-jar mit eingepackt
und auch von dort ausgeliefert.


Für das Development ist das nicht ideal: durch die Struktur im resources
folder wird der Initiale Wert gecached (Verzeichnis .vertx).
Ein update von bundle.js wird so nicht richtig übertragen.

Derzeitige Lösung: bei der Entwicklung 