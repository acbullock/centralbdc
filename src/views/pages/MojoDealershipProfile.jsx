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
            addDealerSalesPreferredName: "",
            addDealerPerks: "",
            addWebsiteURL: "",
            addNewSearchURL: "",
            addUsedSearchURL: "",
            addTradeInURL: "",
            addFinancingURL: "",
            addServiceURL: "",
            addWarrantyURL: "",
            addHomeDeliveryOfferedTF: false,
            addHomeDeliveryRadius: "",
            addHomeDeliveryFee: "",
            addNewCarDisclaimer: "",
            addUsedCarDisclaimer: "",
            addReturnPolicyTF: false,
            addReturnPolicyNumDays: "",
            addCarFaxPartnerID: "",
            addRegistrationFees: "",
            addDocumentaionFees: "",
            addOtherFees: "",

            //tooltips
            addDealerNameTooltip: false,
            addDealerAddressTooltip: false,
            addDealerPhoneTooltip: false,
            addDealerEmailTooltip: false,
            addDealerSalesPreferredNameTooltip: false,
            addDealerPerksTooltip: false,
            addDealerWebsiteURLTooltip: false,
            addNewSearchURLTooltip: false,
            addUsedSearchURLTooltip: false,
            addTradeInURLTooltip: false,
            addFinancingURLTooltip: false,
            addServiceURLTooltip: false,
            addWarrantyURLTooltip: false,
            addHomeDeliveryOfferedTFTooltip: false,
            addHomeDeliveryRadiusTooltip: false,
            addHomeDeliveryFeeTooltip: false,
            addReturnPolicyTFTooltip: false,
            addReturnPolicyNumDaysTooltip: false,
            addCarFaxPartnerIDTooltip: false,
            addRegistrationFeesTooltip: false,
            addDocumentationFeesTooltip: false,
            addOtherFeesTooltip: false,
            addDealerNameTooltip: false

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
            addDealerSalesPreferredName: "",
            addDealerPerks: "",
            addWebsiteURL: "",
            addNewSearchURL: "",
            addUsedSearchURL: "",
            addTradeInURL: "",
            addFinancingURL: "",
            addServiceURL: "",
            addWarrantyURL: "",
            addHomeDeliveryOfferedTF: false,
            addHomeDeliveryRadius: "",
            addHomeDeliveryFee: "",
            addNewCarDisclaimer: "",
            addUsedCarDisclaimer: "",
            addReturnPolicyTF: false,
            addReturnPolicyNumDays: "",
            addCarFaxPartnerID: "",
            addRegistrationFees: "",
            addDocumentaionFees: "",
            addOtherFees: "",
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
                                                    <p id="dealerNameTooltip" className="text-white">Dealership Name
                                                    <Tooltip placement="auto" isOpen={this.state.addDealerNameTooltip} target="dealerNameTooltip" toggle={() => this.toggleTooltip("addDealerNameTooltip")}>Provide customer with personalized information about the store that the vehicle’s located at</Tooltip>
                                                        <Input
                                                            style={{ backgroundColor: "white" }}
                                                            value={this.state.addDealerName}
                                                            onChange={(e) => { this.onValueChange("addDealerName", e.target.value) }}
                                                        />
                                                    </p>
                                                </FormGroup>
                                                <FormGroup>
                                                    <p id="dealerAddressTooltip" className="text-white">Dealership Address
                                                    <Tooltip placement="auto" isOpen={this.state.addDealerAddressTooltip} target="dealerAddressTooltip" toggle={() => this.toggleTooltip("addDealerAddressTooltip")}>Answer location questions</Tooltip>
                                                        <Input
                                                            style={{ backgroundColor: "white" }}
                                                            value={this.state.addDealerAddress}
                                                            onChange={(e) => { this.onValueChange("addDealerAddress", e.target.value) }}
                                                        />
                                                    </p>
                                                </FormGroup>
                                                <FormGroup>
                                                    <p id="dealerPhoneTooltip" className="text-white">Dealership Phone Number
                                                    <Tooltip placement="auto" isOpen={this.state.addDealerPhoneTooltip} target="dealerPhoneTooltip" toggle={() => this.toggleTooltip("addDealerPhoneTooltip")}>Answer contact questions</Tooltip>
                                                        <Input
                                                            style={{ backgroundColor: "white" }}
                                                            value={this.state.addDealerPhoneNumber}
                                                            onChange={(e) => { this.onValueChange("addDealerPhoneNumber", e.target.value) }}
                                                        />
                                                    </p>
                                                </FormGroup>
                                                <FormGroup>
                                                    <p id="dealerEmailTooltip" className="text-white">Dealership Email Address
                                                    <Tooltip placement="auto" isOpen={this.state.addDealerEmailTooltip} target="dealerEmailTooltip" toggle={() => this.toggleTooltip("addDealerEmailTooltip")}>Answer contact questions</Tooltip>
                                                        <Input
                                                            style={{ backgroundColor: "white" }}
                                                            value={this.state.addDealerEmailAddress}
                                                            onChange={(e) => { this.onValueChange("addDealerEmailAddress", e.target.value) }}
                                                        />
                                                    </p>
                                                </FormGroup>
                                                <FormGroup>
                                                    <p id="dealerSalesPreferredNameTooltip" className="text-white">Preferred name for sales staff (i.e. “Sales Advisor”, “Audi Ownership Advisor”, etc.”)
                                                    <Tooltip placement="auto" isOpen={this.state.addDealerSalesPreferredNameTooltip} target="dealerSalesPreferredNameTooltip" toggle={() => this.toggleTooltip("addDealerSalesPreferredNameTooltip")}>Ability to customize talk-offs</Tooltip>
                                                        <Input
                                                            style={{ backgroundColor: "white" }}
                                                            value={this.state.addDealerSalesPreferredName}
                                                            onChange={(e) => { this.onValueChange("addDealerSalesPreferredName", e.target.value) }}
                                                        />
                                                    </p>
                                                </FormGroup>
                                                <FormGroup>
                                                    <p id="dealerPerksTooltip" className="text-white">Dealership Perks (i.e. free car wash, free oil change, etc.)
                                                    <Tooltip placement="auto" isOpen={this.state.addDealerPerksTooltip} target="dealerPerksTooltip" toggle={() => this.toggleTooltip("addDealerPerksTooltip")}>Ability to tell the customer some benefits of buying from this dealer</Tooltip>
                                                        <Input
                                                            style={{ backgroundColor: "white" }}
                                                            value={this.state.addDealerPerks}
                                                            onChange={(e) => { this.onValueChange("addDealerPerks", e.target.value) }}
                                                        />
                                                    </p>
                                                </FormGroup>
                                                <FormGroup>
                                                    <p id="dealerWebsiteURLTooltip" className="text-white">Website URL
                                                    <Tooltip placement="auto" isOpen={this.state.addDealerWebsiteURLTooltip} target="dealerWebsiteURLTooltip" toggle={() => this.toggleTooltip("addDealerWebsiteURLTooltip")}>Ability to answer website url and listings questions (if a vdp url is not available)</Tooltip>
                                                        <Input
                                                            style={{ backgroundColor: "white" }}
                                                            value={this.state.addWebsiteURL}
                                                            onChange={(e) => { this.onValueChange("addWebsiteURL", e.target.value) }}
                                                        />
                                                    </p>
                                                </FormGroup>
                                                <FormGroup>
                                                    <p id="newSearchURLTooltip" className="text-white">Inventory Search URL - New Cars
                                                    <Tooltip placement="auto" isOpen={this.state.addNewSearchURLTooltip} target="newSearchURLTooltip" toggle={() => this.toggleTooltip("addNewSearchURLTooltip")}>Ability to send a customer to the search page (if vdp urls are not available)</Tooltip>
                                                        <Input
                                                            style={{ backgroundColor: "white" }}
                                                            value={this.state.addNewSearchURL}
                                                            onChange={(e) => { this.onValueChange("addNewSearchURL", e.target.value) }}
                                                        />
                                                    </p>
                                                </FormGroup>
                                                <FormGroup>
                                                    <p id="usedSearchURLTooltip" className="text-white">Inventory Search URL - Used Cars
                                                    <Tooltip placement="auto" isOpen={this.state.addUsedSearchURLTooltip} target="usedSearchURLTooltip" toggle={() => this.toggleTooltip("addUsedSearchURLTooltip")}>Ability to send a customer to the search page (if vdp urls are not available)</Tooltip>
                                                        <Input
                                                            style={{ backgroundColor: "white" }}
                                                            value={this.state.addUsedSearchURL}
                                                            onChange={(e) => { this.onValueChange("addUsedSearchURL", e.target.value) }}
                                                        />
                                                    </p>
                                                </FormGroup>
                                                <FormGroup>
                                                    <p id="tradeInURLTooltip" className="text-white">Trade-In Form URL
                                                    <Tooltip placement="auto" isOpen={this.state.addTradeInURLTooltip} target="tradeInURLTooltip" toggle={() => this.toggleTooltip("addTradeInURLTooltip")}>Ability to answer trade-in questions with a “next step” action, which is go fill out this form to get a trade-in value.</Tooltip>
                                                        <Input
                                                            style={{ backgroundColor: "white" }}
                                                            value={this.state.addTradeInURL}
                                                            onChange={(e) => { this.onValueChange("addTradeInURL", e.target.value) }}
                                                        />
                                                    </p>
                                                </FormGroup>
                                                <FormGroup>
                                                    <p id="financingURLTooltip" className="text-white">Financing Page URL
                                                    <Tooltip placement="auto" isOpen={this.state.addFinancingURLTooltip} target="financingURLTooltip" toggle={() => this.toggleTooltip("addFinancingURLTooltip")}>Ability to answer trade-in questions with a “next step” action, which is go fill out this form to get a payment estimate</Tooltip>
                                                        <Input
                                                            style={{ backgroundColor: "white" }}
                                                            value={this.state.addFinancingURL}
                                                            onChange={(e) => { this.onValueChange("addFinancingURL", e.target.value) }}
                                                        />
                                                    </p>
                                                </FormGroup>
                                                <FormGroup>
                                                    <p id="serviceURLTooltip" className="text-white">Service Page URL
                                                        <Tooltip placement="auto" isOpen={this.state.addServiceURLTooltip} target="serviceURLTooltip" toggle={() => this.toggleTooltip("addServiceURLTooltip")}>Ability to answer trade-in questions with a “next step” action, which is go fill out this form to get a payment estimate</Tooltip>
                                                        <Input
                                                            style={{ backgroundColor: "white" }}
                                                            value={this.state.addServiceURL}
                                                            onChange={(e) => { this.onValueChange("addServiceURL", e.target.value) }}
                                                        />
                                                    </p>
                                                </FormGroup>
                                                <FormGroup>
                                                    <p id="warrantyURLTooltip" className="text-white">Warranty/VSC Page URL
                                                        <Tooltip placement="auto" isOpen={this.state.addWarrantyURLTooltip} target="warrantyURLTooltip" toggle={() => this.toggleTooltip("addWarrantyURLTooltip")}>Ability to provide more detail around extended warranties, and instructing the customer to read more about them on the dealer’s page</Tooltip>
                                                        <Input
                                                            style={{ backgroundColor: "white" }}
                                                            value={this.state.addWarrantyURL}
                                                            onChange={(e) => { this.onValueChange("addWarrantyURL", e.target.value) }}
                                                        />
                                                    </p>
                                                </FormGroup>
                                                <br />
                                                <FormGroup>
                                                    <p id="homeDeliveryOfferedTF" className="text-white">
                                                        <Tooltip placement="auto" isOpen={this.state.addHomeDeliveryOfferedTFTooltip} target="homeDeliveryOfferedTF" toggle={() => this.toggleTooltip("addHomeDeliveryOfferedTFTooltip")}>Ability to answer do you deliver yes / no questions</Tooltip>
                                                        <Input
                                                            style={{ margin: "20px" }}
                                                            type="checkbox"
                                                            checked={this.state.addHomeDeliveryOfferedTF}
                                                            onChange={(e) => { this.setState({ addHomeDeliveryOfferedTF: !this.state.addHomeDeliveryOfferedTF }) }}
                                                        />Home Delivery Offered (T/F)
                                                    </p>
                                                </FormGroup>
                                                <br />
                                                <FormGroup>
                                                    <p id="homeDeliveryRadiusTooltip" className="text-white">Home Delivery Radius
                                                    <Tooltip placement="auto" isOpen={this.state.addHomeDeliveryRadiusTooltip} target="homeDeliveryRadiusTooltip" toggle={() => this.toggleTooltip("addHomeDeliveryRadiusTooltip")}>Ability to calculate if delivery is available</Tooltip>
                                                        <Input
                                                            style={{ backgroundColor: "white" }}
                                                            value={this.state.addHomeDeliveryRadius}
                                                            onChange={(e) => { this.onValueChange("addHomeDeliveryRadius", e.target.value) }}
                                                        />
                                                    </p>
                                                </FormGroup>
                                                <FormGroup>
                                                    <p id="homeDeliveryFeeTooltip" className="text-white">Home Delivery Fee
                                                    <Tooltip placement="auto" isOpen={this.state.addHomeDeliveryFeeTooltip} target="homeDeliveryFeeTooltip" toggle={() => this.toggleTooltip("addHomeDeliveryFeeTooltip")}>Ability to tell the customer how much delivery costs</Tooltip>

                                                        <Input
                                                            style={{ backgroundColor: "white" }}
                                                            value={this.state.addHomeDeliveryFee}
                                                            onChange={(e) => { this.onValueChange("addHomeDeliveryFee", e.target.value) }}
                                                        />
                                                    </p>
                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="text-white">New Car Disclaimer
                                                    <Input
                                                            style={{ backgroundColor: "white" }}
                                                            value={this.state.addNewCarDisclaimer}
                                                            onChange={(e) => { this.onValueChange("addNewCarDisclaimer", e.target.value) }}
                                                        />
                                                    </p>
                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="text-white">Used Car Disclaimer
                                                    <Input
                                                            style={{ backgroundColor: "white" }}
                                                            value={this.state.addUsedCarDisclaimer}
                                                            onChange={(e) => { this.onValueChange("addUsedCarDisclaimer", e.target.value) }}
                                                        />
                                                    </p>
                                                </FormGroup>
                                                <br />
                                                <FormGroup>
                                                    <p id="returnPolicyTF" className="text-white">
                                                        <Tooltip placement="auto" isOpen={this.state.addReturnPolicyTFTooltip} target="returnPolicyTF" toggle={() => this.toggleTooltip("addReturnPolicyTFTooltip")}>Ability to tell the customer if the dealer has a return policy</Tooltip>
                                                        <Input
                                                            style={{ margin: "20px" }}
                                                            type="checkbox"
                                                            checked={this.state.addReturnPolicyTF}
                                                            onChange={(e) => { this.setState({ addReturnPolicyTF: !this.state.addReturnPolicyTF }) }}
                                                        />Return Policy (T/F)
                                                    </p>
                                                </FormGroup>
                                                <br />
                                                <FormGroup>
                                                    <p id="returnPolicyNumDaysTooltip" className="text-white">Return Policy - # of days
                                                    <Tooltip placement="auto" isOpen={this.state.addReturnPolicyNumDaysTooltip} target="returnPolicyNumDaysTooltip" toggle={() => this.toggleTooltip("addReturnPolicyNumDaysTooltip")}>Ability to tell the customer how many days a return policy is valid for</Tooltip>
                                                        <Input
                                                            style={{ backgroundColor: "white" }}
                                                            value={this.state.addReturnPolicyNumDays}
                                                            onChange={(e) => { this.onValueChange("addReturnPolicyNumDays", e.target.value) }}
                                                        />
                                                    </p>
                                                </FormGroup>
                                                <FormGroup>
                                                    <p id="carFaxPartnerIDTooltip" className="text-white">CarFax Partner ID
                                                    <Tooltip placement="auto" isOpen={this.state.addCarFaxPartnerIDTooltip} target="carFaxPartnerIDTooltip" toggle={() => this.toggleTooltip("addCarFaxPartnerIDTooltip")}>Ability to generate a carfax url (if one is not provided in the vehicle api)</Tooltip>
                                                        <Input
                                                            style={{ backgroundColor: "white" }}
                                                            value={this.state.addCarFaxPartnerID}
                                                            onChange={(e) => { this.onValueChange("addCarFaxPartnerID", e.target.value) }}
                                                        />
                                                    </p>
                                                </FormGroup>
                                                <FormGroup>
                                                    <p id="registrationFeesTooltip" className="text-white">Registration Fees
                                                    <Tooltip placement="auto" isOpen={this.state.addRegistrationFeesTooltip} target="registrationFeesTooltip" toggle={() => this.toggleTooltip("addRegistrationFeesTooltip")}>Ability to tell the customer the Dollar or % of price that the registration fee is</Tooltip>
                                                        <Input
                                                            style={{ backgroundColor: "white" }}
                                                            value={this.state.addRegistrationFees}
                                                            onChange={(e) => { this.onValueChange("addRegistrationFees", e.target.value) }}
                                                        />
                                                    </p>
                                                </FormGroup>
                                                <FormGroup>
                                                    <p id="documentationFeesTooltip" className="text-white">Documentation Fees
                                                    <Tooltip placement="auto" isOpen={this.state.addDocumentationFeesTooltip} target="documentationFeesTooltip" toggle={() => this.toggleTooltip("addDocumentationFeesTooltip")}>Ability to tell the customer how much documentation fees are</Tooltip>
                                                        <Input
                                                            style={{ backgroundColor: "white" }}
                                                            value={this.state.addDocumentaionFees}
                                                            onChange={(e) => { this.onValueChange("addDocumentaionFees", e.target.value) }}
                                                        />
                                                    </p>
                                                </FormGroup>
                                                <FormGroup>
                                                    <p id="otherFeesTooltip" className="text-white">Other Fees (Name, Amount)
                                                    <Tooltip placement="auto" isOpen={this.state.addOtherFeesTooltip} target="otherFeesTooltip" toggle={() => this.toggleTooltip("addOtherFeesTooltip")}>Ability to tell the customer how much other fees may be</Tooltip>
                                                        <Input
                                                            style={{ backgroundColor: "white" }}
                                                            value={this.state.addOtherFees}
                                                            onChange={(e) => { this.onValueChange("addOtherFees", e.target.value) }}
                                                        />
                                                    </p>
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