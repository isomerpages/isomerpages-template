// import dependencies required to import files
const yaml = require('js-yaml')
const YAML = require('yamljs') // this converts an object back to yaml
const fs = require('fs')
const path = require('path')

// takes a file path and returns the yaml file as an object
function yamlParser (file) {
  const obj = yaml.safeLoad(fs.readFileSync(file, {encoding: 'utf-8'}), JSON = true)
  return obj
}

// extracts yaml front matter from a markdown file
function frontMatterParser (markdownFile) {
  // read markdown file
  const result = fs.readFileSync(path.resolve(__dirname, markdownFile), 'utf8')

  // format file to extract yaml front matter
  const contents = result.split('---')
  const articleConfig = contents[1]
  const articleContent = contents[2]
  
  // get the configs
  const configObj = yaml.safeLoad(articleConfig)

  return {
    configObj,
    content: articleContent
  }
}

/*

Conversion tools

*/

// modify the _config.yml file to fit V2 standards
function configYmlModifier (confObj, homepageObj) {

  // separate the homepage fields
  const homepageFields = {
    'i_want_to': confObj['homepage_hero_i_want_to'],
    'programmes': confObj['homepage_programmes'],
    'resources': confObj['homepage_resources'],
    'careers': confObj['homepage_careers'],
  }

  // fields to remove
  const toRemove = [
    'title-abbreviated', 
    'email', 
    'description', 
    'baseurl', 
    'markdown', 
    'twitter_username', 
    'github_username', 
    'breadcrumbs', 
    'faq_url', 
    'faq_url_external', 
    'feedback_form_url',
    'homepage_hero_i_want_to',
    'homepage_programmes',
    'homepage_resources',
    'homepage_careers',
  ]
  toRemove.forEach(el => delete confObj[el])

  // fields to add
    // - title
    // - events under collections?
  Object.assign(confObj, {
    favicon: homepageObj.favicon,
    'google-analytics': homepageObj['google-analytics']
  })

  // defaults object
  const defaultsObj = {
    defaults: [
      {
        'scope': { path: '' }, 
        'values': { layout: 'page' }, 
      }
    ]
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

  return {
    confObj,
    homepageFields,
  }
}

  // takes in a homepage yml and homepageFields from _config.yml as 
  // objects, and returns the relevant data needed to modify index.md's 
  // front matter
function homepageModifier(homepageObj, homepageFields) {

  // various empty objects to store results
  var sections = [ { hero: {} } ] 
  var resources = {}
  var notification = `notification: "This website is in beta - your valuable <a href=\"https://www.google.com\">feedback</a> will help us in improving it."`

  /*
  
  go through the homepage fields

  */

  // i_want_to is now dropdown
  if (homepageFields['i_want_to']) {
    Object.assign(sections[0].hero, {
      'dropdown': {
        'title': homepageObj['hero-dropdown-text'],
        'options': homepageObj['i-want-to'],
      },
    })
  }
  
  // programmes is now infobar
  if (homepageFields['programmes']) {
    sections.push({
      infobar: {
        'title': homepageObj['programmes-title'],
        'subtitle': homepageObj['programmes-subtitle'],
        'description': homepageObj['programmes-description'],
        'button': homepageObj['programmes-more-button'],
        'url': homepageObj['programmes-more-button-url'],
      },
    })
  }

  // info-sections
  if (homepageObj['info-sections']) {
    homepageObj['info-sections'].forEach(curr => {
      sections.push({
        infopic: {
          title: curr['section-title'],
          subtitle: curr['section-subtitle'],
          description: curr['section-description'],
          url: curr['section-more-button-url'],
          image: curr['section-image-path'],
          alt: curr['section-image-alt'],
          button: curr['section-more-button'],
        }
      })
    })
  }

  // resources
  if (homepageFields['resources']) {
    Object.assign(resources, {
      'resources': {
        'title': homepageObj['resources-title'],
        'subtitle': homepageObj['resources-subtitle'],
        'button': homepageObj['resources-more-button'],
        'url': homepageObj['resources-more-button-url'],
      },
    })

    sections.push(resources)
  }


  // careers


  /*
  
  Other miscellaneous additions

  */

  // hero banner
  if (homepageObj['hero-title']){
    Object.assign(sections[0].hero, {
      title: homepageObj['hero-title']
    })
  }

  if (homepageObj['hero-subtitle']){
    Object.assign(sections[0].hero, {
      subtitle: homepageObj['hero-subtitle']
    })
  }

  if (homepageObj['hero-banner']){
    Object.assign(sections[0].hero, {
      background: homepageObj['hero-banner']
    })
  }

  // button
  if (homepageObj['button']) {
    Object.assign(sections[0].hero, {
      button: homepageObj['button'][0]['text'],
      url: homepageObj['button'][0]['url'],
    })
  }

  // key highlights
  if (homepageObj['key-highlights']) {
    Object.assign(sections[0].hero, {
      'key-highlights': homepageObj['key-highlights'],
    })
  }
  
  return({
    notification: notification,
    sections
  })
}

// generates the new footer.yml file found in V2
function footerGenerator(config, privacy, terms, contactUs, socialMedia) {
  var footer = {
    'show_reach': true,
    'copyright_agency': 'Open Government Products',
  }

  if (contactUs) {
    footer['contact_us'] = contactUs.permalink
  }


  if (config) {
    footer['faq'] = config['faq_url']
    footer['feedback'] = config['feedback_form_url']
  }

  if (privacy) {
    footer['privacy'] = privacy.permalink
  }

  if (terms) {
    footer['terms_of_use'] = terms.permalink
  }

  if (socialMedia) {
    footer['social_media'] = socialMedia
  }

  // last of all, we need to add 'links' but i'm not sure what they mean yet

  return footer
}

// modifies the navigation.yml file
function navigationModifier(homepageObj, navigationObj) {

  // get the agency logo
  const logo = homepageObj['agency-logo']

  return {
    logo,
    links: navigationObj
  }
}

// modifies the contact-us.md page so that it includes the new front matter
function contactUsModifier(contactUsConfigFile, contactUsFile) {
  const contactUsObj = frontMatterParser(contactUsFile)
  const contactUsConfig = yamlParser(contactUsConfigFile)

  // change attribute from column to contacts
  contactUsConfig['contacts'] = contactUsConfig['column']

  // remove column
  delete contactUsConfig['column']

  // update the front matter
  const res = frontMatterInsert(contactUsObj, contactUsConfig)

  // write the contact us markdown file
  fs.writeFileSync('index1111.md', res, {encoding: 'utf-8'})
  return
}

function indexModifier(confFile, homepageFile, indexFile) {
  const confObj = yamlParser(confFile)
  const homepageObj = yamlParser(homepageFile)

  // get the config object to update the indexFile
  const newData = configYmlModifier(confObj, homepageObj)

  // update the front matter
  const res = frontMatterInsert(frontMatterParser(indexFile), newData.confObj)

  // write the contact us markdown file
  fs.writeFileSync('index1111.md', res, {encoding: 'utf-8'})
  return
}




// takes in a markdown file and a javascript object and updates the front
// matter in the markdown file with the javascript object
function frontMatterInsert({configObj, content}, newData) {

  // if layout is leftnav-page, leftnav-page-content, or simple-page, we can
    // remove the layout
  if (configObj['layout'] === 'leftnav-page' || configObj['layout'] === 'leftnav-page-content' || configObj['layout'] === 'simple-page') {
    delete configObj['layout']
  }
    // remove last-updated, collection_name if present
  if (configObj['last-updated']) {
    delete configObj['last-updated']
  }
  if (configObj['collection_name']) {
    delete configObj['collection_name']
  }
    // change second_nav_title to third_nav_title if present
  if (configObj['second_nav_title']) {
    configObj['third_nav_title'] = configObj['second_nav_title']
    delete configObj['second_nav_title']
  }
  
  // add the new data to the config object
  Object.assign(configObj, newData)

  // join the components and write the file
  const data = ['---\n', `${YAML.stringify(configObj, {schema: 'json'})}`, '---\n', content].join('')

  // note that right now, stringify is not doing a good job of stringifying arrays
  fs.writeFileSync('index1111.md', data, {encoding: 'utf-8'})
  return data
}




/*
Testing
*/

const res = configYmlModifier(yamlParser('_config.yml'), yamlParser('_data/homepage.yml'))
const homepageres = homepageModifier(yamlParser('_data/homepage.yml'), 
{
  'i_want_to': true,
  'programmes': true,
  'resources': true,
  'careers': true,
})
const navigationres = navigationModifier(yamlParser('_data/homepage.yml'), yamlParser('_data/navigation.yml'))
const footerres = footerGenerator(
  yamlParser('_config.yml'), 
  frontMatterParser('./pages/privacy.md').configObj,
  frontMatterParser('./pages/terms-of-use.md').configObj,
  frontMatterParser('./pages/contact-us.md').configObj,
  yamlParser('_data/social-media.yml')
)
// frontMatterInsert(frontMatterParser('./index.md'), {
//   'abc': 12345
// })
// contactUsModifier('./_data/contact-us.yml', './pages/contact-us.md')
// indexModifier('_config.yml', './_data/homepage.yml', './index.md')
// fs.writeFileSync('index1111.md', YAML.stringify(res.confObj, {schema: 'core'}).replace(/(\s+\-)\s*\n\s+/g, '$1 '), {encoding: 'utf-8'})
// console.log(yaml.safeLoad(YAML.stringify(res.confObj, {schema: 'json'})))

