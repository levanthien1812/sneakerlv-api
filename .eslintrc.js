module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        "prettier/prettier": "off",
        "arrow-body-style": "off",
        "spaced-comment": "off",
        "no-console": "off",
        "consistent-return": "off",
        "func-names": "off",
        "object-shorthand": "off",
        "no-process-exit": "off",
        "no-param-reassign": "off",
        "no-return-await": "off",
        "no-underscore-dangle": "off",
        "class-methods-use-this": "off",
        "prefer-object-spread": "off",
        "prefer-destructuring": ["error", {
            "object": true,
            "array": false
        }],
        "no-unused-vars": ["error", {
            "argsIgnorePattern": "req|res|next|val|err"
        }],
        "parserOptions": {
            "sourceType": "module"
        }
    }
}
