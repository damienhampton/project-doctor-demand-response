import React from 'react';
import logoImage from '../assets/img/logo/Original.png';
import { Button, Form, FormGroup, Input, Label, ButtonGroup, Row, Col, Alert,Card,
  CardBody,
  CardImg } from 'reactstrap';
import FormUtil from '../utils/form-util';
import { withRouter } from "react-router-dom";
import { BaseComponent } from '../components/BaseComponent';
import { UserService } from '../services/UserService';

class AuthForm extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = { ...this.state, retypedPassword:'', terms:'', messages: [], userInfo: {
            org_name: '',
            type: 'H',
            user_name: '',
            password: '',
            first_name: '',
            last_name: '',
            description: '',
            address_line1: '',
            address_line2: '',
            city: '',
            state: '',
            country: 'US',
            zipcode: '',
            latitude: null,
            longitude: null,
            phone: null,
            alternate_phone: null,
            email: '',
            alternate_email: ''
        }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleUserInfoChange = this.handleUserInfoChange.bind(this);
    this.registerUser = this.registerUser.bind(this);
    this.updateUserType = this.updateUserType.bind(this);
    this.handleTermsChange = this.handleTermsChange.bind(this);
    this.validate = this.validate.bind(this);
  }

  handleUserInfoChange(event) {
    let userInfo = this.state.userInfo;
    userInfo[event.target.name] = event.target.value;
    this.setState({...this.state, userInfo: userInfo});
  }

  handleChange(event) {
    let state = this.state[event.target.name] = event.target.value;
    this.setState({...state});
  }

  updateUserType(event) {
    let userInfo = this.state.userInfo;
    userInfo.type = event.target.value;
    this.setState({...this.state, userInfo: userInfo});
  }

  handleTermsChange(event){
    this.setState(state => ({
      terms: !state.terms
    }));
  }

  redirectToLogin(event) {
    event.preventDefault();

    this.props.history.push("/login");
  }

  registerUser = event => {
    event.preventDefault();
    this.state.userInfo.user_name = this.state.userInfo.email;
    let userInfo = this.state.userInfo;
    FormUtil.trimFields(userInfo);
    let messages = this.validate(userInfo);

    if(messages.length !== 0) {
      this.setState({...this.state, messages: messages});
      return;
    }

    UserService.registerUser(this.state.userInfo).subscribe(resp => {
      if(resp.status === true) {
        this.setState({...this.state, registrationSuccess: true});
      } else {
        this.setState({...this.state, registrationSuccess: false});
      }
    });
  }

  validate(af) {
    let messages = [];
    if(FormUtil.isEmpty(af.org_name)) {
      messages.push('Your Organization Name is required');
    }
    if(FormUtil.isEmpty(af.address_line1)) {
      messages.push('Your Address is required');
    }
    if(FormUtil.isEmpty(af.city)) {
      messages.push('Your City is required');
    }
    if(FormUtil.isEmpty(af.state)) {
      messages.push('Your State is required');
    }
    if(FormUtil.isEmpty(af.zipcode)) {
      messages.push('Your ZIP/Postal Code is required');
    }
    if(FormUtil.isEmpty(af.password) || af.password.length < 8) {
      messages.push('A password of 8 characters in length is required');
    }
    if(FormUtil.isEmpty(this.state.retypedPassword) || this.state.retypedPassword !== af.password) {
      messages.push('You must retype your password');
    }
    if(FormUtil.isEmpty(af.email)) {
      messages.push('An email address is required');
    }
    return messages;
  }


  render() {

    return (


      <Row className="border-0">
        <Col md={3} sm={3} xs={3} className="border-0 d-flex mb-3 align-items-center">
          <CardImg
              className="card-img-left"
              src={logoImage}
            />
        </Col>
        <Col md={9} sm={9} xs={9} className="mb-3 border-0">
          <Card className="flex-row border-0">
            <CardBody>
                {
                  this.state.messages.length > 0 ? 
                  <Alert color='danger'> <ul>
                    {
                      this.state.messages.map(message => {
                      return <li>{message}</li>
                      })
                    }
                  </ul></Alert> : ''
                }
                <Form name="af" onSubmit={this.registerUser}>
                    {
                      this.state.registrationSuccess === true ?
                      <Alert color="success">
                        An activation email has been sent to you email.
                        Please follow the directions in email to activate your account!
                      </Alert> : '' 
                    }
                    {
                      this.state.registrationSuccess === false ?
                      <Alert color="danger">
                        Registration failed.
                      </Alert> : ''
                    }

                    <FormGroup>
                      <ButtonGroup>
                        <Button
                          outline
                          color="secondary"
                          name="type"
                          value="H"
                          onClick={this.updateUserType}
                          active={this.state.userInfo.type === 'H'}
                        >
                          Healthcare Provider
                        </Button>
                        <Button
                          outline
                          color="secondary"
                          name="type"
                          value="V"
                          onClick={this.updateUserType}
                          active={this.state.userInfo.type === 'V'}
                        >
                          Volunteer
                        </Button>
                      </ButtonGroup>
                    </FormGroup>
                    <FormGroup>
                      <Label>Organization Name</Label>
                      <Input type="text" name="org_name" value={this.state.userInfo.org_name} onChange={this.handleUserInfoChange}/>
                    </FormGroup>

                    <Row>
                      <Col xl={6} lg={6} md={6}>
                        <FormGroup>
                          <Label>Address Line 1</Label>
                          <Input type="text" name="address_line1" value={this.state.userInfo.address_line1} onChange={this.handleUserInfoChange} />
                        </FormGroup>
                      </Col>
                      <Col xl={6} lg={6} md={6}>
                        <FormGroup>
                          <Label>Address Line 2</Label>
                          <Input type="text" name="address_line2" value={this.state.userInfo.address_line2} onChange={this.handleUserInfoChange} />
                        </FormGroup>
                      </Col>
                    </Row>
                    <FormGroup>
                      <Row>
                        <Col xl={4} lg={4} md={4}>
                          <Label>City</Label>
                          <Input type="text" name="city" value={this.state.userInfo.city} onChange={this.handleUserInfoChange} />
                        </Col>
                        <Col xl={3} lg={3} md={3}>
                          <Label>State</Label>
                          <Input type="text" name="state" value={this.state.userInfo.state} onChange={this.handleUserInfoChange} />
                        </Col>
                        <Col xl={2} lg={2} md={2}>
                          <Label>Country</Label>
                          <Input type="text" name="country" value={this.state.userInfo.country} disabled/>
                        </Col>
                        <Col xl={3} lg={3} md={3}>
                          <Label>Zip Code</Label>
                          <Input type="text" name="zipcode" value={this.state.userInfo.zipcode} onChange={this.handleUserInfoChange} />
                        </Col>
                      </Row>
                    </FormGroup>

                    <Row>
                      <Col xl={6} lg={6} md={6}>
                        <FormGroup>
                          <Label>Password</Label>
                          <Input type="password" name="password" value={this.state.userInfo.password} onChange={this.handleUserInfoChange} />
                        </FormGroup>
                      </Col>
                      <Col xl={6} lg={6} md={6}>
                        <FormGroup>
                          <Label>Retype Password</Label>
                          <Input type="password" name="retypedPassword"  value={this.state.retypedPassword} onChange={this.handleChange} />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xl={6} lg={6} md={6}>
                        <FormGroup>
                          <Label>Email</Label>
                          <Input type="email" name="email" value={this.state.userInfo.email} onChange={this.handleUserInfoChange} />
                        </FormGroup>
                        </Col>
                        <Col xl={6} lg={6} md={6}>
                          <Label>Alternate Email</Label>
                          <Input type="email" name="alternate_email" value={this.state.userInfo.alternate_email} onChange={this.handleUserInfoChange} />
                      </Col>
                    </Row>

                    <Row>
                      <Col xl={6} lg={6} md={6}>
                        <FormGroup>
                          <Label>Phone</Label>
                          <Input type="number" name="phone" value={this.state.userInfo.phone} onChange={this.handleUserInfoChange}/>
                        </FormGroup>
                        </Col>
                        <Col xl={6} lg={6} md={6}>
                          <Label>Alternate Phone</Label>
                          <Input type="number" name="alternate_phone" value={this.state.userInfo.alternate_phone} onChange={this.handleUserInfoChange} />
                      </Col>
                    </Row>
                    <FormGroup check>
                      <Label check>
                        <Input type="checkbox" name="terms" value={this.state.terms} onChange={this.handleTermsChange}/>
                        Agree the terms and policy
                      </Label>
                    </FormGroup>
                    <hr />
                    <Row className="d-flex align-items-center">
                      <Col xl={6} lg={6} md={6}>
                        <Button
                          name="btnReg"
                          size="md"
                          block
                          color="primary"
                          className="border-0"
                          disabled={!this.state.terms}
                          onClick={this.registerUser}>
                          Signup
                        </Button>
                      </Col>
                      <Col xl={6} lg={6} md={6} className="d-flex justify-content-end align-items-center">
                        Already have account? &nbsp;&nbsp;
                        <Button outline color="link" className="text-primary">Login</Button>
                      </Col>
                    </Row>
                  </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>


    );
  }
}

export default AuthForm;
