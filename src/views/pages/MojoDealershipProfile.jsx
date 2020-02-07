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
    Form,
    Tooltip
} from "reactstrap";
import Select from 'react-select'

class MojoDealershipProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            addHidden: true,
            editHidden: true,
            // add values
            addDealerName: "",
            addDealerAddress: "",
            addDealerPhoneNumber: "",
            addDealerEmailAddress: "",
            addWebsiteURL: "",
            addNewSearchURL: "",
            addUsedSearchURL: "",
            addTradeInURL: "",
            addFinancingURL: "",
            addServiceURL: "",
            addWarrantyURL: "",
            addHomeDeliveryRadius: "",
            addHomeDeliveryFee: "",
            addReturnPolicyNumDays: "",
            addCarFaxPartnerID: "",


            //tooltips
            addDealerNameTooltip: false,
            addDealerAddressTooltip: false,
            addDealerPhoneTooltip: false,
            addDealerEmailTooltip: false,
            addDealerWebsiteURLTooltip: false,
            addNewSearchURLTooltip: false,
            addUsedSearchURLTooltip: false

        }


        this.addNewDealerProfile = this.addNewDealerProfile.bind(this)
        this.onValueChange = this.onValueChange.bind(this)
        this.clearAddValues = this.clearAddValues.bind(this)
        this.toggleTooltip = this.toggleTooltip.bind(this)
        this._isMounted = false
    }
    async componentWillMount() {
        this._isMounted = true
        this._isMounted && this.setState({ loading: true })
        // this.setState({dealershipGroups: groups})
        this._isMounted && this.setState({ loading: false })
    }
    componentDidMount() {
        this._isMounted = true
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    async addNewDealerProfile(e) {
        e.preventDefault();

    }
    toggleTooltip(name) {
        this.setState({ [name]: !this.state[name] })
    }
    onValueChange(key, value) {
        this._isMounted && this.setState({ [key]: value })
    }
    clearAddValues() {
        this._isMounted && this.setState({
            addDealerName: "",
            addDealerAddress: "",
            addDealerPhoneNumber: "",
            addDealerEmailAddress: "",
            addWebsiteURL: "",
            addNewSearchURL: "",
            addUsedSearchURL: "",
            addTradeInURL: "",
            addFinancingURL: "",
            addServiceURL: "",
            addWarrantyURL: "",
            addHomeDeliveryRadius: "",
            addHomeDeliveryFee: "",
            addReturnPolicyNumDays: "",
            addCarFaxPartnerID: "",
            addHidden: true
        })
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
                            <Card style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardBody>
                                    <Row style={{ justifyContent: 'center' }}>
                                        <Button color="neutral" onClick={() => { this.setState({ addHidden: false, editHidden: true }) }}>Add New Dealership Profile</Button>
                                        <Button color="secondary" onClick={() => { this.clearAddValues(); this.setState({ editHidden: false }) }}>Edit Existing Dealership Profile</Button>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row hidden={this.state.addHidden}>
                        <Col className="ml-auto mr-auto" md="8">
                            <Card style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardBody>
                                    <Row style={{ justifyContent: 'center' }}>
                                        <Col md="10" >
                                            <Form>
                                                <FormGroup>
                                                    <p id="dealerNameTooltip" className="text-white">Dealership Name</p>
                                                    <Tooltip placement="auto" isOpen={this.state.addDealerNameTooltip} target="dealerNameTooltip" toggle={() => this.toggleTooltip("addDealerNameTooltip")}>Provide customer with personalized information about the store that the vehicle’s located at</Tooltip>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.addDealerName}
                                                        onChange={(e) => { this.onValueChange("addDealerName", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <p id="dealerAddressTooltip" className="text-white">Dealership Address</p>
                                                    <Tooltip placement="auto" isOpen={this.state.addDealerAddressTooltip} target="dealerAddressTooltip" toggle={() => this.toggleTooltip("addDealerAddressTooltip")}>Answer location questions</Tooltip>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.addDealerAddress}
                                                        onChange={(e) => { this.onValueChange("addDealerAddress", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <p id="dealerPhoneTooltip" className="text-white">Dealership Phone Number</p>
                                                    <Tooltip placement="auto" isOpen={this.state.addDealerPhoneTooltip} target="dealerPhoneTooltip" toggle={() => this.toggleTooltip("addDealerPhoneTooltip")}>Answer contact questions</Tooltip>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.addDealerPhoneNumber}
                                                        onChange={(e) => { this.onValueChange("addDealerPhoneNumber", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <p id="dealerEmailTooltip" className="text-white">Dealership Email Address</p>
                                                    <Tooltip placement="auto" isOpen={this.state.addDealerEmailTooltip} target="dealerEmailTooltip" toggle={() => this.toggleTooltip("addDealerEmailTooltip")}>Answer contact questions</Tooltip>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.addDealerEmailAddress}
                                                        onChange={(e) => { this.onValueChange("addDealerEmailAddress", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <p id="dealerWebsiteURLTooltip" className="text-white">Website URL</p>
                                                    <Tooltip placement="auto" isOpen={this.state.addDealerWebsiteURLTooltip} target="dealerWebsiteURLTooltip" toggle={() => this.toggleTooltip("addDealerWebsiteURLTooltip")}>Ability to answer website url and listings questions (if a vdp url is not available)</Tooltip>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.addWebsiteURL}
                                                        onChange={(e) => { this.onValueChange("addWebsiteURL", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <p id="newSearchURLTooltip" className="text-white">Inventory Search URL - New Cars</p>
                                                    <Tooltip placement="auto" isOpen={this.state.addNewSearchURLTooltip} target="newSearchURLTooltip" toggle={() => this.toggleTooltip("addNewSearchURLTooltip")}>Ability to send a customer to the search page (if vdp urls are not available)</Tooltip>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.addNewSearchURL}
                                                        onChange={(e) => { this.onValueChange("addNewSearchURL", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <p id="usedSearchURLTooltip" className="text-white">Inventory Search URL - Used Cars</p>
                                                    <Tooltip placement="auto" isOpen={this.state.addUsedSearchURLTooltip} target="usedSearchURLTooltip" toggle={() => this.toggleTooltip("addUsedSearchURLTooltip")}>Ability to send a customer to the search page (if vdp urls are not available)</Tooltip>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.addUsedSearchURL}
                                                        onChange={(e) => { this.onValueChange("addUsedSearchURL", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="text-white">Trade-In Form URL</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.addTradeInURL}
                                                        onChange={(e) => { this.onValueChange("addTradeInURL", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="text-white">Financing Page URL</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.addFinancingURL}
                                                        onChange={(e) => { this.onValueChange("addFinancingURL", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="text-white">Service Page URL</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.addServiceURL}
                                                        onChange={(e) => { this.onValueChange("addServiceURL", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="text-white">Warranty/VSC Page URL</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.addWarrantyURL}
                                                        onChange={(e) => { this.onValueChange("addWarrantyURL", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="text-white">Home Delivery Radius</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.addHomeDeliveryRadius}
                                                        onChange={(e) => { this.onValueChange("addHomeDeliveryRadius", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="text-white">Home Delivery Fee</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.addHomeDeliveryFee}
                                                        onChange={(e) => { this.onValueChange("addHomeDeliveryFee", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="text-white">Return Policy - # of days</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.addReturnPolicyNumDays}
                                                        onChange={(e) => { this.onValueChange("addReturnPolicyNumDays", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="text-white">CarFax Partner ID</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.addCarFaxPartnerID}
                                                        onChange={(e) => { this.onValueChange("addCarFaxPartnerID", e.target.value) }}
                                                    />
                                                </FormGroup>
                                            </Form>
                                        </Col>
                                    </Row>
                                    <Row style={{ justifyContent: 'center' }}>
                                        {/* clear add values on cancel click */}
                                        <Button color="warning" onClick={() => { this.clearAddValues(); }}>Cancel</Button>
                                        <Button type="submit" color="success" onClick={(e) => this.addNewDealerProfile(e)}>Submit</Button>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row hidden={this.state.editHidden}>
                        <Card style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                            <CardBody>
                                <Row style={{ justifyContent: 'center' }}>
                                    {/* clear EDIT values on cancel click */}
                                    <Button color="warning" onClick={() => { this.setState({ editHidden: true }) }}>Cancel</Button>
                                </Row>
                            </CardBody>
                        </Card>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default MojoDealershipProfile;