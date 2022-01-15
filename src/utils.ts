// src/utils.ts

import { request } from 'obsidian';
import { Raindrop, RaindropList } from './models';
import axios from "axios";

import { App, Notice, TFile } from "obsidian";

/**
 * Fetches a raindrop object from the Raindrop API
 * @param {string} id - The ID of the raindrop to fetch from the API
 * @param {string} bearer - The bearer token
 * @returns {Raindrop} - The raindrop from the Raindrop API
 */
 export const getRaindrop = async (id: string, bearer: string): Promise<Raindrop> => {
    // Performs a GET request to the Raindrop API
    const raindropUrl = new URL(`https://api.raindrop.io/rest/v1/raindrop/${id}`)
    let raindropRequest
    try {
      raindropRequest = await request({
        method: 'GET',
        url: `${raindropUrl.href}`,
        headers: {Authorization: `Bearer ${bearer}`},
      })
    } catch (error) {
      if (error.request) {
        throw new Error('There seems to be a connection issue.')
      } else {
        console.error(error)
        throw error
      }
    }
    // If the request was successful, parse the response and return the Raindrop
    // console.log('raindropRequest', raindropRequest)
    const raindrop: Raindrop = JSON.parse(raindropRequest).item
    return raindrop
  }
      
/**
 * Fetches array of raindrop objects from the Raindrop API
 * @param {string} id - The collection ID to fetch from the API, -1 for unsorted
 * @param {string} bearer - The bearer token
 * @returns {RaindropList} - An array of Raindrop Objects from the RaindropIO API
 */
 export const getRaindrops = async (id: string, bearer: string): Promise<RaindropList> => {
    // Performs a GET request collections endpoint of the Raindrop API
    const raindropsUrl = new URL(`https://api.raindrop.io/rest/v1/raindrops/${id}`)
    let raindropRequest
    try {
        raindropRequest = await request({
        method: 'GET',
        url: `${raindropsUrl.href}`,
        headers: {Authorization: `Bearer ${bearer}`},
        })
    } catch (error) {
        if (error.request) {
        throw new Error('There seems to be a connection issue.')
        } else {
        console.error(error)
        throw error
        }
    }
    // If the request was successful, parse the response and return the Raindrop
    // console.log('raindropList Request Return', raindropRequest)
    const raindrops: RaindropList = JSON.parse(raindropRequest).items
    return raindrops
 }

/**
 * Fetches array of tags from the Raindrop API
 * @param {string} id - The collection ID to fetch from the API, -1 for unsorted
 * @param {string} bearer - The bearer token
 * @returns {TagList} - An array of Tag Objects from the RaindropIO API
 */
 export const getTags = async (id: string, bearer: string): Promise<RaindropList> => {
  // Performs a GET request collections endpoint of the Raindrop API
  const raindropsUrl = new URL(`https://api.raindrop.io/rest/v1/tags/${id}`)
  let raindropRequest
  try {
      raindropRequest = await request({
      method: 'GET',
      url: `${raindropsUrl.href}`,
      headers: {Authorization: `Bearer ${bearer}`},
      })
  } catch (error) {
      if (error.request) {
      throw new Error('There seems to be a connection issue.')
      } else {
      console.error(error)
      throw error
      }
  }
  // If the request was successful, parse the response and return the Raindrop
  // console.log('raindropList Request Return', raindropRequest)
  const tags: any = JSON.parse(raindropRequest).items
  const sortedArray= tags.sort(function(a, b) {
    const textA = a._id;
    const textB = b._id;
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  })
 console.log('sortedArray', sortedArray)
  return sortedArray
}


/**
 * Fetches array of raindrop objects from the Raindrop API
 * @param {string} id - The collection ID to fetch from the API, -1 for unsorted
 * @param {string} bearer - The bearer token
 * @returns {RaindropList} - An array of Raindrop Objects from the RaindropIO API
 */
 export const filterRaindrops = async (id: string, bearer: string, tagName: string): Promise<RaindropList> => {
  const config = {
    headers: {'Authorization': `Bearer ${bearer}`},
    params: {
      search: `#"${tagName}"`
    },
  }
  const raindropRequest = await axios.get(`https://api.raindrop.io/rest/v1/raindrops/${id}`, config)
  // const raindrops: RaindropList = raindropRequest.data;
  // console.log('raindropList Request Return', raindropRequest)
  return raindropRequest.data.items;

}


/**
 * Updates collection ID a raindrop object in the Raindrop API
 * @param {string} id - The ID of the raindrop to update from the API
 * @param {string} bearer - The bearer token
 * @returns {Raindrop} - The raindrop from the Raindrop API
 */
 export const archiveRaindrop = async (raindrop: any): Promise<T> => {
  // TODO - move to a utility function
  const pluginSettings = window.app.plugins.plugins['raindropio-to-obsidian'].settings;
  // console.log('Find Plugin Settings', pluginSettings)
  const bearerToken = pluginSettings.bearerToken || '';
  // fetch the list of raindrops
  // console.log('archiveRaindrop', raindrop._id)
  const result = await updateRaindropCollection(raindrop._id, bearerToken);
  console.log('here from archive raindrop', result)
  // setRaindrops(result)
  // setUnsortedRaindropCount(result.count)
  return {};
}


/**
 * Updates collection ID a raindrop object in the Raindrop API
 * @param {string} id - The ID of the raindrop to update from the API
 * @param {string} bearer - The bearer token
 * @returns {Raindrop} - The raindrop from the Raindrop API
 */
 export const updateRaindropCollection = async (id: string, bearer: string): Promise<Raindrop> => {
    const data = {
        "collection": {
            "$ref": "collections",
            "$id":19496359,
            "$db": ""
        }}
        
    axios.put(`https://api.raindrop.io/rest/v1/raindrop/${id}`, data, { headers: {"Authorization" : `Bearer ${bearer}`} })
        .then((res) => {
            console.log(`Status: ${res.status}`);
            console.log('Body: ', res.data);
            console.log('raindropRequest update response', res.data)
            const raindrop: Raindrop = JSON.parse(res.data).item
            return raindrop
        }).catch((err) => {
            console.error(err);
        })

  }


// Obsidian Note Functions

/**
 * Creates a Obsidian Note from aindrop object
 * @param {object} raindop - The data from Raindrop API
 * @returns {Note} - Obsidian Note
 */
 export const buildNote = async (raindrop: any): Promise<TFile> => {
    const app = window.app as App;
    const { vault } = app;
    console.log("createRaindropNote data", raindrop);
    const stockIllegalSymbols = /[\\/:|#^[\]]/g;
    const cleanTitle = raindrop.title.replace(stockIllegalSymbols, '');
    const normalizedPath = `Article - ${cleanTitle}.md`;
    console.log('attempting to create file: ' + normalizedPath);
    try {

      let templateContents = '---\n';
      templateContents += `tags:\n`;
      templateContents += `- literature\n`;
      templateContents += `- articles\n`;
      templateContents += `- raindrops\n`;
      templateContents += `links:\n`;
      raindrop.tags.map((tag:string) => (templateContents += `- ${tag}\n`));
      templateContents += `status: unprocessed\n`;
      templateContents += '---\n';
      templateContents += `- Title: ${normalizedPath}\n`;
      templateContents += `- Links: \n`;
      raindrop.tags.map((tag:string) => (templateContents += `  - [[${tag}]]\n`));
      templateContents += `- Source Link: [Link](${raindrop.link}) \n`;
      templateContents += '---\n';
      templateContents += '\n\n';
      templateContents += '## Notes\n';
      templateContents += '\n\n';
      templateContents += '## Highlights\n';
  
      // const createdFile = await vault.create(normalizedPath, templateContents
      //   .replace(/{{\s*title\s*}}/gi, filename) );
      
      const createdFile = await vault.create(
        normalizedPath,
        templateContents,
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (app as any).foldManager.save(createdFile, "");
  
      new Notice("Note created successfully");
      return createdFile;
    } catch (err) {
      console.error(`Failed to create file: '${normalizedPath}'`, err);
      new Notice("Unable to create new file.");
    }
  }





// // import {Media, Poll, Tweet} from './models'
// // import {DownloadManager} from './downloadManager'
// import RTOPlugin from 'main'
// import {RTOSettings} from './settings'
// // import {unicodeSubstring} from './unicodeSubstring'
// import axios from "axios";




// export const getRaindrops = async (
//   app: App,
//   plugin: RTOPlugin,
// ): Promise<string> => {
//   let bearerToken
//   bearerToken = plugin.settings.bearerToken || ''
//   console.log('settings', bearerToken);
//   const api = 'https://api.raindrop.io/rest/v1/raindrops/-1';
//   const result = await axios.get(api , { headers: {"Authorization" : `Bearer ${token}`} });
//   return result.data.items;
// }


// /**
//  * Fetches a tweet object from the Twitter v2 API
//  * @param {string} id - The ID of the tweet to fetch from the API
//  * @param {string} bearer - The bearer token
//  * @returns {Tweet} - The tweet from the Twitter API
//  */
//  export const getTweet = async (id: string, bearer: string): Promise<Tweet> => {
//     const twitterUrl = new URL(`https://api.twitter.com/2/tweets/${id}`)
//     const params = new URLSearchParams({
//       expansions: 'author_id,attachments.poll_ids,attachments.media_keys',
//       'user.fields': 'name,username,profile_image_url',
//       'tweet.fields':
//         'attachments,public_metrics,entities,conversation_id,referenced_tweets',
//       'media.fields': 'url,alt_text',
//       'poll.fields': 'options',
//     })
  
//     let tweetRequest
//     try {
//       tweetRequest = await request({
//         method: 'GET',
//         url: `${twitterUrl.href}?${params.toString()}`,
//         headers: {Authorization: `Bearer ${bearer}`},
//       })
//     } catch (error) {
//       if (error.request) {
//         throw new Error('There seems to be a connection issue.')
//       } else {
//         console.error(error)
//         throw error
//       }
//     }
//     const tweet: Tweet = JSON.parse(tweetRequest)
//     if (tweet.errors) {
//       throw new Error(tweet.errors[0].detail)
//     }
//     if (tweet?.reason) {
//       switch (tweet.reason) {
//         case 'client-not-enrolled':
//         default:
//           throw new Error('There seems to be a problem with your bearer token.')
//       }
//     }
//     return tweet
//   }



// // /**
// //  * Parses out the tweet ID from the URL the user provided
// //  * @param {string} src - The URL
// //  */
// // export const getTweetID = (src: string): string => {
// //   // Create a URL object with the source. If it fails, it's not a URL.
// //   const url = new URL(src)
// //   const id = url.pathname
// //     .split('/')
// //     .filter(piece => !!piece) // remove empty strings from array
// //     .slice(-1)[0]
// //   if (!id) {
// //     throw new Error('URL does not seem to be a tweet.')
// //   }
// //   return id
// // }

// // /**
// //  * Fetches a tweet object from the Twitter v2 API
// //  * @param {string} id - The ID of the tweet to fetch from the API
// //  * @param {string} bearer - The bearer token
// //  * @returns {Tweet} - The tweet from the Twitter API
// //  */
// // export const getTweet = async (id: string, bearer: string): Promise<Tweet> => {
// //   const twitterUrl = new URL(`https://api.twitter.com/2/tweets/${id}`)
// //   const params = new URLSearchParams({
// //     expansions: 'author_id,attachments.poll_ids,attachments.media_keys',
// //     'user.fields': 'name,username,profile_image_url',
// //     'tweet.fields':
// //       'attachments,public_metrics,entities,conversation_id,referenced_tweets',
// //     'media.fields': 'url,alt_text',
// //     'poll.fields': 'options',
// //   })

// //   let tweetRequest
// //   try {
// //     tweetRequest = await request({
// //       method: 'GET',
// //       url: `${twitterUrl.href}?${params.toString()}`,
// //       headers: {Authorization: `Bearer ${bearer}`},
// //     })
// //   } catch (error) {
// //     if (error.request) {
// //       throw new Error('There seems to be a connection issue.')
// //     } else {
// //       console.error(error)
// //       throw error
// //     }
// //   }
// //   const tweet: Tweet = JSON.parse(tweetRequest)
// //   if (tweet.errors) {
// //     throw new Error(tweet.errors[0].detail)
// //   }
// //   if (tweet?.reason) {
// //     switch (tweet.reason) {
// //       case 'client-not-enrolled':
// //       default:
// //         throw new Error('There seems to be a problem with your bearer token.')
// //     }
// //   }
// //   return tweet
// // }

// // /**
// //  * Creates markdown table to capture poll options and votes
// //  * @param {Poll[]} polls - The polls array provided by the Twitter v2 API
// //  * @returns {string} - Markdown table as a string of the poll
// //  */
// // export const createPollTable = (polls: Poll[]): string[] => {
// //   return polls.map((poll: Poll) => {
// //     const table = ['\n|Option|Votes|', '|---|:---:|']
// //     const options = poll.options.map(
// //       option => `|${option.label}|${option.votes}|`
// //     )
// //     return table.concat(options).join('\n')
// //   })
// // }

// // /**
// //  * Filename sanitization. Credit: parshap/node-sanitize-filename
// //  * Rewrite to allow functionality on Obsidian mobile.
// //  */
// // const illegalRe = /[/?<>\\:*|"]/g
// // // eslint-disable-next-line no-control-regex
// // const controlRe = /[\x00-\x1f\x80-\x9f]/g
// // const reservedRe = /^\.+$/
// // const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i
// // const windowsTrailingRe = /[. ]+$/

// // /**
// //  * Sanitize a filename to remove any illegal characters.
// //  * Also keeps the filename to 255 bytes or below.
// //  * @param filename string
// //  * @returns string
// //  */
// // export const sanitizeFilename = (filename: string): string => {
// //   filename = filename
// //     .replace(illegalRe, '')
// //     .replace(controlRe, '')
// //     .replace(reservedRe, '')
// //     .replace(windowsReservedRe, '')
// //     .replace(windowsTrailingRe, '')
// //   return truncateBytewise(filename, 252)
// // }

// // /**
// //  * Truncate a string to a specified number of bytes
// //  * @param string the string to truncate
// //  * @param length the maximum length in bytes of the trimmed string
// //  * @returns string
// //  */
// // export const truncateBytewise = (string: string, length: number): string => {
// //   const originalLength = length
// //   while (new TextEncoder().encode(string).length > originalLength) {
// //     string = unicodeSubstring(string, 0, length--)
// //   }
// //   return string
// // }

// // /**
// //  * Creates a filename based on the tweet and the user defined options.
// //  * @param {Tweet} tweet - The entire tweet object from the Twitter v2 API
// //  * @param {filename} string - The filename provided by the user
// //  * @returns {string} - The filename based on tweet and options
// //  */
// // export const createFilename = (tweet: Tweet, filename = ''): string => {
// //   filename = filename ? filename : '[[handle]] - [[id]]'
// //   filename = filename.replace(/\.md$/, '') // remove md extension if provided
// //   filename = filename.replace('[[name]]', tweet.includes.users[0].name)
// //   filename = filename.replace('[[handle]]', tweet.includes.users[0].username)
// //   filename = filename.replace('[[id]]', tweet.data.id)
// //   filename = filename.replace('[[text]]', tweet.data.text)
// //   return sanitizeFilename(filename) + '.md'
// // }

// // /**
// //  * Creates media links to embed media into the markdown file
// //  * @param {Media[]} media - The tweet media object provided by the Twitter v2 API
// //  * @returns {string[]} - An array of markdown image links
// //  */
// // export const createMediaElements = (
// //   settings: RTOSettings,
// //   media: Media[]
// // ): string[] => {
// //   return media
// //     .map((medium: Media) => {
// //       if (settings.downloadAssets) {
// //         const assetLocation = settings.assetLocation || 'assets'
// //         const filepath = normalizePath(
// //           `${assetLocation}/${medium.media_key}.jpg`
// //         )
// //         switch (medium.type) {
// //           case 'photo':
// //             return `\n![${medium.alt_text ?? medium.media_key}](${filepath})`
// //           default:
// //             break
// //         }
// //       } else {
// //         switch (medium.type) {
// //           case 'photo':
// //             return `\n![${medium.alt_text ?? medium.media_key}](${medium.url})`
// //           default:
// //             break
// //         }
// //       }
// //     })
// //     .filter(medium => !!medium)
// // }

// // /**
// //  * Creates the entire Markdown string of the provided tweet
// //  */
// // export const buildMarkdown = async (
// //   app: App,
// //   plugin: TTM,
// //   downloadManager: DownloadManager,
// //   tweet: Tweet,
// //   type: 'normal' | 'thread' | 'quoted' = 'normal'
// // ): Promise<string> => {
// //   let metrics: string[] = []
// //   metrics = [
// //     `likes: ${tweet.data.public_metrics.like_count}`,
// //     `retweets: ${tweet.data.public_metrics.retweet_count}`,
// //     `replies: ${tweet.data.public_metrics.reply_count}`,
// //   ]

// //   let text = tweet.data.text
// //   const user = tweet.includes.users[0]

// //   /**
// //    * replace entities with markdown links
// //    */
// //   if (tweet.data?.entities) {
// //     /**
// //      * replace any mentions, hashtags, cashtags, urls with links
// //      */
// //     tweet.data.entities?.mentions &&
// //       tweet.data.entities?.mentions.forEach(({username}) => {
// //         text = text.replace(
// //           `@${username}`,
// //           `[@${username}](https://twitter.com/${username})`
// //         )
// //       })
// //     tweet.data.entities?.hashtags &&
// //       tweet.data.entities?.hashtags.forEach(({tag}) => {
// //         text = text.replace(
// //           `#${tag}`,
// //           `[#${tag}](https://twitter.com/hashtag/${tag}) `
// //         )
// //       })
// //     tweet.data.entities?.cashtags &&
// //       tweet.data.entities?.cashtags.forEach(({tag}) => {
// //         text = text.replace(
// //           `$${tag}`,
// //           `[$${tag}](https://twitter.com/search?q=%24${tag})`
// //         )
// //       })
// //     tweet.data.entities?.urls &&
// //       tweet.data.entities?.urls.forEach(url => {
// //         text = text.replace(
// //           url.url,
// //           `[${url.display_url}](${url.expanded_url})`
// //         )
// //       })
// //   }

// //   /**
// //    * Define the frontmatter as the name, handle, and source url
// //    */
// //   const frontmatter = [
// //     '---',
// //     `author: "${user.name}"`,
// //     `handle: "@${user.username}"`,
// //     `source: "https://twitter.com/${user.username}/status/${tweet.data.id}"`,
// //     ...metrics,
// //     '---',
// //   ]

// //   const assetPath = plugin.settings.assetLocation || 'assets'
// //   let markdown = [
// //     `![${user.username}](${
// //       plugin.settings.downloadAssets
// //         ? normalizePath(`${assetPath}/${user.username}-${user.id}.jpg`)
// //         : user.profile_image_url
// //     })`, // profile image
// //     `${user.name} ([@${user.username}](https://twitter.com/${user.username}))`, // name and handle
// //     '\n',
// //     `${text}`, // text of the tweet
// //   ]

// //   // markdown requires 2 line breaks for actual new lines
// //   markdown = markdown.map(line => line.replace(/\n/g, '\n\n'))

// //   // Add in other tweet elements
// //   if (tweet.includes?.polls) {
// //     markdown = markdown.concat(createPollTable(tweet.includes.polls))
// //   }

// //   if (tweet.includes?.media) {
// //     markdown = markdown.concat(
// //       createMediaElements(plugin.settings, tweet.includes?.media)
// //     )
// //   }

// //   // download images
// //   if (plugin.settings.downloadAssets) {
// //     downloadImages(
// //       app,
// //       downloadManager,
// //       tweet,
// //       plugin.settings.assetLocation || 'assets'
// //     )
// //   }

// //   // check for quoted tweets to be included
// //   if (tweet.data?.referenced_tweets) {
// //     for (const subtweet_ref of tweet.data?.referenced_tweets) {
// //       if (subtweet_ref?.type === 'quoted') {
// //         const subtweet = await getTweet(subtweet_ref.id, plugin.bearerToken)
// //         const subtweet_text = await buildMarkdown(
// //           app,
// //           plugin,
// //           downloadManager,
// //           subtweet,
// //           'quoted'
// //         )
// //         markdown.push('\n\n' + subtweet_text)
// //       }
// //     }
// //   }

// //   // indent all lines for a quoted tweet
// //   if (type === 'quoted') {
// //     markdown = markdown.map(line => '> ' + line)
// //   }

// //   switch (type) {
// //     case 'normal':
// //       return frontmatter.concat(markdown).join('\n')
// //     case 'thread':
// //       return '\n\n---\n\n' + markdown.join('\n')
// //     case 'quoted':
// //       return '\n\n' + markdown.join('\n')
// //     default:
// //       return '\n\n' + markdown.join('\n')
// //   }
// // }

// // export const downloadImages = (
// //   app: App,
// //   downloadManager: DownloadManager,
// //   tweet: Tweet,
// //   assetLocation = 'assets'
// // ): void => {
// //   const user = tweet.includes.users[0]

// //   // create the image folder
// //   app.vault.createFolder(assetLocation).catch(() => {})

// //   let filesToDownload = []
// //   filesToDownload.push({
// //     url: user.profile_image_url,
// //     title: `${user.username}-${user.id}.jpg`,
// //   })

// //   tweet.includes?.media?.forEach((medium: Media) => {
// //     switch (medium.type) {
// //       case 'photo':
// //         filesToDownload.push({
// //           url: medium.url,
// //           title: `${medium.media_key}.jpg`,
// //         })
// //         break
// //       default:
// //         break
// //     }
// //   })

// //   //Filter out tweet images that already exist locally
// //   filesToDownload = filesToDownload.filter(
// //     file => !doesFileExist(app, `${assetLocation}/${file.title}`)
// //   )

// //   if (!filesToDownload.length) {
// //     return
// //   }

// //   downloadManager.addDownloads(
// //     filesToDownload.map(async file => {
// //       const imageRequest = await fetch(file.url, {
// //         method: 'GET',
// //       })
// //       const image = await imageRequest.arrayBuffer()
// //       return await app.vault.createBinary(
// //         `${assetLocation}/${file.title}`,
// //         image
// //       )
// //     })
// //   )
// // }

// // export const doesFileExist = (app: App, filepath: string): boolean => {
// //   filepath = normalizePath(filepath)
// //   // see if file already exists
// //   let file: TAbstractFile
// //   try {
// //     file = app.vault.getAbstractFileByPath(filepath)
// //   } catch (error) {
// //     return false
// //   }
// //   return !!file
// // }
