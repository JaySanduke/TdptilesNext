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
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import DataTable from "react-data-table-component";
import Header from "components/Headers/admin.js";

import InputGroup from "reactstrap/lib/InputGroup";
// import "../AdminStyles/createClassroom.css";
import Workshop from 'layouts/Workshop.js';
import dynamic from "next/dynamic"
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);
import { EditorState, convertToRaw, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
// import htmlToDraft from "html-to-draftjs";
const htmlToDraft = typeof window === 'object' && require('html-to-draftjs').default;

let s;
let p;
class Editworkshop extends React.Component {
  constructor(props) {
    super(props);
    var today = new Date(),
      date =
        today.getFullYear() +
        "-" +
        ((today.getMonth() + 1 < 10 ? "0" : "") + (today.getMonth() + 1)) +
        "-" +
        ((today.getDate() < 10 ? "0" : "") + (today.getDate()));


    this.handleTitle = this.handleTitle.bind(this);
    this.handleSubTitle = this.handleSubTitle.bind(this);
    this.handleCategory = this.handleCategory.bind(this);
    // this.handleWdesc = this.handleWdesc.bind(this);
    this.handleStartingDate = this.handleStartingDate.bind(this);
    this.handleEndDate = this.handleEndDate.bind(this);
    this.handleWorkshopDuration = this.handleWorkshopDuration.bind(this);
    this.handleRegStartingDate = this.handleRegStartingDate.bind(this);
    this.handleRegEndDate = this.handleRegEndDate.bind(this);
    this.handleMentor = this.handleMentor.bind(this);
    this.handleAssignedmentors = this.handleAssignedmentors.bind(this);
    // this.addSelectedMentors = this.addSelectedMentors.bind(this);
    // this.handleMentorsCheck = this.handleMentorsCheck.bind(this);
    this.deletementor = this.deletementor.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleCourseName = this.handleCourseName.bind(this);
    this.handleCourse = this.handleCourse.bind(this);
    this.handleAssignedcourses = this.handleAssignedcourses.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.deletecourse = this.deletecourse.bind(this);
    this.togglecourse = this.togglecourse.bind(this);
    this.state = {
      workshopTitle: "",
      workshopSubTitle: "",
      workshopCategory: "",
      Wdesc: "",
      starting_date: "",
      end_date: "",
      reg_starting_date: "",
      reg_end_date: "",
      created_date: date,
      mentor: "",
      Workshop_duration: "",
      Mentors: [],
      enrolled_students: [],
      assignedmentors: [],
      mentortemp: [],
      modal: false,
      tempSelectedMentors: [],
      w_id: "",
      // this.props.location.state !== undefined
      //   ? this.props.location.state.id
      //   : "",
      data: [],
      editorState: EditorState.createEmpty(),

      p: [],
      courses: [],
      courseName: "",
      Courses: [],
      assignedcourses: [],
      modalcourse: false,
      selectedData: [],
      s: [],
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      firebase.database().ref(`Admin/${user.uid}`).once("value")
        .then((snap) => {
          var d = snap.val();
          if (d && d.type === 1) {

            var currenturl = window.location.search;
            var currenturlsearch = new URLSearchParams(currenturl);
            var id = currenturlsearch.get("id");
            console.log(id);
            if (id === undefined) {
              window.location.href = "/";
            }
            this.setState({ w_id: id });

            var y = [];
            firebase
              .database()
              .ref("mentors/")
              .once("value")
              .then((snapshot) => {
                snapshot.forEach(function (childSnapshot) {
                  var childData = childSnapshot.val();
                  y.push(childData);
                  // console.log(childData);
                });
                var data = snapshot.val();
                if (data) {
                  this.setState({
                    Mentors: y,
                  });
                }
                // console.log(x);
              });

              var z = [];
            firebase
              .database()
              .ref("Courses/")
              .once("value")
              .then((snapshot) => {
                snapshot.forEach(function (childSnapshot) {
                  var childDatacourse = childSnapshot.val();
                  z.push(childDatacourse);
                  // console.log(childDatacourse)
                });
                var datacourse = snapshot.val();
                if (datacourse) {
                  this.setState({
                    Courses: z,
                  });
                }
                // 
              });

            var x = [];
            firebase
              .database()
              .ref("Workshops/" + id)
              .once("value")
              .then((snapshot) => {
                x = snapshot.val();
                console.log(x);
                if (x) {
                  if (x.data.mentor === "") {
                    this.setState({
                      assignedmentors: [],
                    })
                  }
                  else {
                    this.setState({
                      assignedmentors: x.data.mentor,
                    })
                  }
                  this.setState({
                    data: x,
                    //   Setting up original data of workshop in the fields
                    workshopTitle: x.data.w_details.workshopTitle,
                    workshopSubTitle: x.data.w_details.workshopSubTitle,
                    workshopCategory: x.data.workshopCategory,
                    Workshop_duration: x.data.w_details.Workshop_duration,
                    Wdesc: x.data.w_details.Wdesc,
                    starting_date: x.data.w_details.starting_date,
                    end_date: x.data.w_details.end_date,
                    reg_starting_date: x.data.w_details.reg_starting_date,
                    reg_end_date: x.data.w_details.reg_end_date,
                    // assignedmentors: x.data.mentor,
                    // editorState: x.data.task,
                    s: x.data.courses?x.data.courses:[],
                    assignedcourses: x.data.courses?x.data.courses:[],
                  });
                  var blocksFromHtml = htmlToDraft(x.data.w_details.Wdesc);
                  var { contentBlocks, entityMap } = blocksFromHtml;
                  var contentState = ContentState.createFromBlockArray(
                    contentBlocks,
                    entityMap
                  );
                  var editorState = EditorState.createWithContent(contentState);
                  this.setState({ editorState: editorState });
                }
              });
          }
          else {
            window.location.href = "/";
          }
        })
    })
  }


  handleTitle = (e) => {
    this.setState({ workshopTitle: e.target.value });
  };
  handleSubTitle = (e) => {
    this.setState({ workshopSubTitle: e.target.value });
  };
  handleCategory = (e) => {
    this.setState({ workshopCategory: e.target.value });
  };
  // handleWdesc = (e) => {
  //   this.setState({ Wdesc: e.target.value });
  // };

  handleStartingDate = (e) => {
    this.setState({ starting_date: e.target.value });
    if (this.state.end_date === "") {
    } else {
      var d1 = new Date(e.target.value);
      var d2 = new Date(this.state.end_date);
      var diff = d2.getTime() - d1.getTime();
      var daydiff = 0;
      daydiff = diff / (1000 * 60 * 60 * 24);

      var week = parseInt(daydiff / 7);
      if (week <= 1) {
        var w = " Week, ";
      } else {
        w = " Weeks, ";
      }
      var day = parseInt(daydiff % 7);
      if (day <= 1) {
        var d = " Day";
      } else {
        d = " Days";
      }

      if (week === 0) {
        var duration = day + d;
      } else if (day === 0) {
        duration = week + " Weeks";
      } else if (week < 0 || day < 0) {
        duration = "Please check the End Date";
      } else {
        duration = week + w + day + d;
      }
      this.setState({ Workshop_duration: duration });
    }
  };


  handleEndDate = (e) => {
    this.setState({ end_date: e.target.value });
    if (this.state.starting_date === "") {
    } else {
      var d1 = new Date(this.state.starting_date);
      var d2 = new Date(e.target.value);
      var diff = d2.getTime() - d1.getTime();
      var daydiff = 0;
      daydiff = diff / (1000 * 60 * 60 * 24);

      var week = parseInt(daydiff / 7);
      if (week <= 1) {
        var w = " Week, ";
      } else {
        w = " Weeks, ";
      }
      var day = parseInt(daydiff % 7);
      if (day <= 1) {
        var d = " Day";
      } else {
        d = " Days";
      }

      if (week === 0) {
        var duration = day + d;
      } else if (day === 0) {
        duration = week + " Weeks";
      } else if (week < 0 || day < 0) {
        duration = "Please check the End Date";
      } else {
        duration = week + w + day + d;
      }
      this.setState({ Workshop_duration: duration });
    }
  };
  handleRegStartingDate = (e) => {
    this.setState({ reg_starting_date: e.target.value });
  };

  handleRegEndDate = (e) => {
    this.setState({ reg_end_date: e.target.value });
  };
  handleWorkshopDuration = (e) => {
    this.setState({ Workshop_duration: e.target.value });
  };

  handleMentor = (e) => {
    this.setState({ mentor: e.target.value });
  };

  handleChangeMentors = (state) => {
    this.state.p = (state.selectedRows)
    return p;
  }

  toggle = () => {
    this.setState((prevState) => ({ modal: !prevState.modal }));
  };

  handleAssignedmentors = (state) => {
    // var data = this.state.Mentors;
    this.state.assignedmentors = this.state.p;
    this.setState((prevState) => ({ modal: !prevState.modal }));
  };

  handleCourseName = (e) => {
    this.setState({ courseName: e.target.value });
  };

  handleCourse = (e) => {
    this.setState({ course: e.target.value });
  };

  togglecourse = () => {
    this.setState((prevState) => ({ modalcourse: !prevState.modalcourse }));
  };

  isSubmitAllowed = () => {
    const value =
      this.state.editorState &&
      draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
    if (
      value === null ||
      value === undefined ||
      value === EditorState.createEmpty() ||
      value.trim() === "<p></p>"
    ) {
      alert("Enter Description properly!");
      return false;
    }
    else if (this.state.workshopTitle.trim() === "" ||
      this.state.workshopSubTitle.trim() === "" ||
      this.state.workshopCategory.trim() === "" ||
      this.state.starting_date === "" ||
      this.state.end_date === "" ||
      this.state.reg_starting_date === "" ||
      this.state.reg_end_date === "") {
      alert("Complete form properly");
      return false;
    }
    else {
      return true;
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const value =
      this.state.editorState &&
      draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
    if (!this.isSubmitAllowed()) {
      console.log("not allowed");
    }
    else {

      const db = firebase.database();
      const ref = db.ref(`Workshops/${this.state.w_id}`);
      const a = ref.update({
        data: {
          w_details: {
            workshopTitle: this.state.workshopTitle,
            workshopSubTitle: this.state.workshopSubTitle,
            Wdesc: value,
            enrolled_students: this.state.enrolled_students,
            starting_date: this.state.starting_date,
            end_date: this.state.end_date,
            reg_starting_date: this.state.reg_starting_date,
            reg_end_date: this.state.reg_end_date,
            Workshop_duration: this.state.Workshop_duration,
          },
          created_date: this.state.created_date,
          workshopCategory: this.state.workshopCategory,
          mentor: this.state.assignedmentors,
          quiz: (this.state.data.data.quiz !== undefined) ? this.state.data.data.quiz : [],
          task: (this.state.data.data.task !== undefined) ? this.state.data.data.task : [],
          w_id: this.state.data.data.w_id,
          courses: this.state.assignedcourses,
        },
      }).then(() => {
        alert("Workshop Edited Successfully!");
        window.location.href = `/workshop/Workshopdetails?id=${this.state.w_id}`;
      });
    }
    // const id = a.key;
    // console.log(id);
    // db.ref("Workshop/" + id + "/data/")
    //   .update({
    //     w_id: id,
    //   })
  };

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  
  handleChange = (state) => {

    this.state.s = (state.selectedRows)
    // console.log(s);
    return s;
  }

  handleAssignedcourses = (state) => {


    let datap = this.state.Courses;

    datap.map((item, index) => {
      return (
        this.state.s.map(item2 => {
          if (item.c_id === item2.c_id) {

            this.state.assignedcourses = this.state.s;

          }


          return null;
        })
      )
    })
    var spdata = datap;
    this.setState({
      Courses: spdata,

    });

    this.setState((prevState) => ({ modalcourse: !prevState.modalcourse }));
  }

  deletecourse = (state) => {


    this.state.s.map((item, index) => {

      this.state.assignedcourses.map((item2, index) => {

        if (item.c_id === item2.c_id) {
          console.log(this.state.s);
          this.setState({
            assignedcourses: this.state.s.splice(1, 1),
          })

        }

      })
    })
  }


  deletementor = (id) => {
    var array = this.state.p.filter((element) => element.m_id !== id);
    this.setState({
      p: array,
      assignedmentors: array,
    })
  }

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
        m_id: (item.m_id) ? item.m_id : item.uid ,
        username: item.name,
        email: item.email,
        expertise: item.eduDetails,
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
            color="danger"
            onClick={() => this.deletementor(item.m_id)}
          >
            Remove
          </Button>)
      };
    });


    //data of Datatable of Courses modal
    const columncourses = [
      { name: "Course ID", selector: "c_id", sortable: true },
      { name: "Course Name", selector: "course_title" },
      { name: "Description", selector: "Description" },
      { name: "Start Date", selector: "start_data" },
      { name: "End Date", selector: "end_date" },
    ];

    let bodycourses = this.state.Courses.map((item) => {
      return {
        c_id: item.c_id,
        course_title: item.course_title,
        Description: item.Description,
        start_data: item.start_data,
        end_date: item.end_date,
      };
    });



    //Data of datatable of courses modal
    const columnCoursesTable = [
      { name: "CourseName", selector: "course_title" },
      { name: "Description", selector: "Description" },
      { name: "StartDate", selector: "start_data" },
      { name: "EndDate", selector: "end_date" },
      { name: "", selector: "removebtn" },
    ];

    let bodyCoursesTable = this.state.assignedcourses.map((item) => {

      return {
        course_title: item.course_title,
        Description: item.Description,
        start_data: item.start_data,
        end_date: item.end_date,
        removebtn: (
          <Button
            size="sm"
            color="danger"
            onClick={this.deletecourse}

          >
            Remove
          </Button>)

      };


    });

    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Card>
            <CardHeader>
              <h1>Edit Workshop</h1>
            </CardHeader>
            <CardBody>
              <Form role="form" onSubmit={this.handleSubmit}>
                <FormGroup>
                  <Label for="workshopTitle">Workshop Title</Label>
                  <InputGroup className="input-group-alternative workshopTitle">
                    <Input
                      placeholder="Enter Workshop Name/Title"
                      id="workshopTitle"
                      type="text"
                      value={this.state.workshopTitle}
                      onChange={this.handleTitle}
                      required
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <Label for="workshopSubTitle">Workshop Subtitle</Label>
                  <InputGroup className="input-group-alternative workshopSubTitle">
                    <Input
                      required
                      placeholder="Enter Workshop Subtitle"
                      id="workshopSubTitle"
                      type="text"
                      value={this.state.workshopSubTitle}
                      onChange={this.handleSubTitle}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <Label for="workshopCategory">Workshop Category</Label>
                  <InputGroup className="input-group-alternative workshopTitle">
                    <Input
                      required
                      placeholder="Enter Workshop Name/Title"
                      id="workshopCategory"
                      type="text"
                      value={this.state.workshopCategory}
                      onChange={this.handleCategory}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <Label for="StartingDate">Registration Starting Date</Label>
                  <InputGroup className="input-group-alternative mb-3">
                    <Input
                      min={this.state.created_date}
                      max={this.state.reg_end_date !== ""
                        ? this.state.reg_end_date
                        : ""}
                      required
                      placeholder
                      id="StartingDate"
                      type="date"
                      value={this.state.reg_starting_date}
                      onChange={this.handleRegStartingDate}
                    />
                  </InputGroup>
                </FormGroup>
                {this.state.reg_starting_date !== "" &&
                  <FormGroup>
                    <Label for="EndDate">Registration Ending Date</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        min={this.state.reg_starting_date}
                        max={this.state.starting_date !== ""
                          ? this.state.starting_date
                          : ""}
                        required
                        placeholder
                        id="EndDate"
                        type="date"
                        value={this.state.reg_end_date}
                        onChange={this.handleRegEndDate}
                      />
                    </InputGroup>
                  </FormGroup>
                }

                {this.state.reg_end_date !== "" &&
                  <FormGroup>
                    <Label for="StartingDate">Starting Date</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        min={this.state.reg_end_date}
                        max={this.state.end_date !== ""
                          ? this.state.end_date
                          : ""}
                        required
                        placeholder
                        id="StartingDate"
                        type="date"
                        value={this.state.starting_date}
                        onChange={this.handleStartingDate}
                      />
                    </InputGroup>
                  </FormGroup>
                }

                {this.state.starting_date !== "" &&
                  <FormGroup>
                    <Label for="EndDate">End Date</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        min={this.state.starting_date}
                        required
                        placeholder
                        id="EndDate"
                        type="date"
                        value={this.state.end_date}
                        onChange={this.handleEndDate}
                      />
                    </InputGroup>
                  </FormGroup>
                }
                <FormGroup>
                  <Label for="WorkshopDuration">Workshop Duration</Label>
                  <InputGroup className="input-group-alternative text-muted duration mb-3">
                    <Input
                      disabled
                      required
                      placeholder="Workshop Duration"
                      id="duration"
                      type="text"
                      value={(this.state.starting_date !== "" && this.state.end_date !== "") ? (this.state.Workshop_duration) : ""}
                      onChange={this.handleWorkshopDuration}
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <Label for="Wdesc">Workshop Description</Label>
                  <Editor
                    editorState={this.state.editorState}
                    toolbarClassName="toolbar-class"
                    wrapperClassName="wrapper-class"
                    onEditorStateChange={this.onEditorStateChange}
                    editorStyle={{
                      minHeight: "200px",
                      border: "1px solid",
                      padding: "0 10px",
                    }}
                  />
                  {/* <InputGroup className="input-group-alternative duration mb-3">
                    <Input
                      required
                      placeholder="Enter Workshop Description"
                      id="Wdesc"
                      type="textarea"
                      value={this.state.Wdesc}
                      onChange={this.handleWdesc}
                    />
                  </InputGroup> */}
                </FormGroup>

                <FormGroup className="w-100">
                  <div>Courses</div>

                  <div className="d-block w-100">
                    {this.state.assignedcourses[0] && <DataTable
                      title="Assigned Courses"
                      columns={columnCoursesTable}
                      data={bodyCoursesTable}




                      pagination={true}

                      persistTableHead
                    // progressComponent={<LinearIndeterminate />}
                    />}
                  </div>
                  <div className="d-block p-0 mt-4">
                    <Button className="" color="primary" onClick={this.togglecourse}>
                      Select Courses
                    </Button>
                  </div>
                  <Modal isOpen={this.state.modalcourse} toggle={this.togglecourse} style={{ width: '70vw' }}>
                    <ModalHeader className="" toggle={this.togglecourse}>
                      Add Courses
                    </ModalHeader>
                    <ModalBody className="mt-0 pt-0">
                      <DataTable
                        title="Courses"
                        selectableRows
                        onSelectedRowsChange={this.handleChange}

                        columns={columncourses}
                        data={bodycourses}
                        pagination={true}
                        selectableRowsSingle selectableRowsComponentProps={{ type: 'radio' }}

                        persistTableHead
                      // progressComponent={<LinearIndeterminate />}
                      />
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color="success"

                        onClick={this.handleAssignedcourses}

                      >
                        Add
                      </Button>{" "}
                      <Button color="secondary" onClick={() => this.setState({ modalcourse: false })}>
                        Cancel
                      </Button>
                    </ModalFooter>
                  </Modal>

                  {/* </InputGroup> */}
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
                      <i class="fas fa-user-plus"></i> Add Mentors
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
                        clicked
                        onSelectedRowsChange={this.handleChangeMentors}
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
                        onClick={this.handleAssignedmentors}
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
                    Edit Workshop
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


Editworkshop.layout = Workshop;
export default Editworkshop;
