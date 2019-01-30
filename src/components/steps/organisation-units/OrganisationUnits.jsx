import React from 'react';
import PropTypes from 'prop-types';
import OrgUnitsSelector from '../../org-units-selector/OrgUnitsSelector';
import _ from 'lodash';

export default class OrganisationUnits extends React.Component {
    static propTypes = {
        d2: PropTypes.object.isRequired,
        campaign: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
    };

    /*
    constructor(props) {
        super(props);
        this.state = {campaign: props.campaign}
    }
    */

    setOrgUnits = (orgUnitsPaths) => {
        //const newCampaign = await this.props.campaign.setOrganisationUnitsFromPaths(orgUnitsPaths);
        const orgUnits = orgUnitsPaths.map(path => ({
            id: _.last(path.split("/")),
            path,
        }));
        const newCampaign = this.props.campaign.setOrganisationUnits(orgUnits);
        this.props.onChange(newCampaign);
    }

    render() {
        const { d2, campaign } = this.props;

        return (
            <OrgUnitsSelector
                d2={d2}
                onChange={this.setOrgUnits}
                selected={campaign.getOrganisationUnits().map(ou => ou.path)}
            />
        )
    }
}
