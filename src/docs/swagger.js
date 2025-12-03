const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const filePath = path.join(__dirname, '../../public/openapi.yaml');

let swaggerDocument;

try {
  const yamlText = fs.readFileSync(filePath, 'utf8');
  swaggerDocument = yaml.load(yamlText);
} catch (err) {
  console.error("Error loading YAML:", err);
  swaggerDocument = {};
}

module.exports = swaggerDocument;
