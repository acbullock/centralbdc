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
            addServiceTextList: [],
            addDealershipName: "",
            addDealershipGroup: {},
            addDealershipPhone: "",
            addRingCentral: "",
            addRingCentralService: "",
            addDataMining: "",
            addSales: "",
            addIsActive: "",
            addIsSales: false,
            addIsService: false,
            newTextContact: "",
            newServiceContact: "",
            dealershipGroups: [],
            avgMonthlyLeadCount: "",
            avgMonthlyRO: "",
            avgMonthlyPhoneUps: "",
            dailyApptGoal: "",
            dealershipAddress: "",
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
            editAvgMonthlyPhoneUps: "",
            editDailyApptGoal: "",
            editTextList: [],
            editServiceTextList: [],
            newEditTextContact: "",
            newEditServiceContact: "",
            editRingCentral: "",
            editRingCentralService: "",
            editDataMining: "",
            editSales: "",
            editIsActive: "",
            editIsService: false,
            editIsSales: false
        }
        this.toggle = this.toggle.bind(this)
        this.addToTextList = this.addToTextList.bind(this)
        this.addToServiceList = this.addToServiceList.bind(this)
        this.onValueChange = this.onValueChange.bind(this)
        this.deleteGroup = this.deleteGroup.bind(this)
        this.updateGroupName = this.updateGroupName.bind(this)
        this.addNewDealershp = this.addNewDealershp.bind(this)
        this.updateDealership = this.updateDealership.bind(this)
        this.addToEditTextList = this.addToEditTextList.bind(this)
        this.removeFromEditTextList = this.removeFromEditTextList.bind(this)
        this.removeFromTextList = this.removeFromTextList.bind(this)
        this.removeFromServiceList = this.removeFromServiceList.bind(this)
        this.getGroup = this.getGroup.bind(this)
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
    async getGroup(id) {
        let g = await this.props.mongo.findOne("dealership_groups", { _id: id })
        return g
    }
    addToTextList(phoneNumber) {
        let arr = this.state.addTextList
        if (arr.indexOf(phoneNumber) == -1)
            arr.push(phoneNumber)
        this.setState({ addTextList: arr, newTextContact: "" })
    }
    addToServiceList(phoneNumber) {
        let arr = this.state.addServiceTextList
        if (arr.indexOf(phoneNumber) == -1)
            arr.push(phoneNumber)
        this.setState({ addServiceTextList: arr, newServiceContact: "" })
    }
    removeFromTextList(phoneNumber) {
        let arr = this.state.addTextList
        if (arr.indexOf(phoneNumber) != -1)
            arr.splice(arr.indexOf(phoneNumber), 1);
        this.setState({ addTextList: arr, newTextContact: "" })
    }
    removeFromServiceList(phoneNumber) {
        let arr = this.state.addServiceTextList
        if (arr.indexOf(phoneNumber) != -1)
            arr.splice(arr.indexOf(phoneNumber), 1);
        this.setState({ addServiceTextList: arr, newServiceContact: "" })
    }
    async addToEditTextList(phoneNumber) {
        let arr = this.state.editTextList
        if (arr.indexOf(phoneNumber) == -1)
            arr.push(phoneNumber)
        this.setState({ editTextList: arr, newEditTextContact: "" })
    }
    async addToEditServiceList(phoneNumber) {
        let arr = this.state.editServiceTextList
        if (arr.indexOf(phoneNumber) == -1)
            arr.push(phoneNumber)
        this.setState({ editServiceTextList: arr, newEditServiceContact: "" })
    }
    removeFromEditTextList(phoneNumber) {
        let arr = this.state.editTextList
        if (arr.indexOf(phoneNumber) != -1)
            arr.splice(arr.indexOf(phoneNumber), 1);
        this.setState({ editTextList: arr, newEditTextContact: "" })
    }
    removeFromEditServiceList(phoneNumber) {
        let arr = this.state.editServiceTextList
        if (arr.indexOf(phoneNumber) != -1)
            arr.splice(arr.indexOf(phoneNumber), 1);
        this.setState({ editServiceTextList: arr, newEditServiceContact: "" })
    }
    onValueChange(key, value) {
        this.setState({ [key]: value })
    }
    clearAddValues() {
        this.setState({
            addDealershipName: "",
            newTextContact: "",
            newServiceContact: "",
            addDealershipGroup: {},
            addTextList: [],
            addServiceTextList: [],
            addDealershipPhone: "",
            avgMonthlyLeadCount: "",
            dealershipAddress: "",
            avgMonthlyRO: "",
            avgMonthlyPhoneUps: "",
            dailyApptGoal: "",
            addRingCentral: "",
            addRingCentralService: "",
            newDealershipGroup: "",
            addDataMining: "",
            addSales: "",
            addIsSales: false,
            addIsService: false,
            addIsActive: ""

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
            group: this.state.addDealershipGroup.value,
            phone: this.state.addDealershipPhone,
            address: this.state.dealershipAddress,
            average_monthly_lead_count: this.state.avgMonthlyLeadCount,
            average_montly_ro_count: this.state.avgMonthlyRO,
            average_monthly_phone_ups: this.state.avgMonthlyPhoneUps,
            goal: this.state.dailyApptGoal,
            textFrom: this.state.addRingCentral,
            serviceTextFrom: this.state.addRingCentralService,
            contacts: this.state.addTextList,
            serviceContacts: this.state.addServiceTextList,
            dataMining: "+1" + this.state.addDataMining,
            sales: "+1" + this.state.addSales,
            isSales: this.state.addIsSales,
            isService: this.state.addIsService,
            isActive: this.state.addIsActive === "active",
            salesHours: [
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
            serviceHours: [
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
        }
        //insert dealer
        let inserted = this._isMounted && await this.props.mongo.insertOne("dealerships", newDealership)
        //update dealer to have 'value'
        this._isMounted && await this.props.mongo.findOneAndUpdate("dealerships", newDealership, { value: inserted.insertedId })

        //insert new dealer into appointments and recordings collections..
        this._isMounted && await this.props.mongo.insertOne("appointments", { dealership: inserted.insertedId, appointments: [] })
        this._isMounted && await this.props.mongo.insertOne("recordings", { dealership: inserted.insertedId, lastMonthCount: 0, thisMonthCount: 0 })
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
            group: this.state.editDealershipGroup2.value,
            phone: this.state.editDealershipPhone,
            address: this.state.editDealershipAddress,
            average_monthly_lead_count: this.state.editAvgMonthlyLeadCount,
            average_montly_ro_count: this.state.editAvgMonthlyRO,
            average_monthly_phone_ups: this.state.editAvgMonthlyPhoneUps,
            goal: this.state.editDailyApptGoal,
            textFrom: this.state.editRingCentral,
            serviceTextFrom: this.state.editRingCentralService,
            contacts: this.state.editTextList,
            serviceContacts: this.state.editServiceTextList,
            dataMining: "+1" + this.state.editDataMining,
            sales: "+1" + this.state.editSales,
            isActive: this.state.editIsActive === "active",
            isSales: this.state.editIsSales,
            isService: this.state.editIsService
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
        //delete dealership, also delete from appts and recordings..
        this._isMounted && await this.props.mongo.findOneAndDelete("dealerships", this.state.editDealership)
        this._isMounted && await this.props.mongo.findOneAndDelete("recordings", { dealership: this.state.editDealership.value })
        this._isMounted && await this.props.mongo.findOneAndDelete("appointments", { dealership: this.state.editDealership.value })
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
                                    <h2>Add Dealership</h2>
                                    <Button color="primary" onClick={() => { this.toggle("addModal") }}>
                                        <i className="tim-icons icon-simple-add"></i>
                                    </Button>
                                    <Modal isOpen={this.state.addModal} toggle={() => { this.toggle("addModal") }} style={{ 'maxHeight': 'calc(100vh - 210px)' }}>
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
                                                <FormGroup>
                                                    <Label for="avgMonthlyPhoneUps">Average Monthly Phone-Ups</Label>
                                                    <Input
                                                        type="number"
                                                        name="avgMonthlyPhoneUps"
                                                        id="avgMonthlyPhoneUps"
                                                        placeholder="Average Monthly Phone-Ups"
                                                        value={this.state.avgMonthlyPhoneUps}
                                                        onChange={(e) => { this.onValueChange("avgMonthlyPhoneUps", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="dailyApptGoal">Daily Appointment Goal</Label>
                                                    <Input
                                                        type="number"
                                                        name="dailyApptGoal"
                                                        id="dailyApptGoal"
                                                        placeholder="Daily Appointment Goal"
                                                        value={this.state.dailyApptGoal}
                                                        onChange={(e) => { this.onValueChange("dailyApptGoal", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <hr />
                                                <legend>Sales Contact List</legend>
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
                                                <legend>Service Contact List</legend>
                                                <FormGroup>
                                                    {
                                                        this.state.addServiceTextList.map((phoneNumber, i) => {
                                                            return <p key={i}>{phoneNumber}</p>
                                                        })
                                                    }
                                                    <Input value={this.state.newServiceContact} onChange={(e) => { this.onValueChange("newServiceContact", e.target.value) }} type="tel" />
                                                    <Button disabled={this.state.newServiceContact.length != 10} color="danger" onClick={(e) => { this.removeFromServiceList(this.state.newServiceContact) }}>
                                                        <i className="tim-icons icon-simple-remove" />
                                                    </Button>
                                                    <Button disabled={this.state.newServiceContact.length != 10} color="primary" onClick={(e) => { this.addToServiceList(this.state.newServiceContact) }}>
                                                        <i className="tim-icons icon-simple-add" />
                                                    </Button>
                                                </FormGroup>
                                                <hr />
                                                <legend>Ring Central Number (Sales)</legend>
                                                <FormGroup>
                                                    <Input
                                                        value={this.state.addRingCentral}
                                                        onChange={(e) => { this.onValueChange("addRingCentral", e.target.value) }}
                                                        type="number"
                                                    />
                                                </FormGroup>
                                                <hr />
                                                <legend>Ring Central Number (Service)</legend>
                                                <FormGroup>
                                                    <Input
                                                        value={this.state.addRingCentralService}
                                                        onChange={(e) => { this.onValueChange("addRingCentralService", e.target.value) }}
                                                        type="number"
                                                    />
                                                </FormGroup>
                                                <hr />
                                                <legend>Data Mining Number</legend>
                                                <FormGroup>
                                                    <Input
                                                        value={this.state.addDataMining}
                                                        onChange={(e) => { this.onValueChange("addDataMining", e.target.value) }}
                                                        type="number"
                                                    />
                                                </FormGroup>
                                                <hr />
                                                <legend>Sales Number</legend>
                                                <FormGroup>
                                                    <Input
                                                        value={this.state.addSales}
                                                        onChange={(e) => { this.onValueChange("addSales", e.target.value) }}
                                                        type="number"
                                                    />

                                                </FormGroup>
                                                <hr />
                                                <legend>Departments</legend>
                                                <FormGroup tag="fieldset">
                                                    <Label check>
                                                        <Input type="checkbox" checked={this.state.addIsSales} onClick={(e) => { this.setState({ addIsSales: !this.state.addIsSales }) }} />{' '}
                                                        Sales
                                                    </Label>
                                                    <br />
                                                    <Label check>
                                                        <Input type="checkbox" checked={this.state.addIsService} onClick={(e) => { this.setState({ addIsService: !this.state.addIsService }) }} />{' '}
                                                        Service
                                                    </Label>
                                                </FormGroup>
                                                <hr />
                                                <legend>Dealership is Active</legend>
                                                <FormGroup tag="fieldset">
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input type="radio" name="addIsActive" value="active" checked={this.state.addIsActive === "active"} onChange={(e) => { this.onValueChange("addIsActive", e.target.value) }} />
                                                            {' Yes'}
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input type="radio" name="addIsActive" value="inactive" checked={this.state.addIsActive === "inactive"} onChange={(e) => { this.onValueChange("addIsActive", e.target.value) }} />
                                                            {' No'}
                                                        </Label>
                                                    </FormGroup>
                                                </FormGroup>
                                                <Button color="warning" onClick={() => { this.toggle("addModal") }}>Cancel</Button>
                                                <Button onClick={() => {
                                                    this.addNewDealershp()
                                                }} color="success" disabled={
                                                    this.state.addDealershipName.length === 0 ||
                                                    this.state.addDealershipGroup.label == undefined ||
                                                    // this.state.addTextList.length === 0 ||
                                                    // this.state.addServiceTextList.length === 0 ||
                                                    // this.state.addDealershipPhone.length != 10 ||
                                                    // this.state.avgMonthlyLeadCount.length === 0 ||
                                                    this.state.dealershipAddress.length === 0 ||
                                                    // this.state.avgMonthlyRO.length === 0 ||
                                                    // this.state.avgMonthlyPhoneUps.length === 0 ||
                                                    // this.state.addRingCentral.length != 10 ||
                                                    // this.state.addRingCentralService.length != 10 ||
                                                    // this.state.addDataMining.length != 10 ||
                                                    // this.state.addSales.length != 10 ||
                                                    this.state.addIsActive.length === 0 ||
                                                    (this.state.addIsSales === false && this.state.addIsService === false)
                                                    // access validation?
                                                }>Submit</Button>
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
                                    <h2>Add Dealership Group</h2>
                                    <Button color="primary" onClick={() => { this.toggle("addDealerModal") }}>
                                        <i className="tim-icons icon-simple-add"></i>
                                    </Button>
                                    <Modal isOpen={this.state.addDealerModal} toggle={() => { this.toggle("addDealerModal") }} style={{ 'maxHeight': 'calc(100vh - 210px)' }}>
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
                        </Col>
                    </Row>
                    <Row>
                        <Col className="ml-auto mr-auto text-center" md="8">
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
                                    <Modal isOpen={this.state.editGroupModal} toggle={() => { this.toggle("editGroupModal") }} style={{ 'maxHeight': 'calc(100vh - 210px)' }}>
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

                        </Col>
                    </Row>
                    <Row>
                        <Col className="ml-auto mr-auto text-center" md="8">
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
                                        let group = await this.getGroup(this.state.editDealership.group)
                                        this.setState({ editDealership: d })
                                        this.setState({
                                            editDealershipName: this.state.editDealership.label,
                                            editDealershipPhone: this.state.editDealership.phone || "",
                                            editDealershipAddress: this.state.editDealership.address || "",
                                            editDealershipGroup2: group || { label: "", value: "" },
                                            editAvgMonthlyLeadCount: this.state.editDealership.average_monthly_lead_count || "",
                                            editAvgMonthlyRO: this.state.editDealership.average_montly_ro_count || "",
                                            editAvgMonthlyPhoneUps: this.state.editDealership.average_monthly_phone_ups || "",
                                            editDailyApptGoal: this.state.editDealership.goal || "",
                                            editTextList: this.state.editDealership.contacts || [],
                                            editServiceTextList: this.state.editDealership.serviceContacts || [],
                                            editRingCentral: this.state.editDealership.textFrom || "",
                                            editRingCentralService: this.state.editDealership.serviceTextFrom || "",
                                            editDataMining: this.state.editDealership.dataMining.substring(2, 12) || "",
                                            editSales: this.state.editDealership.sales.substring(2, 12) || "",
                                            editIsActive: this.state.editDealership.isActive == true ? "active" : "inactive",
                                            editIsSales: this.state.editDealership.isSales,
                                            editIsService: this.state.editDealership.isService
                                        })
                                        this.setState({ loading: false })
                                        this.toggle("editDealerModal");
                                    }}>Edit Dealership</Button>
                                    <Modal isOpen={this.state.editDealerModal} toggle={() => { this.toggle("editDealerModal") }} style={{ 'maxHeight': 'calc(100vh - 210px)' }}>
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
                                                        type="number"
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
                                                <FormGroup>
                                                    <Label for="editAvgMonthlyPhoneUps">Average Monthly Phone-Ups</Label>
                                                    <Input
                                                        type="number"
                                                        name="editAvgMonthlyPhoneUps"
                                                        id="editAvgMonthlyPhoneUps"
                                                        placeholder="Edit Average Monthly Phone-Ups"
                                                        value={this.state.editAvgMonthlyPhoneUps}
                                                        onChange={(e) => { this.onValueChange("editAvgMonthlyPhoneUps", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="editDailyApptGoal">Daily Appointment Goal</Label>
                                                    <Input
                                                        type="number"
                                                        name="editDailyApptGoal"
                                                        id="editDailyApptGoal"
                                                        placeholder="Edit Average Monthly Phone-Ups"
                                                        value={this.state.editDailyApptGoal}
                                                        onChange={(e) => { this.onValueChange("editDailyApptGoal", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <hr />
                                                <legend>Edit Sales Contact List</legend>
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
                                                <legend>Edit Service Contact List</legend>
                                                <FormGroup>
                                                    {
                                                        this.state.editServiceTextList.map((phoneNumber, i) => {
                                                            return <p key={i}>{phoneNumber}</p>
                                                        })
                                                    }
                                                    <Input value={this.state.newEditServiceContact} onChange={(e) => { this.onValueChange("newEditServiceContact", e.target.value) }} type="tel" />
                                                    <Button disabled={this.state.newEditServiceContact.length != 10} color="danger" onClick={(e) => { this.removeFromEditServiceList(this.state.newEditServiceContact) }}>
                                                        <i className="tim-icons icon-simple-remove" />
                                                    </Button>
                                                    <Button disabled={this.state.newEditServiceContact.length != 10} color="primary" onClick={(e) => { this.addToEditServiceList(this.state.newEditServiceContact) }}>
                                                        <i className="tim-icons icon-simple-add" />
                                                    </Button>
                                                </FormGroup>
                                                <hr />
                                                <legend>Edit Ring Central Number (Sales)</legend>
                                                <FormGroup>
                                                    <Input
                                                        value={this.state.editRingCentral}
                                                        onChange={(e) => { this.onValueChange("editRingCentral", e.target.value) }}
                                                        type="number"
                                                    />
                                                </FormGroup>
                                                <hr />
                                                <legend>Edit Ring Central Number (Service)</legend>
                                                <FormGroup>
                                                    <Input
                                                        value={this.state.editRingCentralService}
                                                        onChange={(e) => { this.onValueChange("editRingCentralService", e.target.value) }}
                                                        type="number"
                                                    />
                                                </FormGroup>
                                                <hr />
                                                <legend>Edit Data Mining Number</legend>
                                                <FormGroup>
                                                    <Input
                                                        value={this.state.editDataMining}
                                                        onChange={(e) => { this.onValueChange("editDataMining", e.target.value) }}
                                                        type="number"
                                                    />
                                                </FormGroup>
                                                <hr />
                                                <legend>Edit Sales Number</legend>
                                                <FormGroup>
                                                    <Input
                                                        value={this.state.editSales}
                                                        onChange={(e) => { this.onValueChange("editSales", e.target.value) }}
                                                        type="number"
                                                    />

                                                </FormGroup>
                                                <hr />
                                                <legend>Edit Departments</legend>
                                                <FormGroup tag="fieldset">
                                                    <Label check>
                                                        <Input type="checkbox" checked={this.state.editIsSales} onClick={(e) => { this.setState({ editIsSales: !this.state.editIsSales }) }} />{' '}
                                                        Sales
                                                    </Label>
                                                    <br />
                                                    <Label check>
                                                        <Input type="checkbox" checked={this.state.editIsService} onClick={(e) => { this.setState({ editIsService: !this.state.editIsService }) }} />{' '}
                                                        Service
                                                    </Label>
                                                </FormGroup>
                                                <hr />
                                                <hr />
                                                <legend>Edit Dealership is Active</legend>
                                                <FormGroup tag="fieldset">
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input type="radio" name="editIsActive" value="active" checked={this.state.editIsActive === "active"} onChange={(e) => { this.onValueChange("editIsActive", e.target.value) }} />
                                                            {' Yes'}
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input type="radio" name="editIsActive" value="inactive" checked={this.state.editIsActive === "inactive"} onChange={(e) => { this.onValueChange("editIsActive", e.target.value) }} />
                                                            {' No'}
                                                        </Label>
                                                    </FormGroup>
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
                                                    // this.state.editTextList.length === 0 ||
                                                    // this.state.editServiceTextList.length === 0 ||
                                                    // this.state.editDealershipPhone.length != 10 ||
                                                    // this.state.editAvgMonthlyLeadCount.length === 0 ||
                                                    this.state.editDealershipAddress.length === 0
                                                    // this.state.editAvgMonthlyRO.length === 0 ||
                                                    // this.state.editAvgMonthlyPhoneUps.length === 0 ||
                                                    // this.state.editRingCentral.length != 10 ||
                                                    // this.state.editRingCentralService.length != 10 ||
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