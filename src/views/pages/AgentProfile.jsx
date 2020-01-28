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
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
    Button,
    Card,
    CardImg,
    Container,
    CardHeader,
    CardBody,
    CardTitle,
    Table,
    Input,
    Form, FormGroup, Label,
    Row,
    Col,
    CustomInput,
} from "reactstrap";
import Select from "react-select"
import logo from "../../assets/img/logo.png";

class AgentProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            newImage: "",
            newProfileImg: null,
            fileBinary: null,
            imageUrl: "",
            editImageUrl: "",
            agent: null,
            user: null,
            saveDisabled: false
        };
        this.imageToBuffer = this.imageToBuffer.bind(this)
        this.inputRef = React.createRef()
    }
    _isMounted = false;
    async componentDidMount() {
        this._isMounted = true
        this._isMounted && await this.setState({ loading: true })
        let user = this._isMounted && await this.props.mongo.getActiveUser(this.props.mongo.mongodb)
        let agent = this._isMounted && await this.props.mongo.findOne("agents", { userId: user.userId })
        let imageUrl = "";
        if (agent.fileBinary !== undefined) {
            imageUrl = this._isMounted && await this.props.utils.imageUrlFromBuffer(this.props.utils.toArrayBuffer(agent.fileBinary.data))


        }
        console.log(imageUrl)
        this._isMounted && await this.setState({ loading: false, user, agent, imageUrl, editImageUrl: imageUrl })

    }
    componentWillUnmount() {
        this._isMounted = false
    }
    async imageToBuffer() {

        var reader = new FileReader();
        let buff = null
        reader.onload = e => {
            let arrayBuffer = reader.result;
            console.log(arrayBuffer)
            this.setState({ fileBinary: arrayBuffer })
            let url = this.props.utils.imageUrlFromBuffer(arrayBuffer)
            this.setState({ editImageUrl: url })
        }

        this._isMounted && await reader.readAsArrayBuffer(this.state.newProfileImg)

    }



    render() {

        if (this.state.loading) {
            return (
                <>
                    <div className="content">
                        <Container>
                            <Col className="ml-auto mr-auto text-center" md="6">
                                {/* <Card color="transparent" > */}
                                <CardImg top width="100%" src={this.props.utils.loading} />
                                {/* </Card> */}
                            </Col>
                        </Container>
                    </div>
                </>
            );
        }
        return (
            <>
                <div className="content">
                    <Row style={{ textAlign: "center" }}>
                        <Col md="12" >
                            <img src={logo} alt="react-logo" height="100" style={{ textAlign: "center", display: "block", margin: "auto" }} />
                            <h1 style={{ background: "-webkit-linear-gradient(#1d67a8, #000000)", "WebkitBackgroundClip": "text", "WebkitTextFillColor": "transparent" }}><strong>Agent Profile</strong></h1>
                            {/* <h1 style={{ color: "#1d67a8", textAlign: "center" }}><strong>Service Department</strong></h1> */}
                        </Col>
                    </Row>
                    <br />
                    <Row style={{ textAlign: "center" }}>
                        <Col md="12" >
                            <Card style={{ padding: "20px", background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardTitle>
                                    <h1 className="text-white"><strong>Basic Info</strong></h1>
                                    <hr style={{ border: "1px solid white" }} />
                                </CardTitle>
                                <Row>
                                    <Col md="6" >
                                        <h3 className="text-white"><strong>Profile Picture</strong></h3>
                                        {/* <img className="img-thumbnail" width="200" height="200" style={{ background: 'url("https://dummyimage.com/200x200/000000/ffffff&text=Upload+Image")' }} src={this.state.editImageUrl.length < 1 ? null : this.state.editImageUrl} /> */}
                                        <img className="img-thumbnail" width="200" height="200" style={{ backgroundColor: "transparent" }} src={this.state.editImageUrl.length < 1 ? 'https://dummyimage.com/200x200/1d67a8/ffffff&text=No+Image' : this.state.editImageUrl} />
                                        <br />
                                        <Button color="info" onClick={() => { this.inputRef.current.click() }}>
                                            <input style={{ display: "none" }} ref={this.inputRef} accept="image/png, image/jpeg" type="file" id="exampleCustomFileBrowser" name="customFile" value={this.state.newImage} onChange={async (e) => {
                                                console.log(e.target.files[0])
                                                if (e.target.files[0].size > 1000000) { return }
                                                this._isMounted && await this.setState({ newProfileImg: e.target.files[0] })
                                                this._isMounted && await this.imageToBuffer()
                                            }}
                                            />
                                            Edit Image
                                        </Button>
                                        <p className="text-white">(Limit: 1 MB)</p>
                                        <br />
                                        <Button
                                            color="warning" onClick={() => {
                                                let imageUrl = "";
                                                if (this.state.agent.fileBinary !== undefined) {
                                                    if (this.state.agent.fileBinary.data !== undefined)
                                                        imageUrl = this.props.utils.imageUrlFromBuffer(this.props.utils.toArrayBuffer(this.state.agent.fileBinary.data))
                                                }
                                                this.setState({ editImageUrl: imageUrl })
                                            }}>Cancel</Button>
                                        <Button
                                            disabled={this.state.saveDisabled}
                                            color="success" onClick={async () => {
                                                this.setState({ saveDisabled: true })
                                                var imageUrl = this.props.utils.imageUrlFromBuffer(this.state.fileBinary)
                                                this.setState({ editImageUrl: imageUrl, imageUrl: imageUrl })
                                                console.log(this.props.utils.toBuffer(this.state.fileBinary))
                                                this._isMounted && await this.props.mongo.findOneAndUpdate("agents", { _id: this.state.agent._id }, Object.assign(this.state.agent, { fileBinary: this.props.utils.toBuffer(this.state.fileBinary) }))
                                                window.location.reload(false);
                                            }}>Save</Button>
                                    </Col>
                                    <Col md="6" style={{ textAlign: "left" }}>
                                        {(() => {
                                            if (this.state.agent === null) {
                                                return null;
                                            }
                                            return (
                                                <div>
                                                    <h3 className="text-white"><strong>Name:</strong> {this.state.agent.name} ({this.state.agent.account_type})</h3>
                                                    <h3 className="text-white"><strong>Email:</strong> {this.state.agent.email}</h3>
                                                    <h3 className="text-white"><strong>Department:</strong> {this.props.utils.toTitleCase(this.state.agent.department)}</h3>
                                                </div>
                                            )
                                        })()}
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                    <Row style={{ textAlign: "center" }}>
                        <Col md="12" >
                            <Card style={{ padding: "20px", background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardTitle>
                                    <h1 className="text-white"><strong>Skills</strong></h1>
                                    <hr style={{ border: "1px solid white" }} />
                                </CardTitle>
                                <Row>
                                    <Col md="3" >
                                        <h3 className="text-white" style={{ textDecoration: "underline" }}>Sales BDC</h3>
                                        {(() => {
                                            if (!this.state.agent) return null;
                                            return (<div>


                                                <p className="text-white"><input readOnly type="checkbox" checked={
                                                    (() => {
                                                        if (!this.state.agent.skills) return false;
                                                        if (!this.state.agent.skills.sales) return false;
                                                        return this.state.agent.skills.sales.newLeads
                                                    })()
                                                } /> New Leads</p>
                                                <p className="text-white"><input readOnly type="checkbox" checked={
                                                    (() => {
                                                        if (!this.state.agent.skills) return false;
                                                        if (!this.state.agent.skills.sales) return false;
                                                        return this.state.agent.skills.sales.day1And2
                                                    })()
                                                } /> Day 1 & 2</p>
                                                <p className="text-white"><input readOnly type="checkbox" checked={
                                                    (() => {
                                                        if (!this.state.agent.skills) return false;
                                                        if (!this.state.agent.skills.sales) return false;
                                                        return this.state.agent.skills.sales.day3And4
                                                    })()
                                                } /> Day 3 & 4</p>
                                                <p className="text-white"><input readOnly type="checkbox" checked={
                                                    (() => {
                                                        if (!this.state.agent.skills) return false;
                                                        if (!this.state.agent.skills.sales) return false;
                                                        return this.state.agent.skills.sales.missedAppointments
                                                    })()
                                                } /> Missed Appointments</p>
                                                <p className="text-white"><input readOnly type="checkbox" checked={
                                                    (() => {
                                                        if (!this.state.agent.skills) return false;
                                                        if (!this.state.agent.skills.sales) return false;
                                                        return this.state.agent.skills.sales.day7
                                                    })()
                                                } /> Day 7</p>
                                                <p className="text-white"><input readOnly type="checkbox" checked={
                                                    (() => {
                                                        if (!this.state.agent.skills) return false;
                                                        if (!this.state.agent.skills.sales) return false;
                                                        return this.state.agent.skills.sales.day10
                                                    })()
                                                } /> Day 10</p>
                                                <p className="text-white"><input readOnly type="checkbox" checked={
                                                    (() => {
                                                        if (!this.state.agent.skills) return false;
                                                        if (!this.state.agent.skills.sales) return false;
                                                        return this.state.agent.skills.sales.day15
                                                    })()
                                                } /> Day 15</p>
                                                <p className="text-white"><input readOnly type="checkbox" checked={
                                                    (() => {
                                                        if (!this.state.agent.skills) return false;
                                                        if (!this.state.agent.skills.sales) return false;
                                                        return this.state.agent.skills.sales.day20
                                                    })()
                                                } /> Day 20</p>
                                            </div>);
                                        })()}
                                    </Col>
                                    <Col md="3" >
                                        <h3 className="text-white" style={{ textDecoration: "underline" }}>Service To Sales</h3>
                                        {(() => {
                                            if (!this.state.agent) return null;
                                            return (<div>
                                                <p className="text-white"><input readOnly type="checkbox" checked={
                                                    (() => {
                                                        if (!this.state.agent.skills) return false;
                                                        if (!this.state.agent.skills.serviceToSales) return false;
                                                        return this.state.agent.skills.serviceToSales.serviceDriveRd1
                                                    })()
                                                } /> Service Drive: Round 1</p>
                                                <p className="text-white"><input readOnly type="checkbox" checked={
                                                    (() => {
                                                        if (!this.state.agent.skills) return false;
                                                        if (!this.state.agent.skills.serviceToSales) return false;
                                                        return this.state.agent.skills.serviceToSales.serviceDriveRd2
                                                    })()
                                                } /> Service Drive: Round 2</p>
                                                <p className="text-white"><input readOnly type="checkbox" checked={
                                                    (() => {
                                                        if (!this.state.agent.skills) return false;
                                                        if (!this.state.agent.skills.serviceToSales) return false;
                                                        return this.state.agent.skills.serviceToSales.dataMiningHighInterest
                                                    })()
                                                } /> Data-mining: High Interest</p>
                                                <p className="text-white"><input readOnly type="checkbox" checked={
                                                    (() => {
                                                        if (!this.state.agent.skills) return false;
                                                        if (!this.state.agent.skills.serviceToSales) return false;
                                                        return this.state.agent.skills.serviceToSales.dataMiningLeases
                                                    })()
                                                } /> Data-mining: Leases</p>
                                                <p className="text-white"><input readOnly type="checkbox" checked={
                                                    (() => {
                                                        if (!this.state.agent.skills) return false;
                                                        if (!this.state.agent.skills.serviceToSales) return false;
                                                        return this.state.agent.skills.serviceToSales.dataMiningBuyBack
                                                    })()
                                                } /> Data-mining: Buy Back</p>
                                            </div>);
                                        })()}
                                    </Col>
                                    <Col md="3" >
                                        <h3 className="text-white" style={{ textDecoration: "underline" }}>Service</h3>
                                        {(() => {
                                            if (!this.state.agent) return null;
                                            return (<div>


                                                <p className="text-white"><input readOnly type="checkbox" checked={
                                                    (() => {
                                                        if (!this.state.agent.skills) return false;
                                                        if (!this.state.agent.skills.service) return false;
                                                        return this.state.agent.skills.service.missedAppointments
                                                    })()
                                                } /> Missed Appointments</p>
                                                <p className="text-white"><input readOnly type="checkbox" checked={
                                                    (() => {
                                                        if (!this.state.agent.skills) return false;
                                                        if (!this.state.agent.skills.service) return false;
                                                        return this.state.agent.skills.service.day7
                                                    })()
                                                } /> Day 7</p>
                                                <p className="text-white"><input readOnly type="checkbox" checked={
                                                    (() => {
                                                        if (!this.state.agent.skills) return false;
                                                        if (!this.state.agent.skills.service) return false;
                                                        return this.state.agent.skills.service.day14
                                                    })()
                                                } /> Day 14</p>
                                                <p className="text-white"><input readOnly type="checkbox" checked={
                                                    (() => {
                                                        if (!this.state.agent.skills) return false;
                                                        if (!this.state.agent.skills.service) return false;
                                                        return this.state.agent.skills.service.firstService
                                                    })()
                                                } /> First Service</p>
                                                <p className="text-white"><input readOnly type="checkbox" checked={
                                                    (() => {
                                                        if (!this.state.agent.skills) return false;
                                                        if (!this.state.agent.skills.service) return false;
                                                        return this.state.agent.skills.service.serviceReminder
                                                    })()
                                                } /> Service Reminder</p>
                                            </div>);
                                        })()}
                                    </Col>
                                    <Col md="3" >
                                        <h3 className="text-white" style={{ textDecoration: "underline" }}>Text/Email</h3>
                                        {(() => {
                                            if (!this.state.agent) return null;
                                            return (<div>


                                                <p className="text-white"><input readOnly type="checkbox" checked={
                                                    (() => {
                                                        if (!this.state.agent.skills) return false;
                                                        if (!this.state.agent.skills.textEmail) return false;
                                                        return this.state.agent.skills.textEmail.newLeads
                                                    })()
                                                } /> New Leads</p>
                                                <p className="text-white"><input readOnly type="checkbox" checked={
                                                    (() => {
                                                        if (!this.state.agent.skills) return false;
                                                        if (!this.state.agent.skills.textEmail) return false;
                                                        return this.state.agent.skills.textEmail.day1And2
                                                    })()
                                                } /> Day 1 & 2</p>
                                                <p className="text-white"><input readOnly type="checkbox" checked={
                                                    (() => {
                                                        if (!this.state.agent.skills) return false;
                                                        if (!this.state.agent.skills.textEmail) return false;
                                                        return this.state.agent.skills.textEmail.day5
                                                    })()
                                                } /> Day 5</p>
                                                <p className="text-white"><input readOnly type="checkbox" checked={
                                                    (() => {
                                                        if (!this.state.agent.skills) return false;
                                                        if (!this.state.agent.skills.textEmail) return false;
                                                        return this.state.agent.skills.textEmail.day10
                                                    })()
                                                } /> Day 10</p>
                                                <p className="text-white"><input readOnly type="checkbox" checked={
                                                    (() => {
                                                        if (!this.state.agent.skills) return false;
                                                        if (!this.state.agent.skills.textEmail) return false;
                                                        return this.state.agent.skills.textEmail.day20
                                                    })()
                                                } /> Day 20</p>
                                                <p className="text-white"><input readOnly type="checkbox" checked={
                                                    (() => {
                                                        if (!this.state.agent.skills) return false;
                                                        if (!this.state.agent.skills.textEmail) return false;
                                                        return this.state.agent.skills.textEmail.missedAppointments
                                                    })()
                                                } /> Missed Appointments</p>
                                            </div>);
                                        })()}
                                    </Col>

                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}

export default AgentProfile;
