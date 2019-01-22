import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
});

class CampaignConfigurator extends React.Component {
    static propTypes = {
        d2: PropTypes.object.isRequired,
    }

    onClick = (key) => {
        console.log("TODO", "clicked", key);
    }

    render() {
        return (
            <div>
                Campaign configurator
            </div>
        )
    }
}

export default withStyles(styles)(CampaignConfigurator)
