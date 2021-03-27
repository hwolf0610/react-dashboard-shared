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
import { Link } from "react-router-dom"

import { Config } from "../Service/config";
import ApiService from '../Service/ApiService';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userEmail: "",
            userPassword: "",
        }
    }

    onLogin = () => {
        console.log("signup: ", this.state.userEmail, this.state.userPassword);

        var bodyFormData = new FormData();
        bodyFormData.append('Email', this.state.userEmail);
        bodyFormData.append('Password', this.state.userPassword);

        let Json_Data_Login = {
            "school_type": this.state.education_school_type,
        }
        let API_Login_URL = Config.login;
        ApiService.apiCall('post', API_Login_URL, bodyFormData, (response) => {
            try {
                //handle success
                console.log("response", response);
                // alert(response)
                if (response.data.status == 200) {
                    console.log("Login success !");
                    localStorage.setItem("Name", response.data.data.Name);
                    localStorage.setItem("Email", response.data.data.Email);
                    localStorage.setItem("Kind", response.data.data.Kind);
                    localStorage.setItem("user_Tag", response.data.data.Tag);
                    localStorage.setItem("Unique_ID", response.data.data.Unique_ID);
                    localStorage.setItem("token_Bearer", response.data.token);
                    localStorage.setItem("Max_file_size_user", response.data.data.Max_Upload_Size);

                    console.log("Token:", localStorage.getItem('token_Bearer'))
                    document.location.href = "/files-overview";
                } else if (response.data.status == 402) {
                    console.log("This user deactived by admin!")
                    alert("This user deactived by admin!")
                } else {
                    console.log("login failed!")
                    alert("This user don't exist!")
                }
            } catch (error) {
                console.log("error:", error)
            }
        })
    }

    render() {
        return (
            <div className="login-form-container">
                <Card small className="mb-4">
                    <CardHeader className="border-bottom">
                        <h6 className="m-0 login-fomr-top-title" >Sign IN</h6>
                    </CardHeader>
                    <ListGroup flush>
                        <ListGroupItem className="p-3">
                            <Row>
                                <Col>
                                    <Form>
                                        <Row form>
                                            {/* Email */}
                                            <Col md="12" className="form-group">
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
                                            <Col md="12" className="form-group">
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
                                        <div className="login-form-login-button-container">
                                            <Button theme="accent" onClick={this.onLogin}>Login</Button>
                                        </div>
                                        <div className="login-form-login-button-container" style={{ marginTop: 15 }}>
                                            Don't have an account? <Link to="/signup" >Sign up</Link>
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