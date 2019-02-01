import { D2, D2Api } from './d2.types';
import { Db, OrganisationUnit, PaginatedObjects } from './db.types';

export default class DbD2 implements Db {
    d2: D2;
    api: D2Api;

    constructor(d2: D2) {
        this.d2 = d2;
        this.api = d2.Api.getApi();
    }

    public async getOrganisationUnitsFromIds(ids: string[]): Promise<PaginatedObjects<OrganisationUnit>> {
        const { pager, organisationUnits } = await this.api.get("/organisationUnits", {
            paging: true,
            filter: [`id:in:[${ids.join(',')}]`],
            fields: ["id", "displayName", "path", "level", "ancestors[id,displayName,path,level]"],
        });
        return { pager, objects: organisationUnits };
    }
}
