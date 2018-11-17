import React from "react"
import ReactDOM from "react-dom"

import Trip from "./Frontend/trip"

class App extends React.Component {

  render() {
    let app =
    <div>
        <div>JuiCy buNS</div>
        <Trip/>
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
