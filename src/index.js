import React from 'react';
import ReactDOM from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import './index.scss';

const defaultText = `stackoverflow\rhaha 
# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`

You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.org), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | -------------
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbered lists too.
1. Use just 1s if you want!
1. And last but not least, let's not forget embedded images:

![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)
`;

const layouts = ['Half', 'Editor', 'Previewer'];

const defaultLayout = 'Half';

const Button = (props) => (
    <button onClick={props.handleButton.bind(this, props.before, props.after)} className="btn btn-primary"><i className={"fas fa-" + props.icon}></i></button>
);

const Header = (props) => (
    <div className="navbar navbar-dark bg-primary fixed-top d-flex flex-row justify-content-around align-items-center">
        <div className="navbar-brand text-center" href="#">Markdown Previewer</div>
        <div>
            <Button handleButton={props.handleButton} before="**" after="**" icon="bold"/>
            <Button handleButton={props.handleButton} before="*" after="*" icon="italic"/>
            <Button handleButton={props.handleButton} before="~~" after="~~" icon="strikethrough"/>
        </div>
        <div>
            <Button handleButton={props.handleButton} before="1. " after="" icon="list-ol"/>
            <Button handleButton={props.handleButton} before="* " after="" icon="list-ul"/>
        </div>
        <div>
            <Button handleButton={props.handleButton} before="[](" after=")" icon="link"/>
            <Button handleButton={props.handleButton} before="![](" after=")" icon="image"/>
        </div>
        <Dropdown class="dropdown" options={layouts} onChange={props.handleLayout} value={defaultLayout}/>
    </div>
);

const Editor = (props) => (
    <textarea 
        className={"col-" + (props.layout === 'Half' ? "6" : "12") + " editor"}
        onChange={props.handleChange}
        value={props.markdown}
        ref={props.obj}>
    </textarea>
);

const Preview = (props) => (
    <ReactMarkdown 
        plugins={[remarkGfm]} 
        children={props.markdown}
        className={"col-" + (props.layout === 'Half' ? "6" : "12") + " previewer"}/>
);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.obj = React.createRef();
        this.state = {
            markdown: defaultText,
            layout: defaultLayout,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleLayout = this.handleLayout.bind(this);
        this.handleButton = this.handleButton.bind(this);
    }
    handleChange(event) {
        this.setState({
            markdown: event.target.value
        });
    }
    handleLayout(selected) {
        this.setState({
            layout: selected.value
        });
    }
    handleButton(before, after) {
        let start = this.obj.current.selectionStart;
        let end = this.obj.current.selectionEnd;
        this.setState(state => ({
            markdown: state.markdown.slice(0, start)
            + before
            + state.markdown.slice(start, end)
            + after
            + state.markdown.slice(end)
        }));
        this.obj.current.focus();
        setTimeout(() => {
            this.obj.current.setSelectionRange(end + before.length, end + before.length);
        });
    }
    render() {
        return ( 
            <div className="container-fluid">
                <Header 
                    className="row" 
                    handleLayout={this.handleLayout} 
                    handleButton={this.handleButton}/>
                <div className="row" 
                    style={{minHeight: "calc(100vh - 50px)", marginTop: "50px"}}>
                    {this.state.layout === 'Previewer' || <Editor markdown={this.state.markdown} handleChange={this.handleChange} layout={this.state.layout} obj={this.obj}/>}
                    {this.state.layout === 'Editor' || <Preview markdown={this.state.markdown} layout={this.state.layout}/>}
                </div>
            </div>
        );
    }
};

ReactDOM.render(<App/>, document.getElementById('root'));
