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

class DealershipUsers extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            users: [],
            dealerships: [],
            editUser: { label: "", value: "" },
            editUserValue: "",
            addModal: false,
            editUserModal: false,
            addUserName: "",
            addUserEmail: "",
            addUserPhone: "",
            addUserTitle: "",
            addUserDealership: { label: "", value: "" },
            addAccess: "",
            editUserName: "",
            editUserPhone: "",
            editUserEmail: "",
            editUserTitle: "",
            editAccess: "",
            editActive: "",
            editUserDealership: { label: "", value: "" }
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
        let users = this._isMounted && await this.props.mongo.find("dealership_users")
        let dealerships = this._isMounted && await this.props.mongo.find("dealerships")
        users.sort((a, b) => {
            if (a.name < b.name) return -1
            if (b.name < a.name) return 1
            return 0
        })
        dealerships.sort((a, b) => {
            if (a.label < b.label) return -1
            if (b.label < a.label) return 1
            return 0
        })
        let userOptions = []
        for (let u in users) {
            userOptions[u] = {}
            userOptions[u].label = users[u].email
            userOptions[u].value = users[u]._id
        }
        this.setState({ loading: false, users: userOptions, dealerships })
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
            addUserTitle: "",
            addActive: "",
            addUserDealership: { label: "", value: "" },
            addAccess: ""

        })
    }
    async addNewUser() {
        this.setState({ loading: true })

        let newUser = {
            name: this.props.utils.toTitleCase(this.state.addUserName),
            phone: this.state.addUserPhone,
            email: this.state.addUserEmail,
            dealership: this.state.addUserDealership.value,
            access: this.state.addAccess,
            title: this.state.addUserTitle,
            isActive: this.state.addActive === "active",
        }
        console.log(newUser)
        //register user with "password" as password.. they can always reset password on login page..
        await this.props.mongo.handleRegister(newUser.email, "password").catch((err => this.setState({ err })))
        // insert user
        this._isMounted && await this.props.mongo.insertOne("dealership_users", newUser)
        //re-get agents..
        let agents = await this.props.mongo.find("dealership_users");
        agents.sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0;
        })
        let users = []
        for (let a in agents) {
            agents[a].label = agents[a].email;
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
            email: this.state.editUserEmail,
            title: this.state.editUserTitle,
            access: this.state.editAccess,
            isActive: this.state.editActive === "active" ? true : false,
            dealership: this.state.editUserDealership.value
        }
        //update user
        this._isMounted && await this.props.mongo.findOneAndUpdate("dealership_users", { email: this.state.editUserEmail }, update)
        //then get dealers and sort..
        let agents = await this.props.mongo.find("dealership_users")
        agents.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        })
        let users = []
        for (let a in agents) {
            users[a] = {
                label: agents[a].email,
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
                                                <FormGroup>
                                                    <Label for="userTitle">Title</Label>
                                                    <Input
                                                        type="text"
                                                        name="userTitle"
                                                        id="userTitle"
                                                        placeholder="Title"
                                                        value={this.state.addUserTitle}
                                                        onChange={(e) => { this.onValueChange("addUserTitle", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <hr />
                                                <FormGroup>
                                                    <Label for="userDealership">Dealership</Label>
                                                    <Select
                                                        name="userDealership"
                                                        id="userDealership"
                                                        placeholder="Dealership Name"
                                                        options={this.state.dealerships}
                                                        value={this.state.addUserDealership}
                                                        onChange={(e) => { this.setState({ addUserDealership: e }) }}
                                                    />
                                                </FormGroup>
                                                <hr />
                                                <legend>Access Level</legend>
                                                <FormGroup tag="fieldset">
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input type="radio" name="addAccess" value="store" checked={this.state.addAccess === "store"} onChange={(e) => { this.onValueChange("addAccess", e.target.value) }} />
                                                            {' Store'}
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input type="radio" name="addAccess" value="group" checked={this.state.addAccess === "group"} onChange={(e) => { this.onValueChange("addAccess", e.target.value) }} />
                                                            {' Group'}
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input type="radio" name="addAccess" value="admin" checked={this.state.addAccess === "admin"} onChange={(e) => { this.onValueChange("addAccess", e.target.value) }} />
                                                            {' Admin'}
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
                                                        this.state.addUserDealership.label == undefined ||
                                                        this.state.addActive.length === 0 ||
                                                        this.state.addAccess.length === 0
                                                    }
                                                >Submit</Button>
                                            </Form>
                                        </ModalBody>
                                    </Modal>
                                </CardBody>
                            </Card>
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
                                        let u = await this.props.mongo.findOne("dealership_users", { _id: this.state.editUser.value })
                                        let d = await this.props.mongo.findOne("dealerships", { value: u.dealership })
                                        this.setState({
                                            editUserName: u.name,
                                            editUserPhone: u.phone || "",
                                            editUserEmail: u.email || "",
                                            editUserTitle: u.title || "",
                                            editUserDealership: d,
                                            editAccess: u.access,
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
                                                    <Label for="editUserDealership">Edit Dealership</Label>
                                                    <Select
                                                        name="editUserDealership"
                                                        id="editUserDealership"
                                                        placeholder="Edit Dealership"
                                                        options={this.state.dealerships}
                                                        value={this.state.editUserDealership}
                                                        onChange={(e) => { this.setState({ editUserDealership: e }) }}
                                                    />
                                                </FormGroup>
                                                <hr />
                                                <hr />
                                                <legend>Edit Access Level</legend>
                                                <FormGroup tag="fieldset">
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input type="radio" name="editAccess" value="store" checked={this.state.editAccess === "store"} onChange={(e) => { this.onValueChange("editAccess", e.target.value) }} />
                                                            {' Store'}
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input type="radio" name="editAccess" value="group" checked={this.state.editAccess === "group"} onChange={(e) => { this.onValueChange("editAccess", e.target.value) }} />
                                                            {' Group'}
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input type="radio" name="editAccess" value="admin" checked={this.state.editAccess === "admin"} onChange={(e) => { this.onValueChange("editAccess", e.target.value) }} />
                                                            {' Admin'}
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
                                                        this.state.editAccess.length === 0 ||
                                                        this.state.editUserTitle.length === 0 ||
                                                        // this.state.editUserDealership.label.length === 0 ||
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

export default DealershipUsers;