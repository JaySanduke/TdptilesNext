import React, { useState } from "react";
import firebase from "../../config/firebase-tiles";
import ReactHtmlParser from "react-html-parser";
import { format } from 'date-fns';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
faSchool,
faUser,
faBookOpen,
  faClock,
  faQuestion,
  faBook,
  faPencilAlt,
  faUserAlt,
  faUsers,
  
  
} from "@fortawesome/free-solid-svg-icons";


// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";


function Header(props) {


 
  return (
    
    <>
      <div className="header  pb-8 pt-5 pt-md-8" style={{backgroundColor:'#2F345F'}}>
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0" style={{height:'110px'}}>
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Classrooms
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{props.classroom ? props.classroom : ""}</span>
                      
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
 <FontAwesomeIcon icon={faSchool} style={{color:"#fff"}} />                        </div>
                      </Col>
                    </Row>
                  
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0" style={{height:'110px'}}>
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                       Workshops
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {props.work ? props.work : " " }
                        
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
 <FontAwesomeIcon icon={faPencilAlt} style={{color:"#fff"}} />                        </div>
                      </Col>
                    </Row>
                  
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3" >
                <Card className="card-stats mb-4 mb-xl-0" style={{height:'110px'}}>
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Students in Classes
                        </CardTitle>
                        {/* <span className="h2 font-weight-bold mb-0">{props.mentor ? props.mentor :  " "}</span> */}
                                    <span className="h2 font-weight-bold mb-0">{props.userC ? props.userC :  " "}</span>

                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
 <FontAwesomeIcon icon={faUser} style={{color:"#fff"}} />                        </div>
                      </Col>
                    </Row>
               
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0 p-1 " style={{height:'110px'}}>
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                       Student in Workshops
                        </CardTitle>
                                                            <span className="h2 font-weight-bold mb-0">{props.userW ? props.userW :  " "}</span>


                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
 <FontAwesomeIcon icon={faUsers} style={{color:"#fff"}} />                        </div>
                      </Col>
                    </Row>
                   
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
}

export default Header;
