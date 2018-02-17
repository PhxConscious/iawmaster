import React, {Component} from "react";
import firebase from 'firebase';
import axios from 'axios';

class SignUpForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            verifyPassword: '',
            firstName: '',
            lastName: '',
            userPhone: '',
        };
    }

    componentDidMount() {
        axios.get('http://localhost:3000/users')
            .then(res => {
                console.log(res.data);
            });
    }

    onButtonPress() {
        const {email, password, verifyPassword, firstName, lastName, userPhone} = this.state;

        if (email === '' || password === '') {
            return alert('Must fill in all fields')
        } else if (password !== verifyPassword) {
            return alert('Passwords do not match');
        } else if (password.length < 6) {
            return alert('password must be at least 6 characters long')
        }
        return (
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(() => axios.post('http://localhost:3000/users/new', {
                user_email: email,
                firebase_id: firebase.auth().currentUser.uid,
                first_name: firstName,
                last_name: lastName,
                user_phone: userPhone
            })))
        }

    handleEmailTextChange = (event) => {
        this.setState({email: event.target.value})
    };

    handlePassTextChange = (event) => {
        this.setState({password: event.target.value})
    };

    handleVerifyPassTextChange = (event) => {
        this.setState({verifyPassword: event.target.value})
    };

    handleFirstNameTextChange = (event) => {
        this.setState({firstName: event.target.value})
    };

    handleLastNameTextChange = (event) => {
        this.setState({lastName: event.target.value})
    };

    handleUserPhoneTextChange = (event) => {
        this.setState({userPhone: event.target.value})
    };

    render() {
        return (
            <form className="basicForm" action="#">
                <h2>Sign Up Form</h2>
                <div className="mdl-textfield mdl-js-textfield">
                    <input
                        className="mdl-textfield__input"
                        type="text"
                        onChange={this.handleFirstNameTextChange}
                        value={this.state.firstName}>
                    </input>
                    <label className="mdl-textfield__label">First Name</label>
                </div>
                <br/>
                <div className="mdl-textfield mdl-js-textfield">
                    <input
                        className="mdl-textfield__input"
                        type="text"
                        onChange={this.handleLastNameTextChange}
                        value={this.state.lastName}>
                    </input>
                    <label className="mdl-textfield__label">Last Name</label>
                </div>
                <br/>
                <div className="mdl-textfield mdl-js-textfield">
                    <input
                        className="mdl-textfield__input"
                        type="text"
                        onChange={this.handleUserPhoneTextChange}
                        value={this.state.userPhone}>
                    </input>
                    <label className="mdl-textfield__label">Phone Number</label>
                </div>
                <br/>
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
                <div className="mdl-textfield mdl-js-textfield">
                    <input
                        className="mdl-textfield__input"
                        type="password"
                        onChange={this.handleVerifyPassTextChange}
                        value={this.state.verifyPassword}>
                    </input>
                    <label className="mdl-textfield__label">Verify Password</label>
                </div>
                <br/>
                <button
                    className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
                    onClick={() => this.onButtonPress()}>
                    Submit
                </button>
            </form>
        );
    }
}

export default SignUpForm;
