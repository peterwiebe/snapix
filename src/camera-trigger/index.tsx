import React, {useCallback, useRef} from 'react'
import Icon from '../icon'
import './styles.scss'

const CameraTrigger = (props: Props) => {
    const cameraInput: any = useRef()
    const change: (event: any) => void = useCallback((e) => {
        const imgFile = e.target.files[0]
        const formData = new FormData()

        formData.append('photo', imgFile)
        console.log(formData.get('photo'))
    }, [])

    const openCamera: () => void = useCallback(() => cameraInput.current.click(), [])
    const classes = 'c-camera-trigger'

    return (
        <button className={classes} onClick={openCamera}>
            <Icon name="fas fa-camera" />
            <input ref={cameraInput} hidden type="file" accept="image/*" capture="camera" onChange={change}/>
        </button>
    )
}

type Props = {
    onClick?: () => void
}

export default CameraTrigger
