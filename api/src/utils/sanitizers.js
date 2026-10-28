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
}

export const sanitizeNewFO = (authorId, targetId, description) => {
    let res = {
        isValid: false,
        status: "The fields didn't pass the validation.",
        authorId: null,
        targetId: null,
        description: ""
    };

    // 1. Check existence of fields
    if (!authorId || !targetId || !description) {
        res.status = "The authorId, targetId, and description fields are required.";
        return res;
    }

    // 2. Type validation and sanitization
    const parsedAuthorId = Number(authorId);
    const parsedTargetId = Number(targetId);
    description = String(description).trim();

    if (isNaN(parsedAuthorId) || parsedAuthorId <= 0 || isNaN(parsedTargetId) || parsedTargetId <= 0) {
        res.status = "The authorId and targetId must be valid positive numbers.";
        return res;
    }

    // 3. Check for empty description after trim
    if (!description) {
        res.status = "The description cannot have only blank spaces.";
        return res;
    }

    res.isValid = true;
    res.status = "The input is valid.";
    res.authorId = parsedAuthorId;
    res.targetId = parsedTargetId;
    res.description = description;

    return res;
};