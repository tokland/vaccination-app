import _ from 'utils/lodash';

const fields = [
    "id",
    "name",
    "displayName",
    "shortName",
    "created",
    "lastUpdated",
    "externalAccess",
    "publicAccess",
    "userAccesses",
    "userGroupAccesses",
    "user",
    "access",
    "attributeValues",
    "href",
];

function cleanOptions(options) {
    return _.omitBy(options, value => _.isArray(value) && _.isEmpty(value));
}

export async function get(d2, filters, pagination) {
    const { searchValue, showOnlyUserCampaigns } = filters;
    const { page, pageSize = 20, sorting } = pagination;
    const order = sorting ? sorting.join(":") : null;
    const baseFilters = [
        searchValue ? `displayName:ilike:${searchValue}` : null,
        showOnlyUserCampaigns? `user.id:eq:${d2.currentUser.id}` : null
    ];

    return d2.models.dataSets.list(cleanOptions({
        order,
        fields,
        filter: _.compact(baseFilters),
        page,
        pageSize,
    }));
}
