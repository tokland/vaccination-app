import React from 'react';
import PropTypes from 'prop-types';
import i18n from "@dhis2/d2-i18n";
import _ from 'lodash';
import { withStyles } from "@material-ui/core/styles";
import { Button } from '@material-ui/core';

const styles = theme => ({
    wrapper: {
        padding: 5,
    },
});

class SaveStep extends React.Component {
    state = {
        orgUnitNames: null,
    }

    static propTypes = {
        d2: PropTypes.object.isRequired,
        campaign: PropTypes.object.isRequired,
    };

    async componentDidMount() {
        const { campaign } = this.props;
        const orgUnitNames = await campaign.getOrganisationUnitsFullName();
        this.setState({orgUnitNames})
    }

    save = () => {
        console.log("TODO")
    }

    getMessageFromPaginated(paginatedObjects) {
        if (!paginatedObjects) {
            return i18n.t("Loading...");
        } else {
            const {pager, objects} = paginatedObjects;
            const othersCount = pager.total - objects.length;
            const names = _(objects).sortBy().join(", ") || i18n.t("[None]");
            if (othersCount > 0) {
                return i18n.t("{{names}} and {{othersCount}} other(s)", {names, othersCount});
            } else {
                return names;
            }
        }
    }

    render() {
        const {classes} = this.props;
        const {orgUnitNames} = this.state;

        return (
            <div className={classes.wrapper}>
                <h3>
                    {i18n.t("The campaign vaccination setup is finished. Press the button Save to save the data")}
                </h3>

                <ul>
                    <li>
                        <b>{i18n.t("Organisation Units")}</b>:&nbsp;
                            {this.getMessageFromPaginated(orgUnitNames)}
                    </li>
                </ul>

                <Button onClick={this.save} variant="contained">
                    {i18n.t("Save")}
                </Button>
            </div>
        );
    }
}

export default withStyles(styles)(SaveStep);
