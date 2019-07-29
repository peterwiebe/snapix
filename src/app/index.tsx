import React, {useCallback, useEffect, useRef, useState} from 'react'
import classNames from 'classnames'
import CameraTrigger from '../camera-trigger'
import Layout from '../layout'
import './styles.scss'

const App = () => {
    const cameraStream = useRef<HTMLVideoElement>(null)
    const photoCanvas = useRef<HTMLCanvasElement>(null)
    const [isPhoto, setIsPhoto] = useState(false)
    const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null)

    const onChange: (file: File) => void = useCallback((file) => {
        const formData = new FormData()
        formData.append('photo', file)
        const url = 'http://192.168.0.106:9000/.netlify/functions/upload'
        fetch(url, {method: 'post', body: formData})
    }, [])

    // const openCamera: () => void = useCallback(() => {
    //     const constraints = {audio: false, video: true}
    //     navigator.mediaDevices.getUserMedia(constraints)
    // }, [])

    function capturePhoto() {
        if (canvasContext && photoCanvas.current && cameraStream.current) {
            const {width, height} = photoCanvas.current

            if (!isPhoto ) {
                canvasContext.drawImage(cameraStream.current, 0, 0, width, height)
                setIsPhoto(true)
            } else {
                canvasContext.clearRect(0, 0, width, height)
                setIsPhoto(false)
            }
        }
    }

    function getCanvasContext() {
        if (photoCanvas.current) {
            setCanvasContext(photoCanvas.current.getContext('2d'))
        }
    }

    function requestCamera() {
        const constraints = {
            audio: false,
            video: {
                facingMode: "environment"
            }
        }
        navigator.mediaDevices.getUserMedia(constraints)
           .then(setCameraStream)
    }

    function setCameraStream(stream: any) {
        if (cameraStream.current) {
            cameraStream.current.srcObject = stream //
        }
    }

    useEffect(requestCamera, [])

    useEffect(getCanvasContext, [])

    const photoClasses = classNames('c-app__photo', {
        hidden: isPhoto
    })

    return (
        <Layout>
            <canvas className={photoClasses} ref={photoCanvas} height={240}/>
            <video ref={cameraStream} style={{height:'100vh', width: '100vw'}} autoPlay playsInline/>
            <CameraTrigger onChange={onChange} onClick={capturePhoto} />
        </Layout>
    )
}

export default App
