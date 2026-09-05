## 🔗 Link

- **Web** : https://yun-sandy.vercel.app/
- **상세 내용(Notion)** : https://yunsusu.notion.site/39d105638024802b9c6acfd9bd138335


### **🌟 프로젝트 개요**

**React.js와 Supabase**를 활용해 AI와 함께 만든 간단한 게시판 웹을 Cypress를 사용해 자동화 테스트 적용했습니다.

로그인, 회원가입, 게시글 작성 등 주요 웹 기능의 API 통신과 화면 렌더링을 테스트하였으며, **BDD(Behavior-Driven Development)** 방식으로 테스트를 설계 및 구현하였습니다.

## 📋 테스트 범위

- 로그인
- 회원가입
- 로그아웃
- 게시글 작성
- 게시글 수정
- 게시글 삭제
- 댓글 작성
- 댓글 삭제
- 페이지 이동(URL 검증)
- API 응답 상태 코드 검증
- 화면 렌더링 검증

## **📝 자동화 테스트 적용**

**✅ 자동화 결과**


https://github.com/user-attachments/assets/451cee4d-fbf4-4d11-9cec-222d1af246cb


**✅ Cypress의 Commands 기능을 활용해 로그인이 필요한 화면에서 로그인 후 진행이 가능하도록 구현.**

```jsx
Cypress.Commands.add("login", (email, password) => {
  cy.intercept("POST", "**/auth/v1/token**").as("login");

  cy.visit("/login");
  cy.get('[data-cy="loginEmail"]').type(email);
  cy.get('[data-cy="loginPass"]').type(password);
  cy.get('[data-cy="loginSubmit"]').click();

  cy.wait("@login");
  cy.url().should("eq", Cypress.config("baseUrl") + "/");
});
```

**✅ intercept 기능을 활용해 통신이 정상적으로 되는지 테스트 구현.**

```jsx
it("이미 있는 이메일로 회원가입 시도할 경우", () => {
  cy.intercept("post", "**/signup").as("sign");

  // Given : 회원가입 페이지에 접속
  cy.visit("/signup");
  // When : 닉네임, 중복된 이메일, 비밀번호, 비밀번호 확인 을 입력 후 회원가입 버튼을 눌러
  cy.get('[data-cy="nickname"]').as("nickname");
  cy.get("@nickname").type("name");
  // ...
  // Then : 정상적으로 회원가입을 한다.
  cy.get('[data-cy="submit"]').click();

  cy.wait("@sign").its("response.statusCode").should("be.oneOf", [404, 422]);

  cy.contains("User already registered");
});
```

## 💡 테스트 작성 시 고려한 점

- Commands를 활용하여 로그인 로직을 공통화
- intercept를 활용해 API 응답 검증
- data-cy 속성을 사용하여 안정적인 Element 선택
- 하나의 테스트는 하나의 기능만 검증하도록 구성
- Given-When-Then 패턴으로 가독성 향상

## 📚 배운 점

- 반복되는 테스트를 Commands로 공통화하는 방법을 익혔습니다.
- API와 UI를 함께 검증하여 기능의 신뢰성을 높이는 방법을 경험했습니다.
- QA로써 자동화를 어떤식으로 활용할 수 있을지 고민해볼 수 있었습니다.
