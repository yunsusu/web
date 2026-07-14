describe("로그인 실패", () => {
  beforeEach(() => {
    cy.intercept("POST", "**/token?grant_type**").as("loginPost");

    cy.visit("/login");
  });
  it("비밀번호를 틀릴 경우", () => {
    // Given : 로그인 페이지에서
    // When : 옳바른 이메일과 틀린 비밀번호를 입력하면
    cy.get("[data-cy=loginEmail]").type("test@email.com");
    cy.get("[data-cy=loginPass]").type("qweqweqweqweqw");
    cy.get("[data-cy=loginSubmit]").click();
    // Then : 화면에 '이메일 또는 비밀번호가 올바르지 않습니다.' 문구 출력
    cy.wait("@loginPost");

    cy.contains("이메일 또는 비밀번호가 올바르지 않습니다.");
  });
  it("이메일을 틀릴 경우", () => {
    // Given : 로그인 페이지에서
    // When : 옳바른 이메일과 틀린 비밀번호를 입력하면
    cy.get("[data-cy=loginEmail]").type("test@email1232.com");
    cy.get("[data-cy=loginPass]").type("1q2w3e");
    cy.get("[data-cy=loginSubmit]").click();
    // Then : 화면에 '이메일 또는 비밀번호가 올바르지 않습니다.' 문구 출력
    cy.wait("@loginPost");

    cy.contains("이메일 또는 비밀번호가 올바르지 않습니다.");
  });
});
