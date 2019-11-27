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

class Scenarios extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modalDemo: false,
            agents: [],
            scenarios: [],
            openedCollapses: [],
            addScenarioModal: false,
            editScenarioModal: false,
            editScenarioValue: "",
            newScenarioName: "",
            newScenarioType: "",
            loading: false,
            err: {
                message: ""
            },
            editScenarioName: "",
            editScenarioType: ""
        }
        this.editScenario = this.editScenario.bind(this)
    }
    addModalToggle = () => {
        this.setState({ addScenarioModal: !this.state.addScenarioModal })
    }
    editModalToggle = (s) => {
        this.setState({
            editScenarioName: s.label,
            editScenarioValue: s.value,
            editScenarioType: s.type
        })
        this.setState({ editScenarioModal: !this.state.editScenarioModal })
        
    }
    async componentWillMount() {
        // let x = await this.props.mongo.db.getUsers()
        // console.log(x)
        await this.cleanUpDepartments()
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
        // let scenarios = await this.props.mongo.getCollection("scenarios")
        // scenarios = await scenarios.find().toArray()
        await this.getScenarios()
    }
    async cleanUpDepartments(){
        let deps = await this.props.mongo.find("departments")
        let scens = await this.props.mongo.find("scenarios")
        let found = false
        for(let d in deps){
            found = false
            for(let s in scens){
                if(scens[s].type == deps[d].label){
                    found = true
                    break;
                }

            }
            if(!found){
                await this.props.mongo.findOneAndDelete("departments", deps[d])
            }
        }
    }
    async componentWillUnmount() {
        // document.body.classList.toggle("white-content");
    }
    async getScenarios() {
        this.setState({ loading: true })
        // let scenarios = await this.props.mongo.getCollection("scenarios")
        // scenarios = await scenarios.find().toArray()
        let scenarios = await this.props.mongo.find("scenarios")
        scenarios = scenarios.sort((a,b)=>{
            if(a.type > b.type) return 1
            if(a.type < b.type) return -1
            return 0
        })
        await this.setState({ scenarios, loading: false })

    }
    async handleRemove(agent) {
        this.setState({ loading: true })
        let newAgent = agent
        newAgent.isActive = false
        // let agents = await this.props.mongo.getCollection("agents")
        // await agents.findOneAndUpdate({ email: agent.email }, newAgent)
        await this.cleanUpDepartments()
        await this.props.mongo.findOneAndUpdate("agents", {email: agent.email}, newAgent)
        this.setState({ loading: false })
    }
    async editScenario() {
        
        this.setState({loading: true})
        // let update = await this.props.mongo.getCollection("scenarios")
        // await update.findOneAndUpdate({_id: this.state.editScenarioValue}, {value: this.state.editScenarioValue, label: this.state.editScenarioName})
        await this.props.mongo.findOneAndUpdate("scenarios", {_id: this.state.editScenarioValue}, {value: this.state.editScenarioValue, label: this.state.editScenarioName, type: this.state.editScenarioType})
        
        //if new department doesnt exist, add it..
        let departments = await this.props.mongo.find("departments")
        let found = false
        for(let d in departments){
            if(departments[d].label === this.state.editScenarioType){
                found = true;
                break;
            }
        }
        if(!found){
            let x = await this.props.mongo.insertOne("departments", {label: this.state.editScenarioType})
            let newdep = await this.props.mongo.findOneAndUpdate("departments", {label: this.state.editScenarioType}, {label: this.state.editScenarioType, value:x.insertedId})
        }
        await this.cleanUpDepartments()
        await this.getScenarios()
        await this.editModalToggle({value:"", label:"", type: ""})
        this.setState({loading:false})
    }
    
    addScenario = async () => {

        this.setState({ loading: true, err: { message: "" } })
        // let scenarios = await this.props.mongo.getCollection("scenarios")
        
        // let x = await scenarios.insertOne({
        //     label: this.state.newScenarioName,
        //     value: ""
        // })
        let deps = await this.props.mongo.find("departments")
        let found = false
        for(let d in deps){
            if(deps[d].label == this.state.newScenarioType ){
                found = true;
                break;
            }
        }
        if(!found){
            let x = await this.props.mongo.insertOne("departments", {label: this.state.newScenarioType})
            await this.props.mongo.findOneAndUpdate("departments", {label: this.state.newScenarioType}, {
                label: this.state.newScenarioType,
                value: x.insertedId
            })
        }
        let x = await this.props.mongo.insertOne("scenarios", {
            label: this.state.newScenarioName,
            type: this.state.newScenarioType,
            value: ""
        })
        // await scenarios.findOneAndUpdate({ _id: x.insertedId }, {
        //     label: this.state.newScenarioName,
        //     value: x.insertedId
        // })
        await this.props.mongo.findOneAndUpdate("scenarios", {_id: x.insertedId}, {
            label: this.state.newScenarioName,
            value: x.insertedId
        })
        this.addModalToggle()
        // scenarios = await this.props.mongo.getCollection("scenarios")
        // scenarios = await scenarios.find().toArray()
        await this.cleanUpDepartments()
        await this.getScenarios()
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
                                    <h1>Scenario Management</h1>
                                    <Button
                                        className="btn-round"
                                        color="primary"
                                        data-target="#addScenarioModal"
                                        data-toggle="modal"
                                        onClick={this.addModalToggle}
                                        disabled={this.state.loading}
                                    >
                                        <i className="nc-icon nc-lock-circle-open" />
                                        Add Scenario
                                    </Button>
                                    <Modal
                                        className="modal-login"
                                        modalClassName="modal-secondary"
                                        isOpen={this.state.addScenarioModal}
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
                                                                "input-group-focus": this.state.scenarioNameFocus
                                                            })}
                                                        >
                                                            
                                                            <Input

                                                                placeholder="Scenario Name"
                                                                type="text"
                                                                onFocus={e => this.setState({ scenarioNameFocus: true })}
                                                                onBlur={e => this.setState({ scenarioNameFocus: false })}
                                                                onChange={e => this.setState({ newScenarioName: e.target.value })}
                                                            />
                                                            
                                                        </InputGroup>
                                                        <InputGroup
                                                            className={classnames("no-border form-control-lg", {
                                                                "input-group-focus": this.state.scenarioTypeFocus
                                                            })}
                                                        >
                                                            
                                                            <Input 
                                                                placeholder="Scenario Type"
                                                                type="text"
                                                                onFocus={e => this.setState({ scenarioTypeFocus: true })}
                                                                onBlur={e => this.setState({ scenarioTypeFocus: false })}
                                                                onChange={e => this.setState({ newScenarioType: e.target.value })}
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
                                                    onClick={this.addScenario}
                                                    size="lg"
                                                    disabled={
                                                        this.state.loading ||
                                                        this.state.newScenarioName.length === 0
                                                    }
                                                >
                                                    Create Scenario
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
                                    {this.state.scenarios.map((s, i) => {
                                        if (s.label === "None") {
                                            return null
                                        }
                                        return (
                                            <div key={s.value}>

                                                <Card className="card-plain justify-content-center" role="tab">
                                                    <hr />
                                                    <Row>

                                                        <Col lg="6">

                                                            <p><strong>Name: </strong>{s.label}</p>
                                                            <p><strong>Type: </strong>{s.type}</p>
                                                        </Col>
                                                        <Col lg="6">
                                                            <Button className="btn btn-round" color="primary" disabled={this.state.loading} onClick={(e) => this.editModalToggle(s)}>
                                                                <i className="tim-icons icon-pencil" />

                                                            </Button>
                                                            
                                                        </Col></Row>
                                                    {/* <Button className="btn btn-round" color="primary" disabled={this.state.loading} onClick={() => this.editModalToggle(s)}>
                                                        <i className="tim-icons icon-pencil" />

                                                    </Button> */}


                                                    <Modal isOpen={this.state.editScenarioModal} toggle={(e) => this.editModalToggle(s || {value:"", label: "" })}>
                                                        <div className="modal-header">
                                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={(e) => this.editModalToggle({ value: "", label: "" })}>
                                                                <i className="tim-icons icon-simple-remove"></i>
                                                            </button>
                                                            <h4 className="modal-title">Update Scenario</h4>
                                                        </div>
                                                        <ModalBody >
                                                            <Form action="" className="form" method="">
                                                                <div className="card-content">
                                                                    <Label >
                                                                        Scenario Name:
                                                                    </Label>
                                                                    <Input placeholder="Edit scenario" type="text" value={this.state.editScenarioName} onChange={(e) => { this.setState({ editScenarioName: e.target.value }) }}></Input>
                                                                    <Input placeholder= "Scenario Type" type="text" value={this.state.editScenarioType} onChange={(e)=>{this.setState({editScenarioType: e.target.value})}}></Input>
                                                                </div>
                                                            </Form>
                                                        </ModalBody>
                                                        <ModalFooter>
                                                            
                                                            <Button color="secondary" onClick={(e) => this.editModalToggle({value:"", label: "" })}>
                                                                Close
                                                                    </Button>
                                                            <Button color="primary" onClick={this.editScenario} disabled={
                                                                this.state.loading ||
                                                                this.state.editScenarioName.length == 0 ||
                                                                this.state.editScenarioType.length == 0
                                                            }>
                                                             Save changes
                                                                    </Button>
                                                                    <Button className="btn btn-round" color="danger" disabled={this.state.loading} onClick={async (e) => {
                                                                        this.setState({loading: true})
                                                                    //    let scenarios =  await this.props.mongo.getCollection("scenarios");
                                                                    //    await scenarios.findOneAndDelete({_id: this.state.editScenarioValue})
                                                                        await this.props.mongo.findOneAndDelete("scenarios", {_id: this.state.editScenarioValue})
                                                                       await this.editModalToggle({label: "", value: "", type: ""})
                                                                       await this.cleanUpDepartments()
                                                                       await this.getScenarios()
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

export default Scenarios;