// import {stableDiffusionUrl} from '../../constants/endpoints.js'
import fetch from 'node-fetch'
import {
  voiceUrl,
  stableDiffusionUrl,
  diffsoundUrl,
  pixelArtUrl,
  blipUrl,
} from '../constants/endpoints-constants'

export const generateVoice = () => async ({s, voice} = {}) => {
  return `${voiceUrl}/tts?s=${s}&voice=${voice}`
}

export const generateImage = ({
  modelName,
  prefix,
}) => async ({
  name,
  description,
} = {}) => {
  const s = `${prefix} ${description}`
  const u = `${stableDiffusionUrl}/image?s=${encodeURIComponent(s)}&model=${modelName}`
  const res = await fetch(u)
  if (res.ok) {
    const arrayBuffer = await res.arrayBuffer()
    if (arrayBuffer.byteLength > 0) {
      return arrayBuffer
    } else {
      throw new Error(`generated empty image`)
    }
  } else {
    throw new Error(`invalid status: ${res.status}`)
  }
}

export const generateDiffSound = () => async ({s} = {}) => {
  return `${diffsoundUrl}/sound?s=${s}`
}

export const generatePixelArt = () => async () => {
  const delay = ms => new Promise(res => setTimeout(res, ms))
  let queryId = ''
  const generate = `${pixelArtUrl}/generate?steps=25&seed=30&s=snowy mountains`
  await fetch(generate)
    .then(r => r.json())
    .then(d => {queryId = d.id})
    .catch()
  await delay(50000)
  const pixelArt = `${pixelArtUrl}/generate_result?query_id=${queryId}`
  const res = await fetch(pixelArt)
  if (res.ok) {
    const arrayBuffer = await res.arrayBuffer()
    if (arrayBuffer.byteLength > 0) {
      return arrayBuffer
    } else {
      throw new Error(`generated empty image`)
    }
  } else {
    throw new Error(`invalid status: ${res.status}`)
  }
}

// export const generateDiffSound = () => async ({s} = {}) => {
export const generateBlipResult = () => async ({s} = {}) => {
  const u = `${blipUrl}/upload/url?task=image_captioning&img_url=${s}`

  await fetch(u, {  
    mode: 'no-cors',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Cross-Origin-Embedder-Policy': 'same-origin'
    }    
  })
    .then(r => r.json())
    .then(d => {
      console.log(d)
      return d
    })
    .catch(e => {console.log(e)})
}
