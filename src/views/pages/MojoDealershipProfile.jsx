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
    Tooltip,
    InputGroup
} from "reactstrap";
import Select from 'react-select'
import ReactDateTime from "react-datetime";
class MojoDealershipProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            profiles: [],
            selected_profile: null,
            addHidden: true,
            editHidden: true,
            // add values
            addDealerName: "",
            addDealerAddress: "",
            regMondayOpen: null,
            regMondayClose: null,
            regMondayClosed: false,
            regTuesdayOpen: null,
            regTuesdayClose: null,
            regTuesdayClosed: false,
            regWednesdayOpen: null,
            regWednesdayClose: null,
            regWednesdayClosed: false,
            regThursdayOpen: null,
            regThursdayClose: null,
            regThursdayClosed: false,
            regFridayOpen: null,
            regFridayClose: null,
            regFridayClosed: false,
            regSaturdayOpen: null,
            regSaturdayClose: null,
            regSaturdayClosed: false,
            regSundayOpen: null,
            regSundayClose: null,
            regSundayClosed: false,
            newYearsDayOpen: null,
            newYearsDayClose: null,
            newYearsDayClosed: false,
            easterOpen: null,
            easterClose: null,
            easterClosed: false,
            memorialDayOpen: null,
            memorialDayClose: null,
            memorialDayClosed: false,
            independenceDayOpen: null,
            independenceDayClose: null,
            independenceDayClosed: false,
            laborDayOpen: null,
            laborDayClose: null,
            laborDayClosed: false,
            thanksgivingOpen: null,
            thanksgivingClose: null,
            thanksgivingClosed: false,
            blackFridayOpen: null,
            blackFridayClose: null,
            blackFridayClosed: false,
            christmasEveOpen: null,
            christmasEveClose: null,
            christmasEveClosed: false,
            christmasDayOpen: null,
            christmasDayClose: null,
            christmasDayClosed: false,
            newYearsEveOpen: null,
            newYearsEveClose: null,
            newYearsEveClosed: false,
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
            //edit values
            editDealerName: "",
            editDealerAddress: "",
            regMondayOpen: null,
            editMondayOpen: null,
            editMondayClose: null,
            editMondayClosed: false,
            editTuesdayOpen: null,
            editTuesdayClose: null,
            editTuesdayClosed: false,
            editWednesdayOpen: null,
            editWednesdayClose: null,
            editWednesdayClosed: false,
            editThursdayOpen: null,
            editThursdayClose: null,
            editThursdayClosed: false,
            editFridayOpen: null,
            editFridayClose: null,
            editFridayClosed: false,
            editSaturdayOpen: null,
            editSaturdayClose: null,
            editSaturdayClosed: false,
            editSundayOpen: null,
            editSundayClose: null,
            editSundayClosed: false,
            editNewYearsDayOpen: null,
            editNewYearsDayClose: null,
            editNewYearsDayClosed: false,
            editEasterOpen: null,
            editEasterClose: null,
            editEasterClosed: false,
            editMemorialDayOpen: null,
            editMemorialDayClose: null,
            editMemorialDayClosed: false,
            editIndependenceDayOpen: null,
            editIndependenceDayClose: null,
            editIndependenceDayClosed: false,
            editLaborDayOpen: null,
            editLaborDayClose: null,
            editLaborDayClosed: false,
            editThanksgivingOpen: null,
            editThanksgivingClose: null,
            editThanksgivingClosed: false,
            editBlackFridayOpen: null,
            editBlackFridayClose: null,
            editBlackFridayClosed: false,
            editChristmasEveOpen: null,
            editChristmasEveClose: null,
            editChristmasEveClosed: false,
            editChristmasDayOpen: null,
            editChristmasDayClose: null,
            editChristmasDayClosed: false,
            editNewYearsEveOpen: null,
            editNewYearsEveClose: null,
            editNewYearsEveClosed: false,
            editDealerPhoneNumber: "",
            editDealerEmailAddress: "",
            editDealerSalesPreferredName: "",
            editDealerPerks: "",
            editWebsiteURL: "",
            editNewSearchURL: "",
            editUsedSearchURL: "",
            editTradeInURL: "",
            editFinancingURL: "",
            editServiceURL: "",
            editWarrantyURL: "",
            editHomeDeliveryOfferedTF: false,
            editHomeDeliveryRadius: "",
            editHomeDeliveryFee: "",
            editNewCarDisclaimer: "",
            editUsedCarDisclaimer: "",
            editReturnPolicyTF: false,
            editReturnPolicyNumDays: "",
            editCarFaxPartnerID: "",
            editRegistrationFees: "",
            editDocumentaionFees: "",
            editOtherFees: "",
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
            addDealerNameTooltip: false,

            //error texts
            addErrorText: "",
            editErrorText: ""

        }


        this.addNewDealerProfile = this.addNewDealerProfile.bind(this)
        this.updateNewDealerProfile = this.updateNewDealerProfile.bind(this)
        this.onValueChange = this.onValueChange.bind(this)
        this.clearAddValues = this.clearAddValues.bind(this)
        this.clearEditValues = this.clearEditValues.bind(this)
        this.populateEditFormValues = this.populateEditFormValues.bind(this)
        this.validateProfile = this.validateProfile.bind(this)
        this.toggleTooltip = this.toggleTooltip.bind(this)
        this._isMounted = false
    }
    async componentWillMount() {
        this._isMounted = true
        this._isMounted && this.setState({ loading: true })
        // this.setState({dealershipGroups: groups})
        let profiles = await this.props.mongo.find("mojo_dealership_profiles")
        this._isMounted && this.setState({ loading: false, profiles })
    }
    componentDidMount() {
        this._isMounted = true
    }
    componentWillUnmount() {
        this._isMounted = false
    }

    async addNewDealerProfile(e) {

        e.preventDefault();
        this.setState({ addErrorText: "" })
        let newDealerProfile = {
            dealershipName: this.props.utils.toTitleCase(this.state.addDealerName),
            dealershipAddress: this.state.addDealerAddress,
            normalHours: {
                monday: {
                    //set open and close to null if its closed that day ***
                    open: (this.state.regMondayOpen === null || this.state.regMondayClosed) ? null : this.state.regMondayOpen.getHours() * 60 + this.state.regMondayOpen.getMinutes(),
                    close: this.state.regMondayClose === null ? null : this.state.regMondayClose.getHours() * 60 + this.state.regMondayClose.getMinutes(),
                    closed: this.state.regMondayClosed
                },
                tuesday: {
                    open: (this.state.regTuesdayOpen === null || this.state.regTuesdayClosed) ? null : this.state.regTuesdayOpen.getHours() * 60 + this.state.regTuesdayOpen.getMinutes(),
                    close: this.state.regTuesdayClose === null ? null : this.state.regTuesdayClose.getHours() * 60 + this.state.regTuesdayClose.getMinutes(),
                    closed: this.state.regTuesdayClosed
                },
                wednesday: {
                    open: (this.state.regWednesdayOpen === null || this.state.regWednesdayClosed) ? null : this.state.regWednesdayOpen.getHours() * 60 + this.state.regWednesdayOpen.getMinutes(),
                    close: this.state.regWednesdayClose === null ? null : this.state.regWednesdayClose.getHours() * 60 + this.state.regWednesdayClose.getMinutes(),
                    closed: this.state.regWednesdayClosed
                },
                thursday: {
                    open: (this.state.regThursdayOpen === null || this.state.regThursdayClosed) ? null : this.state.regThursdayOpen.getHours() * 60 + this.state.regThursdayOpen.getMinutes(),
                    close: this.state.regThursdayClose === null ? null : this.state.regThursdayClose.getHours() * 60 + this.state.regThursdayClose.getMinutes(),
                    closed: this.state.regThursdayClosed
                },
                friday: {
                    open: (this.state.regFridayOpen === null || this.state.regFridayClosed) ? null : this.state.regFridayOpen.getHours() * 60 + this.state.regFridayOpen.getMinutes(),
                    close: this.state.regFridayClose === null ? null : this.state.regFridayClose.getHours() * 60 + this.state.regFridayClose.getMinutes(),
                    closed: this.state.regFridayClosed
                },
                saturday: {
                    open: (this.state.regSaturdayOpen === null || this.state.regSaturdayClosed) ? null : this.state.regSaturdayOpen.getHours() * 60 + this.state.regSaturdayOpen.getMinutes(),
                    close: this.state.regSaturdayClose === null ? null : this.state.regSaturdayClose.getHours() * 60 + this.state.regSaturdayClose.getMinutes(),
                    closed: this.state.regSaturdayClosed
                },
                sunday: {
                    open: (this.state.regSundayOpen === null || this.state.regSundayClosed) ? null : this.state.regSundayOpen.getHours() * 60 + this.state.regSundayOpen.getMinutes(),
                    close: this.state.regSundayClose === null ? null : this.state.regSundayClose.getHours() * 60 + this.state.regSundayClose.getMinutes(),
                    closed: this.state.regSundayClosed
                }
            },
            holidayHours: {
                newYearsDay: {
                    open: (this.state.newYearsDayOpen === null || this.state.newYearsDayClosed) ? null : this.state.newYearsDayOpen.getHours() * 60 + this.state.newYearsDayOpen.getMinutes(),
                    close: (this.state.newYearsDayClose === null || this.state.newYearsDayClosed) ? null : this.state.newYearsDayClose.getHours() * 60 + this.state.newYearsDayClose.getMinutes(),
                    closed: this.state.newYearsDayClosed
                },
                easter: {
                    open: (this.state.easterOpen === null || this.state.easterClosed) ? null : this.state.easterOpen.getHours() * 60 + this.state.easterOpen.getMinutes(),
                    close: (this.state.easterClose === null || this.state.easterClosed) ? null : this.state.easterClose.getHours() * 60 + this.state.easterClose.getMinutes(),
                    closed: this.state.easterClosed
                },
                memorialDay: {
                    open: (this.state.memorialDayOpen === null || this.state.memorialDayClosed) ? null : this.state.memorialDayOpen.getHours() * 60 + this.state.memorialDayOpen.getMinutes(),
                    close: (this.state.memorialDayClose === null || this.state.memorialDayClosed) ? null : this.state.memorialDayClose.getHours() * 60 + this.state.memorialDayClose.getMinutes(),
                    closed: this.state.memorialDayClosed
                },
                independenceDay: {
                    open: (this.state.independenceDayOpen === null || this.state.independenceDayClosed) ? null : this.state.independenceDayOpen.getHours() * 60 + this.state.independenceDayOpen.getMinutes(),
                    close: (this.state.independenceDayClose === null || this.state.independenceDayClosed) ? null : this.state.independenceDayClose.getHours() * 60 + this.state.independenceDayClose.getMinutes(),
                    closed: this.state.independenceDayClosed
                },
                laborDay: {
                    open: (this.state.laborDayOpen === null || this.state.laborDayClosed) ? null : this.state.laborDayOpen.getHours() * 60 + this.state.laborDayOpen.getMinutes(),
                    close: (this.state.laborDayClose === null || this.state.laborDayClosed) ? null : this.state.laborDayClose.getHours() * 60 + this.state.laborDayClose.getMinutes(),
                    closed: this.state.laborDayClosed
                },
                thanksgiving: {
                    open: (this.state.thanksgivingOpen === null || this.state.thanksgivingClosed) ? null : this.state.thanksgivingOpen.getHours() * 60 + this.state.thanksgivingOpen.getMinutes(),
                    close: (this.state.thanksgivingClose === null || this.state.thanksgivingClosed) ? null : this.state.thanksgivingClose.getHours() * 60 + this.state.thanksgivingClose.getMinutes(),
                    closed: this.state.thanksgivingClosed
                },
                blackFriday: {
                    open: (this.state.blackFridayOpen === null || this.state.blackFridayClosed) ? null : this.state.blackFridayOpen.getHours() * 60 + this.state.blackFridayOpen.getMinutes(),
                    close: (this.state.blackFridayClose === null || this.state.blackFridayClosed) ? null : this.state.blackFridayClose.getHours() * 60 + this.state.blackFridayClose.getMinutes(),
                    closed: this.state.blackFridayClosed
                },
                christmasEve: {
                    open: (this.state.christmasEveOpen === null || this.state.christmasEveClosed) ? null : this.state.christmasEveOpen.getHours() * 60 + this.state.christmasEveOpen.getMinutes(),
                    close: (this.state.christmasEveClose === null || this.state.christmasEveClosed) ? null : this.state.christmasEveClose.getHours() * 60 + this.state.christmasEveClose.getMinutes(),
                    closed: this.state.christmasEveClosed
                },
                christmasDay: {
                    open: (this.state.christmasDayOpen === null || this.state.christmasDayClosed) ? null : this.state.christmasDayOpen.getHours() * 60 + this.state.christmasDayOpen.getMinutes(),
                    close: (this.state.christmasDayClose === null || this.state.christmasDayClosed) ? null : this.state.christmasDayClose.getHours() * 60 + this.state.christmasDayClose.getMinutes(),
                    closed: this.state.christmasDayClosed
                },
                newYearsEve: {
                    open: (this.state.newYearsEveOpen === null || this.state.newYearsEveClosed) ? null : this.state.newYearsEveOpen.getHours() * 60 + this.state.newYearsEveOpen.getMinutes(),
                    close: (this.state.newYearsEveClose === null || this.state.newYearsEveClosed) ? null : this.state.newYearsEveClose.getHours() * 60 + this.state.newYearsEveClose.getMinutes(),
                    closed: this.state.newYearsEveClosed
                }
            },
            dealershipPhoneNumber: this.state.addDealerPhoneNumber,
            dealershipEmailAddress: this.state.addDealerEmailAddress,
            salesStaffPreferredName: this.state.addDealerSalesPreferredName,
            dealershipPerks: this.state.addDealerPerks,
            websiteURL: this.state.addWebsiteURL,
            newInventorySearchURL: this.state.addNewSearchURL,
            usedInventorySearchURL: this.state.addUsedSearchURL,
            tradeInFormURL: this.state.addTradeInURL,
            financingPageURL: this.state.addFinancingURL,
            servicePageURL: this.state.addServiceURL,
            warrantyVSCPageURL: this.state.addWarrantyURL,
            homeDeliveryOffered: this.state.addHomeDeliveryOfferedTF,
            homeDeliveryRadius: this.state.addHomeDeliveryRadius,
            homeDeliveryFee: this.state.addHomeDeliveryFee,
            newCarDisclaimer: this.state.addNewCarDisclaimer,
            usedCarDisclaimer: this.state.addUsedCarDisclaimer,
            returnPolicy: this.state.addReturnPolicyTF,
            returnPolicyNumDays: this.state.addReturnPolicyNumDays,
            carFaxPartnerID: this.state.addCarFaxPartnerID,
            registrationFees: this.state.addRegistrationFees,
            documentationFees: this.state.addDocumentaionFees,
            otherFees: this.state.addOtherFees
        }

        if (!await this.validateProfile(newDealerProfile)) {
            return
        }
        let profiles = this.state.profiles
        try {
            await this.props.mongo.insertOne("mojo_dealership_profiles", newDealerProfile)
            profiles = await this.props.mongo.find("mojo_dealership_profiles")
        } catch (error) {
            console.log(error)
        }
        this._isMounted && this.setState({ profiles })
        this.clearAddValues()

        console.log(newDealerProfile)
    }
    async updateNewDealerProfile(e) {

        e.preventDefault();
        this.setState({ editErrorText: "" })
        let updateDealerProfile = {
            dealershipName: this.props.utils.toTitleCase(this.state.editDealerName),
            dealershipAddress: this.state.editDealerAddress,
            normalHours: {
                monday: {
                    //set open and close to null if its closed that day ***
                    open: (this.state.editMondayOpen === null || this.state.editMondayClosed) ? null : this.state.editMondayOpen.getHours() * 60 + this.state.editMondayOpen.getMinutes(),
                    close: this.state.editMondayClose === null ? null : this.state.editMondayClose.getHours() * 60 + this.state.editMondayClose.getMinutes(),
                    closed: this.state.editMondayClosed
                },
                tuesday: {
                    open: (this.state.editTuesdayOpen === null || this.state.editTuesdayClosed) ? null : this.state.editTuesdayOpen.getHours() * 60 + this.state.editTuesdayOpen.getMinutes(),
                    close: this.state.editTuesdayClose === null ? null : this.state.editTuesdayClose.getHours() * 60 + this.state.editTuesdayClose.getMinutes(),
                    closed: this.state.editTuesdayClosed
                },
                wednesday: {
                    open: (this.state.editWednesdayOpen === null || this.state.editWednesdayClosed) ? null : this.state.editWednesdayOpen.getHours() * 60 + this.state.editWednesdayOpen.getMinutes(),
                    close: this.state.editWednesdayClose === null ? null : this.state.editWednesdayClose.getHours() * 60 + this.state.editWednesdayClose.getMinutes(),
                    closed: this.state.editWednesdayClosed
                },
                thursday: {
                    open: (this.state.editThursdayOpen === null || this.state.editThursdayClosed) ? null : this.state.editThursdayOpen.getHours() * 60 + this.state.editThursdayOpen.getMinutes(),
                    close: this.state.editThursdayClose === null ? null : this.state.editThursdayClose.getHours() * 60 + this.state.editThursdayClose.getMinutes(),
                    closed: this.state.editThursdayClosed
                },
                friday: {
                    open: (this.state.editFridayOpen === null || this.state.editFridayClosed) ? null : this.state.editFridayOpen.getHours() * 60 + this.state.editFridayOpen.getMinutes(),
                    close: this.state.editFridayClose === null ? null : this.state.editFridayClose.getHours() * 60 + this.state.editFridayClose.getMinutes(),
                    closed: this.state.editFridayClosed
                },
                saturday: {
                    open: (this.state.editSaturdayOpen === null || this.state.editSaturdayClosed) ? null : this.state.editSaturdayOpen.getHours() * 60 + this.state.editSaturdayOpen.getMinutes(),
                    close: this.state.editSaturdayClose === null ? null : this.state.editSaturdayClose.getHours() * 60 + this.state.editSaturdayClose.getMinutes(),
                    closed: this.state.editSaturdayClosed
                },
                sunday: {
                    open: (this.state.editSundayOpen === null || this.state.editSundayClosed) ? null : this.state.editSundayOpen.getHours() * 60 + this.state.editSundayOpen.getMinutes(),
                    close: this.state.editSundayClose === null ? null : this.state.editSundayClose.getHours() * 60 + this.state.editSundayClose.getMinutes(),
                    closed: this.state.editSundayClosed
                }
            },
            holidayHours: {
                newYearsDay: {
                    open: (this.state.editNewYearsDayOpen === null || this.state.editNewYearsDayClosed) ? null : this.state.editNewYearsDayOpen.getHours() * 60 + this.state.editNewYearsDayOpen.getMinutes(),
                    close: (this.state.editNewYearsDayClose === null || this.state.editNewYearsDayClosed) ? null : this.state.editNewYearsDayClose.getHours() * 60 + this.state.editNewYearsDayClose.getMinutes(),
                    closed: this.state.editNewYearsDayClosed
                },
                easter: {
                    open: (this.state.editEasterOpen === null || this.state.editEasterClosed) ? null : this.state.editEasterOpen.getHours() * 60 + this.state.editEasterOpen.getMinutes(),
                    close: (this.state.editEasterClose === null || this.state.editEasterClosed) ? null : this.state.editEasterClose.getHours() * 60 + this.state.editEasterClose.getMinutes(),
                    closed: this.state.editEasterClosed
                },
                memorialDay: {
                    open: (this.state.editMemorialDayOpen === null || this.state.editMemorialDayClosed) ? null : this.state.editMemorialDayOpen.getHours() * 60 + this.state.editMemorialDayOpen.getMinutes(),
                    close: (this.state.editMemorialDayClose === null || this.state.editMemorialDayClosed) ? null : this.state.editMemorialDayClose.getHours() * 60 + this.state.editMemorialDayClose.getMinutes(),
                    closed: this.state.editMemorialDayClosed
                },
                independenceDay: {
                    open: (this.state.editIndependenceDayOpen === null || this.state.editIndependenceDayClosed) ? null : this.state.editIndependenceDayOpen.getHours() * 60 + this.state.editIndependenceDayOpen.getMinutes(),
                    close: (this.state.editIndependenceDayClose === null || this.state.editIndependenceDayClosed) ? null : this.state.editIndependenceDayClose.getHours() * 60 + this.state.editIndependenceDayClose.getMinutes(),
                    closed: this.state.editIndependenceDayClosed
                },
                laborDay: {
                    open: (this.state.editLaborDayOpen === null || this.state.editLaborDayClosed) ? null : this.state.editLaborDayOpen.getHours() * 60 + this.state.editLaborDayOpen.getMinutes(),
                    close: (this.state.editLaborDayClose === null || this.state.editLaborDayClosed) ? null : this.state.editLaborDayClose.getHours() * 60 + this.state.editLaborDayClose.getMinutes(),
                    closed: this.state.editLaborDayClosed
                },
                thanksgiving: {
                    open: (this.state.editThanksgivingOpen === null || this.state.editThanksgivingClosed) ? null : this.state.editThanksgivingOpen.getHours() * 60 + this.state.editThanksgivingOpen.getMinutes(),
                    close: (this.state.editThanksgivingClose === null || this.state.editThanksgivingClosed) ? null : this.state.editThanksgivingClose.getHours() * 60 + this.state.editThanksgivingClose.getMinutes(),
                    closed: this.state.editThanksgivingClosed
                },
                blackFriday: {
                    open: (this.state.editBlackFridayOpen === null || this.state.editBlackFridayClosed) ? null : this.state.editBlackFridayOpen.getHours() * 60 + this.state.editBlackFridayOpen.getMinutes(),
                    close: (this.state.editBlackFridayClose === null || this.state.editBlackFridayClosed) ? null : this.state.editBlackFridayClose.getHours() * 60 + this.state.editBlackFridayClose.getMinutes(),
                    closed: this.state.editBlackFridayClosed
                },
                christmasEve: {
                    open: (this.state.editChristmasEveOpen === null || this.state.editChristmasEveClosed) ? null : this.state.editChristmasEveOpen.getHours() * 60 + this.state.editChristmasEveOpen.getMinutes(),
                    close: (this.state.editChristmasEveClose === null || this.state.editChristmasEveClosed) ? null : this.state.editChristmasEveClose.getHours() * 60 + this.state.editChristmasEveClose.getMinutes(),
                    closed: this.state.editChristmasEveClosed
                },
                christmasDay: {
                    open: (this.state.editChristmasDayOpen === null || this.state.editChristmasDayClosed) ? null : this.state.editChristmasDayOpen.getHours() * 60 + this.state.editChristmasDayOpen.getMinutes(),
                    close: (this.state.editChristmasDayClose === null || this.state.editChristmasDayClosed) ? null : this.state.editChristmasDayClose.getHours() * 60 + this.state.editChristmasDayClose.getMinutes(),
                    closed: this.state.editChristmasDayClosed
                },
                newYearsEve: {
                    open: (this.state.editNewYearsEveOpen === null || this.state.editNewYearsEveClosed) ? null : this.state.editNewYearsEveOpen.getHours() * 60 + this.state.editNewYearsEveOpen.getMinutes(),
                    close: (this.state.editNewYearsEveClose === null || this.state.editNewYearsEveClosed) ? null : this.state.editNewYearsEveClose.getHours() * 60 + this.state.editNewYearsEveClose.getMinutes(),
                    closed: this.state.editNewYearsEveClosed
                }
            },
            dealershipPhoneNumber: this.state.editDealerPhoneNumber,
            dealershipEmailAddress: this.state.editDealerEmailAddress,
            salesStaffPreferredName: this.state.editDealerSalesPreferredName,
            dealershipPerks: this.state.editDealerPerks,
            websiteURL: this.state.editWebsiteURL,
            newInventorySearchURL: this.state.editNewSearchURL,
            usedInventorySearchURL: this.state.editUsedSearchURL,
            tradeInFormURL: this.state.editTradeInURL,
            financingPageURL: this.state.editFinancingURL,
            servicePageURL: this.state.editServiceURL,
            warrantyVSCPageURL: this.state.editWarrantyURL,
            homeDeliveryOffered: this.state.editHomeDeliveryOfferedTF,
            homeDeliveryRadius: this.state.editHomeDeliveryRadius,
            homeDeliveryFee: this.state.editHomeDeliveryFee,
            newCarDisclaimer: this.state.editNewCarDisclaimer,
            usedCarDisclaimer: this.state.editUsedCarDisclaimer,
            returnPolicy: this.state.editReturnPolicyTF,
            returnPolicyNumDays: this.state.editReturnPolicyNumDays,
            carFaxPartnerID: this.state.editCarFaxPartnerID,
            registrationFees: this.state.editRegistrationFees,
            documentationFees: this.state.editDocumentaionFees,
            otherFees: this.state.editOtherFees
        }

        if (!await this.validateProfile(updateDealerProfile)) {
            return
        }
        let profiles = this.state.profiles
        try {
            await this.props.mongo.findOneAndUpdate("mojo_dealership_profiles", { _id: this.state.selected_profile._id }, updateDealerProfile)
            profiles = await this.props.mongo.find("mojo_dealership_profiles")
        } catch (error) {
            console.log(error)
        }
        this._isMounted && this.setState({ profiles })
        this.clearEditValues()

        console.log(updateDealerProfile)
    }
    toggleTooltip(name) {
        this.setState({ [name]: !this.state[name] })
    }
    onValueChange(key, value) {
        this._isMounted && this.setState({ [key]: value })
    }
    clearAddValues() {
        this._isMounted && this.setState({
            addErrorText: "",
            addDealerName: "",
            addDealerAddress: "",
            regMondayOpen: null,
            regMondayClose: null,
            regMondayClosed: false,
            regTuesdayOpen: null,
            regTuesdayClose: null,
            regTuesdayClosed: false,
            regWednesdayOpen: null,
            regWednesdayClose: null,
            regWednesdayClosed: false,
            regThursdayOpen: null,
            regThursdayClose: null,
            regThursdayClosed: false,
            regFridayOpen: null,
            regFridayClose: null,
            regFridayClosed: false,
            regSaturdayOpen: null,
            regSaturdayClose: null,
            regSaturdayClosed: false,
            regSundayOpen: null,
            regSundayClose: null,
            regSundayClosed: false,
            newYearsDayOpen: null,
            newYearsDayClose: null,
            newYearsDayClosed: false,
            easterOpen: null,
            easterClose: null,
            easterClosed: false,
            memorialDayOpen: null,
            memorialDayClose: null,
            memorialDayClosed: false,
            independenceDayOpen: null,
            independenceDayClose: null,
            independenceDayClosed: false,
            laborDayOpen: null,
            laborDayClose: null,
            laborDayClosed: false,
            thanksgivingOpen: null,
            thanksgivingClose: null,
            thanksgivingClosed: false,
            blackFridayOpen: null,
            blackFridayClose: null,
            blackFridayClosed: false,
            christmasEveOpen: null,
            christmasEveClose: null,
            christmasEveClosed: false,
            christmasDayOpen: null,
            christmasDayClose: null,
            christmasDayClosed: false,
            newYearsEveOpen: null,
            newYearsEveClose: null,
            newYearsEveClosed: false,
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
    clearEditValues() {
        this._isMounted && this.setState({
            editDealerName: "",
            editDealerAddress: "",
            regMondayOpen: null,
            editMondayClose: null,
            editMondayClosed: false,
            editTuesdayOpen: null,
            editTuesdayClose: null,
            editTuesdayClosed: false,
            editWednesdayOpen: null,
            editWednesdayClose: null,
            editWednesdayClosed: false,
            editThursdayOpen: null,
            editThursdayClose: null,
            editThursdayClosed: false,
            editFridayOpen: null,
            editFridayClose: null,
            editFridayClosed: false,
            editSaturdayOpen: null,
            editSaturdayClose: null,
            editSaturdayClosed: false,
            editSundayOpen: null,
            editSundayClose: null,
            editSundayClosed: false,
            editNewYearsDayOpen: null,
            editNewYearsDayClose: null,
            editNewYearsDayClosed: false,
            editEasterOpen: null,
            editEasterClose: null,
            editEasterClosed: false,
            editMemorialDayOpen: null,
            editMemorialDayClose: null,
            editMemorialDayClosed: false,
            editIndependenceDayOpen: null,
            editIndependenceDayClose: null,
            editIndependenceDayClosed: false,
            editLaborDayOpen: null,
            editLaborDayClose: null,
            editLaborDayClosed: false,
            editThanksgivingOpen: null,
            editThanksgivingClose: null,
            editThanksgivingClosed: false,
            editBlackFridayOpen: null,
            editBlackFridayClose: null,
            editBlackFridayClosed: false,
            editChristmasEveOpen: null,
            editChristmasEveClose: null,
            editChristmasEveClosed: false,
            editChristmasDayOpen: null,
            editChristmasDayClose: null,
            editChristmasDayClosed: false,
            editNewYearsEveOpen: null,
            editNewYearsEveClose: null,
            editNewYearsEveClosed: false,
            editDealerPhoneNumber: "",
            editDealerEmailAddress: "",
            editDealerSalesPreferredName: "",
            editDealerPerks: "",
            editWebsiteURL: "",
            editNewSearchURL: "",
            editUsedSearchURL: "",
            editTradeInURL: "",
            editFinancingURL: "",
            editServiceURL: "",
            editWarrantyURL: "",
            editHomeDeliveryOfferedTF: false,
            editHomeDeliveryRadius: "",
            editHomeDeliveryFee: "",
            editNewCarDisclaimer: "",
            editUsedCarDisclaimer: "",
            editReturnPolicyTF: false,
            editReturnPolicyNumDays: "",
            editCarFaxPartnerID: "",
            editRegistrationFees: "",
            editDocumentaionFees: "",
            editOtherFees: "",
            selected_profile: null,
            editHidden: true
        })
    }
    async populateEditFormValues() {
        let profile = this.state.profiles.find((p) => p._id === this.state.selected_profile.value)
        this._isMounted && await this.setState({
            editDealerName: profile.dealershipName,
            editDealerAddress: profile.dealershipAddress,
            editMondayOpen: (profile.normalHours.monday.open === null || profile.normalHours.monday.closed) ? null : new Date(new Date().setHours(profile.normalHours.monday.open / 60, profile.normalHours.monday.open % 60, 0, 0)),
            editMondayClose: (profile.normalHours.monday.close === null || profile.normalHours.monday.closed) ? null : new Date(new Date().setHours(profile.normalHours.monday.close / 60, profile.normalHours.monday.close % 60, 0, 0)),
            editMondayClosed: profile.normalHours.monday.closed,
            editTuesdayOpen: (profile.normalHours.tuesday.open === null || profile.normalHours.tuesday.closed) ? null : new Date(new Date().setHours(profile.normalHours.tuesday.open / 60, profile.normalHours.tuesday.open % 60, 0, 0)),
            editTuesdayClose: (profile.normalHours.tuesday.close === null || profile.normalHours.tuesday.closed) ? null : new Date(new Date().setHours(profile.normalHours.tuesday.close / 60, profile.normalHours.tuesday.close % 60, 0, 0)),
            editTuesdayClosed: profile.normalHours.tuesday.closed,
            editWednesdayOpen: (profile.normalHours.wednesday.open === null || profile.normalHours.wednesday.closed) ? null : new Date(new Date().setHours(profile.normalHours.wednesday.open / 60, profile.normalHours.wednesday.open % 60, 0, 0)),
            editWednesdayClose: (profile.normalHours.wednesday.close === null || profile.normalHours.wednesday.closed) ? null : new Date(new Date().setHours(profile.normalHours.wednesday.close / 60, profile.normalHours.wednesday.close % 60, 0, 0)),
            editWednesdayClosed: profile.normalHours.wednesday.closed,
            editThursdayOpen: (profile.normalHours.thursday.open === null || profile.normalHours.thursday.closed) ? null : new Date(new Date().setHours(profile.normalHours.thursday.open / 60, profile.normalHours.thursday.open % 60, 0, 0)),
            editThursdayClose: (profile.normalHours.thursday.close === null || profile.normalHours.thursday.closed) ? null : new Date(new Date().setHours(profile.normalHours.thursday.close / 60, profile.normalHours.thursday.close % 60, 0, 0)),
            editThursdayClosed: profile.normalHours.thursday.closed,
            editFridayOpen: (profile.normalHours.friday.open === null || profile.normalHours.friday.closed) ? null : new Date(new Date().setHours(profile.normalHours.friday.open / 60, profile.normalHours.friday.open % 60, 0, 0)),
            editFridayClose: (profile.normalHours.friday.close === null || profile.normalHours.friday.closed) ? null : new Date(new Date().setHours(profile.normalHours.friday.close / 60, profile.normalHours.friday.close % 60, 0, 0)),
            editFridayClosed: profile.normalHours.friday.closed,
            editSaturdayOpen: (profile.normalHours.saturday.open === null || profile.normalHours.saturday.closed) ? null : new Date(new Date().setHours(profile.normalHours.saturday.open / 60, profile.normalHours.saturday.open % 60, 0, 0)),
            editSaturdayClose: (profile.normalHours.saturday.close === null || profile.normalHours.saturday.closed) ? null : new Date(new Date().setHours(profile.normalHours.saturday.close / 60, profile.normalHours.saturday.close % 60, 0, 0)),
            editSaturdayClosed: profile.normalHours.saturday.closed,
            editSundayOpen: (profile.normalHours.sunday.open === null || profile.normalHours.sunday.closed) ? null : new Date(new Date().setHours(profile.normalHours.sunday.open / 60, profile.normalHours.sunday.open % 60, 0, 0)),
            editSundayClose: (profile.normalHours.sunday.close === null || profile.normalHours.sunday.closed) ? null : new Date(new Date().setHours(profile.normalHours.sunday.close / 60, profile.normalHours.sunday.close % 60, 0, 0)),
            editSundayClosed: profile.normalHours.sunday.closed,
            editNewYearsDayOpen: (profile.holidayHours.newYearsDay.open === null || profile.holidayHours.newYearsDay.closed) ? null : new Date(new Date().setHours(profile.holidayHours.newYearsDay.open / 60, profile.holidayHours.newYearsDay.open % 60, 0, 0)),
            editNewYearsDayClose: (profile.holidayHours.newYearsDay.close === null || profile.holidayHours.newYearsDay.closed) ? null : new Date(new Date().setHours(profile.holidayHours.newYearsDay.close / 60, profile.holidayHours.newYearsDay.close % 60, 0, 0)),
            editNewYearsDayClosed: profile.holidayHours.newYearsDay.closed,
            editEasterOpen: (profile.holidayHours.easter.open === null || profile.holidayHours.easter.closed) ? null : new Date(new Date().setHours(profile.holidayHours.easter.open / 60, profile.holidayHours.easter.open % 60, 0, 0)),
            editEasterClose: (profile.holidayHours.easter.close === null || profile.holidayHours.easter.closed) ? null : new Date(new Date().setHours(profile.holidayHours.easter.close / 60, profile.holidayHours.easter.close % 60, 0, 0)),
            editEasterClosed: profile.holidayHours.easter.closed,
            editMemorialDayOpen: (profile.holidayHours.memorialDay.open === null || profile.holidayHours.memorialDay.closed) ? null : new Date(new Date().setHours(profile.holidayHours.memorialDay.open / 60, profile.holidayHours.memorialDay.open % 60, 0, 0)),
            editMemorialDayClose: (profile.holidayHours.memorialDay.close === null || profile.holidayHours.memorialDay.closed) ? null : new Date(new Date().setHours(profile.holidayHours.memorialDay.close / 60, profile.holidayHours.memorialDay.close % 60, 0, 0)),
            editMemorialDayClosed: profile.holidayHours.memorialDay.closed,
            editIndependenceDayOpen: (profile.holidayHours.independenceDay.open === null || profile.holidayHours.independenceDay.closed) ? null : new Date(new Date().setHours(profile.holidayHours.independenceDay.open / 60, profile.holidayHours.independenceDay.open % 60, 0, 0)),
            editIndependenceDayClose: (profile.holidayHours.independenceDay.close === null || profile.holidayHours.independenceDay.closed) ? null : new Date(new Date().setHours(profile.holidayHours.independenceDay.close / 60, profile.holidayHours.independenceDay.close % 60, 0, 0)),
            editIndependenceDayClosed: profile.holidayHours.independenceDay.closed,
            editLaborDayOpen: (profile.holidayHours.laborDay.open === null || profile.holidayHours.laborDay.closed) ? null : new Date(new Date().setHours(profile.holidayHours.laborDay.open / 60, profile.holidayHours.laborDay.open % 60, 0, 0)),
            editLaborDayClose: (profile.holidayHours.laborDay.close === null || profile.holidayHours.laborDay.closed) ? null : new Date(new Date().setHours(profile.holidayHours.laborDay.close / 60, profile.holidayHours.laborDay.close % 60, 0, 0)),
            editLaborDayClosed: profile.holidayHours.laborDay.closed,
            editThanksgivingOpen: (profile.holidayHours.thanksgiving.open === null || profile.holidayHours.thanksgiving.closed) ? null : new Date(new Date().setHours(profile.holidayHours.thanksgiving.open / 60, profile.holidayHours.thanksgiving.open % 60, 0, 0)),
            editThanksgivingClose: (profile.holidayHours.thanksgiving.close === null || profile.holidayHours.thanksgiving.closed) ? null : new Date(new Date().setHours(profile.holidayHours.thanksgiving.close / 60, profile.holidayHours.thanksgiving.close % 60, 0, 0)),
            editThanksgivingClosed: profile.holidayHours.thanksgiving.closed,
            editBlackFridayOpen: (profile.holidayHours.blackFriday.open === null || profile.holidayHours.blackFriday.closed) ? null : new Date(new Date().setHours(profile.holidayHours.blackFriday.open / 60, profile.holidayHours.blackFriday.open % 60, 0, 0)),
            editBlackFridayClose: (profile.holidayHours.blackFriday.close === null || profile.holidayHours.blackFriday.closed) ? null : new Date(new Date().setHours(profile.holidayHours.blackFriday.close / 60, profile.holidayHours.blackFriday.close % 60, 0, 0)),
            editBlackFridayClosed: profile.holidayHours.blackFriday.closed,
            editChristmasEveOpen: (profile.holidayHours.christmasEve.open === null || profile.holidayHours.christmasEve.closed) ? null : new Date(new Date().setHours(profile.holidayHours.christmasEve.open / 60, profile.holidayHours.christmasEve.open % 60, 0, 0)),
            editChristmasEveClose: (profile.holidayHours.christmasEve.close === null || profile.holidayHours.christmasEve.closed) ? null : new Date(new Date().setHours(profile.holidayHours.christmasEve.close / 60, profile.holidayHours.christmasEve.close % 60, 0, 0)),
            editChristmasEveClosed: profile.holidayHours.christmasEve.closed,
            editChristmasDayOpen: (profile.holidayHours.christmasDay.open === null || profile.holidayHours.christmasDay.closed) ? null : new Date(new Date().setHours(profile.holidayHours.christmasDay.open / 60, profile.holidayHours.christmasDay.open % 60, 0, 0)),
            editChristmasDayClose: (profile.holidayHours.christmasDay.closed === null || profile.holidayHours.christmasDay.closed) ? null : new Date(new Date().setHours(profile.holidayHours.christmasDay.close / 60, profile.holidayHours.christmasDay.close % 60, 0, 0)),
            editChristmasDayClosed: profile.holidayHours.christmasDay.closed,
            editNewYearsEveOpen: (profile.holidayHours.newYearsEve.open === null || profile.holidayHours.newYearsEve.closed) ? null : new Date(new Date().setHours(profile.holidayHours.newYearsEve.open / 60, profile.holidayHours.newYearsEve.open % 60, 0, 0)),
            editNewYearsEveClose: (profile.holidayHours.newYearsEve.closed === null || profile.holidayHours.newYearsEve.closed) ? null : new Date(new Date().setHours(profile.holidayHours.newYearsEve.close / 60, profile.holidayHours.newYearsEve.close % 60, 0, 0)),
            editNewYearsEveClosed: profile.holidayHours.newYearsEve.closed,
            editDealerPhoneNumber: profile.dealershipPhoneNumber,
            editDealerEmailAddress: profile.dealershipEmailAddress,
            editDealerSalesPreferredName: profile.salesStaffPreferredName,
            editDealerPerks: profile.dealershipPerks,
            editWebsiteURL: profile.websiteURL,
            editNewSearchURL: profile.newInventorySearchURL,
            editUsedSearchURL: profile.usedInventorySearchURL,
            editTradeInURL: profile.tradeInFormURL,
            editFinancingURL: profile.financingPageURL,
            editServiceURL: profile.servicePageURL,
            editWarrantyURL: profile.warrantyVSCPageURL,
            editHomeDeliveryOfferedTF: profile.homeDeliveryOffered,
            editHomeDeliveryRadius: profile.homeDeliveryRadius,
            editHomeDeliveryFee: profile.homeDeliveryFee,
            editNewCarDisclaimer: profile.newCarDisclaimer,
            editUsedCarDisclaimer: profile.usedCarDisclaimer,
            editReturnPolicyTF: profile.returnPolicy,
            editReturnPolicyNumDays: profile.returnPolicyNumDays,
            editCarFaxPartnerID: profile.carFaxPartnerID,
            editRegistrationFees: profile.registrationFees,
            editDocumentaionFees: profile.documentationFees,
            editOtherFees: profile.otherFees,
        })
    }
    async validateProfile(profile) {
        await this.setState({ addErrorText: "" })
        let addErrorText = ""
        let valid = true
        if (profile.dealershipName.length < 1) {
            addErrorText += "\nDealership Name cannot be blank"
            valid = false;
        }
        if (profile.dealershipAddress.length < 1) {
            addErrorText += "\nDealership Address cannot be blank"
            valid = false;
        }
        //todo validate hours!
        if (profile.dealershipPhoneNumber.length !== 10 ||
            isNaN(profile.dealershipPhoneNumber)) {
            addErrorText += "\nDealership Phone Number must be a 10-digit number."
            valid = false;
        }
        if (profile.dealershipEmailAddress.length < 1) {
            addErrorText += "\nDealership Email Address cannot be blank."
            valid = false;
        }
        if (profile.websiteURL.length < 1) {
            addErrorText += "\nDealership Website URL cannot be blank."
            valid = false;
        }
        if (profile.newInventorySearchURL.length < 1) {
            addErrorText += "\nInventory Search URL - New Cars cannot be blank."
            valid = false;
        }
        if (profile.usedInventorySearchURL.length < 1) {
            addErrorText += "\nInventory Search URL - Used Cars cannot be blank."
            valid = false;
        }
        for (let day in profile.normalHours) {
            if (profile.normalHours[day].closed === false && (profile.normalHours[day].open === null || profile.normalHours[day].close === null)) {
                addErrorText += `\n${day} - hours can't be empty if the store is open`
                valid = false;
            }
            if (profile.normalHours[day].closed === false && (profile.normalHours[day].open >= profile.normalHours[day].close)) {
                addErrorText += `\n${day} - store must open before it closes`
                valid = false;
            }
        }
        for (let day in profile.holidayHours) {
            if (profile.holidayHours[day].closed === false && (profile.holidayHours[day].open === null || profile.holidayHours[day].close === null)) {
                addErrorText += `\n${day} - hours can't be empty if the store is open`
                valid = false;
            }
            if (profile.holidayHours[day].closed === false && (profile.holidayHours[day].open >= profile.holidayHours[day].close)) {
                addErrorText += `\n${day} - store must open before it closes`
                valid = false;
            }
        }
        await this.setState({ addErrorText })
        return valid;
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
                                        <Button color="neutral" onClick={() => { this.clearEditValues(); this.setState({ addHidden: false, editHidden: true }) }}>Add New Dealership Profile</Button>
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
                                                <hr style={{ borderBottom: "1px solid white" }} />
                                                <Row>
                                                    <Col md="6">
                                                        <FormGroup >
                                                            <br />
                                                            <p className="text-white"><strong>Regular Operating Hours</strong></p>
                                                            <br />
                                                            <p className="text-white">Monday Open:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    inputProps={{ disabled: this.state.regMondayClosed }}
                                                                    className="text-black"
                                                                    value={this.state.regMondayOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("regMondayOpen", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <p className="text-white">Monday Close:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    inputProps={{ disabled: this.state.regMondayClosed }}
                                                                    className="text-black"
                                                                    value={this.state.regMondayClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("regMondayClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.regMondayClosed} onChange={() => { this.setState({ regMondayClosed: !this.state.regMondayClosed }) }} /> Closed on Mondays</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />
                                                            <p className="text-white">Tuesday Open:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    inputProps={{ disabled: this.state.regTuesdayClosed }}
                                                                    className="text-black"
                                                                    value={this.state.regTuesdayOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("regTuesdayOpen", new Date(e)) }}
                                                                />
                                                            </Card>
                                                            <p className="text-white">Tuesday Close:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.regTuesdayClosed }}
                                                                    value={this.state.regTuesdayClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("regTuesdayClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.regTuesdayClosed} onChange={() => { this.setState({ regTuesdayClosed: !this.state.regTuesdayClosed }) }} /> Closed on Tuesdays</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />

                                                            <p className="text-white">Wednesday Open:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.regWednesdayClosed }}
                                                                    value={this.state.regWednesdayOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("regWednesdayOpen", new Date(e)) }}
                                                                />
                                                            </Card>
                                                            <p className="text-white">Wednesday Close:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.regWednesdayClosed }}
                                                                    value={this.state.regWednesdayClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("regWednesdayClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.regWednesdayClosed} onChange={() => { this.setState({ regWednesdayClosed: !this.state.regWednesdayClosed }) }} /> Closed on Wednesdays</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />
                                                            <p className="text-white">Thursday Open:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.regThursdayClosed }}
                                                                    value={this.state.regThursdayOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("regThursdayOpen", new Date(e)) }}
                                                                />
                                                            </Card>
                                                            <p className="text-white">Thursday Close:</p>
                                                            <Card className="card-white">
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.regThursdayClosed }}
                                                                    value={this.state.regThursdayClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("regThursdayClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.regThursdayClosed} onChange={() => { this.setState({ regThursdayClosed: !this.state.regThursdayClosed }) }} /> Closed on Thursdays</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />
                                                            <p className="text-white">Friday Open:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.regFridayClosed }}
                                                                    value={this.state.regFridayOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("regFridayOpen", new Date(e)) }}
                                                                />
                                                            </Card>
                                                            <p className="text-white">Friday Close:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.regFridayClosed }}
                                                                    value={this.state.regFridayClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("regFridayClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.regFridayClosed} onChange={() => { this.setState({ regFridayClosed: !this.state.regFridayClosed }) }} /> Closed on Fridays</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />
                                                            <p className="text-white">Saturday Open:</p>
                                                            <Card className="card-white">
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.regSaturdayClosed }}
                                                                    value={this.state.regSaturdayOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("regSaturdayOpen", new Date(e)) }}
                                                                />
                                                            </Card>
                                                            <p className="text-white">Saturday Close:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.regSaturdayClosed }}
                                                                    value={this.state.regSaturdayClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("regSaturdayClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.regSaturdayClosed} onChange={() => { this.setState({ regSaturdayClosed: !this.state.regSaturdayClosed }) }} /> Closed on Saturdays</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />
                                                            <p className="text-white">Sunday Open:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.regSundayClosed }}
                                                                    value={this.state.regSundayOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("regSundayOpen", new Date(e)) }}
                                                                />
                                                            </Card>
                                                            <p className="text-white">Sunday Close:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.regSundayClosed }}
                                                                    value={this.state.regSundayClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("regSundayClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.regSundayClosed} onChange={() => { this.setState({ regSundayClosed: !this.state.regSundayClosed }) }} /> Closed on Sundays</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md="6">
                                                        <FormGroup >
                                                            <br />
                                                            <p className="text-white"><strong>Holiday Operating Hours</strong></p>
                                                            <br />

                                                            <p className="text-white">New Year's Day Open:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.newYearsDayClosed }}
                                                                    value={this.state.newYearsDayOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("newYearsDayOpen", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <p className="text-white">New Year's Day Close:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.newYearsDayClosed }}
                                                                    value={this.state.newYearsDayClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("newYearsDayClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.newYearsDayClosed} onChange={() => { this.setState({ newYearsDayClosed: !this.state.newYearsDayClosed }) }} /> Closed on New Year's Day</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />
                                                            <p className="text-white">Easter Open:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.easterClosed }}
                                                                    value={this.state.easterOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("easterOpen", new Date(e)) }}
                                                                />
                                                            </Card>
                                                            <p className="text-white">Easter Close:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.easterClosed }}
                                                                    value={this.state.easterClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("easterClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.easterClosed} onChange={() => { this.setState({ easterClosed: !this.state.easterClosed }) }} /> Closed on Easter</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />
                                                            <p className="text-white">Memorial Day Open:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.memorialDayClosed }}
                                                                    value={this.state.memorialDayOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("memorialDayOpen", new Date(e)) }}
                                                                />
                                                            </Card>
                                                            <p className="text-white">Memorial Day Close:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.memorialDayClosed }}
                                                                    value={this.state.memorialDayClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("memorialDayClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.memorialDayClosed} onChange={() => { this.setState({ memorialDayClosed: !this.state.memorialDayClosed }) }} /> Closed on Memorial Day</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />
                                                            <p className="text-white">Independence Day Open:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.independenceDayClosed }}
                                                                    value={this.state.independenceDayOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("independenceDayOpen", new Date(e)) }}
                                                                />
                                                            </Card>
                                                            <p className="text-white">Independence Day Close:</p>
                                                            <Card className="card-white">
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.independenceDayClosed }}
                                                                    value={this.state.independenceDayClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("independenceDayClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.independenceDayClosed} onChange={() => { this.setState({ independenceDayClosed: !this.state.independenceDayClosed }) }} /> Closed on Independence Day</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />
                                                            <p className="text-white">Labor Day Open:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.laborDayClosed }}
                                                                    value={this.state.laborDayOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("laborDayOpen", new Date(e)) }}
                                                                />
                                                            </Card>
                                                            <p className="text-white">Labor Day Close:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.laborDayClosed }}
                                                                    value={this.state.laborDayClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("laborDayClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.laborDayClosed} onChange={() => { this.setState({ laborDayClosed: !this.state.laborDayClosed }) }} /> Closed on Labor Day</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />
                                                            <p className="text-white">Thanksgiving Open:</p>
                                                            <Card className="card-white">
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.thanksgivingClosed }}
                                                                    value={this.state.thanksgivingOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("thanksgivingOpen", new Date(e)) }}
                                                                />
                                                            </Card>
                                                            <p className="text-white">Thanksgiving Close:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.thanksgivingClosed }}
                                                                    value={this.state.thanksgivingClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("thanksgivingClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.thanksgivingClosed} onChange={() => { this.setState({ thanksgivingClosed: !this.state.thanksgivingClosed }) }} /> Closed on Thanksgiving</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />
                                                            <p className="text-white">Black Friday Open:</p>

                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.blackFridayClosed }}
                                                                    value={this.state.blackFridayOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("blackFridayOpen", new Date(e)) }}
                                                                />
                                                            </Card>
                                                            <p className="text-white">Black Friday Close:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.blackFridayClosed }}
                                                                    value={this.state.blackFridayClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("blackFridayClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.blackFridayClosed} onChange={() => { this.setState({ blackFridayClosed: !this.state.blackFridayClosed }) }} /> Closed on Black Friday</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />
                                                            <p className="text-white">Christmas Eve Open:</p>

                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.christmasEveClosed }}
                                                                    value={this.state.christmasEveOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("christmasEveOpen", new Date(e)) }}
                                                                />
                                                            </Card>
                                                            <p className="text-white">Christmas Eve Close:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.christmasEveClosed }}
                                                                    value={this.state.christmasEveClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("christmasEveClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.christmasEveClosed} onChange={() => { this.setState({ christmasEveClosed: !this.state.christmasEveClosed }) }} /> Closed on Christmas Eve</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />
                                                            <p className="text-white">Christas Day Open:</p>

                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.christmasDayClosed }}
                                                                    value={this.state.christmasDayOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("christmasDayOpen", new Date(e)) }}
                                                                />
                                                            </Card>
                                                            <p className="text-white">Christmas Day Close:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.christmasDayClosed }}
                                                                    value={this.state.christmasDayClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("christmasDayClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.christmasDayClosed} onChange={() => { this.setState({ christmasDayClosed: !this.state.christmasDayClosed }) }} /> Closed on Christmas Day</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />
                                                            <p className="text-white">New Year's Eve Open:</p>

                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.newYearsEveClosed }}
                                                                    value={this.state.newYearsEveOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("newYearsEveOpen", new Date(e)) }}
                                                                />
                                                            </Card>
                                                            <p className="text-white">New Year's Eve Close:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.newYearsEveClosed }}
                                                                    value={this.state.newYearsEveClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("newYearsEveClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.newYearsEveClosed} onChange={() => { this.setState({ newYearsEveClosed: !this.state.newYearsEveClosed }) }} /> Closed on New Year's Eve</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />


                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <hr style={{ borderBottom: "1px solid white" }} />
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
                                    <Row style={{ justifyContent: 'center' }}>
                                        <h3 style={{ color: "red", whiteSpace: "pre-wrap" }}>{this.state.addErrorText}</h3>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row hidden={this.state.editHidden} style={{ justifyContent: 'center' }}>
                        <Col className="ml-auto mr-auto" md="8">
                            <Card style={{ justifyContent: "center", background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardBody>
                                    <p className="text-white">Select Dealership</p>
                                    <Select
                                        options={this.state.profiles.map((p) => {
                                            return {
                                                label: p.dealershipName,
                                                value: p._id
                                            }
                                        })}
                                        value={this.state.selected_profile}
                                        onChange={async (e) => { await this.onValueChange("selected_profile", e); this.populateEditFormValues() }}
                                    />
                                    <br />
                                    <Row hidden={this.state.selected_profile === null} style={{ justifyContent: 'center' }}>
                                        <Col md="10" >
                                            <h3 className="text-white" >Edit Dealership</h3>
                                            <Form>
                                                <FormGroup>
                                                    <p className="text-white">Dealership Name</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.editDealerName}
                                                        onChange={(e) => { this.onValueChange("editDealerName", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="text-white">Dealership Address</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.editDealerAddress}
                                                        onChange={(e) => { this.onValueChange("editDealerAddress", e.target.value) }}
                                                    />

                                                </FormGroup>
                                                <hr style={{ borderBottom: "1px solid white" }} />
                                                <Row >
                                                    <Col md="6">
                                                        <FormGroup >
                                                            <br />
                                                            <p className="text-white"><strong>Regular Operating Hours</strong></p>
                                                            <br />
                                                            <p className="text-white">Monday Open:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    inputProps={{ disabled: this.state.editMondayClosed }}
                                                                    className="text-black"
                                                                    value={this.state.editMondayOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editMondayOpen", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <p className="text-white">Monday Close:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    inputProps={{ disabled: this.state.editMondayClosed }}
                                                                    className="text-black"
                                                                    value={this.state.editMondayClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editMondayClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.editMondayClosed} onChange={() => { this.setState({ editMondayClosed: !this.state.editMondayClosed }) }} /> Closed on Mondays</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />
                                                            <p className="text-white">Tuesday Open:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    inputProps={{ disabled: this.state.editTuesdayClosed }}
                                                                    className="text-black"
                                                                    value={this.state.editTuesdayOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editTuesdayOpen", new Date(e)) }}
                                                                />
                                                            </Card>
                                                            <p className="text-white">Tuesday Close:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editTuesdayClosed }}
                                                                    value={this.state.editTuesdayClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editTuesdayClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.editTuesdayClosed} onChange={() => { this.setState({ editTuesdayClosed: !this.state.editTuesdayClosed }) }} /> Closed on Tuesdays</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />

                                                            <p className="text-white">Wednesday Open:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editWednesdayClosed }}
                                                                    value={this.state.editWednesdayOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editWednesdayOpen", new Date(e)) }}
                                                                />
                                                            </Card>
                                                            <p className="text-white">Wednesday Close:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editWednesdayClosed }}
                                                                    value={this.state.editWednesdayClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editWednesdayClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.editWednesdayClosed} onChange={() => { this.setState({ editWednesdayClosed: !this.state.editWednesdayClosed }) }} /> Closed on Wednesdays</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />
                                                            <p className="text-white">Thursday Open:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editThursdayClosed }}
                                                                    value={this.state.editThursdayOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editThursdayOpen", new Date(e)) }}
                                                                />
                                                            </Card>
                                                            <p className="text-white">Thursday Close:</p>
                                                            <Card className="card-white">
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editThursdayClosed }}
                                                                    value={this.state.editThursdayClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editThursdayClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.editThursdayClosed} onChange={() => { this.setState({ editThursdayClosed: !this.state.editThursdayClosed }) }} /> Closed on Thursdays</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />
                                                            <p className="text-white">Friday Open:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editFridayClosed }}
                                                                    value={this.state.editFridayOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editFridayOpen", new Date(e)) }}
                                                                />
                                                            </Card>
                                                            <p className="text-white">Friday Close:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editFridayClosed }}
                                                                    value={this.state.editFridayClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editFridayClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.editFridayClosed} onChange={() => { this.setState({ editFridayClosed: !this.state.editFridayClosed }) }} /> Closed on Fridays</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />
                                                            <p className="text-white">Saturday Open:</p>
                                                            <Card className="card-white">
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editSaturdayClosed }}
                                                                    value={this.state.editSaturdayOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editSaturdayOpen", new Date(e)) }}
                                                                />
                                                            </Card>
                                                            <p className="text-white">Saturday Close:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editSaturdayClosed }}
                                                                    value={this.state.editSaturdayClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editSaturdayClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.editSaturdayClosed} onChange={() => { this.setState({ editSaturdayClosed: !this.state.editSaturdayClosed }) }} /> Closed on Saturdays</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />
                                                            <p className="text-white">Sunday Open:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editSundayClosed }}
                                                                    value={this.state.editSundayOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editSundayOpen", new Date(e)) }}
                                                                />
                                                            </Card>
                                                            <p className="text-white">Sunday Close:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editSundayClosed }}
                                                                    value={this.state.editSundayClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editSundayClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.editSundayClosed} onChange={() => { this.setState({ editSundayClosed: !this.state.editSundayClosed }) }} /> Closed on Sundays</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />
                                                        </FormGroup>

                                                    </Col>
                                                    <Col md="6">
                                                        <FormGroup >
                                                            <br />
                                                            <p className="text-white"><strong>Holiday Operating Hours</strong></p>
                                                            <br />

                                                            <p className="text-white">New Year's Day Open:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editNewYearsDayClosed }}
                                                                    value={this.state.editNewYearsDayOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editNewYearsDayOpen", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <p className="text-white">New Year's Day Close:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editNewYearsDayClosed }}
                                                                    value={this.state.editNewYearsDayClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editNewYearsDayClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.editNewYearsDayClosed} onChange={() => { this.setState({ editNewYearsDayClosed: !this.state.editNewYearsDayClosed }) }} /> Closed on New Year's Day</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />
                                                            <p className="text-white">Easter Open:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editEasterClosed }}
                                                                    value={this.state.editEasterOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editEasterOpen", new Date(e)) }}
                                                                />
                                                            </Card>
                                                            <p className="text-white">Easter Close:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editEasterClosed }}
                                                                    value={this.state.editEasterClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editEasterClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.editEasterClosed} onChange={() => { this.setState({ editEasterClosed: !this.state.editEasterClosed }) }} /> Closed on Easter</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />
                                                            <p className="text-white">Memorial Day Open:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editMemorialDayClosed }}
                                                                    value={this.state.editMemorialDayOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editMemorialDayOpen", new Date(e)) }}
                                                                />
                                                            </Card>
                                                            <p className="text-white">Memorial Day Close:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editMemorialDayClosed }}
                                                                    value={this.state.editMemorialDayClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editMemorialDayClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.editMemorialDayClosed} onChange={() => { this.setState({ editMemorialDayClosed: !this.state.editMemorialDayClosed }) }} /> Closed on Memorial Day</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />
                                                            <p className="text-white">Independence Day Open:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editIndependenceDayClosed }}
                                                                    value={this.state.editIndependenceDayOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editIndependenceDayOpen", new Date(e)) }}
                                                                />
                                                            </Card>
                                                            <p className="text-white">Independence Day Close:</p>
                                                            <Card className="card-white">
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editIndependenceDayClosed }}
                                                                    value={this.state.editIndependenceDayClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editIndependenceDayClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.editIndependenceDayClosed} onChange={() => { this.setState({ editIndependenceDayClosed: !this.state.editIndependenceDayClosed }) }} /> Closed on Independence Day</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />
                                                            <p className="text-white">Labor Day Open:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editLaborDayClosed }}
                                                                    value={this.state.editLaborDayOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editLaborDayOpen", new Date(e)) }}
                                                                />
                                                            </Card>
                                                            <p className="text-white">Labor Day Close:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editLaborDayClosed }}
                                                                    value={this.state.editLaborDayClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editLaborDayClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.editLaborDayClosed} onChange={() => { this.setState({ editLaborDayClosed: !this.state.editLaborDayClosed }) }} /> Closed on Labor Day</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />
                                                            <p className="text-white">Thanksgiving Open:</p>
                                                            <Card className="card-white">
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editThanksgivingClosed }}
                                                                    value={this.state.editThanksgivingOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editThanksgivingOpen", new Date(e)) }}
                                                                />
                                                            </Card>
                                                            <p className="text-white">Thanksgiving Close:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editThanksgivingClosed }}
                                                                    value={this.state.editThanksgivingClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editThanksgivingClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.editThanksgivingClosed} onChange={() => { this.setState({ editThanksgivingClosed: !this.state.editThanksgivingClosed }) }} /> Closed on Thanksgiving</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />
                                                            <p className="text-white">Black Friday Open:</p>

                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editBlackFridayClosed }}
                                                                    value={this.state.editBlackFridayOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editBlackFridayOpen", new Date(e)) }}
                                                                />
                                                            </Card>
                                                            <p className="text-white">Black Friday Close:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editBlackFridayClosed }}
                                                                    value={this.state.editBlackFridayClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editBlackFridayClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.editBlackFridayClosed} onChange={() => { this.setState({ editBlackFridayClosed: !this.state.editBlackFridayClosed }) }} /> Closed on Black Friday</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />
                                                            <p className="text-white">Christmas Eve Open:</p>

                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editChristmasEveClosed }}
                                                                    value={this.state.editChristmasEveOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editChristmasEveOpen", new Date(e)) }}
                                                                />
                                                            </Card>
                                                            <p className="text-white">Christmas Eve Close:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editChristmasEveClosed }}
                                                                    value={this.state.editChristmasEveClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editChristmasEveClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.editChristmasEveClosed} onChange={() => { this.setState({ editChristmasEveClosed: !this.state.editChristmasEveClosed }) }} /> Closed on Christmas Eve</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />
                                                            <p className="text-white">Christas Day Open:</p>

                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editChristmasDayClosed }}
                                                                    value={this.state.editChristmasDayOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editChristmasDayOpen", new Date(e)) }}
                                                                />
                                                            </Card>
                                                            <p className="text-white">Christmas Day Close:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editChristmasDayClosed }}
                                                                    value={this.state.editChristmasDayClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editChristmasDayClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.editChristmasDayClosed} onChange={() => { this.setState({ editChristmasDayClosed: !this.state.editChristmasDayClosed }) }} /> Closed on Christmas Day</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />
                                                            <p className="text-white">New Year's Eve Open:</p>

                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editNewYearsEveClosed }}
                                                                    value={this.state.editNewYearsEveOpen}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editNewYearsEveOpen", new Date(e)) }}
                                                                />
                                                            </Card>
                                                            <p className="text-white">New Year's Eve Close:</p>
                                                            <Card className="card-white" >
                                                                <ReactDateTime
                                                                    className="text-black"
                                                                    inputProps={{ disabled: this.state.editNewYearsEveClosed }}
                                                                    value={this.state.editNewYearsEveClose}
                                                                    dateFormat={false}
                                                                    onChange={(e) => { this.onValueChange("editNewYearsEveClose", new Date(e)) }}
                                                                />

                                                            </Card>
                                                            <div style={{ margin: "20px" }}>
                                                                <p className="text-white"><Input type="checkbox" checked={this.state.editNewYearsEveClosed} onChange={() => { this.setState({ editNewYearsEveClosed: !this.state.editNewYearsEveClosed }) }} /> Closed on New Year's Eve</p>
                                                            </div>
                                                            <hr style={{ border: "1px solid white" }} />


                                                        </FormGroup>
                                                    </Col>

                                                </Row>
                                                <hr style={{ borderBottom: "1px solid white" }} />
                                                <FormGroup>
                                                    <p className="text-white">Dealership Phone Number</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.editDealerPhoneNumber}
                                                        onChange={(e) => { this.onValueChange("editDealerPhoneNumber", e.target.value) }}
                                                    />

                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="text-white">Dealership Email Address</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.editDealerEmailAddress}
                                                        onChange={(e) => { this.onValueChange("editDealerEmailAddress", e.target.value) }}
                                                    />

                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="text-white">Preferred name for sales staff (i.e. “Sales Advisor”, “Audi Ownership Advisor”, etc.”)
                                                    <Input
                                                            style={{ backgroundColor: "white" }}
                                                            value={this.state.editDealerSalesPreferredName}
                                                            onChange={(e) => { this.onValueChange("editDealerSalesPreferredName", e.target.value) }}
                                                        />
                                                    </p>
                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="text-white">Dealership Perks (i.e. free car wash, free oil change, etc.)</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.editDealerPerks}
                                                        onChange={(e) => { this.onValueChange("editDealerPerks", e.target.value) }}
                                                    />

                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="text-white">Website URL</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.editWebsiteURL}
                                                        onChange={(e) => { this.onValueChange("editWebsiteURL", e.target.value) }}
                                                    />

                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="text-white">Inventory Search URL - New Cars</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.editNewSearchURL}
                                                        onChange={(e) => { this.onValueChange("editNewSearchURL", e.target.value) }}
                                                    />

                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="text-white">Inventory Search URL - Used Cars</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.editUsedSearchURL}
                                                        onChange={(e) => { this.onValueChange("editUsedSearchURL", e.target.value) }}
                                                    />

                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="text-white">Trade-In Form URL</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.editTradeInURL}
                                                        onChange={(e) => { this.onValueChange("editTradeInURL", e.target.value) }}
                                                    />

                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="text-white">Financing Page URL</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.editFinancingURL}
                                                        onChange={(e) => { this.onValueChange("editFinancingURL", e.target.value) }}
                                                    />

                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="text-white">Service Page URL</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.editServiceURL}
                                                        onChange={(e) => { this.onValueChange("editServiceURL", e.target.value) }}
                                                    />

                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="text-white">Warranty/VSC Page URL</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.editWarrantyURL}
                                                        onChange={(e) => { this.onValueChange("editWarrantyURL", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <br />
                                                <FormGroup>
                                                    <p className="text-white">
                                                        <Input
                                                            style={{ margin: "20px" }}
                                                            type="checkbox"
                                                            checked={this.state.editHomeDeliveryOfferedTF}
                                                            onChange={(e) => { this.setState({ editHomeDeliveryOfferedTF: !this.state.editHomeDeliveryOfferedTF }) }}
                                                        />Home Delivery Offered (T/F)
                                                    </p>
                                                </FormGroup>
                                                <br />
                                                <FormGroup>
                                                    <p className="text-white">Home Delivery Radius</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.editHomeDeliveryRadius}
                                                        onChange={(e) => { this.onValueChange("editHomeDeliveryRadius", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="text-white">Home Delivery Fee</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.editHomeDeliveryFee}
                                                        onChange={(e) => { this.onValueChange("editHomeDeliveryFee", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="text-white">New Car Disclaimer</p>
                                                    <Input
                                                        type="textarea"
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.editNewCarDisclaimer}
                                                        onChange={(e) => { this.onValueChange("editNewCarDisclaimer", e.target.value) }}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="text-white">Used Car Disclaimer</p>
                                                    <Input
                                                        type="textarea"
                                                        style={{ backgroundColor: "white", whiteSpace: "pre-wrap" }}
                                                        value={this.state.editUsedCarDisclaimer}
                                                        onChange={(e) => { this.onValueChange("editUsedCarDisclaimer", e.target.value) }}
                                                    />

                                                </FormGroup>
                                                <br />
                                                <FormGroup>
                                                    <p className="text-white">
                                                        <Input
                                                            style={{ margin: "20px" }}
                                                            type="checkbox"
                                                            checked={this.state.editReturnPolicyTF}
                                                            onChange={(e) => { this.setState({ editReturnPolicyTF: !this.state.editReturnPolicyTF }) }}
                                                        />Return Policy (T/F)
                                                    </p>
                                                </FormGroup>
                                                <br />
                                                <FormGroup>
                                                    <p className="text-white">Return Policy - # of days</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.editReturnPolicyNumDays}
                                                        onChange={(e) => { this.onValueChange("editReturnPolicyNumDays", e.target.value) }}
                                                    />

                                                </FormGroup>
                                                <FormGroup>
                                                    <p id="carFaxPartnerIDTooltip" className="text-white">CarFax Partner ID</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.editCarFaxPartnerID}
                                                        onChange={(e) => { this.onValueChange("editCarFaxPartnerID", e.target.value) }}
                                                    />

                                                </FormGroup>
                                                <FormGroup>
                                                    <p id="registrationFeesTooltip" className="text-white">Registration Fees</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.editRegistrationFees}
                                                        onChange={(e) => { this.onValueChange("editRegistrationFees", e.target.value) }}
                                                    />

                                                </FormGroup>
                                                <FormGroup>
                                                    <p id="documentationFeesTooltip" className="text-white">Documentation Fees</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.editDocumentaionFees}
                                                        onChange={(e) => { this.onValueChange("editDocumentaionFees", e.target.value) }}
                                                    />

                                                </FormGroup>
                                                <FormGroup>
                                                    <p id="otherFeesTooltip" className="text-white">Other Fees (Name, Amount)</p>
                                                    <Input
                                                        style={{ backgroundColor: "white" }}
                                                        value={this.state.editOtherFees}
                                                        onChange={(e) => { this.onValueChange("editOtherFees", e.target.value) }}
                                                    />

                                                </FormGroup>
                                            </Form>
                                        </Col>
                                    </Row>
                                    <Row hidden={this.state.selected_profile === null} style={{ justifyContent: 'center' }}>
                                        <Col md="6" style={{ justifyContent: 'center' }}>
                                            <Button color="warning" onClick={() => { this.clearEditValues(); }}>Cancel</Button>
                                            <Button type="submit" color="success" onClick={(e) => this.updateNewDealerProfile(e)}>Submit</Button>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default MojoDealershipProfile;