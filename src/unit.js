import { Element } from "./element"
import $ from 'jquery'

class Unit {
    constructor(element) {
        this._currentElement = element
    }
    getMarkUp() {
        throw Error('此方法不能在父级调用')
    }
}

class TextUnit extends Unit {
    getMarkUp(reactId) {
        this._reactId = reactId
        return `<span data-reactid=${reactId}>${this._currentElement}</span>`
    }
}
class NativeUnit extends Unit {
    getMarkUp(reactId) {
        this._reactId = reactId
        const { type, props } = this._currentElement
        let tagStart = `<${type} data-reactid="${reactId}"`
        for (let propName in props) {
            if (/^on[A-Z]/.test(propName)) {
               const eventName = propName.slice(2).toLowerCase()
               $(document).delegate(`[data-reactid="${reactId}"]`, `${eventName}.${reactId}`, props[propName])
            }
            else if(propName === 'className'){
                tagStart += ` class=${props[propName]} `
            }
            else if(propName === 'style'){
                const styleObj = props[propName]
                const styleValue = Object.entries(styleObj).map(([key, value]) => {
                    key = key.replace(/[A-Z]/, m=> `-${m.toLowerCase()}`)
                    return `${key}: ${value}`
                }).join(';')
                tagStart += ` style="${styleValue}" `
            } else if(propName !== 'children'){
                tagStart += ` ${propName}=${props[propName]} `
            }
        }
        let childStr = ''
        props.children.forEach((child, index) => {
            const childUnit = createUnit(child)
            const childHtml = childUnit.getMarkUp(`${reactId}.${index}`)
            childStr += childHtml
        })
        const tagEnd = `</${type}>`
        return tagStart + '>' + childStr + tagEnd
    }
}

class ComponentUnit extends Unit{
    update(nextElement, partialState){
        this._currentElement = nextElement || this._currentElement
        let nextState = {...this._compenentInstance.state, ...partialState}
        this._compenentInstance.state =  nextState
        let nextProps = this._currentElement.props
        if(this._compenentInstance.shouldCompoentUpdate && !this._compenentInstance.shouldCompoentUpdate(nextProps, nextState)){
            return
        }
        const nextReactNode = this._compenentInstance.render()
        if(this.needDeepCompare(this._reactDom, nextReactNode)){
            this._instanceUnit.update(nextReactNode)
        }else{
            const nextHtml = createUnit(nextElement).getMarkUp(this._reactId)
            $(`[data-reactid]=${this._reactId}`).replaceWith(nextHtml)
        }
    }
    needDeepCompare(preReactNode, nextReactNode){
        if(preReactNode !== null && nextReactNode !== null){
            if((typeof preReactNode.type === 'string' || typeof preReactNode.type === 'number') && (typeof nextReactNode.type === 'string' || typeof nextReactNode.type === 'number')){
                
            }
        }else{
            return false
        }
        
    }
    getMarkUp(reactId) {
        this._reactId = reactId
        const {type, props} = this._currentElement
        const ComponentClass = type
        const instance = this._compenentInstance =  new ComponentClass(props)
        instance.compoentWillMount && instance.compoentWillMount()
        instance._currentUnit = this
        const instanceElement = instance.render()
        this._reactDom = instanceElement
        $(document).on('mounted', () => {
            instance.componentDidMount && instance.componentDidMount()
        })
        const instanceUnit = createUnit(instanceElement)
        this._instanceUnit = instanceUnit 
        return instanceUnit.getMarkUp(reactId)
    }
}

export function createUnit(element) {
    if (typeof element === 'string' || typeof element === 'number') {
        return new TextUnit(element)
    }
    if (element instanceof Element && typeof element.type === 'string') {
        return new NativeUnit(element)
    }
    if (element instanceof Element && typeof element.type === 'function') {
        return new ComponentUnit(element)
    }
}