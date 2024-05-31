# A simple Crypto coins and exchanges dashboard project

# Description
This project is a [CoinCap.io](https://coincap.io/) clone that displays dynamic information about crypto coins and exchanges.
The project backend fetches data from the [CoinCap REST and WebSockets API](https://docs.coincap.io/).
The technology stack is:
    - NextJS 14 with app router for backend and server side rendering,
    - React Bootstrap and Bootstrap for frontend components,
    - React [Recharts](https://recharts.org/) for displaying line charts for crypto price data,
    - [Tanstack React Table](https://tanstack.com/table/latest) for displaying loaded data,
    - WebSockets for displaying dynamic coin price data in real time,
    - [SWR](https://swr.vercel.app/) for fetching data in client side components at regular intervals,
    - [node-cache](https://www.npmjs.com/package/node-cache) for custom server side caching.

## Caching
Since the CoinCap REST API has endpoints with offset and limit, and our client side components like Tanstack React Table require the full data to work properly, the data from these endpoints needs to be fetched in a single go. For this purpose this project creates and exposes 2 API endpoints in the folder /src/app/api/ that fetch data in a do/while loop until all of it is obtained, then is cached using node-cache in memory cache, and then return that data. The NextJS [fetch caching](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating) could not be used, as in edge cases it would return partially cached data.

## Data fetching
The project uses different fetching techniques.
The main page contains the coins list and websocket for dynamic coin prices. It gets its initial data from a server side component and uses it to seed a client side component that uses the useSWR hook. The client side component looks at the timestamp on the data and decides if it is stale or not. This is because the inital data can be displayed when the user navigates client side with cached data using the [router cache](https://nextjs.org/docs/app/building-your-application/caching#router-cache). The data is fetched from the NextJS API, as the data uses offset and limit. A websocket fetches data for the displayed coins when set.
The exchanges page is a client side component that caches the data client side using the useSWRConfig cache. On page navigation to that component, it determines if it should immediately update the data.
The data in these components is otherwise fetched every 60 seconds.
A chart is displayed for each coin that has a websocket that displays the current price. It also uses SWR to update the chart data at a regular interval.
On the coin page, the chart data can be fetched for a specific interval, and that changes the update interval and the cache interval.

## Getting Started

1. Clone or download the repo.

2. Open the repo folder with VS Code and open a new terminal.

3. Type 'npm install' in terminal and wait for it to finish.

4. Open NPM SCRIPTS and select dev, or type in terminal 'npm run dev'.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This project is deployed to Vercel on [this URL.](https://websockets-crypto.vercel.app/)
