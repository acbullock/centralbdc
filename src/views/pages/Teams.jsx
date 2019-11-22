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

class Teams extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modalDemo: false,
            agents: [],
            teams: [],
            openedCollapses: [],
            addTeamModal: false,
            editTeamModal: false,
            editTeamValue: "",
            newTeamName: "",
            loading: false,
            err: {
                message: ""
            },
            editTeamName: "",
        }
        this.editTeam = this.editTeam.bind(this)
    }
    addModalToggle = () => {
        this.setState({ addTeamModal: !this.state.addTeamModal })
    }
    editModalToggle = (s) => {
        this.setState({
            editTeamName: s.label,
            editTeamValue: s.value
        })
        this.setState({ editTeamModal: !this.state.editTeamModal })
        console.log(this.state.editTeamModal)
    }
    async componentWillMount() {
        // let x = await this.props.mongo.db.getUsers()
        // console.log(x)
        let user = await this.props.mongo.getActiveUser(this.props.mongo.mongodb)
        if (user.userId == undefined) {
            this.props.history.push("/admin/dashboard")
        }
        // let agents = await this.props.mongo.getCollection("agents")
        // let agent = await agents.findOne({ userId: user.userId })
        let agent = await this.props.mongo.findOne("agents", {userId: user.userId})
        if (agent.account_type != "admin") {

            this.props.history.push("/admin/dashboard")
        }
        // let teams = await this.props.mongo.getCollection("teams")
        // teams = await teams.find().toArray()
        await this.getTeams()
    }
    async componentWillUnmount() {
        // document.body.classList.toggle("white-content");
    }
    async getTeams() {
        this.setState({ loading: true })
        // let teams = await this.props.mongo.getCollection("teams")
        // teams = await teams.find().toArray()
        let teams = await this.props.mongo.find("teams")
        teams.sort((a,b)=>{
            if(a.label < b.label)
                return -1;
            if(b.label < a.label)
                return 1
            return 0
        })
        await this.setState({ teams, loading: false })

    }
    async handleRemove(agent) {
        this.setState({ loading: true })
        let newAgent = agent
        newAgent.isActive = false
        // let agents = await this.props.mongo.getCollection("agents")
        // await agents.findOneAndUpdate({ email: agent.email }, newAgent)
        await this.props.mongo.findOneAndUpdate("agents", {email: agent.email}, newAgent)
        this.setState({ loading: false })
    }
    async editTeam() {
        
        this.setState({loading: true})
        // let update = await this.props.mongo.getCollection("teams")
        // await update.findOneAndUpdate({_id: this.state.editTeamValue}, {value: this.state.editTeamValue, label: this.state.editTeamName})
        await this.props.mongo.findOneAndUpdate("teams", {_id: this.state.editTeamValue},{value: this.state.editTeamValue, label: this.state.editTeamName})
        await this.getTeams()
        await this.editModalToggle({value:"", label:""})
        this.setState({loading:false})
    }
    
    addTeam = async () => {

        this.setState({ loading: true, err: { message: "" } })
        // let teams = await this.props.mongo.getCollection("teams")
        // let x = await teams.insertOne({
        //     label: this.state.newTeamName,
        //     value: ""
        // })
        let x =await this.props.mongo.insertOne("teams", {
            label: this.state.newTeamName,
            value: ""
        })
        // await teams.findOneAndUpdate({ _id: x.insertedId }, {
        //     label: this.state.newTeamName,
        //     value: x.insertedId
        // })
        await this.props.mongo.findOneAndUpdate("teams", { _id: x.insertedId }, {
            label: this.state.newTeamName,
            value: x.insertedId
        })
        this.addModalToggle()
        await this.getTeams()
        this.setState({ loading: false })
    }
    render() {
        return (
            <div className="content">
                <Row>
                    <Col lg="12">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <h1>Team Management</h1>
                                    <Button
                                        className="btn-round"
                                        color="primary"
                                        data-target="#addTeamModal"
                                        data-toggle="modal"
                                        onClick={this.addModalToggle}
                                        disabled={this.state.loading}
                                    >
                                        <i className="nc-icon nc-lock-circle-open" />
                                        Add Team
                                    </Button>
                                    <Modal
                                        className="modal-login"
                                        modalClassName="modal-secondary"
                                        isOpen={this.state.addTeamModal}
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
                                                                "input-group-focus": this.state.sourceNameFocus
                                                            })}
                                                        >
                                                            <InputGroupAddon addonType="prepend">
                                                                <InputGroupText>
                                                                    <i className="tim-icons icon-single-02" />
                                                                </InputGroupText>
                                                            </InputGroupAddon>
                                                            <Input

                                                                placeholder="Team Name"
                                                                type="text"
                                                                onFocus={e => this.setState({ sourceNameFocus: true })}
                                                                onBlur={e => this.setState({ sourceNameFocus: false })}
                                                                onChange={e => this.setState({ newTeamName: e.target.value })}
                                                            />
                                                        </InputGroup>


                                                    </div>
                                                </Form>
                                            </div>
                                            <div className="modal-footer text-center pt-4">
                                                <Button
                                                    block
                                                    className="btn-neutral btn-round"
                                                    href="#pablo"
                                                    onClick={this.addTeam}
                                                    size="lg"
                                                    disabled={
                                                        this.state.loading ||
                                                        this.state.newTeamName.length === 0
                                                    }
                                                >
                                                    Create Team
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
                                    {this.state.teams.map((s, i) => {
                                        if (s.label === "None") {
                                            return null
                                        }
                                        return (
                                            <div key={s.value}>

                                                <Card className="card-plain justify-content-center" role="tab">
                                                    <hr />
                                                    <Row>

                                                        <Col lg="6">

                                                            <h3>{s.label}</h3>
                                                        </Col>
                                                        <Col lg="6">
                                                            <Button className="btn btn-round" color="primary" disabled={this.state.loading} onClick={(e) => this.editModalToggle(s)}>
                                                                <i className="tim-icons icon-pencil" />

                                                            </Button>
                                                            
                                                        </Col></Row>
                                                    {/* <Button className="btn btn-round" color="primary" disabled={this.state.loading} onClick={() => this.editModalToggle(s)}>
                                                        <i className="tim-icons icon-pencil" />

                                                    </Button> */}


                                                    <Modal isOpen={this.state.editTeamModal} toggle={(e) => this.editModalToggle(s || {value:"", label: "" })}>
                                                        <div className="modal-header">
                                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={(e) => this.editModalToggle({ value: "", label: "" })}>
                                                                <i className="tim-icons icon-simple-remove"></i>
                                                            </button>
                                                            <h4 className="modal-title">Update Team</h4>
                                                        </div>
                                                        <ModalBody >
                                                            <Form action="" className="form" method="">
                                                                <div className="card-content">
                                                                    <Label >
                                                                        Team Name:
                                                                    </Label>
                                                                    <Input placeholder="Edit source" type="text" value={this.state.editTeamName} onChange={(e) => { this.setState({ editTeamName: e.target.value }) }}></Input>

                                                                </div>
                                                            </Form>
                                                        </ModalBody>
                                                        <ModalFooter>
                                                            
                                                            <Button color="secondary" onClick={(e) => this.editModalToggle({value:"", label: "" })}>
                                                                Close
                                                                    </Button>
                                                                    <Button className="btn btn-round" color="danger" disabled={this.state.loading} onClick={async (e) => {
                                                                        this.setState({loading: true})
                                                                    //    let teams =  await this.props.mongo.getCollection("teams");
                                                                    //    await teams.findOneAndDelete({_id: this.state.editTeamValue})
                                                                    await this.props.mongo.findOneAndDelete("teams", {_id: this.state.editTeamValue})
                                                                       await this.editModalToggle({label: "", value: ""})
                                                                       await this.getTeams()
                                                                       this.setState({loading: false})
                                                                    }}>
                                                                 Remove Team

                                                            </Button>
                                                            <Button color="primary" onClick={this.editTeam} disabled={
                                                                this.state.loading ||
                                                                this.state.editTeamName.length == 0
                                                            }>
                                                             Save changes
                                                                    </Button>
                                                                    
                                                                    
                                                        </ModalFooter>
                                                    </Modal>

                                                </Card><br /></div>
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

export default Teams;