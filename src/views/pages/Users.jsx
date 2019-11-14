import React from "react";
// reactstrap components
import {
    Button,
    Label,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    InputGroup, InputGroupAddon, InputGroupText, Form,
    Collapse,
    Row,
    Col,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    // UncontrolledTooltip
} from "reactstrap";

import classnames from "classnames";

class Users extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modalDemo: false,
            agents: [],
            openedCollapses: [],
            addUserModal: false,
            editUserModal: false,
            newFullName: "",
            newPhone: "",
            newTeam: "",
            newEmail: "",
            newPassword: "",
            newConfirmPassword: "",
            newIsAdmin: false,
            newIsApprover: false,
            loading: false,
            err: {
                message: ""
            },
            editFullName: "",
            editPhone: "",
            editEmail: "",
            editIsAdmin: "",
            editIsApprover: "",
            editTeam: "",
            editIsActive: "",
            editID: null
        }
    }
    addModalToggle = () => {
        this.setState({ addUserModal: !this.state.addUserModal })
    }
    editModalToggle = (a) => {
        this.setState({
            editID: a._id,
            editFullName: a.name,
            editPhone: a.phone,
            editEmail: a.email,
            editIsAdmin: a.account_type === "admin",
            editIsApprover: a.isApprover,
            editIsActive: a.isActive,
            editTeam: a.team
        })
        this.setState({ editUserModal: !this.state.editUserModal })
        console.log(this.state.editUserModal)
    }
    async componentWillMount() {
        // let x = await this.props.mongo.db.getUsers()
        // console.log(x)
        let user = await this.props.mongo.getActiveUser(this.props.mongo.mongodb)
        if (user.userId == undefined) {
            this.props.history.push("/admin/dashboard")
        }
        let agents = await this.props.mongo.getCollection("agents")
        let agent = await agents.findOne({ userId: user.userId })
        if (agent.account_type != "admin") {

            this.props.history.push("/admin/dashboard")
        }
        // let agent = await agents.findOne({userId: })
        // document.body.classList.toggle("white-content");
        await this.getAgents()
    }
    async componentWillUnmount() {
        // document.body.classList.toggle("white-content");
    }
    async getAgents() {
        this.setState({ loading: true })
        let agents = await this.props.mongo.getCollection("agents")
        agents = await agents.find().toArray()
        await this.setState({ agents, loading: false })

    }
    async handleRemove(agent) {
        this.setState({ loading: true })
        let newAgent = agent
        newAgent.isActive = false
        let agents = await this.props.mongo.getCollection("agents")
        await agents.findOneAndUpdate({ email: agent.email }, newAgent)
        this.setState({ loading: false })
    }
    async editUser(agent, index) {
        this.setState({ loading: true })
        let x = await this.props.mongo.getCollection("agents")
        let currCopy = await x.findOne({ _id: this.state.editID })
        let merge = {
            name: this.state.editFullName,
            email: this.state.editEmail.toLowerCase(),
            phone: this.state.editPhone,
            team: this.state.editTeam,
            account_type: this.state.editIsAdmin ? "admin" : "agent",
            isApprover: this.state.editIsApprover || this.state.editIsAdmin,
            isActive: this.state.editIsActive
        }
        currCopy = Object.assign(currCopy, merge)
        console.log(currCopy)
        x = await x.findOneAndUpdate({ _id: this.state.editID }, currCopy)
        await this.editModalToggle({ name: "", phone: "", account_type: "agent", isActive: false, email: "", team: "", isApprover: false, editID: null })
        await this.getAgents()

        this.setState({ loading: false })
        // console.log(index + " !@#")
    }
    collapseToggle = collapse => {
        let openedCollapses = this.state.openedCollapses
        if (openedCollapses.includes(collapse)) {
            this.setState({
                openedCollapses: []
            })
        }
        else {
            this.setState({ openedCollapses: [collapse] })
        }
    }
    registerUser = async () => {
        this.setState({ loading: true, err: { message: "" } })
        let { db } = this.props.mongo;
        // let pass = true;
        let reg = await this.props.mongo.handleRegister(this.state.newEmail, this.state.newPassword).catch((err => this.setState({ err })))
        this.setState({ loading: false })
        let pass = this.state.err.message.length === 0



        if (pass) {
            await db.collection("agents").insertOne({
                email: this.state.newEmail,
                phone: this.state.newPhone,
                name: this.state.newFullName,
                account_type: this.state.newIsAdmin === true ? "admin" : "agent",
                appointments: [],
                isApprover: this.state.newIsAdmin === true || this.state.newIsApprover,
                team: this.state.newTeam,
                isActive: true
            })
            await this.getAgents()
            this.addModalToggle()
            // this.props.history.push("/admin/dashboard")}
            this.setState({ loading: false })
        }

    }
    render() {
        return (
            <div className="content">
                <Row>
                    <Col lg="12">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <h1>User Management</h1>
                                    <Button
                                        className="btn-round"
                                        color="primary"
                                        data-target="#addUserModal"
                                        data-toggle="modal"
                                        onClick={this.addModalToggle}
                                        disabled={this.state.loading}
                                    >
                                        <i className="nc-icon nc-lock-circle-open" />
                                        Add User
                                    </Button>
                                    <Modal
                                        className="modal-login"
                                        modalClassName="modal-secondary"
                                        isOpen={this.state.addUserModal}
                                        toggle={this.addModalToggle}
                                    >
                                        <Card className="card-login card-plain" >
                                            <div className="modal-header justify-content-center">
                                                <button
                                                    aria-hidden={true}
                                                    className="close"
                                                    data-dismiss="modal"
                                                    type="button"
                                                    onClick={this.addModalToggle}>
                                                    <i className="tim-icons icon-simple-remove" />
                                                </button>
                                                <div className="header header-primary text-center">
                                                    <div className="modal-profile">
                                                        <i className="tim-icons icon-single-02" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="modal-body">
                                                <Form action="" className="form" method="">
                                                    <div className="card-content">

                                                        <InputGroup
                                                            className={classnames("no-border form-control-lg", {
                                                                "input-group-focus": this.state.fullNameFocus
                                                            })}
                                                        >
                                                            <InputGroupAddon addonType="prepend">
                                                                <InputGroupText>
                                                                    <i className="tim-icons icon-single-02" />
                                                                </InputGroupText>
                                                            </InputGroupAddon>
                                                            <Input

                                                                placeholder="Full Name"
                                                                type="text"
                                                                onFocus={e => this.setState({ fullNameFocus: true })}
                                                                onBlur={e => this.setState({ fullNameFocus: false })}
                                                                onChange={e => this.setState({ newFullName: e.target.value })}
                                                            />
                                                        </InputGroup>
                                                        <InputGroup
                                                            className={classnames("no-border form-control-lg", {
                                                                "input-group-focus": this.state.phoneFocus
                                                            })}
                                                        >
                                                            <InputGroupAddon addonType="prepend">
                                                                <InputGroupText>
                                                                    <i className="tim-icons icon-mobile" />
                                                                </InputGroupText>
                                                            </InputGroupAddon>
                                                            <Input
                                                                placeholder="Phone Number"
                                                                type="tel"
                                                                onFocus={e => this.setState({ phoneFocus: true })}
                                                                onBlur={e => this.setState({ phoneFocus: false })}
                                                                onChange={e => this.setState({ newPhone: e.target.value })}
                                                            />
                                                        </InputGroup>
                                                        <InputGroup
                                                            className={classnames("no-border form-control-lg", {
                                                                "input-group-focus": this.state.emailFocus
                                                            })}
                                                        >
                                                            <InputGroupAddon addonType="prepend">
                                                                <InputGroupText>
                                                                    <i className="tim-icons icon-email-85" />
                                                                </InputGroupText>
                                                            </InputGroupAddon>
                                                            <Input
                                                                placeholder="Email"
                                                                type="email"
                                                                onFocus={e => this.setState({ emailFocus: true })}
                                                                onBlur={e => this.setState({ emailFocus: false })}
                                                                onChange={e => this.setState({ newEmail: e.target.value.toLowerCase() })}
                                                            />
                                                        </InputGroup>
                                                        <InputGroup
                                                            className={classnames("no-border form-control-lg", {
                                                                "input-group-focus": this.state.teamNameFocus
                                                            })}
                                                        >
                                                            <InputGroupAddon addonType="prepend">
                                                                <InputGroupText>
                                                                    <i className="tim-icons icon-trophy" />
                                                                </InputGroupText>
                                                            </InputGroupAddon>
                                                            <Input
                                                                placeholder="Team Name"
                                                                type="text"
                                                                onFocus={e => this.setState({ teamNameFocus: true })}
                                                                onBlur={e => this.setState({ teamNameFocus: false })}
                                                                onChange={e => this.setState({ newTeam: e.target.value })}
                                                            />
                                                        </InputGroup>

                                                        <InputGroup
                                                            className={classnames("no-border form-control-lg", {
                                                                "input-group-focus": this.state.passwordFocus
                                                            })}
                                                        >
                                                            <InputGroupAddon addonType="prepend">
                                                                <InputGroupText>
                                                                    <i className="tim-icons icon-key-25" />
                                                                </InputGroupText>
                                                            </InputGroupAddon>
                                                            <Input
                                                                placeholder="Password"
                                                                type="password"
                                                                onFocus={e => this.setState({ passwordFocus: true })}
                                                                onBlur={e => this.setState({ passwordFocus: false })}
                                                                onChange={e => this.setState({ newPassword: e.target.value })}
                                                            />
                                                        </InputGroup>
                                                        <InputGroup
                                                            className={classnames("no-border form-control-lg", {
                                                                "input-group-focus": this.state.confirmPasswordFocus
                                                            })}
                                                        >
                                                            <InputGroupAddon addonType="prepend">
                                                                <InputGroupText>
                                                                    <i className="tim-icons icon-key-25" />
                                                                </InputGroupText>
                                                            </InputGroupAddon>
                                                            <Input
                                                                placeholder="Confirm Password"
                                                                type="password"
                                                                onFocus={e => this.setState({ confirmPasswordFocus: true })}
                                                                onBlur={e => this.setState({ confirmPasswordFocus: false })}
                                                                onChange={e => this.setState({ newConfirmPassword: e.target.value })}
                                                            />
                                                        </InputGroup>
                                                        <InputGroup
                                                            className={classnames("no-border form-control-lg", {
                                                                "input-group-focus": this.state.isAdminFocus
                                                            })}
                                                        >

                                                            <div className="form-check">

                                                                <label className="form-check-label">
                                                                    <Input className="form-check-input" type="checkbox" checked={this.state.newIsAdmin} onChange={() => { this.setState({ newIsAdmin: !this.state.newIsAdmin }) }} />
                                                                    Admin User
                                                        <span className="form-check-sign">
                                                                        <span className="check"></span>
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </InputGroup>
                                                        <InputGroup
                                                            className={classnames("no-border form-control-lg", {
                                                                "input-group-focus": this.state.isApproverFocus
                                                            })}
                                                        >

                                                            {/* <Input
                                                placeholder="Is Admin"
                                                type="checkbox"
                                                onFocus={e => this.setState({ isApproverFocus: true })}
                                                onBlur={e => this.setState({ isApproverFocus: false })}
                                                // onChange={e=>this.setState({newIsApprover: e.target.value})}
                                                /> */}
                                                            <div className="form-check">

                                                                <label className="form-check-label">
                                                                    <Input className="form-check-input" type="checkbox" checked={this.state.newIsApprover} onChange={() => { this.setState({ newIsApprover: !this.state.newIsApprover }) }} />
                                                                    Approver
                                                        <span className="form-check-sign">
                                                                        <span className="check"></span>
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </InputGroup>

                                                    </div>
                                                </Form>
                                            </div>
                                            <div className="modal-footer text-center pt-4">
                                                <Button
                                                    block
                                                    className="btn-neutral btn-round"
                                                    href="#pablo"
                                                    onClick={this.registerUser}
                                                    size="lg"
                                                    disabled={
                                                        this.state.loading ||
                                                        this.state.newFullName.length === 0 ||
                                                        this.state.newPhone.length != 10 ||
                                                        isNaN(this.state.newPhone) ||
                                                        this.state.newEmail.length === 0 ||
                                                        this.state.newPassword.length === 0 ||
                                                        this.state.newPassword != this.state.newConfirmPassword
                                                    }
                                                >
                                                    Create User
                                        </Button>

                                            </div>
                                            <Card className="card-info" color="red" hidden={this.state.err.message == ""}>
                                                <CardBody>
                                                    <p><strong>{this.state.err.message}</strong></p>
                                                </CardBody>
                                            </Card>
                                        </Card>
                                    </Modal>
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div
                                    aria-multiselectable={true}
                                    className="card-collapse"
                                    id="accordian"
                                    role="tablist">
                                    {this.state.agents.map((a, i) => {
                                        return (
                                            <div key={a.name}>
                                                <hr />
                                                <Card className="card-plain">
                                                
                                                    <CardHeader role="tab">
                                                        <a
                                                            aria-expanded={this.state.openedCollapses.includes(a.name)}
                                                            href="#pablo"
                                                            data-parent="#accordion"
                                                            data-toggle="collapse"
                                                            onClick={(e) => { e.preventDefault(); this.collapseToggle(a.name) }}
                                                        >
                                                            <p>{a.name}</p>
                                                            <p>{a.email}</p>
                                                            <p>{a.phone}</p>
                                                            <p>{a.team}</p>
                                                            <i className="tim-icons icon-minimal-down" />
                                                            
                                                        </a>
                                                    </CardHeader>
                                                    <Collapse
                                                        role="tabpanel"
                                                        isOpen={this.state.openedCollapses.includes(a.name)}>
                                                        <CardBody>
                                                            <p><strong>Name:</strong> {a.name}</p>
                                                            <p><strong>Phone:</strong> {a.phone}</p>
                                                            <p><strong>Email:</strong> {a.email}</p>
                                                            <p><strong>Team: </strong>{a.team}</p>
                                                            <p><strong>Account Type: </strong>{a.account_type}</p>
                                                            <p><strong>Approver: </strong>{a.isApprover ? "User IS an approver" : "User IS NOT an approver"}</p>
                                                            <p><strong>Active: </strong>{a.isActive ? "User IS active" : "User IS NOT active"}</p>
                                                            <Button color="primary" disabled={this.state.loading} onClick={() => this.editModalToggle(a)}>
                                                                <i className="nc-icon nc-ruler-pencil" />
                                                                Edit User
                                                            </Button>
                                                            <Modal isOpen={this.state.editUserModal} toggle={(e) => this.editModalToggle(a || { name: "", phone: "", account_type: "agent", isActive: false, email: "", team: "", isApprover: false, editID: null })}>
                                                                <div className="modal-header">
                                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={(e)=>this.editModalToggle({ name: "", phone: "", account_type: "agent", isActive: false, email: "", team: "", isApprover: false, editID: null })}>
                                                                        <i className="tim-icons icon-simple-remove"></i>
                                                                    </button>
                                                                    <h4 className="modal-title">Edit User</h4>
                                                                </div>
                                                                <ModalBody >
                                                                    <Form action="" className="form" method="">
                                                                        <div className="card-content">
                                                                            <Label >
                                                                                Full Name:
                                                                                </Label>
                                                                            <Input placeholder="Edit full name" type="text" value={this.state.editFullName} onChange={(e) => { this.setState({ editFullName: e.target.value }) }}></Input>

                                                                            <Label>Phone:
                                                                                </Label>
                                                                            <Input placeholder="Edit phone number" type="tel" value={this.state.editPhone} onChange={(e) => { this.setState({ editPhone: e.target.value }) }}></Input>

                                                                            <Label>
                                                                                Email:
                                                                                </Label>
                                                                            <Input placeholder="Edit email" type="email" value={this.state.editEmail} ></Input>

                                                                            <Label>
                                                                                Team:
                                                                                </Label>
                                                                            <Input placeholder="Edit team" type="text" value={this.state.editTeam} onChange={(e) => { this.setState({ editTeam: e.target.value }) }}></Input>

                                                                            <div className="form-check">

                                                                                <label className="form-check-label">
                                                                                    <Input className="form-check-input" type="checkbox" checked={this.state.editIsAdmin} onChange={(e) => { this.setState({ editIsAdmin: !this.state.editIsAdmin }) }} />
                                                                                    Admin User
                                                                                        <span className="form-check-sign">
                                                                                        <span className="check"></span>
                                                                                    </span>
                                                                                </label>
                                                                            </div>
                                                                            <div className="form-check">

                                                                                <label className="form-check-label">
                                                                                    <Input className="form-check-input" type="checkbox" checked={this.state.editIsApprover} onChange={(e) => { this.setState({ editIsAdmin: !this.state.editIsAdmin }) }} />
                                                                                    Approver
                                                                                        <span className="form-check-sign">
                                                                                        <span className="check"></span>
                                                                                    </span>
                                                                                </label>
                                                                            </div>
                                                                            <div className="form-check">

                                                                                <label className="form-check-label">
                                                                                    <Input className="form-check-input" type="checkbox" checked={this.state.editIsActive} onChange={(e) => { this.setState({ editIsActive: !this.state.editIsActive }) }} />
                                                                                    Active
                                                                                        <span className="form-check-sign">
                                                                                        <span className="check"></span>
                                                                                    </span>
                                                                                </label>
                                                                            </div>


                                                                        </div>
                                                                    </Form>
                                                                </ModalBody>
                                                                <ModalFooter>
                                                                    <Button color="secondary" onClick={(e) => this.editModalToggle({ name: "", phone: "", account_type: "agent", isActive: false, email: "", team: "", isApprover: false, editID: null })}>
                                                                        Close
                                                                    </Button>
                                                                    <Button color="primary" onClick={(e) => this.editUser(a, i)} disabled={
                                                                        this.state.loading ||
                                                                        this.state.editEmail.length == 0 ||
                                                                        this.state.editFullName.length == 0 ||
                                                                        this.state.editPhone.length == 0 ||
                                                                        this.state.editTeam.length == 0

                                                                    }>
                                                                        Save changes
                                                                    </Button>
                                                                </ModalFooter>
                                                            </Modal>
                                                            {/* <Button onClick={(e) => this.handleRemove(a)} disabled={!a.isActive || this.state.loading} >
                                                                <i className="tim-icons icon-simple-remove" />
                                                                Make User Inactive
                                                            </Button> */}

                                                        </CardBody>
                                                    </Collapse>
                                                </Card><hr /><br /></div>
                                        );
                                    })}

                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Users;