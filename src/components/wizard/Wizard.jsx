import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import memoize from "nano-memoize";
import i18n from "@dhis2/d2-i18n";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import Button from "@material-ui/core/Button";
import { IconButton } from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import { withFeedback, levels } from "../feedback";
import DialogHandler from "../dialog-handler/DialogHandler";

const styles = theme => ({
    root: {
        width: "90%",
    },
    button: {
        margin: theme.spacing.unit,
        marginRight: 30,
        padding: 10,
    },
    buttonDisabled: {
        color: "grey !important",
    },
    contents: {
        margin: 10,
        padding: 0,
    },
    messages: {
        padding: 0,
        listStyleType: "none",
        color: "red",
    },
});

class Wizard extends React.Component {
    state = {
        currentStepKey: this.props.initialStepKey,
        messages: [],
    };

    static propTypes = {
        initialStepKey: PropTypes.string.isRequired,
        onStepChangeRequest: PropTypes.func.isRequired,
        useSnackFeedback: PropTypes.bool,
        feedback: PropTypes.func,
        steps: PropTypes.arrayOf(
            PropTypes.shape({
                key: PropTypes.string.isRequired,
                label: PropTypes.string.isRequired,
                component: PropTypes.func.isRequired,
            })
        ).isRequired,
    };

    static defaultProps = {
        useSnackFeedback: false,
    };

    getAdjacentSteps = () => {
        const { steps } = this.props;
        const { currentStepKey } = this.state;
        const index = _(steps).findIndex(step => step.key === currentStepKey);
        const prevStepKey = index >= 1 ? steps[index - 1].key : null;
        const nextStepKey = index >= 0 && index < steps.length - 1 ? steps[index + 1].key : null;
        return { prevStepKey, nextStepKey };
    };

    nextStep = () => {
        const { currentStepKey } = this.state;
        const stepsByKey = _.keyBy(this.props.steps, "key");
        const currentStep = stepsByKey[currentStepKey];
        const { nextStepKey } = this.getAdjacentSteps();
        const nextStep = stepsByKey[nextStepKey];
        const stepChangeResponse = this.props.onStepChangeRequest(currentStep, nextStep);

        if (stepChangeResponse.valid) {
            this.setStep(nextStepKey);
        } else {
            if (this.props.useSnackFeedback) {
                this.props.feedback(levels.ERROR, stepChangeResponse.messages.join("\n"));
            } else {
                this.setState({ messages: stepChangeResponse.messages });
            }
        }
    };

    prevStep = () => {
        const { prevStepKey } = this.getAdjacentSteps();
        this.setStep(prevStepKey);
    };

    renderNavigationButton({ stepKey, onClick, label }) {
        return (
            <Button
                variant="contained"
                classes={{ disabled: this.props.classes.buttonDisabled }}
                disabled={!stepKey}
                className={this.props.classes.button}
                onClick={onClick}
            >
                {label}
            </Button>
        );
    }

    setStep = stepKey => {
        this.setState({ currentStepKey: stepKey, messages: [] });
    };

    onStepClicked = memoize(stepKey => () => {
        this.setStep(stepKey);
    });

    renderHelp = ({ step }) => {
        const Button = ({ onClick }) => (
            <IconButton tooltip={i18n.t("Help")} onClick={onClick}>
                <Icon color="primary">help</Icon>
            </IconButton>
        );

        return (
            <DialogHandler
                buttonComponent={Button}
                title={`${step.label} - ${i18n.t("Help")}`}
                contents={step.help}
            />
        );
    };

    render() {
        const { classes, steps, useSnackFeedback } = this.props;
        const { currentStepKey, messages } = this.state;
        const index = _(steps).findIndex(step => step.key === currentStepKey);
        const currentStepIndex = index >= 0 ? index : 0;
        const currentStep = steps[currentStepIndex];
        const { prevStepKey, nextStepKey } = this.getAdjacentSteps();
        const NavigationButton = this.renderNavigationButton.bind(this);
        const Help = this.renderHelp;

        return (
            <div className={classes.root}>
                <Stepper nonLinear={false} activeStep={currentStepIndex}>
                    {steps.map(step => (
                        <Step key={step.key}>
                            <StepButton
                                key={step.key}
                                data-test-current={currentStep === step}
                                onClick={this.onStepClicked(step.key)}
                            >
                                {step.label}
                            </StepButton>
                        </Step>
                    ))}
                </Stepper>

                <div>
                    <NavigationButton
                        stepKey={prevStepKey}
                        onClick={this.prevStep}
                        label={"← " + i18n.t("Previous")}
                    />

                    <NavigationButton
                        stepKey={nextStepKey}
                        onClick={this.nextStep}
                        label={i18n.t("Next") + " →"}
                    />

                    {currentStep.help ? <Help step={currentStep} /> : null}
                </div>

                {!useSnackFeedback &&
                    messages.length > 0 && (
                        <div className="messages">
                            <ul className={classes.messages}>
                                {messages.map((message, index) => (
                                    <li key={index}>{message}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                <Paper className={classes.contents}>
                    <currentStep.component {...currentStep.props} />
                </Paper>
            </div>
        );
    }
}

export default withFeedback(withStyles(styles)(Wizard));
