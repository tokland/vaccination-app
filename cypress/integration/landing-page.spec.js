/// <reference types='Cypress' />

context('Landing page', () => {
    before(() => {
        cy.login('system', 'System123')
        cy.loadPage()
    });

    beforeEach(() => {
    })

    it('loads', () => {
        cy.title().should('equal', 'Vaccination App')
    })

    it('shows 4 pages', () => {
        cy.get('[data-test="pages"]')
            .should('have.length', 1)
            .should('be.visible')

        cy.get('[data-test="page-campaign-configurator"]')
            .should('have.length', 1)

        cy.get('[data-test="page-data-entry"]')
            .should('have.length', 1)

        cy.get('[data-test="page-dashboard"]')
            .should('have.length', 1)

        cy.get('[data-test="page-settings"]')
            .should('have.length', 1)
    })
})
