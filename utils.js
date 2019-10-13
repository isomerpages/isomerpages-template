// import dependencies required to import files
const yaml = require('js-yaml')
// const YAML = require('yamljs')
const fs = require('fs')
const path = require('path')

// takes a file path and returns the yaml file as an object
function yamlParser (file) {
  const inputfile = file
  const obj = yaml.safeLoad(fs.readFileSync(inputfile, {encoding: 'utf-8'}), JSON = true)
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
function configYmlModifier (file, homepage) {
  // obtain the _config.yml file as an object
  const confObj = yamlParser(file)
  const homepageObj = yamlParser(homepage)
  // console.log(homepageObj)

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
    // - favicon
    // - google analytics
    // - events under collections?

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
  
  // attributes to be added to _config.yml
  const config = {
    favicon: homepageObj.favicon,
    'google-analytics': homepageObj['google-analytics']
  }

  // attributes to be added to navigation.yml
  const navigation = {
    'agency-logo': homepageObj['agency-logo'],
  }

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



function frontMatterInsert() {

}




/*
Testing
*/

// const res = markdownParser('_who-we-are/1-our-role.md')
const res = configYmlModifier('_config.yml', '_data/homepage.yml')
const yamlRes = YAML.stringify(res.confObj, 4)
const homepageres = homepageModifier(yamlParser('_data/homepage.yml'), 
{
  'i_want_to': true,
  'programmes': true,
  'resources': true,
  'careers': true,
})
const navigationres = navigationModifier(yamlParser('_data/homepage.yml'), yamlParser('_data/navigation.yml'))
console.log(navigationres)