export const load = () => {
    // just testing, real data fetch when we have backend set up
    const inventory = [
        {type: "plant", name: "bell pepper plant", quantity: 1},
        {type: "seed", name: "tomato seed", quantity: 2},
        {type: "tool", name: "spade", quantity: 3},
        {type: "supply", name: "pesticide", quantity: 4}
    ]
    return { inventory }
}