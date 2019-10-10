const yaml = require('js-yaml')
const YAML = require('yamljs')
const fs = require('fs')
const path = require('path')


function yamlParser (file) {
  const inputfile = file
  const obj = yaml.safeLoad(fs.readFileSync(inputfile, {encoding: 'utf-8'}), JSON = true)
  return obj
}

function frontMatterParser (markdownFile) {
  // format file to extract yaml front matter
  const contents = markdownFile.split('---')
  const articleConfig = contents[1]
  const articleContent = contents[2]

  // parse yaml and retrieve the attributes like layout etc.
  const resultsArr = articleConfig.split('\n').map(curr => {
    // after splitting on new lines, we end up with a couple
    // of empty strings we need to filter out
    if (curr !== '') {
      return {
        // attribute : value map (for example, layout: 'simple-page')
        [curr.split(': ')[0]]: curr.split(': ')[1]
      }
    }
    return curr
  }).filter(function (el) {
    return el !== '';
  })

  // get the configs all in one object
  var configObj = {}
  for (var i = 0; i < resultsArr.length; i++) {
    configObj = Object.assign(configObj, resultsArr[i])
  }

  return {
    configObj,
    content: articleContent
  }
}

function markdownParser (file) {
  // read markdown file
  const result = fs.readFileSync(path.resolve(__dirname, file), 'utf8')

  // parse the content and return the front matter as an object
  return frontMatterParser(result)
}

// modify the _config.yml file to fit V2 standards
function configYmlModifier (file, homepage) {
  // obtain the _config.yml file as an object
  const confObj = yamlParser(file)

  // we need to remove
    // - under title, title-abbreviated
    // - email
    // - description
    // - baseurl
    // - twitter_username
    // - github_username
    // - markdown
    // - breadcrumbs
    // - faq_url
    // - faq_url_external
    // - feedback_form_url
  const toRemove = ['title-abbreviated', 'email', 'description', 'baseurl', 'markdown', 'twitter_username', 'github_username', 'breadcrumbs', 'faq_url', 'faq_url_external', 'feedback_form_url']
  toRemove.forEach(el => delete confObj[el])

  // fields to add
    // - title
    // - favicon
    // - google analytics

  // defaults object
  const defaultsObj = {
    defaults: [{'scope': { path: '' }, 'values': { layout: 'page' } }]
  }

  // add keys
  Object.assign(confObj, defaultsObj)

  // permalink template
  const permalinkTemplate = '/:collection/:path/:title'

  // add permalink template to each collection if output: true
  const collectionKeys = Object.keys(confObj['collections'])
  collectionKeys.forEach(el => {
    if (confObj['collections'][el]['output'] === true) {
      confObj['collections'][el]['permalink'] = permalinkTemplate
    }
  })

  return confObj
}

// const res = markdownParser('_who-we-are/1-our-role.md')
const res = configYmlModifier('_config.yml')
const yamlRes = YAML.stringify(res, 4)
console.log(res)