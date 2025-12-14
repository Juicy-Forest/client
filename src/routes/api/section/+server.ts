import { json } from "@sveltejs/kit";

export async function POST({ request, cookies, fetch }) {
  try {
    const token = cookies.get("auth-token");

    console.log(token);
    if (!token) {
      return json({ error: "No auth token" }, { status: 401 });
    }

    const body = await request.json();
    console.log(body);
    const backendRes = await fetch(
      `http://localhost:3030/section/${body.gardenId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": token,
        },
        body: JSON.stringify({ ...body }),
      }
    );

    const data = await backendRes.json();
    console.log("RESPONSE:", data);
    return json(data, { status: 200 });
  } catch (err) {
    console.log(err);
    return json({ status: 500, error: err });
  }
}
