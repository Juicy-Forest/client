import { json } from "@sveltejs/kit";

export async function DELETE({ params, fetch, cookies }) {
  try {
    const sectionIdTODelete: string = params.sectionId
    // console.log('SECITON ID TO DELETE:', sectionIdTODelete)
     const token = cookies.get("auth-token");

    // console.log(token);
    if (!token) {
      return json({ error: "No auth token" }, { status: 401 });
    }
    const deleteResponse = await fetch(
      `http://localhost:3030/section/${sectionIdTODelete}`, {
        method: "DELETE",
        headers: {
          "X-authorization": token
        }
      }
    );
    const parsedResponse = await deleteResponse.json();
    // console.log('delres', parsedResponse)
    if (parsedResponse.error) {
      return json({ status: 500, error: parsedResponse.error });
    }
    // console.log('reaching here')
    return json({ status: 200, message: "Section removed." });
  } catch (err) {
    console.log(err);
    return json({ status: 500, error: err });
  }
}
