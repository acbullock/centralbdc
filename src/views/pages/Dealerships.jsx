import React from "react";
// reactstrap components
import {
    Button,
    Label,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    InputGroup, InputGroupAddon, InputGroupText, Form,
    Collapse,
    Row,
    Col,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    // UncontrolledTooltip
} from "reactstrap";

import classnames from "classnames";

class Dealerships extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
         modalDemo: false,
            agents: [],
            sources: [],
            openedCollapses: [],
            addSourceModal: false,
            editSourceModal: false,
            editSourceValue: "",
            newSourceName: "",
            loading: false,
            err: {
                message: ""
            },
            editSourceName: "",   
        }
        
    }

    render() {
        return (
            <div className="content">
                <Row>
                    <Col lg="12">
                        
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Dealerships;