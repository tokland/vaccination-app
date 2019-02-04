import React from "react";
import PropTypes from "prop-types";
import OrgUnitsSelector from "../../org-units-selector/OrgUnitsSelector";
import i18n from "@dhis2/d2-i18n";
import _ from "lodash";
import { withFeedback, levels } from "../../feedback";

class OrganisationUnitsStep extends React.Component {
    selectableLevels = [6];

    static propTypes = {
        d2: PropTypes.object.isRequired,
        campaign: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
        feedback: PropTypes.func.isRequired,
    };

    setOrgUnits = orgUnitsPaths => {
        const orgUnits = orgUnitsPaths.map(path => ({
            id: _.last(path.split("/")),
            path,
        }));
        const orgUnitsInSelectableLevels = orgUnits.filter(ou =>
            this.selectableLevels.includes(
                _(ou.path)
                    .countBy()
                    .get("/") || 0
            )
        );
        const newCampaign = this.props.campaign.setOrganisationUnits(orgUnitsInSelectableLevels);
        const allValid = _(orgUnitsPaths).isEqual(orgUnitsInSelectableLevels.map(ou => ou.path));
        if (!allValid) {
            const msg = i18n.t("Only organisation units of level {{levels}} can be selected", {
                levels: this.selectableLevels.join(", "),
            });
            this.props.feedback(levels.ERROR, msg);
        }
        this.props.onChange(newCampaign);
    };

    render() {
        const { d2, campaign } = this.props;

        return (
            <OrgUnitsSelector
                d2={d2}
                onChange={this.setOrgUnits}
                selected={campaign.getOrganisationUnits().map(ou => ou.path)}
            />
        );
    }
}

export default withFeedback(OrganisationUnitsStep);
