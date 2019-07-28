import * as React from 'react'
import CameraTrigger from '../camera-trigger'
import Layout from '../layout'

const App = () => {
    const onChange: (file: File) => void = React.useCallback((file) => {
        const formData = new FormData()
        formData.append('photo', file)
        const url = 'http://192.168.0.106:9000/.netlify/functions/upload'
        fetch(url, {method: 'post', body: formData})
    }, [])
    return (
        <Layout>
            <CameraTrigger onChange={onChange} />
        </Layout>
    )
}

export default App
