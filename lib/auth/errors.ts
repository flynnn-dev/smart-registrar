type AuthLikeError = {
  code?: string | null;
  message?: string | null;
} | null;

function includesAny(value: string, snippets: string[]) {
  return snippets.some((snippet) => value.includes(snippet));
}

export function getAuthErrorMessage(error: AuthLikeError): string {
  const code = error?.code?.toLowerCase() ?? "";
  const message = error?.message?.toLowerCase() ?? "";

  if (
    code === "invalid_credentials" ||
    includesAny(message, ["invalid login", "invalid credentials"])
  ) {
    return "Email or password is incorrect.";
  }

  if (code === "email_not_confirmed" || message.includes("email not confirmed")) {
    return "Confirm your email before signing in.";
  }

  if (
    code === "user_already_exists" ||
    includesAny(message, ["already registered", "already exists"])
  ) {
    return "An account with this email already exists.";
  }

  if (code === "weak_password" || message.includes("password should be")) {
    return "Choose a stronger password with at least 8 characters.";
  }

  if (
    code === "over_email_send_rate_limit" ||
    includesAny(message, ["rate limit", "email rate"])
  ) {
    return "Please wait a moment before requesting another email.";
  }

  if (
    includesAny(message, [
      "profiles_student_id",
      "duplicate key",
      "unique constraint",
    ])
  ) {
    return "This student ID is already registered.";
  }

  if (includesAny(message, ["database error saving new user"])) {
    return "We could not create your account. Check your details and try again.";
  }

  if (code === "same_password") {
    return "Choose a password that is different from your current one.";
  }

  if (
    code === "42501" ||
    code === "42p17" ||
    includesAny(message, ["permission denied", "row-level security"])
  ) {
    return "You do not have permission to update this profile.";
  }

  return "Something went wrong. Please try again.";
}
