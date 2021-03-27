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
import SignupWaitImage from "../assets/img/signupwait.png";


export default class SignupWait extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }


    render() {
        return (
            <div className="login-form-container">
                <Card small className="mb-4">
                    <CardHeader className="border-bottom">
                        <h6 className="m-0 login-fomr-top-title">Welcome </h6>
                    </CardHeader>
                    <ListGroup flush>
                        <ListGroupItem className="p-3">
                            <Row>
                                <Col>
                                    <Form>
                                        <Row form>
                                            <Col md="12" className="form-group">
                                                <img src={SignupWaitImage} />
                                            </Col>
                                        </Row>
                                        <Row form>
                                            <Col md="12" className="form-group">
                                                <div className="siwnupwait-form-sub-text-style">
                                                    <label htmlFor="feFirstName">Our Service provider will send you mail via your signup email.</label><br />
                                                    <label htmlFor="feFirstName">Please check your mail box.</label>
                                                </div>
                                                <div className="login-form-login-button-container" style={{ marginTop: 15 }}>
                                                    After check your mail, You might wait to approve by admin &nbsp;&nbsp;&nbsp;
                                                     <Link to="/login" > Sign in</Link>
                                                </div>

                                            </Col>
                                        </Row>
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