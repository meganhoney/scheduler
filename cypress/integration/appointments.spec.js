describe("Appointment", () => {
  
  // steps included for every test
  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");
    cy.visit("/");
    cy.contains("Monday");
  });

  it("should book an interview", () => {
    cy.get("[alt=Add]")
    .first()
    .click();
    cy.get("[data-testid=student-name-input]").type("Lydia Miller-Jones");
    cy.get("[alt='Sylvia Palmer']").click();
    cy.contains("Save").click();
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  });

  it("should edit an interview", () => {
    cy.get("[alt=Edit]")
    .first()
    .click({force: true});
    cy.get("[data-testid=student-name-input]").clear().type("Tony Hawk");
    cy.get("[alt='Tori Malcolm']").click();
    cy.contains("Save").click();
    cy.contains(".appointment__card--show", "Tony Hawk");
    cy.contains(".appointment__card--show", "Tori Malcolm");
  });

  it("schould cancel an interview", () => {
    cy.get("[alt=Delete")
    .first()
    .click({force: true});
    cy.contains("Confirm").click();
    cy.contains("Canceling").should("exist");
    cy.contains("Canceling").should("not.exist");
    cy.contains(".appointment__card--show", "Archie Cohen")
    .should("not.exist");
  })
});