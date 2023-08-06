module.exports = [
  {
    id: "provider", // route id
    url: "/providers", // url in express format
    method: "GET", // HTTP method
    variants: [
      {
        id: "success", // variant id
        type: "json", // variant handler id
        options: {
          status: 200, // status to send
          body: [
            {
              provider: "provider 1",
              pairs: [
                { from: "bitcoin", to: "ethereum", tradeMethod: "float" },
                { from: "bitcoin", to: "ethereum", tradeMethod: "fixed" },
                { from: "bitcoin", to: "dogecoin", tradeMethod: "float" },
                { from: "bitcoin", to: "dogecoin", tradeMethod: "fixed" },
                { from: "ethereum", to: "bitcoin", tradeMethod: "float" },
                { from: "ethereum", to: "bitcoin", tradeMethod: "fixed" },
              ],
            },
            {
              provider: "provider 2",
              pairs: [
                { from: "bitcoin", to: "ethereum", tradeMethod: "float" },
                { from: "bitcoin", to: "ethereum", tradeMethod: "fixed" },
                { from: "ethereum", to: "bitcoin", tradeMethod: "float" },
                { from: "ethereum", to: "bitcoin", tradeMethod: "fixed" },
              ],
            },
          ], // body to send
        },
      },
    ],
  },
];
