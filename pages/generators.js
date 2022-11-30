import Head from 'next/head'
import {useState} from 'react'
import styles from '../styles/Home.module.css'
import {
  generateVoice,
  generateImage,
  generateDiffSound,
  generatePixelArt,
  generateBlipResult,
} from '../generators/generator'

// import Reader from 'riff-wave-reader/lib/reader'

export default function Generators() {
  const [loadingVoice, setLoadingVoice] = useState(false)
  const [generatedVoice, setGeneratedVoice] = useState(null)
  const [transcript, setTranscript] = useState('')
  const [voice, setVoice] = useState('')

  const [loadingImage, setLoadingImage] = useState(false)
  const [generatedImage, setGeneratedImage] = useState(null)

  const [loadingSound, setLoadingSound] = useState(false)
  const [generatedSound, setGeneratedSound] = useState(null)
  const [sound, setSound] = useState('')

  const [loadingPixelArt, setLoadingPixelArt] = useState(false)
  const [generatedPixelArt, setGeneratedPixelArt] = useState(null)

  const [loadingBlip, setLoadingBlip] = useState(false)
  const [generatedBlip, setGeneratedBlip] = useState('')
  const [blipImageUrl, setBlipImageUrl] = useState('')

  // generateVoice
  const handleTranscript = e => {
    setTranscript(e.target.value)
  }
  const handleVoice = e => {
    setVoice(e.target.value)
  }
  async function generateTestVoice() {
    const newVoice = generateVoice()
    const voiceArrayBuffer = await newVoice({s: transcript, voice})
    const blob = new Blob([await (await fetch(voiceArrayBuffer)).arrayBuffer()])
    const audioFromBlob = URL.createObjectURL(blob)
    setGeneratedVoice(audioFromBlob)
    setLoadingVoice(false)
  }

  // generateImage
  async function generateTestImage() {
    setLoadingImage(true)
    let description = 'test generate image'
    const arrayBuffer = generateImage({
      modelName: null,
      s: 'test',
    })
    let imgArrayBuffer = await arrayBuffer(description)

    const blob = new Blob([imgArrayBuffer], {
      type: 'image/png',
    })
    const image = URL.createObjectURL(blob)
    setGeneratedImage(image)
    setLoadingImage(false)
  }

  // generateDiffSound
  const handleSound = e => {
    setSound(e.target.value)
  }
  async function generateTestDiffSound() {
    // setGeneratedSound(true)
    const newSound = generateDiffSound()
    const soundArrayBuffer = await newSound({s: sound})
    const blob = new Blob([await (await fetch(soundArrayBuffer)).arrayBuffer()])
    const soundFromBlob = URL.createObjectURL(blob)
    setGeneratedSound(soundFromBlob)
    setLoadingSound(false)
  }

  // generate pixel art
  async function generateTestPixelArt() {
    setLoadingPixelArt(true)
    const newPixelArt = generatePixelArt()
    const pixelArtBuffer = await newPixelArt()

    const blob = new Blob([pixelArtBuffer], {
      type: 'image/png',
    })
    const image = URL.createObjectURL(blob)
    setGeneratedPixelArt(image)
    setLoadingPixelArt(false)
  }

  // generate BLIP result
  const handleBlip = e => {
    setBlipImageUrl(e.target.value)
  }
  async function generateBlip() {
    const newBlip = generateBlipResult()
    const result = await newBlip({s: blipImageUrl})
    setGeneratedBlip(result)
    setLoadingBlip(false)
  }

  // TODO styling!!
  return (
    <div className={styles.container}>
      <Head>
        <title>Test - Generators</title>
        <meta name="description" content="Lore engine" />
      </Head>

      <main className={styles.main}>
        <p>Generate voice using tiktalknet</p>
        <div>Endpoints:
          <p>/tts?s={"{s}"}&voice={"{voice}"}</p>
          <ul>
            <li>s (string): text to convert</li>
            <li>voice (string | optional): the id of the voice to use</li>
          </ul>
        </div>
        <button
          // style={main-btn}
          // onClick={generateTestVoice}
          onClick={() => setLoadingVoice(true)}
        >
          Generate Test Voice
        </button>
        {loadingVoice &&
          <div>
            <input
              type='text'
              id='transcript'
              name='transcript'
              placeholder='Transcript'
              onChange={handleTranscript}
              value={transcript}
            />
            <br />
            <input
              type='text'
              id='voice'
              name='voice'
              placeholder='Voice ID'
              onChange={handleVoice}
              value={voice}
            />
            <br />
            <button onClick={generateTestVoice}>Generate</button>
          </div>
        }
        {!loadingVoice && !generatedVoice && <p>No voice data</p>}
        {!loadingVoice && generatedVoice && 
          <div>
            <br />
            <audio controls src={generatedVoice}></audio>
            <br />
          </div>
        }
        <hr />
        <p>Generate image using Stable Diffusion</p>
        <div>Endpoints:
          <p>/image?s={"{s}"}&model={"{model}"}</p>
          <ul>
            <li>s (string): image url</li>
            <li>model (string | optional): the id of the model to use</li>
          </ul>
        </div>
        <button
          // style={main-btn}
          onClick={generateTestImage}
        >
          Generate Test Image
        </button>
        {loadingImage && <p>Loading...</p>}
        {!loadingImage && !generatedImage && <p>No image data</p>}
        {!loadingImage && generatedImage && 
          <div>
            <br />
            <img src={generatedImage} alt='image' />
            <br />
          </div>
        }
        <hr />
        <p>Generate sound with Diffsound (AWS)</p>
        <div>Endpoints:
          <p>/sound?s={"{s}"}</p>
          <ul>
            <li>s (string): text to convert</li>
          </ul>
        </div>
        <button onClick={() => setLoadingSound(true)}>
          Generate Test Sound
        </button>
        {loadingSound &&
          <div>
            <input
              type='text'
              id='sound'
              name='sound'
              placeholder='Sound'
              onChange={handleSound}
              value={sound}
            />
            <br />
            <button onClick={generateTestDiffSound}>Generate</button>
          </div>
        }
        {!loadingSound && !generatedSound && <p>No sound data</p>}
        {!loadingSound && generatedSound &&
          <div>
            <br />
            <audio controls src={generatedSound}></audio>
            <br />
          </div>
        }
        <hr />
        <p>Generate Pixel Art (AWS)</p>
        <div>Endpoints:
        <p>/generate : kick off a new image generation job and add it to the backlog. returns the id of the job</p>
        <p>/generate_result : retrieve </p>
        <p>/prompt_tags : returns the current tags added to prompts</p>
        </div>
        <button
          onClick={generateTestPixelArt}
        >
          Generate Pixel Art
        </button>
        {loadingPixelArt && <p>Loading, can take up to one minute...</p>}
        {!loadingPixelArt && !generatedPixelArt && <p>No Pixel Art data</p>}
        {!loadingPixelArt && generatedPixelArt && 
          <div>
            <br />
            <img src={generatedPixelArt} alt='image' />
            <br />
          </div>
        }
        <hr />
        <p>Generate image captioning using BLIP</p>
        <div>Endpoints:
        <p>POST /upload</p>
          <ul>
            <li>FormData task (string | optional): the task to run (image_captioning, vqa, feature_extraction or text_matching)</li>
            <li>FormData file (file): the image to get the text caption</li>
          </ul>
          <p>POST /upload/url</p>
          <p>Body:</p>
          <p>
            {"{"}
              "task": {"<task>"},
              "file": {"<string>"}
            {"}"}
          </p>
          <ul>
            <li>Body task (string | optional): the task to run (image_captioning, vqa, feature_extraction or text_matching)</li>
            <li>Body file (string): the image url to get the text caption</li>
          </ul>
        </div>
        <button
          onClick={() => setLoadingBlip(true)}
        >
          Generate BLIP data
        </button>
        {loadingBlip &&
          <div>
            <input
              type='text'
              id='img_url'
              name='img_url'
              placeholder='Image URL'
              onChange={handleBlip}
              value={blipImageUrl}
            />
            <br />
            <button onClick={generateBlip}>Generate</button>
          </div>
        }
        {!loadingBlip && !generatedBlip && <p>No BLIP data</p>}
        {!loadingBlip && generatedBlip && 
          <div>
            <br />
            <span>{generatedBlip}</span>
            <br />
          </div>
        }
        <hr />
      </main>
    </div>
  )
}
