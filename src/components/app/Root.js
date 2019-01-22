import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom';
import CampaignConfigurator from '../campaign-configurator/CampaignConfigurator';
import LandingPage from './LandingPage';

class Root extends React.Component {
    static propTypes = {
        d2: PropTypes.object.isRequired,
    }

    render() {
        const { d2 } = this.props;

        return (
            <Switch>
                <Route path='/campaign-configurator' render={() => <CampaignConfigurator d2={d2} />} />
                <Route render={() => <LandingPage d2={d2} />} />
            </Switch>
        )
    }
}

export default Root;
