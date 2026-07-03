describe("댓글 테스트", () => {
  beforeEach(() => {
    cy.login("test@email.com", "1q2w3e");
    cy.createPost();
  });

  it("댓글 작성", () => {
    cy.intercept("post", "**/comments").as("commentPost");
    cy.intercept("get", "**/comments?select=**").as("commentGet");

    // Given : 글을 생성 후 post 페이지에서
    // When : 댓글 칸을 눌러 글을 입력 후 등록을 누른다.
    cy.get('[data-cy="writeComment"]').type("댓글 테스트 작성");
    cy.get('[data-cy="postComment"]').click();

    // Then : 댓글이 db로 보내지고, 화면에 출력된다.
    cy.wait("@commentPost");
    cy.wait("@commentGet");
    cy.contains("댓글 테스트 작성").should("be.visible");
  });

  it("댓글 삭제", () => {
    cy.intercept("post", "**/comments").as("commentPost");
    cy.intercept("get", "**/comments?select=**").as("commentGet");
    cy.intercept("delete", "**/comments?id=**").as("commentDelete");

    // Given : 댓글이 작성된 post 페이지에서
    cy.get('[data-cy="writeComment"]').type("삭제할 댓글");
    cy.get('[data-cy="postComment"]').click();
    cy.wait("@commentPost");
    cy.wait("@commentGet");

    // When : 댓글 삭제 버튼을 누른다.
    cy.window().then((win) => {
      cy.stub(win, "confirm").returns(true);
    });

    cy.contains("삭제할 댓글")
      .parents('[data-cy="commentBox"]')
      .find('[data-cy="deleteBtn"]')
      .click();

    // Then : 댓글이 db에서 삭제되고, 화면에서 사라진다.
    cy.wait("@commentDelete");
    cy.contains("삭제할 댓글").should("not.exist");
  });
});
