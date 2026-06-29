describe("글쓰기 테스트", () => {
  beforeEach(() => {
    cy.login("test@email.com", "1q2w3e");
  });
  it("글 등록 후 수정하기", () => {
    cy.intercept("POST", "**/posts?select=*").as("PostWrite");
    cy.intercept("OPTIONS", "**/posts?id=**").as("PutWrite");

    // Given : 글 작성 후 글 페이지에서
    cy.visit("/write");
    cy.get('[data-cy="writeTitle"]').as("title");
    cy.get('[data-cy="writeContent"]').as("content");

    cy.get("@title").type("제목 테스트 123 asdf");
    cy.get("@content").type("내용 테스트 123 asdf");

    cy.get('[data-cy="writeSubmit"]').click();

    cy.wait("@PostWrite");

    cy.url()
      .should("include", "/post/")
      .then((url) => {
        const postId = url.split("/post/")[1];
        cy.url().should("eq", `${Cypress.config("baseUrl")}/post/${postId}`);
      });

    // When : 수정하기를 누른 후 내용을 수정하여
    cy.get('[data-cy="editPost"]').click();

    cy.wait(100);
    cy.get("@title").should("be.visible").type("제목 수정");
    cy.get("@content").should("be.visible").type("내용 수정");

    cy.get('[data-cy="writeSubmit"]').click();

    cy.wait("@PutWrite");
    // Then : 수정된 제목과 내용을 등록한다.
    cy.url()
      .should("include", "/post/")
      .then((url) => {
        const postId = url.split("/post/")[1];
        cy.url().should("eq", `${Cypress.config("baseUrl")}/post/${postId}`);
      });
  });
});
