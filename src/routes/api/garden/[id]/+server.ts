import { json } from "@sveltejs/kit";

export async function PUT({params, cookies, fetch, request}) {
    try {
        const gardenId = params.id
        const { updatedGarden } =  await request.json()
        const cookie = cookies.get("auth-token")
        if(!cookie) return json({status: 401, message: "User not logged in"})
        const response = await fetch(`http://localhost:3030/garden/${gardenId}`, {
            headers: {
                "X-authorization": cookie,
                "Content-Type": "application/json"
            },
            method: "PUT",
            body: JSON.stringify({ ...updatedGarden })
        })

        const parsedResponse = await response.json()

        if(!parsedResponse.error) {
            return json({status: 200, message: "Successfully updated gardendata", data: parsedResponse})
        } else {
            return json({status: parsedResponse.status, messsage: "Error updating garden"})
        }
    } catch (err) {
        console.log("ERROR:", err)
        return json({status: 500, message: err})
    }
}