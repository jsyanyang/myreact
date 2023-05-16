export class Element {
    constructor(type, props){
        this.type = type
        this.props = props
    }
}

export function createElement(type, props, ...children){
    if(!props){
        props = {}
    }
    props.children = children || []
    return new Element(type, props)
}