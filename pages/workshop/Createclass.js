import React from "react";

import firebase from "../../config/firebase-tiles";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
// core components

import DataTable from "react-data-table-component";

import Header from "components/Headers/admin.js";

// import InputGroup from "reactstrap/lib/InputGroup";

// import "../AdminStyles/createClassroom.css";


class CreateClass extends React.Component {
  constructor(props) {
    super(props);
    var today = new Date(),
      date =
      today.getFullYear() +
      "-" +
      ((today.getMonth() + 1 < 10 ? "0" : "") + (today.getMonth() + 1)) +
      "-" +
      ((today.getDate() < 10 ? "0" : "") + (today.getDate()));

    
    this.handleName = this.handleName.bind(this);
    this.handleStartingDate = this.handleStartingDate.bind(this);
    this.handleEndDate = this.handleEndDate.bind(this);
    this.handleClassDuration = this.handleClassDuration.bind(this);
    this.handleCourseName = this.handleCourseName.bind(this);
    this.handleMentor = this.handleMentor.bind(this);
    this.handleAssignedmentors = this.handleAssignedmentors.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {
      className: "",
      created_date: date,
      class_id: "",
      mentor: "",
      starting_date: "",
      end_date: "",
      courseName: "",
      classroom_duration: "",      
      Mentors: [],
      assignedmentors: [],
      mentortemp: [],
      modal: false,
    };
  }

  componentDidMount() {
    var x = [];
    firebase
      .database()
      .ref("Mentors/")
      .once("value")
      .then((snapshot) => {
        snapshot.forEach(function (childSnapshot) {
          var childData = childSnapshot.val();
          x.push(childData);
          console.log(childData)
        });
        var data = snapshot.val();
        if (data) {
          this.setState({
            Mentors: x,
          });
        }
        // console.log(x);
      });
  }

  handleName = (e) => {
    this.setState({ className: e.target.value });
  };

  handleStartingDate = (e) => {
    this.setState({ starting_date: e.target.value });
  };

  handleEndDate = (e) => {
    this.setState({ end_date: e.target.value });
  };

  handleClassDuration = (e) => {
    this.setState({ classroom_duration: e.target.value });
  };

  handleCourseName = (e) => {
    this.setState({ courseName: e.target.value });
  };

  handleMentor = (e) => {
    this.setState({ mentor: e.target.value });
  };

  toggle = () => {
    this.setState((prevState) => ({ modal: !prevState.modal }));
  };  

  handleAssignedmentors = (state) => {
    var s = this.state.assignedmentors
    s.push(state.selectedRows)
    console.log(state.selectedRows)

    this.setState.assignedmentors = s;

    var data = this.state.Mentors;

    data.map((item,Index) => {
      return(
      this.state.assignedmentors.map(item2 => {
        if (item.m_id === item2.m_id) {
        data.splice(Index,1)}
        return null;
    })
      )      
    })
    var sdata = data;
    this.setState({
      Mentors: sdata,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const db = firebase.database();
    const ref = db.ref("Classes/Workshop/");
    const a = ref.push({
      data: {
        className: this.state.className,
        starting_date: this.state.starting_date,
        end_date: this.state.end_date,
        classroom_duration: this.state.classroom_duration,
        created_date: this.state.created_date,
        courseName: this.state.courseName,
        mentor: this.state.mentor,
        class_id: "",
      },
    });
    const id = a.key;
    db.ref("Classes/Workshop/" + id + "/data/")
      .update({
        class_id: id,
      })
      .then(() => {
        alert("Class Created Successfully!");
        window.location.href = "/workshop/createclass";
      });
  };

  render() {
    //data of Datatable of modal
    const column = [
      { name: "Mentor ID", selector: "m_id", sortable: true },
      { name: "Username", selector: "username" },
      { name: "Email", selector: "email" },
      { name: "Expertise", selector: "expertise" },
    ];

    const body = this.state.Mentors.map((item) => {
      return {
        m_id: item.m_id,
        username: item.fname + " " + item.lname,
        email: item.email,
        expertise: item.expertise,
      };
    });
    
    //Data of datatable of modal
    const column1 = [
      { name: "Username", selector: "username", sortable: true },
      { name: "Email", selector: "email" },
      { name: "Expertise", selector: "expertise" },
      { name: "", selector: "removebtn" },
    ];

    const body1 = this.state.assignedmentors.map((item) => {
      return {
        username: item.username,
        email: item.email,
        expertise: item.expertise,
        removebtn: (
        <Button
          size="sm"
          color="danger">
          Remove
        </Button>)
      };
    });    

    var d1 = new Date(this.state.starting_date);   
    var d2 = new Date(this.state.end_date);
    var diff = d2.getTime() - d1.getTime();
    var daydiff = 0;
    daydiff = diff / (1000 * 60 * 60 * 24);

    var week = parseInt(daydiff/7);
    if(week <= 1) {
      var w = " Week, ";
    }
    else {
       w = " Weeks, "
    }
    var day = parseInt(daydiff%7);
    if(day <= 1) {
      var d = " Day";
    }
    else {
       d = " Days"
    }

    if(week === 0) {
      var duration = day+d;
    }
    else if(day === 0) {
       duration = week+" Weeks";
    }
    else if(week < 0 || day < 0 ) {
       duration = "Please check the End Date";      
    }
    else {
       duration = week+w+day+d;
    }
    this.state.classroom_duration = duration;

    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Card>
            <CardHeader>
              <h1>Create Class</h1>
            </CardHeader>
            <CardBody>
              <Form role="form" onSubmit={this.handleSubmit}>
                <FormGroup>
                  <Label for="ClassName">Class Name</Label>
                  <InputGroup className="input-group-alternative className">
                    <Input
                      required
                      placeholder="Enter class Name"
                      id="className"
                      type="text"
                      value={this.state.className}
                      onChange={this.handleName}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <Label for="StartingDate">Starting Date</Label>
                  <InputGroup className="input-group-alternative mb-3">
                    <Input
                      min = {this.state.created_date}
                      required
                      placeholder
                      id="StartingDate"
                      type="date"
                      value={this.state.starting_date}
                      onChange={this.handleStartingDate}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <Label for="EndDate">End Date</Label>
                  <InputGroup className="input-group-alternative mb-3">
                    <Input
                      min = {this.state.starting_date!==""?this.state.starting_date:this.state.end_date}
                      required
                      placeholder
                      id="EndDate"
                      type="date"
                      value={this.state.end_date}
                      onChange={this.handleEndDate}
                    />
                  </InputGroup>
                </FormGroup>
                {/* <p>
                  <b>Date Of Creation</b>
                  <br />
                  {this.state.created_date}
                </p> */}
                <FormGroup>
                  <Label for="ClassDuration">Class Duration</Label>
                  <InputGroup className="input-group-alternative text-muted duration mb-3">
                    <Input
                      disabled
                      required
                      placeholder="Class Duration"
                      id="duration"
                      type="text"
                      value={(this.state.starting_date!=="" && this.state.end_date!=="")? (this.state.classroom_duration):"" }
                      onChange={this.handleClassDuration}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <Label for="Courses">Courses</Label>
                  <InputGroup className="input-group-alternative duration mb-3">
                    <Input
                      required
                      placeholder="Enter Courses"
                      id="AddCourses"
                      type="text"
                      onChange={this.handleCourseName}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup className="w-100">
                  <div>Mentors</div>
                  {/* <InputGroup className="input-group-alternative duration mb-3"> */}
                    <div className="d-block w-100">
                    {this.state.assignedmentors[0] && <DataTable
                          title="Assigned Mentors"                          
                          columns={column1}                      
                          data={body1}
                          pagination={true}
                          // progressPending={this.state.pending}
                          persistTableHead
                          // progressComponent={<LinearIndeterminate />}
                        />}
                    </div>
                  <div className="d-block p-0 mt-4">
                    <Button className="" color="primary" onClick={this.toggle}>
                    <i class="fas fa-user-plus"></i>
                    </Button>
                  </div>
                    <Modal isOpen={this.state.modal} toggle={this.toggle}>
                      <ModalHeader className="" toggle={this.toggle}>
                       Add Mentors
                      </ModalHeader>
                      <ModalBody className="mt-0 pt-0">
                        <DataTable
                          title="Mentors"
                          selectableRows
                          onSelectedRowsChange = {this.handleAssignedmentors}
                          columns={column}
                          data={body}
                          pagination={true}
                          // progressPending={this.state.pending}
                          persistTableHead
                          // progressComponent={<LinearIndeterminate />}
                        />
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="success"
                        >
                          Add
                        </Button>{" "}
                        <Button color="secondary" onClick={() => this.setState({ modal: false })}>
                          Cancel
                        </Button>
                      </ModalFooter>
                    </Modal>
                  
                  {/* </InputGroup> */}
                </FormGroup>
                <div className="text-center">
                  <Button className="mt-4" color="primary" type="submit">
                    Create Class
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }
}

export default CreateClass;
