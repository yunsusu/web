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
  cy.intercept("POST", "**/auth/v1/token**").as("login");

  cy.visit("/login");
  cy.get('[data-cy="loginEmail"]').type(email);
  cy.get('[data-cy="loginPass"]').type(password);
  cy.get('[data-cy="loginSubmit"]').click();

  cy.wait("@login");
  cy.url().should("eq", Cypress.config("baseUrl") + "/");
});

Cypress.Commands.add("createPost", () => {
  cy.intercept("POST", "**/posts?select=*").as("PostWrite");

  // Given : 글쓰기 페이지에서
  cy.visit("/write");
  // When : 제목과 내용을 입력 후 등록 버튼을 눌러
  cy.get('[data-cy="writeTitle"]').as("title");
  cy.get('[data-cy="writeContent"]').as("content");

  cy.get("@title").type("제목 테스트 123 asdf");
  cy.get("@content").type("내용 테스트 123 asdf");

  cy.get('[data-cy="writeSubmit"]').click();
  // Then : 정상적으로 글이 게시판에 등록된다.
  cy.wait("@PostWrite");

  cy.url()
    .should("include", "/post/")
    .then((url) => {
      const postId = url.split("/post/")[1];
      cy.url().should("eq", `${Cypress.config("baseUrl")}/post/${postId}`);
    });
});
