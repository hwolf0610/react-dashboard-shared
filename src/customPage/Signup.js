import React from "react";
import {
    Card,
    CardHeader,
    ListGroup,
    ListGroupItem,
    Row,
    Col,
    Form,
    FormGroup,
    FormInput,
    FormSelect,
    FormTextarea,
    Button
} from "shards-react";
import { Link } from "react-router-dom";

import { Config } from "../Service/config";
import ApiService from '../Service/ApiService';

export default class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            userEmail: "",
            userPassword: "",
            userType: "Uploader",
        }
    }

    onSignup = () => {
        console.log("signup: ", this.state.username, this.state.userEmail, this.state.userPassword, this.state.userType);

        if (this.state.username != '' && this.state.userEmail != '' && this.state.userPassword != '' && this.state.userType != '') {
            let bodyFormData = new FormData();
            bodyFormData.append("Name", this.state.username);
            bodyFormData.append("Email", this.state.userEmail);
            bodyFormData.append("Password", this.state.userPassword);
            bodyFormData.append("Kind", this.state.userType);

            let API_Signup_URL = Config.signup;
            ApiService.apiCall('post', API_Signup_URL, bodyFormData, (response) => {
                try {
                    //handle success
                    console.log("response", response);
                    if (response.data.status == 200) {
                        alert("success added user.");
                        // localStorage.setItem("Name", response.data.data.Name);
                        // localStorage.setItem("Email", response.data.data.Email);
                        // localStorage.setItem("Kind", response.data.data.Kind);
                        // localStorage.setItem("user_Tag", response.data.data.Tag);
                        // localStorage.setItem("Unique_ID", response.data.data.Unique_ID);
                        // localStorage.setItem("token_Bearer", response.data.token);

                        // console.log("Token:", localStorage.getItem('token_Bearer'))
                        document.location.href = "/signupwait";
                    } else {
                        alert("add user failed!")
                    }
                } catch (error) {
                    console.log("error:", error)
                }
            })
        } else {
            alert("Please input all informations")
        }
    }

    render() {
        return (
            <div className="login-form-container">
                <Card small className="mb-4">
                    <CardHeader className="border-bottom">
                        <h6 className="m-0 login-fomr-top-title">Sign UP </h6>
                    </CardHeader>
                    <ListGroup flush>
                        <ListGroupItem className="p-3">
                            <Row>
                                <Col>
                                    <Form>
                                        <Row form>
                                            {/* First Name */}
                                            <Col md="12" className="form-group">
                                                <label htmlFor="feFirstName">User Name</label>
                                                <FormInput
                                                    id="feFirstName"
                                                    placeholder="UserName"
                                                    value={this.state.username}
                                                    onChange={(e) => { this.setState({ username: e.target.value }) }}
                                                />
                                            </Col>
                                        </Row>
                                        <Row form>
                                            {/* Email */}
                                            <Col md="6" className="form-group">
                                                <label htmlFor="feEmail">Email</label>
                                                <FormInput
                                                    type="email"
                                                    id="feEmail"
                                                    placeholder="Email Address"
                                                    value={this.state.userEmail}
                                                    onChange={(e) => { this.setState({ userEmail: e.target.value }) }}
                                                    autoComplete="email"
                                                />
                                            </Col>
                                            {/* Password */}
                                            <Col md="6" className="form-group">
                                                <label htmlFor="fePassword">Password</label>
                                                <FormInput
                                                    type="password"
                                                    id="fePassword"
                                                    placeholder="Password"
                                                    value={this.state.userPassword}
                                                    onChange={(e) => { this.setState({ userPassword: e.target.value }) }}
                                                    autoComplete="current-password"
                                                />
                                            </Col>
                                        </Row>
                                        <FormGroup>
                                            <label htmlFor="feInputState">User Type</label>
                                            <FormSelect id="feInputState"
                                                value={this.state.userType}
                                                onChange={(e) => { this.setState({ userType: e.target.value }) }}
                                            >
                                                <option key="Uploader" value="Uploader" >Uploader</option>
                                                <option key="Downloader" value="Downloader" >Downloader</option>
                                            </FormSelect>
                                        </FormGroup>
                                        <div className="login-form-login-button-container">
                                            <Button theme="accent" onClick={this.onSignup}>Sign Up</Button>
                                        </div>
                                        <div className="login-form-login-button-container" style={{ marginTop: 15 }}>
                                            Have an account? <Link to="/login" > Sign in</Link>
                                        </div>
                                    </Form>
                                </Col>
                            </Row>
                        </ListGroupItem>
                    </ListGroup>
                </Card>
            </div>
        )
    }
}