const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const yamlFile = path.join(__dirname, '../../public/openapi.yaml');

let swaggerDocument = {};

try {
  const fileContents = fs.readFileSync(yamlFile, 'utf8');
  swaggerDocument = yaml.load(fileContents);
} catch (err) {
  console.error('❌ Failed to load Swagger YAML:', err.message);
}

module.exports = swaggerDocument;
