import { useState } from "react"
import { Button } from "../../../components/ui/button"
import { ArrowRight } from 'lucide-react'
import { Buffer } from 'buffer'

let stream : MediaStream;
let recordedChunks : any = []
let mediaRecorder : MediaRecorder;

function Menu({ items }) {
  return (
    <>
    <div className="absolute top-0 left-0 h-[100%] w-[100%] z-15 origin-top-left bg-black opacity-45 focus:outline-none flex justify-center items-center">
    </div>
    <div className="absolute top-0 left-0 h-[100%] w-[100%] z-15 origin-top-left z-20 flex justify-center items-center">
      <div className="bg-white min-w-1/2 rounded-lg p-4 max-w-fit flex flex-col justify-center items-center gap-3">
        {items.map((item) => (
          <Button
            key={item.label}
            className="w-fit text-left text-[#FF4B5C] hover:bg-white/90"
            variant="ghost"
            onClick={item.click}
          >
            {item.label}
          </Button>
        ))}
      </div>
    </div>
    </>
  )
}


function App(): JSX.Element {

  const [menuItems, setMenuItems] = useState([])

  const [start, setStart] = useState(false)

  const handleDataAvailable = (event) => {
    recordedChunks.push(event.data);
  }

  const handleStop = async () => {
    const blob = new Blob(recordedChunks, { 'type' : 'video/webm; codecs=vp9' });
    
    const buffer = Buffer.from(await blob.arrayBuffer());

    window.electron.ipcRenderer.send('save-video', buffer);

    recordedChunks = [];
  }

  const selectSource = async (source) => {

    const constraints = {
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: source.id
        }
      }
    };

    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      const videoElement = document.getElementById('video') as HTMLMediaElement;
      if (videoElement) {

        // Preview the source in a video element
        videoElement.srcObject = stream;
        videoElement.play();
      }
    } catch (error) {
      console.error(error);
    }

    setMenuItems([]);

    const options = { mimeType: 'video/webm; codecs=vp9'}
    mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleStop;
  }

  const handleStartAndStop = async () => {

    if (start) {
      mediaRecorder.stop();
      setStart(false);
    } else {
      mediaRecorder.start();
      setStart(true);
    }

  }

  const handlePickSource = async () => {
    const inputSource = await window.electron.ipcRenderer.invoke('pick-source')

    const template = inputSource.map((source) => {
        return {
          label: source.name,
          click: () => selectSource(source)
        }
    })
    
    setMenuItems(template);
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#FF4B5C] via-[#FF7F50] to-[#FFD700]"
        aria-hidden="true"
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <main className="mt-8 sm:mt-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              E-Studios
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/80 max-w-2xl mx-auto">
              Record to your heart's content and present your ideas to the world
            </p>

            <div className="h-fit border border-white mt-5">
              <video id="video" className="w-full h-full"></video>
            </div>

            <div className="mt-10 flex items-center justify-center gap-x-6 mb-10">
              <Button 
                size="lg"
                className="bg-white text-[#FF4B5C] hover:bg-white/90"
                onClick={handlePickSource}
                id="videoSelectBtn"
              >
                Pick Source
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg"
                className="bg-white text-[#FF4B5C] hover:bg-white/90"
                onClick={handleStartAndStop}
              >
                {start && "Stop"} {!start && "Start"}
              </Button>
            </div>
          </div>
        </main>
      </div>
      {menuItems.length > 0 && <Menu items={menuItems} />}
    </div>
  )
}

export default App
