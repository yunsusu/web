describe("보호된 라우트 접근 테스트", () => {
  it("비로그인 상태로 글쓰기 페이지 접근 시 로그인 페이지로 이동한다", () => {
    // Given : 로그인하지 않은 상태에서
    // When : 글쓰기 페이지(/write)로 직접 접근하면
    cy.visit("/write");
    // Then : 로그인 페이지로 리다이렉트된다
    cy.url().should("include", "/login");
  });

  it("비로그인 상태로 마이페이지 접근 시 로그인 페이지로 이동한다", () => {
    // When : 마이페이지(/profile)로 직접 접근하면
    cy.visit("/profile");
    // Then : 로그인 페이지로 리다이렉트된다
    cy.url().should("include", "/login");
  });

  it("비로그인 상태로 글 수정 페이지 접근 시 로그인 페이지로 이동한다", () => {
    // When : 글 수정 페이지(/edit/:id)로 직접 접근하면
    cy.visit("/edit/1");
    // Then : 로그인 페이지로 리다이렉트된다
    cy.url().should("include", "/login");
  });

  it("존재하지 않는 경로로 접근하면 메인 페이지로 이동한다", () => {
    // Given : 존재하지 않는 경로가 있을 때
    // When : 해당 경로로 접근하면
    cy.visit("/no-such-page");
    // Then : 메인 페이지(/)로 리다이렉트된다
    cy.url().should("eq", Cypress.config("baseUrl") + "/");
  });
});
