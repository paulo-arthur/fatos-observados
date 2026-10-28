export const sanitizeNewStudent = (name, number, email) => {

    let res = {
        isValid: false,
        status: "The fields didn't pass the validation.",
        name: "",
        number: "",
        email: ""
    }

    // 1. Validação de existência de campos
  if (!name || !number || !email) {
    res.status = "The name, number and email fields are required.";
    return res;
  }

  // 2. Sanitização (remover espaços extras e padronizar)
  name = name.trim();
  number = String(number).trim();
  email = email.trim().toLowerCase();

  // 3. Validação de conteúdo vazio pós-trim
  if (!name || !number || !email) {
    res.status = "The fields cannot have only blank spaces.";
    return res;
  }

  // 4. Validação basica de formato (Email)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status = "Invalid email format.";
    return res;
  }

  res.isValid = true;
  res.status = "The input is valid."

  res.name = name;
  res.number = number;
  res.email = email;

  return res;

  /*} catch (error) {
    // 7. Mapeamento de erros conhecidos do PostgreSQL
    // Código "23505" = unique_violation (E-mail ou Número duplicado)
    if (error.code === "23505") {
      if (error.constraint?.includes("email")) {
        return res.status(409).json({ erro: "Este e-mail já está cadastrado." });
      }
      if (error.constraint?.includes("number")) {
        return res.status(409).json({ erro: "Este número de aluno já está em uso." });
      }
      return res.status(409).json({ erro: "Registro duplicado detectado." });
    }

    console.error("Erro ao criar aluno:", error);
    return res.status(500).json({ erro: "Erro interno ao salvar o aluno." });
  }*/
} 