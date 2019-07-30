import React, {useCallback, useEffect, useRef, useState} from 'react'
import classNames from 'classnames'
import CameraTrigger from '../camera-trigger'
import Layout from '../layout'
import './styles.scss'
import { func } from 'prop-types';

const App = () => {
    const cameraStream = useRef<HTMLVideoElement>(null)
    const photoCanvas = useRef<HTMLCanvasElement>(null)
    const [isPhoto, setIsPhoto] = useState(false)
    const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null)
    const [scale, setScale] = useState({transform: ''})
    const [dimensions, setDimensions] = useState({x: 0, y: 0})

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
        console.log('triggered')
        if (canvasContext && photoCanvas.current && cameraStream.current) {
            const {width, height} = photoCanvas.current
            const {videoWidth: cW, videoHeight: cH} = cameraStream.current
            const isScaledByHeight = height - cH > width - cW
            let sc = 1

            if (scale.transform) {
                sc = Number(scale.transform.substring(6,11))
            }

            const sourceX = isScaledByHeight ? (cW-(cW/sc))/2 : 0
            const sourceY = isScaledByHeight ? 0 : (cH-(cH/sc))/2
            const sourceWidth = isScaledByHeight ? Math.round(cW/sc) : cW
            const sourceHeight = isScaledByHeight ? cH : Math.round(cH/sc)


            if (!isPhoto ) {
                canvasContext.drawImage(cameraStream.current, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height)
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
           .then(scaleCanvas)
    }

    function setCameraStream(stream: any) {
        if (cameraStream.current) {
            cameraStream.current.srcObject = stream
        }
    }
/**
 * Scale the cameraStream so the displayed video is full height
 */
    function scaleCanvas() {
        setTimeout(() => {
        if (cameraStream.current) {
                const {clientHeight, clientWidth} = document.documentElement
                const {
                    videoHeight: cameraStreamHeight,
                    videoWidth: cameraStreamWidth
                } = cameraStream.current

                const heightScale = cameraStreamHeight * (clientWidth / cameraStreamWidth)
                const widthScale = cameraStreamWidth * (clientHeight / cameraStreamHeight)
                const scaleFactor = cameraStreamWidth > cameraStreamHeight ? clientHeight / heightScale : clientWidth / widthScale

                setScale({transform: `scale(${scaleFactor})`})
            }
        }, 1000)
    }

    /**
     * Set dimensions need for canvas to display image as seen in camera stream
     */
    function updateDimensions() {
        const {clientHeight, clientWidth} = document.documentElement

        setDimensions({x: clientWidth, y: clientHeight})
    }

    useEffect(requestCamera, [])

    useEffect(getCanvasContext, [])

    useEffect(updateDimensions, [])

    const photoClasses = classNames('c-app__photo', {
        'c--hidden': isPhoto
    })

    return (
        <Layout>
            <div style={{display: 'flex', justifyContent: 'center', overflow: 'hidden'}}>
            <canvas className={photoClasses} ref={photoCanvas} height={dimensions.y} width={dimensions.x} />
            <video ref={cameraStream} style={{...scale, height:'100vh', width: '100vw'}} autoPlay playsInline/>
            <CameraTrigger onChange={onChange} onClick={capturePhoto} />
            </div>
        </Layout>
    )
}

export default App
