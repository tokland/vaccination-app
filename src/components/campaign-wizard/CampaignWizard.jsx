import React from "react";
import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import { withRouter } from "react-router";
import _ from 'lodash';

import Wizard from "../wizard/Wizard";
import OrganisationUnits from 'components/steps/organisation-units/OrganisationUnits';
import FormHeading from './FormHeading';
import Campaign from "../../models/campaign";
import DbD2 from "../../models/db-d2";

const stepsBaseInfo = [
    {
        key: "organisation-units",
        label: i18n.t("Organisation Units"),
        component: OrganisationUnits,
        validationKeys: ["organisationUnits"]
    },
    {
        key: "general-info",
        label: i18n.t("General Info"),
        component: OrganisationUnits,
        validationKeys: []
    },
];

class CampaignWizard extends React.Component {
    static propTypes = {
        d2: PropTypes.object.isRequired,
        //campaign: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            campaign: Campaign.create(new DbD2(props.d2)),
        };
        window.campaign = this.state.campaign;
    }

    goToList = () => {
        this.props.history.push("/campaign-configurator");
    }

    onChange = (campaign) => {
        this.setState({campaign});
    }

    onStepChangeRequest = (currentStep, nextStep) => {
        const validationObj = this.state.campaign.validate();
        const messages = _(validationObj).at(currentStep.validationKeys).compact().value();
        return {valid: _(messages).isEmpty(), messages};
    }

    render() {
        const { d2 } = this.props;
        const { campaign } = this.state;

        const steps = stepsBaseInfo.map(step => ({
            ...step,
            props: {
                d2,
                campaign,
                onChange: this.onChange,
            },
        }));

        return (
            <div>
                <FormHeading
                    title={i18n.t("New vaccination campaign")}
                    onBackClick={this.goToList}
                />

                <Wizard
                    steps={steps}
                    initialStepKey="organisation-units"
                    onStepChangeRequest={this.onStepChangeRequest}
                />
            </div>
        );
    }
}

export default withRouter(CampaignWizard);
