


import React from "react";

import classnames from "classnames";

import Chart from "chart.js";

import { Line, Bar } from "react-chartjs-2";
import { Doughnut, Pie } from "react-chartjs-2";
import DocumentMeta from "react-document-meta";
import firebase from "../../config/firebase-tiles";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";
//layout for this page 
//hAvOUbAX
import User from "layouts/User.js";
//core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";
import Router from "next/router";

import Header from "components/Headers/UserMainDashboard.js";
class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    var today = new Date(),
      date =
        today.getFullYear();
    this.state = {
      activeNav: 0,
      chartExample1Data: "data1",
      userdata: "",
      classes: 0,
      quiz: 0,
      task: 0,
      quizLegend: 0,
      taskLegend: 0,
      classLegend: 0,
      barColor: 'darkgreen',
      backBar: 'lightgreen',
      totalarray: [],
      arraymonth: [],
      taskmonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      quizmonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      classmonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

      totalquiz: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      totaltask: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      totalmeets: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      year: date,
      barHeight: 0,

    };
  }



  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      firebase
        .database()
        .ref(`users/${user.uid}`)
        .once("value")
        .then((snap) => {

          var userCheck = snap.val();
          if (userCheck.blocked == 1) {
            Router.push("/");
          }
          var userdata = snap.val();
          //  console.log(userdata);
          var tts = this;
          this.setState({ userdata: userdata })

          // **************** Total data ***************

          userdata.classroom.map((item) => {
            firebase
              .database()
              .ref("Classroom/" + item + "/data/quiz")
              .once("value")
              .then((snapshot) => {
                snapshot.forEach((Childsnapshot) => {
                  var data = Childsnapshot.val();
                  firebase
                    .database()
                    .ref("Quiz/classQ/" + data + "/data/")
                    .once("value")
                    .then((ChildSubsnapshot) => {


                      this.setState({ quizLegend: this.state.quizLegend + 1, barHeight: this.state.quizLegend + 1 });



                      var totalquizdata = ChildSubsnapshot.val();
                      console.log(totalquizdata)
                      var submitDates = totalquizdata.end_date;
                      var month = submitDates[5] + submitDates[6];
                      var todayYear = submitDates[0] + submitDates[1] + submitDates[2] + submitDates[3];
                      if (todayYear == this.state.year) {
                        var nummonth = parseInt(month);
                        nummonth = nummonth - 1;
                        const newItems = [...tts.state.totalquiz];

                        newItems[nummonth] = newItems[nummonth] + 1;
                        this.setState({ totalquiz: newItems, totalarray: newItems });
                      }
                    })


                })
              })
          })

          userdata.classroom.map((item) => {
            firebase
              .database()
              .ref("Classroom/" + item + "/data/task")
              .once("value")
              .then((snapshot) => {
                snapshot.forEach((Childsnapshot) => {
                  var data = Childsnapshot.val();
                  firebase
                    .database()
                    .ref("Tasks/classT/" + data + "/data/")
                    .once("value")
                    .then((ChildSubsnapshot) => {
                      var totalquizdata = ChildSubsnapshot.val();
                      console.log(totalquizdata)
                      this.setState({ taskLegend: this.state.taskLegend + 1 });


                      var submitDates = totalquizdata.due_date;
                      var month = submitDates[5] + submitDates[6];
                      var todayYear = submitDates[0] + submitDates[1] + submitDates[2] + submitDates[3];
                      if (todayYear == this.state.year) {
                        var nummonth = parseInt(month);
                        nummonth = nummonth - 1;
                        const newItems = [...tts.state.totaltask];

                        newItems[nummonth] = newItems[nummonth] + 1;
                        this.setState({ totaltask: newItems });
                      }
                    })


                })
              })
          })

          userdata.classroom.map((item) => {
            firebase
              .database()
              .ref("Classroom/" + item + "/data/meet")
              .once("value")
              .then((snapshot) => {
                var ClassData = snapshot.val();
                tts = this;
                snapshot.forEach((childSnapshot) => {

                  //  console.log(childSnapshot.val())
                  var meetData = childSnapshot.val();
                  // if(meetData){
                  childSnapshot.forEach((totalmeets) => {
                    this.setState({ classLegend: this.state.classLegend + 1 });
                    // console.log(totalmeets.val());
                    var meetdates = totalmeets.val();

                    var submitDates = meetdates.date;
                    // console.log(submitDates);
                    var month = submitDates[5] + submitDates[6];
                    // console.log(month)
                    var todayYear = submitDates[0] + submitDates[1] + submitDates[2] + submitDates[3];
                    if (todayYear == this.state.year) {
                      var nummonth = parseInt(month);
                      nummonth = nummonth - 1;
                      //  console.log(nummonth)
                      const newItems = [...tts.state.totalmeets];

                      newItems[nummonth] = newItems[nummonth] + 1;
                      this.setState({ totalmeets: newItems });
                    }

                  })


                  //  }









                  //  console.log(childSnapshot.hasChild(user.uid));

                })
              })
          })





          // ******************indiviaual data*************

          // console.log(userdata);
          userdata.classroom.map((item) => {
            firebase
              .database()
              .ref("Classroom/" + item + "/data/meet")
              .once("value")
              .then((snapshot) => {
                var ClassData = snapshot.val();
                tts = this;
                snapshot.forEach((childSnapshot) => {

                  //  console.log(childSnapshot.val())
                  var meetData = childSnapshot.val();
                  //  if(meetData.data.attendance){
                  meetData.data.attendance ? meetData.data.attendance.map((userItem) => {
                    if (userItem == user.uid) {
                      this.setState({ classes: tts.state.classes + 1 })
                      var submitDates = meetData.data.date;
                      var month = submitDates[5] + submitDates[6];
                      var nummonth = parseInt(month);
                      nummonth = nummonth - 1;

                      const newItems = [...tts.state.classmonth];

                      newItems[nummonth] = newItems[nummonth] + 1;
                      this.setState({ classmonth: newItems });
                    }

                  }) : null;
                  // };  






                  //  console.log(childSnapshot.hasChild(user.uid));

                })
              })
          })

          userdata.classroom.map((item) => {
            firebase
              .database()
              .ref("Answers/Classroom/" + item)
              .once("value")
              .then((snapshot) => {
                var ClassData = snapshot.val();
                tts = this;
                snapshot.forEach((childSnapshot) => {

                  console.log(childSnapshot.val())
                  if (childSnapshot.child(user.uid).val()) {
                    var sudate = childSnapshot.child(user.uid).val();
                    var submitDates = sudate.submitDate;
                    console.log(submitDates);
                    var month = submitDates[3] + submitDates[4];
                    console.log(month)
                    var nummonth = parseInt(month);
                    nummonth = nummonth - 1;
                    // console.log(nummonth)
                    const newItems = [...tts.state.quizmonth];

                    newItems[nummonth] = newItems[nummonth] + 1;
                    this.setState({ quizmonth: newItems, arraymonth: newItems });


                  }

                  if (childSnapshot.hasChild(user.uid)) {
                    tts.setState({ quiz: tts.state.quiz + 1 })
                  }
                  //  console.log(childSnapshot.hasChild(user.uid));

                })
              })
          })

          userdata.classroom.map((item) => {
            firebase
              .database()
              .ref("TaskSubmit/classT/" + item)
              .once("value")
              .then((snapshot) => {
                var ClassData = snapshot.val();

                snapshot.forEach(function (childSnapshot) {




                  console.log(childSnapshot.val())
                  childSnapshot.forEach((useritem) => {
                    var sudate = useritem.val();
                    var submitdate = sudate.data.submitDate;
                    //  console.log(submitdate)
                    var month = submitdate[5] + submitdate[6];

                    var nummonth = parseInt(month);
                    // console.log(month)
                    nummonth = nummonth - 1;

                    const newItems = [...tts.state.taskmonth];
                    newItems[nummonth] = newItems[nummonth] + 1;
                    tts.setState({ taskmonth: newItems });
                    // this.setState({taskmonth : this.state.taskmonth[nummonth] + 1});



                  })


                  var childData = childSnapshot.val();
                  //  console.log(childData);
                  if (childSnapshot.hasChild(user.uid)) {
                    tts.setState({ task: tts.state.task + 1 })
                  }
                  //  console.log(childSnapshot.hasChild(user.uid));

                })
              })
          })



        })




    })



  }

  toggleArr = (id) => {
    // task , id=1;
    if (id === 1) {
      this.setState({
        arraymonth: this.state.taskmonth,
        totalarray: this.state.totaltask,
        barColor: 'Red',
        backBar: '#ffcccb',
        activeNav: 1,
        barHeight: this.state.taskLegend,

      })
    }
    else if (id === 0) {
      this.setState({
        arraymonth: this.state.quizmonth,
        totalarray: this.state.totalquiz,
        barColor: 'DarkGreen',
        backBar: 'lightgreen',
        activeNav: 0,
        barHeight: this.state.quizLegend,


      })
    }
    else if (id === 2) {
      this.setState({
        arraymonth: this.state.classmonth,
        totalarray: this.state.totalmeets,
        barColor: 'Blue',
        backBar: 'skyblue',
        activeNav: 2,

        barHeight: this.state.classLegend,

      })
    }

  }



  render() {

    const meta = {
      title: "Dashboard",
      description: "TDPVista",
      canonical: "https://tiles.tdpvista.in",
      meta: {
        charset: "utf-8",
        name: {
          keywords:
            "tdpvista,support,contact,form,registration,learning,education,call,helpline,helpdesk,query",
        },
      },
    };

    var data = {
      labels: ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      datasets: [


        {
          label: "Attempted",
          backgroundColor: this.state.barColor,
          borderWidth: 1,
          data: this.state.arraymonth,
          xAxisID: "bar-x-axis1",
          yAxisID: "bar-y-axis1",
          stack: 1
        },
        {
          label: "Total",
          backgroundColor: this.state.backBar,
          borderWidth: 1,
          data: this.state.totalarray,
          yAxisID: "bar-y-axis2",
          xAxisID: "bar-x-axis1",
          stack: 1
        },
      ]
    };

    var options = {
      scales: {
        xAxes: [{
          stacked: true,
          id: "bar-x-axis1",
          barThickness: 15,
        },
        ],

        yAxes: [{
          id: "bar-y-axis1",
          stacked: true,
          ticks: {
            beginAtZero: true,
            max: this.state.barHeight,

          },
        },
        {
          id: "bar-y-axis2",
          display: false,
          stacked: true,
          ticks: {
            beginAtZero: true,
            max: this.state.barHeight,

          },
        }]

      }
      , legend: {
        display: false
      },
    };

    const piedata = {
      maintainAspectRatio: true,
      responsive: false,
      labels: ["Quiz", "Task", "Classes"],
      datasets: [
        {
          label: 'Activity',
          backgroundColor: [
            '#039BE5',
            '#33B679',
            '#D50000',

          ],

          data: [this.state.quiz, this.state.task, this.state.classes]
        }
      ]
    };


    return (
      <>
        <DocumentMeta {...meta} />
        <Header data={this.state.userdata ? this.state.userdata : ""} quiz={this.state.quiz ? this.state.quiz : "0"} task={this.state.task ? this.state.task : "0"} />

        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="mb-5 mb-xl-0" xl="8">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-light ls-1 mb-1">
                        Student Details
                      </h6>
                      <h2 className="text-black mb-0">Performance</h2>
                    </div>
                    <div className="col">
                      <Nav className="justify-content-end" pills>
                        <NavItem>
                          <NavLink
                            className={classnames("py-2 px-3", {
                              active: this.state.activeNav === 0,
                            })}
                            href="#pablo"
                            onClick={() => this.toggleArr(0)}
                          >
                            <span className="d-none d-md-block">Quiz</span>
                            <span className="d-md-none">Q</span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames("py-2 px-3", {
                              active: this.state.activeNav === 1,
                            })}
                            data-toggle="tab"
                            href="#pablo"
                            onClick={() => this.toggleArr(1)}
                          >
                            <span className="d-none d-md-block">Task</span>
                            <span className="d-md-none">T</span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames("py-2 px-3", {
                              active: this.state.activeNav === 2,
                            })}
                            data-toggle="tab"
                            href="#pablo"
                            onClick={() => this.toggleArr(2)}
                          >
                            <span className="d-none d-md-block">Classes</span>
                            <span className="d-md-none">C</span>
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody style={{ padding: '1.5rem' }}>
                  {/* Chart */}
                  <div className="chart">
                    <div style={{ display: "flex", margin: 'auto', justifyContent: 'center', alignItems: "center" }}>
                      <span style={{ display: "flex", padding: "10px", alignItems: "center" }}><div style={{ height: "15px", width: '15px', backgroundColor: `${this.state.barColor}`, marginRight: "15px" }}></div> Attempted</span>
                      <span style={{ display: "flex", padding: "10px", alignItems: "center" }}><div style={{ height: "15px", width: '15px', backgroundColor: `${this.state.backBar}`, marginRight: "15px" }}></div> Total</span>
                    </div>
                    <Bar
                      data={data}
                      width={null}
                      height={null}
                      options={options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl="4">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Classroom Details
                      </h6>
                      <h2 className="mb-0">Activities</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  <div className="chart">
                    <Pie style={{ height: "100%", width: '100%', padding: '0px' }}
                      data={piedata}
                      options={{
                        title: {
                          display: false,

                          fontSize: 20
                        },
                        legend: {
                          display: false,
                          position: 'right',
                          width: '10%',
                          fontSize: 25,
                        }
                      }}
                    />
                    <div className="legends" style={{ textAlign: 'center', alignItems: 'center', justifyContent: 'center', marginTop: "40px", paddingTop: '20px', margin: 'auto', width: '30%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', margin: 'auto' }}> <div class="circle" style={{ height: '15px', width: '15px', backgroundColor: '#039BE5', borderRadius: '50%', marginRight: '20px' }}></div><h3>Classes</h3></div>
                      <div style={{ display: 'flex', alignItems: 'center', margin: 'auto' }}> <div class="circle" style={{ height: '15px', width: '15px', backgroundColor: '#33B679', borderRadius: '50%', marginRight: '20px' }}></div><h3>Task</h3></div>
                      <div style={{ display: 'flex', alignItems: 'center', margin: 'auto' }}> <div class="circle" style={{ height: '15px', width: '15px', backgroundColor: '#D50000', borderRadius: '50%', marginRight: '20px' }}></div><h3>Quiz</h3></div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/* <Row className="mt-5">
            <Col className="mb-5 mb-xl-0" xl="8">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Page visits</h3>
                    </div>
                    <div className="col text-right">
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        size="sm"
                      >
                        See all
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                {/* <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Page name</th>
                      <th scope="col">Visitors</th>
                      <th scope="col">Unique users</th>
                      <th scope="col">Bounce rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">/argon/</th>
                      <td>4,569</td>
                      <td>340</td>
                      <td>
                        <i className="fas fa-arrow-up text-success mr-3" /> 46,53%
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">/argon/index.html</th>
                      <td>3,985</td>
                      <td>319</td>
                      <td>
                        <i className="fas fa-arrow-down text-warning mr-3" />{" "}
                        46,53%
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">/argon/charts.html</th>
                      <td>3,513</td>
                      <td>294</td>
                      <td>
                        <i className="fas fa-arrow-down text-warning mr-3" />{" "}
                        36,49%
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">/argon/tables.html</th>
                      <td>2,050</td>
                      <td>147</td>
                      <td>
                        <i className="fas fa-arrow-up text-success mr-3" /> 50,87%
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">/argon/profile.html</th>
                      <td>1,795</td>
                      <td>190</td>
                      <td>
                        <i className="fas fa-arrow-down text-danger mr-3" />{" "}
                        46,53%
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
            </Col>
            <Col xl="4">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Social traffic</h3>
                    </div>
                    <div className="col text-right">
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        size="sm"
                      >
                        See all
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Referral</th>
                      <th scope="col">Visitors</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">Facebook</th>
                      <td>1,480</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">60%</span>
                          <div>
                            <Progress
                              max="100"
                              value="60"
                              barClassName="bg-gradient-danger"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Facebook</th>
                      <td>5,480</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">70%</span>
                          <div>
                            <Progress
                              max="100"
                              value="70"
                              barClassName="bg-gradient-success"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Google</th>
                      <td>4,807</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">80%</span>
                          <div>
                            <Progress max="100" value="80" />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Instagram</th>
                      <td>3,678</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">75%</span>
                          <div>
                            <Progress
                              max="100"
                              value="75"
                              barClassName="bg-gradient-info"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">twitter</th>
                      <td>2,645</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">30%</span>
                          <div>
                            <Progress
                              max="100"
                              value="30"
                              barClassName="bg-gradient-warning"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </Table> 
              </Card>
            </Col>
          </Row> */}
        </Container>


      </>
    )
  };
};
Dashboard.layout = User;

export default Dashboard;

