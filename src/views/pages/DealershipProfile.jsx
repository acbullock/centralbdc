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
        dealerships = dealerships.filter((a) => {
            return a.isActive === true
        })
        dealerships.sort((a, b) => {
            if (a.label > b.label) return 1;
            if (a.label < b.label) return -1;
            return 0;
        })
        let agent_group = this._isMounted && await this.props.mongo.findOne("dealerships", { value: agent.dealership });
        agent_group = agent_group.group;
        dealerships = dealerships.filter((d) => {
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
        let dlr = await this.props.mongo.findOne("dealerships", { value: this.state.selected_dealership.value })
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
            serviceValid: [true, true, true, true, true, true, true]
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


                                            <h3 for="name" style={{ color: "white" }}>Name:</h3>
                                            <h3 id="name" style={{ color: "white" }}><strong>{this.state.selected_dealership.label}</strong></h3>



                                            <h3 for="address" style={{ color: "white" }}>Address:</h3>
                                            <h3 id="address" style={{ color: "white" }}><strong>{this.state.selected_dealership.address}</strong></h3>

                                            <h3 for="phone" style={{ color: "white" }}>Phone:</h3>
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
                                                                <>
                                                                    <FormGroup key={i}>
                                                                        <Label><strong>{h.day}</strong></Label>
                                                                        <p>Open</p>
                                                                        <ReactDateTime
                                                                            inputProps={{ disabled: h.isClosed }}
                                                                            value={new Date(h.open).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                                                                            dateFormat={false}
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
                                                                    </FormGroup>
                                                                    <p style={{ color: "red" }} hidden={this.state.salesValid[i]} className="text-center"><strong>Error: Hours for {h.day} are invalid.</strong></p>
                                                                    <hr />
                                                                </>
                                                            );

                                                        })}
                                                        <Button
                                                            disabled={this.state.salesValid.indexOf(false) !== -1}
                                                            onClick={async () => {
                                                                let update = this.state.selected_dealership
                                                                update.salesHours = this.state.editSalesHours

                                                                await this.props.mongo.findOneAndUpdate("dealerships", { value: this.state.selected_dealership.value }, { salesHours: this.state.editSalesHours })
                                                                let dlr = await this.props.mongo.findOne("dealerships", { value: this.state.selected_dealership.value });
                                                                let dealerships = this._isMounted && await this.props.mongo.find("dealerships");
                                                                dealerships = dealerships.filter((a) => {
                                                                    return a.isActive === true
                                                                })
                                                                dealerships.sort((a, b) => {
                                                                    if (a.label > b.label) return 1;
                                                                    if (a.label < b.label) return -1;
                                                                    return 0;
                                                                })
                                                                let agent_group = this._isMounted && await this.props.mongo.findOne("dealerships", { value: this.state.agent.dealership });
                                                                agent_group = agent_group.group;
                                                                dealerships = dealerships.filter((d) => {
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
                                                    {this.state.selected_dealership.serviceHours !== undefined ? this.state.selected_dealership.serviceHours.map((h) => {
                                                        return (
                                                            <tr>
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
                                                                <>
                                                                    <FormGroup key={i}>
                                                                        <Label><strong>{h.day}</strong></Label>
                                                                        <p>Open</p>
                                                                        <ReactDateTime
                                                                            inputProps={{ disabled: h.isClosed }}
                                                                            value={new Date(h.open).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                                                                            dateFormat={false}
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
                                                                    </FormGroup>
                                                                    <p style={{ color: "red" }} hidden={this.state.serviceValid[i]} className="text-center"><strong>Error: Hours for {h.day} are invalid.</strong></p>
                                                                    <hr />
                                                                </>
                                                            );

                                                        })}
                                                        <Button
                                                            disabled={this.state.serviceValid.indexOf(false) !== -1}
                                                            onClick={async () => {
                                                                let update = this.state.selected_dealership
                                                                update.serviceHours = this.state.editServiceHours
                                                                await this.props.mongo.findOneAndUpdate("dealerships", { value: this.state.selected_dealership.value }, { serviceHours: this.state.editServiceHours })
                                                                let dlr = await this.props.mongo.findOne("dealerships", { value: this.state.selected_dealership.value });
                                                                let dealerships = this._isMounted && await this.props.mongo.find("dealerships");
                                                                dealerships = dealerships.filter((a) => {
                                                                    return a.isActive === true
                                                                })
                                                                dealerships.sort((a, b) => {
                                                                    if (a.label > b.label) return 1;
                                                                    if (a.label < b.label) return -1;
                                                                    return 0;
                                                                })
                                                                let agent_group = this._isMounted && await this.props.mongo.findOne("dealerships", { value: this.state.agent.dealership });
                                                                agent_group = agent_group.group;
                                                                dealerships = dealerships.filter((d) => {
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
                                        <h2 style={{ color: "#3469a6" }}>Average Monthly Opportunities</h2>
                                        <hr style={{ border: "solid 1px #3469a6" }} />
                                    </CardTitle>
                                </CardHeader>
                                <CardBody>

                                    <h3 for="leads" style={{ color: "#3469a6" }}>Average Monthly Leads:</h3>
                                    <h3 id="leads" style={{ color: "#3469a6" }}><strong>{this.state.selected_dealership.average_monthly_lead_count == "" ? 0 : this.state.selected_dealership.average_monthly_lead_count}</strong></h3>

                                    <h3 for="phoneups" style={{ color: "#3469a6" }}>Average Phone-Ups:</h3>
                                    <h3 id="phoneups" style={{ color: "#3469a6" }}><strong>{this.state.selected_dealership.average_monthly_phone_ups == "" ? 0 : this.state.selected_dealership.average_monthly_phone_ups}</strong></h3>

                                    <h3 for="ro" style={{ color: "#3469a6" }}>Average Monthly Repair Orders:</h3>
                                    <h3 id="ro" style={{ color: "#3469a6" }}><strong>{this.state.selected_dealership.average_montly_ro_count == "" ? 0 : this.state.selected_dealership.average_montly_ro_count}</strong></h3>

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