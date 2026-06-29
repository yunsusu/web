describe("글쓰기 테스트", () => {
  beforeEach(() => {
    cy.login("test@email.com", "1q2w3e");
  });
  it("글 등록 후 삭제", () => {
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

    // 삭제 API 요청 인터셉트
    cy.intercept("DELETE", "**/posts*").as("deletePost");

    // confirm 다이얼로그 자동 수락
    // cy.on("window:confirm", () => true);
    cy.window().then((win) => {
      cy.stub(win, "confirm").returns(true);
    });

    // When : 이후 삭제 버튼을 눌러
    cy.get('[data-cy="deletePost"]').click();

    // Then : 삭제 요청이 정상적으로 전송되고 목록 페이지로 이동한다.
    cy.wait("@deletePost")
      .its("response.statusCode")
      .should("be.oneOf", [200, 204]);
    cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
  });
  it("취소 후 돌아가기", () => {
    // Given : 글쓰기 페이지에서
    cy.visit("/write");
    // When : 취소 버튼을 눌러
    cy.get('[data-cy="writeBack"]').click();
    // Then : 게시판 페이지로 돌아간다.
    cy.url().should("include", "");
  });
});
