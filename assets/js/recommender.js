'use strict'

let NUM_RECOMMENDED_PAGES = 5

let pageUrl = document.getElementById('full-page-url').innerHTML
let base64PageUrl = window.btoa(unescape(encodeURIComponent(pageUrl)))

let param = {
  url: base64PageUrl
}

let request = $.ajax({
  url: 'https://api.isomer.gov.sg/recommend',
  data: param,
  dataType: 'json'
})

request.then(function(response) {
  let relatedPostsString = ''
  let relatedPostsDiv = document.getElementById('related-content')
  let relatedPostsList = document.getElementById('related-content-list')

  relatedPostsDiv.classList.remove('hide')

  let relatedPostArray = response.recommended_posts
  let slicedArray = relatedPostArray.slice(0,NUM_RECOMMENDED_PAGES)

  slicedArray.forEach(function(relatedPost, index) {
    const base64RelatedPost = window.btoa(unescape(encodeURIComponent(relatedPost.url)))
    relatedPostsString += '<li><a href=\"' + relatedPost.url + '?utm_medium=recommender_' + index + '&utm_source=' + base64PageUrl + '&utm_content=' + base64RelatedPost + '\"">' + relatedPost.title + '</a></li>'
  })

  relatedPostsList.innerHTML = relatedPostsString

}).catch(function(error) {
  console.log(error)
})
