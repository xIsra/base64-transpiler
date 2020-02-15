import React, { Component, Fragment } from 'react';
import './App.scss';

class App extends Component {
  state = {
    data: "",
    loading: false
  }
  canvasRef = React.createRef<HTMLCanvasElement>();
  canvasContext?: CanvasRenderingContext2D | null;

  componentDidMount() {
    if (this.canvasRef.current) {
      this.canvasContext = this.canvasRef.current.getContext("2d")
    }
  }

  render() {
    const { data, loading } = this.state;
    return (
      <div className="app">
        <header className="header">
        </header>
        <section className="main">
          <div className="actions">
            <h3>Choose File</h3>
            <input type="file" onChange={(event) => {
              this.setState({
                loading: true
              })
              const { files } = event.currentTarget;
              if (files && files[0]) {
                const file = files[0];

                const fileReader = new FileReader();
                fileReader.onloadend = () => {
                  if (fileReader.result instanceof ArrayBuffer) {
                    const byteLength = fileReader.result.byteLength
                    const uintBuffer = new Uint8ClampedArray(fileReader.result);

                    this.setState({
                      loading: false,
                      data: new Buffer(uintBuffer).toString('base64')
                    })
                  }
                }
                fileReader.onerror = () => {
                  this.setState({
                    loading: false,
                  })
                }
                fileReader.readAsArrayBuffer(file);
              }
            }} />
            <input type="submit" value="Transpile" />
          </div>
          <div className="display">
            {!data || loading ?
              <Fragment>
                <h1>{!data ? "No content loaded." : "Loading..."}</h1>
              </Fragment> :
              <Fragment>
                <h3>Transpiled</h3>
                <textarea value={data} onChange={(e) => {
                  const data = e.target.value;
                  this.setState({
                    data
                  });
                }}></textarea>
                {/* <a download href={`data:image/png;base64,${data}`}>OPEN NEW TAB</a> */}
                <img className="display-image" src={`data:image/png;base64,${data}`} />

                {/* <button onClick={() => {
                window.open(`data:image/png;base64,${data}`, "_blank")
              }}>OPEN</button> */}

                {/* <iframe src={`data:application/pdf;base64,${data}`} className="display-image" frameBorder="0"></iframe> */}
              </Fragment>}

            {/* <canvas ref={this.canvasRef}></canvas> */}
          </div>
        </section>
        <div style={{padding: "1em"}}>
          <h1>NODEJS CODE: </h1>
          <code>
            const fs = require("fs");<br/>
            const data = fs.readFileSync("./text.txt").toString();<br/>
            let buff = new Buffer(data, 'base64');<br/>
            fs.writeFileSync("./output.data", buff);<br/>
          </code>
        </div>
      </div>
    );
  }
}

export default App;
