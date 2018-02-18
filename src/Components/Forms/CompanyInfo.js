import React, {Component} from "react";
import '../../Styles/FormsStyles.css';

class CompanyInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            instagramAccount: '',
            companyName: '',
            error: '',
            loading: false
        };
    }

    onButtonPress() {
        // const {instagramAccount, companyName} = this.state;
        this.setState({error: '', loading: true});
        console.log('button works and displays loading...')
    }

    renderButton() {
        if (this.state.loading) {
            return <p id='prog1' className="mdl-spinner mdl-js-spinner mdl-spinner--single-color is-active"></p>
        }
        return (
            <button
                id='formButton'
                className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent"
                onClick={() => this.onButtonPress()}>
                <div>Update</div>
            </button>
        );
    }

    handleInstagramAccountTextChange = (event) => {
        this.setState({instagramAccount: event.target.value});
        console.log(this.state.instagramAccount)
    };

    handleCompanyNameTextChange = (event) => {
        this.setState({companyName: event.target.value});
        console.log(this.state.companyName)
    };

    render() {
        return (
            <div>
                <form className="basicForm" action="#">
                    <div className='inputCont'>
                        <div className='formTitleCont'>
                            <p className="formTitle">Company Information</p>
                        </div>
                        <div className="formInputCont">
                            <div>
                                <p className='inputLabel'>Instagram Account</p>
                            </div>
                            <input
                                className="formInput"
                                type="text"
                                onChange={this.handleInstagramAccountTextChange}
                                placeholder='@phxconscious'
                                value={this.state.instagramAccount}>
                            </input>
                        </div>
                        <br/>
                        <div className="formInputCont">
                            <div>
                                <p className='inputLabel'>Company Name</p>
                            </div>
                            <input
                                className="formInput"
                                type="text"
                                onChange={this.handleCompanyNameTextChange}
                                placeholder='Conscious Creative'
                                value={this.state.companyName}>
                            </input>
                        </div>
                    </div>
                    <br/>
                    {this.renderButton()}
                </form>
            </div>
        );
    }
}

export default CompanyInfo;
