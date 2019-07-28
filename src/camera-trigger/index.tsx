import React, {useCallback, useRef} from 'react'
import Icon from '../icon'
import './styles.scss'

const CameraTrigger = (props: Props) => {
    const cameraInput: any = useRef()
    const {onChange, onClick} = props

    const change: (event: any) => void = useCallback((e) => {
        if (!onChange) {
            return
        }

        const imgFile: File = e.target.files[0]
        onChange(imgFile)
    }, [onChange])

    const classes = 'c-camera-trigger'

    return (
        <button className={classes} onClick={onClick}>
            <Icon name="fas fa-camera" />
            <input ref={cameraInput} hidden type="file" accept="image/*" capture="camera" onChange={change}/>
        </button>
    )
}

type Props = {
    onClick?: () => void,
    onChange?: (file: File) => void,
}

export default CameraTrigger
