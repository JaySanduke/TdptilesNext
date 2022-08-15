import React, { useEffect } from "react";
import Link from "next/link";
import firebase from "config/firebase-tiles.js";
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
  Button,
} from "reactstrap";
import UserHeader from "../Headers/UserHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  
  faArrowLeft,
  
} from "@fortawesome/free-solid-svg-icons";




class MentorClassNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: null,
      loggedInUsername:null,
      mentorsData: {},
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if(user){

        firebase.database().ref(`mentors/${user.uid}`).once("value")
        .then((snap) => {
        if (user) {
          console.log(user.uid);
          firebase
            .database()
            .ref("mentors/" + user.uid)
            .once("value")
            .then((snapshot) => {
              if(snapshot.val()){
                var data = snapshot.val();
                this.setState({
                  loggedInUsername: data.name,
                  mentorsData: data,
                });
              }else{
                alert("NO USER");
                 window.location.href = "/";
              }
            });
        }
      })
      }
      else {
        alert("NO USER");
         window.location.href = "/";
      }
  });
  }

  logoutAdmin = (e) => {
    e.preventDefault();
    firebase
      .auth()
      .signOut()
      .then(() => {
        window.location.href = "/";
      })
      .catch((error) => {
        // An error happened.
      });
  }

  render() {
    return (
      <>
        <Navbar className="navbar-top m-auto navbar-dark"  id="navbar-main" style={{maxWidth:'100%'}}>
          <Container >
            <Link href="../../mentor/dashboard">
              <a className="h4 ml--4 text-white text-uppercase d-none d-lg-inline-block">
                           <a  href="../../mentor/dashboard" ><Button style={{color:"#fff"}} className="m-3 ml-auto" onClick={()=>{                localStorage.removeItem('id');
}} >  <FontAwesomeIcon icon={faArrowLeft} style={{color:"#2F345F"}} /> </Button></a>
 {this.props.brandText}
              </a>
            </Link>
            {/* <Button color="info" className="m-3" onClick={this.logoutAdmin}> Logout</Button> */}
            {/* <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
              <FormGroup className="mb-0">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fas fa-search" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input placeholder="Search" type="text" />
                </InputGroup>
              </FormGroup>
            </Form> */}
            <Nav className="align-items-center d-none d-md-flex" navbar>
              <UncontrolledDropdown nav>
                <DropdownToggle className="pr-0" nav>
                  <Media className="align-items-center">
                    <span className="avatar avatar-sm rounded-circle">
                      <img
                        alt="..."
                        src={require("assets/img/theme/team-4-800x800.jpg")}
                      />
                    </span>
                    <Media className="ml-2 d-none d-lg-block">
                      <span className="mb-0 text-sm font-weight-bold">
                        { this.state.loggedInUsername }
                      </span>
                    </Media>
                  </Media>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                  <DropdownItem className="noti-title" header tag="div">
                    <h6 className="text-overflow m-0">Welcome!</h6>
                  </DropdownItem>
                  <Link href="/mentor/profile">
                    <DropdownItem>
                      <i className="ni ni-single-02" />
                      <span>My profile</span>
                    </DropdownItem>
                  </Link>
                  <Link href="/mentor/profile">
                    <DropdownItem>
                      <i className="ni ni-settings-gear-65" />
                      <span>Settings</span>
                    </DropdownItem>
                  </Link>
                  <Link href="/mentor/profile">
                    <DropdownItem>
                      <i className="ni ni-calendar-grid-58" />
                      <span>Activity</span>
                    </DropdownItem>
                  </Link>
                  <Link href="/mentor/profile">
                    <DropdownItem>
                      <i className="ni ni-support-16" />
                      <span>Support</span>
                    </DropdownItem>
                  </Link>
                  <DropdownItem divider />
                  <DropdownItem href="#pablo" onClick={this.logoutAdmin}>
                    <i className="ni ni-mentors-run" />
                    <span>Logout</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Container>
        </Navbar>
      </>
    );
  }
}

export default MentorClassNavbar;
