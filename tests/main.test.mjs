import assert from "node:assert/strict";

import {
  getNextCarouselIndex,
  getValidationMessage,
  getVisibleConditionalFields,
  maskPhone,
} from "../src/scripts/main.mjs";

const tests = [
  {
    name: "maskPhone formats a complete mobile number",
    run() {
      assert.equal(maskPhone("11987654321"), "(11) 98765-4321");
    },
  },
  {
    name: "maskPhone keeps partial values readable while typing",
    run() {
      assert.equal(maskPhone("11987"), "(11) 987");
    },
  },
  {
    name: "getValidationMessage returns required message first",
    run() {
      assert.equal(
        getValidationMessage(
          {
            valueMissing: true,
            typeMismatch: false,
            tooShort: false,
          },
          3
        ),
        "Este campo é obrigatório."
      );
    },
  },
  {
    name: "getValidationMessage returns minimum length feedback",
    run() {
      assert.equal(
        getValidationMessage(
          {
            valueMissing: false,
            typeMismatch: false,
            tooShort: true,
          },
          20
        ),
        "Preencha pelo menos 20 caracteres."
      );
    },
  },
  {
    name: "getNextCarouselIndex loops through the testimonial list",
    run() {
      assert.equal(getNextCarouselIndex(0, -1, 3), 2);
      assert.equal(getNextCarouselIndex(2, 1, 3), 0);
    },
  },
  {
    name: "getVisibleConditionalFields exposes only the matching helper field",
    run() {
      assert.deepEqual(getVisibleConditionalFields("captacao"), ["captacao"]);
      assert.deepEqual(getVisibleConditionalFields("reposicionamento"), ["reposicionamento"]);
      assert.deepEqual(getVisibleConditionalFields(""), []);
    },
  },
];

let passed = 0;

for (const testCase of tests) {
  try {
    testCase.run();
    passed += 1;
    console.log(`PASS ${testCase.name}`);
  } catch (error) {
    console.error(`FAIL ${testCase.name}`);
    throw error;
  }
}

console.log(`\n${passed}/${tests.length} testes passaram.`);
