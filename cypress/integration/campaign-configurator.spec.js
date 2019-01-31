describe("Campaign configurator", () => {
    describe("List page", () => {
        before(() => {
            cy.login("admin", "district");
            cy.loadPage("/campaign-configurator");
        });

        beforeEach(() => {
            cy.login("admin", "district");
        });

        it("should have the filter only my campaign set by default", () => {
            cy.get("[data-test='only-my-campaigns']").should("be.checked");
        });

        it("shows list of user dataset", () => {
            cy.get(".data-table__rows__row").should("have.length", 1);

            cy.get(".data-table__rows > :nth-child(1) > :nth-child(2) span").should(
                "have.text",
                "Project Management"
            );
        });

        it("opens details window when mouse clicked", () => {
            cy.contains("Project Management").click();

            cy.contains("Short name");
            cy.contains("Y8gAn9DfAGU");
        });

        it("opens context window when right button mouse is clicked", () => {
            cy.contains("Project Management")
                .first()
                .trigger("contextmenu");
            cy.wait(1000);

            cy.contains("Details");
            cy.contains("Edit");
            cy.contains("Share");
            cy.contains("Delete");
            cy.contains("Go to Data Entry");
            cy.contains("Go to Dashboard");
            cy.contains("Download data");

            cy.contains("Details").click();
        });

        context("Unset filter only-my-campaigns", () => {
            beforeEach(() => {
                cy.get("[data-test='only-my-campaigns']").uncheck();
            });

            it("shows list of user dataset sorted alphabetically", () => {
                cy.get(".data-table__rows__row").should("have.length", 10);

                cy.get(".data-table__rows > :nth-child(1) > :nth-child(2) span").should(
                    "have.text",
                    "ART monthly summary"
                );

                cy.get(".data-table__rows > :nth-child(2) > :nth-child(2) span").should(
                    "have.text",
                    "Child Health"
                );
            });

            context("Use filter box", () => {
                beforeEach(() => {
                    cy.get("[data-test='search']")
                        .clear()
                        .type("res");
                    cy.wait(500);
                });

                it("can filter datasets by name (case insensitive)", () => {
                    cy.get(".data-table__rows__row").should("have.length", 2);

                    cy.get(".data-table__rows > :nth-child(1) > :nth-child(2) span").should(
                        "have.text",
                        "Emergency Response"
                    );

                    cy.get(".data-table__rows > :nth-child(2) > :nth-child(2) span").should(
                        "have.text",
                        "Expenditures"
                    );
                });
            });

            context("Click name column", () => {
                beforeEach(() => {
                    cy.get("[data-test='search']").clear();
                    cy.contains("Name").click();
                });

                it("shows list of user dataset sorted alphabetically desc", () => {
                    cy.get(".data-table__rows__row").should("have.length", 10);

                    cy.get(".data-table__rows > :nth-child(1) > :nth-child(2) span").should(
                        "have.text",
                        "TB/HIV (VCCT) monthly summary"
                    );

                    cy.get(".data-table__rows > :nth-child(2) > :nth-child(2) span").should(
                        "have.text",
                        "TB Facility Reporting Form"
                    );
                });
            });
        });
    });
});
