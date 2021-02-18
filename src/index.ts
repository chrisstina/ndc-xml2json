import assert from 'assert'
import { DOMParser } from 'xmldom'
import { ALLOWED_VERSIONS } from './constants/versions'

let singletons: string[]
let json = ''

function checkVersion(version: string) {
    assert(ALLOWED_VERSIONS.indexOf(version) !== -1, 'Unsupported version')
}

function getTextContent(node: any): string | null {
    var text = null
    for (var i = 0; i < node.childNodes.length; i++) {
        var ch = node.childNodes[i]
        if (ch.nodeType === 1) {
            return null
        }
        if (ch.nodeType === 3) {
            text = ch.textContent
        }
    }
    return text
}

function getElementChildNodes(node: any) {
    var children = []
    for (var i = 0; i < node.childNodes.length; i++) {
        var ch = node.childNodes[i]
        if (ch.nodeType === 1) {
            children.push(ch)
        }
    }
    return children
}

function parse(node: any, xpath: string) {
    // opening object
    json += '{'

    let hasAttributes = false

    // attributes
    if (node.attributes.length > 0) {
        hasAttributes = true
        json += '"$":{'
        for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i]
            json += '"' + attr.name + '":"' + attr.value + '"'
            if (i < node.attributes.length - 1) {
                json += ','
            }
        }
        json += '}'
    }

    // value
    var textContent = getTextContent(node)
    if (textContent != null) {
        if (hasAttributes) {
            json += ','
        }
        json +=
            '"_":"' +
            (node.textContent || '')
                .replace(/\n/g, '\\n')
                .replace(/\t/g, '\\t')
                .replace(/"/g, '\\"') +
            '"'
    } else {
        // children
        let processed: string[] = []
        let numberProcessed = 0
        let child
        let children = getElementChildNodes(node)
        if (hasAttributes && children.length > 0) {
            json += ','
        }
        for (let i = 0; i < children.length; i++) {
            child = children[i]
            if (processed.includes(child.nodeName) || child.nodeType !== 1) {
                continue
            }
            processed.push(child.nodeName)
            let newXpath = xpath + child.nodeName + '/'
            if (singletons.includes(newXpath)) {
                json += '"' + child.nodeName + '":'
                parse(child, newXpath)
                numberProcessed++
            } else {
                json += '"' + child.nodeName + '":['
                parse(child, newXpath)
                numberProcessed++
                let child2
                for (let j = i + 1; j < children.length; j++) {
                    child2 = children[j]
                    if (child2.nodeName === child.nodeName) {
                        json += ','
                        parse(child2, newXpath)
                        numberProcessed++
                    }
                }
                json += ']'
            }
            if (numberProcessed < children.length) {
                json += ','
            }
        }
    }

    // closing object
    json += '}'

    return json
}

function convert(xmlData: string): {} {
    let xml: Document
    try {
        const parser = new DOMParser()
        xml = parser.parseFromString(xmlData, 'text/xml')
    } catch (err) {
        console.error('Invalid XML input\n' + err)
        return -1
    }
    const root = xml.documentElement
    let json = `{"${root.nodeName}":${parse(root, root.nodeName + '/')}}`
    return JSON.parse(json)
}

/**
 * Performs an NDC-compliant xml to an NDC-compliant json conversion
 * @param {string} xml
 * @param {string} version
 */
const xml2json = (xml: string, version: string): {} | number => {
    try {
        checkVersion(version)
        singletons = singletons || require(`./singletons/singletons-${version}.json`)
        return convert(xml)
    } catch (e) {
        console.error('Error converting NDC xml to json\n' + e.stack)
        return -1
    }
}

module.exports = xml2json
