import { Component } from "./component"
import { createElement } from "./element"
import { createUnit } from "./unit"

function render (element, container: HTMLElement) {
    const unit = createUnit(element)
    const htmlStr = unit?.getMarkUp('0')
    container.innerHTML = htmlStr!
}
const React = {
    render,
    createElement,
    Component
}
export default React