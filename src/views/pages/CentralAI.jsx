import React from "react";
// reactstrap components
import {
    Button,
    Card,
    CardImg,
    Container,
    CardBody,
    CardHeader,
    Row,
    Col,
    Table,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    Input,

} from "reactstrap";
import Select from 'react-select'
class CentralAI extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            leads: [],
            dealerships: []
        }
        this._isMounted = false
    }
    async componentWillMount() {
        this._isMounted = true
    }


    async componentDidMount() {
        let leads = await this.props.mongo.find("mojo_leads");
        let dealerships = await this.props.mongo.find("mojo_dealership_profiles")
        leads = await leads.filter((l) => {
            return l.dealership_id !== ""
        })
        await leads.sort((a, b) => {
            return b.mojo_score - a.mojo_score
        })


        this.setState({ leads, dealerships })
    }


    componentWillUnmount() {
        this._isMounted = false
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

                        <Col className="ml-auto mr-auto text-center" md="12">
                            <hr />
                            <Card style={{ background: "linear-gradient(0deg, #000000 0%, #1d67a8 100%)" }}>
                                <CardBody>
                                    <Table bordered >
                                        <thead>
                                            <tr>
                                                <th className="text-white" style={{ border: "1px white solid" }}>Name</th>
                                                <th className="text-white" style={{ border: "1px white solid" }}>Dealership</th>
                                                <th className="text-white" style={{ border: "1px white solid" }}>Phone</th>
                                                <th className="text-white" style={{ border: "1px white solid" }}>Email</th>
                                                <th className="text-white" style={{ border: "1px white solid" }}>Transcript</th>
                                                <th className="text-white" style={{ border: "1px white solid" }}>Score</th>
                                                <th className="text-white" style={{ border: "1px white solid" }}>Recommended Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.leads.map((lead, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td style={{ border: "1px white solid" }}><p className="text-white">{lead.first_name}</p></td>
                                                        <td style={{ border: "1px white solid" }}><p className="text-white">{this.state.dealerships.findIndex((d) => { return d._id === lead.dealership_id }) === -1 ? "not found" : this.state.dealerships[this.state.dealerships.findIndex((d) => { return d._id === lead.dealership_id })].dealershipName}</p></td>
                                                        <td style={{ border: "1px white solid" }}><p className="text-white">{lead.phone_number}</p></td>
                                                        <td style={{ border: "1px white solid" }}><p className="text-white">{lead.email}</p></td>
                                                        <td style={{ border: "1px white solid" }}><a className="text-white" href={lead.transcript.substring(15)} target="_blank">Transcript</a></td>
                                                        <td style={{ border: "1px white solid" }}><p className="text-white">{lead.mojo_score}</p></td>
                                                        <td style={{ border: "1px white solid" }}><p className="text-white">{lead.recommended_action}</p></td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                            <hr />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default CentralAI;