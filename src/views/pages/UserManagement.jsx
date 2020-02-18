import React from "react";
// reactstrap components
import {
    Button,
    Label,
    Card,
    CardImg,
    Container,
    CardBody,
    Row,
    Col,
    Modal,
    ModalHeader,
    ModalBody,
    Input,
    FormGroup,
    Form
} from "reactstrap";
import Select from 'react-select'

class UserManagement extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            users: [],
            teams: [],
            editUser: { label: "", value: "" },
            editUserValue: "",
            addModal: false,
            editUserModal: false,
            addUserName: "",
            addUserEmail: "",
            addUserPhone: "",
            addUserTeam: { label: "", value: "" },
            addType: "",
            addDepartment: "",
            addActive: "",
            editUserName: "",
            editUserPhone: "",
            editUserEmail: "",
            editType: "",
            editDepartment: "",
            editActive: "",
            editSkills: {
                sales: {},
                serviceToSales: {},
                service: {},
                textEmail: {}
            },
            addSkills: {
                sales: {
                    newLeads: false,
                    day1And2: false,
                    day3And4: false,
                    missedAppointments: false,
                    day7: false,
                    day10: false,
                    day15: false,
                    day20: false
                },
                serviceToSales: {
                    serviceDriveRd1: false,
                    serviceDriveRd2: false,
                    dataMiningHighInterest: false,
                    dataMiningLeases: false,
                    dataMiningBuyBack: false
                },
                service: {
                    missedAppointments: false,
                    day7: false,
                    day14: false,
                    firstService: false,
                    serviceReminder: false
                },
                textEmail: {
                    newLeads: false,
                    day1And2: false,
                    day5: false,
                    day10: false,
                    day20: false,
                    missedAppointments: false
                }
            }
        }
        this.toggle = this.toggle.bind(this)
        this.onValueChange = this.onValueChange.bind(this)
        this.addNewUser = this.addNewUser.bind(this)
        this.updateUser = this.updateUser.bind(this)
        this._isMounted = false
    }
    async componentWillMount() {
        this._isMounted = true
        this._isMounted && this.setState({ loading: true })
        let users = this._isMounted && await this.props.mongo.find("agents")
        this._isMounted && users.sort((a, b) => {
            if (a.name < b.name) return -1
            if (b.name < a.name) return 1
            return 0
        })
        let teams = this._isMounted && await this.props.mongo.find("teams");
        this._isMounted && teams.sort((a, b) => {
            if (a.label < b.label) return -1
            if (b.label < a.label) return 1
            return 0
        })
        let userOptions = []
        for (let u in users) {
            userOptions[u] = {}
            userOptions[u].label = users[u].name
            userOptions[u].value = users[u]._id
        }
        this._isMounted && this.setState({ loading: false, users: userOptions, teams })
        // this.setState({dealershipGroups: groups})
    }
    componentDidMount() {
        this._isMounted = true
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    toggle(modal_name) {
        if (this.state[modal_name] === false) {
            this.clearAddValues()
        }
        this._isMounted && this.setState({ [modal_name]: !this.state[modal_name] })
    }
    onValueChange(key, value) {
        this._isMounted && this.setState({ [key]: value })
    }
    clearAddValues() {
        this.setState({
            addUserName: "",
            addUserEmail: "",
            addUserPhone: "",
            addUserTeam: { label: "", value: "" },
            addType: "",
            addActive: "",
            addDepartment: "",
            addSkills: {
                sales: {
                    newLeads: false,
                    day1And2: false,
                    day3And4: false,
                    missedAppointments: false,
                    day7: false,
                    day10: false,
                    day15: false,
                    day20: false
                },
                serviceToSales: {
                    serviceDriveRd1: false,
                    serviceDriveRd2: false,
                    dataMiningHighInterest: false,
                    dataMiningLeases: false,
                    dataMiningBuyBack: false
                },
                service: {
                    missedAppointments: false,
                    day7: false,
                    day14: false,
                    firstService: false,
                    serviceReminder: false
                },
                textEmail: {
                    newLeads: false,
                    day1And2: false,
                    day5: false,
                    day10: false,
                    day20: false,
                    missedAppointments: false
                }
            }
        })
    }
    async addNewGroup() {
        this._isMounted && this.setState({ loading: true })
        let groups = this._isMounted && await this.props.mongo.find("dealership_groups")
        let names = groups.map((g) => {
            return g.label
        })
        let newGroup = this.props.utils.toTitleCase(this.state.newDealershipGroup)
        if (names.indexOf(newGroup) === -1) {
            let x = this._isMounted && await this.props.mongo.insertOne("dealership_groups", {
                label: newGroup,
            })
            this._isMounted && await this.props.mongo.findOneAndUpdate("dealership_groups", { label: newGroup }, { value: x.insertedId })
            groups = this._isMounted && await this.props.mongo.find("dealership_groups")
            this._isMounted && groups.sort((a, b) => {
                if (a.label > b.label) return 1;
                if (b.label > a.label) return -1;
                return 0;
            })
            this._isMounted && this.setState({ dealershipGroups: groups })
        }
        this.toggle("addDealerModal")
        this._isMounted && this.setState({ loading: false, newDealershipGroup: "" })
    }
    async updateGroupName() {
        this._isMounted && this.setState({ loading: true })
        this._isMounted && await this.props.mongo.findOneAndUpdate("dealership_groups", { value: this.state.editGroupValue }, { label: this.state.editGroupName })
        let groups = this._isMounted && await this.props.mongo.find("dealership_groups")
        this._isMounted && groups.sort((a, b) => {
            if (a.label < b.label) return -1
            if (a.label > b.label) return 1
            return 0
        })
        this.toggle("editGroupModal")
        this._isMounted && this.setState({ loading: false, dealershipGroups: groups, editDealershipGroup: { label: "", value: "" } })
    }
    async deleteGroup() {
        this._isMounted && this.setState({ loading: true })
        this._isMounted && await this.props.mongo.findOneAndDelete("dealership_groups", this.state.editDealershipGroup)
        let groups = this._isMounted && await this.props.mongo.find("dealership_groups")
        this._isMounted && groups.sort((a, b) => {
            if (a.label < b.label) return -1
            if (a.label > b.label) return 1
            return 0
        })
        this._isMounted && this.setState({ editDealershipGroup: { label: "", value: "" }, dealershipGroups: groups })
        this._isMounted && this.setState({ loading: false })
    }
    async addNewUser() {
        this._isMounted && this.setState({ loading: true })

        let newUser = {
            name: this.props.utils.toTitleCase(this.state.addUserName),
            phone: this.state.addUserPhone,
            email: this.state.addUserEmail.toLowerCase(),
            team: this.state.addUserTeam,
            account_type: this.state.addType,
            department: this.state.addDepartment,
            isActive: this.state.addActive === "active",
            isApprover: this.state.addType === "admin",
            appointments: [],
            assistance: [],
            extension: "",
            inboundToday: 0,
            outboundToday: 0,
            skills: this.state.addSkills
        }
        console.log(newUser)
        //register user with "password" as password.. they can always reset password on login page..
        this._isMounted && await this.props.mongo.handleRegister(newUser.email, "password").catch((err => {this._isMounted && this.setState({ err })}))
        // insert user
        this._isMounted && await this.props.mongo.insertOne("agents", newUser)
        //re-get agents..
        let agents = this._isMounted && await this.props.mongo.find("agents");
        this._isMounted && agents.sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0;
        })
        for (let a in agents) {
            agents[a].label = agents[a].name;
            agents[a].value = agents[a]._id
        }
        this.toggle("addModal")
        this.clearAddValues()
        // this.setState({ dealerships: dealers, loading: false })
        this._isMounted && this.setState({ loading: false, users: agents })
    }
    async updateUser() {
        this._isMounted && this.setState({ loading: true })
        let update = {
            name: this.props.utils.toTitleCase(this.state.editUserName),
            phone: this.state.editUserPhone,
            account_type: this.state.editType,
            isActive: this.state.editActive === "active" ? true : false,
            team: this.state.editUserTeam,
            department: this.state.editDepartment,
            skills: this.state.editSkills
        }
        //update user
        this._isMounted && await this.props.mongo.findOneAndUpdate("agents", { email: this.state.editUserEmail }, update)
        //then get dealers and sort..
        let agents = this._isMounted && await this.props.mongo.find("agents")
        this._isMounted && agents.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        })
        let users = []
        for (let a in agents) {
            users[a] = {
                label: agents[a].name,
                value: agents[a]._id
            }
        }
        // this.toggle("editUserModal")
        this._isMounted && this.setState({ users, editUser: { label: "", value: "" }, loading: false })
    }
    render() {
        if (this.state.loading) {
            return (
                <>
                    <div className="content">
                        <Container>
                            <Col className="ml-auto mr-auto text-center" md="6">
                                <CardImg top width="100%" src={this.props.utils.loading} />
                            </Col>
                        </Container>
                    </div>
                </>
            );
        }
        return (
            <div className="content">
                <Container>
                    <Row>
                        <Col className="ml-auto mr-auto text-center" md="10">
                            <Card style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardBody>
                                    <h2 style={{ color: "white" }}>Add User</h2>
                                    <Button color="neutral" onClick={() => { this._isMounted && this.setState({ editUserEmail: "" }); this.toggle("addModal") }}>
                                        <i className="tim-icons icon-simple-add"></i>
                                    </Button>
                                    <Modal isOpen={this.state.addModals} toggle={() => { this.toggle("addModal") }} style={{ 'maxHeight': 'calc(100vh - 210px)' }}>
                                        <ModalHeader toggle={() => { this.toggle("addModal") }}>Add User</ModalHeader>
                                        <ModalBody>
                                            <Form>
                                                <legend>User Contact Info</legend>
                                                <FormGroup>
                                                    <Label for="userName">Name</Label>
                                                    <Input
                                                        type="text"
                                                        name="userName"
                                                        id="userName"
                                                        placeholder="Name of Agent"
                                                        value={this.state.addUserName}
                                                        onChange={(e) => { this.onValueChange("addUserName", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="userEmail">Email Address</Label>
                                                    <Input
                                                        type="email"
                                                        name="userEmail"
                                                        id="userEmail"
                                                        placeholder="Agent Email Address"
                                                        value={this.state.addUserEmail}
                                                        onChange={(e) => this.onValueChange("addUserEmail", e.target.value)}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="userPhone">Phone Number</Label>
                                                    <Input
                                                        type="number"
                                                        name="userPhone"
                                                        id="userPhone"
                                                        placeholder="Phone Number (10 digits)"
                                                        value={this.state.addUserPhone}
                                                        onChange={(e) => { this.onValueChange("addUserPhone", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <hr />
                                                <FormGroup>
                                                    <Label for="userTeam">Team</Label>
                                                    <Select
                                                        name="userTeam"
                                                        id="userTeam"
                                                        placeholder="Team Name"
                                                        options={this.state.teams}
                                                        value={this.state.addUserTeam}
                                                        onChange={(e) => { this._isMounted && this.setState({ addUserTeam: e }) }}
                                                    />
                                                </FormGroup>
                                                <hr />
                                                <legend>Department</legend>
                                                <FormGroup>
                                                    <FormGroup tag="fieldset">
                                                        <FormGroup check>
                                                            <Label check>
                                                                <Input type="radio" name="addDepartment" value="sales" checked={this.state.addDepartment === "sales"} onChange={(e) => { this.onValueChange("addDepartment", e.target.value) }} />
                                                                {' Sales'}
                                                            </Label>
                                                        </FormGroup>
                                                        <FormGroup check>
                                                            <Label check>
                                                                <Input type="radio" name="addDepartment" value="service" checked={this.state.addDepartment === "service"} onChange={(e) => { this.onValueChange("addDepartment", e.target.value) }} />
                                                                {' Service'}
                                                            </Label>
                                                        </FormGroup>
                                                    </FormGroup>

                                                </FormGroup>
                                                <hr />
                                                <legend>Account Type</legend>
                                                <FormGroup tag="fieldset">
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input type="radio" name="addType" value="admin" checked={this.state.addType === "admin"} onChange={(e) => { this.onValueChange("addType", e.target.value) }} />
                                                            {' Admin'}
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input type="radio" name="addType" value="agent" checked={this.state.addType === "agent"} onChange={(e) => { this.onValueChange("addType", e.target.value) }} />
                                                            {' Agent'}
                                                        </Label>
                                                    </FormGroup>
                                                </FormGroup>
                                                <hr />
                                                <legend>User Is Active</legend>
                                                <FormGroup tag="fieldset">
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input type="radio" name="addActive" value="active" checked={this.state.addActive === "active"} onChange={(e) => { this.onValueChange("addActive", e.target.value) }} />
                                                            {' Yes'}
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input type="radio" name="addActive" value="inactive" checked={this.state.addActive === "inactive"} onChange={(e) => { this.onValueChange("addActive", e.target.value) }} />
                                                            {' No'}
                                                        </Label>
                                                    </FormGroup>
                                                </FormGroup>

                                                <Button color="warning" onClick={() => { this.toggle("addModal") }}>Cancel</Button>
                                                <Button
                                                    onClick={() => {
                                                        this.addNewUser()
                                                    }}
                                                    color="success"
                                                    disabled={
                                                        this.state.addUserName.length === 0 ||
                                                        this.state.addUserEmail.length === 0 ||
                                                        this.state.addUserPhone.length !== 10 ||
                                                        this.state.addUserTeam.label === undefined ||
                                                        this.state.addActive.length === 0 ||
                                                        this.state.addType.length === 0 ||
                                                        this.state.addDepartment.length === 0
                                                    }
                                                >Submit</Button>
                                            </Form>
                                        </ModalBody>
                                    </Modal>
                                </CardBody>
                            </Card>

                        </Col>
                    </Row>
                    <Row>
                        <Col className="ml-auto mr-auto text-center" md="10">
                            <Card style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardBody>
                                    <h2 style={{ color: "white" }}>Edit User</h2>
                                    <Select
                                        name="editUser"
                                        id="editUser"
                                        options={this.state.users}
                                        value={this.state.editUser}
                                        onChange={(e) => { this.onValueChange("editUser", e); }}
                                    />
                                    <br />
                                    <Button color="neutral" disabled={this.state.editUser.label.length === 0} onClick={async () => {
                                        this._isMounted && this.setState({ loading: true })
                                        console.log("!@#", this.state.editUser)
                                        let u = this._isMounted && await this.props.mongo.findOne("agents", { _id: this.state.editUser.value })
                                        this._isMounted && this.setState({
                                            editUserName: u.name,
                                            editUserPhone: u.phone || "",
                                            editUserEmail: u.email || "",
                                            editUserTeam: u.team,
                                            editType: u.account_type,
                                            editDepartment: u.department,
                                            editActive: u.isActive === true ? "active" : "inactive",
                                            editSkills: u.skills || {
                                                sales: {
                                                    newLeads: false,
                                                    day1And2: false,
                                                    day3And4: false,
                                                    missedAppointments: false,
                                                    day7: false,
                                                    day10: false,
                                                    day15: false,
                                                    day20: false
                                                },
                                                serviceToSales: {
                                                    serviceDriveRd1: false,
                                                    serviceDriveRd2: false,
                                                    dataMiningHighInterest: false,
                                                    dataMiningLeases: false,
                                                    dataMiningBuyBack: false
                                                },
                                                service: {
                                                    missedAppointments: false,
                                                    day7: false,
                                                    day14: false,
                                                    firstService: false,
                                                    serviceReminder: false
                                                },
                                                textEmail: {
                                                    newLeads: false,
                                                    day1And2: false,
                                                    day5: false,
                                                    day10: false,
                                                    day20: false,
                                                    missedAppointments: false
                                                }
                                            }
                                        })
                                        this._isMounted && this.setState({ loading: false, addModal: false })
                                        // this.toggle("editUserModal");
                                    }}><i className="tim-icons icon-pencil" /></Button>
                                    <Modal isOpen={this.state.editUserModal} toggle={() => { this.toggle("editUserModal") }} style={{ 'maxHeight': 'calc(100vh - 210px)' }}>
                                        <ModalHeader toggle={() => { this.toggle("editUserModal") }}>
                                            Edit User
                                        </ModalHeader>
                                        <ModalBody>
                                            <Form onSubmit={(e) => { e.preventDefault(); this.updateDealership() }}>
                                                <legend>Edit Contact Info</legend>
                                                <FormGroup>
                                                    <Label for="editUserName">Name</Label>
                                                    <Input
                                                        type="text"
                                                        name="editUserName"
                                                        id="editUserName"
                                                        placeholder="Edit User's Name"
                                                        value={this.state.editUserName}
                                                        onChange={(e) => { this.onValueChange("editUserName", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="editUserEmail">Email Address</Label>
                                                    <Input
                                                        disabled
                                                        type="text"
                                                        name="editUserEmail"
                                                        id="editUserEmail"
                                                        placeholder="Edit Email"
                                                        value={this.state.editUserEmail}
                                                        onChange={(e) => { this.onValueChange("editUserEmail", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="editUserPhone">Phone Number</Label>
                                                    <Input
                                                        type="text"
                                                        name="editUserPhone"
                                                        id="editUserPhone"
                                                        placeholder="Edit Phone #"
                                                        value={this.state.editUserPhone}
                                                        onChange={(e) => { this.onValueChange("editUserPhone", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <hr />
                                                <FormGroup>
                                                    <Label for="editUserTeam">Edit Team</Label>
                                                    <Select
                                                        name="editUserTeam"
                                                        id="editUserTeam"
                                                        placeholder="Edit Team"
                                                        options={this.state.teams}
                                                        value={this.state.editUserTeam}
                                                        onChange={(e) => { this._isMounted && this.setState({ editUserTeam: e }) }}
                                                    />
                                                </FormGroup>
                                                <hr />
                                                <legend>Edit Department</legend>
                                                <FormGroup tag="fieldset">
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input type="radio" name="editDepartment" value="sales" checked={this.state.editDepartment === "sales"} onChange={(e) => { this.onValueChange("editDepartment", e.target.value) }} />
                                                            {' Sales'}
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input type="radio" name="editDepartment" value="service" checked={this.state.editDepartment === "service"} onChange={(e) => { this.onValueChange("editDepartment", e.target.value) }} />
                                                            {' Service'}
                                                        </Label>
                                                    </FormGroup>
                                                </FormGroup>
                                                <hr />
                                                <legend>Edit Account Type</legend>
                                                <FormGroup tag="fieldset">
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input type="radio" name="editType" value="admin" checked={this.state.editType === "admin"} onChange={(e) => { this.onValueChange("editType", e.target.value) }} />
                                                            {' Admin'}
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input type="radio" name="editType" value="agent" checked={this.state.editType === "agent"} onChange={(e) => { this.onValueChange("editType", e.target.value) }} />
                                                            {' Agent'}
                                                        </Label>
                                                    </FormGroup>
                                                </FormGroup>
                                                <hr />
                                                <legend>User is Active</legend>
                                                <FormGroup tag="fieldset">
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input type="radio" name="editActive" value="active" checked={this.state.editActive === "active"} onChange={(e) => { this.onValueChange("editActive", e.target.value) }} />
                                                            {' Yes'}
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input type="radio" name="editActive" value="inactive" checked={this.state.editActive === "inactive"} onChange={(e) => { this.onValueChange("editActive", e.target.value) }} />
                                                            {' No'}
                                                        </Label>
                                                    </FormGroup>
                                                </FormGroup>
                                                <hr />
                                                <Button color="warning" onClick={() => {
                                                    this.toggle("editUserModal")
                                                    this._isMounted && this.setState({ editUser: { label: "", value: "" } })
                                                }}>Cancel</Button>
                                                <Button
                                                    onClick={() => {
                                                        this.updateUser()
                                                    }}
                                                    color="success"
                                                    disabled={
                                                        this.state.editUserName.length === 0 ||
                                                        this.state.editUserPhone.length !== 10 ||
                                                        this.state.editType.length === 0 ||
                                                        this.state.editDepartment.length === 0 ||
                                                        this.state.editUserTeam.label.length === 0 ||
                                                        this.state.editActive.length === 0
                                                    }>Update</Button>
                                            </Form>
                                        </ModalBody>
                                    </Modal>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row hidden={this.state.editUserEmail.length < 1}>
                        <Col className="ml-auto mr-auto text-center" md="10">
                            <Card style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardBody>
                                    <h2 style={{ color: "white" }}>Edit {this.state.editUser.label || ""}</h2>
                                    <Row className="ml-auto mr-auto text-center">
                                        <h3 className="text-white" style={{ textDecoration: "underline" }}>Edit Contact Info</h3>
                                        <Col md="12">
                                            <Form>
                                                <FormGroup>
                                                    <p className="text-white text-left">Edit Name</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.editUserName}
                                                        onChange={(e) => { this.onValueChange("editUserName", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="text-white text-left">Edit Email</p>
                                                    <Input
                                                        disabled
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.editUserEmail}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="text-white text-left">Edit Phone</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.editUserPhone}
                                                        onChange={(e) => { this.onValueChange("editUserPhone", e.target.value) }}
                                                    />
                                                </FormGroup>
                                            </Form>
                                        </Col>
                                    </Row>
                                    <hr style={{ border: "1px solid white" }} />
                                    <Row className="ml-auto mr-auto text-center">
                                        <h3 style={{ textDecoration: "underline" }} className="text-white">Edit Team</h3>
                                        <Col md="12">
                                            <Select
                                                options={this.state.teams}
                                                value={this.state.editUserTeam}
                                                onChange={(e) => { this.onValueChange("editUserTeam", e) }}
                                            />
                                        </Col>
                                    </Row>
                                    <hr style={{ border: "1px solid white" }} />
                                    <Row className="ml-auto mr-auto">
                                        <h3 style={{ textDecoration: "underline" }} className="text-white">Edit Department</h3>
                                        <Col md="12">
                                            <FormGroup>
                                                <h4 className="text-white"><Input
                                                    type="radio"
                                                    value="sales"
                                                    checked={this.state.editDepartment === "sales"}
                                                    onChange={(e) => { this.onValueChange("editDepartment", e.target.value) }}
                                                /> SALES</h4>
                                            </FormGroup>
                                            <FormGroup>
                                                <h4 className="text-white"><Input
                                                    type="radio"
                                                    value="service"
                                                    checked={this.state.editDepartment === "service"}
                                                    onChange={(e) => { this.onValueChange("editDepartment", e.target.value) }}
                                                /> SERVICE</h4>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <hr style={{ border: "1px solid white" }} />
                                    <Row className="ml-auto mr-auto">
                                        <h3 style={{ textDecoration: "underline" }} className="text-white">Edit Account Type</h3>
                                        <Col md="12">
                                            <FormGroup>
                                                <h4 className="text-white"><Input
                                                    type="radio"
                                                    value="admin"
                                                    checked={this.state.editType === "admin"}
                                                    onChange={(e) => { this.onValueChange("editType", e.target.value) }}
                                                /> ADMIN</h4>
                                            </FormGroup>
                                            <FormGroup>
                                                <h4 className="text-white"><Input
                                                    type="radio"
                                                    value="agent"
                                                    checked={this.state.editType === "agent"}
                                                    onChange={(e) => { this.onValueChange("editType", e.target.value) }}
                                                /> AGENT</h4>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <hr style={{ border: "1px solid white" }} />
                                    <Row className="ml-auto mr-auto">
                                        <h3 style={{ textDecoration: "underline" }} className="text-white">User Is Active</h3>
                                        <Col md="12">
                                            <FormGroup>
                                                <h4 className="text-white"><Input
                                                    type="radio"
                                                    value="active"
                                                    checked={this.state.editActive === "active"}
                                                    onChange={(e) => { this.onValueChange("editActive", e.target.value) }}
                                                /> YES</h4>
                                            </FormGroup>
                                            <FormGroup>
                                                <h4 className="text-white"><Input
                                                    type="radio"
                                                    value="inactive"
                                                    checked={this.state.editActive === "inactive"}
                                                    onChange={(e) => { this.onValueChange("editActive", e.target.value) }}
                                                /> NO</h4>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <hr style={{ border: "1px solid white" }} />
                                    <Row className="ml-auto mr-auto">
                                        <Col md="12"><h3 style={{ textDecoration: "underline" }} className="text-white">User Skills</h3></Col>
                                        <Col md="3">
                                            <p className="text-white" style={{ textDecoration: "underline" }}>Sales BDC</p>
                                            <FormGroup>
                                                <p className="text-white">
                                                    <Input
                                                        checked={this.state.editSkills.sales.newLeads}
                                                        onChange={(e) => {
                                                            let currSkills = this.state.editSkills;
                                                            currSkills.sales.newLeads = !this.state.editSkills.sales.newLeads;
                                                            this._isMounted && this.setState({ editSkills: currSkills })
                                                        }}
                                                        type="checkbox"
                                                    /> New Leads
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.editSkills;
                                                            currSkills.sales.day1And2 = !this.state.editSkills.sales.day1And2;
                                                            this._isMounted && this.setState({ editSkills: currSkills })
                                                        }}
                                                        checked={this.state.editSkills.sales.day1And2}
                                                        type="checkbox"
                                                    /> Day 1 & 2
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.editSkills;
                                                            currSkills.sales.day3And4 = !this.state.editSkills.sales.day3And4;
                                                            this._isMounted && this.setState({ editSkills: currSkills })
                                                        }}
                                                        checked={this.state.editSkills.sales.day3And4}
                                                        type="checkbox"
                                                    /> Day 3 & 4
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.editSkills;
                                                            currSkills.sales.missedAppointments = !this.state.editSkills.sales.missedAppointments;
                                                            this._isMounted && this.setState({ editSkills: currSkills })
                                                        }}
                                                        checked={this.state.editSkills.sales.missedAppointments}
                                                        type="checkbox"
                                                    /> Missed Appointments
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.editSkills;
                                                            currSkills.sales.day7 = !this.state.editSkills.sales.day7;
                                                            this._isMounted && this.setState({ editSkills: currSkills })
                                                        }}
                                                        checked={this.state.editSkills.sales.day7}
                                                        type="checkbox"
                                                    /> Day 7
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.editSkills;
                                                            currSkills.sales.day10 = !this.state.editSkills.sales.day10;
                                                            this._isMounted && this.setState({ editSkills: currSkills })
                                                        }}
                                                        checked={this.state.editSkills.sales.day10}
                                                        type="checkbox"
                                                    /> Day 10
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.editSkills;
                                                            currSkills.sales.day15 = !this.state.editSkills.sales.day15;
                                                            this._isMounted && this.setState({ editSkills: currSkills })
                                                        }}
                                                        checked={this.state.editSkills.sales.day15}
                                                        type="checkbox"
                                                    /> Day 15
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.editSkills;
                                                            currSkills.sales.day20 = !this.state.editSkills.sales.day20;
                                                            this._isMounted && this.setState({ editSkills: currSkills })
                                                        }}
                                                        checked={this.state.editSkills.sales.day20}
                                                        type="checkbox"
                                                    /> Day 20
                                                </p>
                                            </FormGroup>
                                        </Col>
                                        <Col md="3">
                                            <p className="text-white" style={{ textDecoration: "underline" }}>Service To Sales</p>
                                            <FormGroup>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.editSkills;
                                                            currSkills.serviceToSales.serviceDriveRd1 = !this.state.editSkills.serviceToSales.serviceDriveRd1;
                                                            this._isMounted && this.setState({ editSkills: currSkills })
                                                        }}
                                                        checked={this.state.editSkills.serviceToSales.serviceDriveRd1}
                                                        type="checkbox"
                                                    /> Service Drive: Round 1
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.editSkills;
                                                            currSkills.serviceToSales.serviceDriveRd2 = !this.state.editSkills.serviceToSales.serviceDriveRd2;
                                                            this._isMounted && this.setState({ editSkills: currSkills })
                                                        }}
                                                        checked={this.state.editSkills.serviceToSales.serviceDriveRd2}
                                                        type="checkbox"
                                                    /> Service Drive: Round 2
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.editSkills;
                                                            currSkills.serviceToSales.dataMiningHighInterest = !this.state.editSkills.serviceToSales.dataMiningHighInterest;
                                                            this._isMounted && this.setState({ editSkills: currSkills })
                                                        }}
                                                        checked={this.state.editSkills.serviceToSales.dataMiningHighInterest}
                                                        type="checkbox"
                                                    /> Data-mining: High Interest
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.editSkills;
                                                            currSkills.serviceToSales.dataMiningLeases = !this.state.editSkills.serviceToSales.dataMiningLeases;
                                                            this._isMounted && this.setState({ editSkills: currSkills })
                                                        }}
                                                        checked={this.state.editSkills.serviceToSales.dataMiningLeases}
                                                        type="checkbox"
                                                    /> Data-mining: Leases
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.editSkills;
                                                            currSkills.serviceToSales.dataMiningBuyBack = !this.state.editSkills.serviceToSales.dataMiningBuyBack;
                                                            this._isMounted && this.setState({ editSkills: currSkills })
                                                        }}
                                                        checked={this.state.editSkills.serviceToSales.dataMiningBuyBack}
                                                        type="checkbox"
                                                    /> Data-mining: Buy Back
                                                </p>
                                            </FormGroup>
                                        </Col>
                                        <Col md="3">
                                            <p className="text-white" style={{ textDecoration: "underline" }}>Service</p>
                                            <FormGroup>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.editSkills;
                                                            currSkills.service.missedAppointments = !this.state.editSkills.service.missedAppointments;
                                                            this.setState({ editSkills: currSkills })
                                                        }}
                                                        checked={this.state.editSkills.service.missedAppointments}
                                                        type="checkbox"
                                                    /> Missed Appointments
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.editSkills;
                                                            currSkills.service.day7 = !this.state.editSkills.service.day7;
                                                            this.setState({ editSkills: currSkills })
                                                        }}
                                                        checked={this.state.editSkills.service.day7}
                                                        type="checkbox"
                                                    /> Day 7
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.editSkills;
                                                            currSkills.service.day14 = !this.state.editSkills.service.day14;
                                                            this.setState({ editSkills: currSkills })
                                                        }}
                                                        checked={this.state.editSkills.service.day14}
                                                        type="checkbox"
                                                    /> Day 14
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.editSkills;
                                                            currSkills.service.firstService = !this.state.editSkills.service.firstService;
                                                            this.setState({ editSkills: currSkills })
                                                        }}
                                                        checked={this.state.editSkills.service.firstService}
                                                        type="checkbox"
                                                    /> First Service
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.editSkills;
                                                            currSkills.service.serviceReminder = !this.state.editSkills.service.serviceReminder;
                                                            this.setState({ editSkills: currSkills })
                                                        }}
                                                        checked={this.state.editSkills.service.serviceReminder}
                                                        type="checkbox"
                                                    /> Service Reminder
                                                </p>

                                            </FormGroup>
                                        </Col>
                                        <Col md="3">
                                            <p className="text-white" style={{ textDecoration: "underline" }}>Text/Email</p>
                                            <FormGroup>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.editSkills;
                                                            currSkills.textEmail.newLeads = !this.state.editSkills.textEmail.newLeads;
                                                            this.setState({ editSkills: currSkills })
                                                        }}
                                                        checked={this.state.editSkills.textEmail.newLeads}
                                                        type="checkbox"
                                                    /> New Leads
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.editSkills;
                                                            currSkills.textEmail.day1And2 = !this.state.editSkills.textEmail.day1And2;
                                                            this.setState({ editSkills: currSkills })
                                                        }}
                                                        checked={this.state.editSkills.textEmail.day1And2}
                                                        type="checkbox"
                                                    /> Day 1 & 2
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.editSkills;
                                                            currSkills.textEmail.day5 = !this.state.editSkills.textEmail.day5;
                                                            this.setState({ editSkills: currSkills })
                                                        }}
                                                        checked={this.state.editSkills.textEmail.day5}
                                                        type="checkbox"
                                                    /> Day 5
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.editSkills;
                                                            currSkills.textEmail.day10 = !this.state.editSkills.textEmail.day10;
                                                            this.setState({ editSkills: currSkills })
                                                        }}
                                                        checked={this.state.editSkills.textEmail.day10}
                                                        type="checkbox"
                                                    /> Day 10
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.editSkills;
                                                            currSkills.textEmail.day20 = !this.state.editSkills.textEmail.day20;
                                                            this.setState({ editSkills: currSkills })
                                                        }}
                                                        checked={this.state.editSkills.textEmail.day20}
                                                        type="checkbox"
                                                    /> Day 20
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.editSkills;
                                                            currSkills.textEmail.missedAppointments = !this.state.editSkills.textEmail.missedAppointments;
                                                            this.setState({ editSkills: currSkills })
                                                        }}
                                                        checked={this.state.editSkills.textEmail.missedAppointments}
                                                        type="checkbox"
                                                    /> Missed Appointments
                                                </p>
                                            </FormGroup>

                                        </Col>
                                    </Row>
                                    <hr style={{ border: "1px solid white" }} />
                                    <Button color="warning" onClick={() => {
                                        this.setState({ editUserEmail: "" })
                                    }}>Cancel</Button>
                                    <Button color="success" onClick={() => { this.updateUser(); this._isMounted && this.setState({ editUserEmail: "" }) }}>Save</Button>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row hidden={!this.state.addModal}>
                        <Col className="ml-auto mr-auto text-center" md="10">
                            <Card style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardBody>
                                    <h2 style={{ color: "white" }}>Add User</h2>
                                    <Row className="ml-auto mr-auto text-center">
                                        <h3 className="text-white" style={{ textDecoration: "underline" }}>Contact Info</h3>
                                        <Col md="12">
                                            <Form>
                                                <FormGroup>
                                                    <p className="text-white text-left">Name</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.addUserName}
                                                        onChange={(e) => { this.onValueChange("addUserName", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="text-white text-left">Email</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.addUserEmail}
                                                        onChange={(e) => { this.onValueChange("addUserEmail", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="text-white text-left">Phone</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.addUserPhone}
                                                        onChange={(e) => { this.onValueChange("addUserPhone", e.target.value) }}
                                                    />
                                                </FormGroup>
                                            </Form>
                                        </Col>
                                    </Row>
                                    <hr style={{ border: "1px solid white" }} />
                                    <Row className="ml-auto mr-auto text-center">
                                        <h3 style={{ textDecoration: "underline" }} className="text-white">Team</h3>
                                        <Col md="12">
                                            <Select
                                                options={this.state.teams}
                                                value={this.state.addUserTeam}
                                                onChange={(e) => { this.onValueChange("addUserTeam", e) }}
                                            />
                                        </Col>
                                    </Row>
                                    <hr style={{ border: "1px solid white" }} />
                                    <Row className="ml-auto mr-auto">
                                        <h3 style={{ textDecoration: "underline" }} className="text-white">Department</h3>
                                        <Col md="12">
                                            <FormGroup>
                                                <h4 className="text-white"><Input
                                                    type="radio"
                                                    value="sales"
                                                    checked={this.state.addDepartment === "sales"}
                                                    onChange={(e) => { this.onValueChange("addDepartment", e.target.value) }}
                                                /> SALES</h4>
                                            </FormGroup>
                                            <FormGroup>
                                                <h4 className="text-white"><Input
                                                    type="radio"
                                                    value="service"
                                                    checked={this.state.addDepartment === "service"}
                                                    onChange={(e) => { this.onValueChange("addDepartment", e.target.value) }}
                                                /> SERVICE</h4>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <hr style={{ border: "1px solid white" }} />
                                    <Row className="ml-auto mr-auto">
                                        <h3 style={{ textDecoration: "underline" }} className="text-white">Account Type</h3>
                                        <Col md="12">
                                            <FormGroup>
                                                <h4 className="text-white"><Input
                                                    type="radio"
                                                    value="admin"
                                                    checked={this.state.addType === "admin"}
                                                    onChange={(e) => { this.onValueChange("addType", e.target.value) }}
                                                /> ADMIN</h4>
                                            </FormGroup>
                                            <FormGroup>
                                                <h4 className="text-white"><Input
                                                    type="radio"
                                                    value="agent"
                                                    checked={this.state.addType === "agent"}
                                                    onChange={(e) => { this.onValueChange("addType", e.target.value) }}
                                                /> AGENT</h4>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <hr style={{ border: "1px solid white" }} />
                                    <Row className="ml-auto mr-auto">
                                        <h3 style={{ textDecoration: "underline" }} className="text-white">User Is Active</h3>
                                        <Col md="12">
                                            <FormGroup>
                                                <h4 className="text-white"><Input
                                                    type="radio"
                                                    value="active"
                                                    checked={this.state.addActive === "active"}
                                                    onChange={(e) => { this.onValueChange("addActive", e.target.value) }}
                                                /> YES</h4>
                                            </FormGroup>
                                            <FormGroup>
                                                <h4 className="text-white"><Input
                                                    type="radio"
                                                    value="inactive"
                                                    checked={this.state.addActive === "inactive"}
                                                    onChange={(e) => { this.onValueChange("addActive", e.target.value) }}
                                                /> NO</h4>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <hr style={{ border: "1px solid white" }} />
                                    <Row className="ml-auto mr-auto">
                                        <Col md="12"><h3 style={{ textDecoration: "underline" }} className="text-white">User Skills</h3></Col>
                                        <Col md="3">
                                            <p className="text-white" style={{ textDecoration: "underline" }}>Sales BDC</p>
                                            <FormGroup>
                                                <p className="text-white">
                                                    <Input
                                                        checked={this.state.addSkills.sales.newLeads || ""}
                                                        onChange={(e) => {
                                                            let currSkills = this.state.addSkills;
                                                            currSkills.sales.newLeads = !this.state.addSkills.sales.newLeads;
                                                            this._isMounted && this.setState({ addSkills: currSkills })
                                                        }}
                                                        type="checkbox"
                                                    /> New Leads
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.addSkills;
                                                            currSkills.sales.day1And2 = !this.state.addSkills.sales.day1And2;
                                                            this._isMounted && this.setState({ addSkills: currSkills })
                                                        }}
                                                        checked={this.state.addSkills.sales.day1And2 || ""}
                                                        type="checkbox"
                                                    /> Day 1 & 2
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.addSkills;
                                                            currSkills.sales.day3And4 = !this.state.addSkills.sales.day3And4;
                                                            this._isMounted && this.setState({ addSkills: currSkills })
                                                        }}
                                                        checked={this.state.addSkills.sales.day3And4 || ""}
                                                        type="checkbox"
                                                    /> Day 3 & 4
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.addSkills;
                                                            currSkills.sales.missedAppointments = !this.state.addSkills.sales.missedAppointments;
                                                            this._isMounted && this.setState({ addSkills: currSkills })
                                                        }}
                                                        checked={this.state.addSkills.sales.missedAppointments || ""}
                                                        type="checkbox"
                                                    /> Missed Appointments
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.addSkills;
                                                            currSkills.sales.day7 = !this.state.addSkills.sales.day7;
                                                            this._isMounted && this.setState({ addSkills: currSkills })
                                                        }}
                                                        checked={this.state.addSkills.sales.day7 || ""}
                                                        type="checkbox"
                                                    /> Day 7
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.addSkills;
                                                            currSkills.sales.day10 = !this.state.addSkills.sales.day10;
                                                            this._isMounted && this.setState({ addSkills: currSkills })
                                                        }}
                                                        checked={this.state.addSkills.sales.day10 || ""}
                                                        type="checkbox"
                                                    /> Day 10
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.addSkills;
                                                            currSkills.sales.day15 = !this.state.addSkills.sales.day15;
                                                            this._isMounted && this.setState({ addSkills: currSkills })
                                                        }}
                                                        checked={this.state.addSkills.sales.day15 || ""}
                                                        type="checkbox"
                                                    /> Day 15
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.addSkills;
                                                            currSkills.sales.day20 = !this.state.addSkills.sales.day20;
                                                            this._isMounted && this.setState({ addSkills: currSkills })
                                                        }}
                                                        checked={this.state.addSkills.sales.day20 || ""}
                                                        type="checkbox"
                                                    /> Day 20
                                                </p>
                                            </FormGroup>
                                        </Col>
                                        <Col md="3">
                                            <p className="text-white" style={{ textDecoration: "underline" }}>Service To Sales</p>
                                            <FormGroup>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.addSkills;
                                                            currSkills.serviceToSales.serviceDriveRd1 = !this.state.addSkills.serviceToSales.serviceDriveRd1;
                                                            this._isMounted && this.setState({ addSkills: currSkills })
                                                        }}
                                                        checked={this.state.addSkills.serviceToSales.serviceDriveRd1 || ""}
                                                        type="checkbox"
                                                    /> Service Drive: Round 1
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.addSkills;
                                                            currSkills.serviceToSales.serviceDriveRd2 = !this.state.addSkills.serviceToSales.serviceDriveRd2;
                                                            this._isMounted && this.setState({ addSkills: currSkills })
                                                        }}
                                                        checked={this.state.addSkills.serviceToSales.serviceDriveRd2 || ""}
                                                        type="checkbox"
                                                    /> Service Drive: Round 2
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.addSkills;
                                                            currSkills.serviceToSales.dataMiningHighInterest = !this.state.addSkills.serviceToSales.dataMiningHighInterest;
                                                            this._isMounted && this.setState({ addSkills: currSkills })
                                                        }}
                                                        checked={this.state.addSkills.serviceToSales.dataMiningHighInterest || ""}
                                                        type="checkbox"
                                                    /> Data-mining: High Interest
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.addSkills;
                                                            currSkills.serviceToSales.dataMiningLeases = !this.state.addSkills.serviceToSales.dataMiningLeases;
                                                            this._isMounted && this.setState({ addSkills: currSkills })
                                                        }}
                                                        checked={this.state.addSkills.serviceToSales.dataMiningLeases || ""}
                                                        type="checkbox"
                                                    /> Data-mining: Leases
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.addSkills;
                                                            currSkills.serviceToSales.dataMiningBuyBack = !this.state.addSkills.serviceToSales.dataMiningBuyBack;
                                                            this._isMounted && this.setState({ addSkills: currSkills })
                                                        }}
                                                        checked={this.state.addSkills.serviceToSales.dataMiningBuyBack || ""}
                                                        type="checkbox"
                                                    /> Data-mining: Buy Back
                                                </p>

                                            </FormGroup>
                                        </Col>
                                        <Col md="3">
                                            <p className="text-white" style={{ textDecoration: "underline" }}>Service</p>
                                            <FormGroup>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.addSkills;
                                                            currSkills.service.missedAppointments = !this.state.addSkills.service.missedAppointments;
                                                            this._isMounted && this.setState({ addSkills: currSkills })
                                                        }}
                                                        checked={this.state.addSkills.service.missedAppointments || ""}
                                                        type="checkbox"
                                                    /> Missed Appointments
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.addSkills;
                                                            currSkills.service.day7 = !this.state.addSkills.service.day7;
                                                            this._isMounted && this.setState({ addSkills: currSkills })
                                                        }}
                                                        checked={this.state.addSkills.service.day7 || ""}
                                                        type="checkbox"
                                                    /> Day 7
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.addSkills;
                                                            currSkills.service.day14 = !this.state.addSkills.service.day14;
                                                            this._isMounted && this.setState({ addSkills: currSkills })
                                                        }}
                                                        checked={this.state.addSkills.service.day14 || ""}
                                                        type="checkbox"
                                                    /> Day 14
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.addSkills;
                                                            currSkills.service.firstService = !this.state.addSkills.service.firstService;
                                                            this._isMounted && this.setState({ addSkills: currSkills })
                                                        }}
                                                        checked={this.state.addSkills.service.firstService || ""}
                                                        type="checkbox"
                                                    /> First Service
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.addSkills;
                                                            currSkills.service.serviceReminder = !this.state.addSkills.service.serviceReminder;
                                                            this._isMounted && this.setState({ addSkills: currSkills })
                                                        }}
                                                        checked={this.state.addSkills.service.serviceReminder || ""}
                                                        type="checkbox"
                                                    /> Service Reminder
                                                </p>

                                            </FormGroup>
                                        </Col>
                                        <Col md="3">
                                            <p className="text-white" style={{ textDecoration: "underline" }}>Text/Email</p>
                                            <FormGroup>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.addSkills;
                                                            currSkills.textEmail.newLeads = !this.state.addSkills.textEmail.newLeads;
                                                            this._isMounted && this.setState({ addSkills: currSkills })
                                                        }}
                                                        checked={this.state.addSkills.textEmail.newLeads || ""}
                                                        type="checkbox"
                                                    /> New Leads
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.addSkills;
                                                            currSkills.textEmail.day1And2 = !this.state.addSkills.textEmail.day1And2;
                                                            this._isMounted && this.setState({ addSkills: currSkills })
                                                        }}
                                                        checked={this.state.addSkills.textEmail.day1And2 || ""}
                                                        type="checkbox"
                                                    /> Day 1 & 2
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.addSkills;
                                                            currSkills.textEmail.day5 = !this.state.addSkills.textEmail.day5;
                                                            this._isMounted && this.setState({ addSkills: currSkills })
                                                        }}
                                                        checked={this.state.addSkills.textEmail.day5 || ""}
                                                        type="checkbox"
                                                    /> Day 5
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.addSkills;
                                                            currSkills.textEmail.day10 = !this.state.addSkills.textEmail.day10;
                                                            this._isMounted && this.setState({ addSkills: currSkills })
                                                        }}
                                                        checked={this.state.addSkills.textEmail.day10 || ""}
                                                        type="checkbox"
                                                    /> Day 10
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.addSkills;
                                                            currSkills.textEmail.day20 = !this.state.addSkills.textEmail.day20;
                                                            this._isMounted && this.setState({ addSkills: currSkills })
                                                        }}
                                                        checked={this.state.addSkills.textEmail.day20 || ""}
                                                        type="checkbox"
                                                    /> Day 20
                                                </p>
                                                <p className="text-white">
                                                    <Input
                                                        onChange={(e) => {
                                                            let currSkills = this.state.addSkills;
                                                            currSkills.textEmail.missedAppointments = !this.state.addSkills.textEmail.missedAppointments;
                                                            this._isMounted && this.setState({ addSkills: currSkills })
                                                        }}
                                                        checked={this.state.addSkills.textEmail.missedAppointments || ""}
                                                        type="checkbox"
                                                    /> Missed Appointments
                                                </p>
                                            </FormGroup>

                                        </Col>
                                    </Row>
                                    <hr style={{ border: "1px solid white" }} />
                                    <Button color='warning' onClick={() => { this._isMounted && this.setState({ addModal: false }); this.clearAddValues() }}>Cancel</Button>
                                    <Button onClick={() => {
                                        this.addNewUser()
                                    }}
                                        color="success"
                                        disabled={
                                            this.state.addUserName.length === 0 ||
                                            this.state.addUserEmail.length === 0 ||
                                            this.state.addUserPhone.length !== 10 ||
                                            this.state.addUserTeam.label === undefined ||
                                            this.state.addActive.length === 0 ||
                                            this.state.addType.length === 0 ||
                                            this.state.addDepartment.length === 0
                                        }>Save</Button>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default UserManagement;