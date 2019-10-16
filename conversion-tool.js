// import dependencies required to import files
const yaml = require('js-yaml')
const YAML = require('yamljs')
const fs = require('fs')
const path = require('path')

// slugify function
function slugify (name) {
  return name.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with '-'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple '-' with single '-'
    .replace(/^-+/, '') // Trim '-' from start of text
    .replace(/-+$/, '') // Trim '-' from end of text
}

// takes a file path and returns the yaml file as an object
function yamlParser (file) {
  const obj = yaml.safeLoad(fs.readFileSync(file, {encoding: 'utf-8'}), JSON = true)
  return obj
}

// extracts yaml front matter from a markdown file path
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
// takes in parsed yml objects, NOT file paths
function configYmlModifier (confObjPath, homepageObjPath, navigationObjPath) {
  // parse the yaml files
  let confObj = yamlParser(confObjPath)
  let homepageObj = yamlParser(homepageObjPath)
  let navigationObj = yamlParser(navigationObjPath)

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
  Object.assign(confObj, {
    favicon: homepageObj.favicon,
    'google-analytics': homepageObj['google-analytics'],
    'remote_theme': 'isomerpages/isomerpages-template@next-gen',
    permalink: 'none',
    baseurl: '',
    defaults: [
      {
        'scope': { path: '' }, 
        'values': { layout: 'page' }, 
      }
    ]
  })

  // fields to modify
    // according to V2 migration guide, need to modify CSS but correct
    // information not reflected in repo
  confObj['plugins'] = ['jekyll-feed', 'jekyll-assets', 'jekyll-paginate', 'jekyll-sitemap']

  // permalink template
  const permalinkTemplate = '/:collection/:path/:title'

  // add permalink template to each collection if they can be found in navigation.yml
  const collectionKeys = Object.keys(confObj['collections'])

  // loop through titles in navigation yml file
  navigationObj.map(navObj => {
    // match them with collection titles
    collectionKeys.map(el => {
      if (slugify(navObj['title']) === el) {
        confObj['collections'][el]['permalink'] = permalinkTemplate
      }
    })
  })

  return {
    confObj,
    homepageFields,
  }
}

  // takes in
      // homepage.yml file path
      // homepageFields from _config.yml
      // programmes.yml file path 
  // as objects, and returns the relevant data needed to modify index.md's 
  // front matter
function homepageModifier(homepageObjPath, homepageFields, programmesObjPath) {
  // parse yaml files
  let homepageObj = yamlParser(homepageObjPath)
  let programmesObj = yamlParser(programmesObjPath)

  // various empty objects to store results
  var sections = [ { hero: {} } ] 
  var resources = {}
  var carousel = []
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

  // carousel
  if (programmesObj) {
    programmesObj.forEach(curr => {
      carousel.push({
        title: curr['title'],
        subtitle: curr['category'],
        description: curr['desc'],
        image: curr['img'],
        'bg-color': curr['bg-color'],
      })
    })
  }
  sections.push({carousel})

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
    notification,
    sections
  })
}

// generates the new footer.yml file found in V2 given the 
// file paths of 
    // _config.yml file
    // social media yml file
    // privacy, terms of use, and contact us markdowns
function footerGenerator(configPath, privacyPath, termsPath, contactUsPath, socialMediaPath) {
  // parse files
  let config = yamlParser(configPath)
  let privacy = frontMatterParser(privacyPath).configObj
  let terms = frontMatterParser(termsPath).configObj
  let contactUs = frontMatterParser(contactUsPath).configObj
  let socialMedia = yamlParser(socialMediaPath)

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

  return footer
}

// modifies the navigation.yml file
function navigationModifier(homepageObjPath, navigationObjPath) {
  // parse yaml files
  let homepageObj = yamlParser(homepageObjPath)
  let navigationObj = yamlParser(navigationObjPath)

  // get the agency logo
  const logo = homepageObj['agency-logo']

  // modifications to objects in navigation.yml
  navigationObj = navigationObj.map(el => {
    // modify resource room object
    if (el['title'] === 'Resources') {
      return {
        title: 'Resources',
        resource_room: true,
      }
      // remove external: true - do we need some other way to ensure integrity of URLs?
    } else if (el['external']) {
      
      delete el['external']

    } else if (el['sub-links']) {
      // rename sub-links to sublinks
      el['sublinks'] = el['sub-links']
      delete el['sub-links']

      // delete external: true within sublinks as well
      if (el['sublinks']['external']) {
        delete el['sublinks']['external']
      }
    }  
    return el
  })

  return {
    logo,
    links: navigationObj
  }
}

// modifies the contact-us.md page so that it includes the new front matter
function contactUsModifier(contactUsYamlPath, contactUsPath) {
  // parse files
  const contactUsObj = frontMatterParser(contactUsPath)
  const contactUsConfig = yamlParser(contactUsYamlPath)

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

function indexModifier(confObjPath, homepagePath, programmesPath, indexPath) {
  // parse files
  const confObj = yamlParser(confObjPath)
  const homepageObj = yamlParser(homepagePath)
  const programmesObj = yamlParser(programmesPath)

  // get the config object to supplement homepage yml data
  const { homepageFields } = configYmlModifier(confObj, homepageObj)

  // update the homepage yml data
  const newData = homepageModifier(homepageObj, homepageFields, programmesObj)

  // update the front matter
  const res = frontMatterInsert(frontMatterParser(indexPath), newData) 

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
  console.log(configObj)

  // join the components and write the file
  const data = ['---\n', `${YAML.stringify(configObj, {schema: 'core'})}\n`, '---\n', content].join('')

  // note that right now, stringify is not doing a good job of stringifying arrays
  fs.writeFileSync('index1111.md', data, {encoding: 'utf-8'})
  return data
}

const abc = configYmlModifier('./_config.yml', './_data/homepage.yml', './_data/navigation.yml') 
console.log(abc.confObj)

module.export = {
  yamlParser,
  frontMatterInsert,
  frontMatterParser,
  configYmlModifier,
  homepageModifier,
  footerGenerator,
  navigationModifier,
  contactUsModifier,
  indexModifier,
}
