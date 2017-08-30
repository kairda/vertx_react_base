# A most simple web-application with vertx and react.js

## Building and running

```
npm install
npm install -g webpack

webpack

mvn clean package

java -jar target/vertxreactbase-1.0.0-SNAPSHOT-fat.jar
```

Open browser and point to [http://localhost:8080](http://localhost:8080)

# Running within an IDE

Run webpack in watch mode:

```
webpack --watch  --progress --colors --source-maps
```

Start the Server-Class with the following Command-line-Option:

> isDevelopment

(this will prevent the bundle.js file to be cached)

You can edit the Javascript files and bundle.js is automatically rebuild.
A simple reload in the browser shows the effect immediately.

 