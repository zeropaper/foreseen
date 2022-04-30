import Ajv from "ajv/dist/2020"

import schema from './schema.json'

const ajv = new Ajv()

const { $schema, ...schemaAjv } = schema

// validate is a type guard for MyData - type is inferred from schema type
const validateJSON = ajv.compile(schemaAjv)

export default validateJSON;
