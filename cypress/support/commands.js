// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// 로그인 상태가 필요한 테스트에서 beforeEach(() => cy.login()) 으로 사용
Cypress.Commands.add("login", (email, password) => {
  cy.visit("/login");
  cy.get('[data-cy="loginEmail"]').type(email);
  cy.get('[data-cy="loginPass"]').type(password);
  cy.get('[data-cy="loginSubmit"]').click();
  cy.url().should("eq", Cypress.config("baseUrl") + "/");
});
