import React from "react";
import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import { withRouter } from "react-router";
import _ from 'lodash';

import Wizard from "../wizard/Wizard";
import FormHeading from './FormHeading';
import Campaign from "models/campaign";
import DbD2 from "models/db-d2";
import OrganisationUnitsStep from "../steps/organisation-units/OrganisationUnitsStep";
import SaveStep from "../steps/save/SaveStep";

const stepsBaseInfo = [
    {
        key: "organisation-units",
        label: i18n.t("Organisation Units"),
        component: OrganisationUnitsStep,
        validationKeys: ["organisationUnits"]
    },
    {
        key: "save",
        label: i18n.t("Save"),
        component: SaveStep,
        validationKeys: []
    },
];

const translations = {
    no_organisation_units_selected: i18n.t("Select at least one organisation unit"),
}

class CampaignWizard extends React.Component {
    static propTypes = {
        d2: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            campaign: Campaign.create(new DbD2(props.d2)),
        };
    }

    goToList = () => {
        this.props.history.push("/campaign-configurator");
    }

    onChange = (campaign) => {
        window.campaign = campaign;
        this.setState({campaign});
    }

    onStepChangeRequest = (currentStep) => {
        const validationObj = this.state.campaign.validate();
        const messages = _(validationObj)
            .at(currentStep.validationKeys)
            .compact()
            .map(s => i18n.t(translations[s]) || s)
            .value();
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
                    //initialStepKey="save"
                    useSnackFeedback={true}
                    onStepChangeRequest={this.onStepChangeRequest}
                />
            </div>
        );
    }
}

export default withRouter(CampaignWizard);
