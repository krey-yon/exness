import redis from "./redisClient"

export const sendOrderBook = () => {
    redis.subscribe("btcusdtorderbook", (data) => {
        
    })
}