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

// reactstrap components
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardImg,
    CardTitle,
    ListGroupItem,
    ListGroup,
    Progress,
    Input,
    Label,
    Container,
    Row,
    Col
} from "reactstrap";
import Select from "react-select"

class FailedTexts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            agent: {},
            appointments: [],
            assistance: [],
            loading: true,
            currDealer: {},
            failed_texts: [],
            numDays: 0
        };

    }
    _isMounted = false
    async componentWillMount(){
        this._isMounted = true
        let user = await this.props.mongo.getActiveUser(this.props.mongo.mongodb)
        let agent = await this.props.mongo.findOne("agents", {userId: user.userId})
        if(agent.account_type !== "admin"){
            this._isMounted = false;
            this.props.history.push("/admin/dashboard")
        }
    }
    async componentDidMount() {
        this._isMounted = true
        this._isMounted && await this.refreshList()


        this.setState({ loading: false })

    }
    async refreshList(){
        this.setState({loading: true})
        let failed_texts =  this._isMounted && await this.props.mongo.find("failed_texts")
       this.setState({  failed_texts: failed_texts, loading: false })
    }
    async resendText(failed_text){
        let query = {_id: failed_text._id}
        this.setState({loading: true})
        let token = this._isMounted && await this.props.mongo.getToken()
        this._isMounted && await this.props.mongo.sendGroupText(failed_text.item.body.from.phoneNumber, failed_text.item.body.text, [failed_text.item.body.to[0].phoneNumber], token) 
        
        //remove from list..
        this._isMounted && await this.props.mongo.findOneAndDelete("failed_texts", query)
        this._isMounted && await this.refreshList()
        this.setState({loading:false})
    }
    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async resendAll(){
        this.setState({loading: true})
        let failed_texts = this.state.failed_texts;
        for(let t in failed_texts){
            this.setState({loading: true})
            await this.resendText(failed_texts[t])
            this.setState({loading: true})
            await this.timeout(1000)
        }
        this.setState({loading: false})
    }
    async removeText(failed_text){
        this.setState({loading: true})
        this._isMounted && await this.props.mongo.findOneAndDelete("failed_texts", {_id: failed_text._id})
        this._isMounted && await this.refreshList()

        this.setState({loading: false})
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
                                <Card color="transparent">
                                    <CardImg top width="100%" src={this.props.utils.loading} />
                                </Card>
                            </Col>
                        </Container>
                    </div>
                </>
            );
        }
        return (
            <>
                <div className="content">
                    <Container >
                        <Row>
                            <Col className="ml-auto mr-auto text-center" md="6">
                                
                                <h1 className="title">Failed Texts</h1>
                                <h1 hidden={!this.state.loading}>Loading</h1>
                                <br />
                            </Col>
                        </Row>
                        <br /><br /><br />
                        <Row>
                            
                            <Col lg="12" md="12">
                                <h2>Failed Text Count: {this.state.failed_texts.length}</h2>
                                <Button  disabled={this.state.loading} onClick={()=>{this.refreshList()}}>Refresh</Button>
                                <Button disabled={this.state.loading || this.state.failed_texts.length == 0} color="info" onClick={()=>{this.resendAll()}}>Resend All</Button>
                                <Card className="card-warning card-raised card-white" >
                                    <CardBody >
                                        {
                                            this.state.failed_texts.map((f, i) => {
                                                return (
                                                    <div key={f._id} style={{ whiteSpace: "pre-wrap" }} >
                                                        {/* <p>Agent Name: <strong>{appt.agent_name}</strong></p> */}
                                                        <p><strong>To: </strong>{f.item.body.to[0].phoneNumber}</p>
                                                        <p><strong>From: </strong>{f.item.body.from.phoneNumber}</p>
                                                        <blockquote>{f.item.body.text}</blockquote>

                                                        <p><strong>Error Message: </strong> {f.item.message}</p>
                                                        <Button disabled={this.state.loading} color="primary" onClick={()=>{this.resendText(f)}}>Resend Text</Button>
                                                        <Button disabled={this.state.loading} color="warning" onClick={()=>this.removeText(f)}>Cancel Text</Button>
                                                        <hr />
                                                    </div>
                                                )
                                            })
                                        }
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </>
        );
    }
}

export default FailedTexts;
