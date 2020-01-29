import React from "react";
// reactstrap components
import {
    Button,
    Label,
    Card,
    CardImg,
    Container,
    CardBody,
    CardTitle,
    Row,
    Col,
    Table,
    Progress,
    Modal,
    ModalHeader,
    ModalBody,
    Input,
    FormGroup,
    Form,
    CardHeader,
    ModalFooter
} from "reactstrap";
import Select from 'react-select'
import ReactDateTime from "react-datetime";
class DealershipProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            agent: {},
            dealerships: [],
            selected_dealership: { label: "", value: "" },
            salesHoursModal: false,
            serviceHoursModal: false,
            addContactModal: false,
            editContactModal: false,
            editSalesHours: [
                {
                    day: "Monday",
                    open: new Date(new Date().setHours(8, 0, 0, 0)),
                    close: new Date(new Date().setHours(21, 0, 0, 0)),
                    isClosed: false
                },
                {
                    day: "Tuesday",
                    open: new Date(new Date().setHours(8, 0, 0, 0)),
                    close: new Date(new Date().setHours(21, 0, 0, 0)),
                    isClosed: false
                },
                {
                    day: "Wednesday",
                    open: new Date(new Date().setHours(8, 0, 0, 0)),
                    close: new Date(new Date().setHours(21, 0, 0, 0)),
                    isClosed: false
                },
                {
                    day: "Thursday",
                    open: new Date(new Date().setHours(8, 0, 0, 0)),
                    close: new Date(new Date().setHours(21, 0, 0, 0)),
                    isClosed: false
                },
                {
                    day: "Friday",
                    open: new Date(new Date().setHours(8, 0, 0, 0)),
                    close: new Date(new Date().setHours(21, 0, 0, 0)),
                    isClosed: false
                },
                {
                    day: "Saturday",
                    open: new Date(new Date().setHours(8, 0, 0, 0)),
                    close: new Date(new Date().setHours(21, 0, 0, 0)),
                    isClosed: false
                },
                {
                    day: "Sunday",
                    open: new Date(new Date().setHours(8, 0, 0, 0)),
                    close: new Date(new Date().setHours(21, 0, 0, 0)),
                    isClosed: false
                },
            ],
            editServiceHours: [
                {
                    day: "Monday",
                    open: new Date(new Date().setHours(8, 0, 0, 0)),
                    close: new Date(new Date().setHours(21, 0, 0, 0)),
                    isClosed: false
                },
                {
                    day: "Tuesday",
                    open: new Date(new Date().setHours(8, 0, 0, 0)),
                    close: new Date(new Date().setHours(21, 0, 0, 0)),
                    isClosed: false
                },
                {
                    day: "Wednesday",
                    open: new Date(new Date().setHours(8, 0, 0, 0)),
                    close: new Date(new Date().setHours(21, 0, 0, 0)),
                    isClosed: false
                },
                {
                    day: "Thursday",
                    open: new Date(new Date().setHours(8, 0, 0, 0)),
                    close: new Date(new Date().setHours(21, 0, 0, 0)),
                    isClosed: false
                },
                {
                    day: "Friday",
                    open: new Date(new Date().setHours(8, 0, 0, 0)),
                    close: new Date(new Date().setHours(21, 0, 0, 0)),
                    isClosed: false
                },
                {
                    day: "Saturday",
                    open: new Date(new Date().setHours(8, 0, 0, 0)),
                    close: new Date(new Date().setHours(21, 0, 0, 0)),
                    isClosed: false
                },
                {
                    day: "Sunday",
                    open: new Date(new Date().setHours(8, 0, 0, 0)),
                    close: new Date(new Date().setHours(21, 0, 0, 0)),
                    isClosed: false
                },
            ],
            salesValid: [
                true,
                true,
                true,
                true,
                true,
                true,
                true
            ],
            serviceValid: [
                true,
                true,
                true,
                true,
                true,
                true,
                true
            ],
            salesModalError: false,
            serviceModalError: false,
            newContact: {
                name: "",
                title: "",
                phone: "",
                email: ""
            },
            editContact: {
                name: "",
                title: "",
                phone: "",
                email: ""
            },
            editContact2: {
                name: "",
                title: "",
                phone: "",
                email: ""
            }
        }
        this._isMounted = false;
        this.toggle = this.toggle.bind(this)
    }
    async componentWillMount() {
        this._isMounted = true
        this.setState({ loading: true })
        let user = this._isMounted && await this.props.mongo.getActiveUser(this.props.mongo.mongodb);
        let agent = this._isMounted && await this.props.mongo.findOne("dealership_users", { userId: user.userId });
        let dealerships = this._isMounted && await this.props.mongo.find("dealerships");
        dealerships = this._isMounted && dealerships.filter((a) => {
            return a.isActive === true
        })
        this._isMounted && dealerships.sort((a, b) => {
            if (a.label > b.label) return 1;
            if (a.label < b.label) return -1;
            return 0;
        })
        let agent_group = this._isMounted && await this.props.mongo.findOne("dealerships", { value: agent.dealership });
        agent_group = agent_group.group;
        dealerships = this._isMounted && dealerships.filter((d) => {
            if (agent.access === "store") {
                return d.value === agent.dealership
            }
            if (agent.access === "group") {
                return d.group === agent_group
            }
            return true;
        })
        if (agent.access == "store") {
            this.setState({ selected_dealership: dealerships[0] })
        }
        this._isMounted && this.setState({ agent, dealerships })


        this.setState({ loading: false })
    }
    componentDidMount() {
        this._isMounted = true
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    async toggle(modal_name) {
        let dlr = this._isMounted && await this.props.mongo.findOne("dealerships", { value: this.state.selected_dealership.value })
        let defaultHrs = [
            {
                day: "Monday",
                open: new Date(new Date().setHours(8, 0, 0, 0)),
                close: new Date(new Date().setHours(21, 0, 0, 0)),
                isClosed: false
            },
            {
                day: "Tuesday",
                open: new Date(new Date().setHours(8, 0, 0, 0)),
                close: new Date(new Date().setHours(21, 0, 0, 0)),
                isClosed: false
            },
            {
                day: "Wednesday",
                open: new Date(new Date().setHours(8, 0, 0, 0)),
                close: new Date(new Date().setHours(21, 0, 0, 0)),
                isClosed: false
            },
            {
                day: "Thursday",
                open: new Date(new Date().setHours(8, 0, 0, 0)),
                close: new Date(new Date().setHours(21, 0, 0, 0)),
                isClosed: false
            },
            {
                day: "Friday",
                open: new Date(new Date().setHours(8, 0, 0, 0)),
                close: new Date(new Date().setHours(21, 0, 0, 0)),
                isClosed: false
            },
            {
                day: "Saturday",
                open: new Date(new Date().setHours(8, 0, 0, 0)),
                close: new Date(new Date().setHours(21, 0, 0, 0)),
                isClosed: false
            },
            {
                day: "Sunday",
                open: new Date(new Date().setHours(8, 0, 0, 0)),
                close: new Date(new Date().setHours(21, 0, 0, 0)),
                isClosed: false
            },
        ];
        this.setState({
            selected_dealership: dlr,
            editSalesHours: dlr.salesHours || defaultHrs,
            editServiceHours: dlr.serviceHours || defaultHrs,
            salesValid: [true, true, true, true, true, true, true],
            serviceValid: [true, true, true, true, true, true, true],
            newContact: { name: "", title: "", phone: "", email: "" }
        })
        this.setState({ [modal_name]: !this.state[modal_name] })
    }
    validHours(open, close, isClosed) {
        let valid = false;
        if (new Date(open).getTime() !== new Date(open).getTime()) return false
        if (new Date(close).getTime() !== new Date(close).getTime()) return false;
        if (isClosed === true) {
            return true;
        }
        let start = new Date(open);
        start = new Date(new Date().setHours(start.getHours(), start.getMinutes(), 0, 0))

        let finish = new Date(close);
        finish = new Date(new Date().setHours(finish.getHours(), finish.getMinutes(), 0, 0));

        return finish.getTime() > start.getTime();


    }
    render() {
        if (this.state.loading) {
            return (
                <>
                    <div className="content">
                        <Container>
                            <Col className="ml-auto mr-auto text-center" lg="6">
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
                        <Col className="ml-auto mr-auto" lg="8">
                            <Form>
                                <FormGroup>
                                    <Label>Select Dealership</Label>
                                    <Select
                                        options={this.state.dealerships}
                                        value={this.state.selected_dealership}
                                        onChange={(e) => { this.setState({ selected_dealership: e }) }}
                                    />
                                </FormGroup>
                            </Form>

                        </Col>
                    </Row>
                    <Row hidden={this.state.selected_dealership.label.length < 1}>
                        <Col className="ml-auto mr-auto" lg="12">
                            <Card className="card-raised card-white text-center" color="primary">
                                <CardHeader>
                                    <CardTitle>
                                        <h2 style={{ color: "white" }}>Basic Info</h2>
                                        <hr style={{ border: "solid 1px white" }} />
                                    </CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col lg="4">


                                            <Label for="name" style={{ color: "white" }}>Name:</Label>
                                            <h3 id="name" style={{ color: "white" }}><strong>{this.state.selected_dealership.label}</strong></h3>



                                            <Label for="address" style={{ color: "white" }}>Address:</Label>
                                            <h3 id="address" style={{ color: "white" }}><strong>{this.state.selected_dealership.address}</strong></h3>

                                            <Label for="phone" style={{ color: "white" }}>Phone:</Label>
                                            <h3 id="phone" style={{ color: "white" }}><strong>{this.state.selected_dealership.phone == undefined ? "" : `(${this.state.selected_dealership.phone.substring(0, 3)}) ${this.state.selected_dealership.phone.substring(3, 6)}-${this.state.selected_dealership.phone.substring(6, 10)}`}</strong></h3>

                                        </Col>
                                        <Col lg="4">
                                            <h4 style={{ color: "white" }}>Business Hours: <strong>SALES</strong></h4>
                                            <Table style={{ borderTop: "white" }}>
                                                <thead className="text-center">
                                                    <tr>
                                                        <th style={{ borderBottom: "solid 0.5px white" }}><p style={{ color: "white" }}>Day</p></th>
                                                        <th style={{ borderBottom: "solid 0.5px white" }}><p style={{ color: "white" }}>Hours</p></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-center">
                                                    {this.state.selected_dealership.salesHours !== undefined ? this.state.selected_dealership.salesHours.map((h, i) => {
                                                        return (
                                                            <tr key={i}>
                                                                <td style={{ borderBottom: "solid 0.5px white" }}><p style={{ color: "white" }}>{h.day}</p></td>
                                                                <td style={{ borderBottom: "solid 0.5px white" }}><p style={{ color: "white" }}>{h.isClosed === true ? "Closed" : `${new Date(h.open).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} - ${new Date(h.close).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`}</p></td>
                                                            </tr>
                                                        );
                                                    }) : null}
                                                </tbody>
                                            </Table>
                                            <Button color="default" onClick={() => {
                                                this.toggle("salesHoursModal")
                                            }}>Edit Sales Hours</Button>
                                            <Modal isOpen={this.state.salesHoursModal} toggle={() => this.toggle("salesHoursModal")}>
                                                <ModalHeader toggle={() => this.toggle("salesHoursModal")}>Edit Sales Hours</ModalHeader>
                                                <ModalBody>
                                                    <Form>
                                                        {this.state.editSalesHours.map((h, i) => {
                                                            return (
                                                                <div key={i}>
                                                                    <FormGroup >
                                                                        <Label><strong>{h.day}</strong></Label>
                                                                        <p>Open</p>
                                                                        <ReactDateTime
                                                                            inputProps={{ disabled: h.isClosed }}
                                                                            value={new Date(h.open).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                                                                            dateFormat={false}
                                                                            timeConstraints={{ minutes: { step: 15 } }}
                                                                            onChange={(e) => {

                                                                                let newOpen = new Date(e)
                                                                                let newArray = this.state.editSalesHours
                                                                                newArray[i] = {
                                                                                    day: h.day,
                                                                                    open: newOpen,
                                                                                    close: h.close,
                                                                                    isClosed: h.isClosed
                                                                                }
                                                                                if (!this.validHours(newOpen, h.close, h.isClosed)) {
                                                                                    let newArr = this.state.salesValid;
                                                                                    newArr[i] = false;
                                                                                    this.setState({ salesValid: newArr })
                                                                                }
                                                                                else {
                                                                                    let newArr = this.state.salesValid;
                                                                                    newArr[i] = true;
                                                                                    this.setState({ salesValid: newArr })
                                                                                }
                                                                                this.setState({ editSalesHours: newArray })
                                                                            }}
                                                                        />
                                                                    </FormGroup>
                                                                    <FormGroup>
                                                                        <p>Close</p>
                                                                        <ReactDateTime
                                                                            inputProps={{ disabled: h.isClosed }}
                                                                            value={new Date(h.close).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                                                                            dateFormat={false}
                                                                            timeConstraints={{ minutes: { step: 15 } }}
                                                                            onChange={(e) => {
                                                                                let newClose = new Date(e)
                                                                                let newArray = this.state.editSalesHours
                                                                                newArray[i] = {
                                                                                    day: h.day,
                                                                                    open: h.open,
                                                                                    close: newClose,
                                                                                    isClosed: h.isClosed
                                                                                }
                                                                                if (!this.validHours(h.open, newClose, h.isClosed)) {
                                                                                    let newArr = this.state.salesValid;
                                                                                    newArr[i] = false;
                                                                                    this.setState({ salesValid: newArr })
                                                                                }
                                                                                else {
                                                                                    let newArr = this.state.salesValid;
                                                                                    newArr[i] = true;
                                                                                    this.setState({ salesValid: newArr })
                                                                                }
                                                                                this.setState({ editSalesHours: newArray })
                                                                            }}
                                                                        />
                                                                    </FormGroup>
                                                                    <FormGroup>
                                                                        <Label check style={{ padding: "20px" }}>

                                                                            <Input type="checkbox" value={h.isClosed} checked={h.isClosed} onChange={(e) => {
                                                                                let newIsClosed = !h.isClosed;
                                                                                let newArray = this.state.editSalesHours
                                                                                newArray[i] = {
                                                                                    day: h.day,
                                                                                    open: h.open,
                                                                                    close: h.close,
                                                                                    isClosed: newIsClosed
                                                                                }
                                                                                if (this.validHours(h.open, h.close, newIsClosed)) {
                                                                                    let newVal = this.state.salesValid
                                                                                    newVal[i] = true;
                                                                                    this.setState({ salesValid: newVal })
                                                                                }
                                                                                else {
                                                                                    let newVal = this.state.salesValid
                                                                                    newVal[i] = false;
                                                                                    this.setState({ salesValid: newVal })
                                                                                }
                                                                                this.setState({ editSalesHours: newArray })
                                                                            }} />{' '}
                                                                            <strong>Closed</strong></Label>
                                                                            <Label check style={{ padding: "20px" }}>

                                                                            <Input type="checkbox" value={new Date(h.open).getHours() === 0 &&
                                                                                new Date(h.open).getMinutes() === 0 &&
                                                                                new Date(h.close).getHours() === 23 &&
                                                                                new Date(h.close).getMinutes() === 59} checked={
                                                                                    new Date(h.open).getHours() === 0 &&
                                                                                    new Date(h.open).getMinutes() === 0 &&
                                                                                    new Date(h.close).getHours() === 23 &&
                                                                                    new Date(h.close).getMinutes() === 59
                                                                                } onChange={(e) => {
                                                                                    if (new Date(h.open).getMinutes() === 0 &&
                                                                                        new Date(h.close).getHours() === 23 &&
                                                                                        new Date(h.close).getMinutes() === 59) {
                                                                                        let newArray = this.state.editSalesHours
                                                                                        newArray[i] = {
                                                                                            day: h.day,
                                                                                            open: new Date(new Date().setHours(8, 0, 0, 0)),
                                                                                            close: new Date(new Date().setHours(21, 0, 0, 0)),
                                                                                            isClosed: h.isClosed
                                                                                        }

                                                                                        this.setState({ editSalesHours: newArray })
                                                                                    }
                                                                                    else {
                                                                                        let newArray = this.state.editSalesHours
                                                                                        newArray[i] = {
                                                                                            day: h.day,
                                                                                            open: new Date(new Date().setHours(0, 0, 0, 0)),
                                                                                            close: new Date(new Date().setHours(23, 59, 59, 999)),
                                                                                            isClosed: h.isClosed
                                                                                        }

                                                                                        this.setState({ editSalesHours: newArray })
                                                                                    }

                                                                                }} />{' '}
                                                                            <strong>24 Hrs</strong></Label>
                                                                    </FormGroup>
                                                                    <p style={{ color: "red" }} hidden={this.state.salesValid[i]} className="text-center"><strong>Error: Hours for {h.day} are invalid.</strong></p>
                                                                    <hr />
                                                                </div>
                                                            );

                                                        })}
                                                        <Button
                                                            disabled={this.state.salesValid.indexOf(false) !== -1}
                                                            onClick={async () => {
                                                                let update = this.state.selected_dealership
                                                                update.salesHours = this.state.editSalesHours

                                                                this._isMounted && await this.props.mongo.findOneAndUpdate("dealerships", { value: this.state.selected_dealership.value }, { salesHours: this.state.editSalesHours })
                                                                let dlr = this._isMounted && await this.props.mongo.findOne("dealerships", { value: this.state.selected_dealership.value });
                                                                let dealerships = this._isMounted && await this.props.mongo.find("dealerships");
                                                                dealerships = this._isMounted && dealerships.filter((a) => {
                                                                    return a.isActive === true
                                                                })
                                                                this._isMounted && dealerships.sort((a, b) => {
                                                                    if (a.label > b.label) return 1;
                                                                    if (a.label < b.label) return -1;
                                                                    return 0;
                                                                })
                                                                let agent_group = this._isMounted && await this.props.mongo.findOne("dealerships", { value: this.state.agent.dealership });
                                                                agent_group = agent_group.group;
                                                                dealerships = this._isMounted && dealerships.filter((d) => {
                                                                    if (this.state.agent.access === "store") {
                                                                        return d.value === this.state.agent.dealership
                                                                    }
                                                                    if (this.state.agent.access === "group") {
                                                                        return d.group === agent_group
                                                                    }
                                                                    return true;
                                                                })
                                                                if (this.state.agent.access == "store") {
                                                                    this.setState({ selected_dealership: dealerships[0] })
                                                                }

                                                                this.setState({ selected_dealership: dlr, dealerships })
                                                                this.toggle("salesHoursModal")
                                                            }}>Save Changes</Button>
                                                    </Form>
                                                </ModalBody>
                                            </Modal>
                                        </Col>
                                        <Col lg="4">
                                            <h4 style={{ color: "white" }}>Business Hours: <strong>SERVICE</strong></h4>
                                            <Table style={{ borderTop: "white" }}>
                                                <thead className="text-center">
                                                    <tr>
                                                        <th style={{ borderBottom: "solid 0.5px white" }}><p style={{ color: "white" }}>Day</p></th>
                                                        <th style={{ borderBottom: "solid 0.5px white" }}><p style={{ color: "white" }}>Hours</p></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-center">
                                                    {this.state.selected_dealership.serviceHours !== undefined ? this.state.selected_dealership.serviceHours.map((h, i) => {
                                                        return (
                                                            <tr key={i}>
                                                                <td style={{ borderBottom: "solid 0.5px white" }}><p style={{ color: "white" }}>{h.day}</p></td>
                                                                <td style={{ borderBottom: "solid 0.5px white" }}><p style={{ color: "white" }}>{h.isClosed === true ? "Closed" : `${new Date(h.open).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} - ${new Date(h.close).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`}</p></td>
                                                            </tr>
                                                        );
                                                    }) : null}
                                                </tbody>
                                            </Table>
                                            <Button color="default" onClick={() => { this.toggle("serviceHoursModal") }}>Edit Service Hours</Button>
                                            <Modal isOpen={this.state.serviceHoursModal} toggle={() => this.toggle("serviceHoursModal")}>
                                                <ModalHeader toggle={() => this.toggle("serviceHoursModal")}>Edit Service Hours</ModalHeader>
                                                <ModalBody>
                                                    <Form>
                                                        {this.state.editServiceHours.map((h, i) => {
                                                            return (
                                                                <div key={i}>
                                                                    <FormGroup key={i}>
                                                                        <Label><strong>{h.day}</strong></Label>
                                                                        <p>Open</p>
                                                                        <ReactDateTime
                                                                            inputProps={{ disabled: h.isClosed }}
                                                                            value={new Date(h.open).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                                                                            dateFormat={false}
                                                                            timeConstraints={{ minutes: { step: 15 } }}
                                                                            onChange={(e) => {
                                                                                let newOpen = new Date(e)
                                                                                let newArray = this.state.editServiceHours
                                                                                newArray[i] = {
                                                                                    day: h.day,
                                                                                    open: newOpen,
                                                                                    close: h.close,
                                                                                    isClosed: h.isClosed
                                                                                }
                                                                                if (!this.validHours(newOpen, h.close, h.isClosed)) {
                                                                                    let newArr = this.state.serviceValid;
                                                                                    newArr[i] = false;
                                                                                    this.setState({ serviceValid: newArr })
                                                                                }
                                                                                else {
                                                                                    let newArr = this.state.serviceValid;
                                                                                    newArr[i] = true;
                                                                                    this.setState({ serviceValid: newArr })
                                                                                }
                                                                                this.setState({ editServiceHours: newArray })
                                                                            }}
                                                                        />
                                                                        <p>Close</p>
                                                                        <ReactDateTime
                                                                            inputProps={{ disabled: h.isClosed }}
                                                                            value={new Date(h.close).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                                                                            dateFormat={false}
                                                                            timeConstraints={{ minutes: { step: 15 } }}
                                                                            onChange={(e) => {
                                                                                let newClose = new Date(e)
                                                                                let newArray = this.state.editServiceHours
                                                                                newArray[i] = {
                                                                                    day: h.day,
                                                                                    open: h.open,
                                                                                    close: newClose,
                                                                                    isClosed: h.isClosed
                                                                                }
                                                                                if (!this.validHours(h.open, newClose, h.isClosed)) {
                                                                                    let newArr = this.state.serviceValid;
                                                                                    newArr[i] = false;
                                                                                    this.setState({ serviceValid: newArr })
                                                                                }
                                                                                else {
                                                                                    let newArr = this.state.serviceValid;
                                                                                    newArr[i] = true;
                                                                                    this.setState({ serviceValid: newArr })
                                                                                }
                                                                                this.setState({ editServiceHours: newArray })
                                                                            }}
                                                                        />
                                                                        <Label check style={{ padding: "20px" }}>

                                                                            <Input type="checkbox" value={h.isClosed} checked={h.isClosed} onChange={(e) => {
                                                                                let newIsClosed = !h.isClosed;
                                                                                let newArray = this.state.editServiceHours
                                                                                newArray[i] = {
                                                                                    day: h.day,
                                                                                    open: h.open,
                                                                                    close: h.close,
                                                                                    isClosed: newIsClosed
                                                                                }
                                                                                if (this.validHours(h.open, h.close, newIsClosed)) {
                                                                                    let newVal = this.state.serviceValid
                                                                                    newVal[i] = true;
                                                                                    this.setState({ serviceValid: newVal })
                                                                                }
                                                                                else {
                                                                                    let newVal = this.state.serviceValid
                                                                                    newVal[i] = false;
                                                                                    this.setState({ serviceValid: newVal })
                                                                                }
                                                                                this.setState({ editServiceHours: newArray })
                                                                            }} />{' '}
                                                                            <strong>Closed</strong></Label>
                                                                        <Label check style={{ padding: "20px" }}>

                                                                            <Input type="checkbox" value={new Date(h.open).getHours() === 0 &&
                                                                                new Date(h.open).getMinutes() === 0 &&
                                                                                new Date(h.close).getHours() === 23 &&
                                                                                new Date(h.close).getMinutes() === 59} checked={
                                                                                    new Date(h.open).getHours() === 0 &&
                                                                                    new Date(h.open).getMinutes() === 0 &&
                                                                                    new Date(h.close).getHours() === 23 &&
                                                                                    new Date(h.close).getMinutes() === 59
                                                                                } onChange={(e) => {
                                                                                    if (new Date(h.open).getMinutes() === 0 &&
                                                                                        new Date(h.close).getHours() === 23 &&
                                                                                        new Date(h.close).getMinutes() === 59) {
                                                                                        let newArray = this.state.editServiceHours
                                                                                        newArray[i] = {
                                                                                            day: h.day,
                                                                                            open: new Date(new Date().setHours(8, 0, 0, 0)),
                                                                                            close: new Date(new Date().setHours(21, 0, 0, 0)),
                                                                                            isClosed: h.isClosed
                                                                                        }

                                                                                        this.setState({ editServiceHours: newArray })
                                                                                    }
                                                                                    else {
                                                                                        let newArray = this.state.editServiceHours
                                                                                        newArray[i] = {
                                                                                            day: h.day,
                                                                                            open: new Date(new Date().setHours(0, 0, 0, 0)),
                                                                                            close: new Date(new Date().setHours(23, 59, 59, 999)),
                                                                                            isClosed: h.isClosed
                                                                                        }

                                                                                        this.setState({ editServiceHours: newArray })
                                                                                    }

                                                                                }} />{' '}
                                                                            <strong>24 Hrs</strong></Label>

                                                                    </FormGroup>
                                                                    <p style={{ color: "red" }} hidden={this.state.serviceValid[i]} className="text-center"><strong>Error: Hours for {h.day} are invalid.</strong></p>
                                                                    <hr />
                                                                </div>
                                                            );

                                                        })}
                                                        <Button
                                                            disabled={this.state.serviceValid.indexOf(false) !== -1}
                                                            onClick={async () => {
                                                                let update = this.state.selected_dealership
                                                                update.serviceHours = this.state.editServiceHours
                                                                this._isMounted && await this.props.mongo.findOneAndUpdate("dealerships", { value: this.state.selected_dealership.value }, { serviceHours: this.state.editServiceHours })
                                                                let dlr = this._isMounted && await this.props.mongo.findOne("dealerships", { value: this.state.selected_dealership.value });
                                                                let dealerships = this._isMounted && await this.props.mongo.find("dealerships");
                                                                dealerships = this._isMounted && dealerships.filter((a) => {
                                                                    return a.isActive === true
                                                                })
                                                                this._isMounted && dealerships.sort((a, b) => {
                                                                    if (a.label > b.label) return 1;
                                                                    if (a.label < b.label) return -1;
                                                                    return 0;
                                                                })
                                                                let agent_group = this._isMounted && await this.props.mongo.findOne("dealerships", { value: this.state.agent.dealership });
                                                                agent_group = agent_group.group;
                                                                dealerships = this._isMounted && dealerships.filter((d) => {
                                                                    if (this.state.agent.access === "store") {
                                                                        return d.value === this.state.agent.dealership
                                                                    }
                                                                    if (this.state.agent.access === "group") {
                                                                        return d.group === agent_group
                                                                    }
                                                                    return true;
                                                                })
                                                                if (this.state.agent.access == "store") {
                                                                    this.setState({ selected_dealership: dealerships[0] })
                                                                }
                                                                this.setState({ selected_dealership: dlr, dealerships })
                                                                this.toggle("serviceHoursModal")
                                                            }}>Save Changes</Button>
                                                    </Form>
                                                </ModalBody>
                                            </Modal>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row hidden={this.state.selected_dealership.label.length < 1}>
                        <Col>
                            <Card className="card-raised card-white text-center">
                                <CardHeader>
                                    <CardTitle>
                                        <h2 style={{ color: "#1d67a8" }}>Average Monthly Opportunities</h2>
                                        <hr style={{ border: "solid 1px #1d67a8" }} />
                                    </CardTitle>
                                </CardHeader>
                                <CardBody>

                                    <Label for="leads"><h3 style={{ color: "#1d67a8" }}>Average Monthly Leads:</h3></Label>
                                    <h3 id="leads" style={{ color: "#1d67a8" }}><strong>{this.state.selected_dealership.average_monthly_lead_count == "" ? 0 : this.state.selected_dealership.average_monthly_lead_count}</strong></h3>

                                    <Label for="phoneups"><h3 style={{ color: "#1d67a8" }}>Average Monthly Phone-Ups:</h3></Label>
                                    <h3 id="phoneups" style={{ color: "#1d67a8" }}><strong>{this.state.selected_dealership.average_monthly_phone_ups == "" ? 0 : this.state.selected_dealership.average_monthly_phone_ups}</strong></h3>

                                    <Label for="ro"><h3 style={{ color: "#1d67a8" }}>Average Monthly Repair Orders:</h3></Label>
                                    <h3 id="ro" style={{ color: "#1d67a8" }}><strong>{this.state.selected_dealership.average_montly_ro_count == "" ? 0 : this.state.selected_dealership.average_montly_ro_count}</strong></h3>

                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row hidden={this.state.selected_dealership.label.length < 1}>
                        <Col className="ml-auto mr-auto" lg="12">
                            <Card className="card-raised card-white text-center" color="primary">
                                <CardHeader>
                                    <CardTitle>
                                        <h2 style={{ color: "white" }}>Contacts</h2>
                                        <hr style={{ border: "solid 1px white" }} />
                                    </CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Table responsive striped>
                                        <thead>
                                            <tr>
                                                <th style={{ color: "white" }}>Name</th>
                                                <th style={{ color: "white" }}>Title</th>
                                                <th style={{ color: "white" }}>Email</th>
                                                <th style={{ color: "white" }}>Phone</th>
                                                <th></th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.selected_dealership.profileContacts == undefined ? null : this.state.selected_dealership.profileContacts.map((c, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td><p style={{ color: "white" }}>{c.name}</p></td>
                                                        <td><p style={{ color: "white" }}>{c.title}</p></td>
                                                        <td><p style={{ color: "white" }}>{c.email}</p></td>
                                                        <td><p style={{ color: "white" }}>({c.phone.substring(0, 3)}) {c.phone.substring(3, 6)} - {c.phone.substring(6, 10)}</p></td>
                                                        <td><i style={{ color: "#f4f5f7", fontWeight: "solid", fontSize: "24pt", cursor: "pointer" }} className="tim-icons icon-pencil" onClick={() => {
                                                            let editContact = {
                                                                name: c.name,
                                                                phone: c.phone,
                                                                email: c.email,
                                                                title: c.title
                                                            }
                                                            this.setState({ editContact, editContact2: editContact })
                                                            this.toggle("editContactModal")
                                                        }} /></td>
                                                        <td><i style={{ color: "#fd5d93", fontWeight: "solid", fontSize: "24pt", cursor: "pointer" }} className="tim-icons icon-trash-simple" onClick={async () => {
                                                            let arr = this.state.selected_dealership.profileContacts
                                                            arr = this._isMounted && arr.filter((a) => {
                                                                return a.name != c.name && c.title != a.title && a.email != c.email
                                                            })
                                                            let dlr = this.state.selected_dealership;
                                                            dlr.profileContacts = arr;
                                                            this._isMounted && await this.props.mongo.findOneAndUpdate("dealerships", { value: this.state.selected_dealership.value }, dlr)
                                                            let updated = this._isMounted && await this.props.mongo.findOne("dealerships", { value: this.state.selected_dealership.value })
                                                            this.setState({ selected_dealership: updated })
                                                        }} /></td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                    <Button color="success" onClick={() => { this.toggle("addContactModal") }}><i className="tim-icons icon-simple-add" style={{ color: "white" }} /></Button>
                                    <Modal isOpen={this.state.addContactModal} toggle={() => this.toggle("addContactModal")}>
                                        <ModalHeader toggle={() => this.toggle("addContactModal")}>
                                            <p>Add Contact</p>
                                        </ModalHeader>
                                        <ModalBody>
                                            <Form>
                                                <FormGroup>
                                                    <Label>Name:</Label>
                                                    <Input
                                                        value={this.state.newContact.name}
                                                        onChange={(e) => {
                                                            let newCon = this.state.newContact
                                                            newCon.name = this.props.utils.toTitleCase(e.target.value);
                                                            this.setState({ newContact: newCon })
                                                        }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label>Title:</Label>
                                                    <Input
                                                        value={this.state.newContact.title}
                                                        onChange={(e) => {
                                                            let newCon = this.state.newContact
                                                            newCon.title = this.props.utils.toTitleCase(e.target.value);
                                                            this.setState({ newContact: newCon })
                                                        }} />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label>Email:</Label>
                                                    <Input
                                                        type="email"
                                                        value={this.state.newContact.email !== null ? this.state.newContact.email.toLowerCase() : null}
                                                        onChange={(e) => {
                                                            let newCon = this.state.newContact
                                                            newCon.email = e.target.value;
                                                            this.setState({ newContact: newCon })
                                                        }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label>Phone:</Label>
                                                    <Input
                                                        type="number"
                                                        value={this.state.newContact.phone}
                                                        onChange={(e) => {
                                                            let newCon = this.state.newContact
                                                            newCon.phone = e.target.value;
                                                            this.setState({ newContact: newCon })
                                                        }}
                                                    />
                                                </FormGroup>
                                                <Button
                                                    disabled={
                                                        (() => {
                                                            let ret = false;
                                                            if (this.state.newContact.name === null) {
                                                                return true;
                                                            }
                                                            else {
                                                                if (this.state.newContact.name.length < 1) {
                                                                    ret = true
                                                                }
                                                            }
                                                            if (this.state.newContact.email === null) {
                                                                return true;
                                                            }
                                                            else {
                                                                if (this.state.newContact.email.length < 1) {
                                                                    ret = true
                                                                }
                                                            }
                                                            if (this.state.newContact.title === null) {
                                                                return true;
                                                            }
                                                            else {
                                                                if (this.state.newContact.title.length < 1) {
                                                                    ret = true
                                                                }
                                                            }
                                                            if (this.state.newContact.phone === null) {
                                                                return true;
                                                            }
                                                            else {
                                                                if (this.state.newContact.phone.length !== 10) {
                                                                    ret = true
                                                                }
                                                            }
                                                            return ret;
                                                        })()

                                                    } color="success" onClick={async (e) => {
                                                        e.preventDefault();
                                                        let contacts = this.state.selected_dealership.profileContacts || [];
                                                        contacts.push(this.state.newContact)
                                                        let dlr = this._isMounted && await this.props.mongo.findOne("dealerships", { value: this.state.selected_dealership.value });
                                                        dlr.profileContacts = contacts
                                                        this._isMounted && await this.props.mongo.findOneAndUpdate("dealerships", { value: this.state.selected_dealership.value }, dlr)

                                                        let updated = this._isMounted && await this.props.mongo.findOne("dealerships", { value: this.state.selected_dealership.value });
                                                        this.setState({
                                                            selected_dealership: updated,
                                                            newContact: {
                                                                name: "",
                                                                email: "",
                                                                title: "",
                                                                phone: ""
                                                            }
                                                        })
                                                        this.toggle("addContactModal")
                                                    }}>Add Contact</Button>
                                            </Form>
                                        </ModalBody>
                                    </Modal>
                                    <Modal isOpen={this.state.editContactModal} toggle={() => this.toggle("editContactModal")}>
                                        <ModalHeader toggle={() => this.toggle("editContactModal")}>
                                            <p>Edit Contact</p>
                                        </ModalHeader>
                                        <ModalBody>
                                            <Form>
                                                <FormGroup>
                                                    <Label>Name:</Label>
                                                    <Input
                                                        value={this.state.editContact.name}
                                                        onChange={(e) => {
                                                            let editContact = this.state.editContact
                                                            editContact.name = this.props.utils.toTitleCase(e.target.value);
                                                            this.setState({ editContact })
                                                        }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label>Title:</Label>
                                                    <Input
                                                        value={this.state.editContact.title}
                                                        onChange={(e) => {
                                                            let editContact = this.state.editContact
                                                            editContact.title = this.props.utils.toTitleCase(e.target.value);
                                                            this.setState({ editContact })
                                                        }} />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label>Email:</Label>
                                                    <Input
                                                        type="email"
                                                        value={this.state.editContact.email !== null ? this.state.editContact.email.toLowerCase() : null}
                                                        onChange={(e) => {
                                                            let editContact = this.state.editContact
                                                            editContact.email = e.target.value;
                                                            this.setState({ editContact })
                                                        }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label>Phone:</Label>
                                                    <Input
                                                        type="number"
                                                        value={this.state.editContact.phone}
                                                        onChange={(e) => {
                                                            let editContact = this.state.editContact
                                                            editContact.phone = e.target.value;
                                                            this.setState({ editContact })
                                                        }}
                                                    />
                                                </FormGroup>
                                                <Button color="warning" onClick={(e) => { e.preventDefault(); this.toggle("editContactModal") }}>Cancel</Button>
                                                <Button color="primary" disabled={
                                                    (() => {
                                                        let ret = false;
                                                        if (this.state.editContact.name === null) {
                                                            return true;
                                                        }
                                                        else {
                                                            if (this.state.editContact.name.length < 1) {
                                                                ret = true
                                                            }
                                                        }
                                                        if (this.state.editContact.email === null) {
                                                            return true;
                                                        }
                                                        else {
                                                            if (this.state.editContact.email.length < 1) {
                                                                ret = true
                                                            }
                                                        }
                                                        if (this.state.editContact.title === null) {
                                                            return true;
                                                        }
                                                        else {
                                                            if (this.state.editContact.title.length < 1) {
                                                                ret = true
                                                            }
                                                        }
                                                        if (this.state.editContact.phone === null) {
                                                            return true;
                                                        }
                                                        else {
                                                            if (this.state.editContact.phone.length !== 10) {
                                                                ret = true
                                                            }
                                                        }
                                                        return ret;
                                                    })()
                                                } onClick={async (e) => {
                                                    e.preventDefault();
                                                    console.log(this.state.editContact2)
                                                    let contacts = this.state.selected_dealership.profileContacts || [];
                                                    let i = 0;
                                                    for (i in contacts) {
                                                        if (contacts[i].email === this.state.editContact2.email && contacts[i].phone === this.state.editContact2.phone) {
                                                            break;
                                                        }
                                                    }
                                                    contacts[i] = this.state.editContact;
                                                    let dlr = this._isMounted &&  this.props.mongo.findOne("dealerships", { value: this.state.selected_dealership.value });
                                                    dlr.profileContacts = contacts
                                                    this._isMounted && await this.props.mongo.findOneAndUpdate("dealerships", { value: this.state.selected_dealership.value }, dlr)

                                                    let updated = this._isMounted && await this.props.mongo.findOne("dealerships", { value: this.state.selected_dealership.value });
                                                    this.setState({
                                                        selected_dealership: updated,
                                                        editContact: {
                                                            name: "",
                                                            email: "",
                                                            title: "",
                                                            phone: ""
                                                        },
                                                        editContact2: {
                                                            name: "",
                                                            email: "",
                                                            title: "",
                                                            phone: ""
                                                        }
                                                    })
                                                    this.toggle("editContactModal")
                                                }}>Update</Button>
                                            </Form>
                                        </ModalBody>
                                    </Modal>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div >
        );
    }
}

export default DealershipProfile;