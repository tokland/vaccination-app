import React from 'react';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import i18n from "@dhis2/d2-i18n";
import _ from 'lodash';

const styles = theme => ({
    root: {
        width: '90%',
    },
    button: {
        margin: theme.spacing.unit,
        marginRight: 30,
    },
    buttonDisabled: {
        color: "grey !important",
    },
    contents: {
        margin: 10,
        padding: 10,
    },
});

class Wizard extends React.Component {
    state = {
        currentStepKey: this.props.initialStepKey,
        messages: [],
    }

    static propTypes = {
        initialStepKey: PropTypes.string.isRequired,
        onStepChangeRequest: PropTypes.func.isRequired,
        steps: PropTypes.arrayOf(PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            component: PropTypes.func.isRequired,
        })).isRequired,
    }


    getAdjacentSteps = () => {
        const { steps } = this.props;
        const { currentStepKey } = this.state;
        const index = _(steps).findIndex(step => step.key === currentStepKey);
        const prevStepKey = index >= 1 ? steps[index - 1].key : null;
        const nextStepKey = index >= 0 && index < steps.length - 1 ? steps[index + 1].key : null;
        return {prevStepKey, nextStepKey};
    }

    nextStep = () => {
        const { currentStepKey } = this.state;
        const stepsByKey = _.keyBy(this.props.steps, "key");
        const currentStep = stepsByKey[currentStepKey];
        const {nextStepKey} = this.getAdjacentSteps();
        const nextStep = stepsByKey[nextStepKey];
        const stepChangeResponse = this.props.onStepChangeRequest(currentStep, nextStep);

        if (stepChangeResponse.valid) {
            this.setState({ currentStepKey: nextStepKey})
        } else {
            this.setState({ messages: stepChangeResponse.messages })
        }
    }

    prevStep = () => {
        const {prevStepKey} = this.getAdjacentSteps();
        this.setState({ currentStepKey: prevStepKey})
    }

    renderNaviagationButton(stepKey, onStepClicked, label) {
        return (
            <Button
                variant="contained"
                classes={{disabled: this.props.classes.buttonDisabled}}
                disabled={!stepKey}
                className={this.props.classes.button}
                onClick={onStepClicked}
            >
                {label}
            </Button>
        );
    }

    render() {
        const { classes, steps } = this.props;
        const { currentStepKey, messages } = this.state;
        const index = _(steps).findIndex(step => step.key === currentStepKey);
        const currentStepIndex = index >= 0 ? index : 0;
        const currentStep = steps[currentStepIndex];
        const {prevStepKey, nextStepKey} = this.getAdjacentSteps();

        return (
            <div className={classes.root}>
                <Stepper activeStep={currentStepIndex}>
                    {steps.map(step =>
                        <Step key={step.key}>
                            <StepLabel>
                                {step.label}
                            </StepLabel>
                        </Step>
                    )}
                </Stepper>

                <div>
                    {this.renderNaviagationButton(prevStepKey, this.prevStep, i18n.t("Previous"))}
                    {this.renderNaviagationButton(nextStepKey, this.nextStep, i18n.t("Next"))}
                </div>

                {messages.length > 0 &&
                    <div className="feedback">
                        <ul>
                            {messages.map((message, index) => (<li key={index}>{message}</li>))}
                        </ul>
                    </div>
                }

                <Paper className={classes.contents}>
                    <currentStep.component {...currentStep.props} />
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(Wizard);
