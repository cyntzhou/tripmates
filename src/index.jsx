import React from "react"
import ReactDOM from "react-dom"

class App extends React.Component {

  render() {
    let app =
    <div>
        <div>JuiCy buNS</div>
    </div>

    return(
      <div>
        {app}
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById("react-app")
)
