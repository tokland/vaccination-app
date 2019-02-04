import React from "react";
import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const styles = theme => ({
    root: {
        display: "flex",
    },
});

class LandingPage extends React.Component {
    static propTypes = {
        d2: PropTypes.object.isRequired,
    };

    onClick = key => {
        console.log("TODO", "clicked", key);
    };

    render() {
        const { classes } = this.props;
        const items = [
            ["campaign-configurator", i18n.t("Campaign Configurator")],
            ["data-entry", i18n.t("Data Entry")],
            ["dashboard", i18n.t("Dashboard")],
            ["settings", i18n.t("Settings")],
        ];
        const menuItems = items.map(([key, title]) => (
            <MenuItem
                key={key}
                data-test={`page-${key}`}
                onClick={this.onClick.bind(this, key)}
                component={Link}
                to={`/${key}`}
            >
                {title}
            </MenuItem>
        ));

        return (
            <div className={classes.root}>
                <Paper>
                    <MenuList data-test="pages">{menuItems}</MenuList>
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(LandingPage);
