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
    // Select
    // UncontrolledTooltip
} from "reactstrap";
import Select from 'react-select'
import classnames from "classnames";

class Dealerships extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modalDemo: false,
            agents: [],
            openedCollapses: [],
            addDealershipModal: false,
            editDealershipModal: false,
            newDealershipName: "",
            newAddress: "",
            newRingCentral: "",
            newContacts: [],
            loading: false,
            err: {
                message: ""
            },
            editDealershipName: "",
            editDealershipAddress: "",
            editContacts: [],
            dealerships: [],
            editDealershipValue: "",
            editDealershipTextFrom: "",
            addContact:"",
            removeContact:""
        }
        this.editDealership = this.editDealership.bind(this)
        this.addContactToDealer = this.addContactToDealer.bind(this)
    }
    addModalToggle = () => {
        this.setState({ addDealershipModal: !this.state.addDealershipModal })
    }
    getDealerships = async () => {
        this.setState({ loading: true })
        // let d = await this.props.mongo.getCollection("dealerships")
        // d = await d.find().toArray()
        let d = await this.props.mongo.find("dealerships")
        d.sort((a, b) => {
            if (a.label < b.label) return -1
            if (a.label > b.label) return 1
            return 0
        })
        await this.setState({ dealerships: d, loading: false})
    }
    async addContactToDealer(contact, dealer){
        this.setState({loading: true})
        // let d = await this.props.mongo.getCollection("dealerships")
        // let ref = await d.findOne({_id: dealer._id})
        let ref = await this.props.mongo.findOne("dealerships", {_id: dealer._id})
        if(ref.contacts.includes(contact)){
            await this.setState({loading:false, addContact:""})
            return;
        }
        ref.contacts.push(contact)
        // await d.findOneAndUpdate({_id: dealer._id}, ref)
        await this.props.mongo.findOneAndUpdate("dealerships", {_id: dealer._id}, ref)
        await this.setState({editDealershipAddress: ref.address, editContacts: ref.contacts,
        editDealershipName: ref.label, addContact: "", editDealershipTextFrom: ref.textFrom, loading: false})
        await this.getDealerships()
        this.setState({loading: false})
    }
    async removeContactFromDealer(contact, dealer){
        this.setState({loading: true})
        let copy = dealer
        copy.contacts = copy.contacts.filter((c)=>{
            return c != contact
        })
        // let dealers = await this.props.mongo.getCollection("dealerships")
        // await dealers.findOneAndUpdate({_id: dealer._id}, copy)
        await this.props.mongo.findOneAndUpdate("dealerships", {_id: dealer._id}, copy)
        await this.getDealerships()
        this.setState({loading: false, removeContact: "", editContacts: copy.contacts})
    }
    editModalToggle = (a) => {
        this.setState({
            editID: a._id,
            editDealershipName: a.label,
            editDealershipAddress: a.address,
            editDealershipValue: a.value,
            editContacts: a.contacts,
            editDealershipTextFrom: ""
            //contax
        })
        this.setState({ editDealershipModal: !this.state.editDealershipModal })
        // console.log(this.state.editDealershipModal)
    }
    async componentWillMount() {
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
        // let agent = await agents.findOne({userId: })
        // document.body.classList.toggle("white-content");
        await this.getDealerships()
        await this.getDealerships()


    }
    async componentWillUnmount() {
        // document.body.classList.toggle("white-content");
    }
    async getAgents() {
        this.setState({ loading: true })
        // let agents = await this.props.mongo.getCollection("agents")
        // agents = await agents.find().toArray()
        let agents = await this.props.mongo.find("agents")
        await this.setState({ agents, loading: false })

    }
    async handleRemove(dealership) {
        this.setState({ loading: true })
        // let dealerships = await this.props.mongo.getCollection("dealerships")
        // dealerships = dealerships.findOneAndDelete(dealership)
        await this.props.mongo.findOneAndDelete("dealerships", dealership)
    }
    async removeDealership(a){
        this.setState({loading:true})
        // let x = await this.props.mongo.getCollection("dealerships")
        // let found = await x.findOneAndDelete({_id: a._id})
        await this.props.mongo.findOneAndDelete("dealerships", {_id: a._id})
        await this.editModalToggle({ label: "", value: "", address: "", contacts: [] })
        await this.getDealerships()
        this.setState({loading:false})
    }
    async editDealership(a) {
        
        this.setState({ loading: true })
        // let x = await this.props.mongo.getCollection("dealerships")
        // let currCopy = await x.findOne({ _id: a._id })
        let currCopy = await this.props.mongo.findOne("dealerships", {_id: a._id})
        let merge = {
            label: this.state.editDealershipName,
            address: this.state.editDealershipAddress,
            contacts: this.state.editContacts,
            textFrom: this.state.editDealershipTextFrom
        }
        
        currCopy = Object.assign(currCopy, merge)
        // x = await x.findOneAndUpdate({ _id: a._id }, currCopy)
        await this.props.mongo.findOneAndUpdate("dealerships", {_id: a._id}, currCopy)
        await this.editModalToggle({ label: "", value: "", address: "", contacts: [] })
        await this.getDealerships()
        // await this.getDealerships()

        this.setState({ loading: false, openedCollapses: [] })
        
    }
    collapseToggle = async (collapse, a) => {
        
        let openedCollapses = this.state.openedCollapses
        if (openedCollapses.includes(collapse)) {
            this.setState({
                openedCollapses: [],
                editDealershipName:"",
                editDealershipAddress: "",
                editDealershipTextFrom: ""
            })
        }
        else {
            
            this.setState({ openedCollapses: [collapse] ,
            editDealershipName: a.label,
            editDealershipAddress: a.address,
            editDealershipTextFrom: a.textFrom,
            editContacts: a.contacts
         })

        }
    }
    registerDealership = async () => {
        this.setState({ loading: true, err: { message: "" } })
        // let { db } = this.props.mongo;
        let pass = true;
        // let id = await db.collection("dealerships").insertOne({
        //     label: this.state.newDealershipName,
        //     address: this.state.newAddress,
        //     contacts: this.state.newContacts,
        //     textFrom: this.state.newRingCentral
        // })
        let id = await this.props.mongo.insertOne("dealerships", {
            label: this.state.newDealershipName,
            address: this.state.newAddress,
            contacts: this.state.newContacts,
            textFrom: this.state.newRingCentral
        })
        // await db.collection("dealerships").findOneAndUpdate({ _id: id.insertedId }, {
        //     label: this.state.newDealershipName,
        //     address: this.state.newAddress,
        //     value: id.insertedId,
        //     contacts: this.state.newContacts,
        //     textFrom: this.state.newRingCentral
        // })
        await this.props.mongo.findOneAndUpdate("dealerships", {_id: id.insertedId}, {
            label: this.state.newDealershipName,
            address: this.state.newAddress,
            value: id.insertedId,
            contacts: this.state.newContacts,
            textFrom: this.state.newRingCentral
        })

        await this.getDealerships()
        this.addModalToggle()
        // this.props.history.push("/admin/dashboard")}
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
                                    <h1>Dealership Management</h1>
                                    <Button
                                        className="btn-round"
                                        color="primary"
                                        data-target="#addDealershipModal"
                                        data-toggle="modal"
                                        onClick={this.addModalToggle}
                                        disabled={this.state.loading}
                                    >
                                        <i className="nc-icon nc-lock-circle-open" />
                                        Add Dealership
                                    </Button>
                                    <Modal
                                        className="modal-login"
                                        modalClassName="modal-primary"
                                        isOpen={this.state.addDealershipModal}
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
                                                                "input-group-focus": this.state.dealershipNameFocus
                                                            })}
                                                        >
                                                            <InputGroupAddon addonType="prepend">
                                                                <InputGroupText>
                                                                    <i className="tim-icons icon-single-02" />
                                                                </InputGroupText>
                                                            </InputGroupAddon>
                                                            <Input

                                                                placeholder="Dealership Name"
                                                                type="text"
                                                                onFocus={e => this.setState({ fullNameFocus: true })}
                                                                onBlur={e => this.setState({ fullNameFocus: false })}
                                                                onChange={e => this.setState({ newDealershipName: e.target.value })}
                                                            />
                                                        </InputGroup>
                                                        <InputGroup
                                                            className={classnames("no-border form-control-lg", {
                                                                "input-group-focus": this.state.addressFocus
                                                            })}
                                                        >
                                                            <InputGroupAddon addonType="prepend">
                                                                <InputGroupText>
                                                                    <i className="tim-icons icon-map-big" />
                                                                </InputGroupText>
                                                            </InputGroupAddon>
                                                            <Input
                                                                placeholder="Address"
                                                                type="tel"
                                                                onFocus={e => this.setState({ phoneFocus: true })}
                                                                onBlur={e => this.setState({ phoneFocus: false })}
                                                                onChange={e => this.setState({ newAddress: e.target.value })}
                                                            />
                                                        </InputGroup><hr/>
                                                        <InputGroup
                                                            className={classnames("no-border form-control-lg", {
                                                                "input-group-focus": this.state.ringCentralFocus
                                                            })}
                                                        >
                                                            <InputGroupAddon addonType="prepend">
                                                                <InputGroupText>
                                                                    <i className="tim-icons icon-mobile" />
                                                                </InputGroupText>
                                                            </InputGroupAddon>
                                                            <Input
                                                                placeholder="Ring Central #"
                                                                type="tel"
                                                                onFocus={e => this.setState({ ringCentralFocus: true })}
                                                                onBlur={e => this.setState({ ringCentralFocus: false })}
                                                                onChange={e => this.setState({ newRingCentral: e.target.value })}
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
                                                    onClick={this.registerDealership}
                                                    size="lg"
                                                    disabled={
                                                        this.state.loading ||
                                                        this.state.newDealershipName.length === 0 ||
                                                        this.state.newAddress.length == 0 || 
                                                        this.state.newRingCentral.length != 10 ||
                                                        isNaN(this.state.newRingCentral)


                                                    }
                                                >
                                                    Create Dealership
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
                                    {this.state.dealerships.map((a, i) => {

                                        return (
                                            <div key={a._id}>

                                                <hr />
                                                <Card className="card-plain">

                                                    <CardHeader role="tab">
                                                        <a
                                                            aria-expanded={this.state.openedCollapses.includes(a._id)}
                                                            href="#pablo"
                                                            data-parent="#accordion"
                                                            data-toggle="collapse"
                                                            onClick={(e) => { e.preventDefault(); this.collapseToggle(a._id, a) }}
                                                        >
                                                            <p><strong>Name:</strong> {a.label}</p>
                                                            <p><strong>Address: </strong>{a.address}</p>
                                                            <p><strong>Ringcentral number: </strong>{a.textFrom}</p>
                                                            <i className="tim-icons icon-minimal-down" />

                                                        </a>
                                                    </CardHeader>
                                                    <Collapse
                                                        role="tabpanel"
                                                        isOpen={this.state.openedCollapses.includes(a._id)}>
                                                        <CardBody>
                                                            <Col lg="6">
                                                                <Card color="secondary card">
                                                                <p><strong>Ring Central #:</strong> {a.textFrom}</p>
                                                                <hr/>
                                                                <p><strong>Name:</strong> {a.label}</p>
                                                                <p><strong>Address: </strong>{a.address}</p>
                                                                <p><strong>Contacts: </strong></p>
                                                                
                                                                
                                                                {a.contacts.map((c)=>{
                                                                    return <p key={c}>{c}</p>
                                                                })}
                                                                </Card>
                                                                <br/>
                                                            </Col>
                                                            <Col lg="6">
                                                                
                                                            <Form>
                                                            <h3>Edit Dealership</h3>
                                                            <Input placeholder="Edit Dealership Name" value={this.state.editDealershipName} onChange={(e)=>{this.setState({editDealershipName:e.target.value})}}/>
                                                            <Input placeholder="Edit Dealership Address" value={this.state.editDealershipAddress} onChange={(e)=>{this.setState({editDealershipAddress:e.target.value})}}/>
                                                            <Input placeholder="Edit Ring Central #" value={this.state.editDealershipTextFrom} onChange={(e)=>{this.setState({editDealershipTextFrom:e.target.value})}}/>
                                                            <hr/>
                                                            <h3>Add to Contacts</h3>
                                                            <Input placeholder="Add Contact to Dealership" value={this.state.addContact} onChange={(e)=>{this.setState({addContact:e.target.value})}}/>
                                                            <Button disabled={this.state.loading ||this.state.addContact.length != 10 || isNaN(this.state.addContact)} onClick={(e)=>this.addContactToDealer(this.state.addContact, a)}>Add Contact</Button>
                                                            <hr/>
                                                            <h3>Remove from Contacts</h3>
                                                            <Input placeholder="Remove Contact from Dealership" value={this.state.removeContact} onChange={(e)=>{this.setState({removeContact:e.target.value})}}/>
                                                            <Button disabled={this.state.loading ||this.state.removeContact.length != 10 || isNaN(this.state.removeContact)} onClick={(e)=>this.removeContactFromDealer(this.state.removeContact, a)}>Remove Contact</Button>
                                                            <hr/>
                                                            <Button onClick={(e)=>this.editDealership(a)}>
                                                                Save Changes
                                                            </Button>
                                                            <Button color="danger" onClick={(e)=>this.removeDealership(a)}>
                                                                Delete Dealership
                                                            </Button>
                                                            </Form>

                                                            </Col>
                                                            
                                                            



                                                            
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

export default Dealerships;