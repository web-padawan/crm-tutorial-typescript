describe("Login form", function () {
  it('should show login overlay wrapper', () => {
    cy.visit('/login');
    cy.get('vaadin-login-overlay-wrapper').should('be.visible');
  });
});
