import fs from 'fs'

const xml2json = require('../src')

describe('xml 2 json converter', () => {
    it('converts XML to JSON for NDC-18.2 version', () => {
        const xml = fs.readFileSync('./test/input/182.xml').toString()
        const json = xml2json(xml, '182')
        expect(json).not.toEqual(-1)
        expect(json.IATA_AirShoppingRQ).not.toBeUndefined()
        expect(Object.keys(json.IATA_AirShoppingRQ).length).toBeGreaterThan(0)
    })
})
