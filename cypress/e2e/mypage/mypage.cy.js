describe("마이페이지 테스트", () => {
  beforeEach(() => {
    cy.login("test@email.com", "1q2w3e");
  });
  it("닉네임 수정 테스트", () => {
    cy.intercept("put", "**/user").as("putName");

    const newName = "name" + new Date().getSeconds();
    // Given : 마이페이지에서
    cy.visit("/profile");
    // When : 프로필 편집의 닉네임 input을 눌러 수정 후 저장한다.
    cy.get('[data-cy="nameChange"]').clear().type(newName);
    cy.get('[data-cy="submitChange"]').click();
    // Then : 데이터 전송 후 저장되며, gnb와 마이페이지에 닉네임이 수정된다.
    cy.wait("@putName");

    cy.get('[data-cy="username"]').should("have.text", newName);
    cy.get('[data-cy="profileName"]').should("have.text", newName);
  });

  it("작성 글 불러오기 테스트", () => {
    cy.intercept("GET", "**/posts*").as("getPosts");

    // Given : 글이 존재하는 상태에서 마이페이지로 이동
    cy.createPost();
    cy.visit("/profile");

    // When : 내가 작성한 글을 불러와서
    cy.wait("@getPosts");

    // Then : 리스트로 출력된다.
    cy.contains("내가 쓴 글").should("exist");
    cy.get('a[href*="/post/"]').should("have.length.greaterThan", 0);
  });
});
