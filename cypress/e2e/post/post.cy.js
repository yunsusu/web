describe("게시글 테스트", () => {
  beforeEach(() => {
    cy.login("test@email.com", "1q2w3e");
  });
  it("리스트 확인 후 클릭해 이동 테스트", () => {
    // Given : 메인 페이지에서 게시글 페이지를 들어가서
    cy.visit("/");

    // When : 글이 출력되는지 확인 후 클릭하여
    cy.get('[data-cy="postList"] > a')
      .should("be.visible")
      .its("length")
      .then((count) => {
        Cypress._.times(count, (i) => {
          cy.get('[data-cy="postList"] > a').eq(i).click();

          // Then : 각 게시글 페이지로 이동한다.
          cy.url().should("include", "/post");

          cy.go("back");

          cy.get('[data-cy="postList"]').should("be.visible");
        });
      });
  });
});
