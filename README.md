# IATA NDC compliant JSON to XML converter

This module wrapper for NDC xml2json allows you to convert and NDC-compliant XML payload into a equivalent NDC JSON
payload. The converter code is originally made by @airtechzone ([https://github.com/airtechzone/ndc-xml2json-js]).

## Versions supported

Currently following NDC versions are supported: 16.2, 17.1, 17.2, 18.1, 18.2, 19.1, 19.2.

## Usage

To install the module use npm install:

```
npm i ndc-xml2json
```

To use the module provide a valid NDC XML string and get generated JSON back:

```javascript
const xml2json = require('ndc-xml2json');

const version = "182" // NDC v18.2
const xml = xml2json('<IATA_AirShoppingRQ>... </IATA_AirShoppingRQ>', version);
```