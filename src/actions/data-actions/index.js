import * as actionTypes from './actionTypes'
import * as task from '../task-actions'


/**
 * Reset data
 *
 * @param {string} target - target for reset
 */
export const data_reset = (target) => {
  return {
    type : actionTypes.DATA_RESET,
    target
  }
}

/**
 * Fetch success
 *
 * @param {object} data - fetched data
 * @param {string} target - target
 */
export const fetch_success = (data, target) => {
  return {
    type : actionTypes.FETCH_SUCCESS,
    data,
    target
  }
}

/**
 * Fetch more data
 *
 * @param {object} data - addditional data
 * @param {string} target - target
 */
export const fetch_more = (data, target) => {
  return {
    type : actionTypes.FETCH_MORE,
    data,
    target
  }
}

/**
 * Get the term to be searched
 *
 * @param {string} term - search term
 */
export const fetch_term = (term) => {
  return {
    type : actionTypes.FETCH_TERM,
    term
  }
}


/**
 * Fetch data from Youtube api
 *
 * @param {string} term - search term
 * @param {string} pageToken - nextpage token
 */
export const fetch_data_from_api = (term, pageToken) => (dispatch) => {
  dispatch(fetch_term(term))
  // nothing to search, reset data
  if(term === ''){
    dispatch(data_reset("search_list"))
  }else{
    // console.log("loading start")
    dispatch(task.task_loading('search_list'))
    let request = {
      q : term,
      part : 'id,snippet',
      maxResults : 10,
      topicId: '/m/04rlf',
      type: 'video',
      videoCategoryId: 10
    }

    if (pageToken){
      request.pageToken = pageToken
    }

    window.gapi.client.youtube.search.list(request)
      .then((res)=>{
        // console.log('we got result ', res)
        if(res.status === 200){
          if(pageToken){
            dispatch(fetch_song_ids(res))
              .then((data)=>{
                // console.log("BEFORE MERGE :: Got result before merge")
                dispatch(merge_song_details(res, data))
                  .then((res)=>{
                    // console.log("BEFORE RESHAPE :: Got result before reshape")
                    dispatch(tailor_song_data(res))
                      .then((res)=>{
                        // console.log("BEFORE DISPATCH :: Got final data before dispatch ", res)
                        dispatch(fetch_more(res,"search_list"))
                        // console.log("loading done")
                        dispatch(task.task_done(0,'search_list',null))

                      })
                      .catch((err)=>{
                        // console.log("ERR BEFORE DISPATCH :: ERR final data before dispatch ", err)
                      })
                  })
                  .catch((err)=>{
                    // console.log("ERR BEFORE RESHAPE :: ERR result before reshape")
                    // console.log(err)
                  })
              })
              .catch((err) => {
                // console.log("ERR BEFORE MERGE :: ERR result before merge")
                // console.log(err)
              })
          }
          else{
            dispatch(fetch_song_ids(res))
              .then((data)=>{
                  // console.log("BEFORE MERGE :: Got result before merge")
                dispatch(merge_song_details(res, data))
                  .then((res)=>{
                    // console.log("BEFORE RESHAPE :: Got result before reshape ", res)
                    dispatch(tailor_song_data(res))
                      .then((res)=>{
                        // console.log("BEFORE DISPATCH :: Got final data before dispatch ", res)
                        // console.log(res)
                        dispatch(fetch_success(res,"search_list"))
                        // console.log("loading done")
                        // Make a fucnction done -> idle
                        dispatch(task.task_done(0,'search_list',null))

                        //
                      })
                      .catch((err)=>{
                        // console.log("ERR BEFORE DISPATCH :: ERR final data before dispatch ", err)
                      })
                  })
                  .catch((err)=>{
                    // console.log("ERR BEFORE RESHAPE :: ERR result before reshape ", err)
                  })
              })
              .catch((err) => {
                // console.log("ERR BEFORE MERGE :: ERR result before merge ", err)
              })
          }
        }
      })
      .catch((err)=>{
        // console.log("ERR FETCH FROM API :: ERR FETCH  FROM API ", err)
        dispatch(task.task_error('search'))
        // console.log(err)
      })
  }
}

/**
 * Retrieve a detailed information of the fetched songs
 *
 * @returns {Promise<object>} A promise that contains detailed information of
 * fetched songs
 */
const fetch_song_ids = (data) => dispatch => new Promise((resolve, reject)=> {
  // console.log("ENTER FETCH SONG IDS")
  let promise = data.result.items.map(item=>{
    return item.id.videoId
  })

  Promise.resolve(promise)
    .then((res)=>{
      // console.log("we are about to start fetchsongdetail and " , res)
      dispatch(fetch_song_details(res))
        .then((res)=>{
          // // console.log("Promise all get result!")
          // // console.log(res)
          resolve(res)
        })
        .catch((err)=>{
          // console.log("ERR FETCH SONG DETAILS ", err)
          reject(err)
        })

    })
    .catch((err)=>{
      reject(err)
    })
})

/**
 * Make API call to fetch detailed information of the provided data
 *
 * @param {Array} data - collection of ids to be searched
 * @returns {Promise<object>} A promise that contains detailed information of
 * fetched songs
 */
const fetch_song_details = (data) => dispatch => new Promise((resolve, reject)=>{
  // console.log("ENTER song details....")
  let request = {
    part : 'contentDetails',
    id : data.toString()
  }

  window.gapi.client.youtube.videos.list(request)
    .then((res)=>{
      // // console.log("we got video's detail 12 items")
      // // console.log(res)
      resolve(res)
    })
    .catch((err)=>{
      // console.log("ERR failed to fetch details")
      reject(err)
    })
})


/**
 * Make a new detailed song data
 *
 * @param {Object} original - original song data
 * @param {Object} additional - detailed song data of the original song data
 * @returns {Promise<object>}  - Original song data object with additional song data
 *
 */
const merge_song_details = (original, additional) => dispatch => new Promise((resolve, reject) => {
  // console.log("ENTER merge start..")
  // // console.log("original ", original)
  // // console.log("additional ", additional)
  let promise = original.result.items.map((item,idx) => {
    item.contentDetails = additional.result.items[idx].contentDetails
    return item
  })

  Promise.resolve(promise)
    .then((res)=>{
      // console.log("array res received, but we return original object")
      // console.log("merge complete ? ", res, original)
      // // console.log(original)
      resolve(original)
    })
    .catch((err)=> {
      // console.log("ERR PROMISE IN MERGE SONG FAIL", err)
      reject(err)
    })
})

const tailor_song_data = (data) => dispatch => new Promise((resolve, reject)=>{
  // console.log("let's reshape data structure for the convenience")
  let items = []
  let final = {}
  // final.nextPageToken = data.result.nextPageToken
    let promise = data.result.items.map((item,idx)=>{
      let song = {}
      return new Promise((resolve, reject)=>{
        song.videoId = item.id.videoId
        song.duration = item.contentDetails.duration
        song.title = item.snippet.title
        resolve(song)
      })
      .then((res)=>{
        // // console.log(res)
        items.push(res)
        // resolve(items)
      })
      .catch((err)=>{
        // console.log('ERR iteration map in tailpr song data', err)
      })
    })

    Promise.all(promise)
    .then(()=>{
      final.items = items
      final.nextPageToken = data.result.nextPageToken
      resolve(final)
    })
})
