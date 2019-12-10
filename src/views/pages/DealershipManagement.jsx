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

class DealershipManagement extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            addModal: false,
            addDealerModal: false,
            editGroupModal: false,
            editDealerModal: false,
            addTextList: [],
            addDealershipName: "",
            addDealershipGroup: {},
            addDealershipPhone: "",
            addRingCentral: "",
            newTextContact: "",
            dealershipGroups: [],
            avgMonthlyLeadCount: "",
            avgMonthlyRO: "",
            dealershipAddress: "",
            primaryContactName: "",
            primaryContactEmail: "",
            primaryContactPhone: "",
            primaryAccess: "",
            secondaryContactName: "",
            secondaryContactEmail: "",
            secondaryContactPhone: "",
            secondaryAccess: "",
            newDealershipGroup: "",
            editDealershipGroup: { label: "", value: "" },
            editGroupName: "",
            editGroupValue: "",
            dealerships: [],
            editDealership: { label: "", value: "" },
            editDealershipValue: "",
            editDealershipName: "",
            editDealershipPhone: "",
            editDealershipAddress: "",
            editDealershipGroup2: { label: "", value: "" },
            editAvgMonthlyLeadCount: "",
            editAvgMonthlyRO: "",
            editPrimaryContactName: "",
            editPrimaryContactEmail: "",
            editPrimaryContactPhone: "",
            editPrimaryAccess: "",
            editSecondaryContactName: "",
            editSecondaryContactEmail: "",
            editSecondaryContactPhone: "",
            editSecondaryAccess: "",
            editTextList: [],
            newEditTextContact: "",
            editRingCentral: ""
        }
        this.toggle = this.toggle.bind(this)
        this.addToTextList = this.addToTextList.bind(this)
        this.onValueChange = this.onValueChange.bind(this)
        this.deleteGroup = this.deleteGroup.bind(this)
        this.updateGroupName = this.updateGroupName.bind(this)
        this.addNewDealershp = this.addNewDealershp.bind(this)
        this.updateDealership = this.updateDealership.bind(this)
        this.addToEditTextList = this.addToEditTextList.bind(this)
        this.removeFromEditTextList = this.removeFromEditTextList.bind(this)
        this.removeFromTextList = this.removeFromTextList.bind(this)
        this._isMounted = false
    }
    async componentWillMount() {
        this._isMounted = true
        this.setState({ loading: true })
        let groups = this._isMounted && await this.props.mongo.find("dealership_groups")
        groups.sort((a, b) => {
            if (a.label < b.label) return -1
            if (b.label < a.label) return 1
            return 0
        })
        let dealerships = this._isMounted && await this.props.mongo.find("dealerships")
        dealerships.sort((a, b) => {
            if (a.label < b.label) return -1
            if (b.label < a.label) return 1
            return 0
        })
        this.setState({ loading: false, dealershipGroups: groups, dealerships: dealerships })
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
    addToTextList(phoneNumber) {
        let arr = this.state.addTextList
        if (arr.indexOf(phoneNumber) == -1)
            arr.push(phoneNumber)
        this.setState({ addTextList: arr, newTextContact: "" })
    }
    removeFromTextList(phoneNumber) {
        let arr = this.state.addTextList
        if (arr.indexOf(phoneNumber) != -1)
            arr.splice(arr.indexOf(phoneNumber), 1);
        this.setState({ addTextList: arr, newTextContact: "" })
    }
    async addToEditTextList(phoneNumber) {
        let arr = this.state.editTextList
        if (arr.indexOf(phoneNumber) == -1)
            arr.push(phoneNumber)
        this.setState({ editTextList: arr, newEditTextContact: "" })
    }
    removeFromEditTextList(phoneNumber) {
        let arr = this.state.editTextList
        if (arr.indexOf(phoneNumber) != -1)
            arr.splice(arr.indexOf(phoneNumber), 1);
        this.setState({ editTextList: arr, newEditTextContact: "" })
    }
    onValueChange(key, value) {
        this.setState({ [key]: value })
    }
    clearAddValues() {
        this.setState({
            addDealershipName: "",
            newTextContact: "",
            addDealershipGroup: {},
            addTextList: [],
            addDealershipPhone: "",
            avgMonthlyLeadCount: "",
            dealershipAddress: "",
            avgMonthlyRO: "",
            primaryContactName: "",
            primaryContactEmail: "",
            primaryContactPhone: "",
            primaryAccess: "",
            secondaryContactName: "",
            secondaryContactEmail: "",
            secondaryContactPhone: "",
            secondaryAccess: "",
            addRingCentral: "",
            newDealershipGroup: "",

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
    async addNewDealershp() {
        this.setState({ loading: true })
        let newDealership = {
            label: this.props.utils.toTitleCase(this.state.addDealershipName),
            group: this.state.addDealershipGroup,
            phone: this.state.addDealershipPhone,
            address: this.state.dealershipAddress,
            average_monthly_lead_count: this.state.avgMonthlyLeadCount,
            average_montly_ro_count: this.state.avgMonthlyRO,
            primary_contact: {
                access: this.state.primaryAccess === "primaryStore" ? "store" : "group",
                name: this.props.utils.toTitleCase(this.state.primaryContactName),
                email: this.state.primaryContactEmail,
                phone: this.state.primaryContactPhone
            },
            secondary_contact: {
                access: this.state.secondaryAccess === "secondaryStore" ? "store" : "group",
                name: this.props.utils.toTitleCase(this.state.secondaryContactName),
                email: this.state.secondaryContactEmail,
                phone: this.state.secondaryContactPhone
            },
            textFrom: this.state.addRingCentral,
            contacts: this.state.addTextList
        }
        //insert dealer
        let inserted = this._isMounted && await this.props.mongo.insertOne("dealerships", newDealership)
        //update dealer to have 'value'
        this._isMounted && await this.props.mongo.findOneAndUpdate("dealerships", newDealership, { value: inserted.insertedId })
        //then get dealers and sort..
        let dealers = await this.props.mongo.find("dealerships")
        dealers.sort((a, b) => {
            if (a.label < b.label) return -1;
            if (a.label > b.label) return 1;
            return 0;
        })
        this.toggle("addModal")
        this.clearAddValues()
        this.setState({ dealerships: dealers, loading: false })
    }
    async updateDealership() {
        this.setState({ loading: true })
        let update_value = this.state.editDealership.value
        let update = {
            label: this.props.utils.toTitleCase(this.state.editDealershipName),
            group: this.state.editDealershipGroup2,
            phone: this.state.editDealershipPhone,
            address: this.state.editDealershipAddress,
            average_monthly_lead_count: this.state.editAvgMonthlyLeadCount,
            average_montly_ro_count: this.state.editAvgMonthlyRO,
            primary_contact: {
                access: this.state.editPrimaryAccess === "editPrimaryStore" ? "store" : "group",
                name: this.props.utils.toTitleCase(this.state.editPrimaryContactName),
                email: this.state.editPrimaryContactEmail,
                phone: this.state.editPrimaryContactPhone
            },
            secondary_contact: {
                access: this.state.editSecondaryAccess === "editSecondaryStore" ? "store" : "group",
                name: this.props.utils.toTitleCase(this.state.editSecondaryContactName),
                email: this.state.editSecondaryContactEmail,
                phone: this.state.editSecondaryContactPhone
            },
            textFrom: this.state.editRingCentral,
            contacts: this.state.editTextList
        }
        //update dealer
        this._isMounted && await this.props.mongo.findOneAndUpdate("dealerships", { value: update_value }, update)
        //then get dealers and sort..
        let dealers = await this.props.mongo.find("dealerships")
        dealers.sort((a, b) => {
            if (a.label < b.label) return -1;
            if (a.label > b.label) return 1;
            return 0;
        })
        this.toggle("editDealerModal")
        this.setState({ dealerships: dealers, editDealership: { label: "", value: "" }, loading: false })
    }
    async deleteDealership() {
        this.setState({ loading: true })
        //delete dealership
        this._isMounted && await this.props.mongo.findOneAndDelete("dealerships", this.state.editDealership)
        //get dealerships
        let dealers = this._isMounted && await this.props.mongo.find("dealerships")
        dealers.sort((a, b) => {
            if (a.label < b.label) return -1
            if (a.label > b.label) return 1
            return 0
        })
        this.setState({ loading: false, dealerships: dealers, editDealership: { label: "", value: "" } })
    }

    render() {
        if (this.state.loading) {
            return (
                <>
                    <div className="content">
                        <Container>
                            <Col className="ml-auto mr-auto text-center" md="6">
                                <Card color="transparent" >
                                    <CardImg top width="100%" src={this.props.utils.loading} />
                                </Card>
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
                                    <h2>Add Dealership</h2>
                                    <Button color="primary" onClick={() => { this.toggle("addModal") }}>
                                        <i className="tim-icons icon-simple-add"></i>
                                    </Button>
                                    <Modal isOpen={this.state.addModal} toggle={() => { this.toggle("addModal") }} style={{ 'maxHeight': 'calc(100vh - 210px)', 'overflowY': 'auto' }}>
                                        <ModalHeader toggle={() => { this.toggle("addModal") }}>Add Dealership</ModalHeader>
                                        <ModalBody>
                                            <Form>
                                                <legend>Dealership Contact Info</legend>
                                                <FormGroup>
                                                    <Label for="dealershipName">Dealership Name</Label>
                                                    <Input
                                                        type="text"
                                                        name="dealershipName"
                                                        id="dealershipName"
                                                        placeholder="Name of Dealership"
                                                        value={this.state.addDealershipName}
                                                        onChange={(e) => { this.onValueChange("addDealershipName", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="dealershipMainPhone">Dealership Main Phone Number</Label>
                                                    <Input
                                                        type="number"
                                                        name="dealershipMainPhone"
                                                        id="dealershipMainPhone"
                                                        placeholder="Dealership Main Phone #"
                                                        value={this.state.addDealershipPhone}
                                                        onChange={(e) => this.onValueChange("addDealershipPhone", e.target.value)}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="dealershipAddress">Dealership Address</Label>
                                                    <Input
                                                        type="text"
                                                        name="dealershipAddress"
                                                        id="dealershipAddress"
                                                        placeholder="Dealership Address"
                                                        value={this.state.dealershipAddress}
                                                        onChange={(e) => { this.onValueChange("dealershipAddress", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="dealershipGroup">Dealership Group</Label>
                                                    <Select
                                                        name="dealershipGroup"
                                                        id="dealershipGroup"
                                                        placeholder="Dealership Group"
                                                        options={this.state.dealershipGroups}
                                                        onChange={(e) => { this.setState({ addDealershipGroup: e }) }}
                                                    />
                                                </FormGroup>
                                                <hr />
                                                <legend>Dealership Data</legend>
                                                <FormGroup>
                                                    <Label for="avgMonthlyLeadCount">Average Monthly Lead Count</Label>
                                                    <Input
                                                        type="number"
                                                        name="avgMonthlyLeadCount"
                                                        id="avgMonthlyLeadCount"
                                                        placeholder="Average Monthly Lead Count"
                                                        value={this.state.avgMonthlyLeadCount}
                                                        onChange={(e) => this.onValueChange("avgMonthlyLeadCount", e.target.value)}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="avgMonthlyRO">Average Monthly Repair Order Count</Label>
                                                    <Input
                                                        type="number"
                                                        name="avgMonthlyRO"
                                                        id="avgMonthlyRO"
                                                        placeholder="Average Monthly RO Count"
                                                        value={this.state.avgMonthlyRO}
                                                        onChange={(e) => { this.onValueChange("avgMonthlyRO", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <hr />
                                                <legend>Primary Contact</legend>
                                                <FormGroup tag="fieldset">
                                                    <Label for="primaryContactName">Name</Label>
                                                    <Input
                                                        type="text"
                                                        name="primaryContactName"
                                                        id="primaryContactName"
                                                        placeholder="Primary Contact Name"
                                                        value={this.state.primaryContactName}
                                                        onChange={(e) => { this.onValueChange("primaryContactName", e.target.value) }}
                                                    />
                                                    <Label for="primaryContactEmail">Email</Label>
                                                    <Input
                                                        type="text"
                                                        name="primaryContactEmail"
                                                        id="primaryContactEmail"
                                                        placeholder="Primary Contact Email"
                                                        value={this.state.primaryContactEmail}
                                                        onChange={(e) => this.onValueChange("primaryContactEmail", e.target.value)}
                                                    />
                                                    <Label for="primaryContactPhone">Phone</Label>
                                                    <Input
                                                        type="number"
                                                        name="primaryContactPhone"
                                                        id="primaryContactPhone"
                                                        placeholder="Primary Contact Phone"
                                                        value={this.state.primaryContactPhone}
                                                        onChange={(e) => { this.onValueChange("primaryContactPhone", e.target.value) }}
                                                    />
                                                    <FormGroup tag="fieldset">
                                                        <FormGroup check>
                                                            <Label check>
                                                                <Input
                                                                    type="radio"
                                                                    name="primaryAccess"
                                                                    value="primaryStore"
                                                                    checked={this.state.primaryAccess === "primaryStore"}
                                                                    onChange={(e) => { this.onValueChange("primaryAccess", e.target.value) }}
                                                                />{' '}
                                                                Store Access
                                                            </Label>
                                                        </FormGroup>
                                                        <FormGroup check>
                                                            <Label check>
                                                                <Input
                                                                    type="radio"
                                                                    name="primaryAccess"
                                                                    value="primaryGroup"
                                                                    checked={this.state.primaryAccess === "primaryGroup"}
                                                                    onChange={(e) => { this.onValueChange("primaryAccess", e.target.value) }}
                                                                />{' '}
                                                                Group Access
                                                            </Label>
                                                        </FormGroup>
                                                    </FormGroup>
                                                </FormGroup>
                                                <hr />
                                                <legend>Secondary Contact</legend>
                                                <FormGroup>
                                                    <Label for="secondaryContactName">Name</Label>
                                                    <Input
                                                        type="text"
                                                        name="secondaryContactName"
                                                        id="secondaryContactName"
                                                        placeholder="Secondary Contact Name"
                                                        value={this.state.secondaryContactName}
                                                        onChange={(e) => { this.onValueChange("secondaryContactName", e.target.value) }}
                                                    />
                                                    <Label for="secondaryContactEmail">Email</Label>
                                                    <Input
                                                        type="text"
                                                        name="secondaryContactEmail"
                                                        id="secondaryContactEmail"
                                                        placeholder="Secondary Contact Email"
                                                        value={this.state.secondaryContactEmail}
                                                        onChange={(e) => { this.onValueChange("secondaryContactEmail", e.target.value) }}
                                                    />
                                                    <Label for="secondaryContactPhone">Phone</Label>
                                                    <Input
                                                        type="number"
                                                        name="secondaryContactPhone"
                                                        id="secondaryContactPhone"
                                                        placeholder="Secondary Contact Phone"
                                                        value={this.state.secondaryContactPhone}
                                                        onChange={(e) => { this.onValueChange("secondaryContactPhone", e.target.value) }}
                                                    />
                                                    <FormGroup tag="fieldset">
                                                        <FormGroup check>
                                                            <Label check>
                                                                <Input
                                                                    type="radio"
                                                                    name="secondaryAccess"
                                                                    value="secondaryStore"
                                                                    checked={this.state.secondaryAccess == "secondaryStore"}
                                                                    onChange={(e) => { this.onValueChange("secondaryAccess", e.target.value) }}
                                                                />{' '}
                                                                Store Access
                                                            </Label>
                                                        </FormGroup>
                                                        <FormGroup check>
                                                            <Label check>
                                                                <Input
                                                                    type="radio"
                                                                    name="secondaryAccess"
                                                                    value="secondaryGroup"
                                                                    checked={this.state.secondaryAccess == "secondaryGroup"}
                                                                    onChange={(e) => { this.onValueChange("secondaryAccess", e.target.value) }}
                                                                />{' '}
                                                                Group Access
                                                            </Label>
                                                        </FormGroup>
                                                    </FormGroup>
                                                </FormGroup>
                                                <hr />
                                                <legend>Text List</legend>
                                                <FormGroup>
                                                    {
                                                        this.state.addTextList.map((phoneNumber, i) => {
                                                            return <p key={i}>{phoneNumber}</p>
                                                        })
                                                    }
                                                    <Input value={this.state.newTextContact} onChange={(e) => { this.onValueChange("newTextContact", e.target.value) }} type="tel" />
                                                    <Button disabled={this.state.newTextContact.length != 10} color="danger" onClick={(e) => { this.removeFromTextList(this.state.newTextContact) }}>
                                                        <i className="tim-icons icon-simple-remove" />
                                                    </Button>
                                                    <Button disabled={this.state.newTextContact.length != 10} color="primary" onClick={(e) => { this.addToTextList(this.state.newTextContact) }}>
                                                        <i className="tim-icons icon-simple-add" />
                                                    </Button>

                                                </FormGroup>
                                                <hr />
                                                <legend>Ring Central Number</legend>
                                                <FormGroup>
                                                    <Input
                                                        value={this.state.addRingCentral}
                                                        onChange={(e) => { this.onValueChange("addRingCentral", e.target.value) }}
                                                        type="number"
                                                    />
                                                </FormGroup>
                                                <Button color="warning" onClick={() => { this.toggle("addModal") }}>Cancel</Button>
                                                <Button onClick={() => {
                                                    this.addNewDealershp()
                                                }} color="success" disabled={
                                                    this.state.addDealershipName.length === 0 ||
                                                    this.state.addDealershipGroup.label == undefined ||
                                                    this.state.addTextList.length === 0 ||
                                                    this.state.addDealershipPhone.length != 10 ||
                                                    this.state.avgMonthlyLeadCount.length === 0 ||
                                                    this.state.dealershipAddress.length === 0 ||
                                                    this.state.avgMonthlyRO.length === 0 ||
                                                    this.state.primaryContactName.length === 0 ||
                                                    this.state.primaryContactEmail.length === 0 ||
                                                    this.state.primaryContactPhone.length !== 10 ||
                                                    this.state.primaryAccess.length === 0 ||
                                                    this.state.secondaryContactName.length === 0 ||
                                                    this.state.secondaryContactEmail.length === 0 ||
                                                    this.state.secondaryContactPhone.length !== 10 ||
                                                    this.state.secondaryAccess.length === 0 ||
                                                    this.state.addRingCentral.length != 10
                                                    // access validation?
                                                }>Submit</Button>
                                            </Form>
                                        </ModalBody>
                                    </Modal>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody>
                                    <h2>Add Dealership Group</h2>
                                    <Button color="primary" onClick={() => { this.toggle("addDealerModal") }}>
                                        <i className="tim-icons icon-simple-add"></i>
                                    </Button>
                                    <Modal isOpen={this.state.addDealerModal} toggle={() => { this.toggle("addDealerModal") }} style={{ 'maxHeight': 'calc(100vh - 210px)', 'overflowY': 'auto' }}>
                                        <ModalHeader toggle={() => { this.toggle("addDealerModal") }}>Add Dealership Group</ModalHeader>
                                        <ModalBody>
                                            <Form onSubmit={(e) => { e.preventDefault(); this.addNewGroup() }}>
                                                <legend>Group Name</legend>
                                                <FormGroup>
                                                    {/* <Label for="dealershipGroup">Group Name</Label> */}
                                                    <Input
                                                        type="text"
                                                        name="dealershipGroup"
                                                        id="dealershipGroup"
                                                        placeholder="Group Name"
                                                        value={this.state.newDealershipGroup}
                                                        onChange={(e) => { this.onValueChange("newDealershipGroup", e.target.value) }}
                                                    />
                                                    <Button disabled={this.state.newDealershipGroup.length === 0} type="submit">Add</Button>
                                                </FormGroup>
                                            </Form>
                                        </ModalBody>
                                    </Modal>
                                </CardBody>
                            </Card>

                            <hr />
                            <Card>
                                <CardBody>
                                    <h2>Edit/Delete Dealership Group</h2>
                                    <Select
                                        name="editDealershipGroup"
                                        id="editDealershipGroup"
                                        options={this.state.dealershipGroups}
                                        value={this.state.editDealershipGroup}
                                        onChange={(e) => { this.onValueChange("editDealershipGroup", e); this.setState({ editGroupValue: e.value }) }}
                                    />
                                    <br />
                                    <Button color="warning" disabled={this.state.editDealershipGroup.label.length == 0} onClick={() => { this.deleteGroup() }}>Delete Group Name</Button>
                                    <Button color="primary" disabled={this.state.editDealershipGroup.label.length == 0} onClick={() => { this.toggle("editGroupModal"); this.setState({ editGroupName: this.state.editDealershipGroup.label }) }}>Edit Group Name</Button>
                                    <Modal isOpen={this.state.editGroupModal} toggle={() => { this.toggle("editGroupModal") }} style={{ 'maxHeight': 'calc(100vh - 210px)', 'overflowY': 'auto' }}>
                                        <ModalHeader toggle={() => { this.toggle("editGroupModal") }}>Edit Group</ModalHeader>
                                        <ModalBody>
                                            <Input
                                                value={this.state.editGroupName}
                                                onChange={(e) => { this.onValueChange("editGroupName", e.target.value); }}
                                            />
                                            <br />
                                            <Button color="warning" onClick={() => { this.toggle("editGroupModal"); this.setState({ editDealershipGroup: { label: "", value: "" } }) }}>Cancel</Button>
                                            <Button color="primary" onClick={() => { this.updateGroupName() }}>Save</Button>
                                        </ModalBody>
                                    </Modal>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody>
                                    <h2>Edit/Delete Dealership</h2>
                                    <Select
                                        name="editDealership"
                                        id="editDealership"
                                        options={this.state.dealerships}
                                        value={this.state.editDealership}
                                        onChange={(e) => { this.onValueChange("editDealership", e); this.setState({ editDealershipValue: e.value }) }}
                                    />
                                    <br />
                                    <Button color="danger" disabled={this.state.editDealership.label.length == 0} onClick={() => { this.deleteDealership() }}>Delete Dealership</Button>
                                    <Button color="primary" disabled={this.state.editDealership.label.length == 0} onClick={async () => {
                                        this.setState({ loading: true })
                                        let d = await this.props.mongo.findOne("dealerships", { value: this.state.editDealership.value })
                                        this.setState({ editDealership: d })
                                        this.setState({
                                            editDealershipName: this.state.editDealership.label,
                                            editDealershipPhone: this.state.editDealership.phone || "",
                                            editDealershipAddress: this.state.editDealership.address || "",
                                            editDealershipGroup2: this.state.editDealership.group || { label: "", value: "" },
                                            editAvgMonthlyLeadCount: this.state.editDealership.average_monthly_lead_count || "",
                                            editAvgMonthlyRO: this.state.editDealership.average_montly_ro_count || "",
                                            editPrimaryContactName: this.state.editDealership.primary_contact ? this.state.editDealership.primary_contact.name || "" : "",
                                            editPrimaryContactEmail: this.state.editDealership.primary_contact ? this.state.editDealership.primary_contact.email || "" : "",
                                            editPrimaryContactPhone: this.state.editDealership.primary_contact ? this.state.editDealership.primary_contact.phone || "" : "",
                                            editSecondaryContactName: this.state.editDealership.secondary_contact ? this.state.editDealership.secondary_contact.name || "" : "",
                                            editSecondaryContactEmail: this.state.editDealership.secondary_contact ? this.state.editDealership.secondary_contact.email || "" : "",
                                            editSecondaryContactPhone: this.state.editDealership.secondary_contact ? this.state.editDealership.secondary_contact.phone || "" : "",
                                            editTextList: this.state.editDealership.contacts || [],
                                            editRingCentral: this.state.editDealership.textFrom || ""
                                        })
                                        if (this.state.editDealership.primary_contact) {
                                            if (this.state.editDealership.primary_contact.access) {
                                                this.state.editDealership.primary_contact.access === "group" ? this.setState({ editPrimaryAccess: "editPrimaryGroup" }) : this.setState({ editPrimaryAccess: "editPrimaryStore" })
                                            }
                                        }
                                        if (this.state.editDealership.secondary_contact) {
                                            if (this.state.editDealership.secondary_contact.access) {
                                                this.state.editDealership.secondary_contact.access === "group" ? this.setState({ editSecondaryAccess: "editSecondaryGroup" }) : this.setState({ editSecondaryAccess: "editSecondaryStore" })
                                            }
                                        }
                                        this.setState({ loading: false })
                                        this.toggle("editDealerModal");
                                    }}>Edit Dealership</Button>
                                    <Modal isOpen={this.state.editDealerModal} toggle={() => { this.toggle("editDealerModal") }} style={{ 'maxHeight': 'calc(100vh - 210px)', 'overflowY': 'auto' }}>
                                        <ModalHeader toggle={() => { this.toggle("editDealerModal") }}>
                                            Edit Dealership
                                        </ModalHeader>
                                        <ModalBody>
                                            <Form onSubmit={(e) => { e.preventDefault(); this.updateDealership() }}>
                                                <legend>Edit Dealership Contact Info</legend>
                                                <FormGroup>
                                                    <Label for="editDealershipName">Dealership Name</Label>
                                                    <Input
                                                        type="text"
                                                        name="editDealershipName"
                                                        id="editDealershipName"
                                                        placeholder="Edit Name of Dealership"
                                                        value={this.state.editDealershipName}
                                                        onChange={(e) => { this.onValueChange("editDealershipName", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="editDealershipPhone">Dealership Main Phone Number</Label>
                                                    <Input
                                                        type="text"
                                                        name="editDealershipPhone"
                                                        id="editDealershipPhone"
                                                        placeholder="Edit Dealership Main Phone #"
                                                        value={this.state.editDealershipPhone}
                                                        onChange={(e) => { this.onValueChange("editDealershipPhone", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="editDealershipAddress">Dealership Address</Label>
                                                    <Input
                                                        type="text"
                                                        name="dealershipAddress"
                                                        id="dealershipAddress"
                                                        placeholder="Edit Dealership Address"
                                                        value={this.state.editDealershipAddress}
                                                        onChange={(e) => { this.onValueChange("editDealershipAddress", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="editDealershipGroup2">Edit Dealership Group</Label>
                                                    <Select
                                                        name="editDealershipGroup2"
                                                        id="editDealershipGroup2"
                                                        placeholder="Edit Dealership Group"
                                                        options={this.state.dealershipGroups}
                                                        value={this.state.editDealershipGroup2}
                                                        onChange={(e) => { this.setState({ editDealershipGroup2: e }) }}
                                                    />
                                                </FormGroup>
                                                <hr />
                                                <legend> Edit Dealership Data</legend>
                                                <FormGroup>
                                                    <Label for="editAvgMonthlyLeadCount">Average Monthly Lead Count</Label>
                                                    <Input
                                                        type="number"
                                                        name="editAvgMonthlyLeadCount"
                                                        id="editAvgMonthlyLeadCount"
                                                        placeholder="Edit Average Monthly Lead Count"
                                                        value={this.state.editAvgMonthlyLeadCount}
                                                        onChange={(e) => this.onValueChange("editAvgMonthlyLeadCount", e.target.value)}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="editAvgMonthlyRO">Average Monthly Repair Order Count</Label>
                                                    <Input
                                                        type="number"
                                                        name="editAvgMonthlyRO"
                                                        id="editAvgMonthlyRO"
                                                        placeholder="Edit Average Monthly RO Count"
                                                        value={this.state.editAvgMonthlyRO}
                                                        onChange={(e) => { this.onValueChange("editAvgMonthlyRO", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <hr />
                                                <legend>Edit Primary Contact</legend>
                                                <FormGroup tag="fieldset">
                                                    <Label for="rimaryContactName">Name</Label>
                                                    <Input
                                                        type="text"
                                                        name="editPrimaryContactName"
                                                        id="editPrimaryContactName"
                                                        placeholder="Edit Primary Contact Name"
                                                        value={this.state.editPrimaryContactName}
                                                        onChange={(e) => { this.onValueChange("editPrimaryContactName", e.target.value) }}
                                                    />
                                                    <Label for="editPrimaryContactEmail">Email</Label>
                                                    <Input
                                                        type="text"
                                                        name="editPrimaryContactEmail"
                                                        id="editPrimaryContactEmail"
                                                        placeholder="Edit Primary Contact Email"
                                                        value={this.state.editPrimaryContactEmail}
                                                        onChange={(e) => this.onValueChange("editPrimaryContactEmail", e.target.value)}
                                                    />
                                                    <Label for="editPrimaryContactPhone">Phone</Label>
                                                    <Input
                                                        type="number"
                                                        name="editPrimaryContactPhone"
                                                        id="editPrimaryContactPhone"
                                                        placeholder="Edit Primary Contact Phone"
                                                        value={this.state.editPrimaryContactPhone}
                                                        onChange={(e) => { this.onValueChange("editPrimaryContactPhone", e.target.value) }}
                                                    />
                                                    <FormGroup tag="fieldset">
                                                        <FormGroup check>
                                                            <Label check>
                                                                <Input
                                                                    type="radio"
                                                                    name="editPrimaryAccess"
                                                                    value="editPrimaryStore"
                                                                    checked={this.state.editPrimaryAccess === "editPrimaryStore"}
                                                                    onChange={(e) => { this.onValueChange("editPrimaryAccess", e.target.value) }}
                                                                />{' '}
                                                                Store Access
                                                            </Label>
                                                        </FormGroup>
                                                        <FormGroup check>
                                                            <Label check>
                                                                <Input
                                                                    type="radio"
                                                                    name="editPrimaryAccess"
                                                                    value="editPrimaryGroup"
                                                                    checked={this.state.editPrimaryAccess === "editPrimaryGroup"}
                                                                    onChange={(e) => { this.onValueChange("editPrimaryAccess", e.target.value) }}
                                                                />{' '}
                                                                Group Access
                                                            </Label>
                                                        </FormGroup>
                                                    </FormGroup>
                                                </FormGroup>
                                                <hr />
                                                <legend>Edit Secondary Contact</legend>
                                                <FormGroup>
                                                    <Label for="editSecondaryContactName">Name</Label>
                                                    <Input
                                                        type="text"
                                                        name="editSecondaryContactName"
                                                        id="editSecondaryContactName"
                                                        placeholder="Edit Secondary Contact Name"
                                                        value={this.state.editSecondaryContactName}
                                                        onChange={(e) => { this.onValueChange("editSecondaryContactName", e.target.value) }}
                                                    />
                                                    <Label for="editSecondaryContactEmail">Email</Label>
                                                    <Input
                                                        type="text"
                                                        name="editSecondaryContactEmail"
                                                        id="editSecondaryContactEmail"
                                                        placeholder="Edit Secondary Contact Email"
                                                        value={this.state.editSecondaryContactEmail}
                                                        onChange={(e) => { this.onValueChange("editSecondaryContactEmail", e.target.value) }}
                                                    />
                                                    <Label for="editSecondaryContactPhone">Phone</Label>
                                                    <Input
                                                        type="number"
                                                        name="editSecondaryContactPhone"
                                                        id="editSecondaryContactPhone"
                                                        placeholder="Edit Secondary Contact Phone"
                                                        value={this.state.editSecondaryContactPhone}
                                                        onChange={(e) => { this.onValueChange("editSecondaryContactPhone", e.target.value) }}
                                                    />
                                                    <FormGroup tag="fieldset">
                                                        <FormGroup check>
                                                            <Label check>
                                                                <Input
                                                                    type="radio"
                                                                    name="editSecondaryAccess"
                                                                    value="editSecondaryStore"
                                                                    checked={this.state.editSecondaryAccess == "editSecondaryStore"}
                                                                    onChange={(e) => { this.onValueChange("editSecondaryAccess", e.target.value) }}
                                                                />{' '}
                                                                Store Access
                                                            </Label>
                                                        </FormGroup>
                                                        <FormGroup check>
                                                            <Label check>
                                                                <Input
                                                                    type="radio"
                                                                    name="editSecondaryAccess"
                                                                    value="editSecondaryGroup"
                                                                    checked={this.state.editSecondaryAccess == "editSecondaryGroup"}
                                                                    onChange={(e) => { this.onValueChange("editSecondaryAccess", e.target.value) }}
                                                                />{' '}
                                                                Group Access
                                                            </Label>
                                                        </FormGroup>
                                                    </FormGroup>
                                                </FormGroup>
                                                <hr />
                                                <legend>Edit Text List</legend>
                                                <FormGroup>
                                                    {
                                                        this.state.editTextList.map((phoneNumber, i) => {
                                                            return <p key={i}>{phoneNumber}</p>
                                                        })
                                                    }
                                                    <Input value={this.state.newEditTextContact} onChange={(e) => { this.onValueChange("newEditTextContact", e.target.value) }} type="tel" />
                                                    <Button disabled={this.state.newEditTextContact.length != 10} color="danger" onClick={(e) => { this.removeFromEditTextList(this.state.newEditTextContact) }}>
                                                        <i className="tim-icons icon-simple-remove" />
                                                    </Button>
                                                    <Button disabled={this.state.newEditTextContact.length != 10} color="primary" onClick={(e) => { this.addToEditTextList(this.state.newEditTextContact) }}>
                                                        <i className="tim-icons icon-simple-add" />
                                                    </Button>
                                                </FormGroup>
                                                <hr />
                                                <legend>Edit Ring Central Number</legend>
                                                <FormGroup>
                                                    <Input
                                                        value={this.state.editRingCentral}
                                                        onChange={(e) => { this.onValueChange("editRingCentral", e.target.value) }}
                                                        type="number"
                                                    />
                                                </FormGroup>
                                                <Button color="warning" onClick={() => {
                                                    this.toggle("editDealerModal")
                                                    this.setState({ editDealership: { label: "", value: "" } })
                                                }}>Cancel</Button>
                                                <Button onClick={() => {
                                                    this.updateDealership()
                                                }} color="success" disabled={
                                                    this.state.editDealershipName.length === 0 ||
                                                    this.state.editDealershipGroup2.label == undefined ||
                                                    this.state.editTextList.length === 0 ||
                                                    this.state.editDealershipPhone.length != 10 ||
                                                    this.state.editAvgMonthlyLeadCount.length === 0 ||
                                                    this.state.editDealershipAddress.length === 0 ||
                                                    this.state.editAvgMonthlyRO.length === 0 ||
                                                    this.state.editPrimaryContactName.length === 0 ||
                                                    this.state.editPrimaryContactEmail.length === 0 ||
                                                    this.state.editPrimaryContactPhone.length !== 10 ||
                                                    this.state.editPrimaryAccess.length === 0 ||
                                                    this.state.editSecondaryContactName.length === 0 ||
                                                    this.state.editSecondaryContactEmail.length === 0 ||
                                                    this.state.editSecondaryContactPhone.length !== 10 ||
                                                    this.state.editSecondaryAccess.length === 0 ||
                                                    this.state.editRingCentral.length != 10
                                                    // access validation?
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

export default DealershipManagement;