/*!

=========================================================
* Black Dashboard PRO React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// react plugin used to create DropdownMenu for selecting items


// reactstrap components
import {
    Container,
    CardImg,
    Row,
    Col,
    Form,
    Label,
    Input,
    InputGroup,
    CustomInput,
    FormGroup
} from "reactstrap";
import Select from "react-select"
class NewApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            condition: "",
            tradeInfo: "none",
            makes: [],
            selected_make: null,
            years: [],
            selected_year: null,
            models: [],
            selected_model: null,
            selected_trade_make: null,
            selected_trade_year: null,
            selected_trade_model: null,
            trade_mileage: "",
            trade_models: [],
            financeMethod: "",
            errorText: "",
            interior: "",
            exterior: ""
        };
        this.updateErrorText = this.updateErrorText.bind(this)
        this._isMounted = false;
    }
    isValidated() {
        this.updateErrorText()
        if (this.state.condition.length === 0) {
            return false
        }

        if (!this.state.selected_year || !this.state.selected_make || !this.state.selected_model) {
            return false
        }
        if (this.state.interior.length === 0) {
            return false
        }
        if (this.state.exterior.length === 0) {
            return false
        }
        //if trade y/m/m is selected, make sure none are blank
        if (this.state.tradeInfo === "tradeYmm") {
            if (!this.state.selected_trade_year || !this.state.selected_trade_make || !this.state.selected_trade_model || !this.state.trade_mileage) {
                return false
            }
            if (isNaN(this.state.trade_mileage)) {
                return false
            }
        }
        if (this.state.financeMethod.length === 0) {
            return false
        }
        return true;
    }
    async updateErrorText() {
        await this.setState({ errorText: "" })
        let err = ""
        //see if condition isn't selected..
        if (this.state.condition.length === 0) {
            err += `\nChoose one of the following: New, Used`
        }
        //if year/make/model is selected, make sure none are blank..
        if (!this.state.selected_year || !this.state.selected_make || !this.state.selected_model) {
            err += `\nYear, Make, and Model must all have values.`
        }
        //see if any color preference stuff is empty
        if (this.state.interior.length === 0) {
            err += `\nInterior color preference cannot be blank`
        }
        if (this.state.exterior.length === 0) {
            err += `\nExterior color preference cannot be blank`
        }
        //if trade y/m/m is selected, make sure none are blank
        if (this.state.tradeInfo === "tradeYmm") {
            if (!this.state.selected_trade_year || !this.state.selected_trade_make || !this.state.selected_trade_model || !this.state.trade_mileage) {
                err += `\nTrade-In Year, Make, Model and Mileage must all have values.`
            }
            if (isNaN(this.state.trade_mileage)) {
                err += `Trade-In Mileage must be a number`
            }
        }
        if (this.state.financeMethod.length === 0) {
            err += `\nMust choose Cash, Lease, or Finance`
        }
        await this.setState({ errorText: err })

    }
    async componentDidMount() {
        this._isMounted = true;
        this.setState({ loading: true })

        let makes = await this.props.wizardData.mongo.find("makes_and_models")

        makes = await makes.sort((a, b) => {
            if (a.label > b.label) return 1;
            if (a.label < b.label) return -1;
            return 0;
        })
        let years = []
        for (let i = 2021; i >= 1940; i--) {
            years.push({
                value: i,
                label: i.toString()
            })
        }
        await this.props.wizardData.generateInternalMessage()
        await this.props.wizardData.generateCustomerMessage()
        this._isMounted && await this.setState({ makes, loading: false, years })
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    async getModelsForMake(make) {
        let models = make.models
        models = await models.sort((a, b) => {
            if (a.label > b.label) return 1;
            if (a.label < b.label) return -1
            return 0
        })
        await this.setState({ models })
        return models
    }

    render() {
        if (this.state.loading) {
            return (
                <>
                    <div className="content">
                        <Container>
                            <Col className="ml-auto mr-auto text-center" md="6">
                                <CardImg top width="100%" src={this.props.wizardData.utils.loading} />
                            </Col>
                        </Container>
                    </div>
                </>
            );
        }
        return (
            <>
                <Container>
                    <Row style={{ justifyContent: "center" }}>
                        <Col md="6" style={{ border: "1px solid #1d67a8", margin: 10 }}>
                            <h3 className="text-primary">Customer Interests</h3>
                            <Form>
                                <FormGroup>
                                    <InputGroup className="input-group-text" style={{ justifyContent: "center" }}>
                                        <div style={{ margin: 20 }}>
                                            <CustomInput className="left" id="conditionNew" type="radio" value="new" checked={this.state.condition === "new"} onChange={async (e) => { this._isMounted && await this.setState({ condition: e.target.value }); await this.updateErrorText() }} label="New" />
                                        </div>
                                        <div style={{ margin: 20 }}>
                                            <CustomInput id="conditionUsed" type="radio" value="used" checked={this.state.condition === "used"} onChange={async (e) => { this._isMounted && await this.setState({ condition: e.target.value }); await this.updateErrorText() }} label="Used" />
                                        </div>
                                    </InputGroup>
                                </FormGroup>
                            </Form>
                            <hr style={{ borderBottom: "1px solid #1d67a8" }} />
                            <h4 className="text-primary">Color Preference</h4>
                            <Form>
                                <FormGroup>
                                    <p className="text-primary text-left">Exterior: </p>
                                    <InputGroup className="input-group-text" style={{ justifyContent: "center", margin: 10 }}>
                                        <div style={{ margin: 20 }}>
                                            <CustomInput
                                                id="exteriorLighter"
                                                type="radio"
                                                label="Lighter"
                                                value="lighter"
                                                checked={this.state.exterior === "lighter"}
                                                onChange={async (e) => { await this.setState({ exterior: e.target.value }); await this.updateErrorText() }}
                                            /></div>
                                        <div style={{ margin: 20 }}>
                                            <CustomInput
                                                id="exteriorDarker"
                                                type="radio"
                                                label="Darker"
                                                value="darker"
                                                checked={this.state.exterior === "darker"}
                                                onChange={async (e) => { await this.setState({ exterior: e.target.value }); await this.updateErrorText() }}
                                            />
                                        </div>
                                    </InputGroup>
                                    <p className="text-primary text-left">Interior: </p>
                                    <InputGroup className="input-group-text" style={{ justifyContent: "center", margin: 10 }}>
                                        <div style={{ margin: 20 }}>
                                            <CustomInput
                                                id="interiorLighter"
                                                type="radio"
                                                label="Lighter"
                                                value="lighter"
                                                checked={this.state.interior === "lighter"}
                                                onChange={async (e) => { await this.setState({ interior: e.target.value }); await this.updateErrorText() }}
                                            />
                                        </div>
                                        <div style={{ margin: 20 }}>
                                            <CustomInput
                                                id="interiorDarker"
                                                type="radio"
                                                label="Darker"
                                                value="darker"
                                                checked={this.state.interior === "darker"}
                                                onChange={async (e) => { await this.setState({ interior: e.target.value }); await this.updateErrorText() }}

                                            />
                                        </div>
                                    </InputGroup>
                                </FormGroup>
                            </Form>

                            <hr style={{ borderBottom: "1px solid #1d67a8" }} />
                            <Form>
                                <FormGroup>
                                    <p className="text-primary text-left">Year: </p>
                                    <Select id="yearInput" type="select" value={this.state.selected_year} options={this.state.years} onChange={async (e) => { await this.setState({ selected_year: e }); await this.updateErrorText() }} />
                                    <p className="text-primary text-left">Make: </p>
                                    <Select id="makeInput" type="select" value={this.state.selected_make} options={this.state.makes} onChange={async (e) => {
                                        await this.setState({ selected_make: e, selected_model: null });
                                        let mods = await this.getModelsForMake(e);
                                        await this.setState({ models: mods })
                                        this.updateErrorText()
                                    }} />
                                    <p className="text-primary text-left">Model: </p>
                                    <Select id="modelInput" type="select" value={this.state.selected_model} options={this.state.models} onChange={async (e) => { await this.setState({ selected_model: e }); await this.updateErrorText() }} />
                                </FormGroup>
                            </Form>

                        </Col>
                        <Col md="5" style={{ border: "1px solid #1d67a8", margin: 10 }}>
                            <h3 className="text-primary">Trade-in Info</h3>
                            <Form>
                                <FormGroup>
                                    <InputGroup className="input-group-text" style={{ justifyContent: "center", margin: 10 }}>
                                        <div style={{ margin: 20 }}>
                                            <CustomInput
                                                id="tradeNone"
                                                type="radio"
                                                value="none"
                                                checked={this.state.tradeInfo === "none"}
                                                label="No Trade-in"
                                                onChange={async (e) => { await this.setState({ tradeInfo: e.target.value }); await this.updateErrorText() }} />
                                        </div>
                                    </InputGroup>
                                    <InputGroup className="input-group-text" style={{ justifyContent: "center", margin: 10 }}>
                                        <div style={{ margin: 20 }}>
                                            <CustomInput
                                                id="tradeYmm"
                                                type="radio"
                                                value="tradeYmm"
                                                checked={this.state.tradeInfo === "tradeYmm"}
                                                label="Trade-in"
                                                onChange={async (e) => { await this.setState({ tradeInfo: e.target.value }); await this.updateErrorText() }} />
                                        </div>
                                    </InputGroup>

                                    <p hidden={this.state.tradeInfo !== "tradeYmm"} className="text-primary text-left">Year: </p>
                                    <Select className={this.state.tradeInfo !== "tradeYmm" ? "d-none" : ""} id="tradeYearInput" type="select" value={this.state.selected_trade_year} options={this.state.years} onChange={async (e) => { await this.setState({ selected_trade_year: e }); await this.updateErrorText() }} />
                                    <p hidden={this.state.tradeInfo !== "tradeYmm"} className="text-primary text-left">Make: </p>
                                    <Select className={this.state.tradeInfo !== "tradeYmm" ? "d-none" : ""} id="tradeMakeInput" type="select" value={this.state.selected_trade_make} options={this.state.makes} onChange={async (e) => {
                                        await this.setState({ selected_trade_make: e });
                                        let mods = await this.getModelsForMake(e);
                                        await this.setState({ trade_models: mods })
                                        await this.updateErrorText()
                                    }} />
                                    <p hidden={this.state.tradeInfo !== "tradeYmm"} className="text-primary text-left">Model: </p>
                                    <Select className={this.state.tradeInfo !== "tradeYmm" ? "d-none" : ""} id="tradeModelInput" type="select" value={this.state.selected_trade_model} options={this.state.trade_models} onChange={async (e) => { await this.setState({ selected_trade_model: e }); await this.updateErrorText() }} />
                                    <p hidden={this.state.tradeInfo !== "tradeYmm"} className="text-primary text-left">Mileage: </p>
                                    <CustomInput
                                        id="mileageInput"
                                        type="text"
                                        hidden={this.state.tradeInfo !== "tradeYmm"}
                                        value={this.state.trade_mileage}
                                        onChange={async (e) => { await this.setState({ trade_mileage: e.target.value }); await this.updateErrorText() }}
                                        style={{ width: "100%" }}
                                    />

                                </FormGroup>
                            </Form>
                            <h3 className="text-primary">Financial Info</h3>
                            <Form>
                                <FormGroup>
                                    <InputGroup className="input-group-text" style={{ justifyContent: "center", margin: 10 }}>
                                        <div style={{ margin: 20 }}>
                                            <CustomInput id="financeCash" type="radio" value="cash" checked={this.state.financeMethod === "cash"} onChange={async (e) => { this._isMounted && await this.setState({ financeMethod: e.target.value }); await this.updateErrorText() }} label="Cash" />
                                        </div>
                                        <div style={{ margin: 20 }}>
                                            <CustomInput id="financeLease" type="radio" value="lease" checked={this.state.financeMethod === "lease"} onChange={async (e) => { this._isMounted && await this.setState({ financeMethod: e.target.value }); await this.updateErrorText() }} label="Lease" />
                                        </div>
                                        <div style={{ margin: 20 }}>
                                            <CustomInput id="financeFinance" type="radio" value="finance" checked={this.state.financeMethod === "finance"} onChange={async (e) => { this._isMounted && await this.setState({ financeMethod: e.target.value }); await this.updateErrorText() }} label="Finance" />
                                        </div>
                                    </InputGroup>
                                </FormGroup>
                            </Form>
                        </Col>
                        <Col md="12">
                            <p className="text-warning" style={{ whiteSpace: "pre-wrap" }}><strong>{this.state.errorText}</strong></p>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default NewApp;
