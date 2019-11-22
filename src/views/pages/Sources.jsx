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

class Sources extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modalDemo: false,
            agents: [],
            sources: [],
            openedCollapses: [],
            addSourceModal: false,
            editSourceModal: false,
            editSourceValue: "",
            newSourceName: "",
            loading: false,
            err: {
                message: ""
            },
            editSourceName: "",
        }
        this.editSource = this.editSource.bind(this)
    }
    addModalToggle = () => {
        this.setState({ addSourceModal: !this.state.addSourceModal })
    }
    editModalToggle = (s) => {
        this.setState({
            editSourceName: s.label,
            editSourceValue: s.value
        })
        this.setState({ editSourceModal: !this.state.editSourceModal })
        console.log(this.state.editSourceModal)
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
        // let sources = await this.props.mongo.getCollection("sources")
        // sources = await sources.find().toArray()
        await this.getSources()
    }
    async componentWillUnmount() {
        // document.body.classList.toggle("white-content");
    }
    async getSources() {
        this.setState({ loading: true })
        // let sources = await this.props.mongo.getCollection("sources")
        // sources = await sources.find().toArray()
        let sources = await this.props.mongo.find("sources")
        sources = sources.sort((a,b)=>{
            if(a.label > b.label) return 1
            if(a.label < b.label) return -1
            return 0
        })
        await this.setState({ sources, loading: false })

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
    async editSource() {
        
        this.setState({loading: true})
        // let update = await this.props.mongo.getCollection("sources")
        // await update.findOneAndUpdate({_id: this.state.editSourceValue}, {value: this.state.editSourceValue, label: this.state.editSourceName})
        await this.props.mongo.findOneAndUpdate("sources", {_id: this.state.editSourceValue}, {value: this.state.editSourceValue, label: this.state.editSourceName})
        await this.getSources()
        await this.editModalToggle({value:"", label:""})
        this.setState({loading:false})
    }
    
    addSource = async () => {

        this.setState({ loading: true, err: { message: "" } })
        // let sources = await this.props.mongo.getCollection("sources")
        
        // let x = await sources.insertOne({
        //     label: this.state.newSourceName,
        //     value: ""
        // })
        let x = await this.props.mongo.insertOne("sources", {
            label: this.state.newSourceName,
            value: ""
        })
        // await sources.findOneAndUpdate({ _id: x.insertedId }, {
        //     label: this.state.newSourceName,
        //     value: x.insertedId
        // })
        await this.props.mongo.findOneAndUpdate("sources", {_id: x.insertedId}, {
            label: this.state.newSourceName,
            value: x.insertedId
        })
        this.addModalToggle()
        // sources = await this.props.mongo.getCollection("sources")
        // sources = await sources.find().toArray()
        await this.getSources()
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
                                    <h1>Source Management</h1>
                                    <Button
                                        className="btn-round"
                                        color="primary"
                                        data-target="#addSourceModal"
                                        data-toggle="modal"
                                        onClick={this.addModalToggle}
                                        disabled={this.state.loading}
                                    >
                                        <i className="nc-icon nc-lock-circle-open" />
                                        Add Source
                                    </Button>
                                    <Modal
                                        className="modal-login"
                                        modalClassName="modal-secondary"
                                        isOpen={this.state.addSourceModal}
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

                                                                placeholder="Source Name"
                                                                type="text"
                                                                onFocus={e => this.setState({ sourceNameFocus: true })}
                                                                onBlur={e => this.setState({ sourceNameFocus: false })}
                                                                onChange={e => this.setState({ newSourceName: e.target.value })}
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
                                                    onClick={this.addSource}
                                                    size="lg"
                                                    disabled={
                                                        this.state.loading ||
                                                        this.state.newSourceName.length === 0
                                                    }
                                                >
                                                    Create Source
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
                                    {this.state.sources.map((s, i) => {
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


                                                    <Modal isOpen={this.state.editSourceModal} toggle={(e) => this.editModalToggle(s || {value:"", label: "" })}>
                                                        <div className="modal-header">
                                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={(e) => this.editModalToggle({ value: "", label: "" })}>
                                                                <i className="tim-icons icon-simple-remove"></i>
                                                            </button>
                                                            <h4 className="modal-title">Update Source</h4>
                                                        </div>
                                                        <ModalBody >
                                                            <Form action="" className="form" method="">
                                                                <div className="card-content">
                                                                    <Label >
                                                                        Source Name:
                                                                    </Label>
                                                                    <Input placeholder="Edit source" type="text" value={this.state.editSourceName} onChange={(e) => { this.setState({ editSourceName: e.target.value }) }}></Input>

                                                                </div>
                                                            </Form>
                                                        </ModalBody>
                                                        <ModalFooter>
                                                            
                                                            <Button color="secondary" onClick={(e) => this.editModalToggle({value:"", label: "" })}>
                                                                Close
                                                                    </Button>
                                                            <Button color="primary" onClick={this.editSource} disabled={
                                                                this.state.loading ||
                                                                this.state.editSourceName.length == 0
                                                            }>
                                                             Save changes
                                                                    </Button>
                                                                    <Button className="btn btn-round" color="danger" disabled={this.state.loading} onClick={async (e) => {
                                                                        this.setState({loading: true})
                                                                    //    let sources =  await this.props.mongo.getCollection("sources");
                                                                    //    await sources.findOneAndDelete({_id: this.state.editSourceValue})
                                                                        await this.props.mongo.findOneAndDelete("sources", {_id: this.state.editSourceValue})
                                                                       await this.editModalToggle({label: "", value: ""})
                                                                       await this.getSources()
                                                                       this.setState({loading: false})
                                                                    }}>
                                                                <i className="tim-icons icon-simple-remove" />

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

export default Sources;