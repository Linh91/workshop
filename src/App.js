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
    const id = data.id;
    const allIds = "allIds";
    const byIds = "byId";

    normalizedData.creator = {};
    normalizedData.creator[byIds] = {};
    normalizedData.creator[allIds] = [];
    normalizedData.creator[allIds].push(id);
    normalizedData.creator[byIds][id] = data.creator_information;
    normalizedData.workshops = {};
    normalizedData.workshops[byIds] = {};
    normalizedData.workshops[allIds] = [];
    normalizedData.workshops[allIds].push(id);
    normalizedData.workshops[byIds][id] = data.lessons;

    return this.setState({normalizedData});
  }

  renderWorkShops() {
    const id = this.state.dataFromApi.id;
    const workshops = this.state.normalizedData.workshops
      ? this.state.normalizedData.workshops.byId[id]
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
    const id = this.state.dataFromApi.id;
    const creator = this.state.normalizedData.creator.byId 
      ? this.state.normalizedData.creator.byId[id]
      : null;

    return creator 
      ? (
        <div className="Profile-container">
          <img 
            src={creator.profile_picture}
            alt={creator.name} className="Profile-image"/>
          <p>Creator: {creator.name}
          </p>
          <p>{creator.introduction}</p>
          <a href={creator.instagram_url}>{creator.instagram_url}</a><br/>
          <a href={creator.twitter_url}>{creator.twitter_url}</a><br/>
          <a href={creator.url}>{creator.url}</a><br/>
          <a href={creator.youtube_url}>{creator.youtube_url}</a><br/>
        </div>
    )
      : null;
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
