import React from "react";
import { debounce } from "throttle-debounce";
import PropTypes from "prop-types";
import TextField from "material-ui/TextField";
import i18n from "@dhis2/d2-i18n";

class SearchBox extends React.Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        debounce: PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.state = { value: "" };
        this.onChangeDebounced = debounce(500, props.onChange);
    }

    render() {
        return (
            <div className="search-list-items">
                <TextField
                    className="list-search-field"
                    value={this.state.value}
                    fullWidth
                    type="search"
                    onChange={this._onKeyUp}
                    hintText={`${i18n.t("Search by name")}`}
                    data-test="search"
                />
            </div>
        );
    }

    _onKeyUp = event => {
        const { value } = event.target;
        this.onChangeDebounced(value);
        this.setState({ value });
    };
}

export default SearchBox;
