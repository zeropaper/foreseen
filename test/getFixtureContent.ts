import { readFile } from 'fs/promises'
import { readFileSync } from 'fs'
import { resolve } from 'path'

export default async function getFixtureContent(fixtureName: string) {
  return readFile(resolve(__dirname, 'fixtures', `${fixtureName}.yml`), 'utf8')
}

export function getFixtureContentSync(fixtureName: string) {
  return readFileSync(resolve(__dirname, 'fixtures', `${fixtureName}.yml`), 'utf8')
}