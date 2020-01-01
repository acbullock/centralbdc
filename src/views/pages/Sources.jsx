import React from "react";
// reactstrap components
import {
    Button,
    Container,
    CardImg,
    Label,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    InputGroup, InputGroupAddon, InputGroupText, Form,
    Collapse,
    FormGroup,
    Row,
    Col,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    // UncontrolledTooltip
} from "reactstrap";
import Select from "react-select"
import classnames from "classnames";

class SourceManagement extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            sources: [],
            selected_source: { label: "", value: "" },
            addModal: false,
            editModal: false,
            sourceName: "",
            editSourceName: ""
        }
        this.toggle = this.toggle.bind(this)
        this.getSources = this.getSources.bind(this)
        this.addSource = this.addSource.bind(this)
        this.editSource = this.editSource.bind(this)
        this.removeSource = this.removeSource.bind(this)
        this._isMounted = false;
    }
    toggle(modal_name) {
        this.setState({ [modal_name]: !this.state[modal_name] })
    }
    async componentWillMount() {
        this._isMounted = true;
        this.setState({ loading: true })
        await this.getSources()
        this.setState({ loading: false })
    }
    async componentWillUnmount() {
        this._isMounted = false;
    }
    async getSources() {
        this.setState({ loading: true })
        let sources = this._isMounted && await this.props.mongo.find("sources")
        sources.sort((a, b) => {
            if (a.label > b.label) return 1;
            if (a.label < b.label) return -1;
            return 0;
        })
        this.setState({ loading: false, sources })
    }
    async addSource() {
        this.setState({ loading: true });
        let inserted = this._isMounted && await this.props.mongo.insertOne("sources", { label: this.props.utils.toTitleCase(this.state.sourceName) });
        this._isMounted && await this.props.mongo.findOneAndUpdate("sources", { label: this.props.utils.toTitleCase(this.state.sourceName) }, { value: inserted.insertedId })
        this._isMounted && await this.getSources()
        this.setState({ loading: false, sourceName: "" });
    }
    async editSource() {
        this.setState({ loading: true })
        this._isMounted && await this.props.mongo.findOneAndUpdate("sources", { value: this.state.selected_source.value }, { label: this.props.utils.toTitleCase(this.state.editSourceName) })
        this._isMounted && this.getSources();
        this.setState({ loading: false, selected_source: {label: "", value: ""} })
    }
    async removeSource() {
        this.setState({ loading: true });
        let source = this._isMounted && await this.props.mongo.findOneAndDelete("sources", { value: this.state.selected_source.value });
        this._isMounted && await this.getSources()
        this.setState({ loading: false, selected_source: { label: "", value: "" } });
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
                            <Card className="card-raised card-white">
                                <CardTitle>
                                    <legend>Add Source</legend>
                                </CardTitle>
                                <CardBody>
                                    <Button color="primary" onClick={() => { this.toggle("addModal") }}><i className="tim-icons icon-simple-add" /></Button>
                                    <Modal isOpen={this.state.addModal} toggle={() => { this.toggle("addModal") }}>
                                        <ModalHeader toggle={() => { this.toggle("addModal") }}>Add Source</ModalHeader>
                                        <ModalBody>
                                            <Form onSubmit={(e) => { e.preventDefault(); this.state.sourceName.length > 0 ? this.addSource() : this.setState({ sourceName: "" }); this.toggle("addModal") }}>
                                                <FormGroup>
                                                    <Label for="avgMonthlyPhoneUps">Source Name</Label>
                                                    <Input
                                                        type="text"
                                                        name="sourceName"
                                                        id="sourceName"
                                                        placeholder="Source Name"
                                                        value={this.state.sourceName}
                                                        onChange={(e) => { this.setState({ sourceName: e.target.value }) }}
                                                    />
                                                </FormGroup>
                                            </Form>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="warning" onClick={() => { this.setState({ sourceName: "" }); this.toggle("addModal") }}>Cancel</Button>
                                            <Button type="submit" disabled={this.state.sourceName.length < 1} color="success" onClick={() => { this.toggle("addModal"); this.addSource() }}>Add Source</Button>{' '}

                                        </ModalFooter>
                                    </Modal>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="ml-auto mr-auto text-center" md="8">
                            <Card className="card-raised card-white">
                                <CardTitle>
                                    <legend>Edit/Delete Source</legend>
                                </CardTitle>
                                <CardBody>
                                    <Select
                                        options={this.state.sources}
                                        value={this.state.selected_source}
                                        onChange={(e) => { this.setState({ selected_source: e }) }}
                                    />
                                    <Button color="danger" disabled={this.state.selected_source.label.length < 1} onClick={this.removeSource}><i className="tim-icons icon-simple-remove" /></Button>
                                    <Button color="info" disabled={this.state.selected_source.label.length < 1} onClick={() => { this.toggle("editModal"); this.setState({ editSourceName: this.state.selected_source.label }) }}><i className="tim-icons icon-pencil" /></Button>
                                    <Modal isOpen={this.state.editModal} toggle={() => { this.toggle("editModal") }}>
                                        <ModalHeader toggle={() => { this.toggle("editModal") }}>Edit Source</ModalHeader>
                                        <ModalBody>
                                            <Form onSubmit={(e) => { e.preventDefault(); this.state.editSourceName.length > 0 ? this.editSource() : this.setState({ editSourceName: "" }); this.toggle("editModal") }}>
                                                <FormGroup>
                                                    <Label for="editSourceName">Source Name</Label>
                                                    <Input
                                                        type="text"
                                                        name="editSourceName"
                                                        id="editSourceName"
                                                        placeholder="Edit Source Name"
                                                        value={this.state.editSourceName}
                                                        onChange={(e) => { this.setState({ editSourceName: e.target.value }) }}
                                                    />
                                                </FormGroup>
                                            </Form>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="warning" onClick={() => { this.setState({ editSourceName: "" }); this.toggle("editModal") }}>Cancel</Button>
                                            <Button type="submit" disabled={this.state.editSourceName.length < 1} color="success" onClick={() => { this.toggle("editModal"); this.editSource() }}>Update</Button>{' '}

                                        </ModalFooter>
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

export default SourceManagement;