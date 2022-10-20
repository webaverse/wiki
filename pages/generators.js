import Head from 'next/head'
import {useState} from 'react'
import styles from '../styles/Home.module.css'
import {
  generateText,
  generateVoice,
  generateImage,
  generateDiffSound,
  generateMotionDiffusion,
  generateObjectOrConsumable,
  generateGet3DObject,
  generateMusic,
  generateWeaviateCharacter,
  generateSprite,
} from '../generators/generator'

// import Reader from 'riff-wave-reader/lib/reader'

export default function Generators() {
  const [loadingText, setLoadingText] = useState(false)
  const [generatedText, setGeneratedText] = useState(null)

  const [loadingVoice, setLoadingVoice] = useState(false)
  const [generatedVoice, setGeneratedVoice] = useState(null)
  const [transcript, setTranscript] = useState('')
  const [voice, setVoice] = useState('')

  const [loadingImage, setLoadingImage] = useState(false)
  const [generatedImage, setGeneratedImage] = useState(null)

  const [loadingSound, setLoadingSound] = useState(false)
  const [generatedSound, setGeneratedSound] = useState(null)

  const [loadingMotion, setLoadingMotion] = useState(false)
  const [generatedMotion, setGeneratedMotion] = useState(null)

  const [loadingObject, setLoadingObject] = useState(false)
  const [generatedObject, setGeneratedObject] = useState(null)

  const [loadingGet3DObject, setLoadingGet3DObject] = useState(false)
  const [generatedGet3DObject, setGeneratedGet3DObject] = useState(null)

  const [loadingMusic, setLoadingMusic] = useState(false)
  const [generatedMusic, setGeneratedMusic] = useState(null)

  const [loadingCharacter, setLoadingCharacter] = useState(false)
  const [generatedCharacter, setGeneratedCharacter] = useState(null)

  const [loadingSprite, setLoadingSprite] = useState(false)
  const [generatedSprite, setGeneratedSprite] = useState(null)

  // generateText
  async function generateTestText() {
    setLoadingText(true)
    // TODO generateText()
    setLoadingText(false)
  }

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
  async function generateTestDiffSound() {
    setLoadingSound(true)
    // TODO generateDiffSound()
    setLoadingSound(false)
  }

  // generateMotionDiffusion
  async function generateTestMotionDiffusion() {
    setLoadingMotion(true)
    // TODO generateMotionDiffusion()
    setLoadingMotion(false)
  }

  // generateObjectOrConsumable
  async function generateTestObjectOrConsumable() {
    setLoadingObject(true)
    // TODO generateObjectOrConsumable()
    setLoadingObject(false)
  }

  // generateGet3DObject
  async function generateTestGet3DObject() {
    setLoadingGet3DObject(true)
    // TODO generateGet3DObject()
    setLoadingGet3DObject(false)
  }

  // generateMusic
  async function generateTestMusic() {
    setLoadingMusic(true)
    // TODO generateMusic()
    setLoadingMusic(false)
  }

  // generateWeaviateCharacter
  async function generateTestWeaviateCharacter() {
    setLoadingCharacter(true)
    // TODO generateWeaviateCharacter()
    setLoadingCharacter(false)
  }

  // generateSprite
  async function generateTestSprite() {
    setLoadingSprite(true)
    // TODO generateSprite()
    setLoadingSprite(false)
  }

  // TODO styling!!
  return (
    <div className={styles.container}>
      <Head>
        <title>Test - Generators</title>
        <meta name="description" content="Lore engine" />
      </Head>

      <main className={styles.main}>
        <button
          // style={main-btn}
          onClick={generateTestText}
        >
          Generate Test Text
        </button>
        {loadingText && <p>Loading...</p>}
        {!loadingText && !generatedText && <p>No data</p>}
        {/* render result here */}
        <hr />
        <button
          // style={main-btn}
          // onClick={generateTestVoice}
          onClick={() =>setLoadingVoice(true)}
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
        {!loadingVoice && !generatedVoice && <p>No data</p>}
        {!loadingVoice && generatedVoice && 
          <div>
            <br />
            <audio controls src={generatedVoice}></audio>
            <br />
          </div>
        }
        <hr />
        <button
          // style={main-btn}
          onClick={generateTestImage}
        >
          Generate Test Image
        </button>
        {loadingImage && <p>Loading...</p>}
        {!loadingImage && !generatedImage && <p>No data</p>}
        {!loadingImage && generatedImage && 
          <div>
            <br />
            <img src={generatedImage} alt='image' />
            <br />
          </div>
        }
        <hr />
        <button
          // style={main-btn}
          onClick={generateTestDiffSound}
        >
          Generate Test Sound
        </button>
        {loadingSound && <p>Loading...</p>}
        {!loadingSound && !generatedSound && <p>No data</p>}
        {/* render result here */}
        <hr />
        <button
          // style={main-btn}
          onClick={generateTestMotionDiffusion}
        >
          Generate Test Motion
        </button>
        {loadingMotion && <p>Loading...</p>}
        {!loadingMotion && !generatedMotion && <p>No data</p>}
        {/* render result here */}
        <hr />
        <button
          // style={main-btn}
          onClick={generateTestObjectOrConsumable}
        >
          Generate Test Object/Consumable
        </button>
        {loadingObject && <p>Loading...</p>}
        {!loadingObject && !generatedObject && <p>No data</p>}
        {/* render result here */}
        <hr />
        <button
          // style={main-btn}
          onClick={generateTestGet3DObject}
        >
          Generate Test 3D Object
        </button>
        {loadingGet3DObject && <p>Loading...</p>}
        {!loadingGet3DObject && !generatedGet3DObject && <p>No data</p>}
        {/* render result here */}
        <hr />
        <button
          // style={main-btn}
          onClick={generateTestMusic}
        >
          Generate Test Music
        </button>
        {loadingMusic && <p>Loading...</p>}
        {!loadingMusic && !generatedMusic && <p>No data</p>}
        {/* render result here */}
        <hr />
        <button
          // style={main-btn}
          onClick={generateTestWeaviateCharacter}
        >
          Generate Test Character
        </button>
        {loadingCharacter && <p>Loading...</p>}
        {!loadingCharacter && !generatedCharacter && <p>No data</p>}
        {/* render result here */}
        <hr />
        <button
          // style={main-btn}
          onClick={generateTestSprite}
        >
          Generate Test Sprite
        </button>
        {loadingSprite && <p>Loading...</p>}
        {!loadingSprite && !generatedSprite && <p>No data</p>}
        {/* render result here */}
        <hr />
      </main>
    </div>
  )
}
