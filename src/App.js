import React, {Component} from 'react';
import './App.css';
import ReactGA from 'react-ga';

import CompanyInfo from './Components/Forms/CompanyInfo'

export const initGA = () => {
    console.log('GA INIT');
    ReactGA.initialize('')
};

export const logPageView = () => {
    ReactGA.set({page:window.location.pathname})
    ReactGA.pageview(window.location.pathname)
};



class App extends Component {
    componentDidMount() {
        initGA();
        logPageView();
    }
  render() {
    return (
        <div className="App">
            <CompanyInfo/>
        </div>);
  }
}

export default App;
