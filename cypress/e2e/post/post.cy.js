describe("게시글 테스트", () => {
  beforeEach(() => {
    cy.login("test@email.com", "1q2w3e");
    cy.intercept("GET", "**/posts?select=id**").as("getList");
  });

  it("게시글 리스트가 정상적으로 출력된다", () => {
    // Given : 메인 페이지(게시글 리스트)에 접속
    cy.visit("/");

    // When : 게시글 목록 조회가 완료된다.
    cy.wait("@getList").then(({ response }) => {
      // Then : 게시글이 없으면 안내 문구를, 있으면 게시글 목록을 출력한다.
      if (response.body.length === 0) {
        cy.contains("아직 작성된 글이 없어요").should("be.visible");
      } else {
        cy.get('[data-cy="postList"] > a').should("have.length.greaterThan", 0);
      }
    });
  });

  it("게시글 클릭 시 상세 페이지로 이동한다", () => {
    // Given : 게시글 목록 페이지에 접속
    cy.visit("/");

    // When : 첫 번째 게시글을 클릭한다.
    cy.wait("@getList").then(({ response }) => {
      if (response.body.length === 0) {
        cy.log("게시글이 없어 테스트를 종료합니다.");
        return;
      }

      cy.get('[data-cy="postList"] > a').first().click();

      // Then : 게시글 상세 페이지로 이동한다.
      cy.url().should("include", "/post");
    });
  });

  it("상세 페이지에서 뒤로가기를 하면 게시글 목록으로 돌아온다", () => {
    // Given : 게시글 상세 페이지에 접속한다.
    cy.visit("/");

    cy.wait("@getList").then(({ response }) => {
      if (response.body.length === 0) {
        cy.log("게시글이 없어 테스트를 종료합니다.");
        return;
      }

      cy.get('[data-cy="postList"] > a').first().click();

      // When : 브라우저 뒤로가기를 수행한다.
      cy.go("back");

      // Then : 게시글 목록 페이지로 이동한다.
      cy.url().should("eq", Cypress.config("baseUrl") + "/");
      cy.get('[data-cy="postList"]').should("be.visible");
    });
  });
});
