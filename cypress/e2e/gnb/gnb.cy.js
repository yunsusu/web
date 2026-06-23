// ============================================================
// GNB (Global Navigation Bar) E2E 테스트
// ============================================================
//
// [테스트 구조]
//   describe("비로그인")  → 로그인 없이 메인페이지 접속 후 GNB 버튼 동작 확인
//   describe("로그인")    → beforeEach에서 로그인 후 GNB 버튼 동작 확인
//
// [it 단위 기준]
//   버튼 하나 = it 하나.
//   이렇게 나눠야 어떤 버튼이 고장났는지 테스트 결과에서 바로 보임.
//
// [data-cy 속성 목록] — Navbar.js에 추가된 속성들
//   data-cy="gnb-logo"         : 왼쪽 상단 'Board.' 로고 (항상 표시)
//   data-cy="gnb-board"        : '게시판' 링크 (항상 표시)
//   data-cy="gnb-write"        : '글쓰기' 링크 (로그인 상태에서만 표시)
//   data-cy="gnb-login"        : '로그인' 버튼 (비로그인 상태에서만 표시)
//   data-cy="gnb-signup"       : '회원가입' 버튼 (비로그인 상태에서만 표시)
//   data-cy="gnb-user-button"  : 유저 이름/아바타 버튼 — 클릭하면 드롭다운 열림 (로그인 상태에서만 표시)
//   data-cy="gnb-profile"      : 드롭다운 안 '내 정보' 링크
//   data-cy="gnb-logout"       : 드롭다운 안 '로그아웃' 버튼
//
// [커스텀 커맨드]
//   cy.login() → cypress/support/commands.js에 정의됨
//                로그인 페이지에서 test@email.com / 1q2w3e 로 로그인 후 메인페이지까지 이동
// ============================================================

describe("gnb 비로그인 테스트", () => {
  beforeEach(() => {
    // Given : 로그인 없이 메인페이지에 접속
    cy.visit("/");
  });

  it("로고 클릭시 메인페이지로 이동", () => {
    // When : 로고를 클릭해
    cy.get('[data-cy="gnb-logo"]').click();
    // Then : 메인페이지(/)에 머문다
    cy.url().should("eq", Cypress.config("baseUrl") + "/");
  });

  it("게시판 클릭시 메인페이지로 이동", () => {
    // When : 게시판 링크를 클릭해
    cy.get('[data-cy="gnb-board"]').click();
    // Then : 메인페이지(/)에 머문다
    cy.url().should("eq", Cypress.config("baseUrl") + "/");
  });

  it("로그인 버튼 클릭시 로그인 페이지로 이동", () => {
    // When : 로그인 버튼을 클릭해
    cy.get('[data-cy="gnb-login"]').click();
    // Then : 로그인 페이지(/login)로 이동한다
    cy.url().should("include", "/login");
  });

  it("회원가입 버튼 클릭시 회원가입 페이지로 이동", () => {
    // When : 회원가입 버튼을 클릭해
    cy.get('[data-cy="gnb-signup"]').click();
    // Then : 회원가입 페이지(/signup)로 이동한다
    cy.url().should("include", "/signup");
  });

  it("비로그인 상태에서 글쓰기 링크는 보이지 않아야 한다", () => {
    // Then : 글쓰기 링크가 GNB에 존재하지 않아야 한다
    cy.get('[data-cy="gnb-write"]').should("not.exist");
  });
});

describe("gnb 로그인 테스트", () => {
  beforeEach(() => {
    // Given : 로그인 상태로 메인페이지에 접속
    cy.login("test@email.com", "1q2w3e");
  });

  it("로고 클릭시 메인페이지로 이동", () => {
    // When : 로고를 클릭해
    cy.get('[data-cy="gnb-logo"]').click();
    // Then : 메인페이지(/)에 머문다
    cy.url().should("eq", Cypress.config("baseUrl") + "/");
  });

  it("게시판 클릭시 메인페이지로 이동", () => {
    // When : 게시판 링크를 클릭해
    cy.get('[data-cy="gnb-board"]').click();
    // Then : 메인페이지(/)에 머문다
    cy.url().should("eq", Cypress.config("baseUrl") + "/");
  });

  it("글쓰기 클릭시 글쓰기 페이지로 이동", () => {
    // When : 글쓰기 링크를 클릭해
    cy.get('[data-cy="gnb-write"]').click();
    // Then : 글쓰기 페이지(/write)로 이동한다
    cy.url().should("include", "/write");
  });

  it("유저 버튼 클릭시 드롭다운이 열린다", () => {
    // When : 유저 버튼을 클릭해
    cy.get('[data-cy="gnb-user-button"]').click();
    // Then : 내 정보, 로그아웃 드롭다운이 보인다
    cy.get('[data-cy="gnb-profile"]').should("be.visible");
    cy.get('[data-cy="gnb-logout"]').should("be.visible");
  });

  it("드롭다운 내 정보 클릭시 프로필 페이지로 이동", () => {
    // When : 유저 버튼 클릭 후 내 정보를 클릭해
    cy.get('[data-cy="gnb-user-button"]').click();
    cy.get('[data-cy="gnb-profile"]').click();
    // Then : 프로필 페이지(/profile)로 이동한다
    cy.url().should("include", "/profile");
  });

  it("로그아웃 클릭시 로그인 페이지로 이동", () => {
    // When : 유저 버튼 클릭 후 로그아웃을 클릭해
    cy.get('[data-cy="gnb-user-button"]').click();
    cy.get('[data-cy="gnb-logout"]').click();
    // Then : 로그인 페이지(/login)로 이동한다
    cy.url().should("include", "/login");
  });
});
