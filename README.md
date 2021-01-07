## API

## resources

- [standardjs](https://standardjs.com)
- [lint-staged](https://www.npmjs.com/package/lint-staged)

- create API boilerplate

  - [ ] `npm install express-generator -g`
  - [ ] `express api_name --no-view --git`

- initialize eslint

  - [ ] `cd your-project-name && yarn add -D eslint && npx eslint --init`
    - **To check syntax, find problems, and enforce code style**
    - **Commonjs (import/export)**
    - **none**
    - Does your project use TypeScript? **No**
    - **Node**
    - Use a popular style guide: **Standard**
    - **Javascript**
    - Would you like to install them now with npm? **No**

- [ ] install eslint dependencies

  - with yarn: `yarn add -D eslint-config-standard eslint eslint-plugin-import eslint-plugin-node eslint-plugin-promise eslint-plugin-standard`
  - with npm: `npm i --save-dev eslint-config-standard@latest eslint@^7.12.1 eslint-plugin-import@^2.22.1 eslint-plugin-node@^11.1.0 eslint-plugin-promise@^4.2.1`

- [ ] install prettier

  - with yarn: `yarn add -D prettier eslint-config-prettier`
  - with npm: `npm i --save-dev prettier eslint-config-prettier`

- configure prettier

  - [ ] create **.prettierignore** file:
    ```
    node_modules/
    .git/
    build/
    dist/
    public/
    ```
  - [ ] create **.prettierrc.json** file:
    ```json
    {
      "semi": false,
      "singleQuote": true,
      "trailingComma": "none"
    }
    ```

- configure eslint

  - [ ] create **.eslintignore** file:
    ```
    node_modules/
    .git/
    build/
    dist/
    public/
    ```
  - [ ] create **.eslintrc.js** file:

    ```js
    module.exports = {
      env: {
        commonjs: true,
        es2021: true,
        node: true
      },
      extends: ['standard', 'prettier'],
      parserOptions: {
        ecmaVersion: 12
      },
      rules: {}
    }
    ```

  - [ ] install **lint-staged**: `npx mrm lint-staged`
  - [ ] configure routes
  - [ ] responses (response-formatter)
  - [ ] request validations (express-valiation, joi, etc)
  - [ ] configure mongo

  ## endpoints

  - [ ] Login
    - [ ] jwt
    - [ ] refresh token if expired
  - [ ] Reset password
  - [ ] Users
    - [ ] create
  - [ ] Blogs
    - [ ] create
    - [ ] list
    - [ ] update
    - [ ] delete
