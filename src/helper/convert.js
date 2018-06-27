import moment from 'moment'
import momentDuration from 'moment-duration-format' // duration wont work if remove this

// PT00H00M00S.. to hh:mm:ss or mm:ss format
export const convert_duration = (duration) => {
  let con = moment.duration(duration).asSeconds()
  let converted = moment.duration(con, "seconds").format(con >= 3600 ? "hh:mm:ss" : "mm:ss" ,{trim:false}).toString()
  if(converted.charAt(0) === '0'){
    converted = converted.substring(1)
  }
  return converted
}

// convert seconds to hh:mm:ss or mm:ss format
export const convert_duration_playing = (duration) => {
  let converted = moment.duration(duration, "seconds").format(duration >= 3600 ? "hh:mm:ss" : "mm:ss" ,{trim:false}).toString()
  if(converted.charAt(0) === '0'){
    converted = converted.substring(1)
  }
  return converted
}

// Try to simplify a youtube title
export const convert_title = (title) => {
  let trimmed = title.replace(/\[.*?\]|《.*?》|【.*?】|@(.*)|\(.*?\)|\|(.*)|(\s?)MV(\s?)/g,"")
  return trimmed
}


export const convert_playlist = (title) => {
  let trimmed = title.substring(18)
  return trimmed
}
