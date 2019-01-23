import _ from 'lodash';

export function currentUserHasAdminRole(d2) {
    const authorities = d2.currentUser.authorities;
    return authorities.has("M_dhis-web-maintenance-appmanager") || authorities.has("ALL");
}

const requiredAuthorities = ["F_SECTION_DELETE", "F_SECTION_ADD"];

function hasRequiredAuthorities(d2) {
    return requiredAuthorities.every(authority => d2.currentUser.authorities.has(authority))
}

export function canManage(d2, datasets) {
    return datasets.every(dataset => dataset.access.manage);
}

export function canCreate(d2) {
    return d2.currentUser.canCreatePrivate(d2.models.dataSets) && hasRequiredAuthorities(d2);
}

export function canDelete(d2, datasets) {
    return d2.currentUser.canDelete(d2.models.dataSets) &&
        _(datasets).every(dataset => dataset.access.delete) &&
        hasRequiredAuthorities(d2);
}

export function canUpdate(d2, datasets) {
    const publicDatasetsSelected = _(datasets).some(dataset => dataset.publicAccess.match(/^r/));
    const privateDatasetsSelected = _(datasets).some(dataset => dataset.publicAccess.match(/^-/));
    const datasetsUpdatable = _(datasets).every(dataset => dataset.access.update);
    const privateCondition = !privateDatasetsSelected || d2.currentUser.canCreatePrivate(d2.models.dataSets);
    const publicCondition = !publicDatasetsSelected || d2.currentUser.canCreatePublic(d2.models.dataSets);

    return hasRequiredAuthorities(d2) && privateCondition && publicCondition && datasetsUpdatable;
}
