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
            editActive: ""
        }
        this.toggle = this.toggle.bind(this)
        this.onValueChange = this.onValueChange.bind(this)
        this.addNewUser = this.addNewUser.bind(this)
        this.updateUser = this.updateUser.bind(this)
        this._isMounted = false
    }
    async componentWillMount() {
        this._isMounted = true
        this.setState({ loading: true })
        let users = this._isMounted && await this.props.mongo.find("agents")
        users.sort((a, b) => {
            if (a.name < b.name) return -1
            if (b.name < a.name) return 1
            return 0
        })
        let teams = this._isMounted && await this.props.mongo.find("teams");
        teams.sort((a, b) => {
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
        this.setState({ loading: false, users: userOptions, teams })
        // this.setState({dealershipGroups: groups})
    }
    componentDidMount() {
        this._isMounted = true
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    toggle(modal_name) {
        if (this.state[modal_name] == false) {
            this.clearAddValues()
        }
        this.setState({ [modal_name]: !this.state[modal_name] })
    }
    onValueChange(key, value) {
        this.setState({ [key]: value })
    }
    clearAddValues() {
        this.setState({
            addUserName: "",
            addUserEmail: "",
            addUserPhone: "",
            addUserTeam: { label: "", value: "" },
            addType: "",
            addActive: "",
            addDepartment: ""
        })
    }
    async addNewGroup() {
        this.setState({ loading: true })
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
            groups.sort((a, b) => {
                if (a.label > b.label) return 1;
                if (b.label > a.label) return -1;
                return 0;
            })
            this.setState({ dealershipGroups: groups })
        }
        this.toggle("addDealerModal")
        this.setState({ loading: false, newDealershipGroup: "" })
    }
    async updateGroupName() {
        this.setState({ loading: true })
        this._isMounted && await this.props.mongo.findOneAndUpdate("dealership_groups", { value: this.state.editGroupValue }, { label: this.state.editGroupName })
        let groups = this._isMounted && await this.props.mongo.find("dealership_groups")
        groups.sort((a, b) => {
            if (a.label < b.label) return -1
            if (a.label > b.label) return 1
            return 0
        })
        this.toggle("editGroupModal")
        this.setState({ loading: false, dealershipGroups: groups, editDealershipGroup: { label: "", value: "" } })
    }
    async deleteGroup() {
        this.setState({ loading: true })
        this._isMounted && await this.props.mongo.findOneAndDelete("dealership_groups", this.state.editDealershipGroup)
        let groups = this._isMounted && await this.props.mongo.find("dealership_groups")
        groups.sort((a, b) => {
            if (a.label < b.label) return -1
            if (a.label > b.label) return 1
            return 0
        })
        this.setState({ editDealershipGroup: { label: "", value: "" }, dealershipGroups: groups })
        this.setState({ loading: false })
    }
    async addNewUser() {
        this.setState({ loading: true })

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
            outboundToday: 0
        }
        console.log(newUser)
        //register user with "password" as password.. they can always reset password on login page..
        await this.props.mongo.handleRegister(newUser.email, "password").catch((err => this.setState({ err })))
        // insert user
        this._isMounted && await this.props.mongo.insertOne("agents", newUser)
        //re-get agents..
        let agents = await this.props.mongo.find("agents");
        agents.sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0;
        })
        let users = []
        for (let a in agents) {
            agents[a].label = agents[a].name;
            agents[a].value = agents[a]._id
        }
        this.toggle("addModal")
        this.clearAddValues()
        // this.setState({ dealerships: dealers, loading: false })
        this.setState({ loading: false, users: agents })
    }
    async updateUser() {
        this.setState({ loading: true })
        let update = {
            name: this.props.utils.toTitleCase(this.state.editUserName),
            phone: this.state.editUserPhone,
            account_type: this.state.editType,
            isActive: this.state.editActive === "active" ? true : false,
            team: this.state.editUserTeam,
            department: this.state.editDepartment,
        }
        //update user
        this._isMounted && await this.props.mongo.findOneAndUpdate("agents", { email: this.state.editUserEmail }, update)
        //then get dealers and sort..
        let agents = await this.props.mongo.find("agents")
        agents.sort((a, b) => {
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
        this.toggle("editUserModal")
        this.setState({ users, editUser: { label: "", value: "" }, loading: false })
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
                        <Col className="ml-auto mr-auto text-center" md="8">
                            <Card>
                                <CardBody>
                                    <h2>Add User</h2>
                                    <Button color="primary" onClick={() => { this.toggle("addModal") }}>
                                        <i className="tim-icons icon-simple-add"></i>
                                    </Button>
                                    <Modal isOpen={this.state.addModal} toggle={() => { this.toggle("addModal") }} style={{ 'maxHeight': 'calc(100vh - 210px)' }}>
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
                                                        onChange={(e) => { this.setState({ addUserTeam: e }) }}
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
                                                        this.state.addUserTeam.label == undefined ||
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
                        <Col className="ml-auto mr-auto text-center" md="8">
                            <Card>
                                <CardBody>
                                    <h2>Edit User</h2>
                                    <Select
                                        name="editUser"
                                        id="editUser"
                                        options={this.state.users}
                                        value={this.state.editUser}
                                        onChange={(e) => { this.onValueChange("editUser", e); }}
                                    />
                                    <br />
                                    <Button color="primary" disabled={this.state.editUser.label.length == 0} onClick={async () => {
                                        this.setState({ loading: true })
                                        console.log("!@#", this.state.editUser)
                                        let u = await this.props.mongo.findOne("agents", { _id: this.state.editUser.value })
                                        this.setState({
                                            editUserName: u.name,
                                            editUserPhone: u.phone || "",
                                            editUserEmail: u.email || "",
                                            editUserTeam: u.team,
                                            editType: u.account_type,
                                            editDepartment: u.department,
                                            editActive: u.isActive == true ? "active" : "inactive"
                                        })
                                        this.setState({ loading: false })
                                        this.toggle("editUserModal");
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
                                                        onChange={(e) => { this.setState({ editUserTeam: e }) }}
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
                                                    this.setState({ editUser: { label: "", value: "" } })
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
                </Container>
            </div>
        );
    }
}

export default UserManagement;