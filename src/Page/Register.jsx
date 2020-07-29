import React from 'react';
import RegisterH5 from "./RegisterH5";
import RegisterPC from "./RegisterPC";

class Register extends React.Component {

    state = {
        type: document.body.clientWidth > 800 ? 'PC' : 'H5'
    }

    constructor(props) {
        super(props);
        if (window.location.pathname.substring(1)) {
            const array = window.location.pathname.substring(1).split('/');
            this.state.identificationCode = array[0];
        }else{
            this.state.identificationCode = [];
        }

    }

    render() {
        const {type, identificationCode} = this.state;
        return (
            <div>
                {
                    type === 'H5'
                    ? <RegisterH5 identificationCode={identificationCode}/>
                    : <RegisterPC identificationCode={identificationCode}/>
                }
            </div>
        )
    }
}

export default Register;

