import React from "react";
import ReactDOM from "react-dom";
import { init, config, getUserSettings, getManifest } from "d2";
import "font-awesome/css/font-awesome.min.css";
import { BrowserRouter } from "react-router-dom";
import i18n from '@dhis2/d2-i18n';

import App from "./components/app/App";

const d2UiTranslations = {
    "app_search_placeholder": i18n.t("Search apps"),
    "manage_my_apps": i18n.t("Manage my apps"),
    "no_results_found": i18n.t("No results found"),
    "select": i18n.t("Select"),
    "deselect": i18n.t("Unselect"),
    "select_all": i18n.t("Select all"),
    "deselect_all": i18n.t("Unselect all"),
    "organisation_unit_level": i18n.t("Organisation Unit Level"),
    "organisation_unit_group": i18n.t("Organisation Unit Group"),
};

function isLangRTL(code) {
    const langs = ["ar", "fa", "ur"];
    const prefixed = langs.map(c => `${c}-`);
    return langs.includes(code) || prefixed.filter(c => code && code.startsWith(c)).length > 0;
}

function configI18n(userSettings) {
    const uiLocale = userSettings.keyUiLocale;

    if (uiLocale && uiLocale !== "en") {
        config.i18n.sources.add(`./i18n/i18n_module_${uiLocale}.properties`);
    }

    config.i18n.sources.add("./i18n/i18n_module_en.properties");
    document.documentElement.setAttribute("dir", isLangRTL(uiLocale) ? "rtl" : "ltr");

    i18n.changeLanguage(uiLocale);
}

async function getBaseUrl() {
    if (process.env.NODE_ENV === "development") {
        const envVariable = "REACT_APP_DHIS2_URL";
        const defaultServer = "http://localhost:8080";
        const baseUrl = process.env[envVariable] || defaultServer;
        console.info(`[DEV] DHIS2 instance: ${baseUrl}`);
        return baseUrl;
    } else {
        const manifest = await getManifest("./manifest.webapp");
        return manifest.getBaseUrl();
    }
}

function setD2UiTranslations(d2) {
    Object.assign(d2.i18n.translations, d2UiTranslations);
}

async function main() {
    const baseUrl = await getBaseUrl();
    const apiUrl = baseUrl.replace(/\/*$/, "") + "/api";
    try {
        const d2 = await init({ baseUrl: apiUrl });
        window.d2 = d2; // Make d2 available in the console
        await setD2UiTranslations(d2);
        const userSettings = await getUserSettings();
        configI18n(userSettings);
        const appConfig = await fetch("app-config.json", {
            credentials: "same-origin",
        }).then(res => res.json());
        ReactDOM.render(
            <BrowserRouter>
                <App d2={d2} appConfig={appConfig} />
            </BrowserRouter>,
            document.getElementById("root")
        );
    } catch (err) {
        console.error(err);
        const message = err.toString().match("Unable to get schemas") ? (
            <div>
                <a rel="noopener noreferrer" target="_blank" href={baseUrl}>
                    Login
                </a>{" "}
                {baseUrl}
            </div>
        ) : (
            err.toString()
        );
        ReactDOM.render(<div>{message}</div>, document.getElementById("root"));
    }
}

main();
