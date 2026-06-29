describe("회원가입 테스트", () => {
  it("회원가입 정상 시도", () => {
    cy.intercept("post", "**/signup").as("sign");
    const date = Date.now();
    const name = "test" + date;

    // Given : 회원가입 페이지에 접속
    cy.visit("/signup");
    // When : 닉네임, 이메일, 비밀번호, 비밀번호 확인 을 입력 후 회원가입 버튼을 눌러
    cy.get('[data-cy="nickname"]').as("nickname");
    cy.get("@nickname").type(name);

    cy.get('[data-cy="email"]').as("email");
    cy.get("@email").type(`${name}@test.com`);

    cy.get('[data-cy="password"]').as("password");
    cy.get("@password").type("qwe123");

    cy.get('[data-cy="passwordConfirm"]').as("passwordConfirm");
    cy.get("@passwordConfirm").type("qwe123");
    // Then : 정상적으로 회원가입을 한다.
    cy.get('[data-cy="submit"]').click();

    cy.wait("@sign");

    cy.url().should("include", "/login");
  });
  it("회원가입 비밀번호 확인 틀릴 경우", () => {
    const date = Date.now();
    const name = "test" + date;
    // Given : 회원가입 페이지에 접속
    cy.visit("/signup");
    // When : 비밀번호입력 후 비밀번호 확인을 잘못 입력한 이후 회원가입 버튼을 눌러
    cy.get('[data-cy="nickname"]').as("nickname");
    cy.get("@nickname").type(name);

    cy.get('[data-cy="email"]').as("email");
    cy.get("@email").type(`${name}@test.com`);

    cy.get('[data-cy="password"]').as("password");
    cy.get("@password").type("qwe123");

    cy.get('[data-cy="passwordConfirm"]').as("passwordConfirm");
    // 여기서 틀리게 작성
    cy.get("@passwordConfirm").type("qwe1234567");
    // Then : 회원가입이 불가능 하며, 비밀번호 불일치 알림이 뜬다.
    cy.get('[data-cy="submit"]').click();
    cy.get('[data-cy="error"]')
      .should("be.visible")
      .and("have.text", "비밀번호가 일치하지 않습니다.");
  });
});

describe("로그인 테스트", () => {
  it("로그인 정상 시도", () => {
    cy.login("test@email.com", "1q2w3e");
    // // Given : 로그인 페이지에 접속
    // cy.visit("/login");
    // // When : 이메일과 비밀번호를 입력해 로그인 버튼을 눌러
    // cy.get('[data-cy="loginEmail"]').type("test@email.com");
    // cy.get('[data-cy="loginPass"]').type("1q2w3e");
    // // Then : 정상적으로 로그인 한다.
    // cy.get('[data-cy="loginSubmit"]').click();
    // cy.url().should("eq", Cypress.config("baseUrl") + "/");
  });
});
