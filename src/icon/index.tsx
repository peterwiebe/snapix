import * as React from 'react'
import classNames from 'classnames'
import './styles.scss'

const Icon = (props: Props) => {
    const {className, name} = props
    const classes = classNames(className, name)

    return (
        <i className={classes} />
    )
}

interface Props {
    className?: string
    name: string
}

export default Icon
