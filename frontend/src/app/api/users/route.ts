import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {
    // Send credentials to Django backend
    const djangoRes = await fetch(`${process.env.DJANGO_API_URL}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!djangoRes.ok) {
      const error = await djangoRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: error.detail || "Invalid credentials" },
        { status: 401 }
      );
    }

    // Expecting Django to return { access: "JWT...", refresh: "JWT..." }
    const { access, refresh } = await djangoRes.json();

    // Create response
    const res = NextResponse.json({ success: true });

    // Store access token in HttpOnly cookie
    res.cookies.set("auth_token", access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60, // 1 hour (adjust based on Django's token lifetime)
    });

    // Optionally: store refresh token (if Django uses refresh tokens)
    if (refresh) {
      res.cookies.set("refresh_token", refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
