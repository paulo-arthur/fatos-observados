import assert from "node:assert/strict";
import { test } from "node:test";
import jwt from "jsonwebtoken";
import { assertJwtSecret, signLoginToken } from "../src/lib/jwt.js";

test("falha claramente quando JWT_SECRET está ausente", () => {
  const previous = process.env.JWT_SECRET;
  delete process.env.JWT_SECRET;
  try {
    assert.throws(() => assertJwtSecret(), /JWT_SECRET não configurado/);
  } finally {
    if (previous === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previous;
  }
});

test("assina HS256 por 7 dias com apenas sub e perfil como claims próprias", () => {
  const previous = process.env.JWT_SECRET;
  const secret = "segredo-exclusivo-de-teste-com-varios-caracteres";
  process.env.JWT_SECRET = secret;
  try {
    const token = signLoginToken({ id: "usuario-123", perfil: "CAPITAO" });
    const decoded = jwt.verify(token, secret, { algorithms: ["HS256"] });
    assert.equal(typeof decoded, "object");
    if (typeof decoded === "string") throw new Error("Payload inesperado");
    assert.deepEqual(Object.keys(decoded).sort(), ["exp", "iat", "perfil", "sub"]);
    assert.equal(decoded.sub, "usuario-123");
    assert.equal(decoded.perfil, "CAPITAO");
    assert.equal(decoded.exp! - decoded.iat!, 7 * 24 * 60 * 60);
    const complete = jwt.decode(token, { complete: true });
    assert.equal(complete?.header.alg, "HS256");
  } finally {
    if (previous === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previous;
  }
});
