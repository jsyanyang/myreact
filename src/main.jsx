import React from './react'
const handleClick= () => alert('click')
const element = React.createElement('button', {id: 'btn', style: {color: 'red', backgroundColor: 'green'}, onClick: handleClick}, 'say', React.createElement('b', {}, 'hello'))
class Counter extends React.Component{
  constructor(props){
    super(props)
    this.props = props
    this.state = {
      number: 0
    }
  }
  increament(){
    this.setState({
      number: this.state.number + 1
    })
  }
  componentWillMount(){
    console.log('componentWillMount')
  }
  componentDidMount(){
    console.log('componentDidMount')
  }
  render(){
    return React.createElement('div', {id: 'counter', style: {color: 'blue'}}, 
    React.createElement('span', null, this.props.name),
    React.createElement('span', null, this.state.number),
    React.createElement('button', {onClick: this.increament}, '+'))
  }
  
}
const CounterElement = React.createElement(Counter, {name: 'counterFather'})

React.render(CounterElement, document.getElementById('root'))