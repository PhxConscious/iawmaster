import React, {Component} from "react";
import firebase from 'firebase';

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: '',
            loading: false,
            user_token:''
        };
    }

    onButtonPress() {
        const {email, password} = this.state;
        this.setState({error: '', loading: true});
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(this.onLoginSuccess.bind(this))
            .catch(this.onLoginFail.bind(this))
    }

    onLoginFail() {
        this.setState({error: 'Authentication Failed', loading: false})
        console.log(this.state.error)
    }

    onLoginSuccess() {
        this.setState({
            email: '',
            password: '',
            loading: false,
            error: '',
            user_token: firebase.auth().currentUser.uid
        });
        console.log(`this is the user token: ${firebase.auth().currentUser.uid}`)
    }

    renderButton() {
        if (this.state.loading) {
            return <h4>Loading...</h4>
        }
        return (
          <button
              className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
              onClick={() => this.onButtonPress()}>
              Submit
          </button>
        );
    }

    handleEmailTextChange = (event) => {
        this.setState({email: event.target.value})
    };

    handlePassTextChange = (event) => {
        this.setState({password: event.target.value})
    };

    render() {
        return (
          <div>
            <form className="basicForm" action="#">
              <h2>Login Form</h2>
                <div className="mdl-textfield mdl-js-textfield">
                    <input
                        className="mdl-textfield__input"
                        type="text"
                        onChange={this.handleEmailTextChange}
                        value={this.state.email}>
                    </input>
                    <label className="mdl-textfield__label">Email</label>
                </div>
                <br/>
                <div className="mdl-textfield mdl-js-textfield">
                    <input
                        className="mdl-textfield__input"
                        type="password"
                        onChange={this.handlePassTextChange}
                        value={this.state.password}>
                    </input>
                    <label className="mdl-textfield__label">Password</label>
                </div>
                <br/>
                {this.renderButton()}
            </form>
          </div>
        );
    }
}

export default LoginForm;
