import React, {Component} from 'react';
import './App.css';

class App extends Component {
  state = {
    dataFromApi: [],
    normalizedData: {
      creator: {}
    }
  }

  componentWillMount() {
    return this.getApiResponse();
  }

  getApiResponse () {
    fetch("https://cors-anywhere.herokuapp.com/https://app.workshop.ws/api/v1.1/workshop/make-bread/", {
      headers: {
          'Accept': 'application/json',
          "origin": "https://app.workshop.ws/",
          "Content-Type": "application/json",
      },
      method: "GET",
  })
      .then((res) => {
          if (res.status !== 200) {
            console.log(
              "Looks like there was a problem. Status Code: " + res.status
            );
            return Promise.reject( //reject by returning a rejecting promise
              "Looks like there was a problem. Status Code: " + res.status
            );
          }
          res.json().then(data => {
            this.setState({dataFromApi: data}, this.normalizeDataFunc(data));
          })
      })
      .catch((error) => {
          console.log("error fetching data", error);
      });
  }

  normalizeDataFunc(data) {
    const normalizedData = {}
    const name = data.creator_name.split(" ").join("");

    normalizedData.creator = {};
    normalizedData.creator[name] = data.creator_information;
    normalizedData.workshops = {};
    normalizedData.workshops[name] = data.lessons;

    return this.setState({normalizedData});
  }

  renderWorkShops() {
    const creator = this.state.dataFromApi.creator_name 
      ? this.state.dataFromApi.creator_name.split(" ").join("")
      : null;
  
    const workshops = this.state.normalizedData.workshops
      ? this.state.normalizedData.workshops[creator]
      : null;

    return workshops ? workshops.map(workshop => {
      return <div className="Lesson-container">
        <p>Lesson: {workshop.title}</p>
        <p>Duration: {workshop.duration}</p>
        <p>Lesson steps: {workshop.lesson_step_count}</p>
        <p dangerouslySetInnerHTML={{__html: workshop.description}}></p>
      </div>
    }) : null;

  }

  renderProfile() {
    const creatorName = this.state.dataFromApi.creator_name 
      ? this.state.dataFromApi.creator_name.split(" ").join("")
      : null;
  
    return this.state.normalizedData.creator[creatorName] 
      ? (
        <div className="Profile-container">
          <img 
            src={this.state.normalizedData.creator[creatorName].profile_picture}
            alt={this.state.normalizedData.creator[creatorName].name} className="Profile-image"/>
          <p>Creator: {this.state.normalizedData.creator[creatorName].name}
          </p>
          <p>{this.state.normalizedData.creator[creatorName].introduction}</p>
          <a href={this.state.normalizedData.creator[creatorName].instagram_url}>{this.state.normalizedData.creator[creatorName].instagram_url}</a><br/>
          <a href={this.state.normalizedData.creator[creatorName].twitter_url}>{this.state.normalizedData.creator[creatorName].twitter_url}</a><br/>
          <a href={this.state.normalizedData.creator[creatorName].url}>{this.state.normalizedData.creator[creatorName].url}</a><br/>
          <a href={this.state.normalizedData.creator[creatorName].youtube_url}>{this.state.normalizedData.creator[creatorName].youtube_url}</a><br/>
        </div>
    )
      : null
  }

  render () {

    if (Object.entries(this.state.normalizedData).length === 0) {
      return null;
    }

    return (
      <div className="App">
        <h1 className="Heading">Workshop</h1>

        {this.renderProfile()}

        <h4 className="Subheading">Workshops:</h4>
        {this.renderWorkShops()}
      </div>
    );
  }
}
export default App;
