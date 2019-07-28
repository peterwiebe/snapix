import * as React from 'react'
import classNames from 'classnames'
import './styles.scss'

const Layout = (props: Props) => {
    const {children, className} = props
    const classes = classNames('c-layout', className)

    return (
        <div className={classes}>
            {children}
        </div>
    )
}

interface Props {
    children?: React.ReactNode
    className?: string
}

export default Layout
